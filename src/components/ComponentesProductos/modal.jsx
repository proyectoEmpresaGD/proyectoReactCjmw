import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Footer from "../../components/footer";
import Filtro from '../../app/products/buttonFiltro';
import CarruselMismoEstilo from "./CarruselEstiloProducto";
import CarruselColeccion from "./CarruselProductosColeccion";
import { CartProvider, useCart } from "../CartContext";
import { useMarca } from '../MarcaContext';
import {
    defaultImageUrlModalProductos,
    mantenimientoImages,
    usoImages,
    marcasMap,
    direccionLogos
} from '../../Constants/constants';

// Share icons
import { Share2 } from 'lucide-react';
import {
    Facebook,
    Linkedin,
    Twitter,
    Mail,
    MessageCircle,
} from "lucide-react";


// NUEVOS COMPONENTES
import ProductImageViewer from './modal/ProductImageViewer';
import ProductTechSheet from './modal/ProductTechSheet';
import ProductPdfSheet from './modal/ProductPdfSheet';

// NUEVOS HOOKS/UTILS
import { useProductAssets } from './modal/hooks/useProductAssets';
import { useProductMedia } from './modal/hooks/useProductMedia';
import { useRelatedProducts } from './modal/hooks/useRelatedProducts';
import { encryptProductId, generateProductPdf, shareUrlFor } from './modal/hooks/modalUtils';
import useFixedPopover from './modal/hooks/useFixedPopover';

const Modal = ({ isOpen, close, product, alt, onApplyFilters }) => {
    const { t } = useTranslation('productModal');
    const getNombreMarca = (codmarca) => marcasMap[codmarca] || "Marca Desconocida";

    const { addToCart } = useCart();
    const { setMarcaActiva } = useMarca();

    const navigate = useNavigate();
    const location = useLocation();

    const modalRef = useRef(null);
    const etiquetaRef = useRef(null);

    const [selectedProduct, setSelectedProduct] = useState(product);
    const [modalMapaOpen, setModalMapaOpen] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const IconoDestacables = useMemo(
        () => ["FR", "OUTDOOR", "EASYCLEAN", "IMO", "90% OPACIDAD", "100% OPACIDAD"],
        []
    );
    const [showIconMeaning, setShowIconMeaning] = useState('');

    // ====== RUTAS MARCA ======
    const brandRoutes = useMemo(() => ({
        ARE: '/arenaHome',
        HAR: '/harbourHome',
        BAS: '/bassariHome',
        CJM: '/cjmHome',
        FLA: '/flamencoHome',
    }), []);

    /* ==================== Navegación / estados base ==================== */
    useEffect(() => {
        if (!isOpen) return;
        const isSearchRoute = location.pathname.includes('products') && location.search.includes('search');
        if (isSearchRoute) close();
    }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.closeModalGlobal = close;
        return () => { delete window.closeModalGlobal; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isOpen) setSelectedProduct(product);
    }, [product, isOpen]);

    // Marca activa (cuando hay producto)
    useEffect(() => {
        if (!selectedProduct?.codmarca) return;
        setMarcaActiva((selectedProduct.codmarca || '').toUpperCase());
    }, [selectedProduct?.codmarca, setMarcaActiva]);

    // ====== ASSETS (base64 + pdfLogo + pdfProductImage) ======
    const {
        usoBase64,
        mantBase64,
        direccionBase64,
        pdfLogo,
        pdfProductImage,
    } = useProductAssets({
        selectedProduct,
        usoImages,
        mantenimientoImages,
        direccionLogos,
    });

    // ====== MEDIA (imagen principal, galería, lightbox, artística) ======
    const media = useProductMedia({
        selectedProduct,
        defaultImageUrlModalProductos,
        initialSelectedImage: product?.imageBuena || product?.imageBaja || defaultImageUrlModalProductos,
        setSelectedProduct,
    });

    // ====== RELACIONADOS / COLECCIÓN (swatches, anchos, carrusel colección) ======
    const related = useRelatedProducts({
        selectedProduct,
        setSelectedProduct,
        setSelectedImage: media.setSelectedImage,
        modalRef,
        defaultImageUrlModalProductos,
    });

    // ========================= SHARE =========================
    const [showShare, setShowShare] = useState(false);
    const shareBtnRef = useRef(null);
    const sharePos = useFixedPopover(shareBtnRef, showShare, { x: 0, y: 10 }, 8, 260);

    const currentShareUrl = selectedProduct?.codprodu
        ? encryptProductId(selectedProduct.codprodu)
        : window.location.href;

    const shareTitle = selectedProduct?.nombre ?? 'Producto';
    const shareText = `${shareTitle}${selectedProduct?.tonalidad ? ' - ' + selectedProduct.tonalidad : ''}`;

    const onShareButtonClick = async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({ title: shareTitle, text: shareText, url: currentShareUrl });
                return;
            }
        } catch {
            // si el usuario cancela o falla, abrimos popover
        }
        setShowShare((s) => !s);
    };

    useEffect(() => {
        if (!showShare) return;
        const onDocClick = (e) => {
            if (shareBtnRef.current && !shareBtnRef.current.contains(e.target)) setShowShare(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [showShare]);

    const getShareHref = (name) => shareUrlFor({ name, url: currentShareUrl, text: shareText });

    // ========================= HANDLERS =========================
    const handleClose = () => {
        close();

        // detectar si estoy en una home de marca y NO borrar marcaActiva en ese caso
        const brandPaths = ['/arenaHome', '/harbourHome', '/bassariHome', '/cjmHome', '/flamencoHome'];
        const onBrandHome = brandPaths.includes(location.pathname);
        if (!onBrandHome) setMarcaActiva(null);

        // limpiar params de producto si venías con pid/productId
        const hash = window.location.hash;
        const hasHashParams = hash.startsWith("#/products") && (hash.includes("pid=") || hash.includes("productId="));
        const searchParams = new URLSearchParams(location.search);
        const hasQueryParams = searchParams.has("pid") || searchParams.has("productId");
        if (hasHashParams || hasQueryParams) navigate("/products", { replace: true });
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        addToCart({
            id: selectedProduct.codprodu,
            name: selectedProduct.nombre,
            price: 3,
            image: selectedProduct.imageBaja,
            color: selectedProduct.tonalidad,
            quantity: quantity,
            ancho: selectedProduct.ancho,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleCollectionClick = () => {
        if (!selectedProduct?.coleccion) return;
        const params = new URLSearchParams({ collection: selectedProduct.coleccion });
        close();
        navigate(`/products?${params.toString()}`);
    };

    const handleMarcaClick = () => {
        if (!selectedProduct?.codmarca) return;
        const code = (selectedProduct.codmarca || '').toUpperCase();
        const route = brandRoutes[code];
        if (!route) return;
        setMarcaActiva(code);
        close();
        navigate(route);
    };

    const handleDetailClick = (productItem) => {
        setSelectedProduct(productItem);
        if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ========================= ICONS UI HELPERS =========================
    const getMantenimientoImages = (m) => {
        if (!m) return [];
        try {
            const vals = Array
                .from(new DOMParser().parseFromString(m, 'text/xml').getElementsByTagName('Valor'))
                .map(n => n.textContent.trim());

            return vals
                .filter(v => mantenimientoImages[v])
                .map(v => (
                    <img
                        key={v}
                        src={mantenimientoImages[v]}
                        alt={v}
                        className="w-7 h-7 cursor-pointer transition-transform duration-200 hover:scale-110"
                        onClick={() => navigate('/usages')}
                    />
                ));
        } catch {
            return [];
        }
    };

    const getUsoImages = (u) => {
        if (!u) return [];
        return u
            .split(';').map(x => x.trim())
            .filter(x => usoImages[x])
            .map(x => (
                <img
                    key={x}
                    src={usoImages[x]}
                    alt={x}
                    className="w-7 h-7 cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate('/usages')}
                />
            ));
    };

    const getDireccionImage = (direccion) => {
        if (!direccion || !direccionLogos[direccion]) return null;
        return (
            <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2">
                <img
                    src={direccionLogos[direccion]}
                    alt={direccion}
                    className={`${direccion === 'RAILROADED' ? 'h-7 w-9' : 'h-8 w-8'} object-contain`}
                    onClick={() => navigate('/usages')}
                />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600 leading-none">
                    {direccion}
                </span>
            </div>
        );
    };

    const getMantenimientoDestacados = (mantenimiento) => {
        if (!mantenimiento) return null;
        try {
            const xmlDoc = new DOMParser().parseFromString(mantenimiento, "text/xml");
            const valores = xmlDoc.getElementsByTagName("Valor");

            const list = Array.from(valores)
                .map(node => node.textContent.trim())
                .filter(m => IconoDestacables.includes(m) && mantenimientoImages[m]);

            return list.map((m, index) => (
                <div key={index} className="flex items-center mr-4">
                    <img
                        src={mantenimientoImages[m]}
                        alt={m}
                        className="w-6 h-6 mr-2"
                        onClick={() => setShowIconMeaning(m)}
                    />
                    <span>{m}</span>
                </div>
            ));
        } catch {
            return null;
        }
    };

    const getUsoDestacados = (usos) => {
        if (!usos) return null;
        const usoList = usos
            .split(';')
            .map(u => u.trim())
            .filter(u => IconoDestacables.includes(u) && usoImages[u]);

        return usoList.map((uso, index) => (
            <div key={index} className="flex items-center mr-4 ">
                <img
                    src={usoImages[uso]}
                    alt={uso}
                    className="w-6 h-6 mr-2"
                    onClick={() => setShowIconMeaning(uso)}
                />
                <span>{uso}</span>
            </div>
        ));
    };

    const usoMantenimientoIcons = [
        ...(selectedProduct?.uso ? (getUsoDestacados(selectedProduct.uso) || []) : []),
        ...(selectedProduct?.mantenimiento ? (getMantenimientoDestacados(selectedProduct.mantenimiento) || []) : []),
    ];

    // ========================= TECH SHEET ITEMS =========================
    const formatCmValue = (value) => value ? `${parseFloat(value).toFixed(2)} cm` : t('notAvailable');

    const widthElement = (related.anchoOptions?.length ?? 0) > 1 ? (
        <div className="mt-1 w-full">
            <select
                value={selectedProduct?.ancho || ''}
                onChange={related.handleAnchoChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
            >
                {related.anchoOptions.map((ancho, index) => (
                    <option key={index} value={ancho}>{ancho}</option>
                ))}
            </select>
        </div>
    ) : (
        selectedProduct?.ancho || t('notAvailable')
    );

    const detailItems = useMemo(() => ([
        { key: 'type', label: t('type'), value: selectedProduct?.tipo || t('notAvailable') },
        { key: 'style', label: t('style'), value: selectedProduct?.estilo || t('notAvailable') },
        { key: 'martindale', label: t('martindale'), value: selectedProduct?.martindale || t('notAvailable') },
        { key: 'rapportH', label: t('rapportH'), value: formatCmValue(selectedProduct?.repminhor) },
        { key: 'rapportV', label: t('rapportV'), value: formatCmValue(selectedProduct?.repminver) },
        { key: 'composition', label: t('composition'), value: selectedProduct?.composicion || t('notAvailable') },
        { key: 'weight', label: t('weight'), value: selectedProduct?.gramaje ? `${selectedProduct.gramaje} g/m²` : t('notAvailable') },
        { key: 'width', label: t('width'), value: widthElement }
    ]), [
        t,
        selectedProduct?.tipo,
        selectedProduct?.estilo,
        selectedProduct?.martindale,
        selectedProduct?.repminhor,
        selectedProduct?.repminver,
        selectedProduct?.composicion,
        selectedProduct?.gramaje,
        selectedProduct?.ancho,
        widthElement
    ]);

    // ========================= PDF EXPORT =========================
    const handleGeneratePDF = async () => {
        try {
            const filename = `${(selectedProduct?.nombre || 'product').replace(/[^a-z0-9]/gi, '_')}.pdf`;
            await generateProductPdf({ etiquetaEl: etiquetaRef.current, filename });
        } catch (e) {
            console.error('PDF error:', e);
        }
    };

    if (!isOpen) return null;

    const isSingleWord = (txt) => {
        if (!txt) return false;
        return !/\s/.test(txt.trim());
    };

    const productHeader = (
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                        {selectedProduct?.nombre || t('noProductName')}
                    </h1>
                    {selectedProduct?.tonalidad && (
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                            {selectedProduct.tonalidad}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    {selectedProduct?.coleccion && (
                        <button
                            type="button"
                            onClick={handleCollectionClick}
                            className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            {t('collection')}: {selectedProduct.coleccion}
                        </button>
                    )}

                    {selectedProduct?.codmarca && (
                        <button
                            type="button"
                            onClick={handleMarcaClick}
                            className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 transición hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            {t('brand')}: {getNombreMarca(selectedProduct.codmarca)}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <CartProvider>
            <div
                ref={modalRef}
                className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm overflow-y-auto 4xl:pt-[3%] 3xl:pt-[4%] xl:pt-[6%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%] pt-[24%]"
            >
                {/* Contenedor con footer pegado al fondo del viewport */}
                <div className="flex flex-col min-h-screen">
                    <div
                        className="relative mx-auto max-w-6xl p-3 sm:p-4 md:p-6 lg:p-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative rounded-3xl border border-white/50 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl overflow-hidden">
                            <div className="pointer-events-none absolute -top-32 right-8 h-64 w-64 rounded-full bg-gray-300/40 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 left-4 h-56 w-56 rounded-full bg-gray-200/40 blur-2xl" />

                            <div className="relative space-y-6 sm:space-y-8 p-3 max-w-[90vw] md:w-full sm:p-4 md:p-6 lg:p-10">
                                {/* Barra superior (acciones + header, invertido en móvil) */}
                                <div className="flex flex-wrap items-start justify-between gap-6 sm:gap-8">
                                    {/* Acciones: primero en móvil, a la derecha en desktop */}
                                    <div className="order-1 lg:order-2 w-full lg:w-auto ml-auto flex items-center gap-2 sm:gap-3 justify-end lg:justify-end">
                                        <button
                                            ref={shareBtnRef}
                                            onClick={onShareButtonClick}
                                            className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-gray-700 shadow-sm transition hover:shadow-md hover:scale-105"
                                            title={t('share', 'Share')}
                                            type="button"
                                        >
                                            <Share2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">{t('share', 'Share')}</span>
                                        </button>

                                        {showShare && (
                                            <div
                                                style={{ position: 'fixed', top: sharePos.top, left: sharePos.left }}
                                                className="z-50 flex max-w-[90vw] flex-wrap items-center gap-2 rounded-xl bg-white p-2 sm:p-3 shadow-lg border border-gray-100"
                                            >
                                                {[
                                                    { name: 'Facebook', color: '#1877F2', icon: Facebook },
                                                    { name: 'Twitter', color: '#000000', icon: Twitter },
                                                    { name: 'WhatsApp', color: '#25D366', icon: MessageCircle },
                                                    { name: 'LinkedIn', color: '#0A66C2', icon: Linkedin },
                                                    { name: 'Gmail', color: '#EA4335', icon: Mail },
                                                    { name: 'Email', color: '#334155', icon: Mail },
                                                ].map((s, i) => (
                                                    <a
                                                        key={i}
                                                        href={getShareHref(s.name)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-full p-2 sm:p-2.5 transition hover:scale-110"
                                                        style={{ backgroundColor: s.color }}
                                                        title={s.name}
                                                        aria-label={`Compartir por ${s.name}`}
                                                    >
                                                        <s.icon className="text-white h-5 w-5 sm:h-5 sm:w-5" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleClose}
                                            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-800 shadow-sm transition hover:scale-105 hover:shadow-md"
                                            title={t('closeModal')}
                                            type="button"
                                        >
                                            <img
                                                src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/undo_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                                                alt={t('closeAlt')}
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                            />
                                        </button>
                                    </div>

                                    {/* Header: segundo en móvil, alineado y con mismo ancho que la imagen */}
                                    <div className="order-2 lg:order-1 w-full lg:w-7/12 mx-auto lg:mx-0">
                                        {productHeader}
                                    </div>
                                </div>

                                {/* Filtro debajo del header */}
                                <div className="shrink-0">
                                    <Filtro
                                        setFilteredProducts={(filteredProducts, selectedFilters) => {
                                            if (onApplyFilters) onApplyFilters(filteredProducts, selectedFilters);
                                            close();
                                        }}
                                        page={1}
                                    />
                                </div>

                                {/* Contenido principal */}
                                <div className="flex flex-col gap-8 lg:gap-10 lg:flex-row">
                                    {/* Imagen / zoom -> COMPONENTE */}
                                    <ProductImageViewer
                                        selectedImage={media.selectedImage}
                                        alt={alt}
                                        t={t}
                                        isViewerOpen={media.isViewerOpen}
                                        setIsViewerOpen={media.setIsViewerOpen}
                                        galleryImages={media.galleryImages}
                                        photoIndex={media.photoIndex}
                                        setPhotoIndex={media.setPhotoIndex}
                                        artisticPairs={media.artisticPairs}
                                        selectedArtisticIndex={media.selectedArtisticIndex}
                                        setSelectedArtisticIndex={media.setSelectedArtisticIndex}
                                        mainItem={media.mainItem}
                                        setMainItem={media.setMainItem}
                                        setSelectedImage={media.setSelectedImage}
                                        setArtisticPairs={media.setArtisticPairs}
                                    />

                                    {/* Info y acciones */}
                                    <div className="flex-1 space-y-5 sm:space-y-6">
                                        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg">
                                            <div className="space-y-4 sm:space-y-5">
                                                <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 sm:px-5 py-4 shadow-sm sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">
                                                            {t('chooseQuantity')}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{t('smallSample')}</p>
                                                    </div>

                                                    <div className="mt-3 sm:mt-0 flex items-center gap-3 sm:gap-4">
                                                        <select
                                                            id="quantity"
                                                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                        </select>
                                                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">3€</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    className="inline-flex items-center gap-3 self-start rounded-full border border-neutral-200 bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-200"
                                                    title={t('orderSample')}
                                                    type="button"
                                                >
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50 border border-neutral-200">
                                                        <img
                                                            src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/04_QUALITY/fabric.png"
                                                            alt={t('sampleAlt')}
                                                            className="h-7 w-7 object-contain"
                                                        />
                                                    </span>
                                                    <span>{t('addToCart')}</span>
                                                </button>

                                                {usoMantenimientoIcons.length > 0 && (
                                                    <div className="flex flex-wrap gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-gray-700 shadow-inner">
                                                        {usoMantenimientoIcons}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Swatches */}
                                        {related.relatedProducts?.length > 1 && (
                                            <div className="rounded-3xl border border-white/60 bg-white/70 p-4 sm:p-5 shadow-sm">
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {related.relatedProducts
                                                        .filter((p, idx, arr) =>
                                                            p.tonalidad && idx === arr.findIndex(q =>
                                                                q.tonalidad?.trim().toLowerCase() === p.tonalidad?.trim().toLowerCase()
                                                            )
                                                        )
                                                        .map((colorProduct, i) => (
                                                            <button
                                                                type="button"
                                                                key={i}
                                                                className="relative w-24 sm:w-24 aspect-square overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                                                onClick={() => related.handleColorClick(colorProduct)}
                                                                title={colorProduct.tonalidad}
                                                            >
                                                                <img
                                                                    src={colorProduct.imageBaja}
                                                                    alt={colorProduct.tonalidad}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <span
                                                                    className={
                                                                        `absolute inset-x-1 bottom-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white leading-tight text-center ` +
                                                                        (isSingleWord(colorProduct.tonalidad) ? 'whitespace-nowrap' : 'whitespace-normal')
                                                                    }
                                                                    style={{ hyphens: 'none' }}
                                                                >
                                                                    {colorProduct.tonalidad}
                                                                </span>
                                                            </button>
                                                        ))}
                                                </div>

                                                <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
                                                    <span className="text-lg font-semibold">{related.productsForCarousel.length}</span>
                                                    <span className="text-sm">
                                                        {related.productsForCarousel.length === 1
                                                            ? t('carousel.oneColor')
                                                            : t('carousel.manyColors', { count: related.productsForCarousel.length })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* FICHA TÉCNICA (UI) -> COMPONENTE */}
                                <ProductTechSheet
                                    t={t}
                                    detailItems={detailItems}
                                    selectedProduct={selectedProduct}
                                    getUsoImages={getUsoImages}
                                    getMantenimientoImages={getMantenimientoImages}
                                    getDireccionImage={getDireccionImage}
                                    onDownloadPdf={handleGeneratePDF}
                                />

                                {/* Carruseles */}
                                {related.recommendedProducts
                                    .filter((item) => item.nombre !== selectedProduct?.nombre).length > 0 && (
                                        <CarruselColeccion
                                            productos={related.recommendedProducts.filter((item) => item.nombre !== selectedProduct?.nombre)}
                                            onProductoClick={handleDetailClick}
                                            titulo={selectedProduct?.coleccion}
                                        />
                                    )}

                                <CarruselMismoEstilo
                                    estilo={selectedProduct?.estilo}
                                    excludeNombre={selectedProduct?.nombre}
                                    excludeColeccion={selectedProduct?.coleccion}
                                    onProductoClick={handleDetailClick}
                                />
                            </div>
                        </div>

                        {addedToCart && (
                            <div className="fixed bottom-10 right-4 sm:right-10 z-50 flex items-center space-x-3 sm:space-x-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-4 sm:px-6 py-3 text-white shadow-2xl">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/03_POP%20UP/Check.svg"
                                    alt={t('successAlt')}
                                    className="h-6 w-6 sm:h-8 sm:w-8"
                                />
                                <span className="text-base sm:text-lg font-semibold">{t('addedSuccess')}</span>
                            </div>
                        )}

                        {showIconMeaning && (
                            <div className="fixed bottom-10 left-4 sm:left-10 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl">
                                <h3 className="text-lg font-semibold text-gray-900">{t('iconTitle')}</h3>
                                <p className="mt-1 text-sm text-gray-600">{showIconMeaning}</p>
                                <button
                                    className="mt-3 text-sm font-semibold text-gray-700 underline"
                                    onClick={() => setShowIconMeaning('')}
                                >
                                    {t('closeBtn')}
                                </button>
                            </div>
                        )}

                        {/* {modalMapaOpen && <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />} */}
                    </div>

                    {/* Footer de la modal pegado abajo */}
                    <footer className="mt-auto">
                        <Footer />
                    </footer>
                </div>
            </div>

            {/* PDF OFFSCREEN -> COMPONENTE */}
            <ProductPdfSheet
                etiquetaRef={etiquetaRef}
                t={t}
                selectedProduct={selectedProduct}
                getNombreMarca={getNombreMarca}
                pdfLogo={pdfLogo}
                pdfProductImage={pdfProductImage}
                usoBase64={usoBase64}
                mantBase64={mantBase64}
                direccionBase64={direccionBase64}
            />
        </CartProvider>
    );
};

export default Modal;
