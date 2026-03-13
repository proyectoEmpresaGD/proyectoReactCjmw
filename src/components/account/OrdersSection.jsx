import { motion } from 'framer-motion';
import { ArrowRight, PackageSearch, Sparkles } from 'lucide-react';

const roadmapItems = [
    'Listado de pedidos con estado y fecha',
    'Detalle de líneas, importe y referencia',
    'Seguimiento visual del ciclo del pedido',
];

export default function OrdersSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_55px_rgba(28,25,23,0.08)]"
        >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-700 p-6 text-white">
                    <div className="inline-flex rounded-2xl border border-white/15 bg-white/10 p-3">
                        <PackageSearch className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold tracking-tight">Pedidos listos para entrar en el panel</h2>
                    <p className="mt-3 text-sm leading-6 text-stone-300">
                        Ya queda preparado un bloque visual con la misma línea moderna del área cliente para añadir la lógica real
                        de pedidos cuando conectes el endpoint o los datos desde el ERP.
                    </p>
                </div>

                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        Próxima integración
                    </div>

                    <div className="mt-5 grid gap-3">
                        {roadmapItems.map((item) => (
                            <div key={item} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-700">
                                <span>{item}</span>
                                <ArrowRight className="h-4 w-4 text-stone-400" />
                            </div>
                        ))}
                    </div>

                    <p className="mt-5 text-sm text-stone-500">
                        Ahora mismo este bloque actúa como base visual y estructural para que luego el cambio funcional sea limpio
                        y mantenga el mismo diseño del resto del panel.
                    </p>
                </div>
            </div>
        </motion.section>
    );
}