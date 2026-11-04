import { useState } from "react";
import { apiGet, apiPost, messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link, useRouter } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { Course, DiscussionPayload, MinePayload } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, MessagesSquare, Plus } from "lucide-react";

function inisial(nama?: string) {
  return (nama ?? "?").slice(0, 2).toUpperCase();
}

const BELUM_MODUL: DiscussionPayload = { module: { id: "", slug: "", title: "modul ini" }, threads: [], can_post: false };

function TanyaCard({ modulId, onSelesai }: { modulId: string; onSelesai: () => void }) {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");

  const kirim = async () => {
    setSibuk(true);
    setPesan("");
    try {
      const hasil = await apiPost<{ thread_id: string; module_slug: string }>("/discussion/thread", {
        module_id: modulId,
        title: judul,
        body: isi,
      });
      setJudul("");
      setIsi("");
      onSelesai();
      window.setTimeout(() => window.location.assign(`/diskusi/${hasil.thread_id}`), 200);
    } catch (error) {
      setPesan(messageFor(error));
    } finally {
      setSibuk(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ajukan pertanyaan</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tanya-judul">Judul pertanyaan</Label>
          <Input
            id="tanya-judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: kenapa state saya tidak ter-update?"
            minLength={8}
            maxLength={140}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tanya-isi">Detail</Label>
          <Textarea
            id="tanya-isi"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            placeholder="Ceritakan apa yang sudah Anda coba dan hasil yang muncul."
            rows={4}
            maxLength={4000}
          />
        </div>
        {pesan && (
          <p role="alert" className="text-sm text-destructive">
            {pesan}
          </p>
        )}
        <Button size="sm" className="w-fit" onClick={kirim} disabled={sibuk || judul.trim().length < 8 || isi.trim().length < 10}>
          <Plus /> Kirim pertanyaan
        </Button>
      </CardContent>
    </Card>
  );
}

export function DiscussionPage() {
  const { user, refresh } = useApp();
  const { query } = useRouter();
  const [pilihModul, setPilihModul] = useState(query.get("modul") ?? "");
  const [bukaForm, setBukaForm] = useState(false);

  const daftar = useData("catalog:ringkas", () => apiGet<Course[]>("/catalog"), []);

  const opsi = (daftar.data ?? []).flatMap((kursus) =>
    kursus.modules.map((modul) => ({ slug: modul.slug, id: modul.id, label: `${kursus.title} — ${modul.title}` })),
  );

  const slug = query.get("modul") || pilihModul || opsi[0]?.slug || "";
  const list = useData(`discussion:${slug}`, () => (slug ? apiGet<DiscussionPayload>(`/discussion/${slug}`) : Promise.resolve(BELUM_MODUL)), [slug]);
  const punya = useData("discussion:mine", () => (user ? apiGet<MinePayload>("/discussion") : Promise.resolve({ threads: [], posts: [] })), [user?.id ?? "anon"]);

  const modulId = opsi.find((modul) => modul.slug === slug)?.id;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Kolom diskusi</h1>
        <p className="text-sm text-muted-foreground">
          Tanya di modul mana pun; jawaban terbaik bisa ditandai sebagai kunci dan pemberinya dapat XP.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="modul-diskusi">Modul</Label>
          <Select
            value={slug}
            onValueChange={(nilai) => {
              setPilihModul(nilai ?? "");
              setBukaForm(false);
            }}
          >
            <SelectTrigger id="modul-diskusi" className="w-full">
              <SelectValue placeholder="Pilih modul" />
            </SelectTrigger>
            <SelectContent>
              {opsi.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" variant={bukaForm ? "secondary" : "default"} disabled={!user || !modulId} onClick={() => setBukaForm((v) => !v)}>
          <MessagesSquare /> {bukaForm ? "Tutup form" : "Tanya di modul ini"}
        </Button>
      </div>

      {!user && (
        <p className="rounded-lg border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
          <Link to="/masuk" className="font-medium text-primary">
            Masuk dengan email
          </Link>{" "}
          untuk bertanya atau menjawab.
        </p>
      )}

      {bukaForm && modulId && <TanyaCard modulId={modulId} onSelesai={() => { void list.reload(); void punya.reload(); void refresh(); }} />}

      <AsyncBlock state={list} rows={3}>
        {(isi) => (
          <div className="flex flex-col gap-3">
            {isi.threads.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {slug ? `Belum ada pertanyaan di modul ${isi.module.title}. Jadilah yang pertama.` : "Memuat daftar modul…"}
              </p>
            )}
            {isi.threads.map((thread) => (
              <Card key={thread.id}>
                <CardContent className="flex items-start gap-3 py-4">
                  <Avatar className="size-9">
                    <AvatarImage src={thread.author?.picture} alt="" />
                    <AvatarFallback>{inisial(thread.author?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Link to={`/diskusi/${thread.id}`} className="text-sm font-medium hover:text-primary">
                      {thread.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {thread.author?.name ?? "Peserta"} · {new Date(thread.created_at).toLocaleDateString("id-ID")} ·{" "}
                      {thread.answer_count} balasan
                    </p>
                  </div>
                  {thread.answered ? (
                    <Badge variant="secondary" className="shrink-0 gap-1">
                      <CheckCircle2 className="size-3" /> terjawab
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0">
                      belum terjawab
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AsyncBlock>

      {user && (
        <AsyncBlock state={punya} rows={2}>
          {(isi) =>
            isi.threads.length === 0 && isi.posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Anda belum pernah berdiskusi di sini.</p>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Kiriman Anda</h2>
                {isi.threads.map((thread) => (
                  <Link
                    key={thread.id}
                    to={`/diskusi/${thread.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                  >
                    <span className="min-w-0 truncate">{thread.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{thread.answer_count} balasan</span>
                  </Link>
                ))}
                {isi.posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    to={`/diskusi/${post.thread_id}`}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                  >
                    {post.accepted && <CheckCircle2 className="size-4 shrink-0 text-success" />}
                    <span className="min-w-0 truncate text-muted-foreground">{post.body.slice(0, 90)}</span>
                  </Link>
                ))}
              </div>
            )
          }
        </AsyncBlock>
      )}
    </div>
  );
}
