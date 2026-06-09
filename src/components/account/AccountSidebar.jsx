import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    ChevronRight,
    History,
    PackageCheck,
    UserRound,
} from 'lucide-react';

const sidebarGroups = [
    {
        title: 'Mi cuenta',
        items: [
            {
                label: 'Mis datos',
                path: '/mis-datos',
                icon: UserRound,
                description: 'Empresa y dirección',
            },
        ],
    },
    {
        title: 'Pedidos y devoluciones',
        items: [
            {
                label: 'Mis pedidos',
                path: '/mis-pedidos',
                icon: PackageCheck,
                description: 'Pedidos y facturas',
            },
            {
                label: 'Historial devoluciones',
                path: '/historial-devoluciones',
                icon: History,
                description: 'Facturas de devolución',
            },
        ],
    },
];

export default function AccountSidebar() {
    return (
        <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.25rem] border border-stone-200 bg-white p-3 shadow-sm">
                <div className="border-b border-stone-200 px-3 pb-4 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                        Área cliente
                    </p>

                    <h2 className="mt-1 text-lg font-bold tracking-tight text-stone-900">
                        Panel privado
                    </h2>
                </div>

                <nav className="mt-4 grid gap-5">
                    {sidebarGroups.map((group) => (
                        <div key={group.title}>
                            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                {group.title}
                            </p>

                            <div className="grid gap-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                clsx(
                                                    'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition',
                                                    isActive
                                                        ? 'bg-stone-900 text-white shadow-sm'
                                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <span
                                                        className={clsx(
                                                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition',
                                                            isActive
                                                                ? 'bg-white/10 text-white'
                                                                : 'bg-stone-100 text-stone-500 group-hover:bg-white group-hover:text-stone-900'
                                                        )}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block font-semibold">
                                                            {item.label}
                                                        </span>

                                                        <span
                                                            className={clsx(
                                                                'mt-0.5 block truncate text-xs',
                                                                isActive
                                                                    ? 'text-stone-300'
                                                                    : 'text-stone-400'
                                                            )}
                                                        >
                                                            {item.description}
                                                        </span>
                                                    </span>

                                                    <ChevronRight
                                                        className={clsx(
                                                            'h-4 w-4 shrink-0 transition',
                                                            isActive
                                                                ? 'text-white'
                                                                : 'text-stone-300 group-hover:text-stone-600'
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}