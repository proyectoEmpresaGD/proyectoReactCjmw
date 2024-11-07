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
import { defaultImageUrlModalProductos, mantenimientoImages, usoImages, marcasMap } from '../../Constants/constants';

const Modal = ({ isOpen, close, product, alt }) => {
    const { addToCart } = useCart();
    const [modalMapaOpen, setModalMapaOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(product);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [anchoOptions, setAnchoOptions] = useState([]);
    const [productsForCarousel, setProductsForCarousel] = useState([]);
    const [selectedAncho, setSelectedAncho] = useState('');
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const [zoomFactor, setZoomFactor] = useState(2);
    const [isZooming, setIsZooming] = useState(false);
    const [showIconMeaning, setShowIconMeaning] = useState('');

    const dobleMedida = ['INMACULADA', 'LORENA', 'ANTILLA JUTE', 'CALCUTA', 'CAYMAN', 'ZAHARA', 'BOLONIA', 'LIENZO', 'VARADERO', 'DIAMANTE', 'IMPERIAL', 'PUMMERIN', 'TOPKAPI', 'TULUM', 'MOIRE', 'AHURA'];

    const getNombreMarca = (codmarca) => {
        return marcasMap[codmarca] || "Marca Desconocida";
    };

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${product.codfamil}`);
                const data = await response.json();

                const allProducts = data.filter(p => p.nombre === product.nombre);
                const uniqueProductsForCarousel = allProducts.reduce((unique, item) => {
                    if (!unique.some(p => p.tonalidad === item.tonalidad)) {
                        unique.push(item);
                    }
                    return unique;
                }, []);

                setProductsForCarousel(uniqueProductsForCarousel);

                const productsWithImages = await Promise.all(
                    allProducts.map(async (product) => {
                        const [imageBuena, imageBaja] = await Promise.all([
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
                            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
                        ]);

                        return {
                            ...product,
                            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : defaultImageUrlModalProductos,
                            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : defaultImageUrlModalProductos
                        };
                    })
                );

                setRelatedProducts(productsWithImages);
                const uniqueAnchos = [...new Set(allProducts.map(p => p.ancho))];
                setAnchoOptions(uniqueAnchos);
                setSelectedAncho(Math.min(...uniqueAnchos));

            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };
        fetchRelatedProducts();
    }, [product.codfamil, product.nombre]);

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

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const [buenaResponse, bajaResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`),
                ]);

                const buenaImage = buenaResponse.ok ? await buenaResponse.json() : null;
                const bajaImage = bajaResponse.ok ? await bajaResponse.json() : null;

                setSelectedProduct({
                    ...product,
                    imageBuena: buenaImage ? `https://${buenaImage.ficadjunto}` : defaultImageUrlModalProductos,
                    imageBaja: bajaImage ? `https://${bajaImage.ficadjunto}` : defaultImageUrlModalProductos
                });

                setSelectedImage(buenaImage ? `https://${buenaImage.ficadjunto}` : defaultImageUrlModalProductos);
            } catch (error) {
                console.log('Error fetching images:', error);
            }
        };

        fetchImages();

    }, [product.codprodu]);

    const moveLens = (e) => {
        if (!resultRef.current || !imageLoaded) return;

        const result = resultRef.current;
        const img = e.target;

        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const posX = Math.max(100, Math.min(x, width));
        const posY = Math.max(100, Math.min(y, height));

        const ratioX = posX / width;
        const ratioY = posY / height;

        const zoomedImageWidth = width * zoomFactor;
        const zoomedImageHeight = height * zoomFactor;

        const moveX = Math.max(0, Math.min(ratioX * (zoomedImageWidth - width), zoomedImageWidth - width));
        const moveY = Math.max(0, Math.min(ratioY * (zoomedImageHeight - height), zoomedImageHeight - height));

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
            color: selectedProduct.colorprincipal,
            quantity: 1,
            ancho: selectedProduct.ancho,
        });
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

    const getMantenimientoImages = (mantenimiento) => {
        if (!mantenimiento) return "?";

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(mantenimiento, "text/xml");

        const valores = xmlDoc.getElementsByTagName("Valor");

        const mantenimientoList = Array.from(valores).map(node => node.textContent.trim());

        return mantenimientoList
            .filter(mantenimiento => mantenimientoImages[mantenimiento])
            .map((mantenimiento, index) => (
                <img
                    key={index}
                    src={mantenimientoImages[mantenimiento]}
                    alt={mantenimiento}
                    className="w-6 h-6 mx-0 md:mx-1 cursor-pointer"
                    title={`Click para ver el significado de ${mantenimiento}`}
                    onClick={() => setShowIconMeaning(mantenimiento)}
                />
            ));
    };

    const getUsoImages = (usos) => {
        if (!usos) return "?";
        const usoList = usos.split(';').map(uso => uso.trim());
        return usoList.map((uso, index) => (
            <img
                key={index}
                src={`${usoImages[uso]}`}
                alt={uso}
                className="w-6 h-6 mx-0 md:mx-1 cursor-pointer"
                title={`Click para ver el significado de ${uso}`}
                onClick={() => setShowIconMeaning(uso)}
            />
        ));
    };

const IconoDestacables = ["FR", "OUTDOOR", "EASYCLEAN", "IMO"]; // Íconos específicos que deseas mostrar

const getMantenimientoDestacados = (mantenimiento) => {
    if (!mantenimiento) return null;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(mantenimiento, "text/xml");
    const valores = xmlDoc.getElementsByTagName("Valor");

    const mantenimientoList = Array.from(valores)
        .map(node => node.textContent.trim())
        .filter(mantenimiento => IconoDestacables.includes(mantenimiento) && mantenimientoImages[mantenimiento]);

    return mantenimientoList.map((mantenimiento, index) => (
        <div key={index} className="flex items-center mr-4 mb-2">
            <img
                src={mantenimientoImages[mantenimiento]}
                alt={mantenimiento}
                className="w-6 h-6 mr-2"
                title={`Click para ver el significado de ${mantenimiento}`}
                onClick={() => setShowIconMeaning(mantenimiento)}
            />
            <span>{mantenimiento}</span>
        </div>
    ));
};

const getUsoDestacados = (usos) => {
    if (!usos) return null;

    const usoList = usos
        .split(';')
        .map(uso => uso.trim())
        .filter(uso => IconoDestacables.includes(uso) && usoImages[uso]);

    return usoList.map((uso, index) => (
        <div key={index} className="flex items-center mr-4 mb-2">
            <img
                src={usoImages[uso]}
                alt={uso}
                className="w-6 h-6 mr-2"
                title={`Click para ver el significado de ${uso}`}
                onClick={() => setShowIconMeaning(uso)}
            />
            <span>{uso}</span>
        </div>
    ));
};

const usoMantenimientoIcons = [
    ...getUsoDestacados(selectedProduct.uso),
    ...getMantenimientoDestacados(selectedProduct.mantenimiento)
];

if (!isOpen) return null;

return (
    <CartProvider>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-2 h-[100%] mt-5% pb-32">
            <div className="bg-white px-7 pt-3 xl:w-[90%] 2xl:max-w-[90%] w-[95%] md:max-w-[95%] m-4 h-[90vh] xl:max-h-[90vh] 2xl:max-h-[80vh] 2xl:h-auto md:h-auto overflow-auto xl:overflow-hidden shadow-lg relative max-h-[95vh] mt-[54%] md:mt-[23%] 2xl:mt-[15%]">
                <ShareButton selectedProduct={selectedProduct} />
                <div className="flex justify-center absolute top-4 right-3">
                    <button className="relative " onClick={close}>
                        <img src="/close.svg" className='w-8 h-8 hover:scale-125 duration-200' alt="Close" />
                    </button>
                </div>
                <h2 className="text-center text-3xl font-semibold mb-2 md:mb-4 text-gray-800 mt-7 md:mt-0">{selectedProduct.nombre} {selectedProduct.tonalidad}</h2>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:md:grid-cols-1 grid-cols-1 justify-center mx-auto" onClick={e => e.stopPropagation()}>
                    {/* Ficha Técnica */}
                    <div className="justify-start xl:p-2 lg:p-2 md:p-2 md:text-sm text-sm lg:text-md text-center md:text-start w-full order-3 md:order-3 lg:order-1">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 md:mx-auto just lg:grid-cols-1 gap-x-8 gap-y-3 ">
                            <h1 className="font-bold text-black mx-auto text-sm md:text-xl text-center mb-4 mt-[2rem] md:mt-[0rem] ">Ficha Técnica</h1>
                            <div className="grid grid-cols-2  md:grid-cols-2 mx-auto justify-center gap-x-8 gap-y-2 w-full md:w-4/4">
                                <div className=' h-[90%]'>
                                    <div className="text-left">
                                        <strong>Marca:</strong> {getNombreMarca(selectedProduct.codmarca)}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Colección:</strong> {selectedProduct.coleccion}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Tonalidad:</strong> {selectedProduct.tonalidad}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Color:</strong> {selectedProduct.colorprincipal}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Tipo:</strong> {selectedProduct.tipo}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Estilo:</strong> {selectedProduct.estilo}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Ancho:</strong>
                                        <select
                                            value={selectedAncho}
                                            onChange={handleAnchoChange}
                                            className="border border-gray-300 rounded-md p-1 ml-2"
                                        >
                                            {anchoOptions.map((ancho, index) => (
                                                <option key={index} value={ancho}>
                                                    {ancho}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Martindale:</strong> {selectedProduct.martindale}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Gramaje:</strong> {selectedProduct.gramaje}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Composición:</strong> {selectedProduct.composicion}
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Rapord Horizontal:</strong> {parseFloat(selectedProduct.repminhor).toFixed(2)} cm
                                    </div>
                                    <div className="text-left mt-1">
                                        <strong>Rapord Vertical:</strong> {parseFloat(selectedProduct.repminver).toFixed(2)} cm
                                    </div>
                                </div>
                                <div>
                                    <div className="items-start justify-start ">
                                        <div className="w-full md:w-1/2">
                                            <h3 className="text-start font-semibold">Usos</h3>
                                            <Link to="/usages">
                                                <div className="flex justify-start items-start mt-2">
                                                    {getUsoImages(selectedProduct.uso)}
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="w-full md:w-1/2 mt-2">
                                            <h3 className="text-start font-semibold">Mantenimiento</h3>
                                            <Link to="/usages">
                                                <div className="flex justify-start items-start mt-2">
                                                    {getMantenimientoImages(selectedProduct.mantenimiento)}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {usoMantenimientoIcons.length > 0 && (
                                    <Link to="/usages">
                                    <div className="flex col-span-2 mb-2 w-full items-center mt-4">
                                        {usoMantenimientoIcons}
                                    </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative group w-full h-[100%] overflow-hidden order-1 lg:order-2">
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
                        <div className="flex justify-center w-full mt-4 mb-4">
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
                                infinite: relatedProducts.length > 6, // Solo bucle si hay suficientes productos
                                speed: 500,
                                slidesToShow: Math.min(relatedProducts.length, 2), // Ajuste en función del total
                                slidesToScroll: 1,
                                rows: 3,
                                slidesPerRow: 1,
                                nextArrow: <SampleNextArrow />,
                                prevArrow: <SamplePrevArrow />,
                                responsive: [
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToShow: Math.min(relatedProducts.length, 2),
                                            slidesToScroll: 1,
                                            rows: 1,
                                        }
                                    },
                                ]
                            }}>
                                {relatedProducts
                                    .filter((product, index, self) =>
                                        product.tonalidad && index === self.findIndex((p) => (
                                            p.tonalidad && p.tonalidad.trim().toLowerCase() === product.tonalidad.trim().toLowerCase()
                                        ))
                                    )
                                    .map((colorProduct, index) => (
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
                            <div className="flex items-center justify-evenly mb-2 mt-4 md:mt-2 lg:mt-0">
                                <div className="flex items-center justify-start mb-2 mt-4 bg-black text-white rounded-md px-2 md:mt-2 lg:mt-0">
                                    <div className="flex items-center justify-center text-white font-semibold rounded-full w-9 h-9">
                                        {productsForCarousel.length}
                                    </div>
                                    <p className="ml-2 text-md">
                                        {productsForCarousel.length === 1 ? 'Color disponible' : 'Colores disponibles'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    </CartProvider>
);
};

export default Modal;
