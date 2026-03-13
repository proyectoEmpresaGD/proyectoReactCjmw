import { motion } from 'framer-motion';
import { Building2, CreditCard, Mail, Phone, ReceiptText } from 'lucide-react';

const customerMeta = [
    {
        key: 'nif',
        label: 'NIF',
        icon: ReceiptText,
        getValue: (customer) => customer.nif || '-',
    },
    {
        key: 'email',
        label: 'Email',
        icon: Mail,
        getValue: (customer) => customer.email || '-',
    },
    {
        key: 'telefono',
        label: 'Teléfono',
        icon: Phone,
        getValue: (customer) => customer.tlfno || customer.movil || '-',
    },
    {
        key: 'pago',
        label: 'Tarifa / pago',
        icon: CreditCard,
        getValue: (customer) => `${customer.codtarifa || '-'} / ${customer.codforpago || '-'}`,
    },
];

export default function CustomerOverviewCard({ customer }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)] backdrop-blur"
        >
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-stone-100 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                        <Building2 className="h-3.5 w-3.5" />
                        Cliente vinculado
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
                        {customer.razclien || customer.nomcomer || 'Cliente'}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-600">
                        <span className="rounded-full bg-stone-100 px-3 py-1.5">Código {customer.codclien || '-'}</span>
                        <span className="rounded-full bg-stone-100 px-3 py-1.5">Empresa {customer.empresa || '-'}</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Estado</p>
                    <p className="mt-1 text-sm font-medium text-emerald-700">Cuenta enlazada correctamente</p>
                </div>
            </div>

            <dl className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {customerMeta.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.key} className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
                            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </dt>
                            <dd className="mt-3 break-words text-sm font-medium text-stone-800">{item.getValue(customer)}</dd>
                        </div>
                    );
                })}
            </dl>
        </motion.article>
    );
}