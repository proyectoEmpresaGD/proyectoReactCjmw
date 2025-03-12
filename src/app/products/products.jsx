import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../../components/header";
import CardProduct from "../../components/ComponentesProductos/cardProduct";
import { CartProvider } from '../../components/CartContext';

function Product() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Obtener los filtros activos desde la URL
    const collection = searchParams.get("collection");
    const fabricPattern = searchParams.get("fabricPattern");
    const fabricType = searchParams.get("fabricType");
    const uso = searchParams.get("uso");
    const type = searchParams.get("type"); // Capturamos el tipo de producto (papel o tela)

    // Construcción del título dinámico para el contenido de la página
    let filtrosActivos = [];
    if (collection) filtrosActivos.push(collection);
    if (fabricPattern) filtrosActivos.push(fabricPattern);
    if (fabricType) filtrosActivos.push(fabricType);
    if (uso) filtrosActivos.push(uso);

    // Si es "papel" cambia a "PAPELES", si es "tela" cambia a "TELAS"
    if (type) {
        filtrosActivos.push(type === "papel" ? "PAPELES" : "TELAS");
    }

    const titulo = filtrosActivos.length > 0 ? filtrosActivos.join(" - ") : "PRODUCTOS";

    // Cambia el título del navegador sin modificar la URL
    useEffect(() => {
        document.title = titulo; // Cambia el título de la pestaña del navegador
    }, [titulo]);

    return (
        <div className="flex flex-col min-h-screen xl:pt-[8%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%] pt-[20%]">
            <CartProvider>
                <Header />
                <div className="flex-grow">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                            {titulo}
                        </h1>
                    </div>
                    <CardProduct />
                </div>
            </CartProvider>
        </div>
    );
}

export default Product;
