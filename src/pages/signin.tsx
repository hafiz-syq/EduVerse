import { useApp } from "@/lib/app-context";
import { API_BASE } from "@/lib/api";
import { Link } from "@/lib/router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDescription, Alert } from "@/components/ui/alert";
import { Info, LogOut, ShieldCheck } from "lucide-react";

const PENYEDIA = [
  { key: "google", label: "Google", hint: "email dan nama profil Anda" },
  { key: "github", label: "GitHub", hint: "email yang terlihat di akun GitHub" },
] as const;

export function SignInPage() {
  const { ready, user, providers, signOut, online } = useApp();

  if (ready && user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-success" /> Anda sudah masuk
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-sm">
            {user.name || "Pembelajar"} · {user.email || "email tidak tersedia"} · {user.rank_title} · {user.xp} XP
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/profil">Lihat profil</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => void signOut()}>
              <LogOut /> Keluar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tersedia = PENYEDIA.filter((item) => providers[item.key]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Masuk ke EduVerse</h1>
        <p className="text-sm text-muted-foreground">
          Materi bisa dibaca tanpa akun. Masuk diperlukan untuk menyimpan progres, mengerjakan kuis berbatas
          waktu, berdiskusi, dan ikut Uji Kompetensi.
        </p>
      </header>

      {!online && (
        <Alert>
          <Info />
          <AlertDescription>
            Anda sedang luring. Masuk butuh koneksi; paket materi yang sudah diunduh tetap bisa dibaca.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Masuk satu klik</CardTitle>
          <CardDescription>
            EduVerse memakai email Anda sebagai identitas akun — tanpa password yang perlu diingat.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {tersedia.map((item) => (
            <Button key={item.key} asChild className="w-full justify-start" variant={item.key === "google" ? "default" : "outline"}>
              <a href={`${API_BASE}/auth/start?provider=${item.key}`}>Lanjut dengan {item.label}</a>
            </Button>
          ))}
          {tersedia.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Penyedia login belum aktif di situs ini. Pengelola perlu mengisi Client ID dan Client Secret Google
              atau GitHub di Site Settings, lalu menyediakan <code>APP_SESSION_SECRET</code>.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Setelah berhasil, Anda diarahkan kembali ke Beranda dan sesi disimpan sebagai cookie tersegel di
            peramban ini.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Tersedia:</span>
        {PENYEDIA.map((item) => (
          <Badge key={item.key} variant={providers[item.key] ? "secondary" : "outline"}>
            {item.label} {providers[item.key] ? "aktif" : "belum diatur"}
          </Badge>
        ))}
        {providers.platform && <Badge variant="secondary">akun platform aktif</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Belum mau masuk?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            Daftar materi tetap terbuka untuk dibaca. Progres, XP, peringkat, dan papan peringkat baru tercatat
            setelah Anda masuk.
          </p>
          <Button asChild size="sm" variant="link" className="w-fit px-0">
            <Link to="/materi">Lihat daftar materi</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
