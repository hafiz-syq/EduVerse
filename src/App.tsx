import { lazy, Suspense, useEffect } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import { RouterProvider, matchRoute, useRouter } from "@/lib/router";
import { flushProgress } from "@/lib/progress-queue";
import { AppShell } from "@/components/app-shell";
import { ConsentBar } from "@/components/consent-bar";
import { CatalogPage } from "./pages/catalog";
import { HomePage } from "./pages/home";
import { ModuleReaderPage } from "./pages/module-reader";
import { QuizPage } from "./pages/quiz";
import { DiscussionPage } from "./pages/discussion";
import { ThreadDetailPage } from "./pages/thread-detail";
import { ArenaPage } from "./pages/arena";
import { ArenaDetailPage } from "./pages/arena-detail";
import { ProfilePage } from "./pages/profile";
import { SignInPage } from "./pages/signin";
import { AdminPage } from "./pages/admin";

// Lab koding membawa CodeMirror + Anime.js; dipisah jadi chunk sendiri agar pelajar
// yang tidak membuka /koding tidak menanggung unduhannya (hemat bandwidth, tetap luring).
const KodingPage = lazy(() => import("./pages/koding"));

const RUTE: { pattern: string; halaman: (params: Record<string, string>) => React.ReactNode }[] = [
  { pattern: "/", halaman: () => <HomePage /> },
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
  { pattern: "/admin", halaman: () => <AdminPage /> },
];

function Isi() {
  const { pathname } = useRouter();

  for (const rute of RUTE) {
    const params = matchRoute(rute.pattern, pathname);
    if (params) {
      return (
        <Suspense
          fallback={
            <div className="flex flex-col gap-3" role="status" aria-live="polite">
              <div className="h-8 w-56 animate-pulse rounded-lg bg-secondary" />
              <div className="h-4 w-80 animate-pulse rounded-lg bg-secondary" />
              <div className="h-64 animate-pulse rounded-xl bg-secondary" />
            </div>
          }
        >
          {rute.halaman(params)}
        </Suspense>
      );
    }
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
