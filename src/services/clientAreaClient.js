const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const API_BASE = `${baseUrl}/api/client-area`;

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Error en la petición');
    }

    return data;
}

export async function getInvoices(ejercicio) {
    const query = ejercicio ? `?ejercicio=${encodeURIComponent(ejercicio)}` : '';

    const response = await fetch(`${API_BASE}/invoices${query}`, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response);
}