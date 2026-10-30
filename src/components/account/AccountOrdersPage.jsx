import AccountLayout from "./AccountLayout";
import OrdersSection from "./OrdersSection";


export default function AccountOrdersPage() {
    return (
        <AccountLayout
            title="Mis pedidos"
            subtitle="Consulta tus pedidos, distingue los servidos de los pendientes y accede al detalle de cada documento."
        >
            {() => (
                <OrdersSection />
            )}
        </AccountLayout>
    );
}
