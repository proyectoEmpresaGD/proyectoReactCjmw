import { useEffect, useRef, useState } from 'react';
import { cdnUrl } from '../../../../Constants/cdn';

export function useProductMedia({
    selectedProduct,
    defaultImageUrlModalProductos,
    initialSelectedImage,
    setSelectedProduct,
}) {
    const [selectedImage, setSelectedImage] = useState(initialSelectedImage);
    const [mainItem, setMainItem] = useState({
        key: 'product',
        thumb: cdnUrl(selectedProduct?.imageBaja || selectedProduct?.imageBuena || defaultImageUrlModalProductos),
        full: cdnUrl(selectedProduct?.imageBuena || selectedProduct?.imageBaja || defaultImageUrlModalProductos),
    });

    const [galleryImages, setGalleryImages] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const [artisticPairs, setArtisticPairs] = useState([]);
    const [selectedArtisticIndex, setSelectedArtisticIndex] = useState(0);

    const prevCodProduRef = useRef(null);

    // Imagen principal (si falta, fetch)
    useEffect(() => {
        if (!selectedProduct) return;

        if (selectedProduct.imageBuena || selectedProduct.imageBaja) {
            const full = cdnUrl(selectedProduct.imageBuena || selectedProduct.imageBaja);
            const thumb = cdnUrl(selectedProduct.imageBaja || selectedProduct.imageBuena);
            setMainItem({ key: 'product', thumb, full });
            setSelectedImage(full);
            return;
        }

        (async () => {
            try {
                const [buenaRes, bajaRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/PRODUCTO_BUENA`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/PRODUCTO_BAJA`),
                ]);

                const buena = buenaRes.ok ? await buenaRes.json() : null;
                const baja = bajaRes.ok ? await bajaRes.json() : null;

                const rawFull = buena?.ficadjunto ? `${buena.ficadjunto}` : (baja?.ficadjunto ? `${baja.ficadjunto}` : defaultImageUrlModalProductos);
                const rawThumb = baja?.ficadjunto ? `${baja.ficadjunto}` : (buena?.ficadjunto ? `${buena.ficadjunto}` : defaultImageUrlModalProductos);

                const full = cdnUrl(rawFull);
                const thumb = cdnUrl(rawThumb);

                setSelectedProduct((p) => ({ ...p, imageBuena: full, imageBaja: thumb }));
                setMainItem({ key: 'product', thumb, full });
                setSelectedImage(full);
            } catch {
                setSelectedImage(defaultImageUrlModalProductos);
            }
        })();
    }, [selectedProduct, defaultImageUrlModalProductos, setSelectedProduct]);

    // Galería
    useEffect(() => {
        const fetchGallery = async () => {
            if (!selectedProduct?.nombre || !selectedProduct?.codfamil) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await res.json();

                const mismos = data.filter((p) => p.nombre === selectedProduct.nombre);
                const images = await Promise.all(
                    mismos.map(async (prod) => {
                        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BUENA`);
                        const json = response.ok ? await response.json() : null;
                        if (!json?.ficadjunto) return null;
                        return cdnUrl(`${json.ficadjunto}`);
                    })
                );

                const filtered = images.filter(Boolean);
                setGalleryImages(filtered);

                const current = cdnUrl(selectedProduct.imageBuena || selectedImage);
                const initialIndex = filtered.findIndex((img) => img === current);
                setPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
            } catch {
                setGalleryImages([]);
            }
        };

        fetchGallery();
    }, [selectedProduct, selectedImage]);

    // Artística
    useEffect(() => {
        if (!selectedProduct?.codprodu) {
            setArtisticPairs([]);
            setSelectedArtisticIndex(0);
            return;
        }

        const cod = selectedProduct.codprodu;
        if (prevCodProduRef.current === cod) return;
        prevCodProduRef.current = cod;

        let cancelled = false;

        (async () => {
            try {
                const [bajaRes, buenaRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${cod}/ARTISTICA_BAJA`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${cod}/ARTISTICA_BUENA`),
                ]);

                const bajaJson = bajaRes.ok ? await bajaRes.json() : null;
                const buenaJson = buenaRes.ok ? await buenaRes.json() : null;

                const bajaUrl = bajaJson?.ficadjunto ? cdnUrl(bajaJson.ficadjunto) : null;
                const buenaUrl = buenaJson?.ficadjunto ? cdnUrl(buenaJson.ficadjunto) : null;

                if (!bajaUrl && !buenaUrl) {
                    if (!cancelled) {
                        setArtisticPairs([]);
                        setSelectedArtisticIndex(0);
                    }
                    return;
                }

                if (!cancelled) {
                    setArtisticPairs([{ key: 'artistica', thumb: bajaUrl || buenaUrl, full: buenaUrl || bajaUrl }]);
                    setSelectedArtisticIndex(0);
                }
            } catch {
                if (!cancelled) {
                    setArtisticPairs([]);
                    setSelectedArtisticIndex(0);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [selectedProduct?.codprodu]);

    return {
        selectedImage,
        setSelectedImage,

        mainItem,
        setMainItem,

        galleryImages,
        isViewerOpen,
        setIsViewerOpen,
        photoIndex,
        setPhotoIndex,

        artisticPairs,
        setArtisticPairs,
        selectedArtisticIndex,
        setSelectedArtisticIndex,
    };
}
