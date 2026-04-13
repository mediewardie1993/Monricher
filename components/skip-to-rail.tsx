type SkipItem = {
  label: string;
  href: string;
};

type SkipToRailProps = {
  items: SkipItem[];
};

export function SkipToRail({ items }: SkipToRailProps) {
  return (
    <aside className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="rounded-[22px] border border-white/10 bg-slate-950/84 p-2 shadow-soft backdrop-blur-xl">
        <p className="px-3 pb-2 pt-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Skip To
        </p>
        <div className="grid gap-1.5">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
