import { useState } from "react";
import type { ReactNode } from "react";
import type { LessonBlock } from "@/lib/types";
import { useRouter } from "@/lib/router";
import { benihDariKode, semai, simpanan } from "@/lib/playground/draft";

// Hanya https yang boleh jadi tautan: skema lain (javascript:, data:) tetap teks biasa,
// jadi alamat dari materi tidak pernah bisa berubah menjadi vektor navigasi. Kurung
// penutup dan titik tidak ikut tertangkap karena materi menulis tautan di dalam kurung.
function tautanDalamTeks(teks: string): ReactNode[] {
  const keluaran: ReactNode[] = [];
  let cursor = 0;
  for (const cocok of teks.matchAll(/https:\/\/[^\s<>"'`)\]]+/g)) {
    const mentah = cocok[0];
    const url = mentah.replace(/[.,;:!?]+$/, "");
    if (cocok.index === undefined) continue;
    if (cocok.index > cursor) keluaran.push(teks.slice(cursor, cocok.index));
    keluaran.push(
      <a
        key={`tautan-${keluaran.length}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-medium text-primary underline underline-offset-2"
      >
        {url}
      </a>
    );
    const ekor = mentah.slice(url.length);
    if (ekor) keluaran.push(ekor);
    cursor = cocok.index + mentah.length;
  }
  if (cursor < teks.length) keluaran.push(teks.slice(cursor));
  return keluaran;
}

async function salin(teks: string) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    return false;
  }
}

function BlokKode({ block }: { block: LessonBlock }) {
  const { navigate } = useRouter();
  const [pesan, setPesan] = useState<string | null>(null);

  const coba = () => {
    semai(simpanan(), benihDariKode(block.text ?? "", block.lang));
    navigate("/koding");
  };

  return (
    <figure className="overflow-hidden rounded-lg border">
      <figcaption className="flex items-center justify-between gap-2 border-b bg-secondary px-3 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {block.lang || "kode"}
        </span>
        <span className="flex items-center gap-1">
          {pesan && <span className="text-[11px] text-muted-foreground">{pesan}</span>}
          <button
            type="button"
            className="rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={async () => setPesan((await salin(block.text ?? "")) ? "disalin" : "salin manual")}
          >
            Salin
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={coba}
          >
            Coba
          </button>
        </span>
      </figcaption>
      <pre className="overflow-x-auto">
        <code>{block.text}</code>
      </pre>
    </figure>
  );
}

export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="prose-lesson max-w-none">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return <BlokKode key={index} block={block} />;
        }
        if (block.type === "list") {
          return (
            <ul key={index}>
              {(block.items ?? []).map((item, itemIndex) => (
                <li key={itemIndex}>{tautanDalamTeks(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "tip") {
          return (
            <p key={index} className="rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm not-italic">
              {tautanDalamTeks(block.text ?? "")}
            </p>
          );
        }
        return <p key={index}>{tautanDalamTeks(block.text ?? "")}</p>;
      })}
    </div>
  );
}
