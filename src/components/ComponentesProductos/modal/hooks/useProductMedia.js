import { useEffect, useRef, useState } from 'react';
import { cdnUrl } from '../../../../Constants/cdn';

function normalizeUrl(raw) {
    const url = String(raw ?? '').trim();
    return url ? cdnUrl(url) : null;
}

function ensureArray(json) {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.rows)) return json.rows;
    return [];
}

function normalizeProductNameForImages(name) {
    // "LA CROIX" -> "LA_CROIX"
    return String(name ?? '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_');
}

function buildAmbientePairsFromImages(images) {
    // Solo AMBIENTE_(BAJA|BUENA)_NUM
    const byType = new Map();

    (images || []).forEach((img) => {
        const type = String(img?.codclaarchivo ?? '').trim().toUpperCase();
        const url = normalizeUrl(img?.ficadjunto ?? img?.url);
        if (!type || !url) return;
        byType.set(type, url);
    });

    const ambientGroups = new Map();

    for (const [type, url] of byType.entries()) {
        const match = /^AMBIENTE_(BAJA|BUENA)_(\d+)$/.exec(type);
        if (!match) continue;

        const quality = match[1];
        const num = Number(match[2]);
        if (!Number.isFinite(num)) continue;

        const current = ambientGroups.get(num) || { num, baja: null, buena: null };
        if (quality === 'BAJA') current.baja = url;
        if (quality === 'BUENA') current.buena = url;
        ambientGroups.set(num, current);
    }

    return Array.from(ambientGroups.values())
        .sort((a, b) => a.num - b.num)
        .map((g) => ({
            key: `ambiente-${g.num}`,
            kind: 'ambiente',
            group: g.num,
            thumb: g.baja || g.buena || null,
            full: g.buena || g.baja || null,
        }))
        .filter((p) => !!p.thumb || !!p.full);
}

export function useProductMedia({
    selectedProduct,
    defaultImageUrlModalProductos,
    initialSelectedImage,
    setSelectedProduct,
}) {
    const [selectedImage, setSelectedImage] = useState(initialSelectedImage);

    const [mainItem, setMainItem] = useState({
        key: 'product',
        kind: 'product',
        thumb: normalizeUrl(selectedProduct?.imageBaja || selectedProduct?.imageBuena || defaultImageUrlModalProductos),
        full: normalizeUrl(selectedProduct?.imageBuena || selectedProduct?.imageBaja || defaultImageUrlModalProductos),
    });

    const [galleryImages, setGalleryImages] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Aquí mezclamos: [artistica] + [...ambientes]
    const [artisticPairs, setArtisticPairs] = useState([]);
    const [selectedArtisticIndex, setSelectedArtisticIndex] = useState(0);

    const prevCodProduRef = useRef(null);

    // Imagen principal (si falta, fetch)
    useEffect(() => {
        if (!selectedProduct) return;

        const existingFull = normalizeUrl(selectedProduct.imageBuena || selectedProduct.imageBaja);
        const existingThumb = normalizeUrl(selectedProduct.imageBaja || selectedProduct.imageBuena);

        if (existingFull || existingThumb) {
            const full = existingFull || existingThumb || normalizeUrl(defaultImageUrlModalProductos);
            const thumb = existingThumb || existingFull || normalizeUrl(defaultImageUrlModalProductos);

            setMainItem({ key: 'product', kind: 'product', thumb, full });
            if (full) setSelectedImage(full);
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

                const full = normalizeUrl(buena?.ficadjunto || baja?.ficadjunto || defaultImageUrlModalProductos);
                const thumb = normalizeUrl(baja?.ficadjunto || buena?.ficadjunto || defaultImageUrlModalProductos);

                setSelectedProduct((p) => ({
                    ...p,
                    imageBuena: full || p?.imageBuena,
                    imageBaja: thumb || p?.imageBaja,
                }));

                setMainItem({ key: 'product', kind: 'product', thumb, full });
                if (full) setSelectedImage(full);
            } catch {
                const fallback = normalizeUrl(defaultImageUrlModalProductos);
                if (fallback) setSelectedImage(fallback);
            }
        })();
    }, [selectedProduct, defaultImageUrlModalProductos, setSelectedProduct]);

    // Galería
    useEffect(() => {
        const fetchGallery = async () => {
            if (!selectedProduct?.nombre || !selectedProduct?.codfamil) return;

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`
                );
                const data = await res.json();

                const mismos = data.filter((p) => p.nombre === selectedProduct.nombre);
                const images = await Promise.all(
                    mismos.map(async (prod) => {
                        const response = await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/PRODUCTO_BUENA`
                        );
                        const json = response.ok ? await response.json() : null;
                        return normalizeUrl(json?.ficadjunto);
                    })
                );

                const filtered = images.filter(Boolean);
                setGalleryImages(filtered);

                const current = normalizeUrl(selectedProduct.imageBuena || selectedImage);
                const initialIndex = current ? filtered.findIndex((img) => img === current) : -1;
                setPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
            } catch {
                setGalleryImages([]);
            }
        };

        fetchGallery();
    }, [selectedProduct, selectedImage]);

    // Artística (por codprodu) + Ambientes (por nombre normalizado)
    useEffect(() => {
        if (!selectedProduct?.codprodu) {
            setArtisticPairs([]);
            setSelectedArtisticIndex(0);
            return;
        }

        const cod = selectedProduct.codprodu;
        const normalizedNombre = normalizeProductNameForImages(selectedProduct?.nombre);

        if (prevCodProduRef.current === cod) return;
        prevCodProduRef.current = cod;

        let cancelled = false;

        (async () => {
            try {
                // 1) Artística por codprodu
                const [bajaRes, buenaRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${cod}/ARTISTICA_BAJA`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${cod}/ARTISTICA_BUENA`),
                ]);

                const bajaJson = bajaRes.ok ? await bajaRes.json() : null;
                const buenaJson = buenaRes.ok ? await buenaRes.json() : null;

                const bajaUrl = normalizeUrl(bajaJson?.ficadjunto || bajaJson?.url);
                const buenaUrl = normalizeUrl(buenaJson?.ficadjunto || buenaJson?.url);

                const artistic =
                    bajaUrl || buenaUrl
                        ? [
                            {
                                key: 'artistica',
                                kind: 'artistica',
                                thumb: bajaUrl || buenaUrl,
                                full: buenaUrl || bajaUrl,
                            },
                        ]
                        : [];

                // 2) Ambientes por nombre (normalizado)
                let ambiente = [];
                if (normalizedNombre.length) {
                    const res = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/images/product-name/${encodeURIComponent(normalizedNombre)}`
                    );

                    const json = res.ok ? await res.json() : [];
                    const images = ensureArray(json);

                    ambiente = buildAmbientePairsFromImages(images);
                }

                if (!cancelled) {
                    setArtisticPairs([...artistic, ...ambiente]);
                    setSelectedArtisticIndex(0);
                }
            } catch {
                if (!cancelled) {
                    setArtisticPairs([]);
                    setSelectedArtisticIndex(0);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedProduct?.codprodu, selectedProduct?.nombre]);

    // Opcional: blindaje para que nunca sea "" (evita warnings si alguien renderiza selectedImage sin check)
    const safeSelectedImage = typeof selectedImage === 'string' && selectedImage.trim() ? selectedImage : null;

    return {
        selectedImage: safeSelectedImage,
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