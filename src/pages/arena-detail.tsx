import { apiGet, apiPost } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { ArenaHistoryPayload, LeaderboardPayload, QuizStartPayload } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { QuizRunner } from "@/components/quiz-runner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Medal, Timer, Trophy } from "lucide-react";

const inisial = (nama?: string) => (nama ?? "?").slice(0, 2).toUpperCase();

const jam = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const jam = Math.floor(total / 3600);
  const menit = Math.floor((total % 3600) / 60);
  const detik = total % 60;
  return jam > 0 ? `${jam} jam ${menit} menit` : `${menit} menit ${detik} detik`;
};

export function ArenaDetailPage({ id }: { id: string }) {
  const { user, refresh } = useApp();
  const papan = useData(`arena:board:${id}`, () => apiGet<LeaderboardPayload>(`/arena/${id}/leaderboard`), [id]);
  const riwayat = useData(`arena:history:${id}`, () => apiGet<ArenaHistoryPayload>(`/arena/${id}/history`), [id, user?.id ?? "anon"]);

  return (
    <div className="flex flex-col gap-5">
      <AsyncBlock state={papan} rows={3}>
        {(isi) => {
          const langsung = isi.tournament.derived_status === "live";
          const sisa = new Date(isi.tournament.ends_at).getTime() - Date.now();
          return (
            <>
              <header className="flex flex-col gap-2">
                <Link to="/arena" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="size-4" /> semua tantangan
                </Link>
                <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Trophy className="size-5 text-blush" /> {isi.tournament.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant={langsung ? "default" : isi.tournament.derived_status === "upcoming" ? "secondary" : "outline"}>
                    {langsung ? "sedang dibuka" : isi.tournament.derived_status === "upcoming" ? "segera" : "sudah tutup"}
                  </Badge>
                  <span>
                    {new Date(isi.tournament.starts_at).toLocaleString("id-ID")} WIB –{" "}
                    {new Date(isi.tournament.ends_at).toLocaleString("id-ID")} WIB
                  </span>
                </div>
                {langsung && (
                  <p className="flex items-center gap-1 text-sm text-blush">
                    <Timer className="size-4" /> Tutup dalam {jam(sisa)}. Skor terbaik Anda yang dihitung.
                  </p>
                )}
              </header>

              {langsung && (
                <QuizRunner
                  judul="Ikut tantangan"
                  keterangan={`Maksimal 3 kesertaan per orang. Penilaian memakai jam server; jawaban yang masuk setelah jendela tutup menjadi latihan tanpa XP.`}
                  tombol="Ambil soal tantangan"
                  mulai={() => apiPost<QuizStartPayload>("/arena/start", { tournament_id: id })}
                  onDone={() => {
                    void papan.reload();
                    void riwayat.reload();
                    void refresh();
                  }}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Papan peringkat</CardTitle>
                  <CardDescription>
                    {isi.entries.length} peserta · tiga teratas menerima hadiah XP setelah jendela tutup (150 / 100 / 60).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isi.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada peserta. Jadilah yang pertama mengerjakan soal tantangan.</p>
                  ) : (
                    <ul className="flex flex-col">
                      {isi.entries.map((baris) => (
                        <li
                          key={baris.user_id}
                          className={`flex items-center gap-3 border-b border-border/60 py-2.5 text-sm last:border-0 ${baris.me ? "bg-primary-soft/60" : ""}`}
                        >
                          <span className={`w-7 shrink-0 text-center font-semibold tabular-nums ${baris.place === 1 ? "text-blush" : "text-muted-foreground"}`}>
                            {baris.place}
                          </span>
                          {typeof baris.place === "number" && baris.place <= 3 && <Medal className="size-4 shrink-0 text-blush" />}
                          <Avatar className="size-7 shrink-0">
                            <AvatarImage src={baris.picture} alt="" />
                            <AvatarFallback>{inisial(baris.name)}</AvatarFallback>
                          </Avatar>
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {baris.name || "Peserta"}
                            {baris.me && <span className="ml-1 text-xs text-muted-foreground">(Anda)</span>}
                          </span>
                          <span className="shrink-0 tabular-nums text-muted-foreground">
                            {baris.best_score ?? 0} poin · {baris.attempts ?? 0}x
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </>
          );
        }}
      </AsyncBlock>

      {user && (
        <AsyncBlock state={riwayat} rows={1}>
          {(isi) =>
            isi.attempts.length === 0 ? null : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kesertaan Anda</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 py-2">
                  {isi.attempts.map((baris) => (
                    <div key={baris.id} className="flex items-center justify-between gap-2 border-b border-border/60 px-1 py-1.5 text-sm last:border-0">
                      <span className="text-xs text-muted-foreground">
                        #{baris.attempt_no} · {new Date(baris.started_at).toLocaleString("id-ID")} WIB
                      </span>
                      <span className="flex items-center gap-2 tabular-nums">
                        <span className="font-semibold">{baris.score}</span>
                        <span className="text-xs text-muted-foreground">
                          {baris.correct}/{baris.total} · {(baris.duration_ms / 1000).toFixed(1)} detik
                        </span>
                        <Badge variant={baris.status === "pass" ? "default" : baris.status === "late" ? "secondary" : "outline"}>
                          {baris.status === "late" ? "latihan" : baris.status}
                        </Badge>
                      </span>
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-muted-foreground">Sisa kesertaan: {Math.max(0, 3 - isi.attempts.length)} dari 3.</p>
                </CardContent>
              </Card>
            )
          }
        </AsyncBlock>
      )}
    </div>
  );
}

