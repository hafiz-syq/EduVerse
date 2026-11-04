import { useState } from "react";
import { apiGet, apiPost, messageFor } from "@/lib/api";
import { useApp } from "@/lib/app-context";
import { Link } from "@/lib/router";
import { useData } from "@/lib/use-data";
import type { ThreadDetailPayload } from "@/lib/types";
import { AsyncBlock } from "@/components/async-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Flag, ThumbsDown, ThumbsUp } from "lucide-react";

const inisial = (nama?: string) => (nama ?? "?").slice(0, 2).toUpperCase();

interface Nilai {
  votes: number;
  my_vote: number;
}

function TombolVoting({ id, nilai, threadId, onNilai }: { id: string; nilai: Nilai; threadId: string; onNilai: (hasil: Nilai) => void }) {
  const [pesan, setPesan] = useState("");

  const pilih = async (nilaiBaru: number) => {
    const tujuan = nilai.my_vote === nilaiBaru ? 0 : nilaiBaru;
    setPesan("");
    try {
      const hasil = await apiPost<{ post_id: string; votes: number }>("/discussion/vote", {
        thread_id: threadId,
        post_id: id,
        value: tujuan,
      });
      onNilai({ votes: hasil.votes, my_vote: tujuan });
    } catch (error) {
      setPesan(messageFor(error));
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" aria-label="Setuju" onClick={() => pilih(1)}>
        <ThumbsUp className={nilai.my_vote === 1 ? "text-success" : ""} />
      </Button>
      <span className="text-sm font-semibold tabular-nums">{nilai.votes}</span>
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" aria-label="Tidak setuju" onClick={() => pilih(-1)}>
        <ThumbsDown className={nilai.my_vote === -1 ? "text-destructive" : ""} />
      </Button>
      {pesan && <p className="max-w-24 text-center text-[10px] text-destructive">{pesan}</p>}
    </div>
  );
}

export function ThreadDetailPage({ id }: { id: string }) {
  const { user, refresh } = useApp();
  const state = useData(`thread:${id}`, () => apiGet<ThreadDetailPayload>(`/thread/${id}`), [id]);
  const [nilai, setNilai] = useState<Record<string, Nilai>>({});
  const [jawaban, setJawaban] = useState("");
  const [sedang, setSedang] = useState(false);
  const [pesan, setPesan] = useState("");

  const gabung = (post: { id: string; votes?: number; my_vote?: number }) => ({
    ...(nilai[post.id] ?? { votes: post.votes ?? 0, my_vote: post.my_vote ?? 0 }),
  });

  const tandai = async (postId: string, unaccept: boolean) => {
    setPesan("");
    try {
      await apiPost("/discussion/accept", { thread_id: id, post_id: postId, unaccept });
      await refresh();
      state.reload();
    } catch (error) {
      setPesan(messageFor(error));
    }
  };

  const laporkan = async (targetId: string, targetKind: string) => {
    const sebab = window.prompt("Kenapa konten ini perlu ditinjau? (minimal 3 karakter)");
    if (!sebab) return;
    setPesan("");
    try {
      await apiPost("/discussion/flag", { target_id: targetId, target_kind: targetKind, reason: sebab });
      setPesan("Laporan terkirim ke admin.");
    } catch (error) {
      setPesan(messageFor(error));
    }
  };

  const jawab = async () => {
    setSedang(true);
    setPesan("");
    try {
      await apiPost("/discussion/post", { thread_id: id, body: jawaban });
      setJawaban("");
      await refresh();
      state.reload();
    } catch (error) {
      setPesan(messageFor(error));
    } finally {
      setSedang(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AsyncBlock state={state} rows={3}>
        {(isi) => {
          const urutan = [...isi.posts].sort((a, b) => {
            if (a.id === isi.thread.accepted_post_id) return -1;
            if (b.id === isi.thread.accepted_post_id) return 1;
            return gabung(b).votes - gabung(a).votes;
          });

          return (
            <>
              <header className="flex flex-col gap-2">
                <Link
                  to={`/diskusi?modul=${encodeURIComponent(isi.thread.module?.slug ?? "")}`}
                  className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" /> kembali ke diskusi {isi.thread.module?.title ?? ""}
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight">{isi.thread.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {isi.answered && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="size-3" /> terjawab
                    </Badge>
                  )}
                  {isi.thread.locked && <Badge variant="outline">dikunci</Badge>}
                  <span>{isi.thread.answer_count ?? isi.posts.length} balasan</span>
                </div>
              </header>

              {pesan && (
                <p role="alert" className="rounded-lg border bg-secondary/60 px-3 py-2 text-sm">
                  {pesan}
                </p>
              )}

              <Card>
                <CardContent className="flex items-start gap-3 py-4">
                  <TombolVoting
                    id={isi.question.id}
                    nilai={gabung(isi.question)}
                    threadId={id}
                    onNilai={(hasil) => setNilai((sebelumnya) => ({ ...sebelumnya, [isi.question.id]: hasil }))}
                  />
                  <div className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed">{isi.question.body}</div>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => void laporkan(isi.thread.id, "thread")}>
                    <Flag className="size-3.5" /> lapor
                  </Button>
                </CardContent>
              </Card>

              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {isi.posts.length} jawaban
              </h2>

              {urutan.map((post) => (
                <Card key={post.id} className={post.id === isi.thread.accepted_post_id ? "border-success" : undefined}>
                  <CardContent className="flex items-start gap-3 py-4">
                    <TombolVoting
                      id={post.id}
                      nilai={gabung(post)}
                      threadId={id}
                      onNilai={(hasil) => setNilai((sebelumnya) => ({ ...sebelumnya, [post.id]: hasil }))}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage src={post.author?.picture} alt="" />
                          <AvatarFallback>{inisial(post.author?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{post.author?.name ?? "Peserta"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString("id-ID")}
                        </span>
                        {post.id === isi.thread.accepted_post_id && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="size-3" /> jawaban kunci
                          </Badge>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{post.body}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {isi.thread.can_accept && (
                          <Button
                            size="sm"
                            variant={post.id === isi.thread.accepted_post_id ? "secondary" : "outline"}
                            onClick={() => void tandai(post.id, post.id === isi.thread.accepted_post_id)}
                          >
                            <CheckCircle2 className="size-3.5" />
                            {post.id === isi.thread.accepted_post_id ? "Batalkan tanda" : "Tandai sebagai kunci"}
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => void laporkan(post.id, "post")}>
                          <Flag className="size-3.5" /> lapor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tulis jawaban</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {user ? (
                    <>
                      <Textarea
                        value={jawaban}
                        onChange={(e) => setJawaban(e.target.value)}
                        rows={4}
                        maxLength={4000}
                        placeholder="Jelaskan langkahnya supaya peserta lain bisa mengikuti."
                      />
                      {isi.thread.locked ? (
                        <p className="text-sm text-muted-foreground">Pertanyaan ini dikunci, jadi tidak bisa dibalas lagi.</p>
                      ) : (
                        <Button
                          size="sm"
                          className="w-fit"
                          disabled={sedang || jawaban.trim().length < 4}
                          onClick={jawab}
                        >
                          Kirim jawaban
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <Link to="/masuk" className="font-medium text-primary">
                        Masuk dengan email
                      </Link>{" "}
                      untuk menjawab.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          );
        }}
      </AsyncBlock>
    </div>
  );
}
