

const CareInstructions = () => {
    const careInstructions = [
        {
            id: 1,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2030%C2%BA.jpg',  // Cambia esta ruta por la de tu icono
            title: "Lavar a 30º",
            details: [
                "Apto para lavar a 30° en lavadora.",
                "No utilizar productos de limpieza que contengan agentes blanqueadores.",
                "No mezclar con colores diferentes."
            ],
        },
        {
            id: 2,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2040%C2%BA.jpg',  // Cambia esta ruta por la de tu icono
            title: "Lavar a 40º",
            details: [
                "Apto para lavar a 30° en lavadora.",
                "No utilizar productos de limpieza que contengan agentes blanqueadores.",
                "No mezclar con colores diferentes."
            ],
        },
        {
            id: 3,
            iconPath: "https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar.jpg",  // Cambia esta ruta por la de tu icono
            title: "No lavable a máquina",
            details: [
                "Si se indica, recomendamos limpiar la tela a mano o en seco siguiendo las instrucciones especificadas en cada caso.",
                "El daño y el encogimiento pueden ocurrir si se limpia la tela en la lavadora."
            ],
        },
        {
            id: 4,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20120%C2%BA.jpg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 120°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 120 grados."],
        },
        {
            id: 5,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20160%C2%BA.jpg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 160°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 160 grados."],
        },
        {
            id: 6,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20210%C2%BA.jpg',  // Cambia esta ruta por la de tu icono
            title: "Planchar a 210°",
            details: ["Se recomienda planchar la tela siempre por el reverso hasta 210 grados."],
        },
        {
            id: 7,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20planchar.jpg',  // Cambia esta ruta por la de tu icono
            title: "No planchar",
            details: [
                "Se usan fibras especiales para hacer la tela indicada.",
                "No se necesita planchar para mantener la apariencia correcta de la tela, por lo que se recomienda vaporizar la tela."
            ],
        },
        {
            id: 8,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%20mano.jpg',  // Cambia esta ruta por la de tu icono
            title: "Lavar a mano",
            details: [
                "Apto para lavar a mano en agua tibia.",
                "Usar solo jabón transparente.",
                "No usar productos no autorizados.",
                "No mezclar con colores diferentes."
            ],
        },
        {
            id: 9,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lejia.jpg',  // Cambia esta ruta por la de tu icono
            title: "No usar blanqueador",
            details: [
                "Ninguna de nuestras telas puede ser tratada con blanqueador.",
                "El blanqueador cambiará el color original de cualquiera de nuestras telas."
            ],
        },
        {
            id: 10,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20en%20seco.jpg',  // Cambia esta ruta por la de tu icono
            title: "Limpieza en seco",
            details: [
                "Apto para ser limpiado en seco sin usar percloroetileno.",
                "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
            ],
        },
        {
            id: 11,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar%20en%20seco.jpg',  // Cambia esta ruta por la de tu icono
            title: "No lavar en seco",
            details: [
                "Apto para ser limpiado en seco sin usar percloroetileno.",
                "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
            ],
        },
        {
            id: 12,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20usar%20secadora.jpg',  // Cambia esta ruta por la de tu icono
            title: "No usar secadora",
            details: [
                "Después de lavar las telas en la lavadora, se recomienda dejarlas colgadas en un tendedero para secar.",
                "Usar la secadora puede causar encogimientos y daños en las telas."
            ],
        },
        {
            id: 13,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/EASY%20CLEAN.jpg',  // Cambia esta ruta por la de tu icono
            title: "EASY CLEAN",
            details: [
                "Después de lavar las telas en la lavadora, se recomienda dejarlas colgadas en un tendedero para secar.",
                "Usar la secadora puede causar encogimientos y daños en las telas."
            ],
        },
    ];

    const usageInstructions = [
        {
            id: 1,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria%20decorativa.jpg',
            title: "Tapiceria decorativa",
            details: [
                "Adecuado para tapicería decorativa.",
                "El grado de uso recomendado debe especificarse en cada caso.",
                "Los tejidos estampados pueden usarse con fines decorativos.",
            ],
        },
        {
            id: 2,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria.jpg',
            title: "Tapiceria",
            details: [
                "Adecuado para tapicería.",
                "El grado de uso recomendado debe especificarse en cada caso.",
                "Las telas teñidas están bien preparadas para tapicería general."
            ],
        },
        {
            id: 3,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/Cortinas.jpg',
            title: "Cortinas",
            details: [
                "Adecuado para cortinas.",
                "La mayoría de nuestras telas están hechas con fibras naturales y tintes ecológicos, siempre se recomienda forrarlas para evitar daños por la luz solar.",
                "Es recomendable usar un blackout o dimout para proteger la tela principal del sol."





            ],
        },
        {
            id: 4,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/Estores.jpg',
            title: "Estores",
            details: [
                "Adecuado para Estores.",
                "La exposición continua a la luz solar puede dañar las telas. Es recomendable proteger las estores del sol.",
                "Se recomienda instalar las estores en el interior, siempre cubiertas por una cortina o un blackout adicional."
            ],
        },
        {
            id: 5,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/Colchas.jpg',
            title: "Colchas",
            details: [
                "Adecuado para colchas.",
                "Es recomendable forrar la tela principal con un forro y, si se desea, también con una entretela de espuma.",
                "En cada caso, deben respetarse las instrucciones de lavado. Cada tela tiene una estructura diferente, por lo que no dudes en contactar con nuestro departamento de investigación y calidad para recibir las instrucciones precisas de cuidado y uso."
            ],
        },
        {
            id: 6,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/FR.jpg',
            title: "FR",
            details: [
                "Resistentes al fuego.",
                "Las telas FR (resistentes al fuego) son tejidos diseñados para no incendiarse ni propagar llamas, ofreciendo protección en entornos peligrosos como industrias eléctricas o petroquímicas.",
                "Su resistencia al fuego es duradera y no se pierde con el uso o lavados."
            ],
        },
        {
            id: 7,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/IMO.jpg',
            title: "IMO",
            details: [
                "Adecuado para uso maritimo.",
                "Las telas IMO cumplen con normas de seguridad marítima, siendo resistentes al fuego y diseñadas para su uso en barcos y embarcaciones.",
                "Estas telas ofrecen protección contra incendios y son obligatorias en entornos marítimos para garantizar la seguridad a bordo."
            ],
        },
        {
            id: 8,
            iconPath: 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Usos/OUTDOOR.jpg',
            title: "OUTDOOR",
            details: [
                "Adecuado para el exterior.",
                "Las telas outdoor están diseñadas para resistir condiciones exteriores como sol, lluvia y humedad.",
                "Son duraderas, resistentes a rayos UV y moho, y fáciles de mantener, ideales para muebles de jardín y toldos."
            ],
        },
    ];

    // const directionInstructions = [
    //     {
    //         id: 1,
    //         iconPath: 'horizontal.svg',
    //         title: "Horizontal",
    //         details: [
    //             "Also called upholstery way, the drawing develops itself parallel to both selvedges of roll.",
    //             "Regular to manufacture a curtain with these kind of fabrics, the quantity of metres to be ordered should be the height of the curtain plus hem."
    //         ],
    //     },
    //     {
    //         id: 2,
    //         iconPath: 'vertical.svg',
    //         title: "Vertical",
    //         details: [
    //             "Also called curtain way, the drawing develops itself from one selvedge to another selvedge of the roll.",
    //             "If the fabric is 280 cm width we can take advantage of the width to make the height of a curtain."
    //         ],
    //     },
    //     {
    //         id: 3,
    //         iconPath: 'no-direction.svg',
    //         title: "No direction",
    //         details: [
    //             "There is no direction in the movement of the design through the roll.",
    //             "The fabric can be used in horizontal or in vertical way, as appropriate.",
    //             "Plains, fake plains and checks have regularly this symbol."
    //         ],
    //     },
    // ];

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

            {/* <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 mt-8">Direction of the Drawing in the Roll</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {directionInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div> */}
        </div>
    );
};

function renderCard(instruction) {
    return (
        <div key={instruction.id} className="flex flex-col items-center">
            <div className="h-full max-w-sm w-full bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow duration-300 ease-in-out justify-between ">
                <img src={`${instruction.iconPath}`} className="h-10 w-10 mx-auto" alt={instruction.title} />
                <div>
                    <div className="font-bold text-lg mb-1 text-center pt-2">{instruction.title}</div>
                    {instruction.details.map((line, index) => (
                        <p key={index} className="text-gray-700 text-sm text-center pt-3">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default CareInstructions;
