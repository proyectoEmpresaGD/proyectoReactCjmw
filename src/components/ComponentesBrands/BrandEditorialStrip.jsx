export default function BrandEditorialStrip({ items }) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <div className="border-y border-zinc-200 bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 lg:px-8">
                {items.slice(0, 3).map((it) => (
                    <div key={it.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
                        <p className="text-[11px] font-medium tracking-[0.32em] text-zinc-500">
                            {it.kicker}
                        </p>
                        <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
                            {it.title}
                        </p>
                        {it.text ? (
                            <p className="mt-3 text-sm leading-relaxed text-zinc-600">{it.text}</p>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
