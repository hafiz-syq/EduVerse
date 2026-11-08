import { useApp } from "@/lib/app-context";
import { Link, matchRoute, useRouter } from "@/lib/router";
import { AdSlot } from "./ad-slot";
import { RankBadge } from "./rank-badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Braces,
  GraduationCap,
  House,
  MessagesSquare,
  Timer,
  Trophy,
  WifiOff,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dasbor", icon: House },
  { to: "/materi", label: "Materi", icon: BookOpen },
  { to: "/kuis", label: "Kuis", icon: Timer },
  { to: "/koding", label: "Koding", icon: Braces },
  { to: "/diskusi", label: "Diskusi", icon: MessagesSquare },
  { to: "/arena", label: "Arena", icon: Trophy },
  { to: "/profil", label: "Profil", icon: GraduationCap },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-4.5" />
      </span>
      EduVerse
    </Link>
  );
}

function ActiveLink({ to, label, icon: Icon, active }: { to: string; label: string; icon: typeof House; active: boolean }) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "flex items-center gap-2.5 rounded-lg bg-primary-soft px-3 py-2 text-sm font-medium text-primary"
          : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      }
    >
      <Icon className="size-4.5 shrink-0" />
      {label}
    </Link>
  );
}

/**
 * Pola rute yang boleh dibuka tanpa sesi. Dijaga di satu tempat supaya guard di App.tsx
 * dan pilihan kulit di shell tidak bisa berbeda sendiri.
 */
export const PUBLIK = ["/", "/masuk", "/kebijakan-privasi"];
export const rutePublik = (pathname: string) => PUBLIK.some((pola) => matchRoute(pola, pathname) !== null);

const TAUTAN_PUBLIK = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#biaya", label: "Biaya & iklan" },
];

/**
 * Kulit untuk pengunjung tanpa sesi: navbar mendatar di atas, tanpa sidebar dan tanpa
 * navigasi bawah. Semua tautannya jangkar di halaman landing, karena isi materi memang
 * belum boleh dibuka sebelum masuk.
 */
function KulitPublik({ children }: { children: React.ReactNode }) {
  const { online } = useApp();
  const { pathname } = useRouter();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Brand />
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {TAUTAN_PUBLIK.map((tautan) =>
              pathname === "/" ? (
                <a
                  key={tautan.href}
                  href={tautan.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {tautan.label}
                </a>
              ) : (
                <a
                  key={tautan.href}
                  href={`/${tautan.href}`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {tautan.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            {!online && (
              <span className="hidden items-center gap-1 rounded-full bg-blush-soft px-2 py-1 text-xs font-medium text-blush sm:flex">
                <WifiOff className="size-3.5" /> luring
              </span>
            )}
            <Button size="sm" asChild className="min-h-11 px-4">
              <Link to="/masuk">Masuk</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6">{children}</main>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground">
          <p>EduVerse — portal belajar pemrograman milik BEM FT UNAYA.</p>
          <p>Materi, kuis, dan arena memerlukan akun. Halaman ini bisa dibaca siapa saja.</p>
          <nav aria-label="Tautan kebijakan" className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/kebijakan-privasi" className="underline underline-offset-4 hover:text-foreground">
              Kebijakan privasi
            </Link>
            <Link to="/masuk" className="underline underline-offset-4 hover:text-foreground">
              Masuk
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, online, packs, signOut, ready } = useApp();
  const { pathname } = useRouter();
  const aktif = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  // Pengunjung tanpa sesi selalu dapat kulit publik di rute publik. Di rute terbatas
  // tunggu `ready` dulu supaya pemilik sesi tidak melihat navigasi salah selama muat awal.
  if (!user && (rutePublik(pathname) || ready)) return <KulitPublik>{children}</KulitPublik>;

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <Brand />
        <nav className="flex flex-col gap-1" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <ActiveLink key={item.to} {...item} active={aktif(item.to)} />
          ))}
          {user?.role === "admin" && (
            <ActiveLink to="/admin" label="Admin" icon={BookOpen} active={aktif("/admin")} />
          )}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <AdSlot slot="sidebar" />
          <div className="rounded-xl border border-sidebar-border bg-card p-3 text-sm">
            {ready && !user ? (
              <Button size="sm" asChild className="w-full">
                <Link to="/masuk">Masuk</Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="truncate font-medium">{user?.name}</p>
                <RankBadge rankKey={user?.rank_key} title={user?.rank_title} />
                <p className="text-xs text-muted-foreground">
                  {user?.xp ?? 0} XP · seri {user?.streak ?? 0} hari
                </p>
                <Button size="sm" variant="ghost" className="justify-start px-0" onClick={() => void signOut()}>
                  Keluar
                </Button>
                <Link
                  to="/kebijakan-privasi"
                  className="w-fit text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Kebijakan privasi
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <Brand />
          <div className="flex items-center gap-2">
            {!online && (
              <span className="flex items-center gap-1 rounded-full bg-blush-soft px-2 py-1 text-xs font-medium text-blush">
                <WifiOff className="size-3.5" /> luring
              </span>
            )}
            {user && <RankBadge rankKey={user.rank_key} title={user.rank_title} />}
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 md:pb-12">
          {!online && (
            <p className="mb-4 rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm text-blush">
              Mode luring aktif. {packs.length} paket materi tersimpan di perangkat ini.
            </p>
          )}
          {children}
        </main>

        <nav
          aria-label="Navigasi bawah"
          className="pb-safe fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t bg-background px-2 pt-2 md:hidden"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const isAktif = aktif(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isAktif ? "page" : undefined}
                className={
                  isAktif
                    ? "flex min-h-11 min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg text-[11px] font-semibold text-primary"
                    : "flex min-h-11 min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg text-[11px] text-muted-foreground"
                }
              >
                <Icon className="size-5" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
