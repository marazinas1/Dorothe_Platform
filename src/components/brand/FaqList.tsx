type Item = { question: string; answer: string };

export function FaqList({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:grid-cols-12 md:px-10 lg:py-28">
      <h2 className="text-section md:col-span-4">{title}</h2>
      <div className="border-t border-border md:col-span-8">
        {items.map((item, index) => <details key={item.question} open={index === 0} className="group border-b border-border py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-semibold"><span>{item.question}</span><span aria-hidden className="text-xl group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-3 pr-10 text-sm leading-7 text-muted-foreground">{item.answer}</p></details>)}
      </div>
    </section>
  );
}