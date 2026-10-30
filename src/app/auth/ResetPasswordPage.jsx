import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";

import {
    CartProvider,
} from "../../components/CartContext";

import Footer from "../../components/footer";
import { Header } from "../../components/header";
import AuthCard from "../../components/auth/AuthCard";

import {
    resetPassword,
} from "../../services/authClient";


export default function ResetPasswordPage() {
    const navigate =
        useNavigate();

    const {
        t,
    } = useTranslation(
        "resetPasswordPage"
    );

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        repeatPassword,
        setRepeatPassword,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !password ||
            !repeatPassword
        ) {
            setError(
                t(
                    "errors.emptyFields"
                )
            );

            return;
        }


        if (
            password.length <
            8
        ) {
            setError(
                t(
                    "errors.minLength"
                )
            );

            return;
        }


        if (
            password !==
            repeatPassword
        ) {
            setError(
                t(
                    "errors.passwordsNotMatch"
                )
            );

            return;
        }


        try {
            setLoading(
                true
            );

            await resetPassword({
                password,
            });

            setSuccess(
                t(
                    "success"
                )
            );

            window.setTimeout(
                () => {
                    navigate(
                        "/login"
                    );
                },
                1800
            );
        } catch {
            setError(
                t(
                    "errors.invalidLink"
                )
            );
        } finally {
            setLoading(
                false
            );
        }
    };


    return (
        <CartProvider>
            <div
                className="
                    min-h-screen
                    bg-[#f5f3ef]
                    text-stone-950
                "
            >
                <Header />

                <main
                    className="
                        relative
                        overflow-hidden
                        px-4
                        pb-16
                        pt-[92px]

                        sm:px-6
                        sm:pb-20
                        sm:pt-[104px]

                        lg:px-8
                        lg:pb-24
                        lg:pt-[120px]
                    "
                >
                    <div
                        className="
                            relative
                            mx-auto
                            w-full
                            max-w-[1380px]
                        "
                    >
                        <AuthCard
                            eyebrow={t(
                                "form.title"
                            )}
                            title={t(
                                "form.heading"
                            )}
                            subtitle={t(
                                "form.description"
                            )}
                            sideLabel={t(
                                "security.title"
                            )}
                            sideTitle={t(
                                "security.heading"
                            )}
                            sideDescription={t(
                                "security.description"
                            )}
                        >
                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="
                                    space-y-6
                                "
                            >
                                <PasswordField
                                    id="password"
                                    label={t(
                                        "form.password"
                                    )}
                                    placeholder={t(
                                        "form.passwordPlaceholder"
                                    )}
                                    value={
                                        password
                                    }
                                    onChange={
                                        setPassword
                                    }
                                />

                                <PasswordField
                                    id="repeatPassword"
                                    label={t(
                                        "form.repeatPassword"
                                    )}
                                    placeholder={t(
                                        "form.repeatPasswordPlaceholder"
                                    )}
                                    value={
                                        repeatPassword
                                    }
                                    onChange={
                                        setRepeatPassword
                                    }
                                />


                                <div
                                    className="
                                        border-l-2
                                        border-stone-300
                                        bg-stone-50
                                        px-4
                                        py-3
                                    "
                                >
                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.14em]
                                            text-stone-500
                                        "
                                    >
                                        {t(
                                            "recommendation.title"
                                        )}
                                    </p>

                                    <p
                                        className="
                                            mt-1.5
                                            text-xs
                                            leading-5
                                            text-stone-500
                                        "
                                    >
                                        {t(
                                            "recommendation.text"
                                        )}
                                    </p>
                                </div>


                                {error ? (
                                    <div
                                        role="alert"
                                        className="
                                            border-l-2
                                            border-red-400
                                            bg-red-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-red-700
                                        "
                                    >
                                        {
                                            error
                                        }
                                    </div>
                                ) : null}


                                {success ? (
                                    <div
                                        className="
                                            border-l-2
                                            border-emerald-400
                                            bg-emerald-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-emerald-800
                                        "
                                    >
                                        {
                                            success
                                        }
                                    </div>
                                ) : null}


                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        bg-stone-950
                                        px-5
                                        py-4
                                        text-sm
                                        font-medium
                                        text-white
                                        transition

                                        hover:bg-stone-800

                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    <span>
                                        {loading
                                            ? t(
                                                "form.loading"
                                            )
                                            : t(
                                                "form.submit"
                                            )}
                                    </span>

                                    <ArrowRight
                                        className="
                                            h-4
                                            w-4
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />
                                </button>
                            </form>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                className="
                                    mt-6
                                    text-sm
                                    font-medium
                                    text-stone-500
                                    underline
                                    decoration-stone-300
                                    underline-offset-4
                                    transition

                                    hover:text-stone-950
                                    hover:decoration-stone-950
                                "
                            >
                                {t(
                                    "form.back"
                                )}
                            </button>
                        </AuthCard>
                    </div>
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}


function PasswordField({
    id,
    label,
    placeholder,
    value,
    onChange,
}) {
    return (
        <div>
            <label
                htmlFor={
                    id
                }
                className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-stone-500
                "
            >
                {label}
            </label>

            <input
                id={
                    id
                }
                type="password"
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target
                            .value
                    )
                }
                placeholder={
                    placeholder
                }
                autoComplete="new-password"
                required
                className="
                    w-full
                    border-b
                    border-stone-300
                    bg-transparent
                    py-3
                    text-[15px]
                    text-stone-950
                    outline-none
                    transition

                    placeholder:text-stone-350

                    focus:border-stone-950
                "
            />
        </div>
    );
}
