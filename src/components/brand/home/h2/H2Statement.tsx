import type { HomeTemplateProps } from "../types";

/**
 * The one spoken sentence on the page, attributed to the person who says it.
 * Only this design carries it, which is why its text lives in the design's own
 * extra field rather than in the shared set.
 */
export function H2Statement({ settings, copy, media }: HomeTemplateProps) {
  const statement = copy.text("statement");
  if (!statement) return null;

  return (
    <section className="mx-auto max-w-[1220px] px-6 py-20 lg:px-8 lg:py-24">
      <div className="max-w-[780px]">
        <p className="font-heading text-2xl leading-[1.42] md:text-[2.05rem]">{statement}</p>
        <div className="mt-7 flex items-center gap-4">
          {media.portrait ? (
            <img
              src={media.portrait}
              alt={settings.primary_agent_name ?? settings.site_name}
              className="h-13 w-13 shrink-0 rounded-full object-cover"
              style={{ height: 52, width: 52 }}
            />
          ) : null}
          <div>
            <div className="text-[14.5px] font-medium">{settings.primary_agent_name}</div>
            {settings.primary_agent_role ? (
              <div className="text-[13px] text-muted-foreground">
                {settings.primary_agent_role}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
