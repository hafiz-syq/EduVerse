import { useState } from "react";
import { apiGet, apiPost, messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { AdminPayload, BlockType, Course } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Pencil, ShieldAlert, X } from "lucide-react";

const SLOT = ["top-banner", "sidebar", "in-feed", "module-footer"] as const;

const LABEL_COUNT: Record<string, string> = {
  courses: "kursus",
  modules: "modul",
  lessons: "pelajaran",
  banks: "bank soal",
  questions: "soal",
  tournaments: "tantangan",
};

function Galat({ pesan }: { pesan: string }) {
  if (!pesan) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>{pesan}</AlertDescription>
    </Alert>
  );
}

function Sukses({ pesan }: { pesan: string }) {
  if (!pesan) return null;
  return (
    <p role="status" className="text-sm text-success">
      {pesan}
    </p>
  );
}

function PenyuntingPelajaran({ modul }: { modul: Course["modules"][number] }) {
  const [pelajaranId, setPelajaranId] = useState(modul.lessons[0]?.id ?? "");
  const [judul, setJudul] = useState(modul.lessons[0]?.title ?? "");
  const [blok, setBlok] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState("");

  const muat = async (id: string) => {
    setPelajaranId(id);
    setSukses("");
    setGalat("");
    const les = modul.lessons.find((item) => item.id === id);
    setJudul(les?.title ?? "");
    if (!les) {
      setBlok("");
      return;
    }
    try {
      const detail = await apiGet<{ module: { lessons: { id: string; title: string; body: { blocks: unknown[] } }[] } }>(
        `/module/${modul.slug}`,
      );
      const penuh = detail.module.lessons.find((item) => item.id === id);
      setJudul(penuh?.title ?? les.title);
      setBlok(JSON.stringify(penuh?.body?.blocks ?? [], null, 2));
    } catch (error) {
      setGalat(messageFor(error));
    }
  };

  const simpan = async () => {
    setSibuk(true);
    setGalat("");
    setSukses("");
    try {
      const blocks = JSON.parse(blok) as { type: BlockType; text?: string; lang?: string; items?: string[] }[];
      await apiPost("/admin/lesson", { lesson_id: pelajaranId, title: judul, blocks });
      setSukses("Pelajaran tersimpan.");
    } catch (error) {
      setGalat(error instanceof SyntaxError ? "Blok harus berupa JSON array yang sah." : messageFor(error));
    } finally {
      setSibuk(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pelajaran · {modul.title}</CardTitle>
        <CardDescription>Isi blok sebagai array JSON: {`[{ "type": "p", "text": "…" }, { "type": "code", "text": "…", "lang": "js" }]`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Select value={pelajaranId} onValueChange={muat}>
          <SelectTrigger aria-label="Pilih pelajaran"><SelectValue placeholder="Pilih pelajaran" /></SelectTrigger>
          <SelectContent>
            {modul.lessons.map((les) => (
              <SelectItem key={les.id} value={les.id}>{les.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="judul-pelajaran">Judul</Label>
          <Input id="judul-pelajaran" value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={120} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="blok-pelajaran">Blok isi</Label>
          <Textarea id="blok-pelajaran" rows={10} value={blok} onChange={(e) => setBlok(e.target.value)} className="font-mono text-xs" />
        </div>
        <Galat pesan={galat} />
        <Sukses pesan={sukses} />
        <Button size="sm" className="w-fit" onClick={simpan} disabled={sibuk || !pelajaranId}>
          <Pencil /> {sibuk ? "Menyimpan" : "Simpan pelajaran"}
        </Button>
      </CardContent>
    </Card>
  );
}

function IklanAdmin() {
  const state = useData("admin:overview", () => apiGet<AdminPayload>("/admin/overview"), []);
  const [slotKey, setSlotKey] = useState<(typeof SLOT)[number]>("top-banner");
  const [judul, setJudul] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [target, setTarget] = useState("");
  const [aktif, setAktif] = useState(true);
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState("");

  const simpan = async () => {
    setGalat("");
    setSukses("");
    try {
      await apiPost("/admin/ad", { slot_key: slotKey, title: judul, sponsor, target_url: target, enabled: aktif });
      setSukses("Slot iklan disimpan.");
      state.reload();
    } catch (error) {
      setGalat(messageFor(error));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metrik hari ini</CardTitle>
          <CardDescription>Hanya catatan tayangan dan klik lokal; AdSense tetap perlu penempatan skrip.</CardDescription>
        </CardHeader>
        <CardContent>
          <AsyncBlock state={state} rows={2}>
            {(isi) => (
              <ul className="flex flex-col gap-2 text-sm">
                <li className="text-xs text-muted-foreground">Tanggal {isi.ads.day}</li>
                {isi.ads.slots.map((slot) => (
                  <li key={slot.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-1 last:border-0">
                    <span className="min-w-0 truncate">
                      {slot.slot_key} · {slot.title || "(tanpa judul)"}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      tayang {slot.views} · klik {slot.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AsyncBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Isi slot iklan sendiri</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slot-iklan">Lokasi slot</Label>
            <Select value={slotKey} onValueChange={(nilai) => setSlotKey((nilai ?? "top-banner") as (typeof SLOT)[number])}>
              <SelectTrigger id="slot-iklan"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SLOT.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="iklan-judul">Judul iklan</Label>
              <Input id="iklan-judul" value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={120} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="iklan-sponsor">Nama sponsor</Label>
              <Input id="iklan-sponsor" value={sponsor} onChange={(e) => setSponsor(e.target.value)} maxLength={40} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="iklan-tautan">Tautan tujuan (harus https)</Label>
            <Input id="iklan-tautan" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="iklan-aktif" checked={aktif} onCheckedChange={(nilai) => setAktif(Boolean(nilai))} />
            <Label htmlFor="iklan-aktif">Tampilkan slot ini</Label>
          </div>
          <Galat pesan={galat} />
          <Sukses pesan={sukses} />
          <Button size="sm" className="w-fit" onClick={simpan}>
            Simpan slot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPage() {
  const { user } = useApp();
  const state = useData("admin:overview", () => apiGet<AdminPayload>("/admin/overview"), [user?.id ?? "anon"]);
  const [tindak, setTindak] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-6 text-sm">
          <p>Dasbor ini hanya untuk akun admin.</p>
          <Button asChild size="sm" variant="outline">
            <Link to="/">Kembali ke beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const putuskan = async (flagId: string, status: "resolved" | "dismissed") => {
    setTindak(`${flagId}:${status}`);
    try {
      await apiPost("/admin/moderate", { flag_id: flagId, status });
      state.reload();
    } finally {
      setTindak("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <ShieldAlert className="size-5 text-blush" /> Dasbor admin
        </h1>
        <p className="text-sm text-muted-foreground">Diedit oleh {user.name || "admin"}.</p>
      </header>

      <AsyncBlock state={state} rows={2}>
        {(isi) => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(isi.counts).map(([kunci, nilai]) => (
              <Card key={kunci}>
                <CardContent className="py-3">
                  <p className="text-lg font-semibold tabular-nums">{nilai}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{LABEL_COUNT[kunci] ?? kunci}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AsyncBlock>

      <Tabs defaultValue="moderasi">
        <TabsList>
          <TabsTrigger value="moderasi">Moderasi</TabsTrigger>
          <TabsTrigger value="iklan">Iklan</TabsTrigger>
          <TabsTrigger value="materi">Materi</TabsTrigger>
          <TabsTrigger value="peringkat">Peringkat</TabsTrigger>
        </TabsList>

        <TabsContent value="moderasi" className="flex flex-col gap-3 pt-2">
          <AsyncBlock state={state} rows={2}>
            {(isi) => (
              <>
                {isi.open_flags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tidak ada laporan terbuka.</p>
                ) : (
                  isi.open_flags.map((flag) => (
                    <Card key={flag.id}>
                      <CardContent className="flex flex-wrap items-center gap-3 py-4 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {flag.target_kind} · {flag.reason}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(flag.created_at).toLocaleString("id-ID")} WIB · target {flag.target_id.slice(0, 8)}…
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => void putuskan(flag.id, "resolved")}
                            disabled={tindak.startsWith(`${flag.id}:`)}
                          >
                            <Check /> Selesai
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void putuskan(flag.id, "dismissed")}
                            disabled={tindak.startsWith(`${flag.id}:`)}
                          >
                            <X /> Abaikan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                <h2 className="pt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Percobaan kuis terakhir
                </h2>
                <Card>
                  <CardContent className="flex flex-col py-2">
                    {isi.recent_attempts.slice(0, 10).map((baris) => (
                      <div key={baris.id} className="flex items-center justify-between gap-2 border-b border-border/60 px-1 py-1.5 text-sm last:border-0">
                        <span className="text-xs text-muted-foreground">
                          {new Date(baris.started_at).toLocaleString("id-ID")} WIB · pengguna {baris.user_id.slice(0, 8)}…
                        </span>
                        <span className="flex items-center gap-2 tabular-nums">
                          <span className="font-semibold">{baris.score}</span>
                          <Badge variant={baris.status === "pass" ? "default" : baris.status === "late" ? "secondary" : "outline"}>
                            {baris.status}
                          </Badge>
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </AsyncBlock>
        </TabsContent>

        <TabsContent value="iklan" className="pt-2">
          <IklanAdmin />
        </TabsContent>

        <TabsContent value="materi" className="flex flex-col gap-4 pt-2">
          <AsyncBlock state={state} rows={1}>
            {() => (
              <p className="text-sm text-muted-foreground">
                Pilih modul untuk menyunting pelajarannya. Daftar modul dimuat dari katalog.
              </p>
            )}
          </AsyncBlock>
          <PenyuntingModul />
        </TabsContent>

        <TabsContent value="peringkat" className="pt-2">
          <AsyncBlock state={state} rows={2}>
            {(isi) => (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Jalur peringkat</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {isi.ranks.map((tingkat) => (
                    <div key={tingkat.rank_key} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span aria-hidden className="size-3 rounded-full" style={{ background: tingkat.color }} />
                          {tingkat.title}
                        </span>
                        <span className="tabular-nums text-muted-foreground">{tingkat.threshold} XP</span>
                      </div>
                      <Progress value={Math.min(100, tingkat.threshold / 60)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </AsyncBlock>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PenyuntingModul() {
  const daftar = useData("catalog:admin", () => apiGet<Course[]>("/catalog"), []);
  const [slug, setSlug] = useState("");
  const modul = (daftar.data ?? []).flatMap((kursus) => kursus.modules).find((item) => item.slug === slug);

  return (
    <div className="flex flex-col gap-4">
      <Select value={slug} onValueChange={(nilai) => setSlug(nilai ?? "")}>
        <SelectTrigger aria-label="Pilih modul"><SelectValue placeholder="Pilih modul" /></SelectTrigger>
        <SelectContent>
          {(daftar.data ?? []).flatMap((kursus) =>
            kursus.modules.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {kursus.title} — {item.title}
              </SelectItem>
            )),
          )}
        </SelectContent>
      </Select>
      {modul ? <PenyuntingPelajaran modul={modul} /> : <p className="text-sm text-muted-foreground">Belum ada modul.</p>}
    </div>
  );
}
