import PropTypes from 'prop-types';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'react';

// Overrides para portadas específicas
const RAW_OVERRIDES = {
    'puritty': { fit: 'contain', pad: 10, shadow: true },
    'caribbean party': { fit: 'contain', pad: 10, shadow: true },
    'african soul': { fit: 'contain', pad: 10, shadow: true },
    'riviera': { fit: 'contain', pad: 10, shadow: true },
    'flamenco': { fit: 'contain', pad: 10, shadow: true },
    'caribbean-party': { fit: 'contain', pad: 10, shadow: true },
};

const normalizeKey = (s = '') =>
    String(s).trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const BrochureCard = ({ brochure }) => {
    const { t } = useTranslation('media');
    const [meta, setMeta] = useState({ w: 0, h: 0 });

    const overrides = useMemo(() => {
        const byId = RAW_OVERRIDES[normalizeKey(brochure.id)];
        if (byId) return byId;
        const byTitle = RAW_OVERRIDES[normalizeKey(brochure.title)];
        return byTitle ?? {};
    }, [brochure.id, brochure.title]);

    const isLowRes = meta.w > 0 && meta.h > 0 && Math.min(meta.w, meta.h) < 900;
    const fitContain =
        overrides.fit === 'contain' ||
        brochure.fitMode === 'contain' ||
        isLowRes;

    const containPad = overrides.pad ?? (isLowRes ? 8 : 6);

    const onLoad = useCallback((e) => {
        const img = e.currentTarget;
        setMeta({ w: img.naturalWidth || 0, h: img.naturalHeight || 0 });
    }, []);

    return (
        <article className="group relative overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-[2px] hover:shadow-lg sm:rounded-2xl">
            {/* Contenedor proporcional sin “marco” visible */}
            <div
                className="relative overflow-hidden"
                style={{
                    aspectRatio: '4 / 5',
                    maxHeight: '360px',
                    minHeight: '240px',
                }}
            >
                {/* Eliminamos inset grande: imagen usa casi todo el espacio */}
                {(overrides.shadow || isLowRes) && (
                    <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.14)]" />
                )}

                <img
                    src={brochure.coverImage}
                    alt={brochure.title}
                    loading="lazy"
                    onLoad={onLoad}
                    className={[
                        'relative h-full w-full rounded-lg',
                        fitContain
                            ? 'object-contain'
                            : 'object-cover transition duration-700 group-hover:scale-[1.03]',
                    ].join(' ')}
                    style={
                        fitContain
                            ? {
                                padding: containPad,
                                imageRendering: 'auto',
                                backgroundColor: 'transparent',
                            }
                            : undefined
                    }
                />

                {/* degradado en hover */}
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>

            {/* Texto + CTA */}
            <div className="space-y-3 p-4 sm:p-5">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                        {t('brochuresSection.label')}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">
                        {brochure.title}
                    </h3>
                    {brochure.subtitle && (
                        <p className="mt-0.5 text-sm text-emerald-600">{brochure.subtitle}</p>
                    )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                    {brochure.description}
                </p>

                <div className="pt-1.5">
                    <a
                        href={brochure.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        aria-label={`${t('brochuresSection.view')} ${brochure.title}`}
                    >
                        <Eye size={18} />
                        {t('brochuresSection.view')}
                    </a>
                </div>
            </div>
        </article>
    );
};

BrochureCard.propTypes = {
    brochure: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        description: PropTypes.string,
        coverImage: PropTypes.string.isRequired,
        pdfUrl: PropTypes.string.isRequired,
        fitMode: PropTypes.oneOf(['cover', 'contain']),
    }).isRequired,
};

export default BrochureCard;
