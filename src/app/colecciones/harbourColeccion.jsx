import { Header } from "../../components/header"
import Footer from "../../components/footer"
import { CartProvider } from '../../components/CartContext';
import CarruselColecciones from "../../components/ComponentesBrands/CarruselColecciones"
import CardProductBrand from "../../components/ComponentesProductos/cardProductBrand"

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel2.webp",
]

function HarbourColecciones() {

    return (
        <>
            <CartProvider>
                <body className="xl:mt-[3%] mt-[20%] md:mt-[10%]">
                    <div className="flex items-center justify-center h-full">
                        <h1 className=" text-3xl font-bold text-black mx-auto">Descubre las colecciones de HARBOUR </h1>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">Nombre coleccion</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                    </div>
                </body>
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourColecciones