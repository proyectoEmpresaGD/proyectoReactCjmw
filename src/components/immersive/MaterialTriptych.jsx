// src/components/immersive/MaterialTriptych.jsx
import { useInView } from "./useInView";

function Reveal({ children }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={[
        "transition duration-700 will-change-transform",
        "motion-reduce:transition-none",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ImageCard({ src, label }) {
  return (
    <div className="group overflow-hidden rounded-3xl ring-1 ring-black/5 bg-white shadow-sm">
      <div className="relative">
        <img
          src={src}
          alt={label}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs tracking-[0.25em] text-white/70">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function MaterialTriptych({ material }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              {material.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/70">
              {material.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {material.images.map((src, idx) => (
            <ImageCard
              key={`${src}-${idx}`}
              src={src}
              label={material.labels?.[idx] ?? "Materia"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
