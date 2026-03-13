import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';
import AccountHero from '../../components/account/AccountHero';
import AccountTabs from '../../components/account/AccountTabs';
import ProfileSection from '../../components/account/ProfileSection';
import InvoicesSection from '../../components/account/InvoicesSection';

export default function AccountPage() {
    const { customers, loading, isAuthenticated } = useAuth();
    const [activeSection, setActiveSection] = useState('perfil');

    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const linkedCustomers = useMemo(() => customers ?? [], [customers]);

    return (
        <CartProvider>
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f5f4,white_40%,#fafaf9)]">
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                    <div className="grid gap-8">
                        <AccountHero linkedCustomersCount={linkedCustomers.length} />

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Espacio privado</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
                                    Tu cuenta organizada por perfil y facturación
                                </h2>
                            </div>

                            <AccountTabs activeSection={activeSection} onChange={setActiveSection} />
                        </div>

                        {loading ? (
                            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                                Cargando tu sesión...
                            </div>
                        ) : linkedCustomers.length ? (
                            <div className="grid gap-5">
                                {activeSection === 'perfil' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid gap-5"
                                    >
                                        {linkedCustomers.map((customer) => (
                                            <ProfileSection
                                                key={`${customer.empresa}-${customer.codclien}`}
                                                customer={customer}
                                            />
                                        ))}
                                    </motion.div>
                                )}

                                {activeSection === 'facturas' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <InvoicesSection />
                                    </motion.div>
                                )}
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