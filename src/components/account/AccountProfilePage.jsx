import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';
import AccountHero from '../../components/account/AccountHero';
import ProfileSection from '../../components/account/ProfileSection';

export default function AccountProfilePage() {
    const { customers, loading, isAuthenticated } = useAuth();

    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const linkedCustomers = useMemo(() => customers ?? [], [customers]);

    return (
        <CartProvider>
            <div className="min-h-screen mt-[5%] bg-[radial-gradient(circle_at_top,#f5f5f4,white_40%,#fafaf9)]">
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                    <div className="grid gap-8">
                        <AccountHero
                            linkedCustomersCount={linkedCustomers.length}
                            title="Mis datos"
                            subtitle="Consulta toda la información asociada a tu cuenta de cliente en un espacio más claro, moderno y ordenado."
                        />

                        {loading ? (
                            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                                Cargando tu sesión...
                            </div>
                        ) : linkedCustomers.length ? (
                            <div className="grid gap-5">
                                {linkedCustomers.map((customer) => (
                                    <motion.div
                                        key={`${customer.empresa}-${customer.codclien}`}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProfileSection customer={customer} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                                Tu cuenta no tiene clientes vinculados en este momento.
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}