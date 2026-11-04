import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";

export function ConsentBar() {
  const { consent, setConsent } = useApp();
  if (consent !== "unknown") return null;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t bg-card p-4 shadow-lg md:bottom-4 md:left-auto md:right-6 md:max-w-sm md:rounded-xl md:border">
      <p className="text-sm">
        EduVerse gratis karena slot iklan yang kami kelola sendiri. Iklan hanya muncul setelah Anda
        menyetujui; materi dan kuis tetap berjalan tanpa itu.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => setConsent("accepted")}>
          Setuju
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConsent("rejected")}>
          Tanpa iklan
        </Button>
      </div>
    </div>
  );
}
