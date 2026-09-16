const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const API_BASE = `${baseUrl}/api/client-area`;

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Error en la petición');
    }

    return data;
}

export async function getInvoiceOrders({
    ejercicio,
    codserfacventa,
    nfacventa,
}) {
    const response = await fetch(
        `${API_BASE}/invoices/${encodeURIComponent(
            ejercicio
        )}/${encodeURIComponent(
            codserfacventa
        )}/${encodeURIComponent(
            nfacventa
        )}/orders`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    return parseResponse(response);
}

export function getInvoicePdfUrl({
    ejercicio,
    codserfacventa,
    nfacventa,
}) {
    return `${API_BASE}/invoices/${encodeURIComponent(
        ejercicio
    )}/${encodeURIComponent(
        codserfacventa
    )}/${encodeURIComponent(
        nfacventa
    )}/pdf`;
}

export async function getOrders(
    ejercicio
) {
    const query =
        ejercicio
            ? `?ejercicio=${encodeURIComponent(
                ejercicio
            )}`
            : '';

    const response =
        await fetch(
            `${API_BASE}/orders${query}`,
            {
                method:
                    'GET',

                credentials:
                    'include',
            }
        );

    return parseResponse(
        response
    );
}

export async function getOrderDetail({
    ejercicio,
    canal,
    codserpedventa,
    npedventa,
}) {
    const response =
        await fetch(
            `${API_BASE}/orders/${encodeURIComponent(
                ejercicio
            )}/${encodeURIComponent(
                canal
            )}/${encodeURIComponent(
                codserpedventa
            )}/${encodeURIComponent(
                npedventa
            )}`,
            {
                method:
                    'GET',

                credentials:
                    'include',
            }
        );

    return parseResponse(
        response
    );
}

export async function getInvoices(ejercicio) {
    const query = ejercicio ? `?ejercicio=${encodeURIComponent(ejercicio)}` : '';
    const url = `${API_BASE}/invoices${query}`;

    // console.log('DEBUG getInvoices URL:', url);

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response);
}

export async function getInvoiceDetail({
    ejercicio,
    codserfacventa,
    nfacventa,
}) {
    const response = await fetch(
        `${API_BASE}/invoices/${encodeURIComponent(ejercicio)}/${encodeURIComponent(
            codserfacventa
        )}/${encodeURIComponent(nfacventa)}`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    return parseResponse(response);
}

export async function getUninvoicedDeliveryNotes(ejercicio) {
    const query = ejercicio ? `?ejercicio=${encodeURIComponent(ejercicio)}` : '';

    const response = await fetch(`${API_BASE}/delivery-notes/uninvoiced${query}`, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response);
}

function getFilenameFromDisposition(disposition, fallback) {
    if (!disposition) return fallback;

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]);
    }

    const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);

    return filenameMatch?.[1]?.trim() || fallback;
}

export async function downloadInvoicePdf({
    ejercicio,
    codserfacventa,
    nfacventa,
}) {
    const response = await fetch(
        `${API_BASE}/invoices/${encodeURIComponent(ejercicio)}/${encodeURIComponent(
            codserfacventa
        )}/${encodeURIComponent(nfacventa)}/pdf`,
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
            data?.message ||
            data?.error ||
            'No se pudo generar el PDF de la factura'
        );
    }

    const blob = await response.blob();
    const fallbackFilename = `Fac.Venta_${codserfacventa || ''}${nfacventa || ''}.pdf`;
    const filename = getFilenameFromDisposition(
        response.headers.get('content-disposition'),
        fallbackFilename
    );

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
}

