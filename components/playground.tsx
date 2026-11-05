// Playground: editor + sandbox + penilai, dihidupkan Anime.js.
//
// Batas yang dijaga:
//  - Kode pengguna hanya jalan setelah tombol "Jalankan" ditekan. Tidak ada kode orang
//    lain yang dieksekusi otomatis, dan tidak ada fitur "bagikan potongan yang jalan".
//  - Mode "js" memakai Web Worker → bisa dihentikan paksa saat perulangan tak berujung.
//  - Mode "web" memakai <iframe sandbox="allow-scripts"> tanpa allow-same-origin, jadi
//    kode pengguna tidak bisa membaca DOM induk atau membawa cookie EduVerse.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, RotateCcw, Check, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/code-editor";
import {
  PROYEK_AWAL,
  bangunDokumenWeb,
  bangunKodeWorker,
  buildPayload,
  tafsirkanBerita,
  tafsirkanCek,
  type CekHasil,
  type LogLine,
  type Mode,
  type Project,
  type SandboxBerita,
} from "@/lib/playground/runner";
import { TUGAS, cariTugas, nilaiCekWeb, nilaiOutput } from "@/lib/playground/tasks";
import { bacaDraf, simpanDraf, simpanan, type Semai } from "@/lib/playground/draft";
import { apiPost, isUnreachable, messageFor } from "@/lib/api";
import { queueCodeRun } from "@/lib/progress-queue";
import { useApp } from "@/lib/app-context";
import { denyut, getar, hitungNaik, munculkan, percik } from "@/lib/motion";

type Berkas = "html" | "css" | "js";
type Status = "siaga" | "jalan" | "menilai" | "lulus" | "gagal";

const WARNA_KONSOL: Record<LogLine["kind"], string> = {
  log: "text-foreground",
  info: "text-primary",
  success: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-rose-600 dark:text-rose-400",
  system: "text-muted-foreground italic",
};

function Baris({ line }: { line: LogLine }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    if (ref.current) munculkan(ref.current, { jarak: 6, durasi: 260, antar: 0 });
  }, []);
  return (
    <p ref={ref} className={`whitespace-pre-wrap break-words ${WARNA_KONSOL[line.kind]}`}>
      {line.kind === "error" ? "✕ " : line.kind === "success" ? "✓ " : ""}
      {line.text}
    </p>
  );
}

interface Props {
  benih?: Semai | null;
  tugasAwal?: string | null;
  /** Kartu latihan di halaman menekan ini; penghitung memaksa efek jalan lagi. */
  diminta?: { id: string; n: number } | null;
}

export function Playground({ benih, tugasAwal, diminta }: Props) {
  const { user, online } = useApp();
  const simpan = useMemo(() => simpanan(), []);
  const draf = useMemo(() => (benih ? null : bacaDraf(simpan)), [benih, simpan]);

  const idAwal = benih ? null : (draf?.tugasId ?? tugasAwal ?? TUGAS[0].id);
  const tugasAwalObjek = cariTugas(idAwal);

  const [mode, setMode] = useState<Mode>(benih?.mode ?? draf?.mode ?? tugasAwalObjek?.mode ?? "js");
  const [project, setProject] = useState<Project>(
    benih?.project ?? draf?.project ?? tugasAwalObjek?.mulai ?? PROYEK_AWAL,
  );
  const [tugasId, setTugasId] = useState<string | null>(idAwal);
  const [berkas, setBerkas] = useState<Berkas>(mode === "web" ? "html" : "js");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [cekList, setCekList] = useState<CekHasil[]>([]);
  const [status, setStatus] = useState<Status>("siaga");
  const [ringkasan, setRingkasan] = useState<{ lulus: boolean; detail: string } | null>(null);
  const [durasi, setDurasi] = useState<number | null>(null);

  const frame = useRef<HTMLIFrameElement | null>(null);
  const worker = useRef<Worker | null>(null);
  const penampungLog = useRef<LogLine[]>([]);
  const penampungCek = useRef<Map<string, CekHasil>>(new Map());
  const tugasIdRef = useRef<string | null>(tugasId);
  tugasIdRef.current = tugasId;
  const mulai = useRef(0);
  const batas = useRef<number | null>(null);
  const jedaNilai = useRef<number | null>(null);
  /** Nomor "Jalankan" aktif; setiap run baru membuat berita dari run lama tidak sah. */
  const nomorRun = useRef(0);
  const tombolRun = useRef<HTMLSpanElement | null>(null);
  const banner = useRef<HTMLDivElement | null>(null);
  const skor = useRef<HTMLSpanElement | null>(null);
  const bercas = useRef<HTMLDivElement | null>(null);
  /** "latihan:nomorRun" yang sudah dilaporkan ke server, supaya sekali lulus = sekali kirim. */
  const dikirim = useRef<string | null>(null);

  const tugas = cariTugas(tugasId);
  const bahasa = mode === "js" ? "js" : berkas;

  const hentikan = useCallback((senyap = false) => {
    if (batas.current !== null) {
      window.clearTimeout(batas.current);
      batas.current = null;
    }
    if (jedaNilai.current !== null) {
      window.clearTimeout(jedaNilai.current);
      jedaNilai.current = null;
    }
    nomorRun.current += 1;
    if (worker.current) {
      worker.current.terminate();
      worker.current = null;
    }
    if (frame.current) frame.current.srcdoc = "<!doctype html><title>Dihentikan</title>";
    if (!senyap) setStatus("siaga");
  }, []);

  useEffect(() => () => hentikan(true), [hentikan]);

  const tulis = useCallback((line: LogLine) => {
    penampungLog.current = [...penampungLog.current, line];
    setLogs(penampungLog.current);
  }, []);

  const nilaiWeb = useCallback(() => {
    const tugasAktif = cariTugas(tugasIdRef.current);
    if (!tugasAktif) return;
    const hasil = nilaiCekWeb(tugasAktif.cek.length, [...penampungCek.current.values()]);
    setRingkasan(hasil);
    setStatus(hasil.lulus ? "lulus" : "gagal");
  }, []);

  const selesai = useCallback(() => {
    // Kode sudah berhenti sendiri: matikan watchdog, kalau tidak ia menyala 5 detik
    // kemudian dan menimpa kesimpulan yang baru saja dihitung.
    if (batas.current !== null) {
      window.clearTimeout(batas.current);
      batas.current = null;
    }
    setDurasi(Math.max(1, Math.round(performance.now() - mulai.current)));
    const tugasAktif = cariTugas(tugasIdRef.current);
    if (!tugasAktif) {
      setStatus("siaga");
      return;
    }
    if (tugasAktif.mode === "js") {
      const hasil = nilaiOutput(tugasAktif.harapan, penampungLog.current);
      setRingkasan(hasil);
      setStatus(hasil.lulus ? "lulus" : "gagal");
      return;
    }
    setStatus("menilai");
    const run = nomorRun.current;
    jedaNilai.current = window.setTimeout(() => {
      jedaNilai.current = null;
      if (run !== nomorRun.current) return;
      nilaiWeb();
    }, 520);
  }, [nilaiWeb]);

  const terima = useCallback(
    (data: unknown) => {
      const berita = data as SandboxBerita;
      // Berita dari run sebelumnya masih bisa mendarat setelah frame diganti: srcdoc baru
      // memakai contentWindow yang sama, jadi penjaga event.source saja tidak cukup.
      if (berita?.run !== nomorRun.current) return;
      if (berita?.kind === "done") {
        selesai();
        return;
      }
      const cek = tafsirkanCek(data);
      if (cek) {
        penampungCek.current.set(cek.selector, cek);
        setCekList([...penampungCek.current.values()]);
        return;
      }
      const line = tafsirkanBerita(data);
      if (line) tulis(line);
    },
    [selesai, tulis],
  );

  // Hanya pesan dari frame sandbox milik kita yang dipercaya.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!frame.current || event.source !== frame.current.contentWindow) return;
      terima(event.data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [terima]);

  const jalankan = () => {
    hentikan(true);
    penampungLog.current = [];
    penampungCek.current = new Map();
    setLogs([]);
    setCekList([]);
    setRingkasan(null);
    setDurasi(null);
    setStatus("jalan");
    mulai.current = performance.now();
    denyut(tombolRun.current);

    const tugasAktif = cariTugas(tugasId);
    const payload = buildPayload(project, tugasAktif?.cek ?? [], tugasAktif?.klik ?? null, nomorRun.current);

    if (mode === "js") {
      const sumber = URL.createObjectURL(new Blob([bangunKodeWorker(payload)], { type: "text/javascript" }));
      const jalan = new Worker(sumber);
      worker.current = jalan;
      jalan.onmessage = (event) => terima(event.data);
      jalan.onerror = () => {
        tulis({ kind: "error", text: "Worker gagal dijalankan. Periksa sintaks kode Anda." });
        setStatus("gagal");
      };
      batas.current = window.setTimeout(() => {
        hentikan(true);
        tulis({ kind: "system", text: "Dihentikan otomatis setelah 5 detik — kemungkinan perulangan tak berujung." });
        setStatus("gagal");
      }, 5000);
      return;
    }
    if (frame.current) frame.current.srcdoc = bangunDokumenWeb(project, payload);
  };

  // Reaksi visual hasil penilaian.
  useEffect(() => {
    if (status === "lulus") {
      if (bercas.current) percik(Array.from(bercas.current.children));
      const tugasAktif = cariTugas(tugasId);
      const jumlah = tugasAktif?.mode === "web" ? tugasAktif.cek.length : 1;
      hitungNaik(skor.current, jumlah);
      munculkan(banner.current, { jarak: 10, durasi: 420 });
    }
    if (status === "gagal") getar(banner.current);
  }, [status, tugasId]);

  // Laporkan hasil hanya saat lulus — sekali per "Jalankan", bukan per ketikan. Saat luring
  // atau server tak terjangkau, hasil ditahan di antrean yang sama dengan tanda progres.
  useEffect(() => {
    if (status !== "lulus" || !tugas) return;
    const kunci = `${tugas.id}:${nomorRun.current}`;
    if (dikirim.current === kunci) return;
    dikirim.current = kunci;
    if (!user) return;

    const tahan = () => {
      queueCodeRun(tugas.id, tugas.mode, durasi);
      tulis({ kind: "system", text: "Hasil ditahan di perangkat dan dikirim begitu terhubung lagi." });
    };
    if (!online) {
      tahan();
      return;
    }
    void apiPost<{ granted: number; rank: { title: string } | null }>("/code/run", {
      task_key: tugas.id,
      mode: tugas.mode,
      passed: true,
      duration_ms: durasi,
    })
      .then((hasil) => {
        if (hasil.granted > 0) {
          tulis({ kind: "success", text: `+${hasil.granted} XP${hasil.rank ? ` · naik ke ${hasil.rank.title}` : ""}` });
        }
      })
      .catch((error) => {
        if (isUnreachable(error)) tahan();
        else tulis({ kind: "system", text: messageFor(error) });
      });
  }, [status, tugas, durasi, user, online, tulis]);

  useEffect(() => {
    const t = window.setTimeout(() => simpanDraf(simpan, { mode, project, tugasId, pembaruan: Date.now() }), 500);
    return () => window.clearTimeout(t);
  }, [mode, project, tugasId, simpan]);

  const ubahBerkas = (isi: string) => setProject((sebelum) => ({ ...sebelum, [berkas]: isi }));

  const pilihTugas = (id: string) => {
    const dipilih = cariTugas(id);
    if (!dipilih) return;
    hentikan(true);
    setTugasId(id);
    setMode(dipilih.mode);
    setProject(dipilih.mulai);
    setBerkas(dipilih.mode === "web" ? "html" : "js");
    setLogs([]);
    setCekList([]);
    setRingkasan(null);
    setDurasi(null);
    setStatus("siaga");
  };

  const diterapkan = useRef(0);
  useEffect(() => {
    if (diminta && diminta.n !== diterapkan.current) {
      diterapkan.current = diminta.n;
      pilihTugas(diminta.id);
    }
  }, [diminta, pilihTugas]);

  const gantiMode = (baru: Mode) => {
    hentikan(true);
    setMode(baru);
    setBerkas(baru === "web" ? "html" : "js");
    if (baru === "js" && !project.js.trim()) setProject({ ...project, js: "// Tulis kode di sini, lalu tekan Jalankan." });
  };

  const lulusSemua = status === "lulus";

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative overflow-hidden">
        {lulusSemua && (
          <div ref={bercas} className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-0 top-0 size-2 rounded-full"
                style={{ backgroundColor: i % 2 ? "var(--blush)" : "var(--primary)" }}
              />
            ))}
          </div>
        )}
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={mode} onValueChange={(v) => gantiMode(v as Mode)}>
              <TabsList aria-label="Mode playground">
                <TabsTrigger value="js">Algoritma (JS)</TabsTrigger>
                <TabsTrigger value="web">Halaman web (HTML/CSS/JS)</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="min-w-52 flex-1">
              <Select value={tugasId ?? ""} onValueChange={(nilai) => nilai && pilihTugas(nilai)}>
                <SelectTrigger aria-label="Pilih latihan">
                  <SelectValue placeholder="Pilih latihan…" />
                </SelectTrigger>
                <SelectContent>
                  {TUGAS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.judul} — {item.mode === "js" ? "JS" : "Web"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {tugas && (
            <div className="flex flex-wrap items-start gap-2 text-sm">
              <Badge variant={tugas.tingkat === "dasar" ? "secondary" : "outline"}>{tugas.tingkat}</Badge>
              <p className="max-w-prose text-muted-foreground">{tugas.ringkas}</p>
            </div>
          )}
          {benih?.sumber && <p className="text-xs text-muted-foreground">Kode dimuat dari Materi — sunting bebas, ini draf Anda.</p>}

          <div className="flex flex-wrap gap-2">
            <span ref={tombolRun} className="inline-flex">
              <Button onClick={jalankan} disabled={status === "jalan"} size="sm">
                <Play /> Jalankan
              </Button>
            </span>
            <Button onClick={() => hentikan()} variant="outline" size="sm">
              <Square /> Hentikan
            </Button>
            <Button
              onClick={() => tugas && pilihTugas(tugas.id)}
              variant="ghost"
              size="sm"
            >
              <RotateCcw /> Ulangi contoh
            </Button>
            {durasi !== null && <Badge variant="outline">{durasi} ms</Badge>}
            {status === "menilai" && <Badge variant="outline">menilai…</Badge>}
            {status === "jalan" && <Badge variant="secondary">berjalan…</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-2 py-3">
            {mode === "web" ? (
              <Tabs value={berkas} onValueChange={(v) => setBerkas(v as Berkas)}>
                <TabsList aria-label="Berkas proyek">
                  <TabsTrigger value="html">index.html</TabsTrigger>
                  <TabsTrigger value="css">style.css</TabsTrigger>
                  <TabsTrigger value="js">script.js</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">script.js</p>
            )}
            <div className="h-[380px] overflow-hidden rounded-lg border">
              <CodeEditor
                value={project[berkas]}
                bahasa={bahasa}
                onChange={ubahBerkas}
                ariaLabel={`Editor ${bahasa}`}
              />
            </div>
            {tugas && tugas.petunjuk.length > 0 && (
              <details className="text-sm text-muted-foreground">
                <summary className="cursor-pointer select-none font-medium">Petunjuk</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {tugas.petunjuk.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {mode === "web" && (
            <Card>
              <CardContent className="py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pratinjau langsung</p>
                <iframe
                  ref={frame}
                  title="Pratinjau kode"
                  sandbox="allow-scripts"
                  className="h-[240px] w-full rounded-lg border bg-white"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="py-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Terminal className="size-3.5" /> Konsol
              </p>
              <div className="max-h-56 min-h-24 overflow-y-auto rounded-lg bg-secondary p-3 font-mono text-[13px] leading-relaxed">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">
                    {durasi === null
                      ? "Tekan Jalankan untuk melihat hasil di sini."
                      : "Kode selesai tanpa mencetak apa pun — lihat hasil penilaiannya di bawah."}
                  </p>
                ) : (
                  logs.map((line, i) => <Baris key={`${i}-${line.text}`} line={line} />)
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {ringkasan && (
        <div
          ref={banner}
          className={`rounded-xl border px-4 py-3 text-sm ${
            lulusSemua ? "border-emerald-500/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" : "border-blush/50 bg-blush-soft text-rose-900 dark:text-rose-100"
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            {lulusSemua ? <Check className="size-4" /> : <X className="size-4" />}
            <span ref={skor} className="tabular-nums" />
            {lulusSemua ? "latihan beres" : "belum beres"} · {ringkasan.detail}
          </p>
          {mode === "js" && tugas?.harapan.length ? (
            <p className="mt-1 opacity-80">Yang dinilai: {tugas.harapan.length} baris output konsol, persis dan berurutan.</p>
          ) : null}
        </div>
      )}

      {mode === "web" && cekList.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {cekList.map((c) => (
            <li key={c.selector}>
              <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${c.ok ? "border-emerald-500/40" : "border-muted-foreground/25"}`}>
                {c.ok ? <Check className="mt-0.5 size-4 text-emerald-600" /> : <X className="mt-0.5 size-4 text-rose-600" />}
                <span>{c.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Mode Algoritma berjalan di Web Worker: tanpa <code>document</code>, tapi bisa dihentikan paksa bila terjadi
        perulangan tak berujung. Mode Halaman web berjalan di iframe terlindungi: kode tidak boleh mengakses jaringan
        atau halaman EduVerse.
      </p>
    </div>
  );
}
