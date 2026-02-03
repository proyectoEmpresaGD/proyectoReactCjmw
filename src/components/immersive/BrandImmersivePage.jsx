// src/components/immersive/BrandImmersivePage.jsx
import ImmersiveHero from "./ImmersiveHero";
import StickyManifesto from "./StickyManifesto";
import MaterialTriptych from "./MaterialTriptych";
import FeaturedCollectionsEditorial from "./FeaturedCollectionsEditorial";
import FinalCta from "./FinalCta";

export default function BrandImmersivePage({ page }) {
  return (
    <>
      <ImmersiveHero hero={page.hero} />
      <StickyManifesto manifesto={page.manifesto} />
      <MaterialTriptych material={page.material} />
      <FeaturedCollectionsEditorial items={page.featuredCollections} />
      <FinalCta cta={page.finalCta} accentClassName={page.theme?.accent ?? ""} />
    </>
  );
}
