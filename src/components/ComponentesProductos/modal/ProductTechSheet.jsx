const ProductTechSheet = ({
    t,
    detailItems,
    selectedProduct,
    getUsoImages,
    getMantenimientoImages,
    getDireccionImage,
    onDownloadPdf,
}) => {
    return (
        <div className="space-y-6 sm:space-y-8 rounded-3xl border border-white/60 bg-white/70 p-4 sm:p-6 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{t('techSheet')}</h2>

                <button
                    onClick={onDownloadPdf}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:shadow-md hover:scale-[1.02] hover:ring-2 hover:ring-gray-200 active:scale-100"
                    title={t('downloadPdf')}
                    type="button"
                >
                    <img
                        src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/archivo.png"
                        alt={t('downloadPdfAlt')}
                        className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                    <span>{t('downloadPdf')}</span>
                </button>
            </div>

            {/* Detalles */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {detailItems.map((item) => (
                    <div
                        key={item.key}
                        className="rounded-2xl border border-white/60 bg-white/80 p-5 sm:p-6 shadow-sm min-w-0 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <p
                            title={item.label}
                            className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500 cursor-help"
                        >
                            {item.label}
                        </p>
                        <div className="mt-2 min-w-0 break-words whitespace-normal leading-snug text-gray-900 pb-1">
                            {item.value || t('notAvailable')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Usos / Cuidado */}
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">{t('usages')}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {getUsoImages(selectedProduct?.uso).length > 0 ? (
                            getUsoImages(selectedProduct?.uso)
                        ) : (
                            <span className="text-sm text-gray-400">{t('notAvailable')}</span>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-500">{t('cares')}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {getMantenimientoImages(selectedProduct?.mantenimiento).length > 0 ? (
                            getMantenimientoImages(selectedProduct?.mantenimiento)
                        ) : (
                            <span className="text-sm text-gray-400">{t('notAvailable')}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Dirección */}
            {getDireccionImage(selectedProduct?.direcciontela) && (
                <div className="pt-2">{getDireccionImage(selectedProduct?.direcciontela)}</div>
            )}
        </div>
    );
};

export default ProductTechSheet;
