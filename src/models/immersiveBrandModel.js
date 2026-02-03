// src/models/immersiveBrandModel.js
// Model: configuración por marca para renderizar páginas inmersivas (sin JSX)

export const immersiveBrandPages = {
  flamenco: {
    key: "flamenco",
    brandName: "Flamenco",
    route: "/flamencoHome",
    theme: { accent: "from-rose-500/30 via-fuchsia-500/20 to-amber-500/20" },
    hero: {
      eyebrow: "MODA TEXTIL CREATIVA",
      headline: "Patrón, ritmo y emoción",
      subheadline:
        "Una mirada contemporánea a lo artesanal: color con intención, textura con carácter y una identidad gráfica inconfundible.",
      backgroundVideo:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/VIDEOS/HOME%20VIDEO.mp4",
      backgroundImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/FLAMENCO/INDIENNE%20STRIPES/FOTOEDITADAFLAMENCONUEVO.jpg",
    },
    manifesto: {
      title: "El sello Flamenco",
      points: [
        "Patrones con intención: presencia sin estridencia.",
        "Texturas para mirar de lejos y sentir de cerca.",
        "Color como lenguaje creativo, no como adorno.",
      ],
      stickyImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/FLAMENCO/INDIENNE%20STRIPES/IMAGEN%20PORTADA%20FLAMENCO%20MOVIL.png",
    },
    material: {
      title: "Materia",
      subtitle:
        "Superficie, gesto y color. El textil como expresión.",
      images: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
      ],
      labels: ["Materia", "Ritmo", "Color"],
    },
    featuredCollections: [
      {
        title: "Indienne Stripes",
        subtitle: "Ritmo gráfico y herencia reinterpretada.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/FLAMENCO/INDIENNE%20STRIPES/FOTOEDITADAFLAMENCONUEVO.jpg",
        ctaLabel: "Explorar colección",
        href: "/colecciones/flamenco",
      },
      {
        title: "Novedades",
        subtitle: "Lo último: selección editorial.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/home_hero_desktop_no_divider_1920x900.png",
        ctaLabel: "Ver novedades",
        href: "/flamencoHome",
      },
    ],
    finalCta: {
      title: "Entrar en el universo Flamenco",
      subtitle: "Colecciones pensadas para transformar espacios con intención.",
      primary: { label: "Ver colecciones", href: "/colecciones/flamenco" },
      secondary: { label: "Ir a productos", href: "/products" },
    },
  },

  bassari: {
    key: "bassari",
    brandName: "Bassari",
    route: "/bassariHome",
    theme: { accent: "from-emerald-500/20 via-cyan-500/15 to-indigo-500/20" },
    hero: {
      eyebrow: "MODA TEXTIL CONTEMPORÁNEA",
      headline: "Elegancia con alma viajera",
      subheadline:
        "Inspiración, paleta sofisticada y una estética que combina serenidad y presencia.",
      backgroundVideo: "",
      backgroundImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/home_hero_desktop_no_divider_1920x900.png",
    },
    manifesto: {
      title: "El sello Bassari",
      points: [
        "Diseño contemporáneo con profundidad estética.",
        "Paletas equilibradas: sofisticación sin frialdad.",
        "Texturas que elevan el espacio y la prenda.",
      ],
      stickyImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/bassari_mobile_black_divider_clean_1080x1920.png",
    },
    material: {
      title: "Materia",
      subtitle: "Sutileza, profundidad y tacto.",
      images: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/bassari_mobile_black_divider_clean_1080x1920.png",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
      ],
      labels: ["Paleta", "Tacto", "Equilibrio"],
    },
    featuredCollections: [
      {
        title: "Essences du Nil",
        subtitle: "Una colección que respira calma y presencia.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/home_hero_desktop_no_divider_1920x900.png",
        ctaLabel: "Explorar colección",
        href: "/colecciones/bassari",
      },
      {
        title: "Novedades",
        subtitle: "Selección editorial de lo último.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/FLAMENCO/INDIENNE%20STRIPES/FOTOEDITADAFLAMENCONUEVO.jpg",
        ctaLabel: "Ver novedades",
        href: "/bassariHome",
      },
    ],
    finalCta: {
      title: "Entrar en el universo Bassari",
      subtitle: "Colecciones con elegancia contemporánea y materia protagonista.",
      primary: { label: "Ver colecciones", href: "/colecciones/bassari" },
      secondary: { label: "Ir a productos", href: "/products" },
    },
  },

  harbour: {
    key: "harbour",
    brandName: "Harbour",
    route: "/harbourHome",
    theme: { accent: "from-sky-500/20 via-teal-500/20 to-amber-500/15" },
    hero: {
      eyebrow: "LUMINOSIDAD Y CALMA",
      headline: "Mediterráneo, naturalidad, luz",
      subheadline:
        "Textiles que capturan la brisa: linos, rayas y atmósferas frescas.",
      backgroundVideo: "",
      backgroundImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
    },
    manifesto: {
      title: "El sello Harbour",
      points: [
        "Naturalidad: tejidos que respiran.",
        "Luz y textura para ambientes reales.",
        "Sencillez con intención y detalle.",
      ],
      stickyImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
    },
    material: {
      title: "Materia",
      subtitle: "Linos, rayas y tactos frescos.",
      images: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
      ],
      labels: ["Luz", "Raya", "Lino"],
    },
    featuredCollections: [
      {
        title: "Caribbean Party",
        subtitle: "Color y frescura mediterránea.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20LISO(1).jpg",
        ctaLabel: "Explorar colección",
        href: "/colecciones/harbour",
      },
      {
        title: "Novedades",
        subtitle: "Selección editorial de temporada.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
        ctaLabel: "Ver novedades",
        href: "/harbourHome",
      },
    ],
    finalCta: {
      title: "Entrar en el universo Harbour",
      subtitle: "Colecciones con luz, materia y naturalidad.",
      primary: { label: "Ver colecciones", href: "/colecciones/harbour" },
      secondary: { label: "Ir a productos", href: "/products" },
    },
  },

  arena: {
    key: "arena",
    brandName: "Arena",
    route: "/arenaHome",
    theme: { accent: "from-amber-500/15 via-orange-500/10 to-stone-500/15" },
    hero: {
      eyebrow: "MATERIA Y SERENIDAD",
      headline: "Texturas que habitan el espacio",
      subheadline:
        "Neutros, tacto y equilibrio: un universo calmado con mucha presencia.",
      backgroundVideo: "",
      backgroundImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
    },
    manifesto: {
      title: "El sello Arena",
      points: [
        "Materia protagonista: textura antes que ruido.",
        "Paleta serena para proyectos atemporales.",
        "Detalles que elevan, sin ocupar.",
      ],
      stickyImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
    },
    material: {
      title: "Materia",
      subtitle: "Neutros, textura y equilibrio.",
      images: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
      ],
      labels: ["Neutro", "Textura", "Calma"],
    },
    featuredCollections: [
      {
        title: "Mediterranean Stripes",
        subtitle: "Raya contemporánea con serenidad.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
        ctaLabel: "Explorar colección",
        href: "/colecciones/arena",
      },
      {
        title: "Novedades",
        subtitle: "Selección editorial de temporada.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
        ctaLabel: "Ver novedades",
        href: "/arenaHome",
      },
    ],
    finalCta: {
      title: "Entrar en el universo Arena",
      subtitle: "Colecciones con materia, serenidad y detalle.",
      primary: { label: "Ver colecciones", href: "/colecciones/arena" },
      secondary: { label: "Ir a productos", href: "/products" },
    },
  },

  cjm: {
    key: "cjm",
    brandName: "CJM",
    route: "/cjmHome",
    theme: { accent: "from-violet-500/20 via-pink-500/15 to-slate-500/15" },
    hero: {
      eyebrow: "CONTEMPORÁNEO Y VERSÁTIL",
      headline: "Textil pensado para hoy",
      subheadline:
        "Una marca dinámica: contraste, tendencia y soluciones para colecciones y proyectos.",
      backgroundVideo: "",
      backgroundImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
    },
    manifesto: {
      title: "El sello CJM",
      points: [
        "Versatilidad: del concepto al proyecto real.",
        "Contraste y contemporaneidad con intención.",
        "Texturas y propuestas para ritmo de temporada.",
      ],
      stickyImage:
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
    },
    material: {
      title: "Materia",
      subtitle: "Tendencia, contraste y textura.",
      images: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
      ],
      labels: ["Tendencia", "Mood", "Textura"],
    },
    featuredCollections: [
      {
        title: "Salt and Pepper",
        subtitle: "Contraste elegante para espacios con intención.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
        ctaLabel: "Explorar colección",
        href: "/colecciones/cjm",
      },
      {
        title: "Moodboards",
        subtitle: "Ideas rápidas para inspirar proyectos.",
        image:
          "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
        ctaLabel: "Ver moodboards",
        href: "/cjmHome",
      },
    ],
    finalCta: {
      title: "Entrar en el universo CJM",
      subtitle: "Colecciones actuales para proyectos y temporada.",
      primary: { label: "Ver colecciones", href: "/colecciones/cjm" },
      secondary: { label: "Ir a productos", href: "/products" },
    },
  },
};
