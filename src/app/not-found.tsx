import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="font-display text-sm uppercase tracking-[0.4em] text-brass-2">Case Files</p>
      <h1 className="mt-2 font-display text-3xl text-cream">This file doesn&apos;t exist</h1>
      <p className="mt-2 text-cream/70">The page you were looking for has gone missing — rather like Inspector Vance.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Return home
      </Link>
    </div>
  );
}
