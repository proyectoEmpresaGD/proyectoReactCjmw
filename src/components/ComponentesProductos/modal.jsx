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
    const [isZooming, setIsZooming] = useState(false);
    const [showIconMeaning, setShowIconMeaning] = useState(''); // Nuevo estado para mostrar significado del icono

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${product.codfamil}`);
                const data = await response.json();
                const productsWithImages = await Promise.all(
                    data
                        .filter(p => p.nombre === product.nombre) // Filtrar productos con el mismo nombre
                        .map(async (product) => {
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
    }, [product.codfamil, product.nombre]);

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

        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const lensWidth = lens.offsetWidth / 2;
        const lensHeight = lens.offsetHeight / 2;

        const posX = Math.max(0, Math.min(x - lensWidth, width - lens.offsetWidth));
        const posY = Math.max(0, Math.min(y - lensHeight, height - lens.offsetHeight));

        lens.style.left = `${posX}px`;
        lens.style.top = `${posY}px`;

        const zoomX = (posX + lensWidth) * zoomFactor - result.offsetWidth / 2;
        const zoomY = (posY + lensHeight) * zoomFactor - result.offsetHeight / 2;

        result.firstChild.style.left = `-${zoomX}px`;
        result.firstChild.style.top = `-${zoomY}px`;
    };

    const handleMouseEnter = () => {
        if (lensRef.current && resultRef.current) {
            lensRef.current.style.display = 'block';
            resultRef.current.style.display = 'block';
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        if (lensRef.current && resultRef.current) {
            lensRef.current.style.display = 'none';
            resultRef.current.style.display = 'none';
            setIsZooming(false);
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
        "LAVAR A 30°": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2030%C2%BA.jpg',
        "LAVAR A 40°": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2040%C2%BA.jpg',
        "LAVAR A 90°": '',
        "NO LAVAR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar.jpg",
        "PLANCHAR A 120°": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20120%C2%BA.jpg',
        "PLANCHAR A 160°": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20160%C2%BA.jpg',
        "PLANCHAR A 210°": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20210%C2%BA.jpg',
        "NO PLANCHAR": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20planchar.jpg',
        "LAVAR A MANO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%20mano.jpg',
        "NO USAR LEJIA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lejia.jpg',
        "LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20en%20seco.jpg',
        "NO LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar%20en%20seco.jpg',
        "NO USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20usar%20secadora.jpg',
        "USAR LEJIA": '',
        "EASYCLEAN": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/EASY%20CLEAN.jpg',
        "USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Usar%20secadora.jpg',
        "SECADO VERTICAL": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Secado%20vertical.jpg',
    };

    const parseMantenimientoXML = (mantenimientoXML) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(mantenimientoXML, "text/xml");

        const valores = xmlDoc.getElementsByTagName("Valor");

        const mantenimientoList = Array.from(valores).map(node => node.textContent.trim());

        return mantenimientoList;
    };

    const getMantenimientoImages = (mantenimiento) => {
        if (!mantenimiento) return "?";

        const mantenimientoList = parseMantenimientoXML(mantenimiento);

        return mantenimientoList
            .filter(mantenimiento => mantenimientoImages[mantenimiento])
            .map((mantenimiento, index) => (
                <img
                    key={index}
                    src={mantenimientoImages[mantenimiento]}
                    alt={mantenimiento}
                    className="w-6 h-6 mx-1 cursor-pointer"
                    title={`Click para ver el significado de ${mantenimiento}`} // Agregar tooltip
                    onClick={() => setShowIconMeaning(mantenimiento)} // Al hacer clic, mostrar el significado
                />
            ));
    };

    const usoImages = {
        "TAPICERIA DECORATIVA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria%20decorativa.jpg',
        "TAPICERIA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria.jpg',
        'CORTINAS': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Cortinas.jpg',
        "ESTORES": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Estores.jpg',
        "COLCHAS": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Colchas.jpg',
        "ALFOMBRAS": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Alfombras.jpg',
        "FR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/FR.jpg",
        "OUTDOOR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/OUTDOOR.jpg",
        "IMO": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/IMO.jpg",
    };

    const getUsoImages = (usos) => {
        if (!usos) return "?";
        const usoList = usos.split(';').map(uso => uso.trim());
        return usoList.map((uso, index) => (
            <img
                key={index}
                src={`${usoImages[uso]}`}
                alt={uso}
                className="w-6 h-6 mx-1 cursor-pointer"
                title={`Click para ver el significado de ${uso}`} // Agregar tooltip
                onClick={() => setShowIconMeaning(uso)} // Al hacer clic, mostrar el significado
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
                <TiChevronRight className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[120%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[65%] pr-1" />
            </div>
        );
    };

    const handleAddToCart = () => {
        addToCart({
            id: selectedProduct.codprodu,
            name: selectedProduct.nombre,
            price: 3,
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
                <TiChevronLeft className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[120%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[65%] pr-1" />
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-2 h-[100%] mt-5% pb-32">
            <div className="bg-white px-7 pt-3 xl:w-[90%] 2xl:max-w-[90%] w-[95%] md:max-w-[95%] m-4 h-[90vh] xl:max-h-[80vh] 2xl:h-auto md:h-auto overflow-auto xl:overflow-hidden shadow-lg relative max-h-[95vh] mt-[50%] md:mt-[15%] lg:[15%] 2xl:mt-[15%]">
                    <div className="flex justify-center absolute top-4 right-4">
                        <button className="relative " onClick={close}>
                            <img src="/close.svg" className='w-8 h-8 hover:scale-125 duration-200' alt="Close" />
                        </button>
                    </div>
                    <h2 className="text-center text-3xl font-semibold mb-2 md:mb-4 text-gray-800 mt-7 md:mt-0">{selectedProduct.nombre} {selectedProduct.tonalidad}</h2>

                    <div className="grid lg:grid-cols-6 md:grid-cols-7 sm:md:grid-cols-6 grid-cols-1 justify-center mx-auto " onClick={e => e.stopPropagation()}>
                        <div className="relative group w-full h-[90%] lg:w-[100%] lg:h-[75%] 2xl:h-[70%] md:h-[50%] overflow-hidden col-span-2 md:col-span-3 lg:col-span-2">
                            <img
                                src={selectedImage}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                alt={alt}
                                className="w-full h-full object-contain rounded-md"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                onMouseMove={moveLens}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                            {imageLoaded && (
                                <>
                                    <div
                                        ref={lensRef}
                                        className="absolute hidden w-20 h-15 border border-gray-300 opacity-50 bg-transparent mx-11 pointer-events-none"
                                        style={{ borderRadius: '50%', transition: 'ease' }}
                                    ></div>

                                    <div
                                        ref={resultRef}
                                        className="absolute hidden top-0 left-0 pointer-events-none rounded-lg overflow-hidden"
                                        style={{
                                            width: '200%',
                                            height: '200%',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <img
                                            src={selectedImage}
                                            alt={alt}
                                            className="absolute rounded-md"
                                            style={{
                                                width: `${zoomFactor * 100}%`,
                                                height: `${zoomFactor * 100}%`,
                                                objectFit: 'cover',
                                                transition: 'ease',
                                                transform: ''
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='col-span-4 w-full xl:pt-0 md:pl-7 lg:pl-6 xl:pl-8 lg:p-4 md:p-4 text-center md:text-start justify-start'>

                            <Slider {...settings}>
                                {relatedProducts.map((colorProduct, index) => (
                                    <div
                                        key={index}
                                        className={`relative px-1 mx-auto cursor-pointer mt-4 md:mt-0 flex-grow ${relatedProducts.length < 4 ? 'w-full' : 'w-1/4'}`}
                                        onClick={() => handleColorClick(colorProduct)}
                                    >
                                        <img
                                            src={colorProduct.imageBaja}
                                            alt={colorProduct.nombre}
                                            className="w-full h-24 md:h-28 xl:h-36 object-cover rounded-md"
                                            onError={(e) => { e.target.src = 'default_image_preview_url'; }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white text-center">{colorProduct.nombre} {colorProduct.tonalidad}</p>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            <div className="flex items-center justify-evenly mb-2 mt-4 md:mt-2 lg:mt-0">
                                <div className="flex items-center justify-start mb-2 mt-4 md:mt-2 lg:mt-0">
                                    <div className="flex items-center justify-center bg-gray-300 text-black font-semibold rounded-full w-9 h-9">
                                        {relatedProducts.length}
                                    </div>
                                    <p className="ml-2 text-md">
                                        {relatedProducts.length === 1 ? 'Color disponible' : 'Colores disponibles'}
                                    </p>
                                </div>

                                <div className="text-center mt-2 mb-2">
                                    <button onClick={handleMapClick} className=" bg-black hover:bg-white text-white hover:text-black border-2 border-black hover:border-gray-400 hover:rounded-xl font-semibold py-2 px-3 rounded-md transition duration-200 mx-1">
                                        Dónde comprar
                                    </button>
                                    <button onClick={handleAddToCart} className=" bg-black hover:bg-white text-white hover:text-black border-2 border-black hover:border-gray-400 hover:rounded-xl font-semibold py-2 px-2 rounded-md transition duration-200 mx-1 mt-2">
                                        Adquirir muestra
                                    </button>
                                </div>
                            </div>

                            {/* Ficha Técnica */}
                            <div className="justify-start xl:p-2 lg:p-2 md:p-2 md:text-sm text-sm lg:text-md  text-center md:text-start w-full">
                                <h1 className="font-bold text-black mx-auto text-center mb-4 mt-[2rem] md:mt-[0rem] ">Ficha Técnica</h1>
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                                    <div className=" ">
                                        <div className="grid grid-cols-2 md:justify-start md:text-start  md:text-sm text-sm lg:text-md mb-2">
                                            <p>Marca:</p>
                                            <p>{selectedProduct.codmarca}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p className=''>Colección:</p>
                                            <p className=''>{selectedProduct.coleccion}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Tonalidad:</p>
                                            <p>{selectedProduct.tonalidad}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Color:</p>
                                            <p>{selectedProduct.colorprincipal}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Tipo:</p>
                                            <p>{selectedProduct.tipo}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Estilo:</p>
                                            <p>{selectedProduct.estilo}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md">
                                            <p>Ancho:</p>
                                            <p>{selectedProduct.ancho}</p>
                                        </div>
                                    </div>

                                    {/* Segunda columna de la ficha técnica */}
                                    <div className=""> {/* Ajusta el ancho mínimo si es necesario */}
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Martindale:</p>
                                            <p>{selectedProduct.martindale}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Gramaje:</p>
                                            <p>{selectedProduct.gramaje}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Composición:</p>
                                            <p className="break-words">{selectedProduct.composicion}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Rapord Horizontal:</p>
                                            <p className="break-words">{parseFloat(selectedProduct.repminhor).toFixed(2)} cm</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:justify-start md:text-start md:text-sm text-sm lg:text-md mb-2">
                                            <p>Rapord Vertical:</p>
                                            <p className="break-words">{parseFloat(selectedProduct.repminver).toFixed(2)} cm</p>
                                        </div>
                                    </div>

                                    {/* Tercera columna (usos y mantenimiento) */}
                                    <div className="md:col-span-2 md:col-start-1 lg:col-span-1 lg:col-start-auto">
                                        <div className="md:text-sm text-sm lg:text-md ">
                                            <div>
                                                <h3 className="text-center font-semibold">Usos</h3>
                                                <Link to="/usages">
                                                    <div className="flex justify-center items-center mt-2">
                                                        {getUsoImages(selectedProduct.uso)}
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <h3 className="text-center mt-4 font-semibold">Mantenimiento</h3>
                                                <Link to="/usages">
                                                    <div className="flex justify-center items-center mt-2">
                                                        {getMantenimientoImages(selectedProduct.mantenimiento)}
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    {/* Mostrar el significado del icono seleccionado */}
                    {showIconMeaning && (
                        <div className="fixed bottom-10 left-10 bg-white p-4 rounded-md shadow-md">
                            <h3 className="text-lg font-bold">Significado del Icono</h3>
                            <p>{showIconMeaning}</p>
                            <button className="text-blue-500 mt-2" onClick={() => setShowIconMeaning('')}>Cerrar</button>
                        </div>
                    )}
                </div>
                {modalMapaOpen && (
                    <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />
                )}
            </div>
        </CartProvider >
    );
};

export default Modal;
