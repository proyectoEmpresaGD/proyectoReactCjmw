import {
    cdnUrl,
} from "../Constants/cdn";


const collectionPreviewCache =
    new Map();


export const normalizeCollectionName = (
    value = ""
) =>
    String(
        value
    )
        .trim()
        .toUpperCase();


export async function fetchCollectionPreviewsByBrand({
    brand,
    signal,
} = {}) {
    if (
        !brand
    ) {
        return {};
    }


    if (
        collectionPreviewCache.has(
            brand
        )
    ) {
        return collectionPreviewCache.get(
            brand
        );
    }


    const response =
        await fetch(
            `${import.meta.env
                .VITE_API_BASE_URL
            }/api/collections/previews/${encodeURIComponent(
                brand
            )}`,
            {
                signal,
            }
        );


    if (
        !response.ok
    ) {
        throw new Error(
            `Error ${response.status} al cargar previews de ${brand}`
        );
    }


    const data =
        await response.json();


    const previews =
        Object.fromEntries(
            Object.entries(
                data?.collections ||
                {}
            ).map(
                ([
                    collectionName,
                    imageUrl,
                ]) => [
                        normalizeCollectionName(
                            collectionName
                        ),
                        typeof imageUrl ===
                            "string" &&
                            imageUrl.trim()
                            ? cdnUrl(
                                imageUrl.trim()
                            )
                            : null,
                    ]
            )
        );


    collectionPreviewCache.set(
        brand,
        previews
    );


    return previews;
}