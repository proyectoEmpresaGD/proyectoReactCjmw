import { Header } from "../../components/header";
import CardProduct from "../../components/ComponentesProductos/cardProduct";
import { CartProvider } from '../../components/CartContext';

function Product() {
    return (
        <div className="flex flex-col min-h-screen xl:pt-[8%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%]  pt-[20%]">
            <CartProvider>
                <Header />
                <div className="flex-grow ">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                            PRODUCTOS
                        </h1>
                    </div>
                    <CardProduct />
                </div>
            </CartProvider>
        </div>
    );
}

export default Product;



