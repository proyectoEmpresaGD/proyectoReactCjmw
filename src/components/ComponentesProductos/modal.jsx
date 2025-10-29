import { useState, useEffect, useRef } from 'react';
import ModalMapa from "./modalMapa";
import { useCart } from '../CartContext';
import QRCode from 'react-qr-code';
import { CartProvider } from "../CartContext";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Filtro from '../../app/products/buttonFiltro';
import CarruselMismoEstilo from "./CarruselEstiloProducto";
import { useMarca } from '../MarcaContext';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import CryptoJS from 'crypto-js';
import Footer from "../../components/footer";
import CarruselColeccion from "./CarruselProductosColeccion";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from "react-router-dom";
import { cdnUrl } from '../../Constants/cdn';
import {
    defaultImageUrlModalProductos,
    mantenimientoImages,
    usoImages,
    marcasMap,
    direccionLogos
} from '../../Constants/constants';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

// Botón compartir moderno (sin framer-motion)
import { Share2 } from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

/* =========================================================================
   FETCH a base64 con cache + deduplicación + semáforo (evitar 429)
   ========================================================================= */
const b64Cache = new Map();          // url -> base64
const inflight = new Map();          // url -> Promise<string>
let active = 0;
const MAX_CONCURRENCY = 3;
const pendingQueue = [];

const runNext = () => {
    if (active >= MAX_CONCURRENCY) return;
    const job = pendingQueue.shift();
    if (!job) return;
    active++;
    job().finally(() => {
        active--;
        runNext();
    });
};

const toBase64 = async (url) => {
    try {
        if (!url || typeof url !== 'string' || url.trim() === '') return '';
        const cleanUrl = decodeURIComponent(url);
        if (b64Cache.has(cleanUrl)) return b64Cache.get(cleanUrl);
        if (inflight.has(cleanUrl)) return inflight.get(cleanUrl);

        const p = new Promise((resolve) => {
            const task = async () => {
                try {
                    const proxied = `${import.meta.env.VITE_API_BASE_URL}/api/proxy?url=${encodeURIComponent(cleanUrl)}`;
                    const response = await fetch(proxied, { cache: 'no-store' });
                    if (!response.ok) {
                        inflight.delete(cleanUrl);
                        resolve('');
                        return;
                    }
                    const blob = await response.blob();
                    const b64 = await new Promise((res, rej) => {
                        const reader = new FileReader();
                        reader.onloadend = () => res(reader.result);
                        reader.onerror = rej;
                        reader.readAsDataURL(blob);
                    });
                    b64Cache.set(cleanUrl, b64);
                    inflight.delete(cleanUrl);
                    resolve(b64);
                } catch {
                    inflight.delete(cleanUrl);
                    resolve('');
                }
            };
            pendingQueue.push(task);
            runNext();
        });

        inflight.set(cleanUrl, p);
        return await p;
    } catch {
        return '';
    }
};

const encryptProductId = (productId) => {
    const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
    const encrypted = CryptoJS.AES.encrypt(productId, secretKey).toString();
    const someSecureToken = uuidv4();
    return `https://www.cjmw.eu/#/products?pid=${encodeURIComponent(encrypted)}&sid=${someSecureToken}`;
};

const brandLogosPDF = {
    "HAR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png",
    "CJM": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png",
    "FLA": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png",
    "ARE": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png",
    "BAS": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png"
};

const getLogoBase64 = async codmarca => {
    const key = (codmarca || '').toUpperCase();
    const url = brandLogosPDF[key];
    return url ? await toBase64(url) : '';
};

// Popover fijo
function useFixedPopover(anchorRef, isOpen, preferredOffset = { x: 0, y: 10 }, minPad = 8, estWidth = 260) {
    const [pos, setPos] = useState({ top: 0, left: 0 });
    useEffect(() => {
        if (!isOpen) return;
        const place = () => {
            const el = anchorRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            let left = r.left + preferredOffset.x;
            let top = r.bottom + preferredOffset.y;
            const maxLeft = window.innerWidth - estWidth - minPad;
            left = Math.max(minPad, Math.min(left, maxLeft));
            const estimatedH = 56;
            if (top + estimatedH > window.innerHeight - minPad) {
                top = r.top - preferredOffset.y - estimatedH;
            }
            setPos({ top, left });
        };
        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    }, [anchorRef, isOpen, preferredOffset.x, preferredOffset.y, minPad, estWidth]);
    return pos;
}

const PAGE_W_CM = 21;
const PAGE_H_CM = 29.7;

const Modal = ({ isOpen, close, product, alt, onApplyFilters }) => {
    const { t } = useTranslation('productModal');
    const getNombreMarca = (codmarca) => marcasMap[codmarca] || "Marca Desconocida";

    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const modalRef = useRef(null);

    const [direccionBase64, setDireccionBase64] = useState({});
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(product);
    const [modalMapaOpen, setModalMapaOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(product?.imageBuena || product?.imageBaja || defaultImageUrlModalProductos);

    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productsForCarousel, setProductsForCarousel] = useState([]);
    const [anchoOptions, setAnchoOptions] = useState([]);
    const [selectedAncho, setSelectedAncho] = useState('');
    const IconoDestacables = ["FR", "OUTDOOR", "EASYCLEAN", "IMO", "90% OPACIDAD", "100% OPACIDAD"];
    const { setMarcaActiva } = useMarca();
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const brandRoutes = {
        ARE: '/arenaHome',
        HAR: '/harbourHome',
        BAS: '/bassariHome',
        CJM: '/cjmHome',
        FLA: '/flamencoHome',
    };
    const prevColeccionRef = useRef();
    const prevNombreRef = useRef();

    const [usoBase64, setUsoBase64] = useState({});
    const [mantBase64, setMantBase64] = useState({});
    const [brandBase64, setBrandBase64] = useState({});

    const [addedToCart, setAddedToCart] = useState(false);
    const [showIconMeaning, setShowIconMeaning] = useState('');

    // PDF (A4 offscreen en DOM)
    const etiquetaRef = useRef(null);
    const [pdfLogo, setPdfLogo] = useState('');
    const [pdfProductImage, setPdfProductImage] = useState('');
    const innerWrapRef = useRef(null);
    const [pdfScale, setPdfScale] = useState(1);

    // Share
    const [showShare, setShowShare] = useState(false);
    const shareBtnRef = useRef(null);
    const sharePos = useFixedPopover(shareBtnRef, showShare, { x: 0, y: 10 }, 8, 260);

    /* ==================== Navegación / estados base ==================== */
    useEffect(() => {
        if (!isOpen) return;
        const isSearchRoute = location.pathname.includes('products') && location.search.includes('search');
        if (isSearchRoute) close();
    }, [location.key]);

    useEffect(() => {
        window.closeModalGlobal = close;
        return () => { delete window.closeModalGlobal; };
    }, []);

    useEffect(() => {
        if (isOpen) setSelectedProduct(product);
    }, [product, isOpen]);

    // Cargar iconos/brand
    useEffect(() => {
        if (!selectedProduct) return;
        (async () => {
            try {
                if (selectedProduct.codmarca) {
                    const cod = (selectedProduct.codmarca || '').toUpperCase();
                    if (!brandBase64[cod]) {
                        const b64 = await getLogoBase64(cod);
                        setBrandBase64(prev => ({ ...prev, [cod]: b64 }));
                    }
                }
                const usos = (selectedProduct.uso || '')
                    .split(';').map(s => s.trim()).filter(Boolean).filter(code => usoImages[code]);
                const usosProm = usos.map(u => toBase64(usoImages[u]).then(b64 => ({ u, b64 })));
                const usosRes = await Promise.allSettled(usosProm);
                const addUsos = {};
                usosRes.forEach(r => { if (r.status === 'fulfilled' && r.value?.b64) addUsos[r.value.u] = r.value.b64; });
                if (Object.keys(addUsos).length) setUsoBase64(prev => ({ ...prev, ...addUsos }));

                let mantVals = [];
                try {
                    mantVals = Array
                        .from(new DOMParser().parseFromString(selectedProduct.mantenimiento || '<root/>', 'text/xml')
                            .getElementsByTagName('Valor'))
                        .map(n => n.textContent.trim())
                        .filter(Boolean)
                        .filter(code => mantenimientoImages[code]);
                } catch { mantVals = []; }

                const mantProm = mantVals.map(m => toBase64(mantenimientoImages[m]).then(b64 => ({ m, b64 })));
                const mantRes = await Promise.allSettled(mantProm);
                const addMant = {};
                mantRes.forEach(r => { if (r.status === 'fulfilled' && r.value?.b64) addMant[r.value.m] = r.value.b64; });
                if (Object.keys(addMant).length) setMantBase64(prev => ({ ...prev, ...addMant }));

                if (selectedProduct.direcciontela && direccionLogos[selectedProduct.direcciontela] && !direccionBase64[selectedProduct.direcciontela]) {
                    const dirB64 = await toBase64(direccionLogos[selectedProduct.direcciontela]);
                    setDireccionBase64(prev => ({ ...prev, [selectedProduct.direcciontela]: dirB64 }));
                }
            } catch { }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.codprodu]);

    // Logo/imagen para PDF
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.codmarca) {
            getLogoBase64(selectedProduct.codmarca).then(setPdfLogo).catch(() => { });
        }
        const url = selectedProduct.imageBuena || selectedProduct.imageBaja;
        if (url) toBase64(url).then(setPdfProductImage).catch(() => { });
    }, [selectedProduct]);

    // Marca activa
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.codmarca) {
            const cod = (selectedProduct.codmarca || '').toUpperCase();
            setMarcaActiva(cod);
        }
    }, [selectedProduct]);

    // Imagen si falta
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.imageBuena || selectedProduct.imageBaja) {
            setSelectedImage(selectedProduct.imageBuena || selectedProduct.imageBaja);
            return;
        }
        (async () => {
            try {
                const [buenaRes, bajaRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/Buena`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/Baja`)
                ]);
                const buena = buenaRes.ok ? await buenaRes.json() : null;
                const baja = bajaRes.ok ? await bajaRes.json() : null;
                const img = buena ? `https://${buena.ficadjunto}` : (baja ? `https://${baja.ficadjunto}` : defaultImageUrlModalProductos);
                setSelectedProduct(p => ({ ...p, imageBuena: img, imageBaja: img }));
                setSelectedImage(img);
            } catch {
                setSelectedImage(defaultImageUrlModalProductos);
            }
        })();
    }, [selectedProduct]);

    // Galería
    useEffect(() => {
        const fetchGalleryImages = async () => {
            if (!selectedProduct?.nombre || !selectedProduct?.codfamil) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await res.json();
                const productosMismoNombre = data.filter(p => p.nombre === selectedProduct.nombre);
                const images = await Promise.all(productosMismoNombre.map(async prod => {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`);
                    const json = response.ok ? await response.json() : null;
                    if (!json?.ficadjunto) return null;
                    return cdnUrl(`https://${json.ficadjunto}`);
                }));
                const filtered = images.filter(Boolean);
                setGalleryImages(filtered);
                const current = cdnUrl(selectedProduct.imageBuena || selectedImage);
                const initialIndex = filtered.findIndex(img => img === current);
                setPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
            } catch {
                setGalleryImages([]);
            }
        };
        fetchGalleryImages();
    }, [selectedProduct, selectedImage]);

    // Relacionados por nombre
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.nombre === prevNombreRef.current) return;
        prevNombreRef.current = selectedProduct.nombre;

        setRelatedProducts([]);
        setProductsForCarousel([]);
        setAnchoOptions([]);
        setSelectedAncho('');

        const fetchRelatedProducts = async () => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await resp.json();

                const mismos = data.filter(p => p.nombre === selectedProduct.nombre);
                const productsWithImages = await Promise.all(mismos.map(async prod => {
                    const [bRes, lRes] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`).then(r => r.ok ? r.json() : null),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Baja`).then(r => r.ok ? r.json() : null)
                    ]);
                    const rawB = bRes?.ficadjunto ? `https://${bRes.ficadjunto}` : null;
                    const rawL = lRes?.ficadjunto ? `https://${lRes.ficadjunto}` : null;
                    return {
                        ...prod,
                        imageBuena: rawB ? cdnUrl(rawB) : (rawL ? cdnUrl(rawL) : defaultImageUrlModalProductos),
                        imageBaja: rawL ? cdnUrl(rawL) : (rawB ? cdnUrl(rawB) : defaultImageUrlModalProductos)
                    };
                }));

                setRelatedProducts(productsWithImages);

                const byTonalidad = productsWithImages.filter((p, i, arr) => {
                    const key = (p.tonalidad || '').trim().toLowerCase();
                    return key && i === arr.findIndex(q => (q.tonalidad || '').trim().toLowerCase() === key);
                });

                setProductsForCarousel(byTonalidad);

                const uniqueAnchos = [...new Set(productsWithImages.map(p => p.ancho).filter(Boolean))];
                if (uniqueAnchos.length) {
                    setAnchoOptions(uniqueAnchos);
                    setSelectedAncho(String(Math.min(...uniqueAnchos.map(Number)).toString()));
                }
            } catch { }
        };
        fetchRelatedProducts();
    }, [selectedProduct]);

    // Por colección
    useEffect(() => {
        if (!selectedProduct?.coleccion) return;
        if (selectedProduct.coleccion === prevColeccionRef.current) return;
        prevColeccionRef.current = selectedProduct.coleccion;

        setCollectionProducts([]);

        const fetchCollectionProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`);
                const data = await response.json();
                const filtered = data.filter(
                    p => p.nombre && p.nombre.trim() !== '' && p.coleccion === selectedProduct.coleccion && p.nombre !== selectedProduct.nombre
                );
                const uniqueByName = filtered.filter((p, idx, self) => idx === self.findIndex(q => q.nombre === p.nombre));
                if (uniqueByName.length > 0) {
                    const productsWithImages = await Promise.all(uniqueByName.map(async prod => {
                        const [b, l] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`).then(res => (res.ok ? res.json() : null)),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Baja`).then(res => (res.ok ? res.json() : null))
                        ]);
                        const rawB = b ? `https://${b.ficadjunto}` : defaultImageUrlModalProductos;
                        const rawL = l ? `https://${l.ficadjunto}` : defaultImageUrlModalProductos;
                        return { ...prod, imageBuena: cdnUrl(rawB), imageBaja: cdnUrl(rawL) };
                    }));
                    setCollectionProducts(productsWithImages);
                } else {
                    setCollectionProducts([]);
                }
            } catch { }
        };
        fetchCollectionProducts();
    }, [selectedProduct]);

    useEffect(() => {
        setRecommendedProducts(collectionProducts);
    }, [collectionProducts]);

    const handleAnchoChange = (e) => {
        const newAncho = e.target.value;
        setSelectedAncho(newAncho);
        const newSelectedProduct = relatedProducts.find(
            p => p.nombre === selectedProduct.nombre && p.tonalidad === selectedProduct.tonalidad && p.ancho === newAncho
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
                if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const [buenaResponse, bajaResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${colorProduct.codprodu}/Buena`),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${colorProduct.codprodu}/Baja`)
            ]);
            const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
            const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;
            const updatedProduct = {
                ...colorProduct,
                imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : '',
                imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : ''
            };
            setSelectedProduct(updatedProduct);
            setSelectedImage(updatedProduct.imageBuena || updatedProduct.imageBaja);
            if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } catch { }
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

    const handleClose = () => {
        close();
        setMarcaActiva(null);
        const hash = window.location.hash;
        const hasHashParams = hash.startsWith("#/products") && (hash.includes("pid=") || hash.includes("productId="));
        const searchParams = new URLSearchParams(location.search);
        const hasQueryParams = searchParams.has("pid") || searchParams.has("productId");
        if (hasHashParams || hasQueryParams) navigate("/products", { replace: true });
    };

    const handleAddToCart = () => {
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
        } catch { return []; }
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
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(mantenimiento, "text/xml");
            const valores = xmlDoc.getElementsByTagName("Valor");
            const list = Array.from(valores)
                .map(node => node.textContent.trim())
                .filter(m => IconoDestacables.includes(m) && mantenimientoImages[m]);
            return list.map((m, index) => (
                <div key={index} className="flex items-center mr-4">
                    <img src={mantenimientoImages[m]} alt={m} className="w-6 h-6 mr-2" onClick={() => setShowIconMeaning(m)} />
                    <span>{m}</span>
                </div>
            ));
        } catch { return null; }
    };

    const getUsoDestacados = (usos) => {
        if (!usos) return null;
        const usoList = usos.split(';').map(u => u.trim()).filter(u => IconoDestacables.includes(u) && usoImages[u]);
        return usoList.map((uso, index) => (
            <div key={index} className="flex items-center mr-4 ">
                <img src={usoImages[uso]} alt={uso} className="w-6 h-6 mr-2" onClick={() => setShowIconMeaning(uso)} />
                <span>{uso}</span>
            </div>
        ));
    };

    const usoMantenimientoIcons = [
        ...(selectedProduct?.uso ? getUsoDestacados(selectedProduct.uso) : []),
        ...(selectedProduct?.mantenimiento ? getMantenimientoDestacados(selectedProduct.mantenimiento) : []),
    ];

    const formatCmValue = (value) => value ? `${parseFloat(value).toFixed(2)} cm` : t('notAvailable');

    const widthElement = (anchoOptions?.length ?? 0) > 1 ? (
        <div className="mt-1 w-full">
            <select
                value={selectedProduct?.ancho || ''}
                onChange={handleAnchoChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
            >
                {anchoOptions.map((ancho, index) => (
                    <option key={index} value={ancho}>{ancho}</option>
                ))}
            </select>
        </div>
    ) : (
        selectedProduct?.ancho || t('notAvailable')
    );

    const detailItems = [
        { key: 'type', label: t('type'), value: selectedProduct?.tipo || t('notAvailable') },
        { key: 'style', label: t('style'), value: selectedProduct?.estilo || t('notAvailable') },
        { key: 'martindale', label: t('martindale'), value: selectedProduct?.martindale || t('notAvailable') },
        { key: 'rapportH', label: t('rapportH'), value: formatCmValue(selectedProduct?.repminhor) },
        { key: 'rapportV', label: t('rapportV'), value: formatCmValue(selectedProduct?.repminver) },
        { key: 'composition', label: t('composition'), value: selectedProduct?.composicion || t('notAvailable') },
        { key: 'weight', label: t('weight'), value: selectedProduct?.gramaje ? `${selectedProduct.gramaje} g/m²` : t('notAvailable') },
        { key: 'width', label: t('width'), value: widthElement }
    ];

    /* ==================== Ajuste de escala del inner (opcional) ==================== */
    useEffect(() => {
        const el = etiquetaRef.current;
        const inner = innerWrapRef.current;
        if (!el || !inner) return;
        const id = requestAnimationFrame(() => {
            const containerH = el.clientHeight;
            const innerH = inner.scrollHeight;
            const nextScale = Math.min(1, (containerH - 6) / innerH);
            setPdfScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
        });
        return () => cancelAnimationFrame(id);
    }, [selectedProduct, pdfLogo, pdfProductImage, usoBase64, mantBase64, direccionBase64]);

    /* ==================== PDF EXPORT ==================== */
    const handleGeneratePDF = async () => {
        if (!etiquetaRef.current) return;

        const opts = {
            margin: 0,
            filename: `${(selectedProduct?.nombre || 'product').replace(/[^a-z0-9]/gi, '_')}.pdf`,
            html2canvas: {
                scale: 2.5,
                useCORS: true,
                allowTaint: true,
                imageTimeout: 3000,
                backgroundColor: null,
                logging: false
            },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        try {
            etiquetaRef.current.getBoundingClientRect();
            await html2pdf().set(opts).from(etiquetaRef.current).save();
        } catch (e) {
            console.error('PDF error:', e);
        }
    };

    const handleDetailClick = (productItem) => {
        setSelectedProduct(productItem);
        if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ========= Compartir =========
    const currentShareUrl = selectedProduct?.codprodu ? encryptProductId(selectedProduct.codprodu) : window.location.href;
    const encodedUrl = encodeURIComponent(currentShareUrl);
    const shareTitle = selectedProduct?.nombre ?? 'Producto';
    const shareText = `${shareTitle}${selectedProduct?.tonalidad ? ' - ' + selectedProduct.tonalidad : ''}`;
    const encodedText = encodeURIComponent(shareText);

    const isMobile = () =>
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

    const shareUrlFor = (name) => {
        switch (name) {
            case 'Facebook': return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'Twitter': return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            case 'WhatsApp': return isMobile()
                ? `https://wa.me/?text=${encodedText}%20${encodedUrl}`
                : `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
            case 'LinkedIn': return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            case 'Gmail': return `https://mail.google.com/mail/?view=cm&to=&su=${encodedText}&body=${encodedUrl}`;
            case 'Email': return `mailto:?subject=${encodedText}&body=${encodedUrl}`;
            default: return currentShareUrl;
        }
    };

    const onShareButtonClick = async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({ title: shareTitle, text: shareText, url: currentShareUrl });
                return;
            }
        } catch {
            // si el usuario cancela o falla, abrimos el popover
        }
        setShowShare((s) => !s);
    };
    // ============================

    useEffect(() => {
        if (!showShare) return;
        const onDocClick = (e) => {
            if (shareBtnRef.current && !shareBtnRef.current.contains(e.target)) setShowShare(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [showShare]);

    if (!isOpen) return null;

    const productHeader = (
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{selectedProduct?.nombre || t('noProductName')}</h1>
                    {selectedProduct?.tonalidad && (
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">{selectedProduct.tonalidad}</p>
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
                            className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                    <div className="relative mx-auto max-w-6xl p-3 sm:p-4 md:p-6 lg:p-10" onClick={(e) => e.stopPropagation()}>
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
                                                    { name: 'Facebook', color: '#1877F2', icon: FaFacebook },
                                                    { name: 'Twitter', color: '#000000', icon: FaTwitter },
                                                    { name: 'WhatsApp', color: '#25D366', icon: FaWhatsapp },
                                                    { name: 'LinkedIn', color: '#0A66C2', icon: FaLinkedin },
                                                    { name: 'Gmail', color: '#EA4335', icon: SiGmail },
                                                    { name: 'Email', color: '#334155', icon: FaEnvelope },
                                                ].map((s, i) => (
                                                    <a
                                                        key={i}
                                                        href={shareUrlFor(s.name)}
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
                                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/POP%20UP/undo_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
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

                                {/* (Opcional) Filtro debajo del header para no perder funcionalidad */}
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
                                    {/* Imagen / zoom */}
                                    <div className="lg:w-7/12 w-full max-w-[100%] mx-auto lg:mx-0">
                                        <div
                                            className="relative rounded-3xl bg-transparent shadow-2xl border-0 p-0 overflow-hidden"
                                            style={{ width: '100%' }}
                                        >
                                            <button
                                                onClick={() => setIsViewerOpen(true)}
                                                className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:scale-110"
                                                title={t('zoomImage')}
                                                type="button"
                                            >
                                                <img
                                                    src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/ICONO%20AMPLIAR.png"
                                                    alt={t('zoomAlt')}
                                                    className="h-5 w-5"
                                                />
                                            </button>

                                            <Zoom>
                                                <InnerImageZoom
                                                    src={selectedImage}
                                                    zoomSrc={selectedImage}
                                                    alt={alt}
                                                    className="!block !w-full !h-auto !object-cover"
                                                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '1.5rem' }}
                                                />
                                            </Zoom>
                                        </div>

                                        {isViewerOpen && (
                                            <Lightbox
                                                open={isViewerOpen}
                                                close={() => setIsViewerOpen(false)}
                                                slides={galleryImages.map((src) => ({ src }))}
                                                index={photoIndex}
                                                on={{ view: ({ index }) => setPhotoIndex(index) }}
                                            />
                                        )}
                                    </div>

                                    {/* Info y acciones */}
                                    <div className="flex-1 space-y-5 sm:space-y-6">
                                        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg">
                                            <div className="space-y-4 sm:space-y-5">
                                                <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 sm:px-5 py-4 shadow-sm sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">{t('chooseQuantity')}</p>
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
                                                            src="https://bassari.eu/ImagenesTelasCjmw/Iconos/QUALITY/fabric.png"
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
                                        {relatedProducts?.length > 1 && (
                                            <div className="rounded-3xl border border-white/60 bg-white/70 p-4 sm:p-5 shadow-sm">
                                                <div className="flex flex-wrap gap-3">
                                                    {relatedProducts
                                                        .filter((p, idx, arr) =>
                                                            p.tonalidad && idx === arr.findIndex(q =>
                                                                q.tonalidad?.trim().toLowerCase() === p.tonalidad?.trim().toLowerCase()
                                                            )
                                                        )
                                                        .map((colorProduct, i) => (
                                                            <button
                                                                type="button"
                                                                key={i}
                                                                className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                                                onClick={() => handleColorClick(colorProduct)}
                                                                title={colorProduct.tonalidad}
                                                            >
                                                                <img src={colorProduct.imageBaja} alt={colorProduct.tonalidad} className="h-full w-full object-cover" />
                                                                <span className="absolute inset-x-1 bottom-1 rounded-full bg-black/60 px-1 py-0.5 text-[10px] font-medium text-white leading-tight break-words whitespace-normal">
                                                                    {colorProduct.tonalidad}
                                                                </span>
                                                            </button>
                                                        ))}
                                                </div>

                                                <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
                                                    <span className="text-lg font-semibold">{productsForCarousel.length}</span>
                                                    <span className="text-sm">
                                                        {productsForCarousel.length === 1
                                                            ? t('carousel.oneColor')
                                                            : t('carousel.manyColors', { count: productsForCarousel.length })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* FICHA TÉCNICA (UI) — sin normativa/especificaciones */}
                                <div className="space-y-6 sm:space-y-8 rounded-3xl border border-white/60 bg-white/70 p-4 sm:p-6 shadow-inner">
                                    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{t('techSheet')}</h2>
                                        <button
                                            onClick={handleGeneratePDF}
                                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:shadow-md hover:scale-[1.02] hover:ring-2 hover:ring-gray-200 active:scale-100"
                                            title={t('downloadPdf')}
                                            type="button"
                                        >
                                            <img
                                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/archivo.png"
                                                alt={t('downloadPdfAlt')}
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                            />
                                            <span>{t('downloadPdf')}</span>
                                        </button>
                                    </div>

                                    {/* Detalles */}
                                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {detailItems.map((item) => (
                                            <div
                                                key={item.key}
                                                className="rounded-2xl border border-white/60 bg-white/80 p-5 sm:p-6 shadow-sm min-w-0 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <p
                                                    title={item.label}
                                                    className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500 cursor-help"
                                                >
                                                    {item.label}
                                                </p>
                                                <div className="mt-2 min-w-0 break-words whitespace-normal leading-snug text-gray-900 pb-1">
                                                    {item.value || t('notAvailable')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Usos / Cuidado */}
                                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                                            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">{t('usages')}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                                {getUsoImages(selectedProduct?.uso).length > 0 ? getUsoImages(selectedProduct?.uso) : (
                                                    <span className="text-sm text-gray-400">{t('notAvailable')}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                                            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">{t('cares')}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                                {getMantenimientoImages(selectedProduct?.mantenimiento).length > 0 ? getMantenimientoImages(selectedProduct?.mantenimiento) : (
                                                    <span className="text-sm text-gray-400">{t('notAvailable')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    {getDireccionImage(selectedProduct?.direcciontela) && (
                                        <div className="pt-2">{getDireccionImage(selectedProduct?.direcciontela)}</div>
                                    )}
                                </div>

                                {/* Carruseles */}
                                {recommendedProducts.filter((item) => item.nombre !== selectedProduct?.nombre).length > 0 && (
                                    <CarruselColeccion
                                        productos={recommendedProducts.filter((item) => item.nombre !== selectedProduct?.nombre)}
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
                                    src="https://bassari.eu/ImagenesTelasCjmw/Iconos/POP%20UP/Check.svg"
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
                                <button className="mt-3 text-sm font-semibold text-gray-700 underline" onClick={() => setShowIconMeaning('')}>
                                    {t('closeBtn')}
                                </button>
                            </div>
                        )}

                        {modalMapaOpen && <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />}
                    </div>

                    {/* Footer de la modal pegado abajo */}
                    <footer className="mt-auto">
                        <Footer />
                    </footer>
                </div>
            </div>

            {/* ===== Contenido PDF OFFSCREEN (A4), SOLO PARA EXPORT (SIN FOOTER y SIN QR) ===== */}
            <div
                style={{
                    position: 'fixed',
                    left: '-10000px',
                    top: 0,
                    width: `${PAGE_W_CM}cm`,
                    height: `${PAGE_H_CM}cm`,
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            >
                <div
                    ref={etiquetaRef}
                    style={{
                        width: `${PAGE_W_CM}cm`,
                        height: `${PAGE_H_CM}cm`,
                        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #e0f2fe 100%)',
                        color: '#0f172a',
                        fontFamily: '"Inter", Arial, sans-serif',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            minHeight: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.2cm',
                            gap: '0.6cm'
                        }}
                    >
                        {/* HEADER */}
                        <div
                            className="avoid-break"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.55cm 1cm',
                                background: 'rgba(255,255,255,0.9)',
                                borderRadius: '20px',
                                border: '1px solid rgba(148,163,184,0.25)',
                                gap: '0.8cm'
                            }}
                        >
                            <div
                                style={{
                                    flex: '1 1 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    gap: '0.18cm'
                                }}
                            >
                                <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                                    {selectedProduct?.nombre}
                                </div>
                                {selectedProduct?.tonalidad && (
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            letterSpacing: '0.28em',
                                            textTransform: 'uppercase',
                                            color: '#64748b'
                                        }}
                                    >
                                        {selectedProduct.tonalidad}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontSize: '13px',
                                        color: '#475569',
                                        display: 'flex',
                                        gap: '0.55cm',
                                        flexWrap: 'wrap',
                                        alignItems: 'center'
                                    }}
                                >
                                    {selectedProduct?.coleccion && (
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'baseline',
                                                gap: '0.08cm',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <span>{`${t('collection')}:`}</span>
                                            <span>{selectedProduct.coleccion}</span>
                                        </span>
                                    )}
                                    {selectedProduct?.codmarca && (
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'baseline',
                                                gap: '0.08cm',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <span>{`${t('brand')}:`}</span>
                                            <span>{getNombreMarca(selectedProduct.codmarca)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    gap: '0.12cm',
                                    minWidth: '3cm'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '11px',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: '#94a3b8'
                                    }}
                                >
                                    {t('techSheet')}
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>
                                    {selectedProduct?.codprodu}
                                </div>
                            </div>

                            {pdfLogo && (
                                <img
                                    src={pdfLogo}
                                    alt="brand"
                                    style={{ width: '4.2cm', height: 'auto', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                        <style>
                            {`
                @media (max-width: 640px) {
                  .pdf-img { max-width: 90%; }
                }
              `}
                        </style>
                        {/* BODY */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.6cm',
                                alignItems: 'start',
                            }}
                        >
                            {/* IMAGEN */}
                            <div
                                className="avoid-break"
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    border: '1px solid rgba(148,163,184,0.22)',
                                    borderRadius: '18px',
                                    padding: '0.45cm',
                                    width: '90%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {pdfProductImage && (
                                    <img
                                        src={pdfProductImage}
                                        alt="Producto"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            borderRadius: '14px',
                                            display: 'block'
                                        }}
                                    />
                                )}
                            </div>

                            {/* TARJETAS DE DETALLE */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                                    gap: '0.5cm'
                                }}
                            >
                                {[
                                    selectedProduct?.tipo && { k: 'type', lab: t('type'), val: selectedProduct.tipo },
                                    selectedProduct?.estilo && { k: 'style', lab: t('style'), val: selectedProduct.estilo },
                                    selectedProduct?.martindale && { k: 'mart', lab: t('martindale'), val: selectedProduct.martindale },
                                    selectedProduct?.repminhor && { k: 'rh', lab: t('rapportH'), val: `${parseFloat(selectedProduct.repminhor).toFixed(2)} cm` },
                                    selectedProduct?.repminver && { k: 'rv', lab: t('rapportV'), val: `${parseFloat(selectedProduct.repminver).toFixed(2)} cm` },
                                    selectedProduct?.composicion && { k: 'comp', lab: t('composition'), val: selectedProduct.composicion },
                                    selectedProduct?.gramaje && { k: 'w', lab: t('weight'), val: `${selectedProduct.gramaje} g/m²` },
                                    selectedProduct?.ancho && { k: 'wd', lab: t('width'), val: `${selectedProduct.ancho}` }
                                ]
                                    .filter(Boolean)
                                    .map(card => (
                                        <div
                                            key={card.k}
                                            className="avoid-break"
                                            style={{
                                                background: 'rgba(255,255,255,0.95)',
                                                border: '1px solid rgba(148,163,184,0.22)',
                                                borderRadius: '16px',
                                                padding: '0.55cm',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '11px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.18em',
                                                    color: '#64748b',
                                                    marginBottom: '0.18cm'
                                                }}
                                            >
                                                {card.lab}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: 600,
                                                    wordBreak: 'break-word',
                                                    lineHeight: 1.25
                                                }}
                                            >
                                                {card.val}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* USOS / CUIDADOS / DIRECCIÓN */}
                            <div
                                className="avoid-break"
                                style={{
                                    gridColumn: '1 / -1',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: '0.6cm'
                                }}
                            >
                                {/* Usos */}
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        border: '1px solid rgba(148,163,184,0.22)',
                                        borderRadius: '16px',
                                        padding: '0.5cm'
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.18em',
                                            color: '#64748b',
                                            marginBottom: '0.32cm',

                                        }}
                                    >
                                        {t('sheet.usages')}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25cm' }}>
                                        {(selectedProduct?.uso || '')
                                            .split(';')
                                            .map(u => u.trim())
                                            .filter(code => usoBase64[code])
                                            .map(code => (
                                                <img key={code} src={usoBase64[code]} alt={code} style={{ width: '22px', height: '22px' }} />
                                            ))}
                                    </div>
                                </div>

                                {/* Cuidados */}
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        border: '1px solid rgba(148,163,184,0.22)',
                                        borderRadius: '16px',
                                        padding: '0.5cm'
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.18em',
                                            color: '#64748b',
                                            marginBottom: '0.18cm'
                                        }}
                                    >
                                        {t('sheet.cares')}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25cm' }}>
                                        {(() => {
                                            try {
                                                return Array.from(
                                                    new DOMParser()
                                                        .parseFromString(selectedProduct?.mantenimiento || '<root/>', 'text/xml')
                                                        .getElementsByTagName('Valor')
                                                )
                                                    .map(n => n.textContent.trim())
                                                    .filter(code => mantBase64[code])
                                                    .map(code => (
                                                        <img key={code} src={mantBase64[code]} alt={code} style={{ width: '22px', height: '22px' }} />
                                                    ));
                                            } catch {
                                                return null;
                                            }
                                        })()}
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        border: '1px solid rgba(148,163,184,0.22)',
                                        borderRadius: '16px',
                                        padding: '0.5cm',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {selectedProduct?.direcciontela && direccionBase64[selectedProduct.direcciontela] ? (
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35cm',
                                                borderRadius: '9999px',
                                                padding: '0.25cm 0.55cm'
                                            }}
                                        >
                                            <img
                                                src={direccionBase64[selectedProduct.direcciontela]}
                                                alt={selectedProduct.direcciontela}
                                                style={{ width: '28px', height: '28px', objectFit: 'contain', position: 'relative', top: '6px' }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    color: '#0f172a'
                                                }}
                                            >
                                                {selectedProduct.direcciontela}
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t('notAvailable')}</span>
                                    )}
                                </div>
                            </div>

                            {/* Normas / Especificaciones (solo en PDF) */}
                            {(((selectedProduct?.normativa || '').trim().length > 0) ||
                                ((selectedProduct?.especificaciones || '').trim().length > 0)) && (
                                    <div
                                        className="avoid-break"
                                        style={{
                                            gridColumn: '1 / -1',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.6cm'
                                        }}
                                    >
                                        {/* NORMATIVA */}
                                        {(selectedProduct?.normativa || '').trim().length > 0 && (
                                            <div
                                                style={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: '1px solid rgba(148,163,184,0.22)',
                                                    borderRadius: '16px',
                                                    padding: '0.55cm'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        color: '#64748b',
                                                        marginBottom: '0.18cm'
                                                    }}
                                                >
                                                    {t('sheet.standards')}
                                                </div>

                                                {/* Bullets personalizados centrados */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18cm' }}>
                                                    {(selectedProduct?.normativa || '')
                                                        .split(';')
                                                        .map(s => s.trim())
                                                        .filter(Boolean)
                                                        .map((item, idx) => (
                                                            <div
                                                                key={`norm-${idx}`}
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: '0.22cm 1fr',
                                                                    columnGap: '0.3cm',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        width: '0.18cm',
                                                                        height: '0.18cm',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#0f172a',
                                                                        flexShrink: 0,
                                                                        position: 'relative',
                                                                        top: '0.50em',
                                                                    }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        fontSize: '13px',
                                                                        lineHeight: 1.45,
                                                                        wordBreak: 'break-word'
                                                                    }}
                                                                >
                                                                    {item}
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ESPECIFICACIONES */}
                                        {(selectedProduct?.especificaciones || '').trim().length > 0 && (
                                            <div
                                                style={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: '1px solid rgba(148,163,184,0.22)',
                                                    borderRadius: '16px',
                                                    padding: '0.55cm'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        color: '#64748b',
                                                        marginBottom: '0.18cm'
                                                    }}
                                                >
                                                    {t('sheet.specifications')}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18cm' }}>
                                                    {(selectedProduct?.especificaciones || '')
                                                        .split(';')
                                                        .map(s => s.trim())
                                                        .filter(Boolean)
                                                        .map((item, idx) => (
                                                            <div
                                                                key={`spec-${idx}`}
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: '0.22cm 1fr',
                                                                    columnGap: '0.3cm',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        width: '0.18cm',
                                                                        height: '0.18cm',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#0f172a',
                                                                        flexShrink: 0,
                                                                        position: 'relative',
                                                                        top: '0.40em',
                                                                    }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        fontSize: '13px',
                                                                        lineHeight: 1.45,
                                                                        wordBreak: 'break-word'
                                                                    }}
                                                                >
                                                                    {item}
                                                                </span>
                                                            </div>
                                                        ))}

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </CartProvider>
    );
};

export default Modal;
