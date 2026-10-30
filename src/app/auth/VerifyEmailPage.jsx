import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
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
    authClient,
} from "../../services/authClient";


const REDIRECT_DELAY_MS =
    2500;


export default function VerifyEmailPage() {
    const [
        searchParams,
    ] = useSearchParams();

    const navigate =
        useNavigate();

    const {
        t,
    } = useTranslation(
        "verifyEmailPage"
    );


    const token =
        useMemo(
            () =>
                searchParams
                    .get(
                        "token"
                    )
                    ?.trim() ||
                "",
            [
                searchParams,
            ]
        );


    const [
        status,
        setStatus,
    ] = useState(
        "loading"
    );

    const [
        message,
        setMessage,
    ] = useState(
        t(
            "loading"
        )
    );


    useEffect(() => {
        let isMounted =
            true;


        const runVerification =
            async () => {
                if (!token) {
                    if (
                        !isMounted
                    ) {
                        return;
                    }

                    setStatus(
                        "error"
                    );

                    setMessage(
                        t(
                            "errors.invalidLink"
                        )
                    );

                    return;
                }


                try {
                    const response =
                        await authClient.verifyEmail(
                            token
                        );


                    if (
                        !isMounted
                    ) {
                        return;
                    }


                    setStatus(
                        "success"
                    );

                    setMessage(
                        response?.message ||
                            t(
                                "success"
                            )
                    );


                    window.setTimeout(
                        () => {
                            navigate(
                                "/login?verified=1",
                                {
                                    replace: true,
                                }
                            );
                        },
                        REDIRECT_DELAY_MS
                    );
                } catch (
                    error
                ) {
                    if (
                        !isMounted
                    ) {
                        return;
                    }

                    setStatus(
                        "error"
                    );

                    setMessage(
                        error?.message ||
                            t(
                                "errors.failed"
                            )
                    );
                }
            };


        runVerification();


        return () => {
            isMounted =
                false;
        };
    }, [
        token,
        navigate,
    ]);


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
                            mx-auto
                            w-full
                            max-w-[1380px]
                        "
                    >
                        <AuthCard
                            eyebrow={t(
                                "eyebrow"
                            )}
                            title={t(
                                "title"
                            )}
                            subtitle={t(
                                "subtitle"
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
                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-stone-100
                                "
                            >
                                {status ===
                                "success" ? (
                                    <CheckCircle2
                                        className="
                                            h-7
                                            w-7
                                            text-emerald-700
                                        "
                                    />
                                ) : status ===
                                  "error" ? (
                                    <AlertCircle
                                        className="
                                            h-7
                                            w-7
                                            text-red-600
                                        "
                                    />
                                ) : (
                                    <LoaderCircle
                                        className="
                                            h-7
                                            w-7
                                            animate-spin
                                            text-stone-500
                                        "
                                    />
                                )}
                            </div>


                            <div
                                className={`
                                    mt-6
                                    border-l-2
                                    px-4
                                    py-3
                                    text-sm
                                    leading-6

                                    ${
                                        status ===
                                        "success"
                                            ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                            : status ===
                                              "error"
                                            ? "border-red-400 bg-red-50 text-red-700"
                                            : "border-stone-300 bg-stone-50 text-stone-600"
                                    }
                                `}
                            >
                                {message}
                            </div>


                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-col
                                    gap-3

                                    sm:flex-row
                                "
                            >
                                <Link
                                    to="/login"
                                    className="
                                        group
                                        flex
                                        flex-1
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
                                    "
                                >
                                    <span>
                                        {t(
                                            "buttons.login"
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
                                </Link>

                                <Link
                                    to="/"
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-stone-300
                                        px-5
                                        py-4
                                        text-sm
                                        font-medium
                                        text-stone-700
                                        transition

                                        hover:border-stone-950
                                        hover:text-stone-950
                                    "
                                >
                                    {t(
                                        "buttons.home"
                                    )}
                                </Link>
                            </div>
                        </AuthCard>
                    </div>
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}
