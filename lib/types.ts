export type BlockType = "p" | "h2" | "h3" | "code" | "tip" | "list";

export interface LessonBlock {
  type: BlockType;
  text?: string;
  lang?: string;
  items?: string[];
}

export interface LessonBody {
  blocks: LessonBlock[];
}

export interface Bank {
  id: string;
  title: string;
  time_limit_seconds: number;
  pass_score: number;
}

export interface LessonRow {
  id: string;
  title: string;
  minutes: number;
  done: boolean;
}

export interface ModuleSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  offline_ok: boolean;
  lesson_count: number;
  lessons: LessonRow[];
  bank: Bank | null;
  percent: number;
  completed: boolean;
  course?: { slug: string; title: string; level?: string };
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  order_no: number;
  modules: ModuleSummary[];
  percent: number;
  lesson_count: number;
}

export interface EntryRow {
  place?: number;
  user_id: string;
  name?: string;
  display_name?: string;
  picture?: string;
  rank_key?: string;
  xp?: number;
  streak?: number;
  best_score?: number;
  score?: number;
  best_duration_ms?: number | null;
  duration_ms?: number | null;
  attempts?: number;
  submitted_at?: string;
  me?: boolean;
}

export interface TournamentCard {
  id: string;
  key: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds?: number;
  question_count?: number;
  status: string;
  derived_status?: string;
  remaining_ms?: number;
  my_entry?: EntryRow | null;
}

export interface HomePayload {
  continue: ModuleSummary | null;
  next: ModuleSummary | null;
  courses: { slug: string; title: string; level: string; percent: number; module_count: number; lesson_count: number }[];
  totals: { modules: number; lessons: number; done: number };
  tournament: (TournamentCard & { mode: "live" | "upcoming" }) | null;
  stats: { xp: number; rank_title: string; streak: number } | null;
}

export interface LessonDetail {
  id: string;
  title: string;
  body: LessonBody;
  order_no: number;
  minutes: number;
  done: boolean;
}

export interface ModuleDetailPayload {
  module: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    minutes: number;
    offline_ok: boolean;
    course_id: string;
    course: { slug: string; title: string; level?: string } | null;
    lessons: LessonDetail[];
    bank: Bank | null;
    threads: ThreadRow[];
  };
}

export interface Author {
  id: string;
  name: string;
  picture: string;
  rank_key: string;
}

export interface ThreadRow {
  id: string;
  title: string;
  created_at: string;
  last_activity_at?: string;
  answer_count: number;
  accepted_post_id: string | null;
  pinned?: boolean;
  locked?: boolean;
  user_id?: string;
  author?: Author;
  answered?: boolean;
}

export interface DiscussionPayload {
  module: { id: string; slug: string; title: string };
  threads: ThreadRow[];
  can_post: boolean;
}

export interface PostRow {
  id: string;
  kind?: string;
  thread_id?: string;
  user_id?: string;
  body: string;
  created_at: string;
  accepted?: boolean;
  author?: Author;
  votes?: number;
  my_vote?: number;
}

export interface ThreadDetailPayload {
  thread: ThreadRow & {
    body: string;
    module_id: string;
    module: { id: string; slug: string; title: string };
    my_thread: boolean;
    can_accept: boolean;
  };
  question: PostRow;
  posts: PostRow[];
  answered: boolean;
}

export interface QuizStartPayload {
  attempt: {
    id: string;
    deadline_at: string;
    server_time: string;
    attempt_no?: number;
    total: number;
    pass_score?: number;
    time_limit_seconds?: number;
  };
  bank?: { id: string; title: string };
  tournament?: { id: string; key: string; title: string; duration_seconds: number };
  questions: { id: string; prompt: string; options: string[] }[];
}

export interface ReviewRow {
  id: string;
  prompt: string;
  options: string[];
  chosen: number | null;
  answer: number;
  correct: boolean;
  explanation: string;
}

export interface QuizFinishPayload {
  attempt: {
    id: string;
    status: "pass" | "fail" | "late";
    score: number;
    correct: number;
    total: number;
    offline: boolean;
    pass_score?: number;
    bank_id?: string;
    module_id?: string;
    tournament_id?: string | null;
  };
  review: ReviewRow[];
  awarded?: { xp: number; rank: string | null; practice: boolean };
  standing?: { xp: number; rank_title: string; streak: number } | null;
  placement?: { place: number; total: number; prize_xp?: number; tier?: string };
  replayed?: boolean;
}

export interface AttemptRow {
  id: string;
  bank_id: string;
  attempt_no?: number;
  status: string;
  score: number;
  correct?: number;
  total?: number;
  started_at: string;
  finished_at?: string;
  offline?: boolean;
}

export interface ArenaListPayload {
  tournaments: TournamentCard[];
  live: TournamentCard | null;
  upcoming: TournamentCard[];
}

export interface WeeklyPayload {
  week: string;
  tournaments: { id: string; key: string; title: string; starts_at: string; ends_at: string }[];
  entries: EntryRow[];
  my_place: number | null;
}

export interface AllTimePayload {
  entries: EntryRow[];
  generated_at: string;
}

export interface LeaderboardPayload {
  tournament: TournamentCard;
  entries: EntryRow[];
}

export interface AdSlotRow {
  id: string;
  slot_key: string;
  kind: string;
  title: string;
  sponsor: string;
  image_path: string;
  target_url: string;
  enabled: boolean;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string;
}

export interface AdsPayload {
  slots: AdSlotRow[];
  consent_required: boolean;
}

export interface RankRow {
  rank_key: string;
  title: string;
  threshold: number;
  color: string;
  order_no: number;
  next?: string | null;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: "pembelajar" | "admin";
  xp: number;
  rank_key: string;
  rank_title: string;
  streak: number;
  longest_streak: number;
  version: number;
  source?: string;
}

export interface Providers {
  google: boolean;
  github: boolean;
  platform: boolean;
}

export interface SessionPayload {
  user: SessionUser | null;
  providers: Providers;
}

export interface PackThread {
  thread_id: string;
  title: string;
  posts: { id: string; body: string; created_at: string; accepted: boolean; user_id: string }[];
}

export interface PackPayload {
  pack: {
    hash: string;
    downloaded_at: string;
    module: { slug: string; title: string; summary: string; minutes: number; course?: { slug: string; title: string; level?: string } };
    lessons: LessonDetail[];
    questions: { id: string; prompt: string; options: string[]; order_no?: number }[];
    discussion: PackThread[];
  };
}

export interface ProfilePayload {
  user: SessionUser;
  ladder: RankRow[];
  xp_recent: { kind: string; amount: number; at: string }[];
  activity: { threads: number; answers: number; accepted: number };
  attempts: AttemptRow[];
  downloads: { module_id: string; pack_hash: string; bytes: number; created_at: string }[];
  lab: {
    total: number;
    passed: number;
    attempts: number;
    recent: {
      task_key: string;
      mode: string;
      passed: boolean;
      duration_ms: number | null;
      attempts: number;
      occurred_at: string;
    }[];
  };
  badges: string[];
  course_progress: { slug: string; title: string; percent: number }[];
}

export interface RanksPayload {
  ranks: RankRow[];
}

export interface MinePayload {
  threads: { id: string; title: string; module_id: string; created_at: string; answer_count: number; accepted_post_id: string | null }[];
  posts: { id: string; thread_id: string; body: string; created_at: string; accepted: boolean }[];
}

export interface ArenaHistoryPayload {
  attempts: {
    id: string;
    score: number;
    correct: number;
    total: number;
    status: string;
    started_at: string;
    finished_at: string;
    duration_ms: number;
    offline: boolean;
    attempt_no: number;
  }[];
}

export interface ProgressPayload {
  granted: number;
  rank?: string | null;
  streak?: number;
  already?: boolean;
}

export interface AdminPayload {
  counts: Record<string, number>;
  open_flags: { id: string; target_kind: string; target_id: string; reason: string; status: string; created_at: string }[];
  recent_attempts: { id: string; user_id: string; bank_id: string; score: number; status: string; started_at: string }[];
  ads: { day: string; slots: { id: string; slot_key: string; title: string; sponsor: string; enabled: boolean; target_url: string; views: number; clicks: number }[] };
  ranks: RankRow[];
  edited_by: string;
}
