import { Link } from "@/lib/router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

/**
 * Halaman ini statis: tidak memanggil rute Function apa pun, sehingga tetap terbuka untuk
 * pengunjung tanpa akun dan tetap terbaca saat perayap menolak menjalankan JavaScript.
 * Setiap butir di bawah punya padanan di kode — kalau kodenya berubah, halaman ini ikut
 * diubah, bukan dibiarkan menjadi janji yang tidak lagi benar.
 */

// Diisi oleh pengelola portal. Dibiarkan kosong supaya tidak ada alamat karangan yang
// tampil ke publik; sebelum halaman ini dijadikan rujukan persetujuan iklan, satu baris
// ini harus diisi alamat surel resmi yang benar-benar dibaca.
const EMAIL_PENGELOLA = "hafizsyq@gmail.com";

const DIPUNGUT = [
  {
    judul: "Identitas akun",
    isi: "email, nama tampil, foto profil, peran (pelajar atau pengelola), dan waktu akun dibuat. Untuk login Google atau GitHub, data itu diambil dari profil penyedia, bukan dari isi akun Anda.",
  },
  {
    judul: "Penanda login",
    isi: "Satu baris `identity` berbentuk `google:email` atau `github:email` sebagai kunci akun, supaya masuk ulang dari perangkat mana pun bertemu akun yang sama.",
  },
  {
    judul: "Progres belajar",
    isi: "Pelajaran yang ditandai selesai, percobaan kuis beserta jawaban dan skornya, catatan latihan lab koding, XP, dan jabatan di papan peringkat.",
  },
  {
    judul: "Isi kolom diskusi",
    isi: "Judul topik, isi pertanyaan dan jawaban, vote, jawaban yang diterima, serta laporan konten yang Anda kirim. Semua terbaca pelajar lain yang sudah masuk.",
  },
  {
    judul: "Peristiwa iklan",
    isi: "Kalau Anda menyetujui iklan, kami mencatat slot mana yang tampil atau diklik, jenis peristiwa, hari, dan id akun. Alamat IP tidak disimpan dan tidak ada cookie lintas situs dari sisi kami.",
  },
];

const DISIMPAN_PERANGKAT = [
  {
    nama: "__Host-ev_session",
    jenis: "cookie sesi",
    isi: "Penanda sesi acak. Flag-nya Secure, HttpOnly, SameSite=Lax, dan hanya berlaku untuk domain ini, jadi situs lain tidak bisa membacanya.",
  },
  {
    nama: "ev_ads_consent",
    jenis: "localStorage",
    isi: "Jawaban Anda pada banner persetujuan iklan (setuju atau tanpa iklan), dipakai ulang saat kunjungan berikutnya.",
  },
  {
    nama: "ev_session_snapshot",
    jenis: "localStorage",
    isi: "Salinan balasan sesi terakhir supaya pemilik akun tidak dilempar ke halaman masuk ketika jaringan sedang mati. Isinya hilang saat Anda keluar.",
  },
  {
    nama: "eduverse-luring",
    jenis: "IndexedDB",
    isi: "Modul yang Anda unduh untuk dibaca tanpa koneksi. Hapus lewat tombol hapus unduhan pada kartu modul; isinya hanya ada di perangkat ini.",
  },
];

const PENYEDIA = [
  {
    nama: "Google",
    cakupan: "openid email profile",
    catatan: "Hanya identitas. Tidak ada akses ke Drive, Gmail, maupun Kalender.",
  },
  {
    nama: "GitHub",
    cakupan: "read:user user:email",
    catatan:
      "Hanya profil dan daftar email, dan daftar email itu dibaca semata untuk menemukan alamat ketika profil Anda tidak mempublikasikannya. Tidak ada akses ke repositori, issue, atau organisasi.",
  },
];

const HAK = [
  "Melihat dan mengoreksi data Anda: seluruh progres dan identitas tampil di halaman Profil setelah Anda masuk.",
  "Menghapus jejak di perangkat: keluar dari akun mengosongkan snapshot sesi, dan unduhan modul luring bisa dihapus satu per satu.",
  "Menghentikan iklan: pilih Tanpa iklan pada banner persetujuan, dan tidak ada peristiwa iklan yang dicatat untuk Anda.",
  "Meminta penghapusan akun: portal ini belum menyediakan tombol hapus diri, jadi permintaan penghapusan akun dan seluruh isinya disampaikan kepada pengelola (di bagian Kontak di bawah).",
];

const IKLAN_PIHAK_KETIGA = [
  "Kami dapat memberi izin vendor pihak ketiga, termasuk Google, untuk memasang cookie dan memakai data guna menayangkan iklan berdasarkan kunjungan Anda sebelumnya di situs ini dan situs lain.",
  "Penggunaan cookie iklan oleh Google memungkinkan Google dan mitranya menayangkan iklan kepada pengguna berdasarkan kunjungan mereka ke situs ini dan/atau situs lain di internet.",
  "Anda dapat memilih untuk tidak menerima iklan yang dipersonalisasi melalui Setelan iklan Google (https://www.google.com/settings/ads). Anda juga dapat memilih keluar dari penggunaan cookie untuk iklan yang dipersonalisasi oleh vendor pihak ketiga lain di http://www.aboutads.info.",
];

function Bagian({ id, judul, children }: { id: string; judul: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{judul}</h2>
      {children}
    </section>
  );
}

export function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit gap-1.5">
          <ShieldCheck className="size-3.5" /> Kebijakan privasi
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Data apa yang EduVerse pegang tentang Anda</h1>
        <p className="text-sm text-muted-foreground">
          Portal belajar pemrograman milik BEM FT UNAYA. Halaman ini terbuka untuk siapa saja tanpa akun dan berlaku
          sejak 9 November 2026. Isinya ditulis sesuai yang benar-benar dilakukan kode portal, bukan sesuai formalitas.
        </p>
      </section>

      <Bagian id="dipungut" judul="Yang kami kumpulkan">
        <div className="grid gap-3 sm:grid-cols-2">
          {DIPUNGUT.map((item) => (
            <Card key={item.judul}>
              <CardContent className="flex flex-col gap-2 py-4">
                <p className="font-medium">{item.judul}</p>
                <p className="text-sm text-muted-foreground">{item.isi}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Portal ini tidak punya fitur buletin atau surel promosi, dan alamat email tidak dipakai untuk mengirim
          penawaran. Tidak ada pembayaran di dalam portal: materi, kuis, dan arena gratis untuk pelajar.
        </p>
      </Bagian>

      <Bagian id="perangkat" judul="Yang disimpan di perangkat Anda">
        <div className="flex flex-col gap-3">
          {DISIMPAN_PERANGKAT.map((item) => (
            <div key={item.nama} className="flex flex-col gap-1 rounded-xl border bg-card p-4">
              <p className="flex flex-wrap items-baseline gap-2">
                <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{item.nama}</code>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.jenis}</span>
              </p>
              <p className="text-sm text-muted-foreground">{item.isi}</p>
            </div>
          ))}
        </div>
      </Bagian>

      <Bagian id="penyedia" judul="Login lewat Google dan GitHub">
        <p className="text-sm text-muted-foreground">
          Kami memakai OAuth. Batas akses (scope) yang diminta kecil dan token akses hanya dipakai saat proses masuk
          berlangsung — portal menyimpan identitas Anda, bukan kunci akses ke akun Google atau GitHub Anda.
        </p>
        <div className="flex flex-col gap-3">
          {PENYEDIA.map((item) => (
            <div key={item.nama} className="flex flex-col gap-1 rounded-xl border p-4">
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">{item.nama}</span>
                <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{item.cakupan}</code>
              </p>
              <p className="text-sm text-muted-foreground">{item.catatan}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Portal ini tidak menyimpan password, jadi tidak ada yang bisa bocor dari basis data berupa kata sandi.
          Penyedia login yang sedang aktif selalu terlihat di halaman masuk.
        </p>
      </Bagian>

      <Bagian id="hosting" judul="Di mana data berada">
        <p className="text-sm text-muted-foreground">
          Halaman dan logika portal dijalankan sebagai function tanpa server di region Singapura, dan basis data
          Postgres-nya berada di region Asia Tenggara yang sama. Koneksi ke basis data selalu terenkripsi TLS. Kami
          tidak memindahkan data pribadi ke yurisdiksi lain untuk diproses.
        </p>
      </Bagian>

      <Bagian id="iklan" judul="Iklan">
        <p className="text-sm text-muted-foreground">
          Saat ini seluruh slot iklan EduVerse diisi sendiri oleh tim pengelola lewat halaman admin: gambar dan
          tautannya dilayani dari domain ini, tidak ada permintaan ke jaringan iklan. Karena itu iklan tetap muncul
          saat mode luring dan tidak meninggalkan cookie pihak ketiga.
        </p>
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <p className="font-medium">Kalau nanti jaringan iklan pihak ketiga dipasang</p>
            <p className="text-sm text-muted-foreground">
              Perubahan itu akan kami umumkan di halaman ini sebelum tayang. Pada saat itu berlaku tiga hal berikut:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
              {IKLAN_PIHAK_KETIGA.map((butir) => (
                <li key={butir.slice(0, 24)}>{butir}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Persetujuan Anda pada banner iklan menentukan apakah iklan dan pengukurannya dimuat sama sekali.
              Menolak iklan tidak mengunci materi, kuis, diskusi, atau arena.
            </p>
          </CardContent>
        </Card>
      </Bagian>

      <Bagian id="diskusi" judul="Isi buatan pengguna dan moderasinya">
        <p className="text-sm text-muted-foreground">
          Pertanyaan dan jawaban di kolom diskusi dibaca oleh pelajar lain yang sudah masuk. Setiap peserta bisa
          melaporkan konten, dan pengelola punya antrean moderasi untuk menyembunyikan atau menindaklanjuti isi yang
          melanggar. Jangan menuliskan data pribadi orang lain di thread: nomor telepon, alamat rumah, dan NIS/NIM
          teman tidak perlu ada di ruang diskusi.
        </p>
      </Bagian>

      <Bagian id="hak" judul="Hak Anda">
        <p className="text-sm text-muted-foreground">
          Portal ini tunduk pada ketentuan pelindungan data pribadi Indonesia. Yang bisa Anda lakukan hari ini:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
          {HAK.map((butir) => (
            <li key={butir.slice(0, 24)}>{butir}</li>
          ))}
        </ul>
      </Bagian>

      <Bagian id="kontak" judul="Kontak dan perubahan">
        <p className="text-sm text-muted-foreground">
          Pertanyaan tentang privasi, permintaan koreksi, atau permintaan penghapusan akun disampaikan kepada
          pengelola portal.
        </p>
        {EMAIL_PENGELOLA ? (
          <p className="text-sm">
            <a href={`mailto:${EMAIL_PENGELOLA}`} className="text-primary underline underline-offset-4">
              {EMAIL_PENGELOLA}
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Kanal resmi pengelola diumumkan di papan pengumuman kampus dan di halaman Profil.
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Kami menyimpan data akun selama akunnya aktif. Kalau halaman ini berubah secara penting, tanggal di bagian
          atas dan isi bagian terkait ikut diperbarui.
        </p>
        <p className="text-sm">
          <Link to="/" className="text-primary underline underline-offset-4">
            Kembali ke perkenalan EduVerse
          </Link>
        </p>
      </Bagian>
    </div>
  );
}
