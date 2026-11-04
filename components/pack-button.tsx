import { useState } from "react";
import { messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { idbSupported } from "@/lib/idb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader, Trash2, WifiOff } from "lucide-react";

interface PackButtonProps {
  slug: string;
  offlineOk: boolean;
  compact?: boolean;
}

/** Simpan paket baca-luring ke IndexedDB; tidak berpura-pura bisa luring kalau penyimpanan tidak ada. */
export function PackButton({ slug, offlineOk, compact }: PackButtonProps) {
  const { user, downloadPack, forgetPack, packs } = useApp();
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const tersimpan = packs.some((pack) => pack.slug === slug);

  if (!idbSupported) {
    return (
      <p className="text-xs text-muted-foreground">
        Perangkat ini tidak mendukung penyimpanan luring, jadi paket belum bisa diunduh.
      </p>
    );
  }

  if (!offlineOk) {
    return (
      <p className="text-xs text-muted-foreground">
        Modul ini memuat latihan yang butuh koneksi, jadi belum bisa dibaca luring.
      </p>
    );
  }

  const hapus = async () => {
    setSibuk(true);
    setGalat("");
    try {
      await forgetPack(slug);
    } catch (error) {
      setGalat(messageFor(error));
    } finally {
      setSibuk(false);
    }
  };

  const unduh = async () => {
    setSibuk(true);
    setGalat("");
    try {
      await downloadPack(slug);
    } catch (error) {
      setGalat(messageFor(error));
    } finally {
      setSibuk(false);
    }
  };

  if (tersimpan) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <WifiOff className="size-3" /> siap luring
        </Badge>
        <Button size="sm" variant="ghost" onClick={hapus} disabled={sibuk} className={compact ? "h-7 px-2 text-xs" : "text-xs"}>
          <Trash2 /> Hapus paket
        </Button>
        {galat && <p className="text-xs text-destructive">{galat}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={unduh}
        disabled={sibuk || !user}
        className={compact ? "h-7 px-2 text-xs" : "text-xs"}
        title={user ? "Simpan modul ini agar bisa dibaca tanpa koneksi" : "Masuk dulu untuk mengunduh paket luring"}
      >
        {sibuk ? <Loader className="animate-spin" /> : <Download />}
        {sibuk ? "Mengunduh" : "Simpan luring"}
      </Button>
      {galat && <p className="text-xs text-destructive">{galat}</p>}
    </div>
  );
}
