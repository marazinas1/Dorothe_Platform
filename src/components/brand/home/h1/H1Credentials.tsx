import { credItems, type HomeTemplateProps } from "../types";

/**
 * Qualification as an argument set out on paper: one paragraph in her own voice,
 * then three hairline columns. The certificate line under each column carries
 * the amber, so the evidence is what the eye lands on.
 */
export function H1Credentials({ copy, media, settings }: HomeTemplateProps) {
  const intro = copy.text("cred_intro");
  const title = copy.text("cred_title");
  const items = credItems(copy);
  if (!intro && items.length === 0) return null;

  return (
    <section className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 py-[72px] md:px-10 lg:grid-cols-[5fr_6fr] lg:gap-16 lg:py-[104px]">
      {media.portrait ? (
        <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-card">
          <img src={media.portrait} alt={settings.primary_agent_name ?? settings.site_name} className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div>
        {title ? <h2 className="text-section-sm max-w-[19ch] text-balance">{title}</h2> : null}
        {intro ? <p className="mt-6 max-w-[60ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.55]">{intro}</p> : null}
        {items.length > 0 ? (
        <div className="mt-9 border-t border-border">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid gap-1 border-b border-border py-4 sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <div><h3 className="font-heading text-base">{item.title}</h3>{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}</div>
              {item.tag ? (
                <div className="text-sm text-muted-foreground sm:text-right">{item.tag}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {settings.primary_agent_name ? <div className="mt-7 text-xl font-bold">{settings.primary_agent_name}</div> : null}
      {settings.primary_agent_role ? <div className="text-sm text-muted-foreground">{settings.primary_agent_role}</div> : null}
      </div>
    </section>
  );
}
