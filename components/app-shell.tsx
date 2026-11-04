import { useApp } from "@/lib/app-context";
import { Link, useRouter } from "@/lib/router";
import { AdSlot } from "./ad-slot";
import { RankBadge } from "./rank-badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  House,
  MessagesSquare,
  Timer,
  Trophy,
  WifiOff,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Beranda", icon: House },
  { to: "/materi", label: "Materi", icon: BookOpen },
  { to: "/kuis", label: "Kuis", icon: Timer },
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, online, packs, signOut, ready } = useApp();
  const { pathname } = useRouter();
  const aktif = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

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
                    ? "flex min-h-11 flex-1 flex-col items-center gap-0.5 rounded-lg text-xs font-semibold text-primary"
                    : "flex min-h-11 flex-1 flex-col items-center gap-0.5 rounded-lg text-xs text-muted-foreground"
                }
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
