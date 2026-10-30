import {
    Navigate,
} from "react-router-dom";

import {
    CartProvider,
} from "../../components/CartContext";

import Footer from "../../components/footer";
import { Header } from "../../components/header";
import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../context/AuthContext";


export default function RegisterPage() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();


    if (
        !loading &&
        isAuthenticated
    ) {
        return (
            <Navigate
                to="/mis-datos"
                replace
            />
        );
    }


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
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -left-40
                            top-24
                            h-96
                            w-96
                            rounded-full
                            bg-white/80
                            blur-3xl
                        "
                    />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -right-32
                            bottom-10
                            h-80
                            w-80
                            rounded-full
                            bg-stone-200/70
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            relative
                            mx-auto
                            w-full
                            max-w-[1380px]
                        "
                    >
                        <RegisterForm />
                    </div>
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}
