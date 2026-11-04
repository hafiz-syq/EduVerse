import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RankRow } from "@/lib/types";

const WARNA: Record<string, string> = {
  pemula: "text-rank-pemula border-rank-pemula/40 bg-rank-pemula/10",
  madya: "text-rank-madya border-rank-madya/40 bg-rank-madya/10",
  maha: "text-rank-maha border-rank-maha/40 bg-rank-maha/10",
  master: "text-rank-master border-rank-master/40 bg-rank-master/10",
};

interface RankBadgeProps {
  rankKey?: string;
  title?: string;
  className?: string;
}

export function RankBadge({ rankKey = "pemula", title, className }: RankBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", WARNA[rankKey] ?? WARNA.pemula, className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {title ?? rankKey}
    </Badge>
  );
}

/** Ambang berikutnya: berapa XP lagi menuju peringkat di atasnya. */
export function rankProgress(xp: number, ladder: RankRow[]) {
  const naik = ladder.filter((row) => row.threshold > xp).sort((a, b) => a.threshold - b.threshold)[0];
  const sekarang = [...ladder].reverse().find((row) => row.threshold <= xp) ?? ladder[0];
  return {
    sekarang,
    berikutnya: naik ?? null,
    kurang: naik ? naik.threshold - xp : 0,
    persen: naik ? Math.round(((xp - (sekarang?.threshold ?? 0)) / Math.max(1, naik.threshold - (sekarang?.threshold ?? 0))) * 100) : 100,
  };
}
