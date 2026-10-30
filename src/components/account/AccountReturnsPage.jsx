import AccountLayout from "./AccountLayout";
import InvoicesSection from "./InvoicesSection";


export default function AccountReturnsPage() {
    return (
        <AccountLayout
            title="Historial de devoluciones"
            subtitle="Consulta las devoluciones asociadas a tu cuenta y abre cada documento para revisar su información."
        >
            {() => (
                <InvoicesSection
                    mode="returns"
                />
            )}
        </AccountLayout>
    );
}
