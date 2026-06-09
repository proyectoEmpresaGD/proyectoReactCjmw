import AccountLayout from './AccountLayout';
import InvoicesSection from './InvoicesSection';
import DeliveryNotesSection from './DeliveryNotesSection';

export default function AccountInvoicesPage() {
    return (
        <AccountLayout
            title="Mis pedidos"
            subtitle="Consulta tus pedidos, facturas y albaranes asociados desde un panel más claro y ordenado."
        >
            {() => (
                <div className="grid gap-8">
                    <InvoicesSection mode="orders" />

                    <DeliveryNotesSection />
                </div>
            )}
        </AccountLayout>
    );
}