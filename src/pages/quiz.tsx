import { useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { AttemptRow, Course, QuizStartPayload } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { QuizRunner } from "@/components/quiz-runner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Timer } from "lucide-react";

interface RiwayatPayload {
  attempts: AttemptRow[];
  best: number;
}

export function QuizPage() {
  const { user, online } = useApp();
  const [bankId, setBankId] = useState("");
  const daftar = useData("catalog:quiz", () => apiGet<Course[]>("/catalog"), []);

  const bank = (daftar.data ?? []).flatMap((kursus) =>
    kursus.modules
      .filter((modul) => modul.bank)
      .map((modul) => ({
        id: modul.bank!.id,
        judul: `${kursus.title} — ${modul.bank!.title}`,
        modul: modul.slug,
        detik: modul.bank!.time_limit_seconds,
        lulus: modul.bank!.pass_score,
      })),
  );

  const pilihan = bank.find((item) => item.id === bankId) ?? bank[0];
  const pilihanId = pilihan?.id ?? "";
  const riwayat = useData(`quiz:history:${pilihanId}`, () => (pilihanId ? apiGet<RiwayatPayload>(`/quiz/history/${pilihanId}`) : Promise.resolve({ attempts: [], best: 0 })), [pilihanId]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Kuis modul</h1>
        <p className="text-sm text-muted-foreground">
          Satu paket soal per modul dengan batas waktu per pertanyaan. Penilaian dikerjakan di server supaya
          hasilnya adil; jawaban yang telat dihitung sebagai latihan tanpa XP.
        </p>
      </header>

      {!online && (
        <p className="rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm text-blush">
          Anda sedang luring. Kuis butuh koneksi untuk mengambil soal dan menilai jawaban.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih modul</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Select value={pilihan?.id ?? ""} onValueChange={(nilai) => setBankId(nilai ?? "")}>
            <SelectTrigger aria-label="Bank soal"><SelectValue placeholder="Muat daftar modul…" /></SelectTrigger>
            <SelectContent>
              {bank.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.judul}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {pilihan && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Timer className="size-3" /> {pilihan.detik} detik
              </Badge>
              <Badge variant="outline">lulus {pilihan.lulus}</Badge>
              <Link to={`/modul/${pilihan.modul}`} className="underline hover:text-foreground">
                baca materinya dulu
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {pilihan ? (
        <QuizRunner
          judul={pilihan.judul}
          keterangan={`Jawab dalam ${pilihan.detik} detik per pertanyaan. Nilai lulus ${pilihan.lulus} dari 100.`}
          mulai={() => apiPost<QuizStartPayload>("/quiz/start", { bank_id: pilihan.id })}
          onDone={() => riwayat.reload()}
        />
      ) : (
        <AsyncBlock state={daftar} rows={1}>
          {() => <p className="text-sm text-muted-foreground">Belum ada bank soal tersedia.</p>}
        </AsyncBlock>
      )}

      {user && pilihan && (
        <AsyncBlock state={riwayat} rows={2}>
          {(isi) => (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="size-4" /> Riwayat modul ini
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm">
                  Skor terbaik: <span className="font-semibold tabular-nums">{isi.best}</span> · {isi.attempts.length} percobaan
                </p>
                {isi.attempts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada percobaan. Coba satu kali untuk melihat riwayat Anda.</p>
                ) : (
                  <>
                    <ul className="flex flex-col gap-1 text-sm">
                      {isi.attempts.slice(0, 8).map((baris) => (
                        <li key={baris.id} className="flex items-center justify-between gap-2 border-b border-border/60 py-1.5 last:border-0">
                          <span className="text-xs text-muted-foreground">
                            #{baris.attempt_no} · {new Date(baris.started_at).toLocaleString("id-ID")} WIB
                          </span>
                          <span className="flex items-center gap-2 tabular-nums">
                            <span className="font-semibold">{baris.score}</span>
                            <Badge variant={baris.status === "pass" ? "default" : baris.status === "late" ? "secondary" : "destructive"}>
                              {baris.status === "pass" ? "lulus" : baris.status === "late" ? "latihan" : "belum lulus"}
                            </Badge>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Progress value={isi.best} />
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </AsyncBlock>
      )}

      {!user && (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-6 text-sm">
            <p>Kuis menambahkan XP dan peringkat, jadi perlu masuk dengan email Anda.</p>
            <Button asChild size="sm">
              <Link to="/masuk">Masuk dulu</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
