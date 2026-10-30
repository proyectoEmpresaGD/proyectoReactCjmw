import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    ChevronRight,
    FileText,
    History,
    PackageCheck,
    UserRound,
} from "lucide-react";

import clsx from "clsx";


const accountNavigation = [
    {
        group: "Mi cuenta",
        items: [
            {
                label: "Mis datos",
                path: "/mis-datos",
                icon: UserRound,
                description:
                    "Empresa y dirección",
                activePrefixes: [
                    "/mis-datos",
                ],
            },
        ],
    },
    {
        group: "Documentos",
        items: [
            {
                label: "Mis facturas",
                path: "/mis-facturas",
                icon: FileText,
                description:
                    "Facturas emitidas",
                activePrefixes: [
                    "/mis-facturas",
                    "/account/invoices",
                ],
            },
            {
                label: "Mis pedidos",
                path: "/mis-pedidos",
                icon: PackageCheck,
                description:
                    "Servidos y pendientes",
                activePrefixes: [
                    "/mis-pedidos",
                    "/account/orders",
                ],
            },
            {
                label:
                    "Historial devoluciones",
                path:
                    "/historial-devoluciones",
                icon: History,
                description:
                    "Documentos de devolución",
                activePrefixes: [
                    "/historial-devoluciones",
                ],
            },
        ],
    },
];


function isItemActive(
    pathname,
    item
) {
    return item.activePrefixes.some(
        prefix =>
            pathname === prefix ||
            pathname.startsWith(
                `${prefix}/`
            )
    );
}


export default function AccountSidebar({
    customer,
}) {
    const {
        pathname,
    } = useLocation();


    return (
        <aside
            className="
                min-w-0
            "
        >
            <div
                className="
                    -mx-4
                    overflow-x-auto
                    px-4
                    pb-1

                    sm:-mx-6
                    sm:px-6

                    lg:hidden
                "
            >
                <nav
                    className="
                        flex
                        min-w-max
                        gap-2
                    "
                >
                    {accountNavigation
                        .flatMap(
                            group =>
                                group.items
                        )
                        .map(
                            item => {
                                const Icon =
                                    item.icon;

                                const active =
                                    isItemActive(
                                        pathname,
                                        item
                                    );

                                return (
                                    <Link
                                        key={
                                            item.path
                                        }
                                        to={
                                            item.path
                                        }
                                        className={clsx(
                                            "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                                            active
                                                ? "border-stone-950 bg-stone-950 text-white"
                                                : "border-stone-300 bg-white/70 text-stone-600 hover:border-stone-500 hover:text-stone-950"
                                        )}
                                    >
                                        <Icon
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        {
                                            item.label
                                        }
                                    </Link>
                                );
                            }
                        )}
                </nav>
            </div>


            <div
                className="
                    hidden

                    lg:sticky
                    lg:top-[112px]
                    lg:block
                "
            >
                <div
                    className="
                        overflow-hidden
                        rounded-[26px]
                        border
                        border-stone-300/80
                        bg-white/80
                    "
                >
                    <div
                        className="
                            bg-stone-950
                            px-5
                            py-6
                            text-white
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-stone-400
                            "
                        >
                            Panel privado
                        </p>

                        <p
                            className="
                                mt-3
                                line-clamp-2
                                text-base
                                font-medium
                                leading-6
                                text-white
                            "
                        >
                            {customer?.razclien ||
                                customer?.nomcomer ||
                                "Mi cuenta"}
                        </p>

                        <p
                            className="
                                mt-2
                                text-xs
                                text-stone-400
                            "
                        >
                            Código{" "}
                            {customer?.codclien ||
                                "-"}
                        </p>
                    </div>


                    <nav
                        className="
                            px-3
                            py-4
                        "
                    >
                        {accountNavigation.map(
                            group => (
                                <div
                                    key={
                                        group.group
                                    }
                                    className="first:mt-0 [&:not(:first-child)]:mt-5"
                                >
                                    <p
                                        className="
                                            mb-2
                                            px-3
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.2em]
                                            text-stone-400
                                        "
                                    >
                                        {
                                            group.group
                                        }
                                    </p>

                                    <div
                                        className="
                                            space-y-1
                                        "
                                    >
                                        {group.items.map(
                                            item => {
                                                const Icon =
                                                    item.icon;

                                                const active =
                                                    isItemActive(
                                                        pathname,
                                                        item
                                                    );

                                                return (
                                                    <Link
                                                        key={
                                                            item.path
                                                        }
                                                        to={
                                                            item.path
                                                        }
                                                        className={clsx(
                                                            "group flex items-center gap-3 rounded-[16px] px-3 py-3 transition",
                                                            active
                                                                ? "bg-[#f1eee8] text-stone-950"
                                                                : "text-stone-500 hover:bg-stone-50 hover:text-stone-950"
                                                        )}
                                                    >
                                                        <span
                                                            className={clsx(
                                                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
                                                                active
                                                                    ? "border-stone-950 bg-stone-950 text-white"
                                                                    : "border-stone-200 bg-white text-stone-500 group-hover:border-stone-300"
                                                            )}
                                                        >
                                                            <Icon
                                                                className="
                                                                    h-4
                                                                    w-4
                                                                "
                                                            />
                                                        </span>

                                                        <span
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    block
                                                                    text-sm
                                                                    font-medium
                                                                "
                                                            >
                                                                {
                                                                    item.label
                                                                }
                                                            </span>

                                                            <span
                                                                className="
                                                                    mt-0.5
                                                                    block
                                                                    truncate
                                                                    text-[11px]
                                                                    text-stone-400
                                                                "
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                        </span>

                                                        <ChevronRight
                                                            className={clsx(
                                                                "h-4 w-4 shrink-0 transition",
                                                                active
                                                                    ? "text-stone-900"
                                                                    : "text-stone-300 group-hover:translate-x-0.5 group-hover:text-stone-500"
                                                            )}
                                                        />
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
