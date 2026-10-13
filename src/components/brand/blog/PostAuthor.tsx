import type { ReactNode } from "react";

/** Author box closing an article: portrait, name, one line, one primary action. */
export function PostAuthor({
  name,
  role,
  photo,
  action,
}: {
  name: string;
  role: string | null;
  photo: string | null;
  action: ReactNode;
}) {
  return (
    <div className="mt-14 flex flex-wrap items-center gap-[18px] rounded-[var(--radius)] bg-card p-7">
      {photo ? (
        <img src={photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
      ) : (
        <span aria-hidden className="h-16 w-16 shrink-0 rounded-full bg-muted" />
      )}
      <div className="min-w-0">
        <b className="block">{name}</b>
        {role ? <p className="mt-0.5 text-[15px] text-muted-foreground">{role}</p> : null}
      </div>
      <div className="ml-auto">{action}</div>
    </div>
  );
}
