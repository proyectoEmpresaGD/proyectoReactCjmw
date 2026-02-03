// src/components/immersive/FeaturedCollectionsEditorial.jsx
import { Link } from "react-router-dom";
import { useInView } from "./useInView";

function EditorialCard({ item }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <article
      ref={ref}
      className={[
        "group overflow-hidden rounded-3xl ring-1 ring-black/5 bg-white shadow-sm",
        "transition duration-700 motion-reduce:transition-none",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-white/80">{item.subtitle}</p>
          <Link
            to={item.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm transition hover:opacity-90"
          >
            {item.ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedCollectionsEditorial({ items }) {
  return (
    <section className="bg-black/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Últimas novedades
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Selección editorial para entrar en el universo de la marca.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <EditorialCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
