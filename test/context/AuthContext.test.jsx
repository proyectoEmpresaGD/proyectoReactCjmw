import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

const { authClientMock } = vi.hoisted(() => ({
    authClientMock: {
        getMe: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
    },
}));

vi.mock('../../src/services/authClient', () => ({
    authClient: authClientMock,
}));

function Consumer() {
    const {
        user,
        customers,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
    } = useAuth();

    return (
        <div>
            <div data-testid="loading">{String(loading)}</div>
            <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
            <div data-testid="isAdmin">{String(isAdmin)}</div>
            <div data-testid="userEmail">{user?.email || ''}</div>
            <div data-testid="customersCount">{customers.length}</div>

            <button
                onClick={() => login({ email: 'cliente@test.com', password: '123456' })}
            >
                do-login
            </button>

            <button onClick={() => logout()}>
                do-logout
            </button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        authClientMock.getMe.mockReset();
        authClientMock.login.mockReset();
        authClientMock.logout.mockReset();
    });

    it('carga la sesión al montar si getMe responde bien', async () => {
        authClientMock.getMe.mockResolvedValueOnce({
            data: {
                user: { id: 1, email: 'admin@test.com', role: 'admin' },
                customers: [{ id: 1 }, { id: 2 }],
            },
        });

        render(
            <AuthProvider>
                <Consumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading').textContent).toBe('true');

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
        expect(screen.getByTestId('isAdmin').textContent).toBe('true');
        expect(screen.getByTestId('userEmail').textContent).toBe('admin@test.com');
        expect(screen.getByTestId('customersCount').textContent).toBe('2');
    });

    it('limpia la sesión si getMe falla', async () => {
        authClientMock.getMe.mockRejectedValueOnce(new Error('401'));

        render(
            <AuthProvider>
                <Consumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
        expect(screen.getByTestId('isAdmin').textContent).toBe('false');
        expect(screen.getByTestId('customersCount').textContent).toBe('0');
    });

    it('login aplica la sesión devuelta por authClient.login', async () => {
        authClientMock.getMe.mockRejectedValueOnce(new Error('no session'));
        authClientMock.login.mockResolvedValueOnce({
            data: {
                user: { id: 5, email: 'cliente@test.com', role: 'customer' },
                customers: [{ id: 10 }],
            },
        });

        render(
            <AuthProvider>
                <Consumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        screen.getByText('do-login').click();

        await waitFor(() => {
            expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
        });

        expect(screen.getByTestId('isAdmin').textContent).toBe('false');
        expect(screen.getByTestId('userEmail').textContent).toBe('cliente@test.com');
        expect(screen.getByTestId('customersCount').textContent).toBe('1');
    });

    it('logout limpia la sesión aunque authClient.logout falle', async () => {
        authClientMock.getMe.mockResolvedValueOnce({
            data: {
                user: { id: 1, email: 'test@test.com', role: 'admin' },
                customers: [{ id: 1 }],
            },
        });

        authClientMock.logout.mockRejectedValueOnce(new Error('network'));

        render(
            <AuthProvider>
                <Consumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
        });

        screen.getByText('do-logout').click();

        await waitFor(() => {
            expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
        });

        expect(screen.getByTestId('isAdmin').textContent).toBe('false');
        expect(screen.getByTestId('customersCount').textContent).toBe('0');
    });
});
