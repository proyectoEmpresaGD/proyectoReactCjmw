import {
    lazy,
    Suspense,
} from "react";

import {
    Header,
} from "../components/header";

import Footer
    from "../components/footer";

import {
    CartProvider,
} from "../components/CartContext.jsx";

import InicioCarruselMarcas
    from "../components/ComponentesHome/InicioCarruselMarcas.jsx";

import InicioPresentacionGrupo
    from "../components/ComponentesHome/InicioPresentacionGrupo.jsx";

import DeferredSection
    from "../components/ComponentesHome/DeferredSection";

import useHomeBrandsController
    from "../components/ComponentesHome/controllers/useHomeBrandsController";

import useHomeViewport
    from "../components/ComponentesHome/controllers/useHomeViewport";


const InicioMovilLegacy =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioMovilLegacy.jsx"
            )
    );


const InicioNuevasColecciones =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioNuevasColecciones.jsx"
            )
    );


const InicioExplorarAmbientes =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioExplorarAmbientes.jsx"
            )
    );


const InicioMaterialesTexturas =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioMaterialesTexturas.jsx"
            )
    );


const InicioInspiracionColecciones =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioInspiracionColecciones.jsx"
            )
    );


const InicioCierreVisual =
    lazy(
        () =>
            import(
                "../components/ComponentesHome/InicioCierreVisual.jsx"
            )
    );


export default function Home() {
    const {
        isMobileHome,
    } =
        useHomeViewport();


    const {
        brands,

        newCollections,

        groupPillars,

        spaces,

        materials,

        moodboards,

        closingVisual,

        activeBrand,

        activeIndex,

        selectBrand,

        openBrand,

        openCollections,

        openCollection,

        openAllCollections,

        openProducts,

        openRoute,

        openFilteredCollections,
    } =
        useHomeBrandsController();


    return (
        <CartProvider>
            <Header />


            {isMobileHome ? (
                <Suspense
                    fallback={
                        <div
                            className="
                                min-h-screen
                                bg-stone-950
                            "
                        />
                    }
                >
                    <InicioMovilLegacy />
                </Suspense>
            ) : (
                <>
                    <main
                        className="
                            min-h-screen
                            bg-[#f7f5f1]
                        "
                    >
                        {/* 01 · CARRUSEL DE MARCAS */}
                        <InicioCarruselMarcas
                            brands={
                                brands
                            }
                            activeBrand={
                                activeBrand
                            }
                            activeIndex={
                                activeIndex
                            }
                            onSelectBrand={
                                selectBrand
                            }
                            onOpenBrand={
                                openBrand
                            }
                            onOpenCollections={
                                openCollections
                            }
                        />


                        {/* 02 · PRESENTACIÓN CJM GROUP */}
                        <InicioPresentacionGrupo
                            pillars={
                                groupPillars
                            }
                        />


                        {/* 03 · NUEVAS COLECCIONES */}
                        <DeferredSection
                            minHeight="900px"
                        >
                            <Suspense
                                fallback={
                                    null
                                }
                            >
                                <InicioNuevasColecciones
                                    collections={
                                        newCollections
                                    }
                                    onOpenCollection={
                                        openCollection
                                    }
                                    onOpenAllCollections={
                                        openAllCollections
                                    }
                                />
                            </Suspense>
                        </DeferredSection>


                        {/* 04 · EXPLORAR POR AMBIENTES
                        <DeferredSection
                            minHeight="850px"
                        >
                            <Suspense
                                fallback={
                                    null
                                }
                            >
                                <InicioExplorarAmbientes
                                    spaces={
                                        spaces
                                    }
                                    onOpenRoute={
                                        openRoute
                                    }
                                />
                            </Suspense>
                        </DeferredSection>
                        */}


                        {/* 05 · MATERIALES Y TEXTURAS */}
                        <DeferredSection
                            minHeight="800px"
                        >
                            <Suspense
                                fallback={
                                    null
                                }
                            >
                                <InicioMaterialesTexturas
                                    materials={
                                        materials
                                    }
                                    onOpenProducts={
                                        openProducts
                                    }
                                />
                            </Suspense>
                        </DeferredSection>


                        {/* 06 · INSPIRACIÓN DE COLECCIONES */}
                        <DeferredSection
                            minHeight="850px"
                        >
                            <Suspense
                                fallback={
                                    null
                                }
                            >
                                <InicioInspiracionColecciones
                                    moodboards={
                                        moodboards
                                    }
                                    onOpenCollections={
                                        openFilteredCollections
                                    }
                                />
                            </Suspense>
                        </DeferredSection>


                        {/* 07 · CIERRE VISUAL */}
                        <DeferredSection
                            minHeight="750px"
                        >
                            <Suspense
                                fallback={
                                    null
                                }
                            >
                                <InicioCierreVisual
                                    content={
                                        closingVisual
                                    }
                                    onOpenCollections={
                                        openAllCollections
                                    }
                                />
                            </Suspense>
                        </DeferredSection>
                    </main>


                    <Footer />
                </>
            )}
        </CartProvider>
    );
}