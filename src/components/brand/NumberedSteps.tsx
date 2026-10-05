import { SECTION_GAP } from "@/lib/homepage/rhythm";

export type Step = { title: string; body: string };

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
                <div className="font-sans text-2xl tabular-figures text-muted-foreground">{i + 1}</div>
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
