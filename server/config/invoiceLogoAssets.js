import { readFileSync } from 'node:fs';

const brandLogosPath = new URL(
    '../../public/LogosBase64/brandLogos.json',
    import.meta.url
);

const brandLogos = JSON.parse(
    readFileSync(brandLogosPath, 'utf8')
);

const REQUIRED_LOGO_KEYS = [
    'ESCUDO',
    'HAR',
    'CJM',
    'ARE',
    'FLA',
    'BAS',
];

const missingLogoKeys =
    REQUIRED_LOGO_KEYS.filter(
        (key) =>
            typeof brandLogos[key] !== 'string' ||
            !brandLogos[key].startsWith(
                'data:image/'
            )
    );

if (missingLogoKeys.length > 0) {
    throw new Error(
        `invoiceLogoAssets: faltan logos Base64 válidos en brandLogos.json: ${missingLogoKeys.join(', ')}`
    );
}

export const invoiceLogoAssets =
    Object.freeze({
        crest: brandLogos.ESCUDO,
        harbour: brandLogos.HAR,
        cjm: brandLogos.CJM,
        arena: brandLogos.ARE,
        flamenco: brandLogos.FLA,
        bassari: brandLogos.BAS,
    });