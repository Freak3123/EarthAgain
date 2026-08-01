import Image from "next/image";
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Shared, server-safe building blocks for the sub-site renderers.           */
/*  Visuals mirror app/template/page.tsx, but the green accent is driven by    */
/*  the `--accent` CSS variable (set from settings.accent in SiteChrome) so    */
/*  every tenant can theme their own colour. See design §4/§5.                 */
/* -------------------------------------------------------------------------- */

/** Gradient tones cycled for image placeholders when no imageUrl is set. */
export const TONES = [
  "from-teal-700 to-teal-900",
  "from-green-800 to-green-950",
  "from-emerald-600 to-green-800",
  "from-green-700 to-emerald-900",
  "from-lime-700 to-green-900",
  "from-amber-700 to-orange-900",
];

export const primaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2";

export const ghostBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2";

export const cardShell =
  "group flex flex-col overflow-hidden rounded-lg border-0 bg-white p-0 text-black shadow-xl";

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
      <span className="h-px w-6 bg-[var(--accent)]" />
      {children}
    </span>
  );
}

/** Read-only "View All" affordance — a label, not a working link on public pages. */
export function ViewAll({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#A22D10]">
      {label} <ArrowRight className="h-5 w-5" />
    </span>
  );
}

export function SectionHead({
  kicker,
  title,
  id,
  viewAll,
}: {
  kicker: string;
  title: string;
  id?: string;
  viewAll?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2
          id={id}
          className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
        >
          {title}
        </h2>
      </div>
      <ViewAll label={viewAll} />
    </div>
  );
}

/**
 * Card media area: a real image when `src` is set, otherwise the template's
 * gradient placeholder (with an optional badge). `toneIndex` cycles TONES so
 * placeholder cards vary like the template did.
 */
export function MediaBox({
  src,
  alt,
  badge,
  toneIndex = 0,
  className = "h-52",
}: {
  src?: string;
  alt?: string;
  badge?: string;
  toneIndex?: number;
  className?: string;
}) {
  const tone = TONES[toneIndex % TONES.length];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt || ""} fill className="object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${tone}`}>
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:18px_18px]" />
        </div>
      )}
      {badge && (
        <div className="absolute bottom-3 left-3 rounded bg-black/50 px-3 py-1 text-sm text-white shadow backdrop-blur-md">
          {badge}
        </div>
      )}
    </div>
  );
}

/** Guard a value that should be an array before mapping over admin-authored data. */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
