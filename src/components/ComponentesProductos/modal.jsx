import { useState, useEffect } from 'react';
import ModalMapa from "./modalMapa";
import { useCart } from '../CartContext';
import { CartProvider } from "../CartContext";
import { Link } from "react-router-dom";
import ShareButton from './ShareButton';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useNavigate, useLocation } from "react-router-dom";
import {
    defaultImageUrlModalProductos,
    mantenimientoImages,
    usoImages,
    marcasMap
} from '../../Constants/constants';

const Modal = ({ isOpen, close, product, alt }) => {
    const { addToCart } = useCart();

    // Producto actual y otros estados
    const [selectedProduct, setSelectedProduct] = useState(product);
    const [modalMapaOpen, setModalMapaOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(selectedProduct.ancho);
    const [quantity, setQuantity] = useState(1);
    // Productos relacionados
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productsForCarousel, setProductsForCarousel] = useState([]);
    const [anchoOptions, setAnchoOptions] = useState([]);
    const [selectedAncho, setSelectedAncho] = useState('');
    const IconoDestacables = ["FR", "OUTDOOR", "EASYCLEAN", "IMO"];
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    // Productos de la misma colección para navegación (únicos por nombre)
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [currentRecIndex, setCurrentRecIndex] = useState(0);

    // Estado para "TE PUEDE INTERESAR" – recomendado, sincronizado con la colección
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    // Estados para controlar el zoom mediante la ruleta en modo ampliado
    const [customZoom, setCustomZoom] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const handleWheel = (e) => {
        e.preventDefault();
        let newZoom = customZoom;
        if (e.deltaY < 0) {
            newZoom = Math.min(newZoom + 0.1, 3); // zoom máximo 3
        } else {
            newZoom = Math.max(newZoom - 0.1, 1); // zoom mínimo 1
        }
        setCustomZoom(newZoom);
    };

    // Estado para el popup de "Producto agregado al carrito"
    const [addedToCart, setAddedToCart] = useState(false);

    // Para mostrar el significado de iconos
    const [showIconMeaning, setShowIconMeaning] = useState('');

    // Sincronizamos el producto actual con la prop cuando la modal se abre.
    useEffect(() => {
        if (isOpen) {
            setSelectedProduct(product);
        }
    }, [product, isOpen]);

    const getNombreMarca = (codmarca) => {
        return marcasMap[codmarca] || "Marca Desconocida";
    };

    // Actualiza el producto actual al hacer clic en "Ver detalle" en "TE PUEDE INTERESAR"
    const handleDetailClick = (productItem) => {
        setSelectedProduct(productItem);
        window.scrollTo(0, 0);
    };

    // Carga la imagen principal del producto.
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

    // Carga productos relacionados (mismo nombre y familia)
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

    // Carga productos de la misma colección (incluye el actual) y elimina duplicados por nombre.
    useEffect(() => {
        if (!selectedProduct?.coleccion) return;

        const fetchCollectionProducts = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/codfamil/${selectedProduct.codfamil}`
                );
                const data = await response.json();

                // Filtrar por misma coleccion y excluir el producto actual
                const filtered = data.filter(
                    (p) =>
                        p.nombre &&
                        p.nombre.trim() !== "" &&
                        p.coleccion === selectedProduct.coleccion &&
                        p.codprodu !== selectedProduct.codprodu
                );

                // Quitar duplicados por nombre
                const uniqueByName = filtered.filter(
                    (p, index, self) => index === self.findIndex(q => q.nombre === p.nombre)
                );

                if (uniqueByName.length > 0) {
                    // Aquí hacemos el fetch de imágenes para cada producto
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
                                imageBuena: imageBuena
                                    ? `https://${imageBuena.ficadjunto}`
                                    : defaultImageUrlModalProductos,
                                imageBaja: imageBaja
                                    ? `https://${imageBaja.ficadjunto}`
                                    : defaultImageUrlModalProductos
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


    // Sincronizamos recommendedProducts con collectionProducts
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
        } catch (error) {
            console.error('Error fetching images for color product:', error);
        }
    };

    const handleClose = () => {
        close(); // Cierra la modal

        // Extraer los parámetros de la URL
        const searchParams = new URLSearchParams(location.search);

        // Si hay un productId en los parámetros, hacer navigate("/products")
        if (searchParams.has("productId")) {
            navigate("/products"); // Redirige a /products si hay productId en la URL
        }
    };

    // Navegación en la colección: botones "Anterior" y "Siguiente"
    const handlePrev = () => {
        if (collectionProducts.length === 0) return;
        const newIndex = (currentRecIndex - 1 + collectionProducts.length) % collectionProducts.length;
        setCurrentRecIndex(newIndex);
        setSelectedProduct(collectionProducts[newIndex]);
    };

    const handleNext = () => {
        if (collectionProducts.length === 0) return;
        const newIndex = (currentRecIndex + 1) % collectionProducts.length;
        setCurrentRecIndex(newIndex);
        setSelectedProduct(collectionProducts[newIndex]);
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

    const getMantenimientoImages = (mantenimiento) => {
        if (!mantenimiento) return null;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(mantenimiento, "text/xml");
        const valores = xmlDoc.getElementsByTagName("Valor");
        const mantenimientoList = Array.from(valores).map(node => node.textContent.trim());
        return (
            <div className="flex items-center space-x-2">
                {mantenimientoList
                    .filter((m) => mantenimientoImages[m])
                    .map((m, index) => (
                        <img
                            key={index}
                            src={mantenimientoImages[m]}
                            alt={m}
                            className="w-6 h-6 cursor-pointer"
                            title={`Click para ver el significado de ${m}`}
                            onClick={() => setShowIconMeaning(m)}
                        />
                    ))}
            </div>
        );
    };

    const getUsoImages = (usos) => {
        if (!usos) return null;
        const usoList = usos.split(';').map((u) => u.trim());
        return (
            <div className="flex items-center space-x-2">
                {usoList.map((uso, index) => (
                    usoImages[uso] && (
                        <img
                            key={index}
                            src={usoImages[uso]}
                            alt={uso}
                            className="w-6 h-6 cursor-pointer"
                            title={`Click para ver el significado de ${uso}`}
                            onClick={() => setShowIconMeaning(uso)}
                        />
                    )
                ))}
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

    if (!isOpen) return null;

    return (
        <CartProvider>
            <div
                className="fixed inset-0 z-30 bg-white overflow-y-auto 4xl:pt-[3%] 3xl:pt-[4%] xl:pt-[6%] lg:pt-[12%] md:pt-[10%] md:pb-[5%] sm:pt-[15%] pt-[24%]"
            >
                <div
                    className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-[-15px] right-4 md:right-4 md:top-4 text-black font-bold text-xl hover:opacity-70"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/POP%20UP/undo_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="" />
                    </button>

                    {/* Encabezado: Imagen Izq + Info Der */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2" onMouseEnter={() => { }} onMouseLeave={() => { }}>
                            {/* Se utiliza InnerImageZoom para el efecto hover y se envuelve en Zoom para abrir el modal al hacer clic */}
                            <Zoom>
                                <InnerImageZoom
                                    src={selectedImage}
                                    zoomSrc={selectedImage}
                                    alt={alt}
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </Zoom>
                        </div>

                        <div className="md:w-1/2 flex flex-col justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold mb-1">
                                    {selectedProduct?.nombre || 'Nombre del producto'}
                                </h1>
                                {selectedProduct?.tonalidad && (
                                    <p className="text-gray-600 text-sm mb-2">
                                        <strong></strong>
                                        {selectedProduct.tonalidad}
                                    </p>
                                )}
                                <p className="text-gray-600 text-sm mb-2">
                                    Colección: {selectedProduct?.coleccion} &nbsp;|&nbsp;
                                    Marca: {getNombreMarca(selectedProduct?.codmarca)}
                                </p>

                                {/* Contenedor principal */}
                                <div className="flex flex-col space-y-3 my-4 w-full max-w-sm">
                                    <ShareButton selectedProduct={selectedProduct} />
                                    {/* Fila: Etiqueta + “Muestra pequeña” + Info */}
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                                            Elige la cantidad
                                        </label>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-1">Muestra pequeña</span>

                                        </div>
                                    </div>

                                    {/* Fila: Select de cantidad + Precio */}
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
                                        {/* Precio */}
                                        <p className="text-gray-800 font-bold text-lg">
                                            3€
                                        </p>
                                    </div>

                                    {/* Botón principal */}
                                    <div className=' flex'>
                                        {/* <button
                                            onClick={handleAddToCart}
                                            className="relative group w-20 h-20 bg-white overflow-hidden hover:bg-black transition-colors duration-300"
                                            title="Pedir muestra"
                                        >

                                            <img
                                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/QUALITY/fabric.png"
                                                alt="Muestra"
                                                className=" mx-auto object-contain w-[80%] h-[80%] 
                                            group-hover:opacity-0 transition-opacity duration-300"
                                            />

                                            
                                            <span
                                                className="absolute inset-0 flex items-center justify-center text-white
                                        font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            >
                                                PEDIR YA
                                            </span>
                                        </button> */}
                                        <button
                                            onClick={handleAddToCart}
                                            className="relative group w-20 h-20 bg-white overflow-hidden hover:bg-black transition-colors duration-300"
                                            title="Pedir muestra"
                                        >

                                            <img
                                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/QUALITY/fabric.png"
                                                alt="Muestra"
                                                className=" mx-auto object-contain w-[80%] h-[80%] 
                                            group-hover:opacity-0 transition-opacity duration-300"
                                            />


                                            <span
                                                className="absolute inset-0 flex items-center justify-center text-white
                                        font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            >
                                                AÑADIR AL CARRO
                                            </span>
                                        </button>
                                    </div>
                                </div>



                            </div>

                            {/* Botones para navegar en la colección
                            {collectionProducts.length > 1 && (
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handlePrev}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mb-2"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )} */}

                            {/* Se muestra la sección de tonalidades (si aplica) */}
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
                                                {productsForCarousel.length === 1
                                                    ? "Color disponible"
                                                    : "Colores disponibles"}
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
                    <h2 className="text-xl font-semibold mb-4">
                        FICHA TÉCNICA
                    </h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">Usos:</span> {getUsoImages(selectedProduct?.uso)}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">Cares:</span> {getMantenimientoImages(selectedProduct?.mantenimiento)}
                            </div>
                            <div>
                                <span className="font-medium">Color:</span> {selectedProduct.colorprincipal}
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
                                {selectedProduct.repminhor
                                    ? parseFloat(selectedProduct.repminhor).toFixed(2)
                                    : "N/A"}{" "}
                                cm
                            </div>
                            <div>
                                <span className="font-medium">Rapport Vertical:</span>{" "}
                                {selectedProduct.repminver
                                    ? parseFloat(selectedProduct.repminver).toFixed(2)
                                    : "N/A"}{" "}
                                cm
                            </div>
                            <div>
                                <span className="font-medium">Composición:</span> {selectedProduct?.composicion || "N/A"}
                            </div>
                            <div>
                                <span className="font-medium">Peso:</span>{" "}
                                {selectedProduct?.gramaje ? `${selectedProduct.gramaje} gms` : "N/A"}
                            </div>
                            <div>
                                <span className="font-medium">Ancho Tela:</span>{" "}
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
                    </div>

                    {/* OTROS DISEÑOS DE TELAS */}
                    {recommendedProducts.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                                TE PUEDE INTERESAR
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {recommendedProducts.slice(0, 4).map((item) => (
                                    <div
                                        onClick={() => handleDetailClick(item)}
                                        key={item.codprodu}
                                        className="border border-gray-200 rounded-lg p-3 flex flex-col items-center text-center hover:shadow-md transition"
                                    >
                                        <img
                                            src={item.imageBaja}
                                            alt={item.nombre}
                                            className="object-cover w-full h-50 rounded-md mb-3"
                                        />
                                        <h3 className="font-semibold text-gray-700">
                                            {item.nombre}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                            <button
                                className="text-blue-500 mt-2"
                                onClick={() => setShowIconMeaning('')}
                            >
                                Cerrar
                            </button>
                        </div>
                    )}

                    {modalMapaOpen && (
                        <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />
                    )}
                </div>
            </div>
        </CartProvider >
    );
};

export default Modal;
