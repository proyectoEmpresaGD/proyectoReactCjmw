const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const PUNTOS_VENTA_ENDPOINT =
    `${API_BASE_URL}/api/puntos-venta`;

export async function getPuntosVenta({
    signal,
} = {}) {
    const response = await fetch(
        PUNTOS_VENTA_ENDPOINT,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        }
    );

    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data?.error ||
            data?.message ||
            "Error obteniendo los puntos de venta"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return Array.isArray(data)
        ? data
        : [];
}