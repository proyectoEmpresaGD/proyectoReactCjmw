import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ChevronDown,
    Search,
    SlidersHorizontal,
    X
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";


const BRAND_NAMES = {
    ARE: "Arena",
    HAR: "Harbour",
    CJM: "CJM",
    FLA: "Flamenco",
    BAS: "Bassari",
};


const ALLOWED_COLORS = [
    "BLANCO",
    "BEIGE",
    "AMARILLO",
    "NARANJA",
    "ROSA",
    "ROJO",
    "VIOLETA",
    "MORADO",
    "VERDE",
    "AZUL",
    "MARRON",
    "GRIS",
    "NEGRO",
];


const COLOR_MAP = {
    BLANCO: "#FFFFFF",
    BEIGE: "#F5F5DC",
    AMARILLO: "#FFFF00",
    NARANJA: "#FFA500",
    ROSA: "#FFC0CB",
    ROJO: "#FF0000",
    VIOLETA: "#EE82EE",
    MORADO: "#800080",
    VERDE: "#008000",
    AZUL: "#0000FF",
    MARRON: "#A52A2A",
    GRIS: "#808080",
    NEGRO: "#000000",
};


const COLOR_ORDER = [
    "BLANCO",
    "BEIGE",
    "AMARILLO",
    "NARANJA",
    "ROSA",
    "ROJO",
    "VIOLETA",
    "MORADO",
    "VERDE",
    "AZUL",
    "MARRON",
    "GRIS",
    "NEGRO",
];


const MARTINDALE_RANGES = [
    "0-10000",
    "10000-15000",
    "15000-25000",
    "25000-40000",
    "40000-50000",
    "50000+",
];


const TIPOS_INVALIDOS = [
    "JAQUARD",
    "TEJIDO ",
    "VISILLO FR",
    "TERCIOPELO",
    "RAYA",
    "BUCLE",
    "PANA",
    "TEJIDO",
    "FALSO LISO",
    "PAPEL PARED",
    "TERCIOPELO FR",
    "FLORES",
    "ESTAMAPADO",
    "ESPIGA",
    "RAYAS",
    "CUADROS",
];


const DIBUJOS_INVALIDOS = [
    "TELAS CON FLORES",
    "BLACKOUT",
    "WALLCOVERING",
    "TERCIOPELO FR",
    "RAFIA",
    "KILM",
    "RAYA",
    "IKAT ",
    "WALLPAPER",
    "FLORES",
    "ANIMAL",
    "LISOS",
    "ESTAMPADO",
    "GEOMETRICA",
    "ESPIGAS",
    "VISILLO",
    "TEJIDO",
    "TERCIOPELO",
    "PANA",
];


const COLECCIONES_INVALIDAS = [
    "MARRAKESH",
    "CARIBEAN PARTY",
];


const SPECIAL_USAGE_KEYS = [
    "IMO",
    "FR",
    "OUTDOOR",
];


const SPECIAL_MAINTENANCE_KEYS = [
    "EASYCLEAN",
];


const EMPTY_FILTERS = {
    brand: [],
    color: [],
    collection: [],
    fabricType: [],
    fabricPattern: [],
    martindaleRanges: [],
    uso: [],
    mantenimiento: [],
};




const normalizeValue = (value) =>
    String(
        value ?? ""
    ).trim();


const normalizeKey = (value) =>
    normalizeValue(value)
        .normalize("NFD")
        .replace(
            /\p{Diacritic}/gu,
            ""
        )
        .toUpperCase();


const uniqueList = (
    values = []
) => {
    const seen =
        new Set();

    return values
        .map(
            normalizeValue
        )
        .filter(Boolean)
        .filter(
            (value) => {
                const key =
                    normalizeKey(
                        value
                    );

                if (
                    !key ||
                    seen.has(key)
                ) {
                    return false;
                }

                seen.add(key);

                return true;
            }
        );
};


const buildFilterList = (
    values = [],
    {
        allow = [],
        deny = [],
    } = {}
) => {
    const allowSet =
        allow.length
            ? new Set(
                allow.map(
                    normalizeKey
                )
            )
            : null;

    const denySet =
        deny.length
            ? new Set(
                deny.map(
                    normalizeKey
                )
            )
            : null;

    return uniqueList(
        values
    ).filter(
        (value) => {
            const key =
                normalizeKey(
                    value
                );

            if (
                allowSet &&
                !allowSet.has(key)
            ) {
                return false;
            }

            if (
                denySet &&
                denySet.has(key)
            ) {
                return false;
            }

            return true;
        }
    );
};


const getSearchValues = (
    params,
    key
) =>
    uniqueList(
        params.getAll(
            key
        )
    );


const parseFiltersFromSearch = (
    search
) => {
    const params =
        new URLSearchParams(
            search
        );

    return {
        brand:
            getSearchValues(
                params,
                "brand"
            ),

        color:
            getSearchValues(
                params,
                "color"
            ),

        collection:
            getSearchValues(
                params,
                "collection"
            ),

        fabricType:
            getSearchValues(
                params,
                "fabricType"
            ),

        fabricPattern:
            getSearchValues(
                params,
                "fabricPattern"
            ),

        martindaleRanges:
            getSearchValues(
                params,
                "martindaleRange"
            ),

        uso:
            getSearchValues(
                params,
                "uso"
            ),

        mantenimiento:
            getSearchValues(
                params,
                "mantenimiento"
            ),
    };
};


const extractMaintenanceValues = (
    raw
) => {
    if (!raw) {
        return [];
    }

    if (
        Array.isArray(raw) &&
        raw.every(
            (value) =>
                typeof value ===
                "string" &&
                !value.includes(
                    "<Valor>"
                )
        )
    ) {
        return raw;
    }

    const source =
        Array.isArray(raw)
            ? raw.join("")
            : String(raw);

    if (
        !source.includes(
            "<Valor>"
        )
    ) {
        return [];
    }

    const values = [];

    const regex =
        /<Valor>\s*([^<]+?)\s*</g;

    let match;

    while (
        (
            match =
            regex.exec(
                source
            )
        ) !== null
    ) {
        values.push(
            match[1]
        );
    }

    return values;
};


const getMartindaleBounds = (
    range
) => {
    if (
        range.endsWith("+")
    ) {
        return {
            min:
                Number(
                    range.replace(
                        "+",
                        ""
                    )
                ),

            max:
                Infinity,
        };
    }

    const [
        minRaw,
        maxRaw
    ] =
        range.split("-");

    return {
        min:
            Number(
                minRaw
            ),

        max:
            Number(
                maxRaw
            ),
    };
};


const FilterSection = ({
    title,
    count,
    isOpen,
    onToggle,
    children,
}) => {
    const hasSelection =
        count > 0;

    return (
        <section
            className={`
                border-b
                border-stone-200
                transition-colors
                duration-300

                ${isOpen
                    ? "bg-stone-50/70"
                    : "bg-transparent"
                }
            `}
        >
            <button
                type="button"
                onClick={
                    onToggle
                }
                aria-expanded={
                    isOpen
                }
                className="
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-3
                    py-4
                    text-left
                    transition-all
                    duration-300
                    hover:bg-stone-50
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <span
                        className={`
                            text-sm
                            transition-colors
                            duration-300

                            ${isOpen
                                ? "font-semibold text-stone-950"
                                : "font-medium text-stone-700"
                            }
                        `}
                    >
                        {title}
                    </span>

                    {hasSelection && (
                        <span
                            className="
                                inline-flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-stone-950
                                px-1.5
                                text-[10px]
                                font-semibold
                                text-white
                            "
                        >
                            {count}
                        </span>
                    )}
                </div>

                <span
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300

                        ${isOpen
                            ? "bg-stone-950 text-white"
                            : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                        }
                    `}
                >
                    <ChevronDown
                        aria-hidden="true"
                        className={`
                            h-4
                            w-4
                            transition-transform
                            duration-300

                            ${isOpen
                                ? "rotate-180"
                                : "rotate-0"
                            }
                        `}
                    />
                </span>
            </button>

            <div
                className={`
                    grid
                    transition-all
                    duration-300
                    ease-out

                    ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                `}
            >
                <div className="overflow-hidden">
                    <div className="px-2 pb-5 pt-1">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};


const FilterOption = ({
    checked,
    label,
    onChange,
    color,
    wrapText = false,
}) => {
    return (
        <label
            className={`
                relative
                group
                flex
                cursor-pointer
                items-start
                gap-3
                rounded-xl
                border
                px-3
                py-2.5
                transition-all
                duration-200

                ${checked
                    ? "border-stone-300 bg-white text-stone-950 shadow-sm"
                    : "border-transparent text-stone-600 hover:border-stone-200 hover:bg-white hover:text-stone-950"
                }
            `}
        >
            <span
                className={`
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border
                    transition-all
                    duration-200

                    ${checked
                        ? "border-stone-950 bg-stone-950"
                        : "border-stone-300 bg-white group-hover:border-stone-500"
                    }
                `}
            >
                {checked && (
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-3.5 w-3.5 text-white"
                        aria-hidden="true"
                    >
                        <path
                            d="M4.5 10.5 8 14l7.5-8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>

            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="
                    absolute
                    inset-0
                    z-10
                    h-full
                    w-full
                    cursor-pointer
                    opacity-0
                "
            />

            {color && (
                <span
                    className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        rounded-full
                        ring-1
                        ring-black/10
                    "
                    style={{
                        backgroundColor:
                            color,
                    }}
                />
            )}

            <span
                className={`
                    min-w-0
                    flex-1
                    text-sm
                    leading-5

                    ${checked
                        ? "font-medium"
                        : "font-normal"
                    }

                    ${wrapText
                        ? "whitespace-normal break-words"
                        : "truncate"
                    }
                `}
            >
                {label}
            </span>

            {checked && (
                <span
                    className="
                        mt-2
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-stone-950
                    "
                />
            )}
        </label>
    );
};


const FilterSearch = ({
    value,
    onChange,
    placeholder,
}) => {
    return (
        <div className="relative mb-4">
            <Search
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-stone-400
                "
            />

            <input
                type="text"
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target
                            .value
                    )
                }
                placeholder={
                    placeholder
                }
                className="
                    w-full
                    rounded-xl
                    border
                    border-stone-200
                    bg-white
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    text-stone-700
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-stone-400
                    hover:border-stone-300
                    focus:border-stone-400
                    focus:ring-4
                    focus:ring-stone-950/5
                "
            />
        </div>
    );
};


export default function DesktopFiltersSidebar({
    mobileOpen = false,
    onMobileClose,
}) {
    const {
        t
    } =
        useTranslation(
            "filterPanelNew"
        );

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const [
        filters,
        setFilters
    ] =
        useState(
            () =>
                parseFiltersFromSearch(
                    location.search
                )
        );


    const [
        options,
        setOptions
    ] =
        useState({
            brands: [],
            collections: [],
            fabricTypes: [],
            fabricPatterns: [],
            martindaleValues: [],
            colors: [],
            usage: [],
            maintenance: [],
        });


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        collectionSearch,
        setCollectionSearch
    ] =
        useState("");


    const [
        typeSearch,
        setTypeSearch
    ] =
        useState("");


    const [
        patternSearch,
        setPatternSearch
    ] =
        useState("");


    const [
        openSections,
        setOpenSections
    ] =
        useState({
            brands: true,
            collections: false,
            colors: false,
            fabricTypes: false,
            patterns: false,
            special: true,
            martindale: false,
        });


    useEffect(() => {
        setFilters(
            parseFiltersFromSearch(
                location.search
            )
        );
    }, [
        location.search
    ]);


    useEffect(() => {
        if (
            !mobileOpen
        ) {
            return undefined;
        }

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style
            .overflow =
            "hidden";

        const handleKeyDown =
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    onMobileClose?.();
                }
            };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style
                .overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        mobileOpen,
        onMobileClose
    ]);


    useEffect(() => {
        const controller =
            new AbortController();

        const loadFilters =
            async () => {
                setLoading(
                    true
                );

                try {
                    const response =
                        await fetch(
                            `${import.meta
                                .env
                                .VITE_API_BASE_URL
                            }/api/products/filters`,
                            {
                                signal:
                                    controller
                                        .signal,
                            }
                        );

                    if (
                        !response.ok
                    ) {
                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }

                    const data =
                        await response
                            .json();


                    const brands =
                        buildFilterList(
                            data?.brands,
                            {
                                allow:
                                    Object.keys(
                                        BRAND_NAMES
                                    ),
                            }
                        ).sort(
                            (
                                a,
                                b
                            ) =>
                                (
                                    BRAND_NAMES[
                                    a
                                    ] || a
                                ).localeCompare(
                                    BRAND_NAMES[
                                    b
                                    ] || b
                                )
                        );


                    const collections =
                        buildFilterList(
                            data?.collections,
                            {
                                deny:
                                    COLECCIONES_INVALIDAS,
                            }
                        ).sort(
                            (
                                a,
                                b
                            ) =>
                                a.localeCompare(
                                    b,
                                    undefined,
                                    {
                                        sensitivity:
                                            "base",
                                    }
                                )
                        );


                    const fabricTypes =
                        buildFilterList(
                            data?.fabricTypes,
                            {
                                deny:
                                    TIPOS_INVALIDOS,
                            }
                        ).sort(
                            (
                                a,
                                b
                            ) =>
                                a.localeCompare(
                                    b,
                                    undefined,
                                    {
                                        sensitivity:
                                            "base",
                                    }
                                )
                        );


                    const patterns =
                        buildFilterList(
                            data?.fabricPatterns,
                            {
                                deny:
                                    DIBUJOS_INVALIDOS,
                            }
                        );


                    [
                        "RAYAS",
                        "CUADROS"
                    ].forEach(
                        (value) => {
                            const exists =
                                patterns.some(
                                    (
                                        item
                                    ) =>
                                        normalizeKey(
                                            item
                                        ) ===
                                        normalizeKey(
                                            value
                                        )
                                );

                            if (
                                !exists
                            ) {
                                patterns.push(
                                    value
                                );
                            }
                        }
                    );


                    patterns.sort(
                        (
                            a,
                            b
                        ) =>
                            a.localeCompare(
                                b,
                                undefined,
                                {
                                    sensitivity:
                                        "base",
                                }
                            )
                    );


                    const allowedColorSet =
                        new Set(
                            ALLOWED_COLORS.map(
                                normalizeKey
                            )
                        );


                    const colors =
                        buildFilterList(
                            data?.colors
                        )
                            .filter(
                                (
                                    color
                                ) =>
                                    allowedColorSet
                                        .has(
                                            normalizeKey(
                                                color
                                            )
                                        )
                            )
                            .sort(
                                (
                                    a,
                                    b
                                ) =>
                                    COLOR_ORDER
                                        .indexOf(
                                            normalizeKey(
                                                a
                                            )
                                        ) -
                                    COLOR_ORDER
                                        .indexOf(
                                            normalizeKey(
                                                b
                                            )
                                        )
                            );


                    const usageRaw =
                        data?.uso ||
                        data?.usos ||
                        data?.usage ||
                        [];


                    const usage =
                        buildFilterList(
                            usageRaw
                        ).filter(
                            (
                                value
                            ) =>
                                SPECIAL_USAGE_KEYS
                                    .includes(
                                        normalizeKey(
                                            value
                                        )
                                    )
                        );


                    const maintenanceRaw =
                        data?.mantenimiento ||
                        data?.mantenimientos ||
                        data?.maintenance ||
                        data?.maintenances;


                    const maintenance =
                        buildFilterList(
                            extractMaintenanceValues(
                                maintenanceRaw
                            )
                        ).filter(
                            (
                                value
                            ) =>
                                SPECIAL_MAINTENANCE_KEYS
                                    .includes(
                                        normalizeKey(
                                            value
                                        )
                                    )
                        );


                    const martindaleValues =
                        [
                            ...new Set(
                                (
                                    data?.martindaleValues ||
                                    []
                                )
                                    .map(
                                        Number
                                    )
                                    .filter(
                                        Number.isFinite
                                    )
                            ),
                        ].sort(
                            (
                                a,
                                b
                            ) =>
                                b - a
                        );


                    if (
                        controller
                            .signal
                            .aborted
                    ) {
                        return;
                    }


                    setOptions({
                        brands,
                        collections,
                        fabricTypes,

                        fabricPatterns:
                            patterns,

                        martindaleValues,
                        colors,
                        usage,
                        maintenance,
                    });
                } catch (
                error
                ) {
                    if (
                        error?.name !==
                        "AbortError"
                    ) {
                        console.error(
                            "Error cargando filtros laterales:",
                            error
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadFilters();


        return () => {
            controller.abort();
        };
    }, []);


    const toggleSection =
        useCallback(
            (section) => {
                setOpenSections(
                    (
                        current
                    ) => ({
                        ...current,

                        [section]:
                            !current[
                            section
                            ],
                    })
                );
            },
            []
        );


    const toggleFilter =
        useCallback(
            (
                key,
                value
            ) => {
                setFilters(
                    (
                        current
                    ) => {
                        const currentValues =
                            current[
                            key
                            ] || [];

                        const normalizedValue =
                            normalizeKey(
                                value
                            );

                        const exists =
                            currentValues
                                .some(
                                    (
                                        item
                                    ) =>
                                        normalizeKey(
                                            item
                                        ) ===
                                        normalizedValue
                                );

                        return {
                            ...current,

                            [key]:
                                exists
                                    ? currentValues
                                        .filter(
                                            (
                                                item
                                            ) =>
                                                normalizeKey(
                                                    item
                                                ) !==
                                                normalizedValue
                                        )
                                    : [
                                        ...currentValues,
                                        value,
                                    ],
                        };
                    }
                );
            },
            []
        );


    const isSelected =
        useCallback(
            (
                key,
                value
            ) =>
                (
                    filters[
                    key
                    ] || []
                ).some(
                    (
                        item
                    ) =>
                        normalizeKey(
                            item
                        ) ===
                        normalizeKey(
                            value
                        )
                ),
            [
                filters
            ]
        );


    const filteredCollections =
        useMemo(
            () =>
                options
                    .collections
                    .filter(
                        (
                            value
                        ) =>
                            normalizeKey(
                                value
                            ).includes(
                                normalizeKey(
                                    collectionSearch
                                )
                            )
                    ),
            [
                options.collections,
                collectionSearch
            ]
        );


    const filteredTypes =
        useMemo(
            () =>
                options
                    .fabricTypes
                    .filter(
                        (
                            value
                        ) =>
                            normalizeKey(
                                value
                            ).includes(
                                normalizeKey(
                                    typeSearch
                                )
                            )
                    ),
            [
                options.fabricTypes,
                typeSearch
            ]
        );


    const filteredPatterns =
        useMemo(
            () =>
                options
                    .fabricPatterns
                    .filter(
                        (
                            value
                        ) =>
                            normalizeKey(
                                value
                            ).includes(
                                normalizeKey(
                                    patternSearch
                                )
                            )
                    ),
            [
                options.fabricPatterns,
                patternSearch
            ]
        );


    const totalSelected =
        useMemo(
            () =>
                Object.values(
                    filters
                ).reduce(
                    (
                        total,
                        values
                    ) =>
                        total +
                        (
                            Array.isArray(
                                values
                            )
                                ? values.length
                                : 0
                        ),
                    0
                ),
            [
                filters
            ]
        );


    const handleClear =
        () => {
            setFilters({
                ...EMPTY_FILTERS,
            });
        };


    const handleApply =
        () => {
            const params =
                new URLSearchParams();


            filters.brand
                .forEach(
                    (value) =>
                        params.append(
                            "brand",
                            value
                        )
                );


            filters.color
                .forEach(
                    (value) =>
                        params.append(
                            "color",
                            value
                        )
                );


            filters.collection
                .forEach(
                    (value) =>
                        params.append(
                            "collection",
                            value
                        )
                );


            filters.fabricType
                .forEach(
                    (value) =>
                        params.append(
                            "fabricType",
                            value
                        )
                );


            filters.fabricPattern
                .forEach(
                    (value) =>
                        params.append(
                            "fabricPattern",
                            value
                        )
                );


            filters.uso
                .forEach(
                    (value) =>
                        params.append(
                            "uso",
                            value
                        )
                );


            filters.mantenimiento
                .forEach(
                    (value) =>
                        params.append(
                            "mantenimiento",
                            value
                        )
                );


            const martindaleNumbers =
                [];


            filters
                .martindaleRanges
                .forEach(
                    (range) => {
                        params.append(
                            "martindaleRange",
                            range
                        );

                        const {
                            min,
                            max
                        } =
                            getMartindaleBounds(
                                range
                            );

                        options
                            .martindaleValues
                            .forEach(
                                (
                                    value
                                ) => {
                                    if (
                                        value >= min &&
                                        value <= max
                                    ) {
                                        martindaleNumbers
                                            .push(
                                                value
                                            );
                                    }
                                }
                            );
                    }
                );


            [
                ...new Set(
                    martindaleNumbers
                ),
            ].forEach(
                (value) =>
                    params.append(
                        "martindale",
                        String(
                            value
                        )
                    )
            );


            params.set(
                "page",
                "1"
            );


            navigate(
                `/products?${params.toString()}`
            );


            onMobileClose?.();


            try {
                window.scrollTo({
                    top: 0,
                    behavior:
                        "auto",
                });
            } catch {
                // Sin acción
            }
        };


    return (
        <>
            {/* FONDO OSCURO - MOBILE */}
            <button
                type="button"
                aria-label="Cerrar filtros"
                onClick={() =>
                    onMobileClose?.()
                }
                className={`
                    fixed
                    inset-0
                    z-[70]
                    bg-black/35
                    backdrop-blur-[2px]
                    transition-opacity
                    duration-300

                    lg:hidden

                    ${mobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            />


            {/* PANEL DE FILTROS */}
            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-[80]

                    w-[90%]
                    max-w-[380px]

                    transform
                    bg-white
                    shadow-2xl

                    transition-transform
                    duration-300
                    ease-out

                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                    lg:sticky
                    lg:top-[110px]
                    lg:bottom-auto
                    lg:z-auto

                    lg:block
                    lg:w-auto
                    lg:max-w-none

                    lg:translate-x-0
                    lg:self-start

                    lg:bg-transparent
                    lg:shadow-none

                    lg:transition-none
                `}
            >
                <div
                    className="
                        flex
                        h-full
                        max-h-screen
                        flex-col
                        overflow-hidden
                        bg-white

                        lg:h-auto
                        lg:max-h-[calc(100vh-130px)]

                        lg:rounded-3xl
                        lg:border
                        lg:border-stone-200

                        lg:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                    "
                >
                    {/* CABECERA */}
                    <div
                        className="
                            z-20
                            flex-none
                            border-b
                            border-stone-200
                            bg-white/95
                            px-5
                            py-5
                            backdrop-blur-md
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <SlidersHorizontal
                                        className="
                                            h-4
                                            w-4
                                            text-stone-500
                                        "
                                    />

                                    <h2
                                        className="
                                            text-lg
                                            font-semibold
                                            text-stone-950
                                        "
                                    >
                                        {t(
                                            "title",
                                            "Filtros"
                                        )}
                                    </h2>
                                </div>


                                {totalSelected > 0 && (
                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-stone-400
                                        "
                                    >
                                        {t(
                                            "selectedCount",
                                            {
                                                count:
                                                    totalSelected,

                                                defaultValue:
                                                    `${totalSelected} seleccionados`,
                                            }
                                        )}
                                    </p>
                                )}
                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                {totalSelected > 0 && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleClear
                                        }
                                        className="
                                            text-xs
                                            font-medium
                                            text-stone-500
                                            transition
                                            hover:text-stone-950
                                        "
                                    >
                                        {t(
                                            "clearAll",
                                            "Limpiar"
                                        )}
                                    </button>
                                )}


                                {/* CERRAR - SOLO MOBILE */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onMobileClose?.()
                                    }
                                    aria-label="Cerrar filtros"
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-stone-100
                                        text-stone-600
                                        transition
                                        hover:bg-stone-200
                                        hover:text-stone-950
                                        lg:hidden
                                    "
                                >
                                    <X
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* CONTENIDO CON SCROLL */}
                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overscroll-contain
                            [overflow-anchor:none]
                            px-5
                        "
                    >
                        {loading ? (
                            <div
                                className="
                                    py-10
                                    text-center
                                    text-sm
                                    text-stone-400
                                "
                            >
                                Cargando filtros...
                            </div>
                        ) : (
                            <>
                                {/* MARCAS */}
                                <FilterSection
                                    title={t(
                                        "categories.brands",
                                        "Marcas"
                                    )}
                                    count={
                                        filters
                                            .brand
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .brands
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "brands"
                                        )
                                    }
                                >
                                    <div className="space-y-0.5">
                                        {options
                                            .brands
                                            .map(
                                                (
                                                    brand
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            brand
                                                        }
                                                        label={
                                                            BRAND_NAMES[
                                                            brand
                                                            ] ||
                                                            brand
                                                        }
                                                        checked={isSelected(
                                                            "brand",
                                                            brand
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "brand",
                                                                brand
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* COLECCIONES */}
                                <FilterSection
                                    title={t(
                                        "categories.collections",
                                        "Colecciones"
                                    )}
                                    count={
                                        filters
                                            .collection
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .collections
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "collections"
                                        )
                                    }
                                >
                                    <FilterSearch
                                        value={
                                            collectionSearch
                                        }
                                        onChange={
                                            setCollectionSearch
                                        }
                                        placeholder={t(
                                            "placeholders.searchcolecciones",
                                            "Buscar colecciones..."
                                        )}
                                    />

                                    <div
                                        className="
                                            max-h-64
                                            space-y-0.5
                                            overflow-y-auto
                                            overscroll-contain
                                            [overflow-anchor:none]
                                            pr-1
                                        "
                                    >
                                        {filteredCollections
                                            .map(
                                                (
                                                    collection
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            collection
                                                        }
                                                        label={
                                                            collection
                                                        }
                                                        checked={isSelected(
                                                            "collection",
                                                            collection
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "collection",
                                                                collection
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* COLORES */}
                                <FilterSection
                                    title={t(
                                        "categories.colors",
                                        "Colores"
                                    )}
                                    count={
                                        filters
                                            .color
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .colors
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "colors"
                                        )
                                    }
                                >
                                    <div className="space-y-0.5">
                                        {options
                                            .colors
                                            .map(
                                                (
                                                    color
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            color
                                                        }
                                                        label={
                                                            color
                                                        }
                                                        color={
                                                            COLOR_MAP[
                                                            normalizeKey(
                                                                color
                                                            )
                                                            ]
                                                        }
                                                        checked={isSelected(
                                                            "color",
                                                            color
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "color",
                                                                color
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* TIPOS */}
                                <FilterSection
                                    title={t(
                                        "categories.fabricTypes",
                                        "Tipos de tela"
                                    )}
                                    count={
                                        filters
                                            .fabricType
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .fabricTypes
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "fabricTypes"
                                        )
                                    }
                                >
                                    <FilterSearch
                                        value={
                                            typeSearch
                                        }
                                        onChange={
                                            setTypeSearch
                                        }
                                        placeholder={t(
                                            "placeholders.searchtipos",
                                            "Buscar tipos..."
                                        )}
                                    />

                                    <div
                                        className="
                                            max-h-64
                                            space-y-0.5
                                            overflow-y-auto
                                            overscroll-contain
                                            [overflow-anchor:none]
                                            pr-1
                                        "
                                    >
                                        {filteredTypes
                                            .map(
                                                (
                                                    type
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            type
                                                        }
                                                        label={
                                                            type
                                                        }
                                                        checked={isSelected(
                                                            "fabricType",
                                                            type
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "fabricType",
                                                                type
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* DIBUJO */}
                                <FilterSection
                                    title={t(
                                        "categories.patterns",
                                        "Dibujo"
                                    )}
                                    count={
                                        filters
                                            .fabricPattern
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .patterns
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "patterns"
                                        )
                                    }
                                >
                                    <FilterSearch
                                        value={
                                            patternSearch
                                        }
                                        onChange={
                                            setPatternSearch
                                        }
                                        placeholder={t(
                                            "placeholders.searchdibujo",
                                            "Buscar dibujos..."
                                        )}
                                    />

                                    <div
                                        className="
                                            max-h-64
                                            space-y-0.5
                                            overflow-y-auto
                                            overscroll-contain
                                            [overflow-anchor:none]
                                            pr-1
                                        "
                                    >
                                        {filteredPatterns
                                            .map(
                                                (
                                                    pattern
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            pattern
                                                        }
                                                        label={
                                                            pattern
                                                        }
                                                        checked={isSelected(
                                                            "fabricPattern",
                                                            pattern
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "fabricPattern",
                                                                pattern
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* TELAS ESPECIALES */}
                                <FilterSection
                                    title={t(
                                        "categories.specialFabrics",
                                        "Telas especiales"
                                    )}
                                    count={
                                        filters
                                            .uso
                                            .length +
                                        filters
                                            .mantenimiento
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .special
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "special"
                                        )
                                    }
                                >
                                    <div className="space-y-0.5">
                                        {options
                                            .usage
                                            .map(
                                                (
                                                    usage
                                                ) => (
                                                    <FilterOption
                                                        key={`usage-${usage}`}
                                                        label={
                                                            normalizeKey(
                                                                usage
                                                            ) ===
                                                                "OUTDOOR"
                                                                ? "OUTDOOR-INDOOR"
                                                                : usage
                                                        }
                                                        checked={isSelected(
                                                            "uso",
                                                            usage
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "uso",
                                                                usage
                                                            )
                                                        }
                                                    />
                                                )
                                            )}


                                        {options
                                            .maintenance
                                            .map(
                                                (
                                                    maintenance
                                                ) => (
                                                    <FilterOption
                                                        key={`maintenance-${maintenance}`}
                                                        label={
                                                            maintenance
                                                        }
                                                        checked={isSelected(
                                                            "mantenimiento",
                                                            maintenance
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "mantenimiento",
                                                                maintenance
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>


                                {/* MARTINDALE */}
                                <FilterSection
                                    title={t(
                                        "categories.martindale",
                                        "Martindale"
                                    )}
                                    count={
                                        filters
                                            .martindaleRanges
                                            .length
                                    }
                                    isOpen={
                                        openSections
                                            .martindale
                                    }
                                    onToggle={() =>
                                        toggleSection(
                                            "martindale"
                                        )
                                    }
                                >
                                    <div className="space-y-0.5">
                                        {MARTINDALE_RANGES
                                            .map(
                                                (
                                                    range
                                                ) => (
                                                    <FilterOption
                                                        key={
                                                            range
                                                        }
                                                        label={t(
                                                            `martRanges.${range}`,
                                                            range
                                                        )}
                                                        checked={isSelected(
                                                            "martindaleRanges",
                                                            range
                                                        )}
                                                        onChange={() =>
                                                            toggleFilter(
                                                                "martindaleRanges",
                                                                range
                                                            )
                                                        }
                                                        wrapText
                                                    />
                                                )
                                            )}
                                    </div>
                                </FilterSection>
                            </>
                        )}
                    </div>


                    {/* BOTÓN APLICAR */}
                    <div
                        className="
                            flex-none
                            border-t
                            border-stone-200
                            bg-white
                            p-5
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleApply
                            }
                            className="
                                w-full
                                rounded-xl
                                bg-stone-950
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-200
                                hover:bg-stone-800
                                active:scale-[0.99]
                            "
                        >
                            {t(
                                "apply",
                                "Aplicar filtros"
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}