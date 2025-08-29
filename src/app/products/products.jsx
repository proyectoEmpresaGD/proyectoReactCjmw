import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/header";
import CardProduct from "../../components/ComponentesProductos/cardProduct";
import { CartProvider } from '../../components/cartContext';

function Product() {
    const { t } = useTranslation(['subMenuCarousel', 'productPage']);
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    // Lee los filtros de la URL
    const collection = params.get("collection");
    const fabricPattern = params.get("fabricPattern");
    const fabricType = params.get("fabricType");
    const uso = params.get("uso");
    const mantenimiento = params.get("mantenimiento");
    const type = params.get("type"); // "papel" o "telas"

    // Construye lista de claves de filtro activo
    const filtrosKeys = [];
    if (collection) filtrosKeys.push(collection);
    if (fabricPattern) filtrosKeys.push(fabricPattern);
    if (fabricType) filtrosKeys.push(fabricType);
    if (uso) filtrosKeys.push(uso);
    if (mantenimiento) filtrosKeys.push(mantenimiento);
    if (type) filtrosKeys.push(type === 'papel' ? 'papel' : 'telas');

    // helper para convertir a camelCase
    const toCamel = str =>
        str
            .toLowerCase()
            .split(/[_\s]+/)
            .map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
            .join('');

    // Mapea cada clave al texto traducido
    const filtrosActivos = filtrosKeys.map(key => {

        if (collection && key === collection) {
            return key;
        }

        // 1) papel/telas vienen de productPage
        if (key === 'papel') return t('papel', { ns: 'productPage' });
        if (key === 'telas') return t('telas', { ns: 'productPage' });

        // 2) resto son categorías de subMenuCarousel
        let catKey;
        if (key.toUpperCase() === 'EASYCLEAN') {
            catKey = 'easyClean';
        } else {
            catKey = toCamel(key);
        }
        return t(`categories.${catKey}`, { ns: 'subMenuCarousel' });
    });

    // Título final
    const titulo = filtrosActivos.length > 0
        ? filtrosActivos.join(' – ')
        : t('allProducts', { ns: 'productPage' });

    // Actualiza título de la pestaña del navegador
    useEffect(() => {
        document.title = titulo;
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
