import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* Igualamos el “page-fit” y añadimos márgenes cómodos en la UI */
const buildViewerUrl = (pdfUrl) => {
    const viewer = new URL('https://mozilla.github.io/pdf.js/web/viewer.html');
    viewer.searchParams.set('file', pdfUrl);
    viewer.hash = 'page=1&zoom=page-fit&spread=even&view=page-fit';
    return viewer.toString();
};

const BrochureBookViewer = ({ brochure, onClose }) => {
    const { t } = useTranslation('media');
    const iframeSrc = useMemo(() => buildViewerUrl(brochure.pdfUrl), [brochure.pdfUrl]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
            <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 flex-col">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                            {t('viewer.brochureLabel')}
                        </p>
                        <h2 className="truncate text-lg font-semibold text-gray-900">{brochure.title}</h2>
                        {brochure.subtitle && <p className="text-sm text-gray-500">{brochure.subtitle}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <a
                            href={brochure.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                            aria-label={t('viewer.download')}
                        >
                            <Download size={16} />
                            {t('viewer.download')}
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
                            aria-label={t('viewer.close')}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </header>

                <div className="relative flex flex-1 bg-gray-100 p-2 sm:p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-white shadow-sm">
                        <iframe
                            title={`Visor de ${brochure.title}`}
                            src={iframeSrc}
                            loading="lazy"
                            className="h-full w-full border-0"
                            allow="fullscreen"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

BrochureBookViewer.propTypes = {
    brochure: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        pdfUrl: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default BrochureBookViewer;
