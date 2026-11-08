import { lazy, Suspense, useEffect } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import { RouterProvider, matchRoute, useRouter } from "@/lib/router";
import { flushProgress } from "@/lib/progress-queue";
import { AppShell, rutePublik } from "@/components/app-shell";
import { ConsentBar } from "@/components/consent-bar";
import { CatalogPage } from "./pages/catalog";
import { LandingPage } from "./pages/landing";
import { DashboardPage } from "./pages/dashboard";
import { ModuleReaderPage } from "./pages/module-reader";
import { QuizPage } from "./pages/quiz";
import { DiscussionPage } from "./pages/discussion";
import { ThreadDetailPage } from "./pages/thread-detail";
import { ArenaPage } from "./pages/arena";
import { ArenaDetailPage } from "./pages/arena-detail";
import { ProfilePage } from "./pages/profile";
import { SignInPage } from "./pages/signin";
import { PrivacyPage } from "./pages/privacy";
import { AdminPage } from "./pages/admin";

// Lab koding membawa CodeMirror + Anime.js; dipisah jadi chunk sendiri agar pelajar
// yang tidak membuka /koding tidak menanggung unduhannya (hemat bandwidth, tetap luring).
const KodingPage = lazy(() => import("./pages/koding"));

// Halaman publik hanya tiga: landing, halaman masuk, dan kebijakan privasi. Sisanya dijaga di
// sini dan juga ditolak Function dengan 401, jadi menyembunyikan tautan tidak cukup. Kebijakan
// privasi harus tetap terbuka tanpa akun karena perayap dan pembaca sebelum login membacanya.
const RUTE: { pattern: string; halaman: (params: Record<string, string>) => React.ReactNode }[] = [
  { pattern: "/", halaman: () => <LandingPage /> },
  { pattern: "/dashboard", halaman: () => <DashboardPage /> },
  { pattern: "/materi", halaman: () => <CatalogPage /> },
  { pattern: "/modul/:slug", halaman: (p) => <ModuleReaderPage slug={p.slug} /> },
  { pattern: "/kuis", halaman: () => <QuizPage /> },
  { pattern: "/koding", halaman: () => <KodingPage /> },
  { pattern: "/diskusi", halaman: () => <DiscussionPage /> },
  { pattern: "/diskusi/:id", halaman: (p) => <ThreadDetailPage id={p.id} /> },
  { pattern: "/arena", halaman: () => <ArenaPage /> },
  { pattern: "/arena/:id", halaman: (p) => <ArenaDetailPage id={p.id} /> },
  { pattern: "/profil", halaman: () => <ProfilePage /> },
  { pattern: "/masuk", halaman: () => <SignInPage /> },
  { pattern: "/kebijakan-privasi", halaman: () => <PrivacyPage /> },
  { pattern: "/admin", halaman: () => <AdminPage /> },
];

function TulangRangka() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-live="polite">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-secondary" />
      <div className="h-4 w-80 animate-pulse rounded-lg bg-secondary" />
      <div className="h-64 animate-pulse rounded-xl bg-secondary" />
    </div>
  );
}

function Isi() {
  const { pathname, navigate } = useRouter();
  const { ready, user } = useApp();

  const rute = RUTE.find((item) => matchRoute(item.pattern, pathname));
  const params = rute ? matchRoute(rute.pattern, pathname) : null;
  const publik = !rute || rutePublik(pathname);

  // Pengunjung tanpa sesi dikirim ke halaman masuk dengan alamat asal, supaya
  // halaman masuk bisa menyebut bagian mana yang sedang dibuka.
  useEffect(() => {
    if (ready && !user && !publik) navigate(`/masuk?dari=${encodeURIComponent(pathname)}`, { replace: true });
  }, [ready, user, publik, pathname, navigate]);

  if (!publik && !user) return <TulangRangka />;

  if (rute && params) {
    return <Suspense fallback={<TulangRangka />}>{rute.halaman(params)}</Suspense>;
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted-foreground">
        Alamat <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{pathname}</code> tidak dikenali.
      </p>
      <a href="/" className="w-fit text-sm font-medium text-primary underline">
        kembali ke beranda
      </a>
    </div>
  );
}

function KirimTertahan() {
  const { online, refresh } = useApp();

  useEffect(() => {
    if (!online) return;
    let batal = false;
    flushProgress().then((jumlah) => {
      if (!batal && jumlah > 0) void refresh();
    });
    return () => {
      batal = true;
    };
  }, [online, refresh]);

  return null;
}

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <KirimTertahan />
        <AppShell>
          <Isi />
        </AppShell>
        <ConsentBar />
      </AppProvider>
    </RouterProvider>
  );
}
