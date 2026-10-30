import {
    useEffect,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowRight,
    Mail,
    X,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";

import {
    requestPasswordReset,
} from "../../services/authClient";


export default function ForgotPasswordModal({
    open,
    onClose,
    initialEmail = "",
}) {
    const {
        t,
    } = useTranslation(
        "loginPage"
    );

    const [
        email,
        setEmail,
    ] = useState(
        initialEmail
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        status,
        setStatus,
    ] = useState(
        "idle"
    );


    useEffect(() => {
        if (!open) {
            return;
        }

        setEmail(
            initialEmail || ""
        );

        setStatus(
            "idle"
        );
    }, [
        open,
        initialEmail,
    ]);


    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleKeyDown =
            (
                event
            ) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    onClose?.();
                }
            };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        open,
        onClose,
    ]);


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setLoading(
            true
        );

        setStatus(
            "idle"
        );

        try {
            await requestPasswordReset({
                email:
                    email
                        .trim()
                        .toLowerCase(),
            });

            setStatus(
                "success"
            );
        } catch {
            setStatus(
                "error"
            );
        } finally {
            setLoading(
                false
            );
        }
    };


    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="
                        fixed
                        inset-0
                        z-[140]
                        flex
                        items-center
                        justify-center
                        bg-stone-950/45
                        px-4
                        py-6
                        backdrop-blur-sm
                    "
                    onMouseDown={
                        onClose
                    }
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 24,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 16,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                        className="
                            relative
                            w-full
                            max-w-lg
                            overflow-hidden
                            border
                            border-white/80
                            bg-[#faf9f7]
                            shadow-[0_30px_90px_rgba(0,0,0,0.25)]
                        "
                    >
                        <div
                            className="
                                border-b
                                border-stone-200
                                bg-white
                                px-6
                                py-5

                                sm:px-8
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-5
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.26em]
                                            text-stone-400
                                        "
                                    >
                                        {t(
                                            "forgot.eyebrow"
                                        )}
                                    </p>

                                    <h2
                                        className="
                                            mt-2
                                            text-2xl
                                            font-light
                                            tracking-[-0.03em]
                                            text-stone-950
                                        "
                                    >
                                        {t(
                                            "forgot.title"
                                        )}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        onClose
                                    }
                                    aria-label={t(
                                        "forgot.close"
                                    )}
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-stone-400
                                        transition

                                        hover:bg-stone-100
                                        hover:text-stone-950
                                    "
                                >
                                    <X
                                        className="
                                            h-5
                                            w-5
                                        "
                                    />
                                </button>
                            </div>
                        </div>


                        <div
                            className="
                                px-6
                                py-7

                                sm:px-8
                                sm:py-8
                            "
                        >
                            {status ===
                            "success" ? (
                                <div>
                                    <p
                                        className="
                                            text-sm
                                            leading-7
                                            text-stone-600
                                        "
                                    >
                                        {t(
                                            "forgot.success"
                                        )}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            onClose
                                        }
                                        className="
                                            mt-7
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
                                        "
                                    >
                                        <span>
                                            {t(
                                                "forgot.back"
                                            )}
                                        </span>

                                        <ArrowRight
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p
                                        className="
                                            text-sm
                                            leading-7
                                            text-stone-500
                                        "
                                    >
                                        {t(
                                            "forgot.description"
                                        )}
                                    </p>

                                    <form
                                        onSubmit={
                                            handleSubmit
                                        }
                                        className="
                                            mt-7
                                        "
                                    >
                                        <label
                                            htmlFor="forgot-password-email"
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
                                                "forgot.email"
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
                                                    text-stone-400
                                                "
                                            />

                                            <input
                                                id="forgot-password-email"
                                                type="email"
                                                required
                                                value={
                                                    email
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setEmail(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                autoComplete="email"
                                                placeholder={t(
                                                    "forgot.emailPlaceholder"
                                                )}
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


                                        {status ===
                                            "error" && (
                                            <p
                                                role="alert"
                                                className="
                                                    mt-4
                                                    border-l-2
                                                    border-red-400
                                                    bg-red-50
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-red-700
                                                "
                                            >
                                                {t(
                                                    "forgot.error"
                                                )}
                                            </p>
                                        )}


                                        <button
                                            type="submit"
                                            disabled={
                                                loading
                                            }
                                            className="
                                                group
                                                mt-7
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
                                                        "forgot.loading"
                                                    )
                                                    : t(
                                                        "forgot.submit"
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
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
