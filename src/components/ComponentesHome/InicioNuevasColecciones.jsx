import MarcaLogo from "./MarcaLogo";
import {
    useState,
} from "react";

import {
    useTranslation,
} from "react-i18next";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
} from "lucide-react";

import Modal
    from "../ComponentesProductos/modal";

import useHomeNewCollectionsController
    from "./controllers/useHomeNewCollectionsController";


export default function HomeNewCollections({
    collections,
    onOpenCollection,
    onOpenAllCollections,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    const {
        activeCollection,
        activeIndex,
        products,
        loadingProducts,
        previousCollection,
        nextCollection,
    } =
        useHomeNewCollectionsController(
            collections
        );


    const [
        selectedProduct,
        setSelectedProduct,
    ] = useState(
        null
    );


    const [
        productModalOpen,
        setProductModalOpen,
    ] = useState(
        false
    );


    const openProductModal =
        product => {
            if (
                !product
            ) {
                return;
            }


            setSelectedProduct(
                product
            );

            setProductModalOpen(
                true
            );
        };


    const closeProductModal =
        () => {
            setProductModalOpen(
                false
            );

            setSelectedProduct(
                null
            );
        };


    if (
        !activeCollection
    ) {
        return null;
    }


    return (
        <>
            <section
                className="
                    bg-[#f5f0ea]
                    px-5
                    py-16

                    sm:px-8

                    lg:px-12
                    lg:py-24

                    xl:px-16
                "
            >
                <div
                    className="
                        mx-auto
                        max-w-[1500px]
                    "
                >
                    <header
                        className="
                            mb-10
                            flex
                            items-end
                            justify-between
                            gap-6

                            lg:mb-12
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-[#8a603d]
                                "
                            >
                                {t(
                                    "collections.kicker"
                                )}
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-4xl
                                    font-light
                                    leading-none
                                    tracking-[-0.045em]
                                    text-stone-950

                                    sm:text-5xl

                                    lg:text-6xl
                                "
                            >
                                {t(
                                    "collections.titleLine1"
                                )}{" "}
                                {t(
                                    "collections.titleLine2"
                                )}
                            </h2>
                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <NavigationButton
                                label="Colección anterior"
                                onClick={
                                    previousCollection
                                }
                            >
                                <ArrowLeft
                                    className="
                                        h-4
                                        w-4
                                    "
                                />
                            </NavigationButton>


                            <NavigationButton
                                label="Colección siguiente"
                                onClick={
                                    nextCollection
                                }
                            >
                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                    "
                                />
                            </NavigationButton>
                        </div>
                    </header>


                    <AnimatePresence
                        mode="wait"
                    >
                        <motion.div
                            key={
                                activeCollection.key ||
                                activeCollection.name
                            }
                            initial={{
                                opacity:
                                    0,

                                x:
                                    18,
                            }}
                            animate={{
                                opacity:
                                    1,

                                x:
                                    0,
                            }}
                            exit={{
                                opacity:
                                    0,

                                x:
                                    -18,
                            }}
                            transition={{
                                duration:
                                    0.35,

                                ease:
                                    "easeOut",
                            }}
                            className="
                                grid
                                gap-5

                                lg:grid-cols-12
                                lg:gap-6
                            "
                        >
                            <FeaturedCollection
                                collection={
                                    activeCollection
                                }
                                activeIndex={
                                    activeIndex
                                }
                                total={
                                    collections.length
                                }
                                onOpen={() =>
                                    onOpenCollection(
                                        activeCollection
                                    )
                                }
                            />


                            <ProductsColumn
                                products={
                                    products
                                }
                                loading={
                                    loadingProducts
                                }
                                collectionName={
                                    activeCollection.name
                                }
                                onOpenProduct={
                                    openProductModal
                                }
                            />
                        </motion.div>
                    </AnimatePresence>


                    <div
                        className="
                            mt-7
                            flex
                            justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onOpenAllCollections
                            }
                            className="
                                group
                                inline-flex
                                items-center
                                gap-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.16em]
                                text-stone-700
                            "
                        >
                            {t(
                                "collections.viewAll"
                            )}

                            <ArrowRight
                                className="
                                    h-4
                                    w-4
                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                            />
                        </button>
                    </div>
                </div>
            </section>


            {selectedProduct && (
                <Modal
                    isOpen={
                        productModalOpen
                    }
                    close={
                        closeProductModal
                    }
                    product={
                        selectedProduct
                    }
                />
            )}
        </>
    );
}


function FeaturedCollection({
    collection,
    activeIndex,
    total,
    onOpen,
}) {
    return (
        <article
            className="
                overflow-hidden
                rounded-[28px]
                bg-[#fffaf6]
                p-5

                sm:p-7

                lg:col-span-7
                lg:p-9
            "
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-6
                "
            >
                <div>
                    <div className="flex min-h-9 items-center">
                        <MarcaLogo brand={collection.brand} className="w-[135px] max-h-10" />
                    </div>


                    <button
                        type="button"
                        onClick={
                            onOpen
                        }
                        className="
                            group
                            mt-4
                            flex
                            items-center
                            gap-3
                            text-left
                        "
                    >
                        <h3
                            className="
                                text-2xl
                                font-light
                                leading-tight
                                tracking-[-0.035em]
                                text-stone-950

                                sm:text-3xl

                                xl:text-4xl
                            "
                        >
                            {
                                collection.name
                            }
                        </h3>


                        <ArrowUpRight
                            className="
                                h-5
                                w-5
                                opacity-0
                                transition-opacity

                                group-hover:opacity-100
                            "
                        />
                    </button>
                </div>
            </div>


            <button
                type="button"
                onClick={
                    onOpen
                }
                className="
                    group
                    mt-7
                    block
                    w-full
                    overflow-hidden
                    rounded-[20px]
                    bg-stone-100
                    text-left
                "
            >
                <div
                    className="
                        aspect-[16/10]
                        overflow-hidden

                        sm:aspect-[16/9]

                        lg:aspect-[16/10]
                    "
                >
                    <img
                        src={
                            collection.image
                        }
                        alt={
                            collection.name
                        }
                        loading="lazy"
                        decoding="async"
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            ease-out

                            group-hover:scale-[1.025]
                        "
                    />
                </div>
            </button>


            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    gap-5
                "
            >
                <p
                    className="
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-stone-400
                    "
                >
                    Nueva colección
                </p>


                <button
                    type="button"
                    onClick={
                        onOpen
                    }
                    className="
                        group
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-stone-800
                    "
                >
                    Ver colección

                    <ArrowUpRight
                        className="
                            h-3.5
                            w-3.5
                            transition-transform

                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                        "
                    />
                </button>
            </div>
        </article>
    );
}


function ProductsColumn({
    products,
    loading,
    collectionName,
    onOpenProduct,
}) {
    return (
        <aside
            className="
                lg:col-span-5
            "
        >
            {loading ? (
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3

                        sm:gap-4
                    "
                >
                    {Array.from({
                        length:
                            6,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <ProductSkeleton
                                key={
                                    index
                                }
                            />
                        )
                    )}
                </div>
            ) : products.length >
                0 ? (
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3

                        sm:gap-4
                    "
                >
                    {products.map(
                        product => (
                            <ProductCard
                                key={
                                    product.codprodu ||
                                    product.id ||
                                    `${product.nombre}-${product.tonalidad}`
                                }
                                product={
                                    product
                                }
                                onClick={() =>
                                    onOpenProduct(
                                        product
                                    )
                                }
                            />
                        )
                    )}
                </div>
            ) : (
                <div
                    className="
                        flex
                        min-h-[320px]
                        items-center
                        justify-center
                        rounded-[24px]
                        bg-[#fffaf6]
                        px-8
                        text-center
                    "
                >
                    <div>
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-[#8a603d]
                            "
                        >
                            {
                                collectionName
                            }
                        </p>


                        <p
                            className="
                                mt-4
                                text-sm
                                leading-6
                                text-stone-500
                            "
                        >
                            No hay productos disponibles actualmente para esta colección.
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}


function ProductCard({
    product,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-[20px]
                border
                border-stone-200/70
                bg-[#fffaf6]
                text-left
                shadow-[0_10px_30px_-24px_rgba(28,25,23,0.28)]
                transition-all
                duration-500

                hover:-translate-y-1
                hover:border-stone-300
                hover:shadow-[0_22px_55px_-32px_rgba(28,25,23,0.45)]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-stone-700
                focus-visible:ring-offset-2
            "
        >
            <div
                className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    bg-stone-100
                "
            >
                <img
                    src={
                        product.image
                    }
                    alt={
                        product.nombre
                    }
                    loading="lazy"
                    decoding="async"
                    onError={
                        event => {
                            event.currentTarget.src =
                                "/img/default.webp";
                        }
                    }
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out

                        group-hover:scale-[1.06]
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-stone-950/25
                        via-transparent
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-500

                        group-hover:opacity-100
                    "
                />


                <span
                    className="
                        absolute
                        left-2.5
                        top-2.5
                        rounded-full
                        bg-[#fffaf6]/95
                        px-2.5
                        py-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#8a603d]
                        shadow-sm
                        backdrop-blur-sm
                    "
                >
                    Tejido
                </span>


                <span
                    className="
                        absolute
                        right-2.5
                        top-2.5
                        flex
                        h-8
                        w-8
                        translate-y-1
                        items-center
                        justify-center
                        rounded-full
                        bg-stone-950
                        text-white
                        opacity-0
                        shadow-md
                        transition-all
                        duration-300

                        group-hover:translate-y-0
                        group-hover:opacity-100
                    "
                >
                    <ArrowUpRight
                        className="
                            h-3.5
                            w-3.5
                        "
                    />
                </span>
            </div>


            <div
                className="
                    p-3.5

                    sm:p-4
                "
            >
                <h4
                    className="
                        truncate
                        text-sm
                        font-medium
                        leading-tight
                        tracking-[-0.02em]
                        text-stone-950

                        sm:text-[15px]
                    "
                >
                    {
                        product.nombre
                    }
                </h4>


                <div
                    className="
                        mt-2
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    {product.tonalidad ? (
                        <p
                            className="
                                min-w-0
                                truncate
                                text-[10px]
                                text-stone-500
                            "
                        >
                            {
                                product.tonalidad
                            }
                        </p>
                    ) : (
                        <span />
                    )}


                    {product.codprodu && (
                        <span
                            className="
                                shrink-0
                                text-[8px]
                                uppercase
                                tracking-[0.12em]
                                text-stone-400
                            "
                        >
                            {
                                product.codprodu
                            }
                        </span>
                    )}
                </div>


                <div
                    className="
                        mt-3
                        h-px
                        w-full
                        bg-stone-200
                    "
                />


                <div
                    className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <span
                        className="
                            truncate
                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-stone-400
                            transition-colors

                            group-hover:text-[#8a603d]

                            sm:text-[8px]
                        "
                    >
                        Ver producto
                    </span>


                    <ArrowUpRight
                        className="
                            h-3
                            w-3
                            shrink-0
                            text-stone-400
                            transition-all
                            duration-300

                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            group-hover:text-stone-950
                        "
                    />
                </div>
            </div>
        </button>
    );
}


function ProductSkeleton() {
    return (
        <div
            className="
                overflow-hidden
                rounded-[20px]
                border
                border-stone-200/70
                bg-[#fffaf6]
            "
        >
            <div
                className="
                    aspect-[4/3]
                    animate-pulse
                    bg-stone-200
                "
            />


            <div
                className="
                    p-3.5

                    sm:p-4
                "
            >
                <div
                    className="
                        h-3
                        w-3/4
                        animate-pulse
                        rounded-full
                        bg-stone-200
                    "
                />


                <div
                    className="
                        mt-3
                        h-2
                        w-1/2
                        animate-pulse
                        rounded-full
                        bg-stone-200
                    "
                />


                <div
                    className="
                        mt-4
                        h-px
                        bg-stone-200
                    "
                />


                <div
                    className="
                        mt-3
                        h-2
                        w-1/3
                        animate-pulse
                        rounded-full
                        bg-stone-200
                    "
                />
            </div>
        </div>
    );
}


function NavigationButton({
    children,
    label,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            aria-label={
                label
            }
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-stone-200
                bg-[#fffaf6]
                text-stone-950
                transition-all
                duration-300

                hover:border-stone-950
                hover:bg-stone-950
                hover:text-white

                sm:h-11
                sm:w-11
            "
        >
            {
                children
            }
        </button>
    );
}