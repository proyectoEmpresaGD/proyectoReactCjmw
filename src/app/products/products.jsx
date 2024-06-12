import { Header } from "../../components/header";
import CardProduct from "../../components/ComponentesProductos/cardProduct";
import { CartProvider } from '../../components/CartContext';

function Product() {
    return (
        <div className="flex flex-col min-h-screen">
            <CartProvider>
                <Header />
                <div className="flex-grow ">
                    <div className="max-w-2xl mx-auto text-center mt-24">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                            PRODUCTS
                        </h1>
                        <p className=" mx-auto text-center py-10 text-lg">Descubre nuestra exclusiva colección de telas de alta calidad, perfectas para tus proyectos de moda y decoración. Desde elegantes sedas hasta versátiles algodones, tenemos la tela ideal para cada creación. Explora nuestro catálogo y encuentra la inspiración que necesitas para hacer realidad tus ideas.</p>
                        <p className="mx-auto text-center py-10 text-xl font-semibold">¡Empieza a crear con Cjm hoy mismo!</p>
                    </div>
                    <CardProduct />
                </div>
            </CartProvider>
        </div>
    );
}

export default Product;



