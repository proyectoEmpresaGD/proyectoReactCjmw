import { useState, useRef, useEffect } from 'react';
import ModalMapa from "./modalMapa";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { useCart } from '../CartContext';
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { CartProvider } from "../CartContext"; // Importa CartProvider correctamente
import { Link } from "react-router-dom";

const Modal = ({ isOpen, close, product, alt }) => {
    const { addToCart } = useCart();
    const [modalMapaOpen, setModalMapaOpen] = useState(false); // Estado para controlar la apertura de ModalMapa
    const [imageLoaded, setImageLoaded] = useState(false); // Estado para controlar la carga de la imagen
    const [selectedImage, setSelectedImage] = useState(''); // Estado para la imagen seleccionada
    const [selectedProduct, setSelectedProduct] = useState(product); // Estado para el producto seleccionado
    const [relatedProducts, setRelatedProducts] = useState([]); // Estado para los productos relacionados
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const [zoomFactor, setZoomFactor] = useState(2); // Factor de zoom

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
        setModalMapaOpen(true); // Abre ModalMapa cuando se cliquea el botón
    };

    const handleImageLoad = () => {
        setImageLoaded(true); // Marca la imagen como cargada
        const img = lensRef.current?.previousSibling;
        if (img) {
            const { width, height } = img;
            const factor = Math.max(2, (width > 300 || height > 300) ? 2 : 3);
            setZoomFactor(factor);
        }
    };

    const handleImageError = () => {
        console.error('Error loading image'); // Maneja el error de carga de la imagen
    };

    const moveLens = (e) => {
        if (!lensRef.current || !resultRef.current || !imageLoaded) return;

        const lens = lensRef.current;
        const result = resultRef.current;
        const img = e.target;
        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const lensWidth = lens.offsetWidth / 2;
        const lensHeight = lens.offsetHeight / 2;

        const posX = x - lensWidth;
        const posY = y - lensHeight;

        const boundedPosX = Math.max(0, Math.min(posX, width - lens.offsetWidth));
        const boundedPosY = Math.max(0, Math.min(posY, height - lens.offsetHeight));

        lens.style.left = `${boundedPosX}px`;
        lens.style.top = `${boundedPosY}px`;

        const zoomX = boundedPosX * zoomFactor;
        const zoomY = boundedPosY * zoomFactor;

        result.firstChild.style.left = `-${zoomX}px`;
        result.firstChild.style.top = `-${zoomY}px`;
    };

    const handleColorClick = (colorProduct) => {
        setSelectedProduct(colorProduct); // Actualiza el producto seleccionado
        setSelectedImage(colorProduct.imageBaja);
        setImageLoaded(false); // Reset image loaded state to show lens only after image is loaded
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
            price: 0.80, // Precio fijo por ahora
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
                <div className="bg-white p-7 lg:mt-[5%] xl:mt-[5%] md:mt-[5%] mt-[30%] rounded-lg xl:max-w-4xl w-90% md:max-w-3xl m-4 h-auto overflow-auto shadow-lg relative max-h-[90vh]">
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
                                    <div
                                        ref={lensRef}
                                        className="absolute hidden w-full h-full border border-gray-300 opacity-50 bg-transparent pointer-events-none"
                                    ></div>

                                    <div
                                        ref={resultRef}
                                        className="absolute hidden top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
                                    >
                                        <img
                                            src={selectedImage}
                                            alt={alt}
                                            className="absolute rounded-md"
                                            style={{
                                                width: `${zoomFactor * 70}%`,
                                                height: `${zoomFactor * 70}%`,
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col justify-between xl:p-8 lg:p-8 md:p-8 mx-auto text-start">
                            <h1 className="font-bold text-black mx-auto text-start">Ficha Técnica</h1>
                            <div className="">
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="">Marca:</p>
                                    <p className="">{selectedProduct.codmarca}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="my-2">Colección:</p>
                                    <p className="my-2">{selectedProduct.coleccion}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="">Color:</p>
                                    <p className="">{selectedProduct.colorprincipal}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="my-2">Tipo:</p>
                                    <p className="my-2">{selectedProduct.tipo}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="">Estilo:</p>
                                    <p className="">{selectedProduct.estilo}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="my-2">Martindale:</p>
                                    <p className="my-2">{selectedProduct.martindale}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base">
                                    <p className="">Gramaje:</p>
                                    <p>{selectedProduct.gramaje}</p>
                                </div>
                                <div className="grid grid-cols-2 justify-start text-start text-base ">
                                    <p className="my-2">Composición:</p>
                                    <p className="my-2">{selectedProduct.composicion}</p>
                                </div>
                                <div className="justify-center text-start text-base">
                                </div>
                            </div>
                            <div className="grid grid-cols-2 mx-2 text-center">
                                <div>
                                    <h3 className=" justify-center mx-auto text-center">Usos</h3>
                                    <Link to="/usages">
                                        <div className="justify-center items-center mx-auto mt-2 flex ">
                                            {getUsoImages(selectedProduct.uso)}
                                        </div>
                                    </Link>
                                </div>
                                <div>
                                    <h3>Mantenimiento</h3>
                                    <Link to="/usages">
                                        <div className="flex justify-center mt-2">
                                            {getMantenimientoImages(selectedProduct.mantenimiento)}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 ">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 mx-1"
                                    onClick={handleMapClick}>Dónde comprar</button>
                                <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-200">Adquirir muestra</button>
                            </div>
                        </div>
                    </div>

                    {/* Carrusel de imágenes de colores */}
                    <div className="mt-6">
                        <Slider {...settings}>
                            {relatedProducts.map((colorProduct, index) => (
                                <div key={index} className="px-2">
                                    <img
                                        src={colorProduct.imageBaja}
                                        alt={colorProduct.desprodu}
                                        className="w-full h-24 object-cover rounded-full cursor-pointer"
                                        onClick={() => handleColorClick(colorProduct)}
                                        onError={(e) => { e.target.src = 'default_image_preview_url'; }}
                                    />
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