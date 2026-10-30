import {
    NavLink,
} from "react-router-dom";

import clsx from "clsx";

import {
    FileText,
    History,
    PackageCheck,
    UserRound,
} from "lucide-react";


const accountItems = [
    {
        label:
            "Mis datos",

        path:
            "/mis-datos",

        icon:
            UserRound,
    },

    {
        label:
            "Facturas",

        path:
            "/mis-facturas",

        icon:
            FileText,
    },

    {
        label:
            "Pedidos",

        path:
            "/mis-pedidos",

        icon:
            PackageCheck,
    },

    {
        label:
            "Devoluciones",

        path:
            "/historial-devoluciones",

        icon:
            History,
    },
];


export default function AccountNavigation() {
    return (
        <div
            className="
                sticky
                top-[72px]
                z-[30]
                border-b
                border-stone-200
                bg-[#f7f6f3]/95
                backdrop-blur-xl

                sm:top-[80px]

                lg:top-[88px]
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    overflow-x-auto
                    px-5

                    sm:px-8

                    lg:px-10

                    2xl:px-0
                "
            >
                <nav
                    className="
                        flex
                        min-w-max
                        items-center
                        gap-8

                        sm:gap-10

                        lg:gap-12
                    "
                    aria-label="Navegación del área cliente"
                >
                    {accountItems.map(
                        (
                            item
                        ) => {
                            const Icon =
                                item.icon;

                            return (
                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        clsx(
                                            `
                                                group
                                                relative
                                                flex
                                                h-16
                                                items-center
                                                gap-2.5
                                                text-sm
                                                font-medium
                                                transition-colors

                                                after:absolute
                                                after:bottom-0
                                                after:left-0
                                                after:h-px
                                                after:w-full
                                                after:origin-left
                                                after:transition-transform
                                                after:duration-300
                                            `,
                                            isActive
                                                ? `
                                                    text-stone-950
                                                    after:scale-x-100
                                                    after:bg-stone-950
                                                `
                                                : `
                                                    text-stone-450
                                                    after:scale-x-0
                                                    after:bg-stone-950

                                                    hover:text-stone-950
                                                    hover:after:scale-x-100
                                                `
                                        )
                                    }
                                >
                                    {({
                                        isActive,
                                    }) => (
                                        <>
                                            <Icon
                                                className={clsx(
                                                    "h-4 w-4 transition",
                                                    isActive
                                                        ? "text-stone-950"
                                                        : "text-stone-400 group-hover:text-stone-700"
                                                )}
                                            />

                                            <span>
                                                {
                                                    item.label
                                                }
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        }
                    )}
                </nav>
            </div>
        </div>
    );
}
