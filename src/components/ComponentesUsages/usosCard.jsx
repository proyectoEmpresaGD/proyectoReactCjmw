import { useTranslation } from 'react-i18next';
import { careInstructions, usageInstructions } from '../../Constants/constants';

const CareInstructions = () => {
    const { t } = useTranslation('instructions');

    return (
        <div className="mt-16 mb-8 px-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 pt-16 sm:pt-24">
                {t('usageHeading')}
            </h1>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                {t('usageHeading')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {usageInstructions.map(inst => renderCard(inst, 'usage', t))}
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 mt-8">
                {t('careHeading')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {careInstructions.map(inst => renderCard(inst, 'care', t))}
            </div>
        </div>
    );
};

function renderCard(instruction, section, t) {
    const key = `${section}.${instruction.id}`;
    const title = t(`${key}.title`);
    const details = t(`${key}.details`, { returnObjects: true });

    // Nuevos iconos de USOS añadidos recientemente.
    // Se muestran un poco más grandes porque sus imágenes contienen
    // más margen interno que los iconos antiguos.
    const enlargedUsageIcons = [
        13, // ANTIFUNGAL
        14, // CONTRACT GRADE
        15, // DOMESTIC USE
        16, // EASY CARE
        17, // ECO- FRIENDLY
        18, // HEALTH- CARE
        19, // HOSPI- TALITY
        20, // LEISURE
        21, // OFFICE
        22, // PFC FREE
        23, // PUBLIC SPACES
        24, // UV RESISTANT
        25, // WATER REPELLENT
    ];

    // Nuevos iconos de MANTENIMIENTO añadidos recientemente.
    const enlargedCareIcons = [
        16, // PLANCHAR CON UN PAÑO PROTECTOR
        17, // NO USAR VAPOR
        18, // USAR LEJIA
        19, // LAVAR A 60º
    ];

    const shouldEnlarge =
        (section === 'usage' && enlargedUsageIcons.includes(instruction.id)) ||
        (section === 'care' && enlargedCareIcons.includes(instruction.id));

    return (
        <div key={instruction.id} className="flex flex-col items-center">
            <div className="h-full max-w-sm w-full bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/*
                    Contenedor con altura fija para que los títulos sigan
                    alineados aunque algunos iconos sean más grandes.
                */}
                <div className="h-16 flex items-center justify-center">
                    <img
                        src={instruction.iconPath}
                        alt={title}
                        className={`${shouldEnlarge ? 'h-14' : 'h-10'} w-auto max-w-full object-contain`}
                    />
                </div>

                <div>
                    <div className="font-bold text-lg mb-1 text-center pt-2">
                        {title}
                    </div>
                    {details.map((line, i) => (
                        <p key={i} className="text-gray-700 text-sm text-center pt-3">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CareInstructions;
