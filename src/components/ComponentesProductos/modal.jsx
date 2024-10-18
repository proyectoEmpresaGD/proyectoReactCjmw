import { useState, useRef, useEffect } from 'react';
import ModalMapa from "./modalMapa";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { useCart } from '../CartContext';
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { CartProvider } from "../CartContext";
import { Link } from "react-router-dom";
import ShareButton from './ShareButton';

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

    const dobleMedida = ['INMACULADA', 'LORENA', 'ANTILLA JUTE', 'CALCUTA', 'CAYMAN', 'ZAHARA', 'BOLONIA', 'LIENZO', 'VARADERO', 'DIAMANTE', 'IMPERIAL', 'PUMMERIN', 'TOPKAPI', 'TULUM', 'MOIRE', 'AHURA'];

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp'
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
                                imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : defaultImageUrl,
                                imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : defaultImageUrl
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
                const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';
                const [buenaResponse, bajaResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`)
                ]);

                const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
                const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;

                setSelectedProduct({
                    ...product,
                    imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : defaultImageUrl,
                    imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : defaultImageUrl
                });

                setSelectedImage(buenaImage ? `https://${buenaImage.ficadjunto}` : defaultImageUrl);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();

    }, [product.codprodu]);

    const handleMapClick = () => {
        setModalMapaOpen(true);
    };

    const moveLens = (e) => {
        if (!resultRef.current || !imageLoaded) return;

        const result = resultRef.current;
        const img = e.target;

        // Obtener las coordenadas y dimensiones de la imagen
        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Limitar las posiciones dentro de la imagen
        const posX = Math.max(100, Math.min(x, width));
        const posY = Math.max(100, Math.min(y, height));

        // Calcular la proporción del cursor respecto al tamaño de la imagen
        const ratioX = posX / width;
        const ratioY = posY / height;

        // Calcular el movimiento de la imagen ampliada
        const zoomedImageWidth = width * zoomFactor;
        const zoomedImageHeight = height * zoomFactor;

        // Limitar el movimiento para que la imagen no se salga del contenedor
        const moveX = Math.max(0, Math.min(ratioX * (zoomedImageWidth - width), zoomedImageWidth - width));
        const moveY = Math.max(0, Math.min(ratioY * (zoomedImageHeight - height), zoomedImageHeight - height));

        // Aplicar el movimiento y el zoom a la imagen dentro del contenedor
        result.firstChild.style.transform = `translate(-${moveX}px, -${moveY}px) scale(${zoomFactor})`;
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
        "LAVAR A 30º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2030%C2%BA.jpg',
        "LAVAR A 40º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2040%C2%BA.jpg',
        "LAVAR A 90º": '',
        "NO LAVAR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar.jpg",
        "PLANCHAR A 120º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20120%C2%BA.jpg',
        "PLANCHAR A 160º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20160%C2%BA.jpg',
        "PLANCHAR A 210º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20210%C2%BA.jpg',
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
                <TiChevronRight className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[80%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[65%] pr-1" />
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
                <TiChevronLeft className="text-black text-3xl hover:text-gray-500 flex items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-[80%] lg:transform lg:-translate-y-[60%] xl:transform xl:-translate-y-[60%] md:transform md:-translate-y-[65%] pr-1" />
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: relatedProducts.length > 4, // Si hay más de 3 productos, el carrusel será infinito
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        vertical: true,  
        verticalSwiping: true,  
        arrows: false,  
        rows: 3,
        slidesPerRow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    rows: 3,
                    vertical: true,  // Seguimos usando el scroll vertical en pantallas pequeñas
                    verticalSwiping: true,
                }
            },
        ]
    };

    if (!isOpen) return null;

    return (
        <CartProvider>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-2 h-[100%] mt-5% pb-32">
                <div className="bg-white px-7 pt-3 xl:w-[90%] 2xl:max-w-[90%] w-[95%] md:max-w-[95%] m-4 h-[90vh] xl:max-h-[90vh] 2xl:max-h-[80vh] 2xl:h-auto md:h-auto overflow-auto xl:overflow-hidden shadow-lg relative max-h-[95vh] mt-[54%] md:mt-[23%] 2xl:mt-[15%]">
                    <div className="flex justify-center absolute top-4 right-3">
                        <button className="relative " onClick={close}>
                            <img src="/close.svg" className='w-8 h-8 hover:scale-125 duration-200' alt="Close" />
                        </button>
                    </div>

                    <ShareButton selectedProduct={selectedProduct} />



                    <h2 className="text-center text-3xl font-semibold mb-2 md:mb-4 text-gray-800 mt-7 md:mt-0">{selectedProduct.nombre} {selectedProduct.tonalidad}</h2>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:md:grid-cols-1 grid-cols-1 justify-center mx-auto" onClick={e => e.stopPropagation()}>
                        {/* Ficha Técnica */}
                        <div className="justify-start xl:p-2 lg:p-2 md:p-2 md:text-sm text-sm lg:text-md text-center md:text-start w-full order-3 md:order-3 lg:order-1">
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 md:mx-auto just lg:grid-cols-1 gap-x-8 gap-y-3 ">
                                <h1 className="font-bold text-black mx-auto text-center mb-4 mt-[2rem] md:mt-[0rem] ">Ficha Técnica</h1>
                                <div className="grid grid-cols-2  md:grid-cols-2 mx-auto justify-center gap-x-12 gap-y-2 w-full md:w-4/4">

                                    <div className="text-left">
                                        <strong>Marca:</strong> {selectedProduct.codmarca}
                                    </div>
                                    <div className="text-left">
                                        <strong>Colección:</strong> {selectedProduct.coleccion}
                                    </div>
                                    <div className="text-left">
                                        <strong>Tonalidad:</strong> {selectedProduct.tonalidad}
                                    </div>
                                    <div className="text-left">
                                        <strong>Color:</strong> {selectedProduct.colorprincipal}
                                    </div>
                                    <div className="text-left">
                                        <strong>Tipo:</strong> {selectedProduct.tipo}
                                    </div>
                                    <div className="text-left">
                                        <strong>Estilo:</strong> {selectedProduct.estilo}
                                    </div>
                                    <div className="text-left">
                                        <strong>Ancho:</strong> {dobleMedida.includes(selectedProduct.nombre) ? '140/280 cm' : selectedProduct.ancho}
                                    </div>
                                    <div className="text-left">
                                        <strong>Martindale:</strong> {selectedProduct.martindale}
                                    </div>
                                    <div className="text-left">
                                        <strong>Gramaje:</strong> {selectedProduct.gramaje}
                                    </div>
                                    <div className="text-left">
                                        <strong>Composición:</strong> {selectedProduct.composicion}
                                    </div>
                                    <div className="text-left">
                                        <strong>Rapord Horizontal:</strong> {parseFloat(selectedProduct.repminhor).toFixed(2)} cm
                                    </div>
                                    <div className="text-left">
                                        <strong>Rapord Vertical:</strong> {parseFloat(selectedProduct.repminver).toFixed(2)} cm
                                    </div>

                                    {/* Segunda fila: Usos y Mantenimiento en el centro */}
                                    <div className="col-span-2 flex flex-col items-center justify-center mt-4">
                                        <div className="w-full md:w-1/2">
                                            <h3 className="text-center font-semibold">Usos</h3>
                                            <Link to="/usages">
                                                <div className="flex justify-center items-center mt-2">
                                                    {getUsoImages(selectedProduct.uso)}
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="w-full md:w-1/2 mt-4">
                                            <h3 className="text-center font-semibold">Mantenimiento</h3>
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
                        <div className="relative group w-full h-[100%] overflow-hidden order-1 lg:order-2">
                            {/* Contenedor de la imagen */}
                            <div
                                ref={resultRef}
                                className="relative w-full overflow-hidden rounded-md"
                                onMouseMove={moveLens}
                                onMouseEnter={() => setZoomFactor(2)}  
                                onMouseLeave={() => setZoomFactor(1)}  
                                style={{
                                    transition: 'transform 0.3s ease-in-out',
                                    position: 'relative',
                                    maxWidth: '550px',            
                                    maxHeight: '435px',           
                                    width: '550px',               
                                    height: '390px',               
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt={alt}
                                    className="w-full h-full object-cover rounded-md"
                                    
                                    style={{
                                        transform: `scale(${zoomFactor})`,  
                                        transformOrigin: 'center',          
                                        transition: 'transform 0.3s ease-in-out',
                                        objectFit: 'cover',                 
                                        maxWidth: '550px',                  
                                        maxHeight: '435px',                 
                                        width: '550px',                     
                                        height: '390px',                    
                                    }}
                                />
                            </div>
                            {/* Botón centrado debajo de la imagen */}
                            <div className="flex justify-center w-full mt-4 mb-4"> {/* Centramos el botón horizontalmente */}
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-black hover:bg-white w-[100%] text-white hover:text-black border-2 border-black hover:border-gray-400 hover:rounded-xl font-semibold py-2 px-2 rounded-md transition duration-200 mx-1"
                                >
                                    Adquirir muestra
                                </button>
                            </div>
                        </div>

                        <div className='col-span-1 order-2 lg:order-3 w-full xl:pt-0 md:pl-7 lg:pl-6 xl:pl-8 lg:p-4 md:p-4 text-center md:text-start justify-start'>
                            <div className="col-span-1">
                                <Slider {...{
                                    dots: false,
                                    infinite: relatedProducts.length > 6,
                                    speed: 500,
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    rows: 3,
                                    slidesPerRow: 1,
                                    nextArrow: <SampleNextArrow />,
                                    prevArrow: <SamplePrevArrow />,
                                    responsive: [
                                        {
                                            breakpoint: 768,
                                            settings: {
                                                slidesToShow: 2,
                                                slidesToScroll: 1,
                                                rows: 1,
                                            }
                                        },
                                    ]
                                }}>
                                    {relatedProducts.map((colorProduct, index) => (
                                        <div
                                            key={index}
                                            className="relative px-1 cursor-pointer"
                                            onClick={() => handleColorClick(colorProduct)}
                                        >
                                            <img
                                                src={colorProduct.imageBaja}
                                                alt={colorProduct.nombre}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-white text-center">{colorProduct.nombre} {colorProduct.tonalidad}</p>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className="flex items-center justify-evenly mb-2 mt-4 md:mt-2 lg:mt-0">
                                <div className="flex items-center justify-start mb-2 mt-4 md:mt-2 lg:mt-0">
                                    <div className="flex items-center justify-center bg-gray-300 text-black font-semibold rounded-full w-9 h-9">
                                        {relatedProducts.length}
                                    </div>
                                    <p className="ml-2 text-md">
                                        {relatedProducts.length === 1 ? 'Color disponible' : 'Colores disponibles'}
                                    </p>
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
