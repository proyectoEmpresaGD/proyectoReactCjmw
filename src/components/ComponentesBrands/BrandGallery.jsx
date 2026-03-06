import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { homeBrands } from "../../Constants/constants";

const DEFAULTS = Object.freeze({
    title: "GALERÍA",
    targetRowHeight: 320, // prueba 300–360
    gap: 10,              // opcional: menos separación = se ven más grandes
    justifyLastRow: false,

});

const normalizeKey = (s) => String(s || "").trim().toLowerCase();

function useContainerWidth(ref) {
    const [w, setW] = useState(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => setW(Math.floor(el.getBoundingClientRect().width || 0));
        measure();

        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => measure());
            ro.observe(el);
        }

        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("resize", measure);
            if (ro) ro.disconnect();
        };
    }, [ref]);

    return w;
}

function buildRowsLayout({
    photos,
    containerWidth,
    targetRowHeight,
    gap,
    justifyLastRow,
    imageSizes,
}) {
    if (!containerWidth || containerWidth <= 0) return [];

    const rows = [];
    let row = [];
    let rowAspectSum = 0;

    const getAspect = (p) => {
        // 1) si el item ya trae width/height
        const w = Number(p?.width);
        const h = Number(p?.height);
        if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return w / h;

        // 2) si ya conocemos tamaño real por onLoad
        const sz = imageSizes?.[p?._idx];
        if (sz?.width && sz?.height) return sz.width / sz.height;

        // 3) fallback mientras carga
        return 4 / 3;
    };

    const flush = (isLast) => {
        if (!row.length) return;

        const gapsTotal = gap * (row.length - 1);
        const available = containerWidth - gapsTotal;

        let rowHeight = available / rowAspectSum;
        if (isLast && !justifyLastRow) rowHeight = targetRowHeight;

        const items = row.map((p) => {
            const aspect = getAspect(p);
            return {
                ...p,
                _layout: {
                    width: Math.max(1, Math.round(aspect * rowHeight)),
                    height: Math.max(1, Math.round(rowHeight)),
                },
            };
        });

        rows.push({ items });
        row = [];
        rowAspectSum = 0;
    };

    for (const p of photos) {
        const aspect = getAspect(p);
        row.push(p);
        rowAspectSum += aspect;

        const gapsTotal = gap * (row.length - 1);
        const expectedWidth = rowAspectSum * targetRowHeight + gapsTotal;

        if (expectedWidth >= containerWidth) flush(false);
    }

    flush(true);
    return rows;
}

function BrandGallery({
    brandKey,
    title = DEFAULTS.title,
    texto,
    items,
    className = "",
    onOpenProducts,
    targetRowHeight = DEFAULTS.targetRowHeight,
    gap = DEFAULTS.gap,
    justifyLastRow = DEFAULTS.justifyLastRow,
}) {
    const itemsRef = useRef([]);
    const [visible, setVisible] = useState(() => new Set());

    const containerRef = useRef(null);
    const containerWidth = useContainerWidth(containerRef);

    const [imageSizes, setImageSizes] = useState({});

    const handleImageLoad = (index, e) => {
        const img = e?.currentTarget;
        const naturalWidth = img?.naturalWidth;
        const naturalHeight = img?.naturalHeight;
        if (!naturalWidth || !naturalHeight) return;

        setImageSizes((prev) => {
            const cur = prev[index];
            if (cur?.width === naturalWidth && cur?.height === naturalHeight) return prev;
            return { ...prev, [index]: { width: naturalWidth, height: naturalHeight } };
        });
    };

    const galleryItems = useMemo(() => {
        if (Array.isArray(items) && items.length) return items;

        const key = normalizeKey(brandKey);
        const brand = (homeBrands || []).find((b) => normalizeKey(b?.key) === key);
        return Array.isArray(brand?.gallery) ? brand.gallery : [];
    }, [brandKey, items]);

    const indexedItems = useMemo(
        () => galleryItems.map((it, idx) => ({ ...it, _idx: idx })),
        [galleryItems]
    );
    const responsiveRowHeight = useMemo(() => {
        if (containerWidth < 520) return 220;
        if (containerWidth < 900) return 280;
        return 340; // desktop grande
    }, [containerWidth]);
    const rows = useMemo(() => {
        return buildRowsLayout({
            photos: indexedItems,
            containerWidth,
            targetRowHeight: responsiveRowHeight, // 👈 aquí
            gap,
            justifyLastRow,
            imageSizes,
        });
    }, [indexedItems, containerWidth, responsiveRowHeight, gap, justifyLastRow, imageSizes]);

    useEffect(() => {
        if (!galleryItems.length) return;

        // ✅ Si IntersectionObserver no existe, mostramos todo
        if (typeof IntersectionObserver === "undefined") {
            setVisible(new Set(indexedItems.map((it) => it._idx)));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const idx = entry.target?.dataset?.index;
                    if (!entry.isIntersecting || idx == null) return;

                    setVisible((prev) => {
                        const next = new Set(prev);
                        next.add(Number(idx));
                        return next;
                    });
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -120px 0px" }
        );

        // ✅ Importante: observa en el siguiente frame para asegurar layout listo
        const rafId = requestAnimationFrame(() => {
            indexedItems.forEach((it) => {
                const el = itemsRef.current[it._idx];
                if (el) observer.observe(el);
            });
        });

        // ✅ Fallback: si el observer no marca nada, mostramos todo
        const tId = setTimeout(() => {
            setVisible((prev) => {
                if (prev.size > 0) return prev;
                return new Set(indexedItems.map((it) => it._idx));
            });
        }, 300);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(tId);
            observer.disconnect();
        };
    }, [galleryItems.length, indexedItems]);

    if (!galleryItems.length) return null;

    const delays = ["delay-0", "delay-75", "delay-150", "delay-200", "delay-300"];

    const handleClick = (item) => {
        const codes = Array.isArray(item?.productCodes) ? item.productCodes.filter(Boolean) : [];
        if (!codes.length) return;
        onOpenProducts?.(codes, item);
    };

    const shouldFallbackGrid = containerWidth <= 10 || rows.length === 0;

    return (
        <section className={`w-full px-4 py-12 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    {/* Fila: título + línea */}
                    <div className="flex items-end gap-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-black">
                            {title}
                        </h2>
                        <div className="hidden md:block h-[2px] flex-1 bg-black/10 rounded-full" />
                    </div>

                    {/* Texto inferior */}
                    <p className="mt-3 text-sm md:text-base text-black/50">
                        {texto}
                    </p>
                </div>

                <div ref={containerRef} className="w-full">
                    {shouldFallbackGrid ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems.map((item, index) => {
                                const isVisible = visible.has(index);
                                const delayClass = delays[index % delays.length];

                                const isHero = index === 0;
                                const spanClass = isHero ? "md:col-span-2 lg:col-span-2" : "";

                                const isClickable =
                                    typeof onOpenProducts === "function" &&
                                    Array.isArray(item?.productCodes) &&
                                    item.productCodes.some(Boolean);

                                return (
                                    <article
                                        key={`${item.key || item.title || "g"}-${index}`}
                                        data-index={index}
                                        ref={(el) => (itemsRef.current[index] = el)}
                                        className={[
                                            "group relative overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-sm",
                                            "transition-[opacity,transform] duration-700 ease-out",
                                            delayClass,
                                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                                            spanClass,
                                            isClickable ? "cursor-pointer" : "",
                                        ].join(" ")}
                                        onClick={isClickable ? () => handleClick(item) : undefined}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title || "Galería"}
                                            onLoad={(e) => handleImageLoad(index, e)}
                                            className={[
                                                "w-full object-cover transition-transform duration-700",
                                                "group-hover:scale-[1.03]",
                                                isHero ? "h-96" : "h-72",
                                            ].join(" ")}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-white/20" />
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col" style={{ gap }}>
                            {rows.map((row, rIdx) => (
                                <div
                                    key={`row-${rIdx}`}
                                    className="flex items-stretch"
                                    style={{ gap, lineHeight: 0 }}
                                >
                                    {row.items.map((item) => {
                                        const index = item._idx;
                                        const isVisible = visible.has(index);
                                        const delayClass = delays[index % delays.length];

                                        const isClickable =
                                            typeof onOpenProducts === "function" &&
                                            Array.isArray(item?.productCodes) &&
                                            item.productCodes.some(Boolean);

                                        return (
                                            <article
                                                key={`${item.key || item.title || "g"}-${index}`}
                                                data-index={index}
                                                ref={(el) => (itemsRef.current[index] = el)}
                                                className={[
                                                    "group relative overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-sm",
                                                    "transition-all duration-700 ease-out",
                                                    delayClass,
                                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                                                    isClickable ? "cursor-pointer" : "",
                                                ].join(" ")}
                                                onClick={isClickable ? () => handleClick(item) : undefined}
                                                style={{
                                                    width: item._layout.width,
                                                    height: item._layout.height,
                                                    flex: "0 0 auto",
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title || "Galería"}
                                                    onLoad={(e) => handleImageLoad(index, e)}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-white/20" />
                                            </article>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BrandGallery;