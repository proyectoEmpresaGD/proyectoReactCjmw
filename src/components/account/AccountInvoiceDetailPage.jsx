import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CalendarRange,
    FileText,
    ImageOff,
    ReceiptText,
} from 'lucide-react';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getInvoiceDetail } from '../../services/clientAreaClient';

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('es-ES');
}

function getDeliveryNoteKey(albaran) {
    return [
        albaran.ejercicio,
        albaran.canal,
        albaran.codseralbventa,
        albaran.nalbventa,
    ].join('-');
}

function getLineKey(albaran, linea) {
    return [
        albaran.ejercicio,
        albaran.canal,
        albaran.codseralbventa,
        albaran.nalbventa,
        linea.linea,
        linea.codprodu,
    ].join('-');
}

function ProductImage({ linea }) {
    const imageAlt =
        linea.imagenDescripcion ||
        linea.imagenNombre ||
        linea.desprodu ||
        linea.codprodu ||
        'Producto';

    if (!linea.imagenProducto) {
        return (
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-stone-200 bg-stone-100 text-stone-400">
                <ImageOff className="h-5 w-5" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Sin imagen
                </span>
            </div>
        );
    }

    return (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <img
                src={linea.imagenProducto}
                alt={imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(event) => {
                    event.currentTarget.style.display = 'none';
                }}
            />
        </div>
    );
}

function ProductLineCard({ linea }) {
    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
                <ProductImage linea={linea} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                                    {linea.codprodu || 'Sin código'}
                                </span>

                                {linea.referencia && (
                                    <span className="rounded-full bg-stone-50 px-2.5 py-1 text-xs text-stone-500">
                                        Ref: {linea.referencia}
                                    </span>
                                )}
                            </div>

                            <h4 className="mt-2 text-sm font-semibold leading-5 text-stone-900 md:text-base">
                                {linea.desprodu || 'Producto sin descripción'}
                            </h4>

                            {linea.comentario && (
                                <p className="mt-1 text-sm leading-5 text-stone-500">
                                    {linea.comentario}
                                </p>
                            )}
                        </div>

                        <div className="shrink-0 rounded-xl bg-stone-900 px-4 py-3 text-white lg:min-w-[140px] lg:text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                                Importe
                            </p>
                            <p className="mt-1 text-base font-semibold">
                                {formatCurrency(linea.importe)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                        <div className="rounded-xl bg-stone-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                                Cantidad
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {linea.cantidad ?? '-'} {linea.unidadventa || ''}
                            </p>
                        </div>

                        <div className="rounded-xl bg-stone-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                                Precio
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {formatCurrency(linea.precio)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-stone-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                                Descuento
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {Number(linea.dt1 || 0)}%
                            </p>
                        </div>

                        <div className="rounded-xl bg-stone-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                                IVA
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {linea.codiva || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function DeliveryNoteBlock({ albaran }) {
    return (
        <section className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
            <div className="mb-4 flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                        Albarán asociado
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-stone-900">
                        {albaran.codseralbventa}/{albaran.nalbventa}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                        <span>Fecha: {formatDate(albaran.fecha)}</span>

                        {albaran.referencia && (
                            <span>Referencia: {albaran.referencia}</span>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-white px-4 py-3 shadow-sm md:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                        Total albarán
                    </p>
                    <p className="mt-1 text-base font-semibold text-stone-900">
                        {formatCurrency(albaran.imptotalbaran || albaran.imptotal)}
                    </p>
                </div>
            </div>

            {!albaran.lineas?.length ? (
                <p className="text-sm text-stone-500">
                    Este albarán no tiene líneas.
                </p>
            ) : (
                <div className="grid gap-3">
                    {albaran.lineas.map((linea) => (
                        <ProductLineCard
                            key={getLineKey(albaran, linea)}
                            linea={linea}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function AccountInvoiceDetailPage() {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { ejercicio, codserfacventa, nfacventa } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadInvoiceDetail() {
            try {
                setLoading(true);
                setError('');

                const data = await getInvoiceDetail({
                    ejercicio,
                    codserfacventa,
                    nfacventa,
                });

                if (!cancelled) {
                    setInvoice(data.invoice);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'No se pudo cargar el detalle de la factura');
                    setInvoice(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (!authLoading && isAuthenticated) {
            loadInvoiceDetail();
        }

        return () => {
            cancelled = true;
        };
    }, [authLoading, isAuthenticated, ejercicio, codserfacventa, nfacventa]);

    if (!authLoading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <CartProvider>
            <div className="min-h-screen mt-[5%] bg-[radial-gradient(circle_at_top,#f5f5f4,white_40%,#fafaf9)]">
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                    <button
                        type="button"
                        onClick={() => navigate('/mis-facturas')}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a mis facturas
                    </button>

                    {loading || authLoading ? (
                        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="h-8 w-64 animate-pulse rounded-xl bg-stone-100" />
                            <div className="mt-5 h-28 animate-pulse rounded-2xl bg-stone-100" />
                            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-stone-100" />
                        </div>
                    ) : error ? (
                        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : !invoice ? (
                        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                            No se ha encontrado la factura.
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-6"
                        >
                            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)]">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                                            <FileText className="h-3.5 w-3.5" />
                                            Detalle de factura
                                        </div>

                                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
                                            {invoice.sfactura ||
                                                `${invoice.codserfacventa || ''}${invoice.nfacventa || ''}`}
                                        </h1>

                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                                            <span>Fecha: {formatDate(invoice.s)}</span>
                                            <span>Año: {invoice.ejercicio || '-'}</span>

                                            {invoice.referencia && (
                                                <span>Referencia: {invoice.referencia}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                                        <div className="rounded-2xl bg-stone-50 px-4 py-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                                Base
                                            </p>
                                            <p className="mt-1 font-semibold text-stone-900">
                                                {formatCurrency(invoice.impbase)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-stone-50 px-4 py-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                                IVA
                                            </p>
                                            <p className="mt-1 font-semibold text-stone-900">
                                                {formatCurrency(invoice.impiva)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-stone-900 px-4 py-3 text-white">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                                                Total
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {formatCurrency(invoice.imptotal)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 md:grid-cols-3">


                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            Serie
                                        </p>
                                        <p className="mt-1 font-semibold text-stone-900">
                                            {invoice.codserfacventa || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            Número
                                        </p>
                                        <p className="mt-1 font-semibold text-stone-900">
                                            {invoice.nfacventa || '-'}
                                        </p>
                                    </div>
                                </div>

                                {invoice.comentario && (
                                    <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            Comentario
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-stone-700">
                                            {invoice.comentario}
                                        </p>
                                    </div>
                                )}
                            </section>

                            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)]">
                                <div className="mb-5 flex items-center gap-2">
                                    <ReceiptText className="h-5 w-5 text-stone-600" />
                                    <h2 className="text-xl font-semibold text-stone-900">
                                        Albaranes y productos
                                    </h2>
                                </div>

                                {!invoice.albaranes?.length ? (
                                    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center text-sm text-stone-500">
                                        Esta factura no tiene albaranes asociados.
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {invoice.albaranes.map((albaran) => (
                                            <DeliveryNoteBlock
                                                key={getDeliveryNoteKey(albaran)}
                                                albaran={albaran}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </motion.div>
                    )}
                </main>

                <Footer />
            </div>
        </CartProvider>
    );
}