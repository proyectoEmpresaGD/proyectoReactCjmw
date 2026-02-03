// src/components/immersive/FinalCta.jsx
import { Link } from "react-router-dom";
import { useInView } from "./useInView";

export default function FinalCta({ cta, accentClassName }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div
          ref={ref}
          className={[
            "relative overflow-hidden rounded-3xl bg-black px-7 py-12 sm:px-10 sm:py-14",
            "transition duration-700 motion-reduce:transition-none",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClassName}`} />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {cta.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
              {cta.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={cta.primary.href}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                {cta.primary.label}
              </Link>
              <Link
                to={cta.secondary.href}
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                {cta.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
