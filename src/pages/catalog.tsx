import { apiGet } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { anakDari, gunakanAnimasi } from "@/lib/motion-lazy";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { Course } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { PackButton } from "@/components/pack-button";
import { AdSlot } from "@/components/ad-slot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Lock, WifiOff } from "lucide-react";

const LEVEL_LABEL: Record<string, string> = {
  dasar: "Dasar",
  menengah: "Menengah",
  lanjut: "Lanjut",
};

function ModulBaris({ modul }: { modul: Course["modules"][number] }) {
  return (
    <li className="flex flex-col gap-2 border-b border-border/60 py-3 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/modul/${modul.slug}`} className="text-sm font-medium hover:text-primary">
            {modul.title}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{modul.summary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {modul.completed && <Badge variant="secondary">Selesai</Badge>}
          {modul.bank && <Badge variant="outline">{modul.bank.title}</Badge>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {modul.minutes} menit
        </span>
        <span>{modul.lesson_count} pelajaran</span>
        {modul.percent > 0 && <span className="tabular-nums">{modul.percent}% selesai</span>}
        {modul.offline_ok ? (
          <span className="flex items-center gap-1">
            <WifiOff className="size-3.5" /> bisa luring
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Lock className="size-3.5" /> perlu koneksi
          </span>
        )}
        <span className="ml-auto">
          <PackButton slug={modul.slug} offlineOk={modul.offline_ok} compact />
        </span>
      </div>
    </li>
  );
}

export function CatalogPage() {
  const { online } = useApp();
  const state = useData("catalog", () => apiGet<Course[]>("/catalog"), []);

  const wadah = gunakanAnimasi<HTMLDivElement>([state.data], (motion, root) => {
    motion.munculkanKisi(anakDari(root, "[data-gerak='kartu']"), 1, 70);
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Materi</h1>
        <p className="text-sm text-muted-foreground">
          Semua modul gratis. Simpan paket luring kalau Anda akan belajar tanpa koneksi.
        </p>
      </header>

      {!online && (
        <p className="rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm text-blush">
          Daftar lengkap butuh koneksi. Modul yang sudah Anda simpan tetap bisa dibaca dari paket luring.
        </p>
      )}

      <AsyncBlock state={state} rows={4}>
        {(courses) => (
          <div ref={wadah} className="flex flex-col gap-6">
            {courses.map((course, index) => (
              <section className="flex flex-col gap-3" key={course.id}>
                <Card data-gerak="kartu">
                  <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                    <div className="min-w-0">
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{course.summary}</p>
                    </div>
                    <Badge variant="outline">{LEVEL_LABEL[course.level] ?? course.level}</Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>
                      {course.modules.length} modul · {course.lesson_count} pelajaran · {course.percent}% selesai
                    </span>
                  </CardContent>
                </Card>

                {index === 1 && <AdSlot slot="in-feed" />}

                <ul className="flex flex-col gap-0 px-1">
                  {course.modules.map((modul) => (
                    <ModulBaris key={modul.id} modul={modul} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </AsyncBlock>
    </div>
  );
}
