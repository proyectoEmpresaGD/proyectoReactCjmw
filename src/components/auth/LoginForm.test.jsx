import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();
let currentLocation = { state: { from: { pathname: '/mi-zona' } } };

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => currentLocation,
    };
});

describe('LoginForm', () => {
    beforeEach(() => {
        mockLogin.mockReset();
        mockNavigate.mockReset();
        currentLocation = { state: { from: { pathname: '/mi-zona' } } };
    });

    it('envía email normalizado y password al hacer submit', async () => {
        mockLogin.mockResolvedValueOnce({ ok: true });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'CLIENTE@TEST.COM ');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'cliente@test.com',
                password: '123456',
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/mi-zona', { replace: true });
    });

    it('redirige a /mis-datos si no hay origen previo', async () => {
        currentLocation = {};
        mockLogin.mockResolvedValueOnce({ ok: true });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/mis-datos', { replace: true });
        });
    });

    it('muestra mensaje específico para ACCOUNT_DENIED', async () => {
        mockLogin.mockRejectedValueOnce({
            code: 'ACCOUNT_DENIED',
            message: 'denied',
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(
            await screen.findByText(/tu solicitud ha sido denegada/i)
        ).toBeInTheDocument();
    });

    it('muestra mensaje específico para ACCOUNT_NOT_APPROVED', async () => {
        mockLogin.mockRejectedValueOnce({
            code: 'ACCOUNT_NOT_APPROVED',
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(
            await screen.findByText(/pendiente de aprobación/i)
        ).toBeInTheDocument();
    });

    it('muestra mensaje específico para EMAIL_NOT_VERIFIED', async () => {
        mockLogin.mockRejectedValueOnce({
            code: 'EMAIL_NOT_VERIFIED',
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(
            await screen.findByText(/todavía debes verificar tu correo electrónico/i)
        ).toBeInTheDocument();
    });

    it('muestra el mensaje genérico si falla sin code conocido', async () => {
        mockLogin.mockRejectedValueOnce({
            message: 'No autorizado',
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByText(/no autorizado/i)).toBeInTheDocument();
    });

    it('normaliza email quitando espacios y pasando a minúsculas', async () => {
        mockLogin.mockResolvedValueOnce({ ok: true });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), '  CLIENTE@TEST.COM  ');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'cliente@test.com',
                password: '123456',
            });
        });
    });

    it('evita doble submit mientras el login está en curso', async () => {
        let resolveLogin;

        mockLogin.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveLogin = resolve;
                })
        );

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');

        const button = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.click(button);
        await userEvent.click(button);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        resolveLogin({ ok: true });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('limpia el error anterior al volver a intentar login', async () => {
        mockLogin
            .mockRejectedValueOnce({ message: 'No autorizado' })
            .mockResolvedValueOnce({ ok: true });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(emailInput, 'test@test.com');
        await userEvent.type(passwordInput, 'badpass');
        await userEvent.click(submitButton);

        expect(await screen.findByText(/no autorizado/i)).toBeInTheDocument();

        await userEvent.clear(passwordInput);
        await userEvent.type(passwordInput, '123456');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });

        expect(screen.queryByText(/no autorizado/i)).not.toBeInTheDocument();
    });

    it('deshabilita el botón mientras envía', async () => {
        let resolveLogin;

        mockLogin.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveLogin = resolve;
                })
        );

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');

        const button = screen.getByRole('button', { name: /iniciar sesión/i });
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
        });

        resolveLogin({ ok: true });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
});