// src/components/immersive/ImmersiveHero.jsx
export default function ImmersiveHero({ hero }) {
  const hasVideo = Boolean(hero.backgroundVideo);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {hasVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src={hero.backgroundVideo}
          />
        ) : (
          <img
            src={hero.backgroundImage}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        )}

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />
      </div>

      <div className="mx-auto flex min-h-[90vh] max-w-7xl items-end px-4 pb-16 pt-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.35em] text-white/75">{hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
            {hero.subheadline}
          </p>
        </div>
      </div>
    </section>
  );
}
