import {
    ChevronRight,
    Mail,
    MapPin,
    Navigation,
    Phone,
} from 'lucide-react';

function StoreCard({
    store,
    position,
    selectedStore,
    onSelect,
    t,
}) {
    const isSelected =
        selectedStore?.__storeId === store.__storeId;

    const hasDistance =
        Number.isFinite(store.distanceKm);

    return (
        <li
            className={`
                group relative overflow-hidden rounded-2xl border
                transition duration-200

                ${isSelected
                    ? `
                        border-[#26659E]
                        bg-[#26659E]/[0.045]
                        shadow-[0_8px_30px_rgba(38,101,158,0.12)]
                    `
                    : `
                        border-slate-200
                        bg-white
                        hover:border-[#26659E]/30
                        hover:shadow-md
                    `
                }
            `}
        >
            {isSelected && (
                <span
                    className="
                        absolute inset-y-0 left-0
                        w-1 bg-[#26659E]
                    "
                    aria-hidden="true"
                />
            )}

            <button
                type="button"
                onClick={() => onSelect(store)}
                className="
                    block w-full px-4 pb-3 pt-4
                    text-left
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-[#26659E]
                "
                aria-pressed={isSelected}
            >
                <div className="flex items-start gap-3">

                    {/* Posición */}
                    <span
                        className={`
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-full
                            text-xs font-bold

                            ${isSelected
                                ? 'bg-[#26659E] text-white'
                                : 'bg-slate-100 text-slate-500'
                            }
                        `}
                    >
                        {String(position).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">

                        {/* Nombre + distancia */}
                        <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">
                                <h4
                                    className="
                                        text-[0.95rem] font-semibold
                                        leading-snug text-slate-900
                                    "
                                >
                                    {store.title}
                                </h4>

                                {store.description && (
                                    <p
                                        className="
                                            mt-0.5 text-xs
                                            leading-relaxed text-slate-500
                                        "
                                    >
                                        {store.description}
                                    </p>
                                )}
                            </div>

                            {hasDistance && (
                                <div className="shrink-0 text-right">
                                    <span
                                        className="
                                            block text-base font-bold
                                            text-[#26659E]
                                        "
                                    >
                                        {store.distanceKm.toFixed(1)} km
                                    </span>

                                    <span
                                        className="
                                            text-[0.65rem] font-medium
                                            uppercase tracking-[0.12em]
                                            text-slate-400
                                        "
                                    >
                                        {t('distance', {
                                            defaultValue: 'Distancia',
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Dirección */}
                        {(store.direccion || store.cp) && (
                            <div
                                className="
                                    mt-3 flex items-start gap-2
                                    text-xs leading-relaxed text-slate-500
                                "
                            >
                                <MapPin
                                    className="
                                        mt-0.5 h-3.5 w-3.5
                                        shrink-0 text-slate-400
                                    "
                                    aria-hidden="true"
                                />

                                <span>
                                    {store.direccion}

                                    {store.cp && (
                                        <>
                                            {store.direccion ? ', ' : ''}
                                            {store.cp}
                                        </>
                                    )}
                                </span>
                            </div>
                        )}

                        {/* Estado de proximidad */}
                        {hasDistance && (
                            <div className="mt-3">
                                <span
                                    className={`
                                        inline-flex items-center gap-1.5
                                        text-[0.7rem] font-semibold

                                        ${store.isWithinRadius
                                            ? 'text-emerald-700'
                                            : 'text-amber-700'
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            h-1.5 w-1.5 rounded-full

                                            ${store.isWithinRadius
                                                ? 'bg-emerald-500'
                                                : 'bg-amber-500'
                                            }
                                        `}
                                    />

                                    {store.isWithinRadius
                                        ? t('withinRadius')
                                        : t('outsideRadius')
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </button>

            {/* Pie */}
            <div
                className="
                    mx-4 flex items-center justify-between
                    border-t border-slate-100
                    py-3
                "
            >
                <div className="flex items-center gap-3">

                    {store.telefono && (
                        <a
                            href={`tel:${store.telefono}`}
                            className="
                                inline-flex items-center gap-1.5
                                text-xs font-medium text-slate-500
                                transition hover:text-[#26659E]
                            "
                            title={store.telefono}
                        >
                            <Phone
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />

                            <span className="hidden xl:inline">
                                {t('phone', {
                                    defaultValue: 'Teléfono',
                                })}
                            </span>
                        </a>
                    )}

                    {store.correo && (
                        <a
                            href={`mailto:${store.correo}`}
                            className="
                                inline-flex items-center gap-1.5
                                text-xs font-medium text-slate-500
                                transition hover:text-[#26659E]
                            "
                            title={store.correo}
                        >
                            <Mail
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />

                            <span className="hidden xl:inline">
                                {t('email', {
                                    defaultValue: 'Email',
                                })}
                            </span>
                        </a>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onSelect(store)}
                    className="
                        inline-flex items-center gap-1
                        text-xs font-semibold text-[#26659E]
                        transition
                        hover:gap-2
                    "
                >
                    {isSelected
                        ? t('selectedStore', {
                            defaultValue: 'Seleccionado',
                        })
                        : t('viewOnMap', {
                            defaultValue: 'Ver en mapa',
                        })
                    }

                    {!isSelected && (
                        <ChevronRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                    )}
                </button>
            </div>
        </li>
    );
}

export default function StorePanel({
    stores,
    origin,
    nearbyStores,
    nearestStoreOutsideRadius,
    selectedStore,
    onSelect,
    isExpanded,
    t,
}) {
    const hasNoNearbyStores =
        Boolean(origin) &&
        nearbyStores.length === 0;

    return (
        <aside
            className={
                isExpanded
                    ? `
                        min-h-0 w-full
                        lg:max-h-[calc(100dvh-2rem)]
                    `
                    : `
                        col-span-4 mx-auto w-full px-2
                        lg:col-span-1
                    `
            }
        >
            <div
                className={`
                    overflow-hidden
                    rounded-2xl
                    border border-white/40
                    bg-white/95
                    shadow-xl
                    backdrop-blur

                    ${isExpanded
                        ? 'flex h-full min-h-0 flex-col'
                        : 'mx-auto max-h-[80vh]'
                    }
                `}
            >

                {/* Cabecera */}
                <div
                    className="
                        shrink-0 border-b border-slate-100
                        bg-white/95 px-5 py-5
                        backdrop-blur
                    "
                >
                    <div className="flex items-start justify-between gap-3">

                        <div>
                            <div
                                className="
                                    mb-1 flex items-center gap-2
                                    text-[#26659E]
                                "
                            >
                                <Navigation
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                <span
                                    className="
                                        text-[0.65rem] font-bold
                                        uppercase tracking-[0.18em]
                                    "
                                >
                                    {origin
                                        ? t('sortedByProximity', {
                                            defaultValue:
                                                'Ordenados por proximidad',
                                        })
                                        : t('storeLocations', {
                                            defaultValue:
                                                'Puntos de venta',
                                        })
                                    }
                                </span>
                            </div>

                            <h3
                                className="
                                    text-xl font-semibold
                                    tracking-tight text-slate-950
                                "
                            >
                                {isExpanded
                                    ? t('allStoresByProximityTitle')
                                    : t('nearbyStoresTitle')
                                }
                            </h3>
                        </div>

                        {stores.length > 0 && (
                            <span
                                className="
                                    flex h-8 min-w-8 items-center
                                    justify-center rounded-full
                                    bg-slate-100 px-2
                                    text-xs font-bold text-slate-600
                                "
                            >
                                {stores.length}
                            </span>
                        )}
                    </div>

                    {origin && stores.length > 0 && (
                        <p className="mt-2 text-xs text-slate-400">
                            {t('nearestFirst', {
                                defaultValue:
                                    'Los establecimientos más cercanos aparecen primero.',
                            })}
                        </p>
                    )}
                </div>

                {/* Contenido desplazable */}
                <div
                    className={`
                        p-3

                        ${isExpanded
                            ? 'min-h-0 flex-1 overflow-y-auto'
                            : 'max-h-[65vh] overflow-y-auto'
                        }
                    `}
                >

                    {!origin && isExpanded && (
                        <div
                            className="
                                mb-3 rounded-xl
                                border border-slate-200
                                bg-slate-50
                                px-4 py-3
                                text-sm leading-relaxed text-slate-600
                            "
                        >
                            {t('searchToSortByProximity')}
                        </div>
                    )}

                    {hasNoNearbyStores &&
                        nearestStoreOutsideRadius && (
                            <div
                                className="
                                    mb-3 rounded-xl
                                    border border-amber-200
                                    bg-amber-50
                                    px-4 py-3
                                    text-sm leading-relaxed text-amber-900
                                "
                            >
                                {t(
                                    'noNearbyStoresWithNearest',
                                    {
                                        store:
                                            nearestStoreOutsideRadius.title,

                                        distance:
                                            nearestStoreOutsideRadius
                                                .distanceKm
                                                .toFixed(1),
                                    }
                                )}
                            </div>
                        )}

                    {hasNoNearbyStores &&
                        !nearestStoreOutsideRadius && (
                            <div
                                className="
                                    mb-3 rounded-xl
                                    bg-slate-50 px-4 py-3
                                    text-sm text-slate-600
                                "
                            >
                                {t('noNearbyStores')}
                            </div>
                        )}

                    {stores.length > 0 && (
                        <ul className="space-y-2.5">
                            {stores.map((store, index) => (
                                <StoreCard
                                    key={store.__storeId}
                                    store={store}
                                    position={index + 1}
                                    selectedStore={selectedStore}
                                    onSelect={onSelect}
                                    t={t}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
}