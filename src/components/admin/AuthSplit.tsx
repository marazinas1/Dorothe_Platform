import type { ReactNode } from "react";

type Props = {
  /** Form column content. */
  children: ReactNode;
  /** Brand mark shown above the form. */
  brand: ReactNode;
  /** Business name at the top of the dark panel. */
  title?: ReactNode;
  /** Larger line at the bottom of the dark panel. */
  tagline?: ReactNode;
  /** Quiet line under the tagline. */
  note?: ReactNode;
};

/**
 * Admin sign-in split screen (broker-admin.html): form on the left, a dark
 * brand panel on the right. Below 900px the panel stacks under the form.
 */
export function AuthSplit({ children, brand, title, tagline, note }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-card min-[900px]:grid-cols-2">
      <div className="flex items-center justify-center p-10">
        <div className="flex w-full max-w-[360px] flex-col gap-4">
          <div className="mb-3">{brand}</div>
          {children}
        </div>
      </div>
      <div className="flex min-h-[200px] flex-col justify-between bg-sidebar p-12 text-sidebar-accent-foreground">
        {title ? <div className="text-[22px] font-bold">{title}</div> : <span />}
        <div>
          {tagline ? <p className="max-w-[30ch] text-xl leading-snug">{tagline}</p> : null}
          {note ? <p className="mt-2 text-sidebar-foreground">{note}</p> : null}
        </div>
      </div>
    </div>
  );
}
