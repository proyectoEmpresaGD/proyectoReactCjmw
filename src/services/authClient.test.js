import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    registerRequest,
    verifyEmail,
    login,
    logout,
    getMe,
    getAdminRequests,
    approveAdminRequest,
    denyAdminRequest,
} from './authClient';

describe('authClient', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch = vi.fn();
    });

    it('login hace POST al endpoint correcto y devuelve datos', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    user: { id: 1, email: 'cliente@test.com' },
                    customers: [],
                },
            }),
        });

        const result = await login({
            email: 'cliente@test.com',
            password: '123456',
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toContain('/api/auth/login');

        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
            email: 'cliente@test.com',
            password: '123456',
        });

        expect(result.data.user.email).toBe('cliente@test.com');
    });

    it('login propaga mensaje y code si la API falla', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({
                message: 'Credenciales incorrectas',
                code: 'INVALID_CREDENTIALS',
            }),
        });

        await expect(
            login({ email: 'bad@test.com', password: 'badpass' })
        ).rejects.toMatchObject({
            message: 'Credenciales incorrectas',
            status: 401,
            code: 'INVALID_CREDENTIALS',
        });
    });

    it('getMe obtiene la sesión actual', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    user: { id: 22, role: 'admin' },
                    customers: [{ id: 3 }],
                },
            }),
        });

        const result = await getMe();

        expect(fetch.mock.calls[0][0]).toContain('/api/auth/me');
        expect(result.data.user.role).toBe('admin');
        expect(result.data.customers).toHaveLength(1);
    });

    it('logout hace POST y devuelve respuesta', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const result = await logout();

        expect(fetch.mock.calls[0][0]).toContain('/api/auth/logout');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            credentials: 'include',
        });
        expect(result.success).toBe(true);
    });

    it('registerRequest hace POST al endpoint de alta', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const payload = {
            companyName: 'Empresa Test',
            email: 'alta@test.com',
        };

        const result = await registerRequest(payload);

        expect(fetch.mock.calls[0][0]).toContain('/api/customer-registration/register-request');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            credentials: 'include',
        });
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(payload);
        expect(result.success).toBe(true);
    });

    it('verifyEmail envía el token por query string', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        await verifyEmail('abc 123');

        expect(fetch.mock.calls[0][0]).toContain('/api/customer-registration/verify-email?token=abc%20123');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            credentials: 'include',
        });
    });

    it('getAdminRequests monta bien los query params', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [] }),
        });

        await getAdminRequests({ status: 'pending', limit: 20, offset: 40 });

        const url = fetch.mock.calls[0][0];
        expect(url).toContain('/api/customer-registration/admin/requests?');
        expect(url).toContain('status=pending');
        expect(url).toContain('limit=20');
        expect(url).toContain('offset=40');
    });

    it('approveAdminRequest llama al endpoint correcto', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        await approveAdminRequest(17);

        expect(fetch.mock.calls[0][0]).toContain('/api/customer-registration/admin/requests/17/approve');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            credentials: 'include',
        });
    });

    it('denyAdminRequest envía motivo en body', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        await denyAdminRequest(8, { reason: 'Datos incompletos' });

        expect(fetch.mock.calls[0][0]).toContain('/api/customer-registration/admin/requests/8/deny');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
            reason: 'Datos incompletos',
        });
    });
});