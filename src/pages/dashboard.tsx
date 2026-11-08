import { AsyncBlock } from "@/components/async-block";
import { AdSlot } from "@/components/ad-slot";
import { RankBadge } from "@/components/rank-badge";
import { apiGet } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { anakDari, gunakanAnimasi } from "@/lib/motion-lazy";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { HomePayload } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Coins, Flame, Trophy } from "lucide-react";

const jam = (ms: number) => {
  const jam2 = Math.floor(ms / 3_600_000);
  const hari = Math.floor(jam2 / 24);
  if (hari >= 1) return `${hari} hari ${jam2 % 24} jam`;
  const menit = Math.floor((ms % 3_600_000) / 60_000);
  return `${jam2} jam ${menit} menit`;
};

export function DashboardPage() {
  const { user, online } = useApp();
  const state = useData("home", () => apiGet<HomePayload>("/home"), [user?.id, online]);

  const wadah = gunakanAnimasi<HTMLDivElement>([state.data], (motion, root) => {
    motion.munculkanKisi(anakDari(root, "[data-gerak='ringkasan'] > *"), 3, 45);
    motion.munculkanKisi(anakDari(root, "[data-gerak='kursus'] > *"), 2, 55);
  });

  return (
    <div ref={wadah} className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {user ? `Halo, ${user.name.split(" ")[0]}` : "Dasbor belajar"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Progres Anda, modul yang tertunda, dan jendela Uji Kompetensi yang sedang dibuka.
        </p>
      </header>

      <AsyncBlock state={state} rows={4}>
        {(data) => (
          <div className="flex flex-col gap-6">
            {!user && (
              <Card>
                <CardContent className="flex flex-col items-start gap-3 py-6">
                  <p className="text-sm">
                    Masuk dengan email Anda untuk menyimpan progres, mengikuti kuis, dan naik peringkat.
                  </p>
                  <Button asChild size="sm" className="min-h-11">
                    <a href="/masuk">Masuk</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Ringkasan</h2>
              <div data-gerak="ringkasan" className="grid gap-3 sm:grid-cols-3">
                <Card>
                  <CardContent className="flex items-center gap-3 py-4">
                    <Coins className="size-5 text-primary" />
                    <div>
                      <p className="text-lg font-semibold tabular-nums">{user?.xp ?? data.stats?.xp ?? 0} XP</p>
                      <RankBadge rankKey={user?.rank_key} title={user?.rank_title ?? "Pemula"} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 py-4">
                    <Flame className="size-5 text-blush" />
                    <div>
                      <p className="text-lg font-semibold tabular-nums">{user?.streak ?? 0} hari</p>
                      <p className="text-xs text-muted-foreground">Seri belajar berturut-turut</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 py-4">
                    <Clock className="size-5 text-primary" />
                    <div>
                      <p className="text-lg font-semibold tabular-nums">
                        {data.totals.done}/{data.totals.lessons}
                      </p>
                      <p className="text-xs text-muted-foreground">{data.totals.modules} modul selesai sebagian</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {data.continue && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lanjutkan belajar</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="font-medium">{data.continue.title}</p>
                  <Progress value={data.continue.percent} />
                  <p className="text-sm text-muted-foreground">
                    {data.continue.percent}% · {data.continue.lesson_count} pelajaran · {data.continue.minutes} menit
                  </p>
                  <Button asChild size="sm" className="w-fit min-h-11">
                    <Link to={`/modul/${data.continue.slug}`}>Buka modul</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <AdSlot slot="top-banner" />

            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Kursus</h2>
                <Link to="/materi" className="text-sm font-medium text-primary">
                  Semua materi
                </Link>
              </div>
              <div data-gerak="kursus" className="grid gap-3 sm:grid-cols-2">
                {data.courses.map((course) => (
                  <Card key={course.slug}>
                    <CardContent className="flex flex-col gap-2 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-tight">{course.title}</p>
                        <Badge variant="outline" className="shrink-0 capitalize">
                          {course.level}
                        </Badge>
                      </div>
                      <Progress value={course.percent} />
                      <p className="text-xs text-muted-foreground">
                        {course.percent}% · {course.module_count} modul · {course.lesson_count} pelajaran
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Uji Kompetensi</h2>
              {data.tournament ? (
                <Card>
                  <CardContent className="flex flex-col gap-3 py-5">
                    <div className="flex items-center gap-2">
                      <Trophy className="size-5 text-blush" />
                      <p className="font-medium">{data.tournament.title}</p>
                      <Badge variant={data.tournament.mode === "live" ? "default" : "secondary"}>
                        {data.tournament.mode === "live" ? "Sedang dibuka" : "Segera"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data.tournament.mode === "live"
                        ? `Tutup ${jam(Math.max(0, new Date(data.tournament.ends_at).getTime() - Date.now()))} lagi. Skor terbaik Anda yang dihitung.`
                        : `Buka ${new Date(data.tournament.starts_at).toLocaleString("id-ID")} WIB. Lawan peserta lain untuk posisi pertama.`}
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="w-fit min-h-11"
                      variant={data.tournament.mode === "live" ? "default" : "outline"}
                    >
                      <Link to="/arena">Ke arena</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada jendela tantangan terjadwal.</p>
              )}
            </section>

            <AdSlot slot="in-feed" />
          </div>
        )}
      </AsyncBlock>
    </div>
  );
}
