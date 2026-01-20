import { useEffect, useRef, useState } from 'react';
import { cdnUrl } from '../../../../Constants/cdn';

export function useRelatedProducts({
    selectedProduct,
    setSelectedProduct,
    setSelectedImage,
    modalRef,
    defaultImageUrlModalProductos,
}) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productsForCarousel, setProductsForCarousel] = useState([]);
    const [anchoOptions, setAnchoOptions] = useState([]);
    const [selectedAncho, setSelectedAncho] = useState('');

    const [collectionProducts, setCollectionProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const prevNombreRef = useRef();
    const prevColeccionRef = useRef();

    // Relacionados por nombre
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.nombre === prevNombreRef.current) return;
        prevNombreRef.current = selectedProduct.nombre;

        setRelatedProducts([]);
        setProductsForCarousel([]);
        setAnchoOptions([]);
        setSelectedAncho('');

        const fetchRelated = async () => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await resp.json();

                const mismos = data.filter((p) => p.nombre === selectedProduct.nombre);
                const productsWithImages = await Promise.all(
                    mismos.map(async (prod) => {
                        const [bRes, lRes] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BUENA`).then((r) => (r.ok ? r.json() : null)),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BAJA`).then((r) => (r.ok ? r.json() : null)),
                        ]);

                        const rawB = bRes?.ficadjunto ? `${bRes.ficadjunto}` : null;
                        const rawL = lRes?.ficadjunto ? `${lRes.ficadjunto}` : null;

                        return {
                            ...prod,
                            imageBuena: rawB ? cdnUrl(rawB) : (rawL ? cdnUrl(rawL) : defaultImageUrlModalProductos),
                            imageBaja: rawL ? cdnUrl(rawL) : (rawB ? cdnUrl(rawB) : defaultImageUrlModalProductos),
                        };
                    })
                );

                setRelatedProducts(productsWithImages);

                const byTonalidad = productsWithImages.filter((p, i, arr) => {
                    const key = (p.tonalidad || '').trim().toLowerCase();
                    return key && i === arr.findIndex((q) => (q.tonalidad || '').trim().toLowerCase() === key);
                });

                setProductsForCarousel(byTonalidad);

                const uniqueAnchos = [...new Set(productsWithImages.map((p) => p.ancho).filter(Boolean))];
                if (uniqueAnchos.length) {
                    setAnchoOptions(uniqueAnchos);
                    setSelectedAncho(String(Math.min(...uniqueAnchos.map(Number)).toString()));
                }
            } catch { }
        };

        fetchRelated();
    }, [selectedProduct, defaultImageUrlModalProductos]);

    // Por colección
    useEffect(() => {
        if (!selectedProduct?.coleccion) return;
        if (selectedProduct.coleccion === prevColeccionRef.current) return;
        prevColeccionRef.current = selectedProduct.coleccion;

        setCollectionProducts([]);

        const fetchCollection = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await response.json();

                const filtered = data.filter(
                    (p) => p.nombre && p.nombre.trim() !== '' && p.coleccion === selectedProduct.coleccion && p.nombre !== selectedProduct.nombre
                );

                const uniqueByName = filtered.filter((p, idx, self) => idx === self.findIndex((q) => q.nombre === p.nombre));
                if (!uniqueByName.length) {
                    setCollectionProducts([]);
                    return;
                }

                const productsWithImages = await Promise.all(
                    uniqueByName.map(async (prod) => {
                        const [b, l] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BUENA`).then((res) => (res.ok ? res.json() : null)),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BAJA`).then((res) => (res.ok ? res.json() : null)),
                        ]);

                        const rawB = b?.ficadjunto ? `${b.ficadjunto}` : defaultImageUrlModalProductos;
                        const rawL = l?.ficadjunto ? `${l.ficadjunto}` : defaultImageUrlModalProductos;

                        return { ...prod, imageBuena: cdnUrl(rawB), imageBaja: cdnUrl(rawL) };
                    })
                );

                setCollectionProducts(productsWithImages);
            } catch { }
        };

        fetchCollection();
    }, [selectedProduct, defaultImageUrlModalProductos]);

    useEffect(() => {
        setRecommendedProducts(collectionProducts);
    }, [collectionProducts]);

    const handleAnchoChange = (e) => {
        const newAncho = e.target.value;
        setSelectedAncho(newAncho);

        const newSelectedProduct = relatedProducts.find(
            (p) =>
                p.nombre === selectedProduct.nombre &&
                p.tonalidad === selectedProduct.tonalidad &&
                p.ancho === newAncho
        );

        if (newSelectedProduct) {
            setSelectedProduct(newSelectedProduct);
            setSelectedImage(newSelectedProduct.imageBuena || newSelectedProduct.imageBaja);
        }
    };

    const handleColorClick = async (colorProduct) => {
        try {
            if (colorProduct.imageBuena || colorProduct.imageBaja) {
                setSelectedProduct({ ...colorProduct });
                setSelectedImage(colorProduct.imageBuena || colorProduct.imageBaja);
                if (modalRef?.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const [buenaResponse, bajaResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${colorProduct.codprodu}/PRODUCTO_BUENA`),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${colorProduct.codprodu}/PRODUCTO_BAJA`),
            ]);

            const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
            const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;

            const updatedProduct = {
                ...colorProduct,
                imageBuena: buenaImage?.ficadjunto ? `${buenaImage.ficadjunto}` : '',
                imageBaja: bajaImage?.ficadjunto ? `${bajaImage.ficadjunto}` : '',
            };

            setSelectedProduct(updatedProduct);
            setSelectedImage(updatedProduct.imageBuena || updatedProduct.imageBaja);

            if (modalRef?.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } catch { }
    };

    return {
        relatedProducts,
        productsForCarousel,
        anchoOptions,
        selectedAncho,

        collectionProducts,
        recommendedProducts,

        handleAnchoChange,
        handleColorClick,
    };
}
