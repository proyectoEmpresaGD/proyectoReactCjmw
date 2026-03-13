import { useState } from "react";
import { requestPasswordReset } from "../../services/authClient";

export default function ForgotPasswordModal({ open, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            await requestPasswordReset({ email });

            setMessage(
                "Si el correo está registrado recibirás un enlace para cambiar tu contraseña."
            );

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch {
            setMessage("Error enviando el correo.");
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">

                <h2 className="text-lg font-semibold mb-4">
                    Recuperar contraseña
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        required
                        placeholder="Introduce tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-2 rounded-md"
                    >
                        {loading ? "Enviando..." : "Enviar enlace"}
                    </button>

                    {message && (
                        <p className="text-sm text-center text-stone-600">
                            {message}
                        </p>
                    )}

                </form>

                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-stone-500"
                >
                    Cancelar
                </button>

            </div>
        </div>
    );
}