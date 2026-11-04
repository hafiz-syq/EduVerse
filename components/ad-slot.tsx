import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { apiGet, apiPost } from "@/lib/api";
import { useData } from "@/lib/use-data";
import type { AdsPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

const LUCU = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

interface AdSlotProps {
  slot: "top-banner" | "sidebar" | "in-feed" | "module-footer";
  className?: string;
}

export function AdSlot({ slot, className }: AdSlotProps) {
  const { consent, online } = useApp();
  const { data } = useData(`ads:${slot}`, () => apiGet<AdsPayload>(`/ads?slot=${slot}`), [slot]);
  const area = useRef<HTMLDivElement | null>(null);
  const [tampil, setTampil] = useState(false);
  const iklan = data?.slots?.find((item) => item.enabled);

  useEffect(() => {
    const node = area.current;
    if (!iklan || !node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setTampil(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [iklan]);

  useEffect(() => {
    if (!tampil || !iklan) return;
    apiPost("/ads/event", { slot_key: iklan.slot_key, kind: "view" }).catch(() => undefined);
  }, [tampil, iklan]);

  // Iklan hanya ditampilkan setelah pengunjung menyetujui, dan tidak saat luring.
  if (consent !== "accepted" || !online || !iklan) return null;

  const target = iklan.target_url || "";
  const isi = (
    <>
      {iklan.image_url && (
        <img
          src={iklan.image_url}
          alt=""
          loading="lazy"
          className="h-16 w-24 shrink-0 rounded-lg object-cover md:h-20 md:w-28"
        />
      )}
      <div className="min-w-0">
        <p className={LUCU}>{iklan.sponsor || "Iklan"}</p>
        <p className="truncate text-sm font-medium">{iklan.title}</p>
        {target ? (
          <p className="text-xs text-primary">Lihat detail &rarr;</p>
        ) : (
          <p className="text-xs text-muted-foreground">Slot sponsor belum terisi.</p>
        )}
      </div>
    </>
  );

  return (
    <div ref={area} className={cn("rounded-xl border border-dashed bg-secondary/60 p-3", className)}>
      {target ? (
        <a
          href={target}
          rel="sponsored noopener"
          target="_blank"
          className={cn(
            "flex items-center gap-3 transition-colors hover:bg-accent",
            slot === "sidebar" ? "flex-col items-start" : "flex-row",
          )}
          onClick={() => {
            apiPost("/ads/event", { slot_key: iklan.slot_key, kind: "click" }).catch(() => undefined);
          }}
        >
          {isi}
        </a>
      ) : (
        <div className={cn(slot === "sidebar" ? "flex flex-col gap-2" : "flex items-center gap-3")}>{isi}</div>
      )}
    </div>
  );
}
