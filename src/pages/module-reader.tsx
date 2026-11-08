import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, isUnreachable, messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { forgetQueued, queueProgress } from "@/lib/progress-queue";
import { anakDari, gerakanDilarang, gunakanAnimasi } from "@/lib/motion-lazy";
import { readPack, type StoredPack } from "@/lib/idb";
import { Link, useRouter } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { LessonDetail, ModuleDetailPayload, QuizStartPayload } from "@/lib/types";
import { AdSlot } from "@/components/ad-slot";
import { AsyncBlock } from "@/components/async-block";
import { LessonBody } from "@/components/lesson-body";
import { PackButton } from "@/components/pack-button";
import { QuizRunner } from "@/components/quiz-runner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, MessagesSquare, WifiOff } from "lucide-react";

interface Papan {
  judul: string;
  ringkasan: string;
  menit: number;
  slug: string;
  offlineOk: boolean;
  lessons: LessonDetail[];
  bank: { id: string; title: string; time_limit_seconds: number; pass_score: number } | null;
  threads: { id: string; title: string; answer_count: number; accepted_post_id: string | null }[];
  course: string;
  sumber: "daring" | "luring";
}

const dariPaket = (paket: StoredPack): Papan => ({
  judul: paket.module.title,
  ringkasan: paket.module.summary,
  menit: paket.module.minutes,
  slug: paket.slug,
  offlineOk: true,
  lessons: paket.lessons,
  bank: null,
  threads: paket.discussion.map((thread) => ({
    id: thread.thread_id,
    title: thread.title,
    answer_count: thread.posts.length,
    accepted_post_id: thread.posts.find((post) => post.accepted)?.id ?? null,
  })),
  course: paket.module.course?.title ?? "",
  sumber: "luring",
});

/**
 * Titik percik untuk momen modul selesai. Elemen titik harus ada di DOM sebelum helper
 * `percik` bekerja, dan saat gerakan dilarang titik-titik itu tidak pernah digambar —
 * helper itu sendiri berhenti tanpa mengubah nilai akhir, jadi titik statis akan tertinggal.
 * Diulang dengan `key` baru tiap kali momen terjadi, supaya efeknya jalan dari awal.
 */
function Percik() {
  const wadah = gunakanAnimasi<HTMLSpanElement>([], (motion, root) => {
    motion.percik(anakDari(root, "[data-gerak='titik']"), 54);
  });
  if (gerakanDilarang()) return null;
  return (
    <span
      ref={wadah}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2"
    >
      {Array.from({ length: 10 }, (_, indeks) => (
        <i key={indeks} data-gerak="titik" className="size-1.5 shrink-0 rounded-full bg-blush" />
      ))}
    </span>
  );
}

export function ModuleReaderPage({ slug }: { slug: string }) {
  const { online, user, refresh } = useApp();
  const { query, navigate } = useRouter();
  const [paket, setPaket] = useState<StoredPack | null>(null);
  const [selesai, setSelesai] = useState<Record<string, boolean>>({});
  const [galat, setGalat] = useState("");
  const [ledak, setLedak] = useState(0);
  const state = useData(`module:${slug}`, () => apiGet<ModuleDetailPayload>(`/module/${slug}`), [slug]);

  useEffect(() => {
    let hidup = true;
    readPack(slug).then((isi) => hidup && setPaket(isi ?? null), () => hidup && setPaket(null));
    return () => {
      hidup = false;
    };
  }, [slug]);

  const papan: Papan | null = useMemo(() => {
    if (state.data) {
      const modul = state.data.module;
      return {
        judul: modul.title,
        ringkasan: modul.summary,
        menit: modul.minutes,
        slug: modul.slug,
        offlineOk: modul.offline_ok,
        lessons: modul.lessons,
        bank: modul.bank,
        threads: modul.threads.map((t) => ({
          id: t.id,
          title: t.title,
          answer_count: t.answer_count,
          accepted_post_id: t.accepted_post_id,
        })),
        course: modul.course?.title ?? "",
        sumber: "daring",
      };
    }
    return paket ? dariPaket(paket) : null;
  }, [state.data, paket]);

  useEffect(() => {
    if (!papan) return;
    const peta: Record<string, boolean> = {};
    papan.lessons.forEach((les) => (peta[les.id] = les.done));
    setSelesai(peta);
  }, [papan]);

  const terpilih = query.get("pelajaran");
  const indeks = Math.max(0, papan?.lessons.findIndex((les) => les.id === terpilih) ?? 0);
  const pelajaran = papan?.lessons[indeks] ?? null;

  const buka = useCallback(
    (id: string) => navigate(`/modul/${slug}?pelajaran=${encodeURIComponent(id)}`, { replace: true }),
    [navigate, slug],
  );

  const tandai = async (id: string) => {
    const berikutnya = !selesai[id];
    const petaBaru = { ...selesai, [id]: berikutnya };
    const jumlahSelesai = papan ? papan.lessons.filter((les) => petaBaru[les.id]).length : 0;
    const paripurna = Boolean(papan) && berikutnya && jumlahSelesai === (papan?.lessons.length ?? 0);
    setSelesai(petaBaru);
    setGalat("");
    forgetQueued(id);

    if (!online) {
      queueProgress(id, berikutnya);
      if (paripurna) setLedak((n) => n + 1);
      return;
    }
    try {
      await apiPost("/progress", { lesson_id: id, done: berikutnya });
      await refresh();
      if (paripurna) setLedak((n) => n + 1);
    } catch (error) {
      if (isUnreachable(error)) {
        queueProgress(id, berikutnya);
        if (paripurna) setLedak((n) => n + 1);
        return;
      }
      setSelesai((sebelumnya) => ({ ...sebelumnya, [id]: !berikutnya }));
      setGalat(messageFor(error));
    }
  };

  if (!papan && state.loading) {
    return <p className="text-sm text-muted-foreground">Memuat modul…</p>;
  }

  if (!papan) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-6">
          <p className="text-sm">{messageFor(state.error) || "Modul ini belum tersimpan di perangkat Anda."}</p>
          <Button asChild size="sm" variant="outline">
            <Link to="/materi">Kembali ke daftar materi</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const terjawab = papan.lessons.filter((les) => selesai[les.id]).length;
  const persen = Math.round((terjawab / Math.max(1, papan.lessons.length)) * 100);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {papan.course && <span>{papan.course}</span>}
          <span>·</span>
          <span>{papan.lessons.length} pelajaran</span>
          <span>·</span>
          <span>{papan.menit} menit</span>
          {papan.sumber === "luring" && (
            <Badge variant="secondary" className="gap-1.5">
              <WifiOff className="size-3" /> dibaca luring
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{papan.judul}</h1>
        <p className="text-sm text-muted-foreground">{papan.ringkasan}</p>
        <Progress value={persen} />
        <p className="text-xs text-muted-foreground tabular-nums">
          {terjawab}/{papan.lessons.length} pelajaran selesai
        </p>
        <PackButton slug={papan.slug} offlineOk={papan.offlineOk} />
      </header>

      <div className="grid gap-5 md:grid-cols-[15rem_1fr]">
        <nav aria-label="Daftar pelajaran" className="flex flex-col gap-1 md:sticky md:top-6 md:self-start">
          {papan.lessons.map((les, i) => (
            <button
              key={les.id}
              type="button"
              onClick={() => buka(les.id)}
              aria-current={i === indeks ? "true" : undefined}
              className={
                i === indeks
                  ? "flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-left text-sm font-medium text-primary"
                  : "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              }
            >
              <span
                aria-hidden
                className={
                  selesai[les.id]
                    ? "grid size-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                    : "size-4 shrink-0 rounded-full border"
                }
              >
                {selesai[les.id] && <Check className="size-3" />}
              </span>
              <span className="min-w-0 truncate">{les.title}</span>
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col gap-4">
          {pelajaran ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{pelajaran.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <LessonBody blocks={pelajaran.body?.blocks ?? []} />
                {galat && (
                  <p role="alert" className="text-sm text-destructive">
                    {galat}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                  <span className="relative inline-flex">
                    <Button size="sm" variant={selesai[pelajaran.id] ? "secondary" : "default"} onClick={() => void tandai(pelajaran.id)}>
                      <Check /> {selesai[pelajaran.id] ? "Selesai dibaca" : "Tandai selesai"}
                    </Button>
                    {ledak > 0 && <Percik key={ledak} />}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    disabled={indeks === 0}
                    onClick={() => papan.lessons[indeks - 1] && buka(papan.lessons[indeks - 1].id)}
                  >
                    <ChevronLeft /> Sebelumnya
                  </Button>
                  <Button
                    size="sm"
                    disabled={indeks + 1 >= papan.lessons.length}
                    onClick={() => papan.lessons[indeks + 1] && buka(papan.lessons[indeks + 1].id)}
                  >
                    Berikutnya <ChevronRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <AdSlot slot="module-footer" />

          {papan.bank && user ? (
            <QuizRunner
              judul={`Kuis: ${papan.bank.title}`}
              keterangan={`${papan.bank.time_limit_seconds} detik per soal, nilai lulus ${papan.bank.pass_score}. Kuis dinilai di server, jadi perlu koneksi.`}
              tombol="Mulai kuis modul"
              mulai={() => apiPost<QuizStartPayload>("/quiz/start", { bank_id: papan.bank?.id })}
              onDone={refresh}
            />
          ) : papan.bank ? (
            <Card>
              <CardContent className="py-5 text-sm">
                Masuk dengan email Anda untuk mengerjakan kuis modul ini dan menambah XP.
              </CardContent>
            </Card>
          ) : null}

          {!online && papan.bank && (
            <p className="rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm text-blush">
              Kuis butuh koneksi karena soal, kunci jawaban, dan penilaian disimpan di server.
            </p>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessagesSquare className="size-4" /> Diskusi modul
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to={`/diskusi?modul=${encodeURIComponent(papan.slug)}`}>Buka kolom</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {papan.threads.length === 0 && <p className="text-muted-foreground">Belum ada pertanyaan untuk modul ini.</p>}
              {papan.threads.slice(0, 5).map((thread) => (
                <Link
                  key={thread.id}
                  to={`/diskusi/${thread.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-accent"
                >
                  <span className="min-w-0 truncate">{thread.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {thread.accepted_post_id ? "terjawab" : `${thread.answer_count} balasan`}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
