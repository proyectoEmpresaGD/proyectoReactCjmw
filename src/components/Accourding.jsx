import { Carrusel } from "./carrusel";
import cocina1 from "../public";
import cocina2 from "../public";
import cocina3 from "../public";
import cocina4 from "../public";
import cocina5 from "../public";

const coolImages = [
  {
    header: "Canada",
    Image: cocina1,
    text: `Image description`,
  },

  {
    header: "New Zealand",
    Image: cocina2,
    text: `Image description`,
  },

  {
    header: "Indonesia",
    Image: cocina3,
    text: `Image description`,
  },
  {
    header: "South Africa",
    Image: cocina4,
    text: `Image description`,
  },
  {
    header: "Spain",
    Image: cocina5,
    text: `Image description`,
  },
];

export const ImageAccordionExample = () => (
  <section className="page">
    <Carrusel items={coolImages} />
  </section>
);