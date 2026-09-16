import { jsPDF } from 'jspdf';
import { invoiceLogoAssets } from '../config/invoiceLogoAssets.js';

const PAGE = {
    width: 210,
    height: 297,
    left: 7.5,
    right: 202.5,
    contentBottom: 239,
    footerTop: 244,
};

const COMPANY = {
    name: 'CJM WORLDWIDE S.L.',
    taxId: 'B14570873',
    address: 'AVDA. DE EUROPA, 19',
    city: '14550 MONTILLA (CORDOBA)',
    phone: '957 656 475',
    web: 'www.cjmw.eu',
};

const ENGLISH_INVOICE_SERIES = new Set([
    'E',
    'C',
    'W',
]);

const PDF_TEXTS = {
    es: {
        invoice: 'Factura',
        date: 'Fecha',
        phone: 'Telf.',

        paymentMethod: 'Forma de pago',
        dueDate: 'FECHA VTO.',
        amount: 'IMPORTE',
        account: 'CUENTA',

        customer: 'Cliente',
        representative: 'Representante',

        code: 'Código',
        description: 'Descripción',
        quantity: 'Cantidad',
        price: 'Precio',
        discount: 'Descuento',

        deliveryNote: 'ALBARÁN Nº',

        grossAmount: 'Imp. Bruto',
        specialDiscount: 'Dto. Especial',
        shipping: 'Portes',
        taxableBase: 'Base Imponible',
        vat: 'IVA',
        rec: 'RE',
        total: 'TOTAL',

        insuredOperation:
            'Operación asegurada por Crédito y Caución',

        page: 'Pag.',
    },

    en: {
        invoice: 'Invoice',
        date: 'Date',
        phone: 'Tel.',

        paymentMethod: 'Payment terms',
        dueDate: 'DUE DATE',
        amount: 'AMOUNT',
        account: 'BANK ACCOUNT',

        customer: 'Customer',
        representative: 'Sales representative',

        code: 'Code',
        description: 'Description',
        quantity: 'Quantity',
        price: 'Price',
        discount: 'Discount',

        deliveryNote: 'DELIVERY NOTE No.',

        grossAmount: 'Gross Amount',
        specialDiscount: 'Special Discount',
        shipping: 'Shipping',
        taxableBase: 'Taxable Base',
        vat: 'VAT',
        rec: 'RE',
        total: 'TOTAL',

        insuredOperation:
            'Transaction insured by Crédito y Caución',

        page: 'Page',
    },
};

const COLUMN_X = {
    code: 7.5,
    description: 44,
    quantity: 128,
    price: 142,
    discount: 155,
    amount: 183,
    end: 202.5,
};

const FONT_SIZE = {
    company: 8.5,
    invoiceTitle: 17,
    boxTitle: 8,

    payment: 9,
    paymentHeader: 7.5,
    paymentValue: 8.2,

    customer: 8.8,

    representativeLabel: 7.2,
    representativeValue: 7.5,

    tableHeader: 7.8,
    deliveryNote: 8.3,
    sectionHeading: 8.3,
    line: 8,

    footerNote: 6.8,

    totalsHeader: 7,
    totalsValue: 7.6,

    totalLabel: 7.8,
    totalValue: 10.5,

    pageNumber: 7,
};

const LINE_HEIGHT = {
    company: 4.1,
    customer: 4.5,
    description: 4.6,
};

const ASSETS = invoiceLogoAssets;

function safeText(value) {
    return value == null
        ? ''
        : String(value).trim();
}

function getInvoiceLanguage(invoice) {
    const series = safeText(
        invoice.codserfacventa
    ).toUpperCase();

    return ENGLISH_INVOICE_SERIES.has(series)
        ? 'en'
        : 'es';
}

function getPdfTexts(invoice) {
    const language =
        getInvoiceLanguage(invoice);

    return PDF_TEXTS[language];
}

function getPaymentMethodLabel(
    invoice
) {
    const paymentMethod =
        invoice.paymentMethod ?? {};

    const language =
        getInvoiceLanguage(invoice);

    /*
     * Dejamos preparado el servicio para que
     * invoicePaymentConfig pueda devolver:
     *
     * labelEs
     * labelEn
     *
     * Si todavía solo devuelve "label",
     * seguimos utilizándolo como fallback.
     */
    if (
        language === 'en' &&
        safeText(paymentMethod.labelEn)
    ) {
        return safeText(
            paymentMethod.labelEn
        );
    }

    if (
        language === 'es' &&
        safeText(paymentMethod.labelEs)
    ) {
        return safeText(
            paymentMethod.labelEs
        );
    }

    if (
        safeText(paymentMethod.label)
    ) {
        return safeText(
            paymentMethod.label
        );
    }

    return getPdfTexts(
        invoice
    ).paymentMethod;
}

function toNumber(value) {
    const parsed =
        Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : 0;
}

function formatNumber(value) {
    return new Intl.NumberFormat(
        'es-ES',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(
        toNumber(value)
    );
}

function formatCurrency(value) {
    return `${formatNumber(value)} €`;
}

function formatDate(value) {
    if (!value) {
        return '';
    }

    const raw =
        String(value).trim();

    const isoDate =
        raw.match(
            /^(\d{4})-(\d{1,2})-(\d{1,2})/
        );

    if (isoDate) {
        const year =
            isoDate[1];

        const month =
            isoDate[2].padStart(
                2,
                '0'
            );

        const day =
            isoDate[3].padStart(
                2,
                '0'
            );

        return `${day}/${month}/${year}`;
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return raw;
    }

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            '0'
        );

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            '0'
        );

    const year =
        date.getFullYear();

    return `${day}/${month}/${year}`;
}

function getInvoiceLabel(
    invoice
) {
    if (
        safeText(
            invoice.sfactura
        )
    ) {
        return safeText(
            invoice.sfactura
        );
    }

    const series =
        safeText(
            invoice.codserfacventa
        );

    const number =
        safeText(
            invoice.nfacventa
        );

    return [
        series,
        number,
    ]
        .filter(Boolean)
        .join('-');
}

function getDownloadFilename(
    invoice
) {
    const label =
        getInvoiceLabel(
            invoice
        ) || 'factura';

    const safeLabel =
        label.replace(
            /[^\w.-]+/g,
            '_'
        );

    return `Fac.Venta_${safeLabel}.pdf`;
}

function getShippingAmount(
    invoice
) {
    if (
        invoice.impportes != null
    ) {
        return toNumber(
            invoice.impportes
        );
    }

    const gross =
        toNumber(
            invoice.impbruto
        );

    const specialDiscount =
        toNumber(
            invoice.impdes
        ) +
        toNumber(
            invoice.impdpp
        );

    const taxableBase =
        toNumber(
            invoice.impbase
        );

    return Math.max(
        0,
        taxableBase -
        (
            gross -
            specialDiscount
        )
    );
}

function addImageContained(
    doc,
    dataUrl,
    x,
    y,
    width,
    height
) {
    if (!dataUrl) {
        return;
    }

    try {
        const properties =
            doc.getImageProperties(
                dataUrl
            );

        const ratio =
            properties.width /
            properties.height;

        let drawWidth =
            width;

        let drawHeight =
            drawWidth /
            ratio;

        if (
            drawHeight >
            height
        ) {
            drawHeight =
                height;

            drawWidth =
                drawHeight *
                ratio;
        }

        doc.addImage(
            dataUrl,

            properties.fileType ||
            'PNG',

            x +
            (
                width -
                drawWidth
            ) / 2,

            y +
            (
                height -
                drawHeight
            ) / 2,

            drawWidth,
            drawHeight,

            undefined,
            'FAST'
        );
    } catch (error) {
        console.error(
            'invoicePdfService: error insertando imagen',
            error
        );
    }
}

function drawCompanyHeader(
    doc,
    invoice
) {
    const texts =
        getPdfTexts(invoice);

    if (ASSETS.crest) {
        addImageContained(
            doc,
            ASSETS.crest,
            10,
            7,
            28,
            34
        );
    }

    doc.setTextColor(0);

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.company
    );

    const companyRight =
        124;

    const companyLines = [
        COMPANY.name,
        COMPANY.taxId,
        COMPANY.address,
        COMPANY.city,
        `${texts.phone} ${COMPANY.phone}`,
        COMPANY.web,
    ];

    companyLines.forEach(
        (line, index) => {
            doc.text(
                line,
                companyRight,
                10.5 +
                index *
                LINE_HEIGHT.company,
                {
                    align: 'right',
                }
            );
        }
    );

    doc.setDrawColor(0);

    doc.setLineWidth(
        0.35
    );

    doc.line(
        126.5,
        8,
        126.5,
        40.5
    );

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.invoiceTitle
    );

    doc.text(
        `${texts.invoice}: ${getInvoiceLabel(
            invoice
        )}`,
        202,
        15,
        {
            align: 'right',
        }
    );

    doc.text(
        `${texts.date}: ${formatDate(
            invoice.fecha
        )}`,
        202,
        28,
        {
            align: 'right',
        }
    );
}

function drawRoundedBox(
    doc,
    x,
    y,
    width,
    height,
    title
) {
    doc.setDrawColor(0);

    doc.setLineWidth(
        0.35
    );

    doc.roundedRect(
        x,
        y,
        width,
        height,
        1.8,
        1.8
    );

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.boxTitle
    );

    doc.text(
        title,
        x + 1,
        y - 1.2
    );
}

function drawFirstPageInfo(
    doc,
    invoice
) {
    const texts =
        getPdfTexts(invoice);

    const customer =
        invoice.cliente ?? {};

    const paymentMethod =
        invoice.paymentMethod ?? {
            isTransfer: false,
            bankName: '',
            account: '',
        };

    const paymentSchedule =
        Array.isArray(
            invoice.paymentSchedule
        )
            ? invoice.paymentSchedule
            : [];

    const paymentBox = {
        x: 7.5,
        y: 49,
        width: 99,
        height: 45,
    };

    const customerBox = {
        x: 110,
        y: 49,
        width: 92.5,
        height: 45,
    };

    drawRoundedBox(
        doc,
        paymentBox.x,
        paymentBox.y,
        paymentBox.width,
        paymentBox.height,
        texts.paymentMethod
    );

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.payment
    );

    const paymentTitle =
        doc.splitTextToSize(
            getPaymentMethodLabel(
                invoice
            ),
            paymentBox.width - 4
        );

    doc.text(
        paymentTitle,
        paymentBox.x + 2,
        paymentBox.y + 5
    );

    const titleLines =
        Math.max(
            paymentTitle.length,
            1
        );

    const paymentDetailsY =
        paymentBox.y +
        7 +
        titleLines * 4;

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.paymentHeader
    );

    doc.text(
        texts.dueDate,
        paymentBox.x + 2,
        paymentDetailsY
    );

    doc.text(
        texts.amount,
        paymentBox.x + 31,
        paymentDetailsY
    );

    if (
        paymentMethod.isTransfer
    ) {
        doc.text(
            texts.account,
            paymentBox.x + 49,
            paymentDetailsY
        );
    }

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.paymentValue
    );

    const paymentRowHeight =
        4.2;

    paymentSchedule.forEach(
        (
            payment,
            index
        ) => {
            const rowY =
                paymentDetailsY +
                5 +
                index *
                paymentRowHeight;

            doc.text(
                formatDate(
                    payment.date
                ),
                paymentBox.x + 2,
                rowY
            );

            doc.text(
                formatNumber(
                    payment.amount
                ),
                paymentBox.x + 31,
                rowY
            );
        }
    );

    if (
        paymentMethod.isTransfer
    ) {
        if (
            safeText(
                paymentMethod.bankName
            )
        ) {
            doc.text(
                safeText(
                    paymentMethod.bankName
                ),
                paymentBox.x + 49,
                paymentDetailsY + 5
            );
        }

        if (
            safeText(
                paymentMethod.account
            )
        ) {
            const accountLines =
                doc.splitTextToSize(
                    safeText(
                        paymentMethod.account
                    ),
                    paymentBox.width - 51
                );

            doc.text(
                accountLines,
                paymentBox.x + 49,
                paymentDetailsY + 10
            );
        }
    }

    drawRoundedBox(
        doc,
        customerBox.x,
        customerBox.y,
        customerBox.width,
        customerBox.height,
        texts.customer
    );

    /*
     * Estos valores vienen de la base de datos.
     * No se traducen.
     */
    const customerLines = [
        safeText(
            customer.razclien
        ),

        safeText(
            customer.codclien
        ),

        safeText(
            customer.nomcomer
        ),

        safeText(
            customer.direccion
        ),

        [
            safeText(
                customer.cp
            ),

            safeText(
                customer.localidad
            ),
        ]
            .filter(Boolean)
            .join(' - '),

        safeText(
            customer.pais
        ),

        safeText(
            customer.nif
        ),

        safeText(
            customer.cuenta
        ),
    ].filter(
        (line, index) =>
            line ||
            index === 0
    );

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.customer
    );

    customerLines
        .slice(0, 8)
        .forEach(
            (
                line,
                index
            ) => {
                doc.text(
                    line || '-',

                    customerBox.x + 2,

                    customerBox.y +
                    5 +
                    index *
                    LINE_HEIGHT.customer
                );
            }
        );

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.representativeLabel
    );

    doc.text(
        `${texts.representative}:`,
        customerBox.x + 2,
        customerBox.y + 41
    );

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.representativeValue
    );

    /*
     * nombreRepresentante viene de BD:
     * se mantiene exactamente como está.
     */
    doc.text(
        safeText(
            invoice.nombreRepresentante
        ),
        customerBox.x + 32,
        customerBox.y + 41
    );
}

function drawTableHeader(
    doc,
    invoice
) {
    const texts =
        getPdfTexts(invoice);

    const y =
        100.5;

    const height =
        7.5;

    doc.setDrawColor(0);

    doc.setLineWidth(
        0.3
    );

    doc.rect(
        COLUMN_X.code,
        y,
        COLUMN_X.end -
        COLUMN_X.code,
        height
    );

    [
        COLUMN_X.description,
        COLUMN_X.quantity,
        COLUMN_X.price,
        COLUMN_X.discount,
        COLUMN_X.amount,
    ].forEach((x) => {
        doc.line(
            x,
            y,
            x,
            y + height
        );
    });

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.tableHeader
    );

    const centers = [
        [
            (
                COLUMN_X.code +
                COLUMN_X.description
            ) / 2,
            texts.code,
        ],

        [
            (
                COLUMN_X.description +
                COLUMN_X.quantity
            ) / 2,
            texts.description,
        ],

        [
            (
                COLUMN_X.quantity +
                COLUMN_X.price
            ) / 2,
            texts.quantity,
        ],

        [
            (
                COLUMN_X.price +
                COLUMN_X.discount
            ) / 2,
            texts.price,
        ],

        [
            (
                COLUMN_X.discount +
                COLUMN_X.amount
            ) / 2,
            texts.discount,
        ],

        [
            (
                COLUMN_X.amount +
                COLUMN_X.end
            ) / 2,
            texts.amount,
        ],
    ];

    centers.forEach(
        ([x, label]) => {
            doc.text(
                label,
                x,
                y + 5,
                {
                    align:
                        'center',
                }
            );
        }
    );

    return (
        y +
        height +
        3
    );
}

function buildPrintBlocks(
    invoice
) {
    const texts =
        getPdfTexts(invoice);

    const blocks = [];

    (
        invoice.albaranes ??
        []
    ).forEach(
        (deliveryNote) => {
            const deliveryLabel =
                [
                    safeText(
                        deliveryNote.codseralbventa
                    ),

                    safeText(
                        deliveryNote.nalbventa
                    ),
                ].join('');

            blocks.push({
                type:
                    'deliveryNote',

                text:
                    `*** ${texts.deliveryNote}: ${deliveryLabel} ` +
                    `${formatDate(
                        deliveryNote.fecha
                    )} ***`,
            });

            /*
             * Observaciones procedentes de BD:
             * no se traducen.
             */
            const observation =
                safeText(
                    deliveryNote.obs
                );

            if (observation) {
                observation
                    .split(
                        /\r?\n/
                    )
                    .map(
                        (line) =>
                            line.trim()
                    )
                    .filter(Boolean)
                    .forEach(
                        (line) => {
                            blocks.push({
                                type:
                                    'heading',

                                text:
                                    line,
                            });
                        }
                    );
            }

            /*
             * Referencia procedente de BD:
             * se mantiene como está.
             */
            const reference =
                safeText(
                    deliveryNote.referencia
                );

            if (reference) {
                blocks.push({
                    type:
                        'reference',

                    text:
                        /^REF\b/i.test(
                            reference
                        )
                            ? reference
                            : `REF ${reference}`,
                });
            }

            (
                deliveryNote.lineas ??
                []
            ).forEach(
                (line) => {
                    blocks.push({
                        type:
                            'line',

                        value:
                            line,
                    });
                }
            );
        }
    );

    return blocks;
}

function getBlockHeight(
    doc,
    block
) {
    if (
        block.type ===
        'deliveryNote'
    ) {
        return 8;
    }

    if (
        block.type ===
        'heading' ||
        block.type ===
        'reference'
    ) {
        return 7;
    }

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.line
    );

    const description =
        safeText(
            block.value
                ?.desprodu
        );

    const lines =
        doc.splitTextToSize(
            description,

            COLUMN_X.quantity -
            COLUMN_X.description -
            4
        );

    return Math.max(
        6.4,

        lines.length *
        LINE_HEIGHT.description +
        1.6
    );
}

function drawBlock(
    doc,
    block,
    y
) {
    if (
        block.type ===
        'deliveryNote'
    ) {
        doc.setFont(
            'helvetica',
            'bold'
        );

        doc.setFontSize(
            FONT_SIZE.deliveryNote
        );

        doc.setTextColor(
            55,
            65,
            255
        );

        doc.text(
            block.text,

            (
                COLUMN_X.description +
                COLUMN_X.quantity
            ) / 2,

            y + 5.2,

            {
                align:
                    'center',
            }
        );

        doc.setTextColor(0);

        return;
    }

    if (
        block.type ===
        'heading' ||
        block.type ===
        'reference'
    ) {
        doc.setFont(
            'helvetica',
            'normal'
        );

        doc.setFontSize(
            FONT_SIZE.sectionHeading
        );

        doc.text(
            block.text,

            COLUMN_X.description +
            2,

            y + 5
        );

        return;
    }

    const line =
        block.value;

    /*
     * desprodu procede de BD.
     * No se traduce.
     */
    const descriptionLines =
        doc.splitTextToSize(
            safeText(
                line.desprodu
            ),

            COLUMN_X.quantity -
            COLUMN_X.description -
            4
        );

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.line
    );

    const textY =
        y + 4.8;

    doc.text(
        safeText(
            line.codprodu
        ),
        COLUMN_X.code + 1,
        textY
    );

    doc.text(
        descriptionLines,
        COLUMN_X.description +
        2,
        textY
    );

    doc.text(
        formatNumber(
            line.cantidad
        ),
        COLUMN_X.price -
        1.5,
        textY,
        {
            align:
                'right',
        }
    );

    doc.text(
        formatNumber(
            line.precio
        ),
        COLUMN_X.discount -
        1.5,
        textY,
        {
            align:
                'right',
        }
    );

    const discount =
        toNumber(
            line.dt1
        );

    doc.text(
        discount
            ? `${formatNumber(
                discount
            )}%`
            : '',

        COLUMN_X.amount -
        1.5,

        textY,

        {
            align:
                'right',
        }
    );

    doc.text(
        formatNumber(
            line.importe
        ),

        COLUMN_X.end -
        1.5,

        textY,

        {
            align:
                'right',
        }
    );
}

function drawBrandFooter(doc) {
    const x = 8.5;
    const y = 272;

    const width = 193;
    const height = 16;

    const paddingX = 1.5;
    const paddingY = 2;

    const logos = [
        {
            image: ASSETS.harbour,
            scale: 1,
        },
        {
            image: ASSETS.cjm,
            scale: 0.5,
        },
        {
            image: ASSETS.arena,
            scale: 1,
        },
        {
            image: ASSETS.flamenco,
            scale: 1,
        },
        {
            image: ASSETS.bassari,
            scale: 1,
        },
    ];

    const slotWidth =
        width /
        logos.length;

    doc.setDrawColor(0);

    doc.setLineWidth(0.3);

    doc.rect(
        x,
        y,
        width,
        height
    );

    logos.forEach(
        (logo, index) => {
            const availableWidth =
                slotWidth -
                paddingX * 2;

            const availableHeight =
                height -
                paddingY * 2;

            const logoWidth =
                availableWidth *
                logo.scale;

            const logoHeight =
                availableHeight *
                logo.scale;

            const logoX =
                x +
                index *
                slotWidth +
                (
                    slotWidth -
                    logoWidth
                ) / 2;

            const logoY =
                y +
                (
                    height -
                    logoHeight
                ) / 2;

            addImageContained(
                doc,
                logo.image,
                logoX,
                logoY,
                logoWidth,
                logoHeight
            );
        }
    );
}

function drawTotals(
    doc,
    invoice,
    pageNumber,
    totalPages
) {
    const texts =
        getPdfTexts(invoice);

    const noteY =
        PAGE.footerTop;

    const tableY =
        247;

    const tableHeight =
        15;

    const totalX =
        176.5;

    const totalWidth =
        26;

    doc.setTextColor(0);

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.footerNote
    );

    doc.text(
        texts.insuredOperation,
        198,
        noteY,
        {
            align:
                'right',
        }
    );

    const x =
        PAGE.left;

    const labels = [
        [
            texts.grossAmount,
            28,
        ],

        [
            texts.specialDiscount,
            28,
        ],

        [
            texts.shipping,
            28,
        ],

        [
            texts.taxableBase,
            28,
        ],

        [
            texts.vat,
            28,
        ],

        [
            texts.rec,
            28,
        ],
    ];

    doc.setLineWidth(
        0.3
    );

    doc.rect(
        x,
        tableY,
        totalX - x,
        tableHeight
    );

    doc.rect(
        totalX,
        tableY,
        totalWidth,
        tableHeight
    );

    let cursorX =
        x;

    labels.forEach(
        (
            [label, width],
            index
        ) => {
            if (
                index > 0
            ) {
                doc.line(
                    cursorX,
                    tableY,
                    cursorX,
                    tableY +
                    tableHeight
                );
            }

            doc.setFont(
                'helvetica',
                'bold'
            );

            doc.setFontSize(
                FONT_SIZE.totalsHeader
            );

            const labelLines =
                doc.splitTextToSize(
                    label,
                    width - 2
                );

            doc.text(
                labelLines,

                cursorX +
                width / 2,

                tableY + 4,

                {
                    align:
                        'center',

                    lineHeightFactor:
                        0.9,
                }
            );

            cursorX +=
                width;
        }
    );

    const values = [
        invoice.impbruto,

        toNumber(
            invoice.impdes
        ) +
        toNumber(
            invoice.impdpp
        ),

        getShippingAmount(
            invoice
        ),

        invoice.impbase,

        invoice.impiva,

        invoice.impre,
    ];

    cursorX =
        x;

    values.forEach(
        (
            value,
            index
        ) => {
            const width =
                labels[index][1];

            doc.setFont(
                'helvetica',
                'normal'
            );

            doc.setFontSize(
                FONT_SIZE.totalsValue
            );

            doc.text(
                formatNumber(
                    value
                ),

                cursorX +
                width -
                1.5,

                tableY + 12,

                {
                    align:
                        'right',
                }
            );

            cursorX +=
                width;
        }
    );

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.setFontSize(
        FONT_SIZE.totalLabel
    );

    doc.text(
        texts.total,

        totalX +
        totalWidth / 2,

        tableY + 5,

        {
            align:
                'center',
        }
    );

    doc.setFontSize(
        FONT_SIZE.totalValue
    );

    doc.text(
        formatCurrency(
            invoice.imptotal
        ),

        totalX +
        totalWidth -
        1.5,

        tableY + 12.3,

        {
            align:
                'right',
        }
    );

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(
        FONT_SIZE.pageNumber
    );

    doc.text(
        `${texts.page} ${pageNumber} / ${totalPages}`,

        201,
        266,

        {
            align:
                'right',
        }
    );

    drawBrandFooter(
        doc
    );
}

export async function generateInvoicePdf(
    invoice
) {
    const doc =
        new jsPDF({
            orientation:
                'portrait',

            unit:
                'mm',

            format:
                'a4',

            compress:
                true,
        });

    drawCompanyHeader(
        doc,
        invoice
    );

    drawFirstPageInfo(
        doc,
        invoice
    );

    let y =
        drawTableHeader(
            doc,
            invoice
        );

    const blocks =
        buildPrintBlocks(
            invoice
        );

    blocks.forEach(
        (block) => {
            const height =
                getBlockHeight(
                    doc,
                    block
                );

            if (
                y +
                height >
                PAGE.contentBottom
            ) {
                doc.addPage();

                drawCompanyHeader(
                    doc,
                    invoice
                );

                y = 42;
            }

            drawBlock(
                doc,
                block,
                y
            );

            y +=
                height;
        }
    );

    const totalPages =
        doc.getNumberOfPages();

    for (
        let pageNumber = 1;

        pageNumber <=
        totalPages;

        pageNumber += 1
    ) {
        doc.setPage(
            pageNumber
        );

        drawTotals(
            doc,
            invoice,
            pageNumber,
            totalPages
        );
    }

    return {
        buffer:
            Buffer.from(
                doc.output(
                    'arraybuffer'
                )
            ),

        filename:
            getDownloadFilename(
                invoice
            ),
    };
}