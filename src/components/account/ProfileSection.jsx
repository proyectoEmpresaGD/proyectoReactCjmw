import {
    motion,
} from "framer-motion";

import {
    BadgeCheck,
    Building2,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    ReceiptText,
} from "lucide-react";


const profileFields = [
    {
        key: "razclien",
        label: "Razón social",
        icon: Building2,
        getValue: customer =>
            customer.razclien ||
            customer.nomcomer ||
            "-",
    },
    {
        key: "nif",
        label: "NIF",
        icon: ReceiptText,
        getValue: customer =>
            customer.nif ||
            "-",
    },
    {
        key: "email",
        label: "Email",
        icon: Mail,
        getValue: customer =>
            customer.email ||
            "-",
    },
    {
        key: "telefono",
        label: "Teléfono",
        icon: Phone,
        getValue: customer =>
            customer.tlfno ||
            customer.movil ||
            "-",
    },
    {
        key: "direccion",
        label: "Dirección",
        icon: MapPin,
        getValue: customer =>
            customer.direccion ||
            customer.dirclien ||
            "-",
    },
    {
        key: "poblacion",
        label: "Población",
        icon: MapPin,
        getValue: customer =>
            customer.poblacion ||
            "-",
    },
    {
        key: "provincia",
        label: "Provincia",
        icon: MapPin,
        getValue: customer =>
            customer.provincia ||
            "-",
    },
    {
        key: "cp",
        label: "Código postal",
        icon: MapPin,
        getValue: customer =>
            customer.codpostal ||
            customer.cp ||
            "-",
    },
    {
        key: "pais",
        label: "País",
        icon: MapPin,
        getValue: customer =>
            customer.pais ||
            "-",
    },
];


export default function ProfileSection({
    customer,
}) {
    return (
        <div
            className="
                grid
                gap-5
            "
        >
            <motion.section
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                }}
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-stone-300/80
                    bg-white
                "
            >
                <div
                    className="
                        grid

                        xl:grid-cols-[1.1fr_0.9fr]
                    "
                >
                    <div
                        className="
                            p-6

                            sm:p-8
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-stone-400
                            "
                        >
                            Cliente vinculado
                        </p>

                        <h2
                            className="
                                mt-3
                                max-w-2xl
                                text-2xl
                                font-light
                                tracking-[-0.035em]
                                text-stone-950

                                sm:text-3xl
                            "
                        >
                            {customer.razclien ||
                                customer.nomcomer ||
                                "Cliente"}
                        </h2>

                        <div
                            className="
                                mt-5
                                flex
                                flex-wrap
                                gap-x-6
                                gap-y-3
                                text-sm
                                text-stone-500
                            "
                        >
                            <span>
                                Código{" "}
                                <strong
                                    className="
                                        font-medium
                                        text-stone-900
                                    "
                                >
                                    {customer.codclien ||
                                        "-"}
                                </strong>
                            </span>

                            <span>
                                Empresa{" "}
                                <strong
                                    className="
                                        font-medium
                                        text-stone-900
                                    "
                                >
                                    {customer.empresa ||
                                        "-"}
                                </strong>
                            </span>
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            bg-stone-950
                            p-6
                            text-white

                            sm:p-8
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/10
                                "
                            >
                                <BadgeCheck
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.23em]
                                    text-stone-400
                                "
                            >
                                Estado de la cuenta
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-light
                                    text-white
                                "
                            >
                                Perfil vinculado correctamente
                            </p>

                            <p
                                className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-stone-400
                                "
                            >
                                Estos datos proceden de tu ficha de cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>


            <motion.section
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                    delay: 0.04,
                }}
                className="
                    rounded-[28px]
                    border
                    border-stone-300/80
                    bg-white
                    p-6

                    sm:p-8
                "
            >
                <div
                    className="
                        border-b
                        border-stone-200
                        pb-5
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
                        Información
                    </p>

                    <h3
                        className="
                            mt-2
                            text-xl
                            font-light
                            tracking-[-0.025em]
                            text-stone-950
                        "
                    >
                        Datos del cliente
                    </h3>
                </div>

                <dl
                    className="
                        grid

                        md:grid-cols-2

                        xl:grid-cols-3
                    "
                >
                    {profileFields.map(
                        (
                            item,
                            index
                        ) => {
                            const Icon =
                                item.icon;

                            return (
                                <motion.div
                                    key={
                                        item.key
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            0.03 *
                                            index,
                                        duration:
                                            0.22,
                                    }}
                                    className="
                                        border-b
                                        border-stone-200
                                        py-5

                                        md:px-5
                                        md:[&:nth-child(odd)]:pl-0

                                        xl:[&:nth-child(3n+1)]:pl-0
                                    "
                                >
                                    <dt
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.16em]
                                            text-stone-400
                                        "
                                    >
                                        <Icon
                                            className="
                                                h-3.5
                                                w-3.5
                                            "
                                        />

                                        {
                                            item.label
                                        }
                                    </dt>

                                    <dd
                                        className="
                                            mt-2
                                            break-words
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-stone-800
                                        "
                                    >
                                        {item.getValue(
                                            customer
                                        )}
                                    </dd>
                                </motion.div>
                            );
                        }
                    )}
                </dl>

                {(customer.codtarifa ||
                    customer.codforpago) && (
                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            border-l-2
                            border-stone-300
                            bg-[#faf9f7]
                            px-4
                            py-3
                        "
                    >
                        <CreditCard
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-stone-500
                            "
                        />

                        <div>
                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-stone-800
                                "
                            >
                                Condiciones comerciales
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-stone-500
                                "
                            >
                                Tarifa{" "}
                                {customer.codtarifa ||
                                    "-"}{" "}
                                · Forma de pago{" "}
                                {customer.codforpago ||
                                    "-"}
                            </p>
                        </div>
                    </div>
                )}
            </motion.section>
        </div>
    );
}
