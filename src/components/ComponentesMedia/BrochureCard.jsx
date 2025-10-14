import PropTypes from 'prop-types';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Overrides por portada: fit, pad, focus/position, scale */
const RAW_OVERRIDES = {
    puritty: { fit: 'contain', pad: 10 },
    'caribbean party': { fit: 'contain', pad: 10 },
    'african soul': { fit: 'contain', pad: 10 },
    riviera: { fit: 'contain', pad: 10 },
    flamenco: { fit: 'contain', pad: 10 },

    // Ajuste fino para Bohemian (ligeramente hacia la izquierda)
    bohemian: { fit: 'cover', position: '12% 50%', scale: 1.06 },
};

/** Normaliza: quita diacríticos y unifica espacios/guiones/bajos */
const normalizeKey = (s = '') =>
    String(s)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[\s_-]+/g, ' ')
        .trim();

/** Mapa de foco → clases Tailwind para object-position */
const focusToClass = (focus) => {
    switch ((focus || 'center').toLowerCase()) {
        case 'left': return 'object-left';
        case 'right': return 'object-right';
        case 'top': return 'object-top';
        case 'bottom': return 'object-bottom';
        case 'left-top': return 'object-left-top';
        case 'right-top': return 'object-right-top';
        case 'left-bottom': return 'object-left-bottom';
        case 'right-bottom': return 'object-right-bottom';
        default: return 'object-center';
    }
};

const BrochureCard = ({ brochure }) => {
    const { t } = useTranslation('media');
    const [meta, setMeta] = useState({ w: 0, h: 0 });
    const reduceMotion = useReducedMotion();

    const overrides = useMemo(() => {
        const byId = RAW_OVERRIDES[normalizeKey(brochure.id)];
        if (byId) return byId;
        const byTitle = RAW_OVERRIDES[normalizeKey(brochure.title)];
        return byTitle ?? {};
    }, [brochure.id, brochure.title]);

    const onLoad = useCallback((e) => {
        const img = e.currentTarget;
        setMeta({ w: img.naturalWidth || 0, h: img.naturalHeight || 0 });
    }, []);

    // Heurística de baja resolución
    const isLowRes = meta.w > 0 && meta.h > 0 && Math.min(meta.w, meta.h) < 900;

    /** COVER por defecto; CONTAIN si override/prop o baja resolución */
    const fitContain =
        overrides.fit === 'contain' ||
        brochure.fitMode === 'contain' ||
        isLowRes;

    // Padding mínimo en contain
    const containPad = overrides.pad ?? (isLowRes ? 6 : 4);

    // Posición y escala personalizables
    const focusClass = focusToClass(overrides.focus || brochure.focus);
    const position = overrides.position || brochure.position; // "x% y%"
    const baseScale = !fitContain ? (overrides.scale || brochure.scale || 1) : 1;

    // Animaciones (sin sombras)
    const liftHover = reduceMotion ? {} : { y: -4 };
    const tap = reduceMotion ? {} : { scale: 0.985 };
    const imgHover = reduceMotion ? {} : { scale: baseScale * 1.035 };

    return (
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            whileHover={liftHover}
            whileTap={tap}
            transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.6 }}
            className="group relative w-full overflow-hidden rounded-2xl bg-white flex flex-col items-center text-center"
        >
            {/* Imagen 4:5 a todo el ancho, sin sombras */}
            <div className="relative overflow-hidden rounded-t-2xl w-full" style={{ aspectRatio: '4 / 5' }}>
                <motion.img
                    src={brochure.coverImage}
                    alt={`Portada del catálogo ${brochure.title}`}
                    loading="lazy"
                    decoding="async"
                    onLoad={onLoad}
                    className={[
                        'h-full w-full mx-auto will-change-transform',
                        fitContain ? 'object-contain' : `object-cover ${focusClass}`,
                    ].join(' ')}
                    style={{
                        ...(fitContain ? { padding: containPad } : {}),
                        ...(position ? { objectPosition: position } : {}),
                        transform: `scale(${baseScale})`,
                    }}
                    whileHover={imgHover}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>

            {/* Texto centrado */}
            <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                    {t('brochuresSection.label')}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    {brochure.title}
                </h3>
                {brochure.subtitle && (
                    <p className="mt-0.5 text-sm text-gray-700">{brochure.subtitle}</p>
                )}
                {brochure.description && (
                    <p className="mt-3 text-sm text-gray-600">{brochure.description}</p>
                )}

                <div className="mt-4">
                    <a
                        href={brochure.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
                        aria-label={`${t('brochuresSection.view')} ${brochure.title}`}
                    >
                        <Eye size={18} />
                        {t('brochuresSection.view')}
                    </a>
                </div>
            </div>
        </motion.article>
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
        // ajustes opcionales desde datos:
        focus: PropTypes.oneOf([
            'left', 'center', 'right', 'top', 'bottom',
            'left-top', 'right-top', 'left-bottom', 'right-bottom',
        ]),
        position: PropTypes.string, // ej: "12% 50%"
        scale: PropTypes.number,    // ej: 1.06
    }).isRequired,
};

export default BrochureCard;
