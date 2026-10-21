const BRAND_TONES = {
    BAS: {
        es: "Una propuesta de carácter artesanal y expresivo, donde la materia adquiere protagonismo y aporta profundidad, calidez y personalidad a cada espacio.",
        en: "An expressive, craft-inspired proposal where material takes centre stage, bringing depth, warmth and personality to every interior.",
        fr: "Une proposition expressive d’inspiration artisanale, où la matière devient essentielle et apporte profondeur, chaleur et personnalité à chaque intérieur.",
    },
    ARE: {
        es: "Una colección serena y sofisticada, construida a partir de texturas sutiles, tonalidades equilibradas y una sensibilidad contemporánea.",
        en: "A serene and sophisticated collection shaped by subtle textures, balanced tones and a contemporary sensibility.",
        fr: "Une collection sereine et sophistiquée, construite autour de textures subtiles, de tonalités équilibrées et d’une sensibilité contemporaine.",
    },
    HAR: {
        es: "Una colección de espíritu relajado y elegante, concebida para crear interiores acogedores a través del tacto, la textura y una estética atemporal.",
        en: "A relaxed yet elegant collection conceived to create welcoming interiors through texture, tactility and a timeless aesthetic.",
        fr: "Une collection à l’esprit décontracté et élégant, imaginée pour créer des intérieurs accueillants grâce au toucher, à la texture et à une esthétique intemporelle.",
    },
    FLA: {
        es: "Una colección de marcada personalidad decorativa, donde dibujo, color y textura conviven para crear composiciones llenas de carácter.",
        en: "A collection with a distinctive decorative personality, where pattern, colour and texture come together to create richly expressive interiors.",
        fr: "Une collection à forte personnalité décorative, où motifs, couleurs et textures s’associent pour créer des intérieurs riches en caractère.",
    },
    CJM: {
        es: "Una propuesta contemporánea y versátil, pensada para integrarse con naturalidad en proyectos donde materia, equilibrio y funcionalidad comparten protagonismo.",
        en: "A contemporary and versatile proposal designed to integrate naturally into interiors where material, balance and functionality share equal importance.",
        fr: "Une proposition contemporaine et polyvalente, pensée pour s’intégrer naturellement dans des projets où matière, équilibre et fonctionnalité occupent une place essentielle.",
    },
};

const normalize = (value) =>
    String(value ?? "").trim();

const splitValues = (value) =>
    normalize(value)
        .split(/[;,|]/)
        .map((item) => item.trim())
        .filter(Boolean);

const mostCommon = (values, limit = 2) => {
    const counts = new Map();

    values.forEach((value) => {
        const key = normalize(value);

        if (!key) return;

        counts.set(
            key,
            (counts.get(key) || 0) + 1
        );
    });

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([value]) => value);
};

const joinNatural = (values, language) => {
    if (!values.length) return "";

    if (values.length === 1) {
        return values[0];
    }

    const connector =
        language === "en"
            ? " and "
            : language === "fr"
                ? " et "
                : " y ";

    return `${values
        .slice(0, -1)
        .join(", ")
        }${connector}${values.at(-1)} `;
};

const getSpanishEditorial = ({
    compositions,
    usages,
    hasMaintenance,
}) => {
    const paragraphs = [];

    if (compositions.length) {
        paragraphs.push(
            `La selección de materiales aporta riqueza y profundidad al conjunto, con composiciones entre las que encontramos ${joinNatural(
                compositions,
                "es"
            )
            }. Cada referencia expresa la materia de una forma distinta, permitiendo combinar texturas y acabados dentro de un mismo lenguaje decorativo.`
        );
    } else {
        paragraphs.push(
            "La colección desarrolla un lenguaje coherente a través de la textura, el color y el acabado, permitiendo construir ambientes equilibrados y con una identidad propia."
        );
    }

    if (usages.length) {
        paragraphs.push(
            `Su versatilidad permite trasladar este universo a diferentes aplicaciones, con referencias adecuadas para ${joinNatural(
                usages,
                "es"
            )
            }. El resultado es una colección capaz de acompañar tanto composiciones sutiles como propuestas de mayor presencia visual.`
        );
    } else {
        paragraphs.push(
            "Sus referencias han sido concebidas para convivir con naturalidad dentro de diferentes propuestas de interiorismo, aportando continuidad visual y una sensación de conjunto."
        );
    }

    if (hasMaintenance) {
        paragraphs.push(
            "Para preservar las cualidades estéticas y técnicas de cada tejido, recomendamos consultar las indicaciones específicas de cuidado y mantenimiento incluidas en la ficha de cada referencia."
        );
    }

    return paragraphs.join("\n\n");
};

const getEnglishEditorial = ({
    compositions,
    usages,
    hasMaintenance,
}) => {
    const paragraphs = [];

    if (compositions.length) {
        paragraphs.push(
            `The choice of materials brings depth and richness to the collection, with compositions including ${joinNatural(
                compositions,
                "en"
            )
            }. Each reference expresses the material in its own way, allowing textures and finishes to coexist within a refined decorative language.`
        );
    } else {
        paragraphs.push(
            "The collection develops a coherent visual language through texture, colour and finish, creating balanced interiors with a distinctive identity."
        );
    }

    if (usages.length) {
        paragraphs.push(
            `Its versatility allows the collection to move naturally across different applications, with references suitable for ${joinNatural(
                usages,
                "en"
            )
            }.The result is a flexible proposal capable of supporting both understated interiors and more expressive decorative compositions.`
        );
    } else {
        paragraphs.push(
            "Its references are designed to work naturally across different interior schemes, creating visual continuity and a considered sense of harmony."
        );
    }

    if (hasMaintenance) {
        paragraphs.push(
            "To preserve the aesthetic and technical qualities of each fabric, we recommend following the specific care and maintenance instructions provided with every reference."
        );
    }

    return paragraphs.join("\n\n");
};

const getFrenchEditorial = ({
    compositions,
    usages,
    hasMaintenance,
}) => {
    const paragraphs = [];

    if (compositions.length) {
        paragraphs.push(
            `La sélection des matières apporte profondeur et richesse à l’ensemble, avec des compositions parmi lesquelles figurent ${joinNatural(
                compositions,
                "fr"
            )
            }. Chaque référence révèle la matière de manière singulière, permettant d’associer textures et finitions dans un même langage décoratif.`
        );
    } else {
        paragraphs.push(
            "La collection développe un langage cohérent autour de la texture, de la couleur et des finitions, créant des intérieurs équilibrés à l’identité affirmée."
        );
    }

    if (usages.length) {
        paragraphs.push(
            `Sa polyvalence permet d’intégrer cet univers dans différentes applications, avec des références adaptées à ${joinNatural(
                usages,
                "fr"
            )
            }.L’ensemble accompagne aussi bien les compositions discrètes que les projets décoratifs plus expressifs.`
        );
    } else {
        paragraphs.push(
            "Ses références sont conçues pour s’intégrer naturellement dans différents projets d’intérieur, en apportant continuité visuelle et harmonie."
        );
    }

    if (hasMaintenance) {
        paragraphs.push(
            "Afin de préserver les qualités esthétiques et techniques de chaque tissu, nous recommandons de consulter les indications spécifiques d’entretien associées à chaque référence."
        );
    }

    return paragraphs.join("\n\n");
};

export function buildCollectionEditorial({
    collectionName,
    brandCode,
    products = [],
    language = "es",
}) {
    const lang = ["es", "en", "fr"].includes(
        language
    )
        ? language
        : "es";

    const collection = normalize(
        collectionName
    );

    const brandTone =
        BRAND_TONES[brandCode]?.[lang] ||
        BRAND_TONES.CJM[lang];

    const compositions = mostCommon(
        products
            .map(
                (product) =>
                    product?.composicion
            )
            .filter(Boolean),
        2
    );

    const usages = mostCommon(
        products.flatMap((product) =>
            splitValues(product?.uso)
        ),
        3
    );

    const hasMaintenance = products.some(
        (product) =>
            normalize(
                product?.mantenimiento
            )
    );

    const introTop = collection
        ? `${collection} nace como ${brandTone.charAt(0).toLowerCase()}${brandTone.slice(1)} `
        : brandTone;

    let introBottom;

    const editorialData = {
        compositions,
        usages,
        hasMaintenance,
    };

    if (lang === "en") {
        introBottom =
            getEnglishEditorial(
                editorialData
            );
    } else if (lang === "fr") {
        introBottom =
            getFrenchEditorial(
                editorialData
            );
    } else {
        introBottom =
            getSpanishEditorial(
                editorialData
            );
    }

    return {
        introTop,
        introBottom,
    };
}