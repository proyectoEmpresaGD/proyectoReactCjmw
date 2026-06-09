import AccountLayout from './AccountLayout';
import InvoicesSection from './InvoicesSection';

export default function AccountReturnsPage() {
    return (
        <AccountLayout
            title="Historial devoluciones"
            subtitle="Consulta las devoluciones asociadas a tu cuenta. Se muestran las facturas cuyo código de serie tiene dos letras."
        >
            {() => <InvoicesSection mode="returns" />}
        </AccountLayout>
    );
}