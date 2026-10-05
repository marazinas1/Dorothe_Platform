import { Camera, FileText, Scale, Users } from "lucide-react";

type Item = { title: string; body: string };
const icons = [Scale, Camera, FileText, Users];

export function FeatureGrid({ title, intro, items }: { title: string; intro?: string; items: Item[] }) {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <h2 className="text-section">{title}</h2>{intro ? <p className="mt-4 text-muted-foreground">{intro}</p> : null}
        <div className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => { const Icon = icons[index] ?? Scale; return <div key={item.title} className="border-b border-r border-border p-7"><Icon className="size-5" /><h3 className="mt-8 font-heading text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p></div>; })}
        </div>
      </div>
    </section>
  );
}