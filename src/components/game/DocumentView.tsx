import type { DocumentContent } from "@/game/types";

/** Renders an in-world document on paper with a style matching its type. */
export function DocumentView({ doc }: { doc: DocumentContent }) {
  const style = doc.style ?? "typed";
  const hand = style === "handwritten";
  const font = hand ? "paper-hand" : style === "newspaper" ? "font-display" : "paper-typed";
  return (
    <article className={`paper relative mx-auto max-w-prose rounded-sm px-5 py-5 sm:px-7 ${style === "telegram" ? "bg-[#efe1a8]" : ""}`} aria-label={doc.title}>
      <div className="mb-3 border-b border-black/20 pb-2 text-[11px] uppercase tracking-[0.18em] text-black/60">{doc.title}</div>
      {style === "telegram" && <div className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-[#6b2430]">WRENMOOR TELEGRAPH CO.</div>}
      <div className={`${font} space-y-3 text-[15px] leading-relaxed`}>
        {doc.body.map((p, i) =>
          style === "newspaper" && i === 0 ? (
            <h3 key={i} className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-black">
              {p}
            </h3>
          ) : style === "ledger" ? (
            <p key={i} className="border-b border-dashed border-black/20 pb-1 font-mono text-[13px]">
              {p}
            </p>
          ) : (
            <p key={i} className={hand ? "text-[17px]" : undefined}>
              {p}
            </p>
          ),
        )}
      </div>
      {doc.signature && <div className={`mt-4 text-right ${hand ? "paper-hand text-lg" : "italic"}`}>— {doc.signature}</div>}
    </article>
  );
}
