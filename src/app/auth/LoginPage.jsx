import { useEffect, useState } from "react";
import {
    Navigate,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { CartProvider } from "../../components/CartContext";
import Footer from "../../components/footer";
import { Header } from "../../components/header";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";


const VERIFIED_MESSAGE_KEY =
    "login_verified_message";

const VERIFIED_SUCCESS =
    "1";

const VERIFIED_ERROR =
    "0";


export default function LoginPage() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    const navigate =
        useNavigate();

    const [
        searchParams,
    ] = useSearchParams();

    const verified =
        searchParams.get(
            "verified"
        );

    const [
        verificationStatus,
        setVerificationStatus,
    ] = useState(() =>
        sessionStorage.getItem(
            VERIFIED_MESSAGE_KEY
        )
    );


    useEffect(() => {
        if (!verified) {
            return;
        }

        sessionStorage.setItem(
            VERIFIED_MESSAGE_KEY,
            verified
        );

        setVerificationStatus(
            verified
        );

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    }, [
        verified,
        navigate,
    ]);


    const handleDismissVerificationMessage =
        () => {
            sessionStorage.removeItem(
                VERIFIED_MESSAGE_KEY
            );

            setVerificationStatus(
                null
            );
        };


    if (
        !loading &&
        isAuthenticated &&
        !verificationStatus
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
                        <LoginForm
                            verificationStatus={
                                verificationStatus
                            }
                            verificationSuccessValue={
                                VERIFIED_SUCCESS
                            }
                            verificationErrorValue={
                                VERIFIED_ERROR
                            }
                            onDismissVerification={
                                handleDismissVerificationMessage
                            }
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}
