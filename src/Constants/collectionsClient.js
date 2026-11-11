const toQuery = (
    params = {}
) => {
    const searchParams =
        new URLSearchParams();


    Object.entries(
        params
    ).forEach(
        ([
            key,
            value,
        ]) => {
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return;
            }


            searchParams.set(
                key,
                String(
                    value
                )
            );
        }
    );


    return searchParams.toString();
};


const getApiUrl = (
    path
) => {
    const baseUrl =
        import.meta.env
            .VITE_API_BASE_URL ||
        "";


    return `${baseUrl}${path}`;
};


export async function fetchCollectionImages({
    marca,
    coleccion,
    key,
    signal,
} = {}) {
    if (
        !marca ||
        (
            !coleccion &&
            !key
        )
    ) {
        throw new Error(
            'fetchCollectionImages: falta "marca" y "coleccion" o "key".'
        );
    }


    const query =
        toQuery({
            marca,
            coleccion,
            key,
        });


    const response =
        await fetch(
            getApiUrl(
                `/api/collections/images?${query}`
            ),
            {
                signal,
            }
        );


    if (
        !response.ok
    ) {
        throw new Error(
            `Error ${response.status} al cargar imágenes de colección`
        );
    }


    const data =
        await response.json();


    return Array.isArray(
        data?.images
    )
        ? data.images
        : [];
}


export async function fetchBrandCollections({
    marca,
    signal,
} = {}) {
    if (
        !marca
    ) {
        throw new Error(
            'fetchBrandCollections: falta "marca".'
        );
    }


    const response =
        await fetch(
            getApiUrl(
                `/api/collections/brand/${encodeURIComponent(
                    marca
                )}`
            ),
            {
                signal,
            }
        );


    if (
        !response.ok
    ) {
        throw new Error(
            `Error ${response.status} al cargar colecciones de marca`
        );
    }


    const data =
        await response.json();


    return data?.collections ??
        {};
}