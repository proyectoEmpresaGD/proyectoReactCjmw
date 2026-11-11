import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    searchRecommendedCollections,
} from "../../../Constants/constants";

import {
    fetchCollectionImages,
} from "../../../Constants/collectionsClient";


const BRAND_NAMES = {
    ARE: "ARENA",
    HAR: "HARBOUR",
    FLA: "FLAMENCO",
    BAS: "BASSARI",
    CJM: "CJM",
};


const HOME_MOODBOARDS_LIMIT =
    3;


const getHomeRecommendedCollections =
    () => {
        const recommendedCollections =
            Array.isArray(
                searchRecommendedCollections
            )
                ? searchRecommendedCollections
                : [];


        const selectedBrands =
            new Set();


        return recommendedCollections
            .filter(
                item => {
                    if (
                        !item?.brand ||
                        !item?.collection ||
                        selectedBrands.has(
                            item.brand
                        )
                    ) {
                        return false;
                    }


                    selectedBrands.add(
                        item.brand
                    );


                    return true;
                }
            )
            .slice(
                0,
                HOME_MOODBOARDS_LIMIT
            );
    };


export default function useHomeMoodboardsController() {
    const recommendedCollections =
        useMemo(
            getHomeRecommendedCollections,
            []
        );


    const [
        moodboards,
        setMoodboards,
    ] = useState(
        []
    );


    useEffect(
        () => {
            const controller =
                new AbortController();


            const loadMoodboards =
                async () => {
                    const results =
                        await Promise.allSettled(
                            recommendedCollections.map(
                                async item => {
                                    const images =
                                        await fetchCollectionImages({
                                            marca:
                                                item.brand,

                                            coleccion:
                                                item.collection,

                                            signal:
                                                controller.signal,
                                        });


                                    const image =
                                        images.find(
                                            imageUrl =>
                                                typeof imageUrl ===
                                                "string" &&
                                                imageUrl.trim()
                                        );


                                    if (
                                        !image
                                    ) {
                                        return null;
                                    }


                                    return {
                                        key:
                                            `${item.brand}-${item.collection}`,

                                        eyebrow:
                                            BRAND_NAMES[
                                            item.brand
                                            ] ||
                                            item.brand,

                                        title:
                                            item.collection,

                                        image,

                                        route:
                                            `/coleccion/${encodeURIComponent(
                                                item.collection
                                            )}`,
                                    };
                                }
                            )
                        );


                    if (
                        controller.signal.aborted
                    ) {
                        return;
                    }


                    const validMoodboards =
                        results
                            .filter(
                                result =>
                                    result.status ===
                                    "fulfilled"
                            )
                            .map(
                                result =>
                                    result.value
                            )
                            .filter(
                                Boolean
                            );


                    setMoodboards(
                        validMoodboards
                    );
                };


            loadMoodboards();


            return () => {
                controller.abort();
            };
        },
        [
            recommendedCollections,
        ]
    );


    return moodboards;
}