import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import { useAuth } from '../../context/AuthContext';
import AccountHero from '../../components/account/AccountHero';
import AccountSidebar from './AccountSidebar';

export default function AccountLayout({ title, subtitle, children }) {
    const { customers, loading, isAuthenticated } = useAuth();

    const linkedCustomers = useMemo(() => customers ?? [], [customers]);

    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <CartProvider>
            <div className="min-h-screen mt-[5%] bg-[radial-gradient(circle_at_top,#f5f5f4,white_40%,#fafaf9)]">
                <Header />

                <main className="mx-auto w-[90%] md:w-[75%] px-4 py-10 md:px-6 md:py-14">
                    <div className="grid gap-8">


                        {loading ? (
                            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                                Cargando tu sesión...
                            </div>
                        ) : linkedCustomers.length ? (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] lg:items-start"
                            >
                                <AccountSidebar />

                                <section className="min-w-0">
                                    {children({ linkedCustomers })}
                                </section>
                            </motion.div>
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