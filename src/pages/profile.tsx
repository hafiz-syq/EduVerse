import { apiGet } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { anakDari, gunakanAnimasi } from "@/lib/motion-lazy";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { ProfilePayload } from "@/lib/types";
import { rankProgress } from "@/components/rank-badge";
import { AsyncBlock } from "@/components/async-block";
import { AdSlot } from "@/components/ad-slot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Award, Download, Flame, MessagesSquare, Terminal, Trophy } from "lucide-react";

const JENIS_XP: Record<string, string> = {
  lesson_done: "Pelajaran selesai",
  module_done: "Modul selesai",
  quiz_pass: "Kuis lulus",
  quiz_top: "Kuis nilai tinggi",
  quiz_try: "Kuis dicoba",
  quiz_first_pass: "Lulus pertama",
  answer_post: "Menjawab diskusi",
  answer_accepted: "Jawaban ditandai kunci",
  tournament_entry: "Ikut tantangan",
  tournament_win: "Menang tantangan",
  tournament_place: "Peringkat tantangan",
  streak_day: "Seri harian",
  code_pass: "Latihan koding lulus",
};

const KUNCI_LABEL: Record<string, string> = {
  pemula: "Pemula",
  madya: "Madya",
  maha: "Maha",
  master: "Master",
};

function formatBytes(biaya: number) {
  if (!biaya) return "-";
  const mb = biaya / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(biaya / 1024)} KB`;
}

export function ProfilePage() {
  const { user, packs } = useApp();
  const state = useData("profile", () => apiGet<ProfilePayload>("/profile"), [user?.id ?? "anon"]);

  // Dipanggil sebelum gerbang `!user` supaya urutan hook tetap sama di dua cabang.
  // Angka XP dibaca dari teks yang sudah ter-render, jadi kalau chunk animasi gagal
  // dimuat yang tersisa selalu nilai asli — bukan nol atau angka basi.
  const wadah = gunakanAnimasi<HTMLDivElement>([state.data], (motion, root) => {
    const xp = anakDari(root, "[data-gerak='xp']")[0];
    if (xp) motion.hitungNaik(xp, Number(xp.textContent));
    motion.munculkanKisi(anakDari(root, "[data-gerak='kisi'] > *"), 4, 45);
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-6 text-sm">
          <p>Profil berisi XP, lencana, dan paket luring Anda. Silakan masuk dengan email.</p>
          <Link to="/masuk" className="font-medium text-primary underline">
            Masuk
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={wadah} className="flex flex-col gap-6">
      <AsyncBlock state={state} rows={3}>
        {(isi) => {
          const naik = rankProgress(isi.user.xp, isi.ladder);
          return (
            <>
              <Card>
                <CardContent className="flex flex-wrap items-center gap-4 py-5">
                  <Avatar className="size-16">
                    <AvatarImage src={isi.user.picture} alt="" />
                    <AvatarFallback>{(isi.user.name || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-40 flex-1">
                    <h1 className="text-xl font-semibold tracking-tight">{isi.user.name || "Pembelajar"}</h1>
                    <p className="text-sm text-muted-foreground">{isi.user.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{isi.user.rank_title}</Badge>
                      <Badge variant="outline">
                        <span data-gerak="xp" className="tabular-nums">
                          {isi.user.xp}
                        </span>{" "}
                        XP
                      </Badge>
                      {isi.user.role === "admin" && <Badge variant="default">admin</Badge>}
                    </div>
                  </div>
                  <div className="w-full sm:w-64">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{naik.sekarang.title}</span>
                      <span>{naik.berikutnya ? `${naik.berikutnya.title} · kurang ${naik.kurang} XP` : "peringkat tertinggi"}</span>
                    </div>
                    <Progress value={naik.persen} />
                  </div>
                </CardContent>
              </Card>

              <div data-gerak="kisi" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Seri belajar", nilai: `${isi.user.streak} hari`, icon: Flame, catatan: `terpanjang ${isi.user.longest_streak} hari` },
                  { label: "Lencana", nilai: `${isi.badges.length}`, icon: Award, catatan: "capaian khusus" },
                  { label: "Paket luring", nilai: `${packs.length}`, icon: Download, catatan: "tersimpan di perangkat" },
                  { label: "Latihan koding", nilai: `${isi.lab.passed}/${isi.lab.total}`, icon: Terminal, catatan: `${isi.lab.attempts} kali diselesaikan` },
                ].map((kiri) => (
                  <Card key={kiri.label}>
                    <CardContent className="flex flex-col gap-1 py-4">
                      <kiri.icon className="size-4 text-muted-foreground" />
                      <p className="text-lg font-semibold tabular-nums">{kiri.nilai}</p>
                      <p className="text-xs text-muted-foreground">{kiri.label} · {kiri.catatan}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Jalur peringkat</h2>
                <Card>
                  <CardContent className="flex flex-col gap-2 py-4">
                    {isi.ladder.map((tingkat) => {
                      const aktif = tingkat.rank_key === isi.user.rank_key;
                      const tercapai = isi.user.xp >= tingkat.threshold;
                      return (
                        <div key={tingkat.rank_key} className="flex items-center gap-3">
                          <span aria-hidden className="size-3 rounded-full" style={{ background: tingkat.color, opacity: tercapai ? 1 : 0.3 }} />
                          <span className={`flex-1 text-sm ${aktif ? "font-semibold" : tercapai ? "" : "text-muted-foreground"}`}>
                            {tingkat.title} · {tingkat.threshold} XP
                            {aktif && <span className="ml-2 text-xs text-primary">(posisi Anda)</span>}
                          </span>
                          {tingkat.next && <span className="text-xs text-muted-foreground">→ {tingkat.next}</span>}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">XP terbaru</h2>
                  <Card>
                    <CardContent className="flex flex-col py-2">
                      {isi.xp_recent.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-muted-foreground">Belum ada aktivitas XP.</p>
                      ) : (
                        isi.xp_recent.slice(0, 8).map((event, indeks) => (
                          <div key={`${event.at}-${indeks}`} className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2 text-sm last:border-0">
                            <span className="min-w-0 truncate">{JENIS_XP[event.kind] ?? event.kind}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">
                              +{event.amount} · {new Date(event.at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Separator />

                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Partisipasi diskusi</h2>
                  <Card>
                    <CardContent className="flex items-center gap-4 py-4 text-sm">
                      <MessagesSquare className="size-4 text-muted-foreground" />
                      <span>{isi.activity.threads} pertanyaan</span>
                      <span>{isi.activity.answers} jawaban</span>
                      <span className="text-success">{isi.activity.accepted} ditandai kunci</span>
                    </CardContent>
                  </Card>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <Trophy className="size-4" /> Kuis terakhir
                  </h2>
                  <Card>
                    <CardContent className="flex flex-col py-2">
                      {isi.attempts.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-muted-foreground">
                          Belum ada kuis.{" "}
                          <Link to="/kuis" className="text-primary underline">
                            Coba kuis modul
                          </Link>
                          .
                        </p>
                      ) : (
                        isi.attempts.slice(0, 8).map((baris) => (
                          <div key={baris.id} className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2 text-sm last:border-0">
                            <span className="text-xs text-muted-foreground">{new Date(baris.started_at).toLocaleDateString("id-ID")}</span>
                            <span className="flex items-center gap-2 tabular-nums">
                              <span className="font-semibold">{baris.score}</span>
                              <Badge variant={baris.status === "pass" ? "default" : baris.status === "late" ? "secondary" : "destructive"}>
                                {baris.status === "pass" ? "lulus" : baris.status === "late" ? "latihan" : "belum lulus"}
                              </Badge>
                            </span>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Progres kursus</h2>
                  <Card>
                    <CardContent className="flex flex-col gap-3 py-4">
                      {isi.course_progress.map((kursus) => (
                        <div key={kursus.slug} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="min-w-0 truncate">{kursus.title}</span>
                            <span className="tabular-nums text-muted-foreground">{kursus.percent}%</span>
                          </div>
                          <Progress value={kursus.percent} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {isi.downloads.length > 0 && (
                    <>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Unduhan paket</h2>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>
                            {isi.downloads.length} paket pernah Anda unduh · total {formatBytes(isi.downloads.reduce((total, item) => total + item.bytes, 0))}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1 py-0 text-xs text-muted-foreground">
                          {isi.downloads.slice(0, 4).map((item) => (
                            <span key={item.pack_hash} className="truncate">
                              {item.pack_hash} · {formatBytes(item.bytes)} · {new Date(item.created_at).toLocaleDateString("id-ID")}
                            </span>
                          ))}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </section>
              </div>

              {isi.badges.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Lencana</h2>
                  <div className="flex flex-wrap gap-2">
                    {isi.badges.map((lencana) => (
                      <Badge key={lencana} variant="outline" className="gap-1.5 py-1.5">
                        <Award className="size-3.5 text-blush" /> {lencana}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-xs text-muted-foreground">
                Peringkat Anda: {KUNCI_LABEL[isi.user.rank_key] ?? isi.user.rank_title}. XP bertambah dari pelajaran, kuis tepat waktu,
                dan jawaban diskusi yang ditandai kunci.
              </p>

              <AdSlot slot="in-feed" />
            </>
          );
        }}
      </AsyncBlock>
    </div>
  );
}
