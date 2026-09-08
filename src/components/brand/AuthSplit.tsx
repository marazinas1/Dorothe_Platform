import type { ReactNode } from "react";

type Props = {
  /** Form column content. */
  children: ReactNode;
  /** Small label above the sign-in heading. */
  eyebrow?: ReactNode;
  /** Brand mark rendered in the right-hand panel. */
  brand: ReactNode;
  /** Quiet line under the brand mark ("authorised personnel only"). */
  note?: ReactNode;
};

/**
 * Two-column authentication shell: credentials on the left, the site's own
 * logo on a calm ink panel at the right. The panel is hidden on mobile so
 * only the centred form remains.
 */
export function AuthSplit({ children, eyebrow, brand, note }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-[26rem]">
          {eyebrow ? (
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          {children}
        </div>
      </div>

      <div className="hidden flex-col items-center justify-center gap-8 bg-foreground px-10 lg:flex">
        {brand}
        <span className="h-px w-16 bg-background/40" />
        {note ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-background/60">{note}</p>
        ) : null}
      </div>
    </div>
  );
}
