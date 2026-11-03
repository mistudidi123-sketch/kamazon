import { Sparkles } from "lucide-react";

export function DiwaliBar() {
  return (
    <div className="diwali-bar flex items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-wide sm:text-xs">
      <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
      <span>Diwali Special &middot; up to 60% off festive gifts, sweets &amp; d&eacute;cor &mdash; free delivery over Rs 999</span>
      <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
    </div>
  );
}
