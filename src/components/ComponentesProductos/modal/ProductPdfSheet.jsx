import { useMemo, useLayoutEffect, useState } from 'react';

import { getSingleUsageDisplayValue } from '../../../utils/usageDisplay';
const PAGE_W_CM = 21;
const PAGE_H_CM = 29.7;

const ProductPdfSheet = ({
    etiquetaRef,
    t,
    selectedProduct,
    getNombreMarca,
    pdfLogo,
    pdfProductImage,
    usoBase64,
    mantBase64,
    direccionBase64,
}) => {
    const [minHeightMm, setMinHeightMm] = useState(297);

    const splitBySemicolon = (value) =>
        (value || '')
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean);

    const chunkArray = (items, size) => {
        const safeSize = Math.max(1, size);
        const result = [];
        for (let i = 0; i < items.length; i += safeSize) {
            result.push(items.slice(i, i + safeSize));
        }
        return result;
    };

    const normativaItems = useMemo(
        () => splitBySemicolon(selectedProduct?.normativa),
        [selectedProduct?.normativa]
    );
    const specItems = useMemo(
        () => splitBySemicolon(selectedProduct?.especificaciones),
        [selectedProduct?.especificaciones]
    );

    const normativaChunks = useMemo(() => chunkArray(normativaItems, 12), [normativaItems]);
    const specChunks = useMemo(() => chunkArray(specItems, 12), [specItems]);

    const specialFeatures = useMemo(() => {
        const usageValues = splitBySemicolon(selectedProduct?.uso)
            .map((value) => value.toUpperCase());

        let maintenanceValues = [];
        try {
            maintenanceValues = Array.from(
                new DOMParser()
                    .parseFromString(selectedProduct?.mantenimiento || '<root/>', 'text/xml')
                    .getElementsByTagName('Valor')
            )
                .map((node) => node.textContent.trim().toUpperCase())
                .filter(Boolean);
        } catch {
            maintenanceValues = [];
        }

        const hasUsage = (value) => usageValues.includes(value);
        const hasMaintenance = (value) => maintenanceValues.includes(value);

        return [
            hasUsage('FR') && {
                key: 'FR',
                title: t('specialFeatures.fr.title', 'Ignífugo FR'),
                description: t(
                    'specialFeatures.fr.description',
                    'Tejido con comportamiento ignífugo para proyectos que requieren mayor seguridad.'
                ),
                image: usoBase64?.FR,
            },
            hasUsage('IMO') && {
                key: 'IMO',
                title: t('specialFeatures.imo.title', 'Certificación IMO'),
                description: t(
                    'specialFeatures.imo.description',
                    'Indicado para proyectos marítimos y espacios sujetos a normativa IMO.'
                ),
                image: usoBase64?.IMO,
            },
            hasMaintenance('EASYCLEAN') && {
                key: 'EASYCLEAN',
                title: t('specialFeatures.easyClean.title', 'EasyClean'),
                description: t(
                    'specialFeatures.easyClean.description',
                    'Acabado pensado para facilitar la limpieza y el mantenimiento cotidiano.'
                ),
                image: mantBase64?.EASYCLEAN,
                wideIcon: true,
            },
            (hasUsage('OUTDOOR') || hasUsage('OUTDOOR-INDOOR')) && {
                key: 'OUTDOOR',
                title: t('specialFeatures.outdoor.title', 'OUTDOOR-INDOOR'),
                description: t(
                    'specialFeatures.outdoor.description',
                    'Versátil para espacios interiores y exteriores, con prestaciones específicas para ambos usos.'
                ),
                image: usoBase64?.OUTDOOR || usoBase64?.['OUTDOOR-INDOOR'],
            },
        ].filter((feature) => feature && feature.image);
    }, [
        selectedProduct?.uso,
        selectedProduct?.mantenimiento,
        usoBase64,
        mantBase64,
        t,
    ]);

    // ✅ Ajuste automático: si el contenido pasa de 1 página, subimos el minHeight a 2, 3, etc.
    useLayoutEffect(() => {
        const el = etiquetaRef?.current;
        if (!el) return;

        // Medimos 297mm en píxeles de forma REAL (sin suposiciones de DPI)
        const measurePagePx = () => {
            const probe = document.createElement('div');
            probe.style.position = 'absolute';
            probe.style.left = '-10000px';
            probe.style.top = '0';
            probe.style.height = '297mm';
            probe.style.width = '1px';
            probe.style.visibility = 'hidden';
            document.body.appendChild(probe);

            const px = probe.getBoundingClientRect().height;

            document.body.removeChild(probe);
            return px > 0 ? px : null;
        };

        const raf = requestAnimationFrame(() => {
            const pagePx = measurePagePx();
            if (!pagePx) return;

            const contentPx = el.getBoundingClientRect().height;

            // Clamp para evitar explosiones por mediciones raras
            const tolerancePx = 24; // tolerancia para evitar que 1px extra cree 2 páginas
            const pagesRaw = contentPx <= (pagePx - tolerancePx)
                ? 1
                : Math.ceil(contentPx / pagePx);

            const pages = Math.min(1.999, Math.max(1, pagesRaw));


            const nextMm = pages * 297;

            // Importante: solo actualiza si cambia (evita re-render loop)
            setMinHeightMm((prev) => (prev === nextMm ? prev : nextMm));
        });

        return () => cancelAnimationFrame(raf);
    }, [
        etiquetaRef,
        selectedProduct?.codprodu,
        normativaItems.length,
        specItems.length,
        pdfLogo,
        pdfProductImage,
    ]);

    return (
        <div
            style={{
                position: 'fixed',
                left: '-10000px',
                top: 0,
                width: `${PAGE_W_CM}cm`,
                height: `${PAGE_H_CM}cm`,
                opacity: 0,
                pointerEvents: 'none',
                zIndex: -1,
            }}
        >
            <div
                ref={etiquetaRef}
                style={{
                    width: '210mm',
                    minHeight: `${minHeightMm}mm`,
                    overflow: 'visible',

                    // ✅ Fondo: ahora sí cubre todo el alto forzado (1+ páginas)
                    backgroundImage: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #9ca3af 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'top left',

                    color: '#0f172a',
                    fontFamily: '"Inter", Arial, sans-serif',
                    boxSizing: 'border-box',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                }}
            >
                <div
                    style={{
                        minHeight: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.2cm',
                        gap: '0.6cm',
                    }}
                >
                    {/* HEADER */}
                    <div
                        className="avoid-break"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.55cm 1cm',
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '20px',
                            border: '1px solid rgba(148,163,184,0.25)',
                            gap: '0.8cm',
                        }}
                    >
                        <div
                            style={{
                                flex: '1 1 0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                gap: '0.18cm',
                            }}
                        >
                            <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                                {selectedProduct?.nombre}
                            </div>

                            {selectedProduct?.tonalidad && (
                                <div
                                    style={{
                                        fontSize: '12px',
                                        letterSpacing: '0.28em',
                                        textTransform: 'uppercase',
                                        color: '#64748b',
                                    }}
                                >
                                    {selectedProduct.tonalidad}
                                </div>
                            )}

                            <div
                                style={{
                                    fontSize: '13px',
                                    color: '#475569',
                                    display: 'flex',
                                    gap: '0.55cm',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}
                            >
                                {selectedProduct?.coleccion && (
                                    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.08cm' }}>
                                        <span>{`${t('collection')}:`}</span>
                                        <span>{selectedProduct.coleccion}</span>
                                    </span>
                                )}

                                {selectedProduct?.codmarca && (
                                    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.08cm' }}>
                                        <span>{`${t('brand')}:`}</span>
                                        <span>{getNombreMarca(selectedProduct.codmarca)}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                gap: '0.12cm',
                                minWidth: '3cm',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '11px',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: '#94a3b8',
                                }}
                            >
                                {t('techSheet')}
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 600 }}>{selectedProduct?.codprodu}</div>
                        </div>

                        {pdfLogo && (
                            <img
                                src={pdfLogo}
                                alt="brand"
                                style={{ width: '4.2cm', height: 'auto', objectFit: 'contain' }}
                            />
                        )}
                    </div>

                    {/* BODY */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.6cm',
                            alignItems: 'start',
                        }}
                    >
                        {/* IMAGEN */}
                        <div
                            className="avoid-break"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                border: '1px solid rgba(148,163,184,0.22)',
                                borderRadius: '18px',
                                padding: '0.45cm',
                                width: '90%',
                                minWidth: 0,
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}
                        >
                            {pdfProductImage && (
                                <img
                                    src={pdfProductImage}
                                    alt="Producto"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '14px',
                                        display: 'block',
                                    }}
                                />
                            )}
                        </div>

                        {/* TARJETAS DE DETALLE */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                                gap: '0.5cm',
                            }}
                        >
                            {[
                                selectedProduct?.tipo && { k: 'type', lab: t('type'), val: selectedProduct.tipo },
                                selectedProduct?.estilo && { k: 'style', lab: t('style'), val: selectedProduct.estilo },
                                selectedProduct?.martindale && { k: 'mart', lab: t('martindale'), val: selectedProduct.martindale },
                                selectedProduct?.repminhor && {
                                    k: 'rh',
                                    lab: t('rapportH'),
                                    val: `${parseFloat(selectedProduct.repminhor).toFixed(2)} cm`,
                                },
                                selectedProduct?.repminver && {
                                    k: 'rv',
                                    lab: t('rapportV'),
                                    val: `${parseFloat(selectedProduct.repminver).toFixed(2)} cm`,
                                },
                                selectedProduct?.composicion && {
                                    k: 'comp',
                                    lab: t('composition'),
                                    val: selectedProduct.composicion,
                                },
                                selectedProduct?.gramaje && {
                                    k: 'w',
                                    lab: t('weight'),
                                    val: `${selectedProduct.gramaje} g/m²`,
                                },
                                selectedProduct?.ancho && { k: 'wd', lab: t('width'), val: `${selectedProduct.ancho}` },
                            ]
                                .filter(Boolean)
                                .map((card) => (
                                    <div
                                        key={card.k}
                                        className="avoid-break"
                                        style={{
                                            background: 'rgba(255,255,255,0.95)',
                                            border: '1px solid rgba(148,163,184,0.22)',
                                            borderRadius: '16px',
                                            padding: '0.55cm',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.18em',
                                                color: '#64748b',
                                                marginBottom: '0.18cm',
                                            }}
                                        >
                                            {card.lab}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                wordBreak: 'break-word',
                                                lineHeight: 1.25,
                                            }}
                                        >
                                            {card.val}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* CARACTERÍSTICAS ESPECIALES DESTACADAS */}
                        {specialFeatures.length > 0 && (
                            <div
                                className="avoid-break"
                                style={{
                                    gridColumn: '1 / -1',
                                    background: 'linear-gradient(135deg, rgba(239,246,255,0.98) 0%, rgba(255,255,255,0.98) 55%, rgba(248,250,252,0.98) 100%)',
                                    border: '1px solid rgba(38,101,158,0.22)',
                                    borderRadius: '18px',
                                    padding: '0.62cm',
                                    boxShadow: '0 10px 28px rgba(15,23,42,0.06)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '0.5cm',
                                        marginBottom: '0.42cm',
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.22em',
                                                color: '#26659E',
                                            }}
                                        >
                                            {t('specialFeatures.pdfTitle', 'Características destacadas')}
                                        </div>
                                        <div
                                            style={{
                                                marginTop: '0.12cm',
                                                fontSize: '12px',
                                                lineHeight: 1.4,
                                                color: '#64748b',
                                            }}
                                        >
                                            {t(
                                                'specialFeatures.pdfSubtitle',
                                                'Prestaciones especiales relevantes de este tejido'
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            border: '1px solid rgba(38,101,158,0.18)',
                                            borderRadius: '9999px',
                                            background: 'rgba(255,255,255,0.9)',
                                            padding: '0.16cm 0.38cm',
                                            fontSize: '9px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.18em',
                                            color: '#26659E',
                                        }}
                                    >
                                        Premium
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: specialFeatures.length === 1
                                            ? '1fr'
                                            : 'repeat(2, minmax(0, 1fr))',
                                        gap: '0.35cm',
                                    }}
                                >
                                    {specialFeatures.map((feature) => (
                                        <div
                                            key={feature.key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.38cm',
                                                minWidth: 0,
                                                background: 'rgba(255,255,255,0.94)',
                                                border: '1px solid rgba(148,163,184,0.20)',
                                                borderRadius: '15px',
                                                padding: '0.4cm',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '1.35cm',
                                                    height: '1.35cm',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '13px',
                                                    background: '#f8fafc',
                                                    border: '1px solid rgba(148,163,184,0.16)',
                                                    padding: '0.16cm',
                                                    boxSizing: 'border-box',
                                                }}
                                            >
                                                <img
                                                    src={feature.image}
                                                    alt={feature.title}
                                                    style={
                                                        feature.wideIcon
                                                            ? {
                                                                width: 'auto',
                                                                height: '0.78cm',
                                                                maxWidth: '1.05cm',
                                                                objectFit: 'contain',
                                                                display: 'block',
                                                            }
                                                            : {
                                                                width: '0.78cm',
                                                                height: '0.78cm',
                                                                objectFit: 'contain',
                                                                display: 'block',
                                                            }
                                                    }
                                                />
                                            </div>

                                            <div style={{ minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontSize: '13px',
                                                        fontWeight: 700,
                                                        color: '#0f172a',
                                                        lineHeight: 1.2,
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {feature.title}
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: '0.1cm',
                                                        fontSize: '10.5px',
                                                        lineHeight: 1.4,
                                                        color: '#64748b',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {feature.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* USOS / CUIDADOS / DIRECCIÓN */}
                        <div
                            className="avoid-break"
                            style={{
                                gridColumn: '1 / -1',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '0.6cm',
                            }}
                        >
                            {/* Usos */}
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    border: '1px solid rgba(148,163,184,0.22)',
                                    borderRadius: '16px',
                                    padding: '0.5cm',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.18em',
                                        color: '#64748b',
                                        marginBottom: '0.32cm',
                                    }}
                                >
                                    {t('sheet.usages')}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25cm' }}>
                                    {(selectedProduct?.uso || '')
                                        .split(';')
                                        .map((u) => u.trim())
                                        .filter((code) => usoBase64?.[code])
                                        .map((code) => (
                                            <img
                                                key={code}
                                                src={usoBase64[code]}
                                                alt={getSingleUsageDisplayValue(code)}
                                                style={{
                                                    width: '22px',
                                                    height: '22px',
                                                    objectFit: 'contain',
                                                    display: 'block',
                                                }}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Cuidados */}
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    border: '1px solid rgba(148,163,184,0.22)',
                                    borderRadius: '16px',
                                    padding: '0.5cm',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.18em',
                                        color: '#64748b',
                                        marginBottom: '0.18cm',
                                    }}
                                >
                                    {t('sheet.cares')}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25cm' }}>
                                    {(() => {
                                        try {
                                            return Array.from(
                                                new DOMParser()
                                                    .parseFromString(selectedProduct?.mantenimiento || '<root/>', 'text/xml')
                                                    .getElementsByTagName('Valor')
                                            )
                                                .map((n) => n.textContent.trim())
                                                .filter((code) => mantBase64?.[code])
                                                .map((code) => (
                                                    <img
                                                        key={code}
                                                        src={mantBase64[code]}
                                                        alt={code}
                                                        style={
                                                            code === 'EASYCLEAN'
                                                                ? {
                                                                    width: 'auto',
                                                                    height: '22px',
                                                                    maxWidth: '46px',
                                                                    objectFit: 'contain',
                                                                    display: 'block',
                                                                }
                                                                : {
                                                                    width: '22px',
                                                                    height: '22px',
                                                                    objectFit: 'contain',
                                                                    display: 'block',
                                                                }
                                                        }
                                                    />
                                                ));
                                        } catch {
                                            return null;
                                        }
                                    })()}
                                </div>
                            </div>

                            {/* Dirección */}
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    border: '1px solid rgba(148,163,184,0.22)',
                                    borderRadius: '16px',
                                    padding: '0.5cm',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {selectedProduct?.direcciontela && direccionBase64?.[selectedProduct.direcciontela] ? (
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35cm',
                                            borderRadius: '9999px',
                                            padding: '0.25cm 0.55cm',
                                        }}
                                    >
                                        <img
                                            src={direccionBase64[selectedProduct.direcciontela]}
                                            alt={selectedProduct.direcciontela}
                                            style={{ width: '28px', height: '28px', objectFit: 'contain', position: 'relative', top: '6px' }}
                                        />
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: '#0f172a',
                                            }}
                                        >
                                            {selectedProduct.direcciontela}
                                        </span>
                                    </div>
                                ) : (
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t('notAvailable')}</span>
                                )}
                            </div>
                        </div>

                        {/* Normas / Especificaciones (solo en PDF) */}
                        {(normativaItems.length > 0 || specItems.length > 0) && (
                            <div
                                style={{
                                    gridColumn: '1 / -1',
                                    display: 'flex',
                                    gap: '0.6cm',
                                    alignItems: 'flex-start',
                                    pageBreakInside: 'auto',
                                    breakInside: 'auto',
                                }}
                            >
                                {/* NORMATIVA */}
                                {normativaItems.length > 0 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.6cm',
                                            pageBreakInside: 'auto',
                                            breakInside: 'auto',
                                        }}
                                    >
                                        {normativaChunks.map((chunk, chunkIndex) => (
                                            <div
                                                key={`norm-card-${chunkIndex}`}
                                                style={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: '1px solid rgba(148,163,184,0.22)',
                                                    borderRadius: '16px',
                                                    padding: '0.55cm',
                                                    pageBreakInside: 'avoid',
                                                    breakInside: 'avoid',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        color: '#64748b',
                                                        marginBottom: '0.18cm',
                                                    }}
                                                >
                                                    {t('sheet.standards')}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18cm' }}>
                                                    {chunk.map((item, idx) => (
                                                        <div
                                                            key={`norm-${chunkIndex}-${idx}`}
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: '0.22cm 1fr',
                                                                columnGap: '0.3cm',
                                                                alignItems: 'start',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '0.18cm',
                                                                    height: '0.18cm',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#0f172a',
                                                                    flexShrink: 0,
                                                                    position: 'relative',
                                                                    top: '0.50em',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    fontSize: '13px',
                                                                    lineHeight: 1.45,
                                                                    wordBreak: 'break-word',
                                                                    overflowWrap: 'anywhere',
                                                                }}
                                                            >
                                                                {item}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ESPECIFICACIONES */}
                                {specItems.length > 0 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.6cm',
                                            pageBreakInside: 'auto',
                                            breakInside: 'auto',
                                        }}
                                    >
                                        {specChunks.map((chunk, chunkIndex) => (
                                            <div
                                                key={`spec-card-${chunkIndex}`}
                                                style={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: '1px solid rgba(148,163,184,0.22)',
                                                    borderRadius: '16px',
                                                    padding: '0.55cm',
                                                    pageBreakInside: 'avoid',
                                                    breakInside: 'avoid',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        color: '#64748b',
                                                        marginBottom: '0.18cm',
                                                    }}
                                                >
                                                    {t('sheet.specifications')}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18cm' }}>
                                                    {chunk.map((item, idx) => (
                                                        <div
                                                            key={`spec-${chunkIndex}-${idx}`}
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: '0.22cm 1fr',
                                                                columnGap: '0.3cm',
                                                                alignItems: 'start',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '0.18cm',
                                                                    height: '0.18cm',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#0f172a',
                                                                    flexShrink: 0,
                                                                    position: 'relative',
                                                                    top: '0.40em',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    fontSize: '13px',
                                                                    lineHeight: 1.45,
                                                                    wordBreak: 'break-word',
                                                                    overflowWrap: 'anywhere',
                                                                }}
                                                            >
                                                                {item}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPdfSheet;