import { motion } from 'framer-motion';
import {
    Building2,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    ReceiptText,
    UserRound,
} from 'lucide-react';

const profileFields = [
    {
        key: 'razclien',
        label: 'Razón social',
        icon: Building2,
        getValue: (customer) => customer.razclien || customer.nomcomer || '-',
    },
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
        key: 'direccion',
        label: 'Dirección',
        icon: MapPin,
        getValue: (customer) => customer.direccion || customer.dirclien || '-',
    },
    {
        key: 'poblacion',
        label: 'Población',
        icon: MapPin,
        getValue: (customer) => customer.poblacion || '-',
    },
    {
        key: 'provincia',
        label: 'Provincia',
        icon: MapPin,
        getValue: (customer) => customer.provincia || '-',
    },
    {
        key: 'cp',
        label: 'Código postal',
        icon: MapPin,
        getValue: (customer) => customer.codpostal || customer.cp || '-',
    },
    {
        key: 'pais',
        label: 'País',
        icon: MapPin,
        getValue: (customer) => customer.pais || '-',
    },
];

export default function ProfileSection({ customer }) {
    return (
        <section className="grid gap-5">
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
                            <UserRound className="h-3.5 w-3.5" />
                            Mis datos
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
                            {customer.razclien || customer.nomcomer || 'Cliente'}
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                            Aquí se muestran los datos principales asociados a tu cuenta de cliente.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-right">
                        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Estado</p>
                        <p className="mt-1 text-sm font-medium text-emerald-700">Perfil vinculado correctamente</p>
                    </div>
                </div>
            </motion.article>

            <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)]"
            >
                <div className="border-b border-stone-200 pb-5">
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900">Datos del cliente</h3>
                    <p className="mt-2 text-sm text-stone-500">
                        Información principal de contacto, localización y condiciones del cliente.
                    </p>
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {profileFields.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03, duration: 0.25 }}
                                className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4"
                            >
                                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </dt>
                                <dd className="mt-3 break-words text-sm font-medium text-stone-800">
                                    {item.getValue(customer)}
                                </dd>
                            </motion.div>
                        );
                    })}
                </dl>
            </motion.article>
        </section>
    );
}