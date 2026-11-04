import { useCallback, useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  error: unknown;
  loading: boolean;
}

const inflight = new Map<string, Promise<unknown>>();

/** Menjalankan loader sekali per kunci agar efek yang berjalan ganda tidak menggandakan request. */
export function shared<T>(key: string, loader: () => Promise<T>): Promise<T> {
  let promise = inflight.get(key);
  if (!promise) {
    promise = loader().finally(() => inflight.delete(key));
    inflight.set(key, promise);
  }
  return promise as Promise<T>;
}

export function useData<T>(
  key: string,
  loader: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((previous) => ({ ...previous, loading: true }));
    shared(`${key}:${nonce}`, loader).then(
      (data) => alive && setState({ data, error: null, loading: false }),
      (error) => alive && setState((previous) => ({ data: previous.data, error, loading: false })),
    );
    return () => {
      alive = false;
    };
  }, [key, nonce, ...deps]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);
  return { ...state, reload };
}
