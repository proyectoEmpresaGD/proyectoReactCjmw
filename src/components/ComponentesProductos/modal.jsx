import { useState, useRef, useEffect } from 'react';
import ModalMapa from "./modalMapa";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { useCart } from '../CartContext';
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { CartProvider } from "../CartContext";
import { Link } from "react-router-dom";

const Modal = ({ isOpen, close, product, alt }) => {
    const { addToCart } = useCart();
    const [modalMapaOpen, setModalMapaOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(product);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const [zoomFactor, setZoomFactor] = useState(2);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${product.codfamil}`);
                const data = await response.json();
                const productsWithImages = await Promise.all(
                    data.map(async (product) => {
                        const [imageBuena, imageBaja] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
                        ]);

                        return {
                            ...product,
                            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
                            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
                        };
                    })
                );
                setRelatedProducts(productsWithImages);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };
        fetchRelatedProducts();
    }, [product.codfamil]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const [buenaResponse, bajaResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`)
                ]);

                const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
                const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;

                setSelectedProduct({
                    ...product,
                    imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : 'default_buena_image_url',
                    imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : 'default_baja_image_url'
                });
                setSelectedImage(buenaImage ? `https://${buenaImage.ficadjunto}` : 'default_buena_image_url');
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, [product.codprodu]);

    const handleMapClick = () => {
        setModalMapaOpen(true);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
        const img = lensRef.current?.previousSibling;
        if (img) {
            const { width, height } = img;
            const factor = Math.max(2, (width > 300 || height > 300) ? 2 : 3);
            setZoomFactor(factor);
        }
    };

    const handleImageError = () => {
        console.error('Error loading image');
    };

    const moveLens = (e) => {
        if (!lensRef.current || !resultRef.current || !imageLoaded) return;

        const lens = lensRef.current;
        const result = resultRef.current;
        const img = e.target;

        // Obtener el tamaño de la imagen y la posición del ratón
        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Calcular el tamaño de la lupa
        const lensWidth = lens.offsetWidth / 2;
        const lensHeight = lens.offsetHeight / 2;

        // Limitar la posición de la lupa dentro de la imagen
        const posX = Math.max(0, Math.min(x - lensWidth, width - lens.offsetWidth));
        const posY = Math.max(0, Math.min(y - lensHeight, height - lens.offsetHeight));

        // Mover la lupa
        lens.style.left = `${posX}px`;
        lens.style.top = `${posY}px`;

        // Calcular la posición de la imagen ampliada para que coincida con la original
        const zoomX = (x * zoomFactor) - lensWidth;
        const zoomY = (y * zoomFactor) - lensHeight;

        // Posicionar la imagen ampliada en la misma posición que la imagen original
        result.firstChild.style.left = `-${zoomX}px`;
        result.firstChild.style.top = `-${zoomY}px`;
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
                imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : 'default_buena_image_url',
                imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : 'default_baja_image_url'
            };

            setSelectedProduct(updatedProduct);
            setSelectedImage(updatedProduct.imageBuena || updatedProduct.imageBaja);
            setImageLoaded(false);
        } catch (error) {
            console.error('Error fetching images for color product:', error);
        }
    };

    const mantenimientoImages = {
        "Lavable a máquina": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/washing.svg',
        "No lavable a máquina": "https://cjmw.eu/ImagenesTelasCjmw/Iconos/do-not-wash.svg",
        "Planchar a 120°": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/iron-1.svg',
        "Planchar a 160°": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/iron-2.svg',
        "Planchar a 210°": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/iron-3.svg',
        "No planchar": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/iron-disable.svg',
        "Lavar a mano": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/hand-wash.svg',
        "No usar blanqueador": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/noun-no-bleach.svg',
        "Limpieza en seco": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/dry-Clening.webp',
        "No usar secadora": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/noun-do.svg',
    };

    const getMantenimientoImages = (mantenimientos) => {
        if (!mantenimientos) return "?";

        const mantenimientoList = mantenimientos.split(';').map(mantenimiento => mantenimiento.trim());
        return mantenimientoList
            .filter(mantenimiento => mantenimientoImages[mantenimiento])
            .map((mantenimiento, index) => (
                <img
                    key={index}
                    src={mantenimientoImages[mantenimiento]}
                    alt={mantenimiento}
                    className="w-6 h-6 mx-1"
                />
            ));
    };

    const usoImages = {
        "Tapiceria Decorativa": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Upholstery%20for%20decoration.webp',
        "Tapiceria": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/Upholstery.webp',
        'Cortinas': 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/courtains.svg',
        "Blinds": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/window-blind.svg',
        "Colchas": 'https://cjmw.eu/ImagenesTelasCjmw/Iconos/bedspreads.webp',
    };

    const getUsoImages = (usos) => {
        if (!usos) return "?";
        const usoList = usos.split(';').map(uso => uso.trim());
        return usoList.map((uso, index) => (
            <img
                key={index}
                src={`${usoImages[uso]}`}
                alt={uso}
                className="w-6 h-6 mx-1"
            />
        ));
    };

    const SampleNextArrow = ({ className, style, onClick }) => {
        return (
            <div
                className={`${className} `}
                style={{ ...style, display: 'block' }}
                onClick={onClick}
            >
                <TiChevronRight className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[120%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[70%]" />
            </div>
        );
    };

    const handleAddToCart = () => {
        addToCart({
            id: selectedProduct.codprodu,
            name: selectedProduct.desprodu,
            price: 0.80,
            image: selectedProduct.imageBaja,
            quantity: 1
        });
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 2000);
    };

    const SamplePrevArrow = ({ className, style, onClick }) => {
        return (
            <div
                className={`${className} `}
                style={{ ...style, display: 'block', }}
                onClick={onClick}
            >
                <TiChevronLeft className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[120%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[70%]" />
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    };

    if (!isOpen) return null;

    return (
        <CartProvider>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4 mt-14">
                <div className="bg-white p-7 lg:mt-[5%] xl:mt-[5%] md:mt-[5%] mt-[20%] rounded-lg xl:max-w-4xl w-90% md:max-w-3xl m-4 h-auto overflow-auto shadow-lg relative max-h-[90vh]">
                    <div className="flex justify-end absolute top-4 right-4">
                        <button className="relative " onClick={close}>
                            <img src="/close.svg" className='w-8 h-8 hover:scale-125 duration-200' alt="Close" />
                        </button>
                    </div>
                    <h2 className="text-center text-3xl font-semibold mb-4 text-gray-800 mt-12 md:mt-0">{selectedProduct.desprodu}</h2>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2" onClick={e => e.stopPropagation()}>
                        <div className="relative group w-full h-64 md:h-96 ">
                            <img
                                src={selectedImage}
                                style={{ filter: 'saturate(1.4) brightness(1.2)' }}
                                alt={alt}
                                className="w-full h-full object-contain rounded-md"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                onMouseMove={moveLens}
                                onMouseEnter={() => {
                                    if (lensRef.current && resultRef.current) {
                                        lensRef.current.style.display = 'block';
                                        resultRef.current.style.display = 'block';
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (lensRef.current && resultRef.current) {
                                        lensRef.current.style.display = 'none';
                                        resultRef.current.style.display = 'none';
                                    }
                                }}
                            />
                            {imageLoaded && (
                                <>
                                    {/* Lupa dinámica */}
                                    <div
                                        ref={lensRef}
                                        className="absolute hidden w-24 h-24 border border-gray-300 opacity-50 bg-transparent pointer-events-none"
                                        style={{ borderRadius: '50%', transition: 'ease',   }}
                                    ></div>

                                    {/* Imagen ampliada */}
                                    <div
                                        ref={resultRef}
                                        className="absolute hidden top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
                                    >
                                        <img
                                            src={selectedImage}
                                            alt={alt}
                                            className="absolute rounded-md"
                                            style={{
                                                width: `${zoomFactor * 150}%`,
                                                height: `${zoomFactor * 150}%`,
                                                objectFit: 'cover',
                                                transition: 'ease',
                                                transform: 'translate(50%, 0%)',
                                                filter: 'saturate(1.4) brightness(1.2)',  // Para asegurar que el centro esté en la posición inicial
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col justify-start xl:p-8 lg:p-8 md:p-8 mx-auto text-start">
                            <h1 className="font-bold text-black mx-auto text-start mb-4 mt-[-2rem]">Ficha Técnica</h1>
                            <div className="">
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Marca:</p>
                                    <p className="">{selectedProduct.codmarca}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Colección:</p>
                                    <p className="">{selectedProduct.coleccion}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Tonalidad:</p>
                                    <p className="">{selectedProduct.tonalidad}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Tipo:</p>
                                    <p className="">{selectedProduct.tipo}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Estilo:</p>
                                    <p className="">{selectedProduct.estilo}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Martindale:</p>
                                    <p className="">{selectedProduct.martindale}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Gramaje:</p>
                                    <p>{selectedProduct.gramaje}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mb-2">
                                    <p className="">Composición:</p>
                                    <p className="">{selectedProduct.composicion}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base mt-4">
                                    <div>
                                        <h3 className="text-center font-semibold">Usos</h3>
                                        <Link to="/usages">
                                            <div className="flex justify-center items-center mt-2">
                                                {getUsoImages(selectedProduct.uso)}
                                            </div>
                                        </Link>
                                    </div>
                                    <div>
                                        <h3 className="text-center font-semibold">Mantenimiento</h3>
                                        <Link to="/usages">
                                            <div className="flex justify-center items-center mt-2">
                                                {getMantenimientoImages(selectedProduct.mantenimiento)}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6 space-x-4">
                                    <button onClick={handleMapClick} className="bg-gradient-to-r from-[#a57b52] to-[#c8a17d] text-white font-bold py-2 px-2 rounded-full transition duration-200 mx-1 hover:from-[#c8a17d] hover:to-[#a57b52]">
                                        Dónde comprar
                                    </button>
                                    <button onClick={handleAddToCart} className="bg-gradient-to-r from-[#8c7c68] to-[#a09282] text-white font-bold py-2 px-2 rounded-full transition duration-200 mx-1 hover:from-[#a09282] hover:to-[#8c7c68]">
                                        Adquirir muestra
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Slider {...settings}>
                            {relatedProducts.map((colorProduct, index) => (
                                <div key={index} className="relative px-2 cursor-pointer" onClick={() => handleColorClick(colorProduct)}>
                                    <img
                                        src={colorProduct.imageBaja}
                                        alt={colorProduct.desprodu}
                                        className="w-full h-32 object-cover rounded-md"
                                        onError={(e) => { e.target.src = 'default_image_preview_url'; }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-center">{colorProduct.desprodu}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                {modalMapaOpen && (
                    <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />
                )}
            </div>
        </CartProvider>
    );
};

export default Modal;
