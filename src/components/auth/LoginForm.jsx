import {
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    X,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";

import { useAuth } from "../../context/AuthContext";
import AuthCard from "./AuthCard";
import ForgotPasswordModal from "./ForgotPasswordModal";


const initialForm = {
    email: "",
    password: "",
};


export default function LoginForm({
    verificationStatus,
    verificationSuccessValue,
    verificationErrorValue,
    onDismissVerification,
}) {
    const {
        t,
    } = useTranslation(
        "loginPage"
    );

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login,
    } = useAuth();

    const [
        forgotPasswordOpen,
        setForgotPasswordOpen,
    ] = useState(false);

    const [
        form,
        setForm,
    ] = useState(
        initialForm
    );

    const [
        error,
        setError,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);


    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setForm(
            (
                current
            ) => ({
                ...current,

                [name]:
                    name ===
                    "email"
                        ? value.toLowerCase()
                        : value,
            })
        );

        if (error) {
            setError("");
        }
    };


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSubmitting(
            true
        );

        try {
            await login({
                email:
                    form.email.trim(),

                password:
                    form.password,
            });

            const redirectTo =
                location.state?.from
                    ?.pathname ||
                "/mis-datos";

            navigate(
                redirectTo,
                {
                    replace: true,
                }
            );
        } catch (
            requestError
        ) {
            setError(
                getLoginMessage(
                    requestError,
                    t
                )
            );
        } finally {
            setSubmitting(
                false
            );
        }
    };


    const isVerificationSuccess =
        verificationStatus ===
        verificationSuccessValue;

    const isVerificationError =
        verificationStatus ===
        verificationErrorValue;


    return (
        <>
            <AuthCard
                eyebrow={t(
                    "eyebrow"
                )}
                title={t(
                    "form.title"
                )}
                subtitle={t(
                    "form.subtitle"
                )}
                sideLabel={t(
                    "hero.label"
                )}
                sideTitle={t(
                    "hero.title"
                )}
                sideDescription={t(
                    "hero.description"
                )}
            >
                {(isVerificationSuccess ||
                    isVerificationError) && (
                    <div
                        className={`
                            mb-6
                            flex
                            items-start
                            justify-between
                            gap-4
                            border
                            px-4
                            py-3.5
                            text-sm

                            ${
                                isVerificationSuccess
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }
                        `}
                    >
                        <p
                            className="
                                leading-6
                            "
                        >
                            {isVerificationSuccess
                                ? t(
                                    "verification.successMessage"
                                )
                                : t(
                                    "verification.errorMessage"
                                )}
                        </p>

                        <button
                            type="button"
                            onClick={
                                onDismissVerification
                            }
                            aria-label={t(
                                "verification.close"
                            )}
                            className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                transition

                                hover:bg-black/5
                            "
                        >
                            <X
                                className="
                                    h-4
                                    w-4
                                "
                            />
                        </button>
                    </div>
                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-5
                    "
                >
                    <div>
                        <label
                            htmlFor="email"
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
                            {t(
                                "form.email"
                            )}
                        </label>

                        <div
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                border-b
                                border-stone-300
                                py-3
                                transition

                                focus-within:border-stone-950
                            "
                        >
                            <Mail
                                className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-stone-400
                                    transition
                                    group-focus-within:text-stone-800
                                "
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="username"
                                placeholder={t(
                                    "form.emailPlaceholder"
                                )}
                                required
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    py-1
                                    text-[15px]
                                    text-stone-950
                                    outline-none

                                    placeholder:text-stone-350
                                "
                            />
                        </div>
                    </div>


                    <div>
                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >
                            <label
                                htmlFor="password"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.14em]
                                    text-stone-500
                                "
                            >
                                {t(
                                    "form.password"
                                )}
                            </label>

                            <button
                                type="button"
                                onClick={() =>
                                    setForgotPasswordOpen(
                                        true
                                    )
                                }
                                className="
                                    text-xs
                                    font-medium
                                    text-stone-500
                                    transition

                                    hover:text-stone-950
                                "
                            >
                                {t(
                                    "form.forgotPassword"
                                )}
                            </button>
                        </div>

                        <div
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                border-b
                                border-stone-300
                                py-3
                                transition

                                focus-within:border-stone-950
                            "
                        >
                            <LockKeyhole
                                className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-stone-400
                                    transition
                                    group-focus-within:text-stone-800
                                "
                            />

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="current-password"
                                placeholder={t(
                                    "form.passwordPlaceholder"
                                )}
                                required
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    py-1
                                    text-[15px]
                                    text-stone-950
                                    outline-none

                                    placeholder:text-stone-350
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? t(
                                            "form.hidePassword"
                                        )
                                        : t(
                                            "form.showPassword"
                                        )
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-stone-400
                                    transition

                                    hover:bg-stone-100
                                    hover:text-stone-800
                                "
                            >
                                {showPassword ? (
                                    <EyeOff
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                ) : (
                                    <Eye
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                )}
                            </button>
                        </div>
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
                                leading-6
                                text-red-700
                            "
                        >
                            {error}
                        </div>
                    ) : null}


                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        className="
                            group
                            mt-2
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
                            {submitting
                                ? t(
                                    "form.submitting"
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
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </button>
                </form>


                <div
                    className="
                        mt-8
                        border-t
                        border-stone-200
                        pt-6
                    "
                >
                    <p
                        className="
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        {t(
                            "form.noAccess"
                        )}{" "}
                        <Link
                            to="/register"
                            className="
                                inline-flex
                                items-center
                                gap-1
                                font-medium
                                text-stone-950
                                underline
                                decoration-stone-300
                                underline-offset-4
                                transition

                                hover:decoration-stone-950
                            "
                        >
                            {t(
                                "form.requestAccess"
                            )}
                        </Link>
                    </p>
                </div>
            </AuthCard>


            <ForgotPasswordModal
                open={
                    forgotPasswordOpen
                }
                onClose={() =>
                    setForgotPasswordOpen(
                        false
                    )
                }
                initialEmail={
                    form.email
                }
            />
        </>
    );
}


function getLoginMessage(
    error,
    t
) {
    if (
        error?.code ===
        "ACCOUNT_DENIED"
    ) {
        return t(
            "errors.accountDenied"
        );
    }

    if (
        error?.code ===
        "ACCOUNT_NOT_APPROVED"
    ) {
        return t(
            "errors.accountNotApproved"
        );
    }

    if (
        error?.code ===
        "ACCOUNT_INACTIVE"
    ) {
        return t(
            "errors.accountInactive"
        );
    }

    if (
        error?.code ===
        "EMAIL_NOT_VERIFIED"
    ) {
        return t(
            "errors.emailNotVerified"
        );
    }

    return (
        error?.message ||
        t(
            "errors.generic"
        )
    );
}
