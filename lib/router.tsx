import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

interface RouterValue {
  pathname: string;
  query: URLSearchParams;
  navigate(to: string, options?: { replace?: boolean }): void;
}

const RouterContext = createContext<RouterValue | null>(null);

const current = (): { pathname: string; search: string } =>
  typeof window === "undefined"
    ? { pathname: "/", search: "" }
    : { pathname: window.location.pathname, search: window.location.search };

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(current);

  useEffect(() => {
    const onPop = () => setLocation(current());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin);
    const here = current();
    if (url.pathname === here.pathname && url.search === here.search) return;
    const method = options?.replace ? "replaceState" : "pushState";
    window.history[method]({}, "", `${url.pathname}${url.search}${url.hash}`);
    setLocation({ pathname: url.pathname, search: url.search });
    if (!options?.replace) window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ pathname: location.pathname, query: new URLSearchParams(location.search), navigate }),
    [location, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const context = useContext(RouterContext);
  if (context) return context;
  const here = current();
  return {
    pathname: here.pathname,
    query: new URLSearchParams(here.search),
    navigate: (to) => {
      window.location.assign(to);
    },
  };
}

/** `(pathname, "/materi/:slug")` → `{ slug: "css-dasar" }` atau `null`. */
export function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const want = pattern.split("/").filter(Boolean);
  const got = pathname.split("/").filter(Boolean);
  if (want.length !== got.length) return null;
  const params: Record<string, string> = {};
  for (let index = 0; index < want.length; index += 1) {
    const segment = want[index];
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = decodeURIComponent(got[index]);
      continue;
    }
    if (segment !== got[index]) return null;
  }
  return params;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to, { replace });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
