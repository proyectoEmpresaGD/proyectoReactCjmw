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


    const openBrand =
        useCallback(
            brand => {
                const resolvedBrand =
                    brand ||
                    activeBrand;


                if (
                    !resolvedBrand?.route
                ) {
                    return;
                }


                navigate(
                    resolvedBrand.route
                );
            },
            [
                navigate,
                activeBrand,
            ]
        );


    const openCollections =
        useCallback(
            brand => {
                const resolvedBrand =
                    brand ||
                    activeBrand;


                const route =
                    resolvedBrand
                        ?.collectionsRoute ||
                    "/colecciones";


                navigate(
                    route
                );
            },
            [
                navigate,
                activeBrand,
            ]
        );


    return {
        brands,

        activeBrand,

        activeIndex,

        selectBrand,

        openBrand,

        openCollections,
    };
}
