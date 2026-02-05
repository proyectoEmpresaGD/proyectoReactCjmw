export const brochureCollections = [
    {
        brandId: 'arena',
        namespace: 'pageArena',
        brandHref: '/arenaHome',
        brochures: [
            {
                id: 'arena-cosy',
                title: 'COSY',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/MINIATURA-BROUCHURE-ARENA-Y-HARBOUR-BOHEMIAN.jpg',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf',
                descriptionKey: 'BrouchureBohemianArena',
            },
            {
                id: 'arena-puritty',
                title: 'PURITTY',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_ARENA.png',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/CAT_ARENA_PURITTY_CJM_23_OK.pdf',
                descriptionKey: 'BrouchurePuritty',
            },
        ],
    },
    {
        brandId: 'harbour',
        namespace: 'pageHarbour',
        brandHref: '/harbourHome',
        brochures: [
            {
                id: 'harbour-bohemian',
                title: 'BOHEMIAN',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BROCHURE_COSY_ARENA_HARBOUR.jpg',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf',
                descriptionKey: 'BrouchureBohemianHarbour',
            },
            {
                id: 'harbour-caribbean-party',
                title: 'CARIBBEAN PARTY',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BROCHURE_CARIBBEANPARTY.png',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/HAR_CARIBBEAN_PARTY_BROUCHURE_SOLOTITULARES.pdf',
                descriptionKey: 'BrouchureHarbour',
            },
        ],
    },
    {
        brandId: 'bassari',
        namespace: 'pageBassari',
        brandHref: '/bassariHome',
        brochures: [
            {
                id: 'bassari-african-soul',
                title: 'AFRICAN SOUL',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_BASSARI.jpg',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BROCHURE_BASS_EDICION_INTERGIF_25_OK.pdf',
                descriptionKey: 'BrouchureBassari',
            },
            {
                id: 'bassari-african-soul',
                title: 'AFRICAN SOUL',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA%20COLECCIONES%20ESSENCES%20DU%20NIL%20Y%20LE%20VOYAGE%20DES%20WOLOF.png',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf',
                descriptionKey: 'BrouchureBassari',
            },
        ],
    },
    {
        brandId: 'flamenco',
        namespace: 'pageFlamenco',
        brandHref: '/flamencoHome',
        brochures: [
            {
                id: 'flamenco-brand',
                title: 'FLAMENCO',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_FLAMENCO.png',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BROCHURE_FLAMENCO_WEB.pdf',
                descriptionKey: 'BrouchureFlamenco',
            },
            {
                id: 'flamenco-riviera',
                title: 'RIVIERA',
                coverImage:
                    'https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_RIVIERA.png',
                pdfUrl: 'https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/FLA_RIVIERA_BROCHURE_OK.pdf',
                descriptionKey: 'BrouchureRiviera',
            },
        ],
    },
];

export const brochureCollectionsByBrand = brochureCollections.reduce((acc, collection) => {
    acc[collection.brandId] = collection;
    return acc;
}, {});

export const videoContent = [
    {
        id: 'atelier-tour',
        title: 'Tour por el Atelier',
        description: 'Descubre cómo desarrollamos cada colección desde el boceto inicial hasta el telar.',
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/ww3n3UGlPZc',
    },
    {
        id: 'behind-the-scenes',
        title: 'Behind the Scenes',
        description: 'Una mirada íntima al proceso de producción y los detalles que hacen únicas nuestras telas.',
        thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/oY6hzVjZD4E',
    },
    {
        id: 'collection-highlights',
        title: 'Highlights de Colección',
        description: 'Ambientes y proyectos reales que integran nuestras últimas novedades textiles.',
        thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
    },
];