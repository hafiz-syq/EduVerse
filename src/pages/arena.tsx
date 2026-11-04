import { apiGet } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { AllTimePayload, ArenaListPayload, WeeklyPayload } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { AdSlot } from "@/components/ad-slot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Timer, Trophy } from "lucide-react";

const inisial = (nama?: string) => (nama ?? "?").slice(0, 2).toUpperCase();

const jam = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const jam = Math.floor(total / 3600);
  const menit = Math.floor((total % 3600) / 60);
  if (jam > 0) return `${jam} jam ${menit} menit`;
  return `${menit} menit`;
};

function BarisPapan({ baris, skor }: { baris: AllTimePayload["entries"][number]; skor?: boolean }) {
  const emas = baris.place === 1;
  return (
    <li className="flex items-center gap-3 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className={`w-7 shrink-0 text-center font-semibold tabular-nums ${emas ? "text-blush" : "text-muted-foreground"}`}>
        {baris.place ?? "-"}
      </span>
      {emas && <Medal className="size-4 shrink-0 text-blush" aria-label="peringkat pertama" />}
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={baris.picture} alt="" />
        <AvatarFallback>{inisial(baris.name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 truncate font-medium">
        {baris.name ?? "Peserta"}
        {baris.me && <span className="ml-1 text-xs text-muted-foreground">(Anda)</span>}
      </span>
      <span className="shrink-0 tabular-nums text-muted-foreground">
        {skor ? `${baris.best_score ?? 0} poin · ${baris.attempts ?? 0}x` : `${baris.xp ?? 0} XP`}
      </span>
    </li>
  );
}

export function ArenaPage() {
  const { user } = useApp();
  const daftar = useData("arena", () => apiGet<ArenaListPayload>("/arena"), []);
  const mingguan = useData("arena:weekly", () => apiGet<WeeklyPayload>("/arena/weekly"), []);
  const total = useData("arena:alltime", () => apiGet<AllTimePayload>("/arena/alltime"), []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Arena Uji Kompetensi</h1>
        <p className="text-sm text-muted-foreground">
          Tantangan dibuka pada jendela tertentu. Skor terbaik Anda yang masuk papan peringkat; setelah jendela
          tutup, tiga teratas hadiah XP dibagikan.
        </p>
      </header>

      <Tabs defaultValue="tantangan">
        <TabsList>
          <TabsTrigger value="tantangan">Tantangan</TabsTrigger>
          <TabsTrigger value="mingguan">Pekan ini</TabsTrigger>
          <TabsTrigger value="sepanjang">Sepanjang masa</TabsTrigger>
        </TabsList>

        <TabsContent value="tantangan" className="flex flex-col gap-3 pt-2">
          <AsyncBlock state={daftar} rows={2}>
            {(isi) => (
              <>
                {isi.tournaments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada tantangan terjadwal. Pengelola situs bisa menambahnya dari dasbor admin.</p>
                )}
                {isi.tournaments.map((turnamen) => (
                  <Card key={turnamen.id}>
                    <CardContent className="flex flex-col gap-3 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Trophy className={`size-5 ${turnamen.derived_status === "live" ? "text-blush" : "text-muted-foreground"}`} />
                        <CardTitle className="text-base">{turnamen.title}</CardTitle>
                        <Badge variant={turnamen.derived_status === "live" ? "default" : "secondary"}>
                          {turnamen.derived_status === "live"
                            ? "sedang dibuka"
                            : turnamen.derived_status === "upcoming"
                              ? "segera"
                              : "sudah tutup"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(turnamen.starts_at).toLocaleString("id-ID")} WIB –{" "}
                        {new Date(turnamen.ends_at).toLocaleString("id-ID")} WIB · {turnamen.question_count ?? "-"} soal ·{" "}
                        {turnamen.duration_seconds ?? "-"} detik per soal
                      </p>
                      {turnamen.derived_status === "live" && (
                        <p className="flex items-center gap-1 text-sm text-blush">
                          <Timer className="size-4" /> {jam(turnamen.remaining_ms ?? 0)} tersisa
                        </p>
                      )}
                      {turnamen.my_entry && (
                        <p className="text-sm">
                          Skor terbaik Anda: <span className="font-semibold tabular-nums">{turnamen.my_entry.best_score ?? 0}</span> dari{" "}
                          {turnamen.my_entry.attempts ?? 0} kesertaan
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant={turnamen.derived_status === "live" ? "default" : "outline"}>
                          <Link to={`/arena/${turnamen.id}`}>
                            {turnamen.derived_status === "live" ? "Ikut tantangan" : "Lihat papan peringkat"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <AdSlot slot="in-feed" />
              </>
            )}
          </AsyncBlock>
        </TabsContent>

        <TabsContent value="mingguan" className="flex flex-col gap-3 pt-2">
          <AsyncBlock state={mingguan} rows={3}>
            {(isi) => (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pekan {isi.week}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {isi.my_place && (
                    <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
                      Posisi Anda saat ini: {isi.my_place}
                    </p>
                  )}
                  {isi.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada entri pada pekan ini.</p>
                  ) : (
                    <ul className="flex flex-col">
                      {isi.entries.map((baris) => (
                        <BarisPapan key={baris.user_id} baris={baris} skor />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </AsyncBlock>
        </TabsContent>

        <TabsContent value="sepanjang" className="flex flex-col gap-3 pt-2">
          <AsyncBlock state={total} rows={3}>
            {(isi) => (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Papan peringkat XP</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {!user && <p className="text-sm text-muted-foreground">Masuk untuk melihat posisi Anda di papan ini.</p>}
                  {isi.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada pembelajar dengan XP. Selesaikan pelajaran pertama!</p>
                  ) : (
                    <ul className="flex flex-col">
                      {isi.entries.map((baris) => (
                        <BarisPapan key={baris.user_id} baris={baris} />
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Diperbarui {new Date(isi.generated_at).toLocaleString("id-ID")} WIB.
                  </p>
                </CardContent>
              </Card>
            )}
          </AsyncBlock>
        </TabsContent>
      </Tabs>
    </div>
  );
}
