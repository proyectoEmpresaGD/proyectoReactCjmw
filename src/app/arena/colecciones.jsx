import { Header } from "../../components/header"
import Footer from "../../components/footer"
import { CartProvider } from '../../components/CartContext';
import CarruselColecciones from "../../components/ComponentesBrands/CarruselColecciones"

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

function ArenaColecciones() {

    return (
        <>
            <CartProvider>
                <Header />
                <body className="xl:mt-[5%] mt-[20%] md:mt-[10%]">
                    <div className="flex items-center justify-center h-full">
                        <img src="/logoHarbour.png" alt="" className="lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full" />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-3">
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
export default ArenaColecciones