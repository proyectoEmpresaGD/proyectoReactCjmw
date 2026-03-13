import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, FileBadge2, Filter, ReceiptText } from 'lucide-react';
import { getInvoices } from '../../services/clientAreaClient';

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

export default function InvoicesSection() {
    const [invoices, setInvoices] = useState([]);
    const [ejercicio, setEjercicio] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function loadInitialYears() {
            try {
                const data = await getInvoices();
                const allInvoices = data.invoices ?? [];
                const years = new Set(allInvoices.map((inv) => inv.ejercicio).filter(Boolean));

                if (!cancelled) {
                    setAvailableYears(Array.from(years).sort((a, b) => b - a));
                }
            } catch {
                if (!cancelled) {
                    setAvailableYears([]);
                }
            }
        }

        loadInitialYears();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadInvoices() {
            try {
                setLoading(true);
                setError('');

                const data = await getInvoices(ejercicio || undefined);

                if (!cancelled) {
                    setInvoices(data.invoices ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'No se pudieron cargar las facturas');
                    setInvoices([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadInvoices();

        return () => {
            cancelled = true;
        };
    }, [ejercicio]);

    const totals = useMemo(() => {
        return invoices.reduce(
            (acc, invoice) => {
                acc.base += Number(invoice.impbase || 0);
                acc.iva += Number(invoice.impiva || 0);
                acc.total += Number(invoice.imptotal || 0);
                return acc;
            },
            { base: 0, iva: 0, total: 0 }
        );
    }, [invoices]);

    const statCards = [
        {
            label: 'Facturas',
            value: invoices.length,
            icon: FileBadge2,
        },
        {
            label: 'Base imponible',
            value: formatCurrency(totals.base),
            icon: ReceiptText,
        },
        {
            label: 'Importe total',
            value: formatCurrency(totals.total),
            icon: CalendarRange,
        },
    ];

    return (
        <section className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <motion.article
                            key={item.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-[0_16px_45px_rgba(28,25,23,0.06)]"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{item.label}</p>
                                    <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">{item.value}</p>
                                </div>
                                <div className="rounded-2xl bg-stone-100 p-3 text-stone-700">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>

            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)]"
            >
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            <ReceiptText className="h-3.5 w-3.5" />
                            Facturación
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Consulta tus facturas</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                            El histórico se muestra con una presentación más clara, legible y adaptada a una futura ampliación del
                            panel del cliente.
                        </p>
                    </div>

                    <label className="flex w-full max-w-xs items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 shadow-sm">
                        <Filter className="h-4 w-4" />

                        <select
                            value={ejercicio}
                            onChange={(e) => setEjercicio(e.target.value)}
                            className="w-full bg-transparent text-sm font-medium text-stone-700 outline-none cursor-pointer"
                        >
                            <option value="">Todos los ejercicios</option>

                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {loading && (
                    <div className="mt-6 grid gap-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-16 animate-pulse rounded-2xl bg-stone-100" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                {!loading && !error && invoices.length === 0 && (
                    <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center">
                        <p className="text-sm font-medium text-stone-700">No hay facturas disponibles con los filtros actuales.</p>
                        <p className="mt-2 text-sm text-stone-500">Cuando existan registros, aparecerán aquí con este nuevo formato.</p>
                    </div>
                )}

                {!loading && !error && invoices.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                        <div className="min-w-[860px] space-y-3">
                            <div className="grid grid-cols-[1fr_1.1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                                <span>Fecha</span>
                                <span>Factura</span>
                                <span>Referencia</span>
                                <span>Año</span>
                                <span>Base</span>
                                <span>IVA</span>
                                <span>Total</span>
                            </div>

                            {invoices.map((invoice, index) => (
                                <motion.div
                                    key={`${invoice.ejercicio}-${invoice.codserfacventa}-${invoice.nfacventa}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03, duration: 0.25 }}
                                    className="grid grid-cols-[1fr_1.1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 rounded-[1.25rem] border border-stone-200 bg-stone-50/80 px-3 py-4 text-sm text-stone-700"
                                >
                                    <span>{formatDate(invoice.fecha)}</span>
                                    <span className="font-medium text-stone-900">
                                        {invoice.sfactura || `${invoice.codserfacventa || ''}${invoice.nfacventa || ''}`}
                                    </span>
                                    <span>{invoice.referencia || '-'}</span>
                                    <span>{invoice.ejercicio || '-'}</span>
                                    <span>{formatCurrency(invoice.impbase)}</span>
                                    <span>{formatCurrency(invoice.impiva)}</span>
                                    <span className="font-semibold text-stone-900">{formatCurrency(invoice.imptotal)}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.section>
        </section>
    );
}