import { Leaf } from "lucide-react";

/** Shown on the live route when a site exists but has never been published (design §5). */
export default function ComingSoon({ brandName }: { brandName: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
        <Leaf className="h-7 w-7" />
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {brandName} is coming soon
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        This page hasn&apos;t been published yet. Check back shortly.
      </p>
    </div>
  );
}
