import { useState } from "react";
import { resetPassword } from "../../services/authClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { t } = useTranslation("resetPasswordPage");
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
            setError(t("errors.emptyFields"));
            return;
        }

        if (password.length < 8) {
            setError(t("errors.minLength"));
            return;
        }

        if (password !== repeatPassword) {
            setError(t("errors.passwordsNotMatch"));
            return;
        }

        try {
            setLoading(true);

            await resetPassword({ password });

            setSuccess(t("success"));

            setTimeout(() => {
                navigate("/login");
            }, 1800);
        } catch {
            setError(t("errors.invalidLink"));
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

                        </div>
                        <div>
                            <p className="text-lg font-semibold text-stone-900">CJMW</p>
                            <p className="text-sm text-stone-500">{t("header.subtitle")}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                        {t("header.backToLogin")}
                    </button>
                </div>
            </header>

            <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center justify-center px-6 py-10">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200 lg:grid-cols-2">
                    <div className="hidden bg-stone-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-stone-300">
                                {t("security.title")}
                            </p>

                            <h1 className="max-w-md text-4xl font-semibold leading-tight">
                                {t("security.heading")}
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-7 text-stone-300">
                                {t("security.description")}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm font-medium text-white">{t("recommendation.title")}</p>
                            <p className="mt-2 text-sm leading-6 text-stone-300">
                                {t("recommendation.text")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-6 sm:p-10">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-400">
                                    {t("form.title")}
                                </p>

                                <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                                    {t("form.heading")}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-stone-500">
                                    {t("form.description")}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-stone-700"
                                    >
                                        {t("form.password")}
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        placeholder={t("form.passwordPlaceholder")}
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
                                        {t("form.repeatPassword")}
                                    </label>

                                    <input
                                        id="repeatPassword"
                                        type="password"
                                        placeholder={t("form.repeatPasswordPlaceholder")}
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
                                    {loading ? t("form.loading") : t("form.submit")}
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-5 w-full text-sm font-medium text-stone-500 transition hover:text-stone-800"
                            >
                                {t("form.back")}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}