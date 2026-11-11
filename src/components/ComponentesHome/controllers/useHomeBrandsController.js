import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    homePresentationBrands,
} from "../../../data/homePresentationConfig";

import {
    homeNewCollections,
} from "../../../data/homeCollections";

import {
    homeClosingVisual,
    homeGroupPillars,
    homeInspiracion,
    homeMaterials,
    homeSpaces,
} from "../../../data/homeEditorialContent";


export default function useHomeBrandsController() {
    const navigate =
        useNavigate();


    const brands =
        homePresentationBrands;


    const [
        activeBrandKey,
        setActiveBrandKey,
    ] = useState(
        brands[0]?.key ||
        ""
    );


    const activeIndex =
        useMemo(
            () => {
                const index =
                    brands.findIndex(
                        brand =>
                            brand.key ===
                            activeBrandKey
                    );


                return index >= 0
                    ? index
                    : 0;
            },
            [
                brands,
                activeBrandKey,
            ]
        );


    const activeBrand =
        brands[
        activeIndex
        ] ||
        brands[0] ||
        null;


    useEffect(
        () => {
            brands.forEach(
                brand => {
                    if (
                        !brand.background
                    ) {
                        return;
                    }


                    const image =
                        new Image();

                    image.src =
                        brand.background;
                }
            );
        },
        [
            brands,
        ]
    );

    const openFilteredCollections =
        useCallback(
            collections => {
                if (
                    !Array.isArray(collections) ||
                    collections.length === 0
                ) {
                    return;
                }

                const params =
                    new URLSearchParams();

                collections.forEach(
                    collection => {
                        const collectionName =
                            typeof collection === "string"
                                ? collection.trim()
                                : collection?.name?.trim();

                        if (!collectionName) {
                            return;
                        }

                        params.append(
                            "collection",
                            collectionName
                        );
                    }
                );

                params.set(
                    "page",
                    "1"
                );

                navigate(
                    `/products?${params.toString()}`
                );
            },
            [
                navigate,
            ]
        );


    const selectBrand =
        useCallback(
            brandKey => {
                const exists =
                    brands.some(
                        brand =>
                            brand.key ===
                            brandKey
                    );


                if (
                    !exists
                ) {
                    return;
                }


                setActiveBrandKey(
                    brandKey
                );
            },
            [
                brands,
            ]
        );


    const openRoute =
        useCallback(
            route => {
                if (
                    !route
                ) {
                    return;
                }


                navigate(
                    route
                );
            },
            [
                navigate,
            ]
        );


    const openBrand =
        useCallback(
            brand => {
                const resolvedBrand =
                    brand ||
                    activeBrand;


                openRoute(
                    resolvedBrand?.route
                );
            },
            [
                activeBrand,
                openRoute,
            ]
        );


    const openCollections =
        useCallback(
            brand => {
                const resolvedBrand =
                    brand ||
                    activeBrand;


                openRoute(
                    resolvedBrand
                        ?.collectionsRoute ||
                    "/colecciones"
                );
            },
            [
                activeBrand,
                openRoute,
            ]
        );


    const openCollection =
        useCallback(
            collection => {
                const collectionName =
                    typeof collection ===
                        "string"
                        ? collection
                        : collection?.name;


                if (
                    !collectionName
                ) {
                    return;
                }


                navigate(
                    `/coleccion/${encodeURIComponent(
                        collectionName
                    )}`
                );
            },
            [
                navigate,
            ]
        );


    const openAllCollections =
        useCallback(
            () => {
                openRoute(
                    "/colecciones"
                );
            },
            [
                openRoute,
            ]
        );


    const openProducts =
        useCallback(
            () => {
                openRoute(
                    "/products"
                );
            },
            [
                openRoute,
            ]
        );


    return {
        brands,

        newCollections:
            homeNewCollections,

        groupPillars:
            homeGroupPillars,

        spaces:
            homeSpaces,

        materials:
            homeMaterials,

        moodboards:
            homeInspiracion,

        closingVisual:
            homeClosingVisual,

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
    };
}