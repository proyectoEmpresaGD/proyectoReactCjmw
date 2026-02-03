// src/components/immersive/StickyManifesto.jsx
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

export default function StickyManifesto({ manifesto }) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl ring-1 ring-black/5">
            <img
              src={manifesto.stickyImage}
              alt=""
              className="h-[520px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              {manifesto.title}
            </h2>
            <div className="mt-8 space-y-5">
              {manifesto.points.map((p) => (
                <div
                  key={p}
                  className="rounded-2xl bg-black/[0.03] px-5 py-4 text-sm leading-relaxed text-black/80"
                >
                  {p}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
