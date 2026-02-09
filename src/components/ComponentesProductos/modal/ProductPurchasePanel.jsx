const ProductPurchasePanel = ({
    t,
    quantity,
    setQuantity,
    onAddToCart,
    usoMantenimientoIcons,
}) => {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg">
            <div className="space-y-4 sm:space-y-5">
                <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 sm:px-5 py-4 shadow-sm sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">
                            {t('chooseQuantity')}
                        </p>
                        <p className="text-sm text-gray-600">{t('smallSample')}</p>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center gap-3 sm:gap-4">
                        <select
                            id="quantity"
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">3€</p>
                    </div>
                </div>

                <button
                    onClick={onAddToCart}
                    className="inline-flex items-center gap-3 self-start rounded-full border border-neutral-200 bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-200"
                    title={t('orderSample')}
                    type="button"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50 border border-neutral-200">
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/04_QUALITY/fabric.png"
                            alt={t('sampleAlt')}
                            className="h-7 w-7 object-contain"
                        />
                    </span>
                    <span>{t('addToCart')}</span>
                </button>

                {usoMantenimientoIcons?.length > 0 && (
                    <div className="flex flex-wrap gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-gray-700 shadow-inner">
                        {usoMantenimientoIcons}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPurchasePanel;
