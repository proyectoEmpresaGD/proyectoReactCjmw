const PAYMENT_LABELS = Object.freeze({
    '@C': 'Contrareembolso - Entrega',

    '00': 'CONTADO',
    '01': 'TALON',
    '02': 'TRANSFER BANK CAIXA',
    '03': 'RBO. BANCARIO',
    '04': 'TT 30 DAYS TO OUR BANK ACCOUNT CAIXA',
    '05': 'TT 30 DAYS TO OUR BANK ACCOUNT (£)',
    '06': 'TT 30 DAYS TO OUR BANK ACCOUNT ($)',
    '07': 'TT IN ADVANCE TO OUR BANK ACCOUNT ($)',
    '08': 'TT IN ADVANCE TO OUR BANK ACCOUNT (£)',
    '09': 'TRANSF. 30 DIAS A NTRA. CTA. BANCARIA SANTANDER',
    '10': 'TT 60 DAYS TO OUR BANK ACCOUNT CAIXA',
    '11': 'TT 90 DAYS TO OUR BANK ACCOUNT CAIXA',
    '12': 'TT IN ADVANCE TO OUR BANK ACCOUNT CAIXA',
    '13': 'TRANSFER IN ADVANCE (SANTANDER)',
    '14': 'TT 30 DAYS TO OUR BANK ACCOUNT SANTANDER',
    '15': 'PAGO POR TARJETA',
    '16': 'CONFIRMING 90 DÍAS CAIXA',
    '17': 'GIRO 60, 90, 120 DÍAS',
    '18': 'TRANSFERENCIA CTA. CTE. SANTANDER',
    '19': 'GIRO 30, 60, 90, 120 DÍAS',
    '20': 'CONFIRMING 30 DÍAS SANTANDER',
    '21': 'CONFIRMING 60 DÍAS SANTANDER',
    '22': 'CONFIRMING 90 DÍAS SANTANDER',
    '29': 'CONVENIDO',

    '38': 'TRANSFERENCIA CAIXA',
    '39': 'TRANSFERENCIA 90 DÍAS',
    '40': 'TRANSFERENCIA PREVIA BANCO SANTANDER',
    '41': 'TRANSFERENCIA BANCO SANTANDER',
    '42': 'TRANSFERENCIA PREVIA LA CAIXA',
    '43': 'TRANSFERENCIA 30 DÍAS A NTRA. CTA. BANCARIA CAIXA',
    '44': 'TRANSFERENCIA 60 DÍAS CAIXA',
    '50': 'CONFIRMING 60 DÍAS CAIXA',
    '70': 'CONFIRMING 30 DÍAS CAIXA',

    G1: 'GIRO 30 DÍAS',
    G2: 'GIRO 60 DÍAS',
    G3: 'GIRO 30, 60, 90, 120, 150, 180',
    G4: 'GIRO 90 DÍAS',
    G5: 'GIRO 30, 60 DÍAS',
    G6: 'GIRO 30, 60, 90 DÍAS',
    G7: 'GIRO 60, 90 DÍAS',
    G8: 'GIRO 70 DÍAS',
    G9: 'GIRO 45 DÍAS',

    TG: 'TRANSF. 50% ADELANTADO / 50% GIRO 30 DÍAS.',
});

const BANK = Object.freeze({
    CAIXA: 'caixa',
    SANTANDER: 'santander',
});

/*
 * Solo incluimos aquí códigos cuyo banco se puede
 * determinar claramente con el listado proporcionado.
 */
const TRANSFER_BANK_BY_CODE = Object.freeze({
    '02': BANK.CAIXA,
    '04': BANK.CAIXA,
    '10': BANK.CAIXA,
    '11': BANK.CAIXA,
    '12': BANK.CAIXA,
    '38': BANK.CAIXA,
    '42': BANK.CAIXA,
    '43': BANK.CAIXA,
    '44': BANK.CAIXA,

    '09': BANK.SANTANDER,
    '13': BANK.SANTANDER,
    '14': BANK.SANTANDER,
    '18': BANK.SANTANDER,
    '40': BANK.SANTANDER,
    '41': BANK.SANTANDER,
});

/*
 * Sabemos que estos códigos son transferencia,
 * pero con las imágenes no podemos determinar
 * con seguridad qué cuenta corresponde.
 */
const TRANSFER_WITHOUT_DEFINED_BANK = new Set([
    '05',
    '06',
    '07',
    '08',
    '39',
    'TG',
]);

function normalizePaymentCode(value) {
    return String(value ?? '')
        .trim()
        .toUpperCase();
}

function getBankAccount(bank) {
    switch (bank) {
        case BANK.CAIXA:
            return String(
                process.env.INVOICE_ACCOUNT_CAIXA ?? ''
            ).trim();

        case BANK.SANTANDER:
            return String(
                process.env.INVOICE_ACCOUNT_SANTANDER ?? ''
            ).trim();

        default:
            return '';
    }
}

function getBankName(bank) {
    switch (bank) {
        case BANK.CAIXA:
            return 'CAIXA';

        case BANK.SANTANDER:
            return 'BANCO SANTANDER';

        default:
            return '';
    }
}

export function getInvoicePaymentInfo(codforpago) {
    const code =
        normalizePaymentCode(codforpago);

    const label =
        PAYMENT_LABELS[code] ||
        code ||
        'FORMA DE PAGO';

    const bank =
        TRANSFER_BANK_BY_CODE[code] ??
        null;

    const isTransfer =
        Boolean(bank) ||
        TRANSFER_WITHOUT_DEFINED_BANK.has(
            code
        );

    return {
        code,
        label,
        isTransfer,
        bank,
        bankName: getBankName(bank),
        account: bank
            ? getBankAccount(bank)
            : '',
    };
}