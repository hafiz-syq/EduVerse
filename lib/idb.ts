import type { LessonDetail, PackThread } from "./types";

export interface StoredPack {
  slug: string;
  hash: string;
  saved_at: string;
  module: { slug: string; title: string; summary: string; minutes: number; course?: { slug: string; title: string; level?: string } };
  lessons: LessonDetail[];
  questions: { id: string; prompt: string; options: string[]; order_no?: number }[];
  discussion: PackThread[];
}

const DB_NAME = "eduverse-luring";
const STORE = "paket";
const VERSION = 1;

export const idbSupported = typeof indexedDB !== "undefined";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "slug" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb_gagal"));
  });
}

async function transact<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = run(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error ?? new Error("indexeddb_galat"));
    tx.oncomplete = () => db.close();
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? new Error("indexeddb_batal"));
    };
  });
}

export const savePack = (pack: StoredPack) => transact<void>("readwrite", (store) => store.put(pack));

export const readPack = (slug: string) => transact<StoredPack | undefined>("readonly", (store) => store.get(slug));

export const readPacks = () => transact<StoredPack[]>("readonly", (store) => store.getAll());

export const dropPack = (slug: string) => transact<void>("readwrite", (store) => store.delete(slug));
