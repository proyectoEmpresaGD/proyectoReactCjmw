import clsx from 'clsx';
import { motion } from 'framer-motion';

export const ACCOUNT_SECTIONS = [
    { key: 'perfil', label: 'Mi perfil' },
    { key: 'facturas', label: 'Facturas' },
];

export default function AccountTabs({ activeSection, onChange }) {
    return (
        <div className="inline-flex flex-wrap gap-2 rounded-full border border-stone-200 bg-white/80 p-2 shadow-sm backdrop-blur">
            {ACCOUNT_SECTIONS.map((section) => {
                const isActive = activeSection === section.key;

                return (
                    <button
                        key={section.key}
                        type="button"
                        onClick={() => onChange(section.key)}
                        className={clsx(
                            'relative rounded-full px-5 py-2.5 text-sm font-medium transition',
                            isActive ? 'text-white' : 'text-stone-600 hover:text-stone-900'
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="account-tab-highlight"
                                className="absolute inset-0 rounded-full bg-stone-900"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{section.label}</span>
                    </button>
                );
            })}
        </div>
    );
}