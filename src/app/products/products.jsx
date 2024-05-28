import { Header } from "../../components/header";
import CardProduct from "../../components/ComponentesProductos/cardProduct";
import Filtro from "../products/buttonFiltro";
import { CartProvider } from '../../components/CartContext';

function Product() {
    return (
        <div className="flex flex-col min-h-screen">
            <CartProvider>
                <Header />
                <div className="flex-grow">
                    <div className="max-w-2xl mx-auto text-center mt-24 md:mt-18 xl:mt-18">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                            PRODUCTS
                        </h1>
                    </div>
                    <Filtro />
                    <CardProduct />
                </div>
            </CartProvider>
        </div>
    );
}

export default Product;
