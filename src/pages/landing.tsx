import { useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { anakDari, gunakanAnimasi } from "@/lib/motion-lazy";
import { useRouter } from "@/lib/router";
import { AdSlot } from "@/components/ad-slot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Globe,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Timer,
  Trophy,
  WifiOff,
} from "lucide-react";

const LANGKAH = [
  {
    icon: BookOpen,
    judul: "Baca modulnya",
    teks: "Modul pendek per topik, bertahap dari dasar. Yang bertanda bisa luring disimpan ke perangkat dan tetap terbuka tanpa koneksi.",
  },
  {
    icon: Timer,
    judul: "Uji dengan kuis",
    teks: "Satu paket soal berbatas waktu per modul. Penilaian dikerjakan di server, jadi hasilnya adil untuk semua peserta.",
  },
  {
    icon: MessagesSquare,
    judul: "Tanyakan yang menggantung",
    teks: "Setiap modul punya kolom diskusi. Jawaban yang benar ditandai sebagai kunci supaya pembaca berikutnya langsung menemukannya.",
  },
  {
    icon: Trophy,
    judul: "Ikut Uji Kompetensi",
    teks: "Arena mingguan melawan peserta lain. Skor terbaik Anda yang dihitung, dan papan peringkat ikut bergerak.",
  },
];

const TOPIK = [
  {
    icon: Globe,
    judul: "Dasar web",
    teks: "Struktur halaman HTML, tampilan dan tata letak CSS, sampai layout responsif dan Flexbox.",
  },
  {
    icon: Braces,
    judul: "JavaScript dari nol",
    teks: "Variabel dan tipe, alur percabangan dan perulangan, fungsi dan scope, sampai metode array yang dipakai tiap hari.",
  },
  {
    icon: BookOpen,
    judul: "Dasar ilmu komputer",
    teks: "Antrian dan stack dalam dunia nyata, plus cara memilih struktur data saat ditanya di wawancara.",
  },
  {
    icon: ArrowRight,
    judul: "Peta jalan",
    teks: "Cara membaca peta jalan pembelajaran dan menautkannya ke latihan yang sudah ada di EduVerse.",
  },
];

const JAMINAN = [
  {
    icon: Lock,
    judul: "Satu kali masuk, progres ikut ke mana saja",
    teks: "Tanda selesai pelajaran, skor kuis, XP, dan jabatan tersimpan di akun, jadi Anda bisa lanjut dari perangkat lain.",
  },
  {
    icon: WifiOff,
    judul: "Tetap bisa dibaca saat luring",
    teks: "Modul bertanda luring diunduh ke perangkat setelah Anda masuk, lalu tetap terbuka ketika koneksi hilang.",
  },
  {
    icon: ShieldCheck,
    judul: "Gratis, tanpa langganan",
    teks: "Slot iklan saat ini diisi tim pengelola lewat halaman admin dan belum memakai jaringan iklan pihak ketiga. Email hanya dipakai sebagai kunci akun.",
  },
];

const TANYAAN = [
  {
    t: "Iklannya dari Google?",
    j: "Belum. Saat ini sponsor dipilih dan dipasang tim pengelola lewat halaman admin, jadi tidak ada permintaan ke jaringan iklan pihak ketiga dari sisi kami. Kalau nanti jaringan iklan masuk, penampilannya dan cara menolaknya diumumkan lebih dulu di halaman ini.",
  },
  {
    t: "Kenapa materi harus masuk dulu?",
    j: "Supaya progres bisa dilanjutkan dan penilaian kuis tetap adil. Sebagai gantinya, halaman ini dan halaman masuk tetap terbuka untuk siapa saja tanpa akun.",
  },
  {
    t: "Data apa yang diambil dari Google atau GitHub?",
    j: "Hanya email, nama, dan foto profil. Email menjadi kunci akun; tidak ada akses ke file, repositori, maupun kontak Anda.",
  },
  {
    t: "Tidak punya Gmail, bisa pakai email lain?",
    j: "Masuk lewat GitHub memakai email apa pun yang terdaftar di akun GitHub Anda. Penyedia login yang aktif selalu terlihat di halaman masuk.",
  },
  {
    t: "Berapa lama satu modul dihabiskan?",
    j: "Estimasi menit ditulis di setiap pelajaran dan dijumlahkan di halaman modul. Mulailah dari satu modul, bukan dari seluruh katalog.",
  },
];

export function LandingPage() {
  const { user, providers } = useApp();
  const { navigate } = useRouter();

  // `/` halaman publik; begitu sesi aktif, tempat yang benar adalah dasbor. Replace supaya
  // tombol kembali peramban tidak mengantar pelajar bolak-balik ke landing.
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Jumlah penyedia login dibaca dari balasan /api/session, tidak ditulis di berkas ini.
  const penyediaAktif = Object.values(providers).filter(Boolean).length;

  const wadah = gunakanAnimasi<HTMLDivElement>([penyediaAktif], (motion, root) => {
    motion.munculkan(anakDari(root, "[data-gerak='hero'] > *"), { jarak: 14, antar: 70 });
    motion.munculkanKisi(anakDari(root, "[data-gerak='kisi'] > *"), 2, 45);
    motion.munculkanKisi(anakDari(root, "[data-gerak='topik'] > *"), 2, 45);
  });

  return (
    <div ref={wadah} className="flex flex-col gap-10">
      <section data-gerak="hero" className="flex flex-col items-start gap-4">
        <Badge variant="secondary" className="w-fit gap-1.5">
          <ShieldCheck className="size-3.5" /> Gratis, tanpa langganan
        </Badge>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          Belajar pemrograman gratis, dari nol sampai berani berkompetisi
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          EduVerse adalah portal belajar milik BEM FT UNAYA: materi bertahap per modul, kuis berbatas waktu yang
          dinilai di server, kolom diskusi per topik, dan Uji Kompetensi mingguan. Masuk sekali dengan Google atau
          GitHub, lalu semua halaman belajar terbuka dan progres Anda ikut tersimpan.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg" className="min-h-11 px-5" onClick={() => navigate("/masuk")}>
            Masuk untuk membuka materi <ArrowRight />
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-11 px-5">
            <a href="#cara-kerja">Lihat cara kerjanya</a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {penyediaAktif > 0
            ? "Akun Google atau GitHub cukup — tidak ada password yang perlu diingat."
            : "Penyedia login sedang disiapkan oleh pengelola; halaman masuk tetap terbuka."}
        </p>
      </section>

      <AdSlot slot="top-banner" />

      <section id="cara-kerja" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Empat langkah, berulang di setiap modul</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Alurnya sengaja sederhana: baca, buktikan dengan kuis, tanyakan yang masih menggantung, lalu ukur diri
            di arena. Ulangi untuk topik berikutnya.
          </p>
        </div>
        <div data-gerak="kisi" className="grid gap-3 sm:grid-cols-2">
          {LANGKAH.map((langkah) => (
            <Card key={langkah.judul}>
              <CardContent className="flex flex-col gap-2 py-4">
                <langkah.icon className="size-5 text-primary" aria-hidden />
                <p className="font-medium">{langkah.judul}</p>
                <p className="text-sm text-muted-foreground">{langkah.teks}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="kurikulum" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Apa yang menunggu Anda di dalam</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Katalog lengkap hanya terbuka setelah masuk, jadi di sini hanya jalur besarnya: dari dasar web sampai
            dasar ilmu komputer, ditambah satu jalur peta jalan untuk memilih langkah berikutnya.
          </p>
        </div>
        <div data-gerak="topik" className="grid gap-3 sm:grid-cols-2">
          {TOPIK.map((topik) => (
            <Card key={topik.judul}>
              <CardContent className="flex flex-col gap-2 py-4">
                <topik.icon className="size-5 text-primary" aria-hidden />
                <p className="font-medium">{topik.judul}</p>
                <p className="text-sm text-muted-foreground">{topik.teks}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Janji ke pesertanya</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {JAMINAN.map((item) => (
            <Card key={item.judul}>
              <CardContent className="flex flex-col gap-2 py-4">
                <item.icon className="size-5 text-primary" aria-hidden />
                <p className="font-medium">{item.judul}</p>
                <p className="text-sm text-muted-foreground">{item.teks}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="biaya" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Biaya, iklan, dan yang sering ditanyakan</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Portal ini gratis dan dibiayai slot iklan yang dipasang sendiri oleh tim pengelola. Tidak ada langganan
            dan tidak ada materi yang berbayar. Kalau nanti kami menambahkan jaringan iklan pihak ketiga, halaman ini
            dan kebijakan privasi diperbarui lebih dulu.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {TANYAAN.map((tanyaan) => (
            <Card key={tanyaan.t}>
              <CardContent className="flex flex-col gap-2 py-4">
                <p className="font-medium">{tanyaan.t}</p>
                <p className="text-sm text-muted-foreground">{tanyaan.j}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4">
        <h2 className="text-base font-semibold">Masuk dulu, lalu semua halaman belajar terbuka</h2>
        <p className="text-sm text-muted-foreground">
          Setelah masuk, yang Anda buka adalah katalog materi, pembaca modul dengan kuis berbatas waktu, kolom diskusi
          per topik, lab koding di peramban, arena Uji Kompetensi mingguan, dan papan peringkat. Progres tersimpan di
          akun, jadi bisa dilanjutkan dari perangkat lain.
        </p>
        <Button className="min-h-11 px-5" onClick={() => navigate("/masuk")}>
          Masuk untuk membuka materi <ArrowRight />
        </Button>
      </section>
    </div>
  );
}
