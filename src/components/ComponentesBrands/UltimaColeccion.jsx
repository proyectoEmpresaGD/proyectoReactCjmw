import { useNavigate } from "react-router-dom";

function PresentacionMarca({ nombreColeccion, titulo, imagenFondo, descripcion }) {
    const navigate = useNavigate();

    const handleClick = () => {
        const target = document.getElementById("colecciones");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto my-12 px-4">
            <div className="relative flex flex-col lg:flex-row items-center justify-center lg:right-[17%] gap-6 lg:gap-0">
                {/* Imagen de fondo */}
                <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] overflow-hidden shadow-lg">
                    <img
                        src={imagenFondo}
                        alt="Imagen presentación"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Recuadro blanco: superpuesto en desktop, flotante abajo en móvil */}
                <div
                    className={`
            w-[90%] lg:w-[40%] 
            bg-white p-6 md:p-10 shadow-xl rounded z-10
            -mt-12 lg:mt-0
            lg:absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:translate-x-1/4
          `}
                >
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">{titulo}</h3>
                    <p className="text-sm md:text-base text-gray-700 mb-4">{descripcion}</p>
                    <button
                        onClick={handleClick}
                        className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
                    >
                        Descubre todas las colecciones
                    </button>
                </div>
            </div>
        </section>
    );
}

export default PresentacionMarca;
