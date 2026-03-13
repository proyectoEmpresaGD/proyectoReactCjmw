const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;
const AUTH_API_BASE = `${API_BASE}/auth`;
const CUSTOMER_REGISTRATION_API_BASE = `${API_BASE}/customer-registration`;

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data?.message || data?.error || 'Error en la petición');
        error.status = response.status;
        error.code = data?.code || null;
        error.data = data;
        throw error;
    }

    return data;
}

export async function registerRequest(payload) {
    const response = await fetch(`${CUSTOMER_REGISTRATION_API_BASE}/register-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
}

export async function verifyEmail(token) {
    const response = await fetch(
        `${CUSTOMER_REGISTRATION_API_BASE}/verify-email?token=${encodeURIComponent(token)}`,
        {
            credentials: 'include',
        }
    );

    return parseResponse(response);
}

export async function login(payload) {
    const response = await fetch(`${AUTH_API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
}

export async function logout() {
    const response = await fetch(`${AUTH_API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    return parseResponse(response);
}

export async function getMe() {
    const response = await fetch(`${AUTH_API_BASE}/me`, {
        credentials: 'include',
    });

    return parseResponse(response);
}

export async function getAdminRequests({ status = 'pending', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();

    if (status) {
        params.set('status', status);
    }

    params.set('limit', String(limit));
    params.set('offset', String(offset));

    const response = await fetch(
        `${CUSTOMER_REGISTRATION_API_BASE}/admin/requests?${params.toString()}`,
        {
            credentials: 'include',
        }
    );

    return parseResponse(response);
}

export async function approveAdminRequest(requestId) {
    const response = await fetch(
        `${CUSTOMER_REGISTRATION_API_BASE}/admin/requests/${requestId}/approve`,
        {
            method: 'POST',
            credentials: 'include',
        }
    );

    return parseResponse(response);
}

export async function denyAdminRequest(requestId, payload = {}) {
    const response = await fetch(
        `${CUSTOMER_REGISTRATION_API_BASE}/admin/requests/${requestId}/deny`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }
    );

    return parseResponse(response);
}

export const authClient = {
    registerRequest,
    verifyEmail,
    login,
    logout,
    getMe,
    getAdminRequests,
    approveAdminRequest,
    denyAdminRequest,
};