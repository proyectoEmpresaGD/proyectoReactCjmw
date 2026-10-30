import AccountLayout from "./AccountLayout";
import InvoicesSection from "./InvoicesSection";
import DeliveryNotesSection from "./DeliveryNotesSection";


export default function AccountInvoicesPage() {
    return (
        <AccountLayout
            title="Mis facturas"
            subtitle="Consulta tu histórico de facturación, abre cada documento y revisa los pedidos relacionados."
        >
            {() => (
                <div
                    className="
                        grid
                        gap-8
                    "
                >
                    <InvoicesSection
                        mode="orders"
                    />

                    <DeliveryNotesSection />
                </div>
            )}
        </AccountLayout>
    );
}
