function toNumber(value) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : 0;
}

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
}

function parseIsoDate(value) {
    if (!value) {
        return null;
    }

    const raw = String(value).trim();

    const match = raw.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

    if (match) {
        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
        };
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
}

function addDaysToDate(value, days) {
    const parsedDate =
        parseIsoDate(value);

    if (!parsedDate) {
        return '';
    }

    const date = new Date(
        Date.UTC(
            parsedDate.year,
            parsedDate.month - 1,
            parsedDate.day
        )
    );

    date.setUTCDate(
        date.getUTCDate() + days
    );

    const year =
        date.getUTCFullYear();

    const month =
        String(
            date.getUTCMonth() + 1
        ).padStart(2, '0');

    const day =
        String(
            date.getUTCDate()
        ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function extractPaymentDays(paymentLabel) {
    const normalized =
        normalizeText(paymentLabel);

    if (!normalized) {
        return [];
    }

    /*
     * Quitamos porcentajes para evitar que:
     *
     * TRANSF. 50% ADELANTADO / 50% GIRO 30 DIAS
     *
     * se interprete como:
     *
     * 50, 50, 30 días
     */
    const withoutPercentages =
        normalized.replace(
            /\b\d+(?:[.,]\d+)?\s*%/g,
            ''
        );

    const dayMarker =
        withoutPercentages.search(
            /\b(?:DIA|DIAS|DAY|DAYS)\b/
        );

    let relevantText =
        withoutPercentages;

    if (dayMarker >= 0) {
        /*
         * Cogemos todos los números anteriores
         * a DÍAS/DAYS.
         *
         * GIRO 30, 60, 90, 120 DIAS
         * =>
         * [30, 60, 90, 120]
         */
        relevantText =
            withoutPercentages.slice(
                0,
                dayMarker
            );
    } else {
        /*
         * Algunos códigos, como G3, pueden
         * venir escritos:
         *
         * GIRO 30, 60, 90, 120, 150, 180
         *
         * sin la palabra DÍAS al final.
         */
        const looksLikeInstallmentSchedule =
            /\bGIRO\b/.test(
                withoutPercentages
            ) &&
            /[,;/]/.test(
                withoutPercentages
            );

        if (!looksLikeInstallmentSchedule) {
            return [];
        }
    }

    const numbers =
        relevantText.match(
            /\b\d{1,3}\b/g
        ) ?? [];

    const days =
        numbers
            .map(Number)
            .filter(
                (value) =>
                    Number.isInteger(value) &&
                    value >= 0
            );

    /*
     * Caso:
     *
     * 50% ADELANTADO / 50% GIRO 30 DIAS
     *
     * añadimos vencimiento en día 0.
     */
    const hasAdvancePayment =
        /\bADELANTAD[OA]\b/.test(
            normalized
        ) ||
        /\bIN ADVANCE\b/.test(
            normalized
        );

    if (
        hasAdvancePayment &&
        !days.includes(0)
    ) {
        days.unshift(0);
    }

    /*
     * Evitamos fechas duplicadas,
     * manteniendo el orden original.
     */
    return [
        ...new Set(days),
    ];
}

function splitAmountInCents(
    totalAmount,
    numberOfPayments
) {
    if (
        numberOfPayments <= 0
    ) {
        return [];
    }

    /*
     * Todo se calcula en céntimos para evitar:
     *
     * 0.1 + 0.2 !== 0.3
     *
     * y garantizar que la suma coincida
     * exactamente con la factura.
     */
    const totalCents =
        Math.round(
            toNumber(totalAmount) * 100
        );

    const baseAmount =
        Math.floor(
            totalCents /
            numberOfPayments
        );

    const amounts =
        Array(
            numberOfPayments
        ).fill(baseAmount);

    const remainder =
        totalCents -
        baseAmount *
        numberOfPayments;

    /*
     * Los céntimos sobrantes se añaden
     * al último vencimiento.
     */
    amounts[
        numberOfPayments - 1
    ] += remainder;

    return amounts.map(
        (amount) =>
            amount / 100
    );
}

export function buildInvoicePaymentSchedule({
    invoiceDate,
    totalAmount,
    paymentLabel,
}) {
    const normalizedPaymentLabel =
        normalizeText(paymentLabel);

    /*
     * Solo las formas de pago que contienen
     * GIRO generan fechas de vencimiento.
     *
     * Ejemplos:
     * GIRO 30 DÍAS
     * GIRO 30, 60 DÍAS
     * GIRO 30, 60, 90 DÍAS
     * TRANSF. 50% ADELANTADO / 50% GIRO 30 DÍAS
     */
    const isGiro =
        /\bGIRO\b/.test(
            normalizedPaymentLabel
        );

    /*
     * Si NO es giro:
     *
     * - no mostramos fecha de vencimiento
     * - mostramos el importe completo
     */
    if (!isGiro) {
        return [
            {
                days: null,
                date: '',
                amount:
                    toNumber(
                        totalAmount
                    ),
            },
        ];
    }

    const days =
        extractPaymentDays(
            paymentLabel
        );

    /*
     * Si pone GIRO pero no podemos
     * interpretar los días, mantenemos
     * el importe completo y dejamos
     * la fecha vacía.
     */
    if (!days.length) {
        return [
            {
                days: null,
                date: '',
                amount:
                    toNumber(
                        totalAmount
                    ),
            },
        ];
    }

    const amounts =
        splitAmountInCents(
            totalAmount,
            days.length
        );

    return days.map(
        (dayCount, index) => ({
            days: dayCount,

            date:
                addDaysToDate(
                    invoiceDate,
                    dayCount
                ),

            amount:
                amounts[index],
        })
    );
}