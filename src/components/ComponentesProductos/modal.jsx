import { useState, useEffect, useRef } from 'react';
import ModalMapa from "./modalMapa";
import { useCart } from '../CartContext';
import QRCode from 'react-qr-code';
import { CartProvider } from "../CartContext";
import ShareButton from './ShareButton';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import CarruselMismoEstilo from "./CarruselEstiloProducto"
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { FaSearchPlus } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import Footer from "../../components/footer";
import CarruselColeccion from "./CarruselProductosColeccion"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from "react-router-dom";
import {
    defaultImageUrlModalProductos,
    mantenimientoImages,
    usoImages,
    marcasMap,
    direccionLogos
} from '../../Constants/constants';
import html2pdf from 'html2pdf.js';

// ====================================================
// Función para convertir una imagen (por URL) a Base64
// ====================================================
const toBase64 = async (url) => {
    const cleanUrl = decodeURIComponent(url); // Descodifica primero por si ya viene con %20
    const proxyUrl = `${import.meta.env.VITE_API_BASE_URL}/api/proxy?url=${encodeURIComponent(cleanUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('');
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const encryptProductId = (productId) => {
    const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
    const encrypted = CryptoJS.AES.encrypt(productId, secretKey).toString();
    const someSecureToken = uuidv4();
    return `https://www.cjmw.eu/#/products?pid=${encodeURIComponent(encrypted)}&sid=${someSecureToken}`;
};

// ====================================================
// Diccionario de logos para PDF
// Cada clave corresponde al valor (en mayúsculas) devuelto por codmarca
// ====================================================
const brandLogosPDF = {
    "HAR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png",
    "CJM": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png",
    "FLA": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png",
    "ARE": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png",
    "BAS": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png"
};

// ====================================================
// Función para obtener el logo en Base64 según el código de marca
// ====================================================
const getLogoBase64 = async codmarca => {
    const key = codmarca.toUpperCase();
    const url = brandLogosPDF[key];
    return url ? await toBase64(url) : '';
};

const Modal = ({ isOpen, close, product, alt }) => {
    // Función para obtener el nombre de la marca a partir del codmarca (lógica antigua)
    const getNombreMarca = (codmarca) => {
        return marcasMap[codmarca] || "Marca Desconocida";
    };

    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const modalRef = useRef(null);
    const [direccionBase64, setDireccionBase64] = useState({});
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);
    // Estados principales
    const [selectedProduct, setSelectedProduct] = useState(product);
    const [modalMapaOpen, setModalMapaOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(selectedProduct.ancho);
    const [quantity, setQuantity] = useState(1);
    // Productos relacionados y recomendados
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productsForCarousel, setProductsForCarousel] = useState([]);
    const [anchoOptions, setAnchoOptions] = useState([]);
    const [selectedAncho, setSelectedAncho] = useState('');
    const IconoDestacables = ["FR", "OUTDOOR", "EASYCLEAN", "IMO"];
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [currentRecIndex, setCurrentRecIndex] = useState(0);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    // Mapas de iconos en Base64 para usos, mantenimiento y marcas
    const [usoBase64, setUsoBase64] = useState({});
    const [mantBase64, setMantBase64] = useState({});
    const [brandBase64, setBrandBase64] = useState({});

    // Estado para notificar "Agregado al Carro"
    const [addedToCart, setAddedToCart] = useState(false);
    // Estado para mostrar el significado de iconos
    const [showIconMeaning, setShowIconMeaning] = useState('');

    // Estados para imágenes en Base64 para el PDF
    const [pdfLogo, setPdfLogo] = useState('');
    const [pdfProductImage, setPdfProductImage] = useState('');

    // Ref al contenedor de la etiqueta
    const etiquetaRef = useRef();

    //Esto hace que si la ruta cambia la modal se cierre
    useEffect(() => {
        if (!isOpen) return;

        const isSearchRoute = location.pathname.includes('products') && location.search.includes('search');

        if (isSearchRoute) {
            close();
        }
    }, [location.key]);

    useEffect(() => {
        window.closeModalGlobal = close; // close es tu función que cierra la modal
        return () => {
            delete window.closeModalGlobal; // limpiar al desmontar
        };
    }, []);



    // Sincronizar selectedProduct cuando se abre la modal
    useEffect(() => {
        if (isOpen) {
            setSelectedProduct(product);
        }
    }, [product, isOpen]);

    // Cada vez que cambia selectedProduct, convertir el logo (usando codmarca) y la imagen principal a Base64 para el PDF
    useEffect(() => {
        if (selectedProduct) {
            if (selectedProduct.codmarca) {
                // Se utiliza selectedProduct.codmarca y se convierte a mayúsculas
                getLogoBase64(selectedProduct.codmarca)
                    .then(base64 => setPdfLogo(base64))
                    .catch(err => console.error("Error al convertir el logo para PDF:", err));
            }
            if (selectedProduct.imageBuena || selectedProduct.imageBaja) {
                const url = selectedProduct.imageBuena || selectedProduct.imageBaja;
                toBase64(url)
                    .then(base64 => setPdfProductImage(base64))
                    .catch(err => console.error("Error al convertir la imagen del producto para PDF:", err));
            }
        }
    }, [selectedProduct]);



    useEffect(() => {
        // Marcas
        Object.entries(brandLogosPDF).forEach(([code, url]) => {
            toBase64(url)
                .then(b64 => setBrandBase64(prev => ({ ...prev, [code]: b64 })))
                .catch(console.error);
        });
        // Usos
        Object.entries(usoImages).forEach(([code, url]) => {
            toBase64(url)
                .then(b64 => setUsoBase64(prev => ({ ...prev, [code]: b64 })))
                .catch(console.error);
        });
        // Mantenimiento
        Object.entries(mantenimientoImages).forEach(([code, url]) => {
            toBase64(url)
                .then(b64 => setMantBase64(prev => ({ ...prev, [code]: b64 })))
                .catch(console.error);
        });
        //Dirección Tela
        Object.entries(direccionLogos).forEach(([key, url]) => {
            toBase64(url)
                .then(b64 => setDireccionBase64(prev => ({ ...prev, [key]: b64 })))
                .catch(console.error);
        });
    }, []);

    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.codmarca) {
            getLogoBase64(selectedProduct.codmarca)
                .then(setPdfLogo)
                .catch(console.error);
        }
        const url = selectedProduct.imageBuena || selectedProduct.imageBaja;
        if (url) toBase64(url).then(setPdfProductImage).catch(console.error);
    }, [selectedProduct]);


    // Cargar imagen principal en la modal
    useEffect(() => {
        if (!selectedProduct) return;
        if (selectedProduct.imageBuena || selectedProduct.imageBaja) {
            setSelectedImage(selectedProduct.imageBuena || selectedProduct.imageBaja);
            return;
        }
        setImageLoaded(false);
        const fetchImages = async () => {
            try {
                const [buenaResponse, bajaResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/Buena`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${selectedProduct.codprodu}/Baja`)
                ]);
                const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
                const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;
                const mainImage = buenaImage
                    ? `https://${buenaImage.ficadjunto}`
                    : bajaImage
                        ? `https://${bajaImage.ficadjunto}`
                        : defaultImageUrlModalProductos;
                setSelectedProduct(prev => ({
                    ...prev,
                    imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : '',
                    imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : ''
                }));
                setSelectedImage(mainImage);
            } catch (error) {
                console.error('Error fetching images:', error);
                setSelectedImage(defaultImageUrlModalProductos);
            }
        };
        fetchImages();
    }, [selectedProduct]);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            if (!selectedProduct?.nombre || !selectedProduct?.codfamil) return;

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`
                );
                const data = await res.json();
                const productosMismoNombre = data.filter(p => p.nombre === selectedProduct.nombre);

                const images = await Promise.all(
                    productosMismoNombre.map(async (prod) => {
                        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`);
                        const imageData = response.ok ? await response.json() : null;
                        return imageData ? `https://${imageData.ficadjunto}` : null;
                    })
                );

                const filtered = images.filter(Boolean);
                setGalleryImages(filtered);

                const current = selectedProduct.imageBuena || selectedImage;
                const initialIndex = filtered.findIndex(img => img === current);
                setPhotoIndex(initialIndex >= 0 ? initialIndex : 0);

            } catch (err) {
                console.error("Error cargando imágenes para galería:", err);
                setGalleryImages([]);
            }
        };

        fetchGalleryImages();
    }, [selectedProduct, selectedImage]);

    // Cargar productos relacionados (mismo nombre y familia)
    useEffect(() => {
        if (!selectedProduct) return;
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`
                );
                const data = await response.json();
                const allProducts = data.filter((p) => p.nombre === selectedProduct.nombre);
                const uniqueProductsForCarousel = allProducts.reduce((unique, item) => {
                    if (!unique.some(p => p.tonalidad === item.tonalidad)) {
                        unique.push(item);
                    }
                    return unique;
                }, []);
                setProductsForCarousel(uniqueProductsForCarousel);
                const productsWithImages = await Promise.all(
                    allProducts.map(async (prod) => {
                        const [imageBuena, imageBaja] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`)
                                .then(res => (res.ok ? res.json() : null)),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Baja`)
                                .then(res => (res.ok ? res.json() : null))
                        ]);
                        return {
                            ...prod,
                            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : defaultImageUrlModalProductos,
                            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : defaultImageUrlModalProductos
                        };
                    })
                );
                setRelatedProducts(productsWithImages);
                const uniqueAnchos = [...new Set(allProducts.map(p => p.ancho))];
                if (uniqueAnchos.length > 0) {
                    setAnchoOptions(uniqueAnchos);
                    setSelectedAncho(Math.min(...uniqueAnchos));
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };
        fetchRelatedProducts();
    }, [selectedProduct]);

    // Cargar productos de la misma colección (excluyendo el producto actual)
    useEffect(() => {
        if (!selectedProduct?.coleccion) return;

        const fetchCollectionProducts = async () => {
            try {


                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`
                );
                const data = await response.json();


                const filtered = data.filter(
                    (p) =>
                        p.nombre &&
                        p.nombre.trim() !== "" &&
                        p.coleccion === selectedProduct.coleccion &&
                        p.nombre !== selectedProduct.nombre
                );


                const uniqueByName = filtered.filter(
                    (p, index, self) => index === self.findIndex(q => q.nombre === p.nombre)
                );


                if (uniqueByName.length > 0) {
                    const productsWithImages = await Promise.all(
                        uniqueByName.map(async (prod) => {
                            const [imageBuena, imageBaja] = await Promise.all([
                                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`)
                                    .then(res => (res.ok ? res.json() : null)),
                                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Baja`)
                                    .then(res => (res.ok ? res.json() : null))
                            ]);
                            return {
                                ...prod,
                                imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : defaultImageUrlModalProductos,
                                imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : defaultImageUrlModalProductos
                            };
                        })
                    );
                    setCollectionProducts(productsWithImages);
                    setCurrentRecIndex(0);
                } else {
                    setCollectionProducts([]);
                    setCurrentRecIndex(0);
                }
            } catch (error) {
                console.error('Error fetching collection products:', error);
            }
        };

        fetchCollectionProducts();
    }, [selectedProduct]);


    // Sincronizar recommendedProducts con collectionProducts
    useEffect(() => {
        setRecommendedProducts(collectionProducts);
    }, [collectionProducts]);

    const handleAnchoChange = (e) => {
        const newAncho = e.target.value;
        setSelectedAncho(newAncho);
        const newSelectedProduct = relatedProducts.find(
            p =>
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
            setImageLoaded(false);
            if (modalRef.current) {
                modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error fetching images for color product:', error);
        }
    };

    const handleClose = () => {
        close();

        const hash = window.location.hash;
        const hasHashParams = hash.startsWith("#/products") && (hash.includes("pid=") || hash.includes("productId="));
        const searchParams = new URLSearchParams(location.search);
        const hasQueryParams = searchParams.has("pid") || searchParams.has("productId");


        if (hasHashParams || hasQueryParams) {
            navigate("/products", { replace: true });
        }
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

    const handleDetailClick = (productItem) => {
        setSelectedProduct(productItem);
        if (modalRef.current) {
            modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (isOpen) setSelectedProduct(product);
    }, [isOpen, product]);

    useEffect(() => {
        if (!selectedProduct) return;
        getLogoBase64(selectedProduct.codmarca).then(setPdfLogo);
        const url = selectedProduct.imageBuena || selectedProduct.imageBaja;
        if (url) toBase64(url).then(setPdfProductImage);
    }, [selectedProduct]);

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
                const img = buena ? `https://${buena.ficadjunto}` : baja ? `https://${baja.ficadjunto}` : defaultImageUrlModalProductos;
                setSelectedProduct(p => ({ ...p, imageBuena: img, imageBaja: img }));
                setSelectedImage(img);
            } catch {
                setSelectedImage(defaultImageUrlModalProductos);
            }
        })();
    }, [selectedProduct]);

    const getMantenimientoImages = (m) => {
        if (!m) return null;
        const vals = Array.from(new DOMParser().parseFromString(m, 'text/xml').getElementsByTagName('Valor')).map(n => n.textContent.trim());
        return (
            <div className="flex items-center space-x-2">
                {vals.filter(v => mantenimientoImages[v]).map(v => (
                    <img key={v} src={mantenimientoImages[v]} alt={v} className="w-6 h-6 cursor-pointer" onClick={() => navigate('/usages')} />
                ))}
            </div>
        );
    };

    const getUsoImages = (u) => {
        if (!u) return null;
        return (
            <div className="flex items-center space-x-2">
                {u.split(';').map(x => x.trim()).filter(x => usoImages[x]).map(x => (
                    <img key={x} src={usoImages[x]} alt={x} className="w-6 h-6 cursor-pointer" onClick={() => navigate('/usages')} />
                ))}
            </div>
        );
    };

    const getDireccionImage = (direccion) => {
        if (!direccion || !direccionLogos[direccion]) return null;
        return (
            <div className='flex mt-2'>
                <img
                    src={direccionLogos[direccion]}
                    alt={direccion}
                    className={direccion === "RAILROADED" ? "w-8 h-6" : "w-6 h-7"}
                    onClick={() => navigate('/usages')}
                />
                <span className='ml-2'>{direccion}</span>
            </div>
        );
    };

    const getMantenimientoDestacados = (mantenimiento) => {
        if (!mantenimiento) return null;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(mantenimiento, "text/xml");
        const valores = xmlDoc.getElementsByTagName("Valor");
        const mantenimientoList = Array.from(valores)
            .map(node => node.textContent.trim())
            .filter(m => IconoDestacables.includes(m) && mantenimientoImages[m]);
        return mantenimientoList.map((m, index) => (
            <div key={index} className="flex items-center mr-4 mb-2">
                <img
                    src={mantenimientoImages[m]}
                    alt={m}
                    className="w-6 h-6 mr-2"
                    onClick={() => setShowIconMeaning(m)}
                />
                <span>{m}</span>
            </div>
        ));
    };

    const getUsoDestacados = (usos) => {
        if (!usos) return null;
        const usoList = usos.split(';')
            .map((u) => u.trim())
            .filter((u) => IconoDestacables.includes(u) && usoImages[u]);
        return usoList.map((uso, index) => (
            <div key={index} className="flex items-center mr-4 mb-2">
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
        ...(selectedProduct?.uso ? getUsoDestacados(selectedProduct.uso) : []),
        ...(selectedProduct?.mantenimiento ? getMantenimientoDestacados(selectedProduct.mantenimiento) : []),
    ];

    const renderEtiqueta = () => (
        <div
            ref={etiquetaRef}
            style={{
                width: '21cm',
                height: '29.4cm',
                padding: '1cm',
                background: '#fff',
                boxSizing: 'border-box',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            {/* Logo */}
            <div>
                {pdfLogo && (
                    <img
                        src={pdfLogo}
                        alt="Marca"
                        style={{ width: '200px', margin: '0 auto', display: 'block' }}
                    />
                )}
                <div style={{ fontSize: '24px' }}>{selectedProduct.nombre}</div>
            </div>

            {/* Imagen */}
            <div className='mx-auto mt-6 justify-center flex'>
                {pdfProductImage && (
                    <img
                        src={pdfProductImage}
                        alt="Producto"
                        style={{
                            width: '10cm',
                            height: '10cm',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                )}
            </div>

            {/* Ficha técnica extendida */}
            <div className='grid grid-cols-2 mx-auto text-[9px] mt-2'>
                <div className='text-end pr-2'>
                    {selectedProduct.tonalidad && <p>Pattern:</p>}
                    {selectedProduct.gramaje && <p>Weight:</p>}
                    {selectedProduct.ancho && <p>Width:</p>}
                    {selectedProduct.martindale && <p>Martindale:</p>}
                    {selectedProduct.composicion && <p>Composition:</p>}
                    {selectedProduct.repminhor && <p>Rapport Hor:</p>}
                    {selectedProduct.repminver && <p>Rapport Vert:</p>}
                    {selectedProduct.normativa && <p>Normativa:</p>}
                    {selectedProduct.especificaciones && <p>Especificaciones:</p>}
                </div>

                <div className='text-start'>
                    {selectedProduct.tonalidad && <p>{selectedProduct.tonalidad}</p>}
                    {selectedProduct.gramaje && <p>{selectedProduct.gramaje} g/m²</p>}
                    {selectedProduct.ancho && <p>{selectedProduct.ancho}</p>}
                    {selectedProduct.martindale && <p>{selectedProduct.martindale} cycles</p>}
                    {selectedProduct.composicion && <p>{selectedProduct.composicion}</p>}
                    {selectedProduct.repminhor && <p>{parseFloat(selectedProduct.repminhor).toFixed(2)} cm</p>}
                    {selectedProduct.repminver && <p>{parseFloat(selectedProduct.repminver).toFixed(2)} cm</p>}

                    {selectedProduct.normativa && (
                        <div>
                            {selectedProduct.normativa
                                .split(';')
                                .filter(item => item.trim() !== '')
                                .map((item, index) => (
                                    <p key={`normativa-${index}`}>{item.trim()}</p>
                                ))}
                        </div>
                    )}

                    {selectedProduct.especificaciones && (
                        <div>
                            {selectedProduct.especificaciones
                                .split(';')
                                .filter(item => item.trim() !== '')
                                .map((item, index) => (
                                    <p key={`especificacion-${index}`}>{item.trim()}</p>
                                ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Usos y cuidados */}
            <div className="grid grid-cols-2 mx-auto text-[12px] mt-6">
                <div className="text-end pr-2">
                    <p>Usages:</p>
                </div>
                <div className="text-start flex flex-wrap gap-[4px] mt-[4px] ml-35px]">
                    {selectedProduct.uso?.split(';')
                        .map(u => u.trim())
                        .filter(code => usoBase64[code])
                        .map(code => (
                            <img
                                key={code}
                                src={usoBase64[code]}
                                alt={code}
                                style={{ width: '18px', height: '18px' }}
                            />
                        ))}
                </div>

                <div className="text-end pr-2">
                    <p>Cares:</p>
                </div>
                <div className="text-start flex flex-wrap gap-[4px] mt-[4px] ml-[2px]">
                    {Array.from(
                        new DOMParser().parseFromString(
                            selectedProduct.mantenimiento || '<root/>',
                            'text/xml'
                        ).getElementsByTagName('Valor')
                    )
                        .map(n => n.textContent.trim())
                        .filter(code => mantBase64[code])
                        .map(code => (
                            <img
                                key={code}
                                src={mantBase64[code]}
                                alt={code}
                                style={{ width: '18px', height: '18px' }}
                            />
                        ))}
                </div>
            </div>

            {/* Dirección tela */}
            {selectedProduct.direcciontela && direccionBase64[selectedProduct.direcciontela] && (
                <div className="mt-6 text-[10px] justify-center absolute left-10 bottom-5 items-center gap-2">
                    <img
                        src={direccionBase64[selectedProduct.direcciontela]}
                        alt={selectedProduct.direcciontela}
                        style={{
                            width: selectedProduct.direcciontela === 'RAILROADED' ? '50px' : '40px',
                            height: selectedProduct.direcciontela === 'RAILROADED' ? '38px' : '50px'
                        }}
                    />
                    <span>{selectedProduct.direcciontela}</span>
                </div>
            )}

            {/* Pie de página y QR */}
            <div className='absolute bottom-5 right-10 grid grid-cols-2 gap-4 items-center'>
                <div className='text-[8px] text-end mr-2'>
                    <p>CJM WORLDWIDE S.L</p>
                    <p>B14570873</p>
                    <p>AVDA. DE EUROPA 19</p>
                    <p>14550 MONTILLA (SPAIN)</p>
                    <p>+34 957 656 475</p>
                    <p>www.cjmw.eu</p>
                </div>
                <div>
                    <QRCode value={encryptProductId(selectedProduct.codprodu)} size={90} />
                </div>
            </div>
        </div>
    );

    // Función para generar el PDF usando jsPDF con el formato solicitado.
    // Se utiliza el logo correspondiente según el campo codmarca del producto.
    const handleGeneratePDF = () => {
        if (!etiquetaRef.current) return;
        const opts = {
            margin: 0,
            filename: `${selectedProduct.nombre.replace(/[^a-z0-9]/gi, '_')}.pdf`,
            html2canvas: { scale: 4, useCORS: true },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opts).from(etiquetaRef.current).save();
    };



    if (!isOpen) return null;

    return (
        <CartProvider>
            <div
                ref={modalRef}
                className="fixed inset-0 z-30 bg-white overflow-y-auto 4xl:pt-[3%] 3xl:pt-[4%] xl:pt-[6%] lg:pt-[12%] md:pt-[10%]  sm:pt-[15%] pt-[24%]"
            >
                <div
                    className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-[-15px] right-4 md:right-4 md:top-4 text-black font-bold text-xl hover:opacity-70"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/POP%20UP/undo_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="" className=' w-8' />
                    </button>

                    {/* Encabezado: Imagen Izq + Info Der */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="relative md:w-1/2">
                            {/* Botón de lupa arriba a la derecha */}
                            <button
                                onClick={() => setIsViewerOpen(true)}
                                className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 rounded-full p-2 hover:scale-110 transition"
                                title="Ver imagen ampliada"
                            >
                                <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/ICONO%20AMPLIAR.png" alt="ampliar" className="w-5 h-5" />
                            </button>

                            <Zoom>
                                <InnerImageZoom
                                    src={selectedImage}
                                    zoomSrc={selectedImage}
                                    alt={alt}
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </Zoom>

                            {isViewerOpen && (
                                <Lightbox
                                    open={isViewerOpen}
                                    close={() => setIsViewerOpen(false)}
                                    slides={galleryImages.map(src => ({ src }))}
                                    index={photoIndex}
                                    on={{ view: ({ index }) => setPhotoIndex(index) }}
                                />
                            )}

                        </div>
                        <div className="md:w-1/2 flex flex-col justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold mb-1">
                                    {selectedProduct?.nombre || 'Nombre del producto'}
                                </h1>
                                {selectedProduct?.tonalidad && (
                                    <p className=" text-sm mb-2 font-semibold">{selectedProduct.tonalidad}</p>
                                )}
                                <p className="text-gray-600 text-sm mb-2">
                                    Colección: {selectedProduct?.coleccion} &nbsp;|&nbsp;
                                    Marca: {getNombreMarca(selectedProduct?.codmarca)}
                                </p>

                                {/* Contenedor principal */}
                                <div className="flex flex-col space-y-3 my-4 w-full max-w-sm">
                                    <ShareButton selectedProduct={selectedProduct} />
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                                            Elige la cantidad
                                        </label>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-1">Muestra pequeña</span>
                                        </div>
                                    </div>
                                    <div className="flex border-gray-300 rounded items-center space-x-3">
                                        <select
                                            id="quantity"
                                            className="border rounded px-2 py-1 w-[40%]"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                        <p className="text-gray-800 font-bold text-lg">3€</p>
                                    </div>
                                    <div className='flex'>
                                        <button
                                            onClick={handleAddToCart}
                                            className="relative group w-20 h-20 bg-white overflow-hidden hover:bg-black transition-colors rounded-sm duration-300"
                                            title="Pedir muestra"
                                        >
                                            <img
                                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/QUALITY/fabric.png"
                                                alt="Muestra"
                                                className="mx-auto object-contain w-[80%] h-[80%] group-hover:opacity-0 transition-opacity duration-300"
                                            />
                                            <span className="absolute inset-0 flex items-center text-xs justify-center text-white rounded-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                AÑADIR AL CARRO
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {relatedProducts?.length > 1 && (
                                <div className="">
                                    <div className="flex flex-wrap gap-2">
                                        {relatedProducts
                                            .filter((p, index, self) =>
                                                p.tonalidad &&
                                                index === self.findIndex(
                                                    (q) =>
                                                        q.tonalidad?.trim().toLowerCase() ===
                                                        p.tonalidad?.trim().toLowerCase()
                                                )
                                            )
                                            .map((colorProduct, index) => (
                                                <div
                                                    key={index}
                                                    className="relative w-16 h-16 cursor-pointer"
                                                    onClick={() => handleColorClick(colorProduct)}
                                                >
                                                    <img
                                                        src={colorProduct.imageBaja}
                                                        alt={colorProduct.nombre}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                        <p className="text-white text-xs text-center px-1">
                                                            {colorProduct.tonalidad}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="flex items-center justify-start mb-2 mt-4 h-[3rem]">
                                        <div className="flex bg-black text-white border-2 border-black font-semibold items-center py-[2px] px-2 rounded-md transition duration-200 mx-1 h-full">
                                            <div className="flex items-center justify-center text-white font-semibold rounded-full w-9 h-9">
                                                {productsForCarousel.length}
                                            </div>
                                            <p className="flex ml-2 text-md">
                                                {productsForCarousel.length === 1 ? "Color disponible" : "Colores disponibles"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Separador */}
                    <hr className="my-8" />

                    {/* FICHA TÉCNICA */}
                    <div className=' flex'>
                        <h2 className="text-xl font-semibold mb-4">FICHA TÉCNICA</h2>
                        {/* Botón para generar el PDF */}
                        <button onClick={handleGeneratePDF} className=" pb-2 pl-2">
                            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/archivo.png" alt="" className='h-9 hover:scale-110 transition-[2]' />
                        </button>
                    </div>


                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">Usos:</span> {getUsoImages(selectedProduct?.uso)}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">Cares:</span> {getMantenimientoImages(selectedProduct?.mantenimiento)}
                            </div>
                            <div>
                                <span className="font-medium">Tipo:</span> {selectedProduct.tipo}
                            </div>
                            <div>
                                <span className="font-medium">Estilo:</span> {selectedProduct.estilo}
                            </div>
                            <div>
                                <span className="font-medium">Martindale:</span> {selectedProduct.martindale}
                            </div>
                            <div>
                                <span className="font-medium">Rapport Horizontal:</span>{" "}
                                {selectedProduct.repminhor ? parseFloat(selectedProduct.repminhor).toFixed(2) : "N/A"} cm
                            </div>
                            <div>
                                <span className="font-medium">Rapport Vertical:</span>{" "}
                                {selectedProduct.repminver ? parseFloat(selectedProduct.repminver).toFixed(2) : "N/A"} cm
                            </div>
                            <div>
                                <span className="font-medium">Composición:</span> {selectedProduct?.composicion || "N/A"}
                            </div>
                            <div>
                                <span className="font-medium">Peso:</span>{" "}
                                {selectedProduct?.gramaje ? `${selectedProduct.gramaje} gms` : "N/A"}
                            </div>
                            <div>
                                <span className="font-medium">Ancho:</span>{" "}
                                {anchoOptions.length > 1 ? (
                                    <select
                                        value={selectedProduct.ancho}
                                        onChange={handleAnchoChange}
                                        className="border border-gray-300 rounded-md p-1 ml-1"
                                    >
                                        {anchoOptions.map((ancho, index) => (
                                            <option key={index} value={ancho}>
                                                {ancho}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    `${selectedProduct?.ancho || "N/A"}`
                                )}
                            </div>
                        </div>
                        {usoMantenimientoIcons.length > 0 && (
                            <div className="flex flex-wrap mt-4">
                                {usoMantenimientoIcons}
                            </div>
                        )}
                        {getDireccionImage(selectedProduct?.direcciontela)}

                    </div>

                    {/* OTROS DISEÑOS DE TELAS */}
                    {recommendedProducts
                        .filter(item => item.nombre !== selectedProduct.nombre)
                        .length > 0 && (
                            <CarruselColeccion
                                productos={recommendedProducts.filter(item => item.nombre !== selectedProduct.nombre)}
                                onProductoClick={handleDetailClick}
                                titulo={selectedProduct.coleccion}
                            />
                        )}

                    <CarruselMismoEstilo
                        estilo={selectedProduct?.estilo}
                        excludeNombre={selectedProduct?.nombre}
                        excludeColeccion={selectedProduct?.coleccion}
                        onProductoClick={handleDetailClick}
                    />


                    {addedToCart && (
                        <div className="fixed bottom-10 right-10 z-50 flex items-center space-x-4 bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-full shadow-xl transform transition-all duration-300">
                            <img
                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/POP%20UP/Check.svg"
                                alt="Success"
                                className="w-8 h-8"
                            />
                            <span className="text-lg font-bold">Agregado correctamente</span>
                        </div>
                    )}

                    {showIconMeaning && (
                        <div className="fixed bottom-10 left-10 bg-white p-4 rounded-md shadow-md">
                            <h3 className="text-lg font-bold">Significado del Icono</h3>
                            <p>{showIconMeaning}</p>
                            <button className="text-blue-500 mt-2" onClick={() => setShowIconMeaning('')}>
                                Cerrar
                            </button>
                        </div>
                    )}

                    {modalMapaOpen && (
                        <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />
                    )}

                    <div style={{ display: 'none' }}>{renderEtiqueta()}</div>


                </div>
                <Footer />
            </div>

        </CartProvider>
    );
};

export default Modal;
