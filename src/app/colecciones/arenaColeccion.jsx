import { CartProvider } from '../../components/CartContext';
import CarruselColecciones from "../../components/ComponentesBrands/CarruselColecciones"

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENT/1200%20ARENA%20ANTILLA%20VELVET%2002.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENT/1200%20ARENA%20COTE%20D%20AZUR%2002.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENT/1200%20ARENA%20GRANITE%2002.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel2.webp",
]

function ArenaColecciones() {

    return (
        <>
            <CartProvider>
                <body className="xl:mt-[3%] mt-[20%] md:mt-[10%]">
                    <div className="flex items-center justify-center h-full">
                        <h1 className=" text-3xl font-bold text-black mx-auto">Descubre las colecciones de Arena </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">AGATA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">AMATISTA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">ANTILLA JUTE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">ANTILLA VELVET</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">ANTIBES</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">APACHE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">ARPILLERA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">ATISAN</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">ATMOSPHERE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">BLIZZARD</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">BURLAP</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">CALCUTA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">CANNES</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">CAPRI</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">CIRRUS</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">CLOUDY</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">COLORADO</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">CUARZO</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">DUNE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">FENICIA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">FORMENTERA</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">FREJUS</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">GRANITE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">GRAVITY</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">HABITAT</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">HAZE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">JEWEL</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">KENT</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">LEVANTINE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">LE CANNET</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%] ">
                                <h1 className="text-3xl py-[1%]">LES ARCS</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">LINOTTO</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">LUMIERE PANOT</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">LUNAR</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">MAKALU</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center py-[3%]">
                                <h1 className="text-3xl py-[1%]">MARSEILLE</h1>
                            </div>
                            <CarruselColecciones images={images} />
                        </div>
                    </div>
                </body>
            </CartProvider>
        </>
    )
}
export default ArenaColecciones