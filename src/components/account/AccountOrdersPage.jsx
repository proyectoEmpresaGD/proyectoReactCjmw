import AccountLayout from './AccountLayout';
import OrdersSection from './OrdersSection';

export default function AccountOrdersPage() {
    return (
        <AccountLayout
            title="Mis pedidos"
            subtitle="Consulta tus pedidos servidos y pendientes de servir."
        >
            {() => (
                <OrdersSection />
            )}
        </AccountLayout>
    );
}