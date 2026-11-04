import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiPost, messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import type { QuizFinishPayload, QuizStartPayload, ReviewRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface QuizRunnerProps {
  judul: string;
  keterangan: string;
  mulai: () => Promise<QuizStartPayload>;
  tombol?: string;
  onDone?: () => void;
}

const format = (ms: number) => {
  const detik = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(detik / 60)).padStart(2, "0")}:${String(detik % 60).padStart(2, "0")}`;
};

export function QuizRunner({ judul, keterangan, mulai, tombol = "Mulai kuis", onDone }: QuizRunnerProps) {
  const { online, user } = useApp();
  const [stage, setStage] = useState<"idle" | "running" | "graded">("idle");
  const [attempt, setAttempt] = useState<QuizStartPayload["attempt"] | null>(null);
  const [questions, setQuestions] = useState<QuizStartPayload["questions"]>([]);
  const [nomor, setNomor] = useState(0);
  const [pilihan, setPilihan] = useState<Record<string, number>>({});
  const [sisa, setSisa] = useState(0);
  const [hasil, setHasil] = useState<QuizFinishPayload | null>(null);
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const antrian = useRef<{ question_id: string; chosen: number }[]>([]);

  useEffect(() => {
    if (stage !== "running" || !attempt) return;
    const hitung = () => setSisa(Math.max(0, new Date(attempt.deadline_at).getTime() - Date.now()));
    hitung();
    const timer = window.setInterval(hitung, 1000);
    return () => window.clearInterval(timer);
  }, [stage, attempt]);

  const mulaiUji = useCallback(async () => {
    setGalat("");
    setSibuk(true);
    try {
      const payload = await mulai();
      setAttempt(payload.attempt);
      setSisa(Math.max(0, new Date(payload.attempt.deadline_at).getTime() - Date.now()));
      setQuestions(payload.questions);
      setPilihan({});
      setNomor(0);
      setHasil(null);
      antrian.current = [];
      setStage("running");
    } catch (error) {
      setGalat(messageFor(error));
    } finally {
      setSibuk(false);
    }
  }, [mulai]);

  const kumpulkan = useCallback(
    async (luring: boolean) => {
      if (!attempt || stage !== "running") return;
      setSibuk(true);
      try {
        const tertahan = antrian.current;
        const jawaban = [...Object.entries(pilihan).map(([question_id, chosen]) => ({ question_id, chosen })), ...tertahan.filter((a) => !pilihan[a.question_id])];
        const payload = await apiPost<QuizFinishPayload>("/quiz/finish", {
          attempt_id: attempt.id,
          answers: jawaban,
          offline: luring,
        });
        setHasil(payload);
        setStage("graded");
        antrian.current = [];
        onDone?.();
      } catch (error) {
        setGalat(messageFor(error));
      } finally {
        setSibuk(false);
      }
    },
    [attempt, pilihan, stage, onDone],
  );

  useEffect(() => {
    if (stage === "running" && sisa === 0) void kumpulkan(!online);
  }, [stage, sisa, kumpulkan, online]);

  const pilih = async (indeks: number) => {
    const pertanyaan = questions[nomor];
    if (!pertanyaan || !attempt) return;
    setPilihan((sebelumnya) => ({ ...sebelumnya, [pertanyaan.id]: indeks }));
    if (!online) {
      antrian.current = [...antrian.current.filter((a) => a.question_id !== pertanyaan.id), { question_id: pertanyaan.id, chosen: indeks }];
      return;
    }
    try {
      await apiPost("/quiz/answer", { attempt_id: attempt.id, question_id: pertanyaan.id, chosen: indeks });
    } catch (error) {
      setGalat(messageFor(error));
    }
  };

  const terjawab = useMemo(
    () => Object.keys(pilihan).filter((id) => pilihan[id] !== undefined).length,
    [pilihan],
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-6 text-sm">
          <p>{judul} menilai XP dan peringkat, jadi perlu masuk dengan email Anda.</p>
          <Button asChild size="sm">
            <a href="/masuk">Masuk dulu</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (stage === "graded" && hasil) {
    return <HasilKuis hasil={hasil} onUlang={mulaiUji} sibuk={sibuk} />;
  }

  if (stage !== "running") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{judul}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">{keterangan}</p>
          {galat && (
            <p role="alert" className="text-sm text-destructive">
              {galat}
            </p>
          )}
          <Button onClick={mulaiUji} disabled={sibuk}>
            {sibuk ? "Menyiapkan soal" : tombol}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pertanyaan = questions[nomor];
  const terakhir = nomor + 1 >= questions.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">
          Pertanyaan {nomor + 1} dari {questions.length}
        </CardTitle>
        <Badge variant={sisa < 30_000 ? "destructive" : "secondary"} className="gap-1.5 tabular-nums">
          <Timer className="size-3.5" /> {format(sisa)}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={((nomor + 1) / Math.max(1, questions.length)) * 100} />
        {!online && (
          <p className="rounded-lg bg-blush-soft px-3 py-2 text-sm text-blush">
            Mode luring: {antrian.current.length} jawaban tertahan di perangkat ini dan dikirim saat koneksi kembali.
          </p>
        )}
        <p className="text-lg leading-snug font-medium">{pertanyaan?.prompt}</p>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Pilihan jawaban">
          {(pertanyaan?.options ?? []).map((opsi, indeks) => {
            const terpilih = pilihan[pertanyaan.id] === indeks;
            return (
              <button
                key={indeks}
                type="button"
                role="radio"
                aria-checked={terpilih}
                onClick={() => void pilih(indeks)}
                className={
                  terpilih
                    ? "rounded-xl border-2 border-primary bg-primary-soft px-4 py-3 text-left text-sm font-medium"
                    : "rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:bg-accent"
                }
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + indeks)}</span>
                {opsi}
              </button>
            );
          })}
        </div>
        {galat && (
          <p role="alert" className="text-sm text-destructive">
            {galat}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" disabled={nomor === 0} onClick={() => setNomor((n) => Math.max(0, n - 1))}>
            Soal sebelumnya
          </Button>
          {terakhir ? (
            <Button size="sm" onClick={() => void kumpulkan(!online)} disabled={sibuk}>
              Kumpulkan jawaban
            </Button>
          ) : (
            <Button size="sm" onClick={() => setNomor((n) => Math.min(questions.length - 1, n + 1))} disabled={pilihan[pertanyaan.id] === undefined}>
              Soal berikutnya
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {terjawab}/{questions.length} terjawab
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function HasilKuis({ hasil, onUlang, sibuk }: { hasil: QuizFinishPayload; onUlang: () => void; sibuk: boolean }) {
  const lulus = hasil.attempt.status === "pass";
  const latihan = hasil.attempt.status === "late" || hasil.awarded?.practice;
  const skor = hasil.attempt.score;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skor {skor} · {hasil.attempt.correct}/{hasil.attempt.total} benar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant={lulus ? "default" : "secondary"}>{lulus ? "Lulus" : latihan ? "Latihan" : "Belum lulus"}</Badge>
            {hasil.awarded && hasil.awarded.xp > 0 && <Badge variant="outline">+{hasil.awarded.xp} XP</Badge>}
            {hasil.standing && (
              <Badge variant="outline">
                {hasil.standing.rank_title} · {hasil.standing.xp} XP
              </Badge>
            )}
            {hasil.placement && <Badge variant="outline">Peringkat {hasil.placement.place}</Badge>}
          </div>
          {latihan && (
            <p className="text-sm text-muted-foreground">
              Jawaban masuk setelah batas waktu, jadi dinilai sebagai latihan: XP dan papan peringkat tidak bertambah.
            </p>
          )}
          {!lulus && (
            <Button size="sm" onClick={onUlang} disabled={sibuk}>
              Coba lagi
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {hasil.review.map((baris, indeks) => (
          <ReviewCard key={baris.id} baris={baris} indeks={indeks} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ baris, indeks }: { baris: ReviewRow; indeks: number }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium">
          {indeks + 1}. {baris.prompt}
        </CardTitle>
        <Badge variant={baris.correct ? "default" : "destructive"} className="w-fit">
          {baris.correct ? "Benar" : "Salah"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 text-sm">
        {baris.options.map((opsi, i) => (
          <p
            key={i}
            className={
              i === baris.answer
                ? "rounded-md bg-success/10 px-2 py-1 text-success"
                : i === baris.chosen
                  ? "rounded-md bg-destructive/10 px-2 py-1 text-destructive"
                  : "px-2 py-1 text-muted-foreground"
            }
          >
            {String.fromCharCode(65 + i)}. {opsi}
          </p>
        ))}
        {baris.explanation && <p className="mt-2 text-xs text-muted-foreground">{baris.explanation}</p>}
      </CardContent>
    </Card>
  );
}
