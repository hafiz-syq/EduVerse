import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AdSlot } from "@/components/ad-slot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Playground } from "@/components/playground";
import { TUGAS } from "@/lib/playground/tasks";
import { ambilSemai, simpanan } from "@/lib/playground/draft";
import { munculkan, munculkanKisi } from "@/lib/motion";

const PANDUAN = [
  {
    judul: "Pilih latihan",
    isi: "Delapan latihan bertingkat: mulai dari memperbaiki sapaan sampai membangun daftar dari data.",
  },
  {
    judul: "Kirim dari Materi",
    isi: "Setiap blok kode di halaman Materi punya tombol Coba — isinya langsung masuk ke editor di sini.",
  },
  {
    judul: "Jalankan tanpa takut",
    isi: "Kode berjalan di sandbox perangkat Anda. Salah ketik tidak merusak akun, dan bisa diulang sesukanya.",
  },
];

export default function KodingPage() {
  const semai = useMemo(() => ambilSemai(simpanan()), []);
  const [diminta, setDiminta] = useState<{ id: string; n: number } | null>(null);
  const urutan = useRef(0);
  const hero = useRef<HTMLDivElement | null>(null);
  const kartu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hero.current) munculkan(Array.from(hero.current.children), { jarak: 12, antar: 70 });
    if (kartu.current) munculkanKisi(Array.from(kartu.current.children), 3, 55);
  }, []);

  const pilih = (id: string) => {
    urutan.current += 1;
    setDiminta({ id, n: urutan.current });
    document.getElementById("playground")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-6">
      <section ref={hero} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge>Lab koding</Badge>
          <Badge variant="secondary">berjalan luring</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Tulis kode, lihat hasilnya di layar juga</h1>
        <p className="max-w-prose text-muted-foreground">
          Tidak perlu memasang apa pun di laptop. Ketik di editor, tekan Jalankan, dan EduVerse menilai output atau
          tampilan halaman yang Anda buat.
        </p>
      </section>

      <section ref={kartu} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PANDUAN.map((item) => (
          <Card key={item.judul}>
            <CardContent className="py-4">
              <h2 className="font-semibold">{item.judul}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.isi}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Daftar latihan</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TUGAS.map((tugas) => (
            <button
              key={tugas.id}
              type="button"
              onClick={() => pilih(tugas.id)}
              className="rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="block text-sm font-semibold">{tugas.judul}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{tugas.ringkas}</span>
              <span className="mt-2 flex gap-1">
                <Badge variant="outline" className="text-[11px]">{tugas.tingkat}</Badge>
                <Badge variant="secondary" className="text-[11px]">{tugas.mode === "js" ? "JS" : "Web"}</Badge>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="playground" className="scroll-mt-20">
        <Playground benih={semai} diminta={diminta} />
      </section>

      <AdSlot slot="module-footer" />

      <p className="text-sm text-muted-foreground">
        Ingin konsepnya dulu? <Link to="/materi">Baca Materi</Link> — blok kodenya bisa dikirim ke lab ini dengan satu
        tombol.
      </p>
    </div>
  );
}
