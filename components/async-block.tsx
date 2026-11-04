import type { ReactNode } from "react";
import { messageFor } from "@/lib/api";
import type { AsyncState } from "@/lib/use-data";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TriangleAlert } from "lucide-react";

interface AsyncBlockProps<T> {
  state: AsyncState<T> & { reload: () => void };
  rows?: number;
  children: (data: NonNullable<T>) => ReactNode;
}

export function AsyncBlock<T>({ state, rows = 3, children }: AsyncBlockProps<T>) {
  if (state.loading && !state.data) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!state.data) {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>{messageFor(state.error)}</AlertDescription>
        <button type="button" className="mt-2 text-sm font-medium underline" onClick={state.reload}>
          Coba lagi
        </button>
      </Alert>
    );
  }

  return <>{children(state.data)}</>;
}
