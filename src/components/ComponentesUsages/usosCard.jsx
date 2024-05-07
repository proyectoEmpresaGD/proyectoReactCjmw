

const CareInstructions = () => {
    const careInstructions = [
        {
            id: 1,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/washing.svg',  // Cambia esta ruta por la de tu icono
            title: "Lavable a máquina",
            details: [
                "Apto para lavar a 30° en lavadora.",
                "No utilizar productos de limpieza que contengan agentes blanqueadores.",
                "No mezclar con colores diferentes."
            ],
        },
        {
            id: 2,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/do-not-wash.svg',  // Cambia esta ruta por la de tu icono
            title: "No lavable a máquina",
            details: [
                "Si se indica, recomendamos limpiar la tela a mano o en seco siguiendo las instrucciones especificadas en cada caso.",
                "El daño y el encogimiento pueden ocurrir si se limpia la tela en la lavadora."
            ],
        },
        {
            id: 3,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/iron-1.svg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 120°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 120 grados."],
        },
        {
            id: 4,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/iron-2.svg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 160°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 160 grados."],
        },
        {
            id: 5,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/iron-3.svg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 210°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 210 grados."],
        },
        {
            id: 6,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/iron-disable.svg',  // Cambia esta ruta por la de tu icono
            title: "No planchar",
            details: [
                "Se usan fibras especiales para hacer la tela indicada.",
                "No se necesita planchar para mantener la apariencia correcta de la tela, por lo que se recomienda vaporizar la tela."
            ],
        },
        {
            id: 7,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/hand-wash.svg',  // Cambia esta ruta por la de tu icono
            title: "Lavar a mano",
            details: [
                "Apto para lavar a mano en agua tibia.",
                "Usar solo jabón transparente.",
                "No usar productos no autorizados.",
                "No mezclar con colores diferentes."
            ],
        },
        {
            id: 8,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/noun-no-bleach.svg',  // Cambia esta ruta por la de tu icono
            title: "No usar blanqueador",
            details: [
                "Ninguna de nuestras telas puede ser tratada con blanqueador.",
                "El blanqueador cambiará el color original de cualquiera de nuestras telas."
            ],
        },
        {
            id: 9,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/dry-Clening.webp',  // Cambia esta ruta por la de tu icono
            title: "Limpieza en seco",
            details: [
                "Apto para ser limpiado en seco sin usar percloroetileno.",
                "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
            ],
        },
        {
            id: 10,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/noun-do.svg',  // Cambia esta ruta por la de tu icono
            title: "No usar secadora",
            details: [
                "Después de lavar las telas en la lavadora, se recomienda dejarlas colgadas en un tendedero para secar.",
                "Usar la secadora puede causar encogimientos y daños en las telas."
            ],
        },
    ];

    const usageInstructions = [
        {
            id: 1,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/Upholstery%20for%20decoration.webp',
            title: "Upholstery for decoration",
            details: [
                "Suitable for upholstery for decoration.",
                "The recommend grade of use has to be specified in each case.",
                "Prints fabrics can be used for decoration purpose."
            ],
        },
        {
            id: 2,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/Upholstery.webp',
            title: "Upholstery",
            details: [
                "Suitable for upholstery.",
                "The recommend grade of use has to be specified in each case.",
                "Dyed fabrics are well prepared for general upholstery."
            ],
        },
        {
            id: 3,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/courtains.svg',
            title: "Curtains",
            details: [
                "Suitable for curtains.",
                "Most of our fabrics are made with natural fibers and ecological dying stuff, it is always recommended lining them to avoid damage by sunlight.",
                "It is welcome to use a blackout or a dimout to keep the sun away from the main fabric."
            ],
        },
        {
            id: 4,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/window-blind.svg',
            title: "Blinds",
            details: [
                "Suitable for blinds.",
                "Continuous exposition to sunlight could cause damages in fabrics. It is good to hide the blinds from the sun.",
                "It is recommend installing the blinds at interior and always covered by a window blind or another blackout blind."
            ],
        },
        {
            id: 5,
            iconPath: 'https://cjmw.eu/CarpetaPaginaWebCjmw/Iconos/bedspreads.webp',
            title: "Bedspreads",
            details: [
                "Suitable for bedspreads.",
                "It is good to line the main fabric with a lining and as wish, also with a foam interlining.",
                "In each case, washing instructions must be respected. Each fabric has different structure so do not hesitate to contact with our researching and quality department, to receive the accurate care and usage instructions."
            ],
        },
    ];

    const directionInstructions = [
        {
            id: 1,
            iconPath: 'horizontal.svg',
            title: "Horizontal",
            details: [
                "Also called upholstery way, the drawing develops itself parallel to both selvedges of roll.",
                "Regular to manufacture a curtain with these kind of fabrics, the quantity of metres to be ordered should be the height of the curtain plus hem."
            ],
        },
        {
            id: 2,
            iconPath: 'vertical.svg',
            title: "Vertical",
            details: [
                "Also called curtain way, the drawing develops itself from one selvedge to another selvedge of the roll.",
                "If the fabric is 280 cm width we can take advantage of the width to make the height of a curtain."
            ],
        },
        {
            id: 3,
            iconPath: 'no-direction.svg',
            title: "No direction",
            details: [
                "There is no direction in the movement of the design through the roll.",
                "The fabric can be used in horizontal or in vertical way, as appropriate.",
                "Plains, fake plains and checks have regularly this symbol."
            ],
        },
    ];

    return (
        <div className="mt-16 mb-8 px-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 pt-16 sm:pt-24">Cares</h1>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Usage Instructions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {usageInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 mt-8">Care Instructions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {careInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 mt-8">Direction of the Drawing in the Roll</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {directionInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div>
        </div>
    );
};

function renderCard(instruction) {
    return (
        <div key={instruction.id} className="flex flex-col items-center">
            <div className="h-full max-w-sm w-full bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
                <img src={`/${instruction.iconPath}`} className="h-10 w-10 mx-auto" alt={instruction.title} />
                <div>
                    <div className="font-bold text-lg mb-1 text-center">{instruction.title}</div>
                    {instruction.details.map((line, index) => (
                        <p key={index} className="text-gray-700 text-sm text-center">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default CareInstructions;
