import ModalMapa from "./modalMapa";
import { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { useCart } from '../CartContext';
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { CartProvider } from "../CartContext"; // Importa CartProvider correctamente

const Modal = ({ isOpen, close, product, alt }) => {
    const { addToCart } = useCart();
    const [modalMapaOpen, setModalMapaOpen] = useState(false); // Estado para controlar la apertura de ModalMapa
    const [imageLoaded, setImageLoaded] = useState(false); // Estado para controlar la carga de la imagen
    const [selectedImage, setSelectedImage] = useState(product.urlimagen); // Estado para la imagen seleccionada
    const [selectedName, setSelectedName] = useState(product.desprodu);
    const [selectedCod, setSelectedCod] = useState(product.codprodu); // Estado para el nombre del producto seleccionado
    const [selectedProduct, setSelectedProduct] = useState(product); // Estado para el producto seleccionado
    const [relatedProducts, setRelatedProducts] = useState([]); // Estado para los productos relacionados
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const [zoomFactor, setZoomFactor] = useState(2); // Factor de zoom

    useEffect(() => {
        // Fetch related products by codfamil
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${product.codfamil}`);
                const data = await response.json();
                setRelatedProducts(data);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [product.codfamil]);

    const handleMapClick = () => {
        setModalMapaOpen(true); // Abre ModalMapa cuando se cliquea el botón
    };

    const handleImageLoad = () => {
        setImageLoaded(true); // Marca la imagen como cargada

        // Ajusta el factor de zoom según el tamaño de la imagen
        const img = lensRef.current.previousSibling;
        const { width, height } = img;
        const factor = Math.max(2, (width > 300 || height > 300) ? 2 : 3);
        setZoomFactor(factor);
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

        result.style.backgroundPosition = `-${boundedPosX * zoomFactor}px -${boundedPosY * zoomFactor}px`;
    };

    const handleColorClick = (colorProduct) => {
        setSelectedImage(colorProduct.urlimagen);
        setSelectedName(colorProduct.desprodu);
        setSelectedCod(colorProduct.codprodu);
        setSelectedProduct(colorProduct); // Actualiza el producto seleccionado
        setImageLoaded(false); // Reset image loaded state to show lens only after image is loaded
    };

    // Configuración del carrusel

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
            price: 3, // Precio fijo por ahora
            image: selectedProduct.urlimagen,
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

    // Si `isOpen` es falso, no se muestra nada
    if (!isOpen) return null;

    return (
        <CartProvider>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
            <div className="bg-white p-7 lg:mt-[5%] xl:mt-[5%] md:mt-[5%] mt-[30%] rounded-lg xl:max-w-4xl w-full md:max-w-3xl m-4 h-auto overflow-auto shadow-lg relative max-h-[80vh]">
                <div className="flex justify-end absolute top-4 right-4">
                    <button className="relative " onClick={close}>
                        <img src="/close.svg" className='w-8 h-8 hover:scale-125 duration-200' alt="Close" />
                    </button>
                </div>
                <h2 className="text-center text-3xl font-semibold mb-4 text-gray-800 mt-12 md:mt-0">{selectedName}</h2>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3" onClick={e => e.stopPropagation()}>
                    {/* Columna del contenido */}
                    <div className="relative group w-full h-64 md:h-96">
                        <img
                            src={selectedImage}
                            alt={alt}
                            className="w-full h-full object-contain rounded-md"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            onMouseMove={moveLens}
                        />
                        {imageLoaded && (
                            <>
                                <div
                                    ref={lensRef}
                                    className="absolute hidden group-hover:block w-24 h-24 border border-gray-300 opacity-50 bg-white pointer-events-none rounded-full"
                                ></div>
                                <div
                                    ref={resultRef}
                                    className="absolute hidden group-hover:block top-0 left-0 w-full h-full bg-white bg-cover pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${selectedImage})`,
                                        backgroundSize: `${zoomFactor * 136}%`,
                                        borderRadius: '0.5rem'
                                    }}
                                >

                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col justify-between p-4 mx-auto">
                        <h1 className="font-bold text-black mx-auto">Descripción</h1>
                        <div className=" grid grid-cols-3 grid-rows-4 justify-center gap-10">
                            <p>Marca</p>
                            <p>Coleccion</p>
                            <p>Color principal</p>
                            <p className=" rounded-[100%] bg-slate-500"> </p>
                            <p>Tipo</p>
                            <p>Estilo</p>
                            <p>Martindale</p>

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
                                    src={colorProduct.imagepreview}
                                    alt={colorProduct.desprodu}
                                    className="w-full h-16 object-cover rounded-full cursor-pointer"
                                    onClick={() => handleColorClick(colorProduct)}
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
}

export default Modal;