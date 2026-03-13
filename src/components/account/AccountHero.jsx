import { motion } from 'framer-motion';
import { FileText, ShieldCheck, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const featureItems = [
    {
        title: 'Mis datos',
        description: 'Todos los datos del cliente reunidos en un apartado claro y visual.',
        icon: UserRound,
        path: '/mis-datos',
    },
    {
        title: 'Mis facturas',
        description: 'Consulta el histórico de facturación en una pantalla independiente.',
        icon: FileText,
        path: '/mis-facturas',
    },
    {
        title: 'Panel renovado',
        description: 'Diseño más limpio, actual y preparado para seguir creciendo.',
        icon: ShieldCheck,
    },
];

export default function AccountHero({ linkedCustomersCount, title, subtitle }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 p-8 text-white shadow-[0_30px_80px_rgba(28,25,23,0.22)]"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute right-0 top-10 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-sky-300/10 blur-3xl" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-stone-300">Área cliente</p>

                    <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
                        {subtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-stone-100 backdrop-blur">
                            {linkedCustomersCount} cliente{linkedCustomersCount === 1 ? '' : 's'} vinculado{linkedCustomersCount === 1 ? '' : 's'}
                        </span>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur">
                            Panel separado por secciones
                        </span>
                    </div>
                </div>

                <div className="grid gap-3">
                    {featureItems.map((item, index) => {
                        const Icon = item.icon;
                        const isNavigable = Boolean(item.path);
                        const isActive = item.path && location.pathname === item.path;

                        const content = (
                            <div className="flex items-start gap-3">
                                <div
                                    className={clsx(
                                        'rounded-2xl border p-3 transition',
                                        isActive
                                            ? 'border-white/30 bg-white/20'
                                            : 'border-white/10 bg-white/10'
                                    )}
                                >
                                    <Icon className="h-5 w-5 text-white" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                                    <p className="mt-1 text-sm leading-5 text-stone-300">{item.description}</p>
                                </div>
                            </div>
                        );

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 * index, duration: 0.35 }}
                            >
                                {isNavigable ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate(item.path)}
                                        className={clsx(
                                            'w-full rounded-2xl border p-4 text-left backdrop-blur-md transition duration-200',
                                            isActive
                                                ? 'border-white/30 bg-white/20 shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                                                : 'border-white/10 bg-white/10 hover:bg-white/15 hover:border-white/20 hover:-translate-y-0.5'
                                        )}
                                    >
                                        {content}
                                    </button>
                                ) : (
                                    <article className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                        {content}
                                    </article>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}