import {
    useState,
} from "react";

import {
    ChevronDown,
    ChevronUp,
    FileClock,
} from "lucide-react";


function formatDate(
    value
) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    ).format(
        new Date(
            value
        )
    );
}


function formatCurrency(
    value
) {
    return new Intl.NumberFormat(
        "es-ES",
        {
            style: "currency",
            currency: "EUR",
        }
    ).format(
        Number(
            value ||
                0
        )
    );
}


export default function DeliveryNotesSection({
    deliveryNotes = [],
}) {
    const [
        openDeliveryNoteId,
        setOpenDeliveryNoteId,
    ] = useState(null);


    if (
        !deliveryNotes.length
    ) {
        return (
            <section
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-[26px]
                    border
                    border-stone-300/80
                    bg-white/55
                    px-6
                    py-7

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-4
                    "
                >
                    <span
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-stone-500
                        "
                    >
                        <FileClock
                            className="
                                h-4
                                w-4
                            "
                        />
                    </span>

                    <div>
                        <h2
                            className="
                                text-sm
                                font-medium
                                text-stone-900
                            "
                        >
                            Albaranes sin factura
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-stone-500
                            "
                        >
                            No tienes albaranes pendientes de factura.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        w-fit
                        rounded-full
                        bg-emerald-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-emerald-700
                    "
                >
                    Todo al día
                </span>
            </section>
        );
    }


    return (
        <section
            className="
                overflow-hidden
                rounded-[26px]
                border
                border-stone-300/80
                bg-white
            "
        >
            <div
                className="
                    border-b
                    border-stone-200
                    px-6
                    py-5
                "
            >
                <p
                    className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]
                        text-stone-400
                    "
                >
                    Pendientes
                </p>

                <div
                    className="
                        mt-2
                        flex
                        items-end
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <h2
                            className="
                                text-xl
                                font-light
                                tracking-[-0.025em]
                                text-stone-950
                            "
                        >
                            Albaranes sin factura
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-stone-500
                            "
                        >
                            Documentos que todavía no tienen factura asociada.
                        </p>
                    </div>

                    <span
                        className="
                            text-sm
                            font-medium
                            text-stone-500
                        "
                    >
                        {
                            deliveryNotes.length
                        }
                    </span>
                </div>
            </div>


            <div>
                {deliveryNotes.map(
                    deliveryNote => {
                        const deliveryNoteId =
                            [
                                deliveryNote.ejercicio,
                                deliveryNote.codseralbventa,
                                deliveryNote.nalbventa,
                            ].join(
                                "-"
                            );

                        const isOpen =
                            openDeliveryNoteId ===
                            deliveryNoteId;


                        return (
                            <article
                                key={
                                    deliveryNoteId
                                }
                                className="
                                    border-b
                                    border-stone-200
                                    last:border-b-0
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenDeliveryNoteId(
                                            isOpen
                                                ? null
                                                : deliveryNoteId
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        flex-col
                                        gap-4
                                        px-6
                                        py-5
                                        text-left
                                        transition

                                        hover:bg-[#fbfaf8]

                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-base
                                                font-medium
                                                text-stone-900
                                            "
                                        >
                                            Albarán{" "}
                                            {
                                                deliveryNote.codseralbventa
                                            }
                                            {
                                                deliveryNote.nalbventa
                                            }
                                        </p>

                                        <div
                                            className="
                                                mt-2
                                                flex
                                                flex-wrap
                                                gap-x-5
                                                gap-y-1
                                                text-xs
                                                text-stone-500
                                            "
                                        >
                                            <span>
                                                {formatDate(
                                                    deliveryNote.fecha
                                                )}
                                            </span>

                                            {deliveryNote.referencia && (
                                                <span>
                                                    Ref.{" "}
                                                    {
                                                        deliveryNote.referencia
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-5

                                            md:justify-end
                                        "
                                    >
                                        <div
                                            className="
                                                md:text-right
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-[0.15em]
                                                    text-stone-400
                                                "
                                            >
                                                Total
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-lg
                                                    font-light
                                                    text-stone-950
                                                "
                                            >
                                                {formatCurrency(
                                                    deliveryNote.imptotalbaran ||
                                                        deliveryNote.imptotal
                                                )}
                                            </p>
                                        </div>

                                        {isOpen ? (
                                            <ChevronUp
                                                className="
                                                    h-4
                                                    w-4
                                                    text-stone-400
                                                "
                                            />
                                        ) : (
                                            <ChevronDown
                                                className="
                                                    h-4
                                                    w-4
                                                    text-stone-400
                                                "
                                            />
                                        )}
                                    </div>
                                </button>


                                {isOpen && (
                                    <div
                                        className="
                                            border-t
                                            border-stone-200
                                            bg-[#fbfaf8]
                                            px-6
                                            py-5
                                        "
                                    >
                                        {!deliveryNote.lineas
                                            ?.length ? (
                                            <p
                                                className="
                                                    text-sm
                                                    text-stone-500
                                                "
                                            >
                                                Este albarán no tiene líneas asociadas.
                                            </p>
                                        ) : (
                                            <div
                                                className="
                                                    overflow-x-auto
                                                "
                                            >
                                                <table
                                                    className="
                                                        min-w-full
                                                        text-sm
                                                    "
                                                >
                                                    <thead>
                                                        <tr
                                                            className="
                                                                border-b
                                                                border-stone-300
                                                                text-left
                                                                text-[10px]
                                                                font-semibold
                                                                uppercase
                                                                tracking-[0.14em]
                                                                text-stone-400
                                                            "
                                                        >
                                                            <th
                                                                className="
                                                                    py-3
                                                                    pr-5
                                                                    font-semibold
                                                                "
                                                            >
                                                                Código
                                                            </th>

                                                            <th
                                                                className="
                                                                    py-3
                                                                    pr-5
                                                                    font-semibold
                                                                "
                                                            >
                                                                Producto
                                                            </th>

                                                            <th
                                                                className="
                                                                    py-3
                                                                    pr-5
                                                                    text-right
                                                                    font-semibold
                                                                "
                                                            >
                                                                Cantidad
                                                            </th>

                                                            <th
                                                                className="
                                                                    py-3
                                                                    pr-5
                                                                    text-right
                                                                    font-semibold
                                                                "
                                                            >
                                                                Precio
                                                            </th>

                                                            <th
                                                                className="
                                                                    py-3
                                                                    text-right
                                                                    font-semibold
                                                                "
                                                            >
                                                                Importe
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {deliveryNote.lineas.map(
                                                            linea => (
                                                                <tr
                                                                    key={
                                                                        linea.linea
                                                                    }
                                                                    className="
                                                                        border-b
                                                                        border-stone-200
                                                                        last:border-0
                                                                    "
                                                                >
                                                                    <td
                                                                        className="
                                                                            py-3
                                                                            pr-5
                                                                            text-stone-500
                                                                        "
                                                                    >
                                                                        {linea.codprodu ||
                                                                            "-"}
                                                                    </td>

                                                                    <td
                                                                        className="
                                                                            py-3
                                                                            pr-5
                                                                            font-medium
                                                                            text-stone-900
                                                                        "
                                                                    >
                                                                        {linea.desprodu ||
                                                                            "-"}
                                                                    </td>

                                                                    <td
                                                                        className="
                                                                            py-3
                                                                            pr-5
                                                                            text-right
                                                                            text-stone-500
                                                                        "
                                                                    >
                                                                        {linea.cantidad ??
                                                                            "-"}{" "}
                                                                        {linea.unidadventa ||
                                                                            ""}
                                                                    </td>

                                                                    <td
                                                                        className="
                                                                            py-3
                                                                            pr-5
                                                                            text-right
                                                                            text-stone-500
                                                                        "
                                                                    >
                                                                        {formatCurrency(
                                                                            linea.precio
                                                                        )}
                                                                    </td>

                                                                    <td
                                                                        className="
                                                                            py-3
                                                                            text-right
                                                                            font-medium
                                                                            text-stone-900
                                                                        "
                                                                    >
                                                                        {formatCurrency(
                                                                            linea.importe
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    }
                )}
            </div>
        </section>
    );
}
