import {
    homeBrands,
} from "./homeBrands";


const HOME_BRAND_ORDER = [
    "arena",
    "bassari",
    "flamenco",
    "harbour",
    "cjm",
];


const HOME_BRAND_PRESENTATION = {
    arena: {
        descriptionKey:
            "brands.arena.description",
    },

    bassari: {
        descriptionKey:
            "brands.bassari.description",
    },

    cjm: {
        descriptionKey:
            "brands.cjm.description",
    },

    flamenco: {
        descriptionKey:
            "brands.flamenco.description",
    },

    harbour: {
        descriptionKey:
            "brands.harbour.description",
    },
};


const getEditorialImage = (
    brand
) => {
    const galleryImage =
        brand?.gallery?.find(
            item =>
                item?.image
        )?.image;


    if (
        galleryImage
    ) {
        return galleryImage;
    }


    const ambientImage =
        brand?.ambients?.find(
            item =>
                item?.image
        )?.image;


    if (
        ambientImage
    ) {
        return ambientImage;
    }


    return (
        brand?.background ||
        ""
    );
};


export const homePresentationBrands =
    HOME_BRAND_ORDER
        .map(
            key => {
                const brand =
                    homeBrands.find(
                        item =>
                            item.key ===
                            key
                    );


                if (
                    !brand
                ) {
                    return null;
                }


                return {
                    ...brand,

                    descriptionKey:
                        HOME_BRAND_PRESENTATION[
                            key
                        ]?.descriptionKey ||
                        "",

                    editorialImage:
                        getEditorialImage(
                            brand
                        ),

                    collectionsRoute:
                        "/colecciones",
                };
            }
        )
        .filter(
            Boolean
        );
