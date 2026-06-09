import { useState } from "react";

function formatDate(value) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function formatCurrency(value) {
    const numericValue = Number(value || 0);

    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(numericValue);
}

export default function DeliveryNotesSection({ deliveryNotes = [] }) {
    const [openDeliveryNoteId, setOpenDeliveryNoteId] = useState(null);

    if (!deliveryNotes.length) {
        return (
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    Albaranes sin factura
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    No tienes albaranes pendientes de factura.
                </p>
            </section>
        );
    }

    return (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    Albaranes sin factura
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Albaranes del cliente que todavía no tienen factura asociada.
                </p>
            </div>

            <div className="space-y-3">
                {deliveryNotes.map((deliveryNote) => {
                    const deliveryNoteId = [
                        deliveryNote.ejercicio,
                        deliveryNote.codseralbventa,
                        deliveryNote.nalbventa,
                    ].join("-");

                    const isOpen = openDeliveryNoteId === deliveryNoteId;

                    return (
                        <article
                            key={deliveryNoteId}
                            className="rounded-lg border border-slate-200"
                        >
                            <button
                                type="button"
                                className="flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-center md:justify-between"
                                onClick={() =>
                                    setOpenDeliveryNoteId(isOpen ? null : deliveryNoteId)
                                }
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Albarán {deliveryNote.codseralbventa}
                                        /
                                        {deliveryNote.nalbventa}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Fecha: {formatDate(deliveryNote.fecha)}
                                    </p>

                                    {deliveryNote.referencia && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            Ref: {deliveryNote.referencia}
                                        </p>
                                    )}
                                </div>

                                <div className="text-left md:text-right">
                                    <p className="text-sm text-slate-500">
                                        Total
                                    </p>

                                    <p className="text-base font-semibold text-slate-900">
                                        {formatCurrency(
                                            deliveryNote.imptotalbaran ||
                                            deliveryNote.imptotal
                                        )}
                                    </p>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border-t border-slate-200 p-4">
                                    {!deliveryNote.lineas?.length ? (
                                        <p className="text-sm text-slate-500">
                                            Este albarán no tiene líneas asociadas.
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200 text-left text-slate-500">
                                                        <th className="py-2 pr-4 font-medium">
                                                            Código
                                                        </th>
                                                        <th className="py-2 pr-4 font-medium">
                                                            Producto
                                                        </th>
                                                        <th className="py-2 pr-4 text-right font-medium">
                                                            Cantidad
                                                        </th>
                                                        <th className="py-2 pr-4 text-right font-medium">
                                                            Precio
                                                        </th>
                                                        <th className="py-2 text-right font-medium">
                                                            Importe
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {deliveryNote.lineas.map((linea) => (
                                                        <tr
                                                            key={linea.linea}
                                                            className="border-b border-slate-100 last:border-0"
                                                        >
                                                            <td className="py-2 pr-4 text-slate-600">
                                                                {linea.codprodu || "-"}
                                                            </td>

                                                            <td className="py-2 pr-4 text-slate-900">
                                                                {linea.desprodu || "-"}
                                                            </td>

                                                            <td className="py-2 pr-4 text-right text-slate-600">
                                                                {linea.cantidad ?? "-"}{" "}
                                                                {linea.unidadventa || ""}
                                                            </td>

                                                            <td className="py-2 pr-4 text-right text-slate-600">
                                                                {formatCurrency(linea.precio)}
                                                            </td>

                                                            <td className="py-2 text-right font-medium text-slate-900">
                                                                {formatCurrency(linea.importe)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}