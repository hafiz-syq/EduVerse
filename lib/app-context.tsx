import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiGet, apiPost, ApiError } from "./api";
import { dropPack, idbSupported, readPack, readPacks, savePack, type StoredPack } from "./idb";
import type { PackPayload, Providers, SessionPayload, SessionUser } from "./types";

export type Consent = "unknown" | "accepted" | "rejected";
const CONSENT_KEY = "ev_ads_consent";
const SESSION_KEY = "ev_session_snapshot";

interface AppValue {
  ready: boolean;
  user: SessionUser | null;
  providers: Providers;
  online: boolean;
  consent: Consent;
  packs: StoredPack[];
  setConsent: (next: Consent) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  downloadPack: (slug: string) => Promise<StoredPack | null>;
  forgetPack: (slug: string) => Promise<void>;
  packFor: (slug: string) => Promise<StoredPack | undefined>;
}

const AppContext = createContext<AppValue | null>(null);

const readConsent = (): Consent => {
  if (typeof localStorage === "undefined") return "accepted";
  const saved = localStorage.getItem(CONSENT_KEY);
  return saved === "accepted" || saved === "rejected" ? saved : "unknown";
};

/**
 * Snapshot sesi terakhir, dibaca hanya saat permintaan /session tidak sampai ke server.
 * Guard rute memakainya supaya paket materi yang sudah diunduh tetap terbuka di mode
 * luring; galat 401 asli dari server selalu membuang snapshot ini.
 */
const bacaSnapshot = (): SessionPayload | null => {
  try {
    const mentah = localStorage.getItem(SESSION_KEY);
    const data = mentah ? (JSON.parse(mentah) as SessionPayload) : null;
    return data?.user ? data : null;
  } catch {
    return null;
  }
};

const tulisSnapshot = (data: SessionPayload) => {
  try {
    if (data.user) localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* Penyimpanan privat penuh: akses luring saja yang terdampak, bukan keamanan sesi. */
  }
};

const hapusSnapshot = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* Tidak ada yang bisa dibersihkan kalau penyimpanan tidak tersedia. */
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [consent, setConsentState] = useState<Consent>(readConsent);
  const [packs, setPacks] = useState<StoredPack[]>([]);

  const refresh = useCallback(async () => {
    try {
      const data = await apiGet<SessionPayload>("/session");
      setSession(data);
      tulisSnapshot(data);
    } catch (error) {
      // 401/403 berarti server benar-benar tidak mengenal sesi ini: snapshot dibuang.
      // Selain itu (jaringan mati, 5xx) snapshot terakhir dipakai supaya materi luring
      // yang sudah tersimpan di perangkat tetap bisa dibuka.
      const sesiDitolak = error instanceof ApiError && (error.status === 401 || error.status === 403);
      if (sesiDitolak) hapusSnapshot();
      setSession(sesiDitolak ? null : bacaSnapshot());
    } finally {
      setReady(true);
    }
  }, []);

  const reloadPacks = useCallback(async () => {
    if (!idbSupported) return;
    try {
      setPacks(await readPacks());
    } catch {
      setPacks([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
    void reloadPacks();
    const swap = () => setOnline(navigator.onLine);
    window.addEventListener("online", swap);
    window.addEventListener("offline", swap);
    return () => {
      window.removeEventListener("online", swap);
      window.removeEventListener("offline", swap);
    };
  }, [refresh, reloadPacks]);

  const setConsent = useCallback((next: Consent) => {
    setConsentState(next);
    try {
      localStorage.setItem(CONSENT_KEY, next);
    } catch {
      /* Penyimpanan privat: preferensi hanya tidak bertahan. */
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiPost("/auth/logout");
    } finally {
      await refresh();
    }
  }, [refresh]);

  const downloadPack = useCallback(
    async (slug: string) => {
      const payload = await apiGet<PackPayload>(`/pack/${slug}`);
      const record: StoredPack = { ...payload.pack, slug, saved_at: new Date().toISOString() };
      await savePack(record);
      await reloadPacks();
      return record;
    },
    [reloadPacks],
  );

  const forgetPack = useCallback(
    async (slug: string) => {
      await dropPack(slug);
      await reloadPacks();
    },
    [reloadPacks],
  );

  const value = useMemo<AppValue>(
    () => ({
      ready,
      user: session?.user ?? null,
      providers: session?.providers ?? { google: false, github: false, platform: false },
      online,
      consent,
      packs,
      setConsent,
      refresh,
      signOut,
      downloadPack,
      forgetPack,
      packFor: (slug: string) => (idbSupported ? readPack(slug) : Promise.resolve(undefined)),
    }),
    [ready, session, online, consent, packs, setConsent, refresh, signOut, downloadPack, forgetPack],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp harus dipakai di dalam AppProvider");
  return context;
}
