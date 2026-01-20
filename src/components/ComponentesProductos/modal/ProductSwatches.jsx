const isSingleWord = (txt) => !!txt && !/\s/.test(txt.trim());

const ProductSwatches = ({
    t,
    relatedProducts,
    productsForCarousel,
    onColorClick,
}) => {
    if (!relatedProducts || relatedProducts.length <= 1) return null;

    const uniqueByTonalidad = relatedProducts.filter((p, idx, arr) =>
        p.tonalidad &&
        idx === arr.findIndex(
            (q) => q.tonalidad?.trim().toLowerCase() === p.tonalidad?.trim().toLowerCase()
        )
    );

    return (
        <div className="rounded-3xl border border-white/60 bg-white/70 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap justify-center gap-3">
                {uniqueByTonalidad.map((colorProduct, i) => (
                    <button
                        type="button"
                        key={i}
                        className="relative w-24 sm:w-24 aspect-square overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        onClick={() => onColorClick(colorProduct)}
                        title={colorProduct.tonalidad}
                    >
                        <img
                            src={colorProduct.imageBaja}
                            alt={colorProduct.tonalidad}
                            className="h-full w-full object-cover"
                        />
                        <span
                            className={
                                `absolute inset-x-1 bottom-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white leading-tight text-center ` +
                                (isSingleWord(colorProduct.tonalidad) ? 'whitespace-nowrap' : 'whitespace-normal')
                            }
                            style={{ hyphens: 'none' }}
                        >
                            {colorProduct.tonalidad}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
                <span className="text-lg font-semibold">{productsForCarousel?.length ?? 0}</span>
                <span className="text-sm">
                    {(productsForCarousel?.length ?? 0) === 1
                        ? t('carousel.oneColor')
                        : t('carousel.manyColors', { count: productsForCarousel?.length ?? 0 })}
                </span>
            </div>
        </div>
    );
};

export default ProductSwatches;
