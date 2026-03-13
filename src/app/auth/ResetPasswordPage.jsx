import { useState } from "react";
import { resetPassword } from "../../services/authClient";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!password || !repeatPassword) {
            setError("Debes completar ambos campos");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({ password });

            setSuccess("Contraseña actualizada correctamente. Te llevamos al login...");

            setTimeout(() => {
                navigate("/login");
            }, 1800);
        } catch {
            setError("El enlace no es válido o ha caducado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100">
            <header className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                            CJ
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-stone-900">CJMW</p>
                            <p className="text-sm text-stone-500">Recuperación de contraseña</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                        Volver al login
                    </button>
                </div>
            </header>

            <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center justify-center px-6 py-10">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200 lg:grid-cols-2">
                    <div className="hidden bg-stone-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-stone-300">
                                Seguridad de acceso
                            </p>

                            <h1 className="max-w-md text-4xl font-semibold leading-tight">
                                Crea una nueva contraseña para volver a entrar a tu cuenta.
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-7 text-stone-300">
                                Por seguridad, este enlace tiene una validez limitada. Elige una
                                contraseña segura y repítela para confirmar que está escrita correctamente.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm font-medium text-white">Recomendación</p>
                            <p className="mt-2 text-sm leading-6 text-stone-300">
                                Usa una combinación de letras mayúsculas, minúsculas, números y,
                                si quieres, algún símbolo para reforzar la seguridad de tu cuenta.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-6 sm:p-10">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-400">
                                    Restablecer contraseña
                                </p>

                                <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                                    Nueva contraseña
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-stone-500">
                                    Introduce tu nueva contraseña y repítela para confirmar el cambio.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-stone-700"
                                    >
                                        Nueva contraseña
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Escribe tu nueva contraseña"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="repeatPassword"
                                        className="mb-2 block text-sm font-medium text-stone-700"
                                    >
                                        Repetir contraseña
                                    </label>

                                    <input
                                        id="repeatPassword"
                                        type="password"
                                        placeholder="Vuelve a escribir la contraseña"
                                        required
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900"
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-sm font-medium text-red-600">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                                        <p className="text-sm font-medium text-green-700">{success}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Actualizando..." : "Cambiar contraseña"}
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-5 w-full text-sm font-medium text-stone-500 transition hover:text-stone-800"
                            >
                                Volver al inicio de sesión
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}