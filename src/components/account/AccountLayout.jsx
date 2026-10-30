import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Header } from "../../components/header";
import Footer from "../../components/footer";
import { CartProvider } from "../../components/CartContext";
import { useAuth } from "../../context/AuthContext";

import AccountNavigation from "./AccountNavigation";


export default function AccountLayout({
    title,
    subtitle,
    children,
}) {
    const {
        customers,
        loading,
        isAuthenticated,
    } = useAuth();


    const linkedCustomers =
        useMemo(
            () =>
                customers ?? [],
            [
                customers,
            ]
        );


    const primaryCustomer =
        linkedCustomers[0] ??
        null;


    const customerName =
        primaryCustomer?.razclien ||
        primaryCustomer?.nomcomer ||
        "Cliente";


    const customerCode =
        primaryCustomer?.codclien ||
        null;


    if (
        !loading &&
        !isAuthenticated
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return (
        <CartProvider>
            <div
                className="
                    min-h-screen
                    bg-[#f7f6f3]
                    text-stone-950
                "
            >
                <Header />


                <main
                    className="
                        w-full
                        pt-[72px]

                        sm:pt-[80px]

                        lg:pt-[88px]
                    "
                >
                    <section
                        className="
                            relative
                            overflow-hidden
                            bg-stone-950
                            text-white
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -left-20
                                top-0
                                h-72
                                w-72
                                rounded-full
                                bg-white/5
                                blur-3xl
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                bottom-0
                                right-0
                                h-80
                                w-80
                                rounded-full
                                bg-stone-500/10
                                blur-3xl
                            "
                        />


                        <div
                            className="
                                relative
                                mx-auto
                                flex
                                w-full
                                max-w-[1600px]
                                flex-col
                                gap-10
                                px-5
                                py-12

                                sm:px-8
                                sm:py-14

                                lg:flex-row
                                lg:items-end
                                lg:justify-between
                                lg:px-10
                                lg:py-16

                                2xl:px-0
                            "
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.35,
                                }}
                                className="
                                    max-w-4xl
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            h-px
                                            w-10
                                            bg-white/40
                                        "
                                    />

                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.3em]
                                            text-white/55
                                        "
                                    >
                                        Área cliente
                                    </p>
                                </div>


                                <h1
                                    className="
                                        mt-5
                                        text-4xl
                                        font-light
                                        leading-none
                                        tracking-[-0.045em]
                                        text-white

                                        sm:text-5xl

                                        lg:text-6xl
                                    "
                                >
                                    {title}
                                </h1>


                                {subtitle ? (
                                    <p
                                        className="
                                            mt-5
                                            max-w-2xl
                                            text-sm
                                            leading-7
                                            text-white/60

                                            sm:text-[15px]
                                        "
                                    >
                                        {subtitle}
                                    </p>
                                ) : null}
                            </motion.div>


                            {!loading &&
                            primaryCustomer ? (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 12,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.08,
                                    }}
                                    className="
                                        w-full
                                        max-w-md
                                        border-t
                                        border-white/15
                                        pt-5

                                        lg:w-auto
                                        lg:min-w-[320px]
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.24em]
                                            text-white/40
                                        "
                                    >
                                        Cliente vinculado
                                    </p>

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-end
                                            justify-between
                                            gap-6
                                        "
                                    >
                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-base
                                                    font-medium
                                                    text-white
                                                "
                                            >
                                                {
                                                    customerName
                                                }
                                            </p>

                                            {customerCode ? (
                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        tracking-[0.08em]
                                                        text-white/45
                                                    "
                                                >
                                                    Cliente{" "}
                                                    {
                                                        customerCode
                                                    }
                                                </p>
                                            ) : null}
                                        </div>

                                        <span
                                            className="
                                                inline-flex
                                                shrink-0
                                                items-center
                                                gap-2
                                                text-xs
                                                text-emerald-300/90
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-300
                                                "
                                            />

                                            Activo
                                        </span>
                                    </div>
                                </motion.div>
                            ) : null}
                        </div>
                    </section>


                    <AccountNavigation />


                    <section
                        className="
                            w-full
                            border-t
                            border-stone-200
                            bg-[#f7f6f3]
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1600px]
                                px-5
                                py-10

                                sm:px-8
                                sm:py-12

                                lg:px-10
                                lg:py-14

                                2xl:px-0
                            "
                        >
                            {loading ? (
                                <div
                                    className="
                                        border-y
                                        border-stone-200
                                        py-8
                                        text-sm
                                        text-stone-500
                                    "
                                >
                                    Cargando tu sesión...
                                </div>
                            ) : linkedCustomers.length ? (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                    className="
                                        min-w-0
                                    "
                                >
                                    {children({
                                        linkedCustomers,
                                    })}
                                </motion.div>
                            ) : (
                                <div
                                    className="
                                        border-y
                                        border-amber-300
                                        bg-amber-50
                                        px-5
                                        py-6
                                        text-sm
                                        leading-6
                                        text-amber-900
                                    "
                                >
                                    Tu cuenta no tiene clientes vinculados en este momento.
                                </div>
                            )}
                        </div>
                    </section>
                </main>


                <Footer />
            </div>
        </CartProvider>
    );
}
