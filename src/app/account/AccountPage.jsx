import { Navigate } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';
import InvoicesSection from '../../components/account/InvoicesSection';
function CustomerCard({ customer }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Cliente vinculado</p>
          <h2 className="mt-2 text-xl font-medium text-stone-900">{customer.razclien || customer.nomcomer || 'Cliente'}</h2>
          <p className="mt-1 text-sm text-stone-600">Código cliente: {customer.codclien}</p>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
          Empresa {customer.empresa}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-stone-500">NIF</dt>
          <dd className="mt-1 text-sm text-stone-800">{customer.nif || '-'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-stone-500">Email</dt>
          <dd className="mt-1 text-sm text-stone-800 break-all">{customer.email || '-'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-stone-500">Teléfono</dt>
          <dd className="mt-1 text-sm text-stone-800">{customer.tlfno || customer.movil || '-'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-stone-500">Tarifa / forma de pago</dt>
          <dd className="mt-1 text-sm text-stone-800">
            {customer.codtarifa || '-'} / {customer.codforpago || '-'}
          </dd>
        </div>
      </dl>
      <InvoicesSection />
    </article>

  );
}

export default function AccountPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const linkedCustomers = user?.linkedCustomers ?? [];

  return (
    <CartProvider>
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Área cliente</p>
            <h1 className="mt-2 text-3xl font-light text-stone-900">Mi cuenta</h1>
            <p className="mt-3 max-w-2xl text-sm text-stone-600">
              Ya tienes la sesión enlazada con tus clientes reales del ERP a través del NIF. El siguiente paso será colgar aquí
              facturas, presupuestos y la documentación privada de cada código de cliente.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
              Cargando tu sesión...
            </div>
          ) : linkedCustomers.length ? (
            <div className="grid gap-5">
              {linkedCustomers.map((customer) => (
                <CustomerCard key={`${customer.empresa}-${customer.codclien}`} customer={customer} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              Tu cuenta no tiene clientes vinculados en este momento.
            </div>
          )}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
