import { Camera, ClipboardCheck, FileSignature, Handshake, KeyRound, Megaphone, MessagesSquare, Users, type LucideIcon } from "lucide-react";

import { SECTION_GAP } from "@/lib/homepage/rhythm";

export type Step = { title: string; body: string };

/** Default sequence of a sale; a list of a different length falls back to numbers only. */
const SALE_ICONS: LucideIcon[] = [MessagesSquare, ClipboardCheck, Camera, Megaphone, Users, Handshake, FileSignature, KeyRound];

type Props = {
  title: string;
  steps: Step[];
};

/**
 * Process as a numbered list: the left column names the phase, the right one
 * explains it. Dense on purpose — the steps read as one object, not six blocks.
 */
export function NumberedSteps({ title, steps }: Props) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className={`mx-auto ${SECTION_GAP.normal} max-w-[1280px] px-5 md:px-10`}>
      <h2 className="text-section max-w-[18ch] text-balance">{title}</h2>
      <ol className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={i} className="min-h-64 border-b border-r border-border p-7">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-2xl tabular-figures text-muted-foreground">{i + 1}</span>
                  {(() => { const Icon = steps.length === SALE_ICONS.length ? SALE_ICONS[i] : null; return Icon ? <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" /> : null; })()}
                </div>
                <div className="mt-10">
                  <div className="text-section-sm">{s.title}</div>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
      </ol>
    </section>
  );
}
