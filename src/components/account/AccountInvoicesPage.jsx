import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';
import AccountHero from '../../components/account/AccountHero';
import InvoicesSection from '../../components/account/InvoicesSection';

export default function AccountInvoicesPage() {
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
                            title="Mis facturas"
                            subtitle="Accede al histórico de facturación en una pantalla independiente, más limpia y centrada solo en la parte documental."
                        />

                        {loading ? (
                            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                                Cargando tu sesión...
                            </div>
                        ) : linkedCustomers.length ? (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <InvoicesSection />
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