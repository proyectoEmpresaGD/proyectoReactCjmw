import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import { authClient } from '../../services/authClient';

const REDIRECT_DELAY_MS = 2500;

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams]);

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Estamos verificando tu correo...');

    useEffect(() => {
        let isMounted = true;

        const runVerification = async () => {
            if (!token) {
                if (!isMounted) return;
                setStatus('error');
                setMessage('El enlace de verificación no es válido o está incompleto.');
                return;
            }

            try {
                const response = await authClient.verifyEmail(token);

                if (!isMounted) return;

                setStatus('success');
                setMessage(response?.message || 'Correo verificado correctamente. Redirigiendo al login...');

                window.setTimeout(() => {
                    navigate('/login?verified=1', { replace: true });
                }, REDIRECT_DELAY_MS);
            } catch (error) {
                if (!isMounted) return;

                setStatus('error');
                setMessage(
                    error?.message || 'No se pudo verificar el correo. Es posible que el enlace haya caducado o ya se haya usado.'
                );
            }
        };

        runVerification();

        return () => {
            isMounted = false;
        };
    }, [token, navigate]);

    return (
        <CartProvider>
            <div className="min-h-screen mt-[5%] bg-stone-50">
                <Header />
                <main className="px-4 py-16">
                    <section className="mx-auto max-w-xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-stone-900">
                                Verificación de cuenta
                            </h1>
                            <p className="mt-2 text-sm text-stone-600">
                                Estamos procesando la activación de tu acceso.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl border p-4 text-sm ${status === 'success'
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : status === 'error'
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'border-stone-200 bg-stone-50 text-stone-700'
                                }`}
                        >
                            {message}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/login"
                                className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
                            >
                                Ir al login
                            </Link>

                            <Link
                                to="/"
                                className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
}