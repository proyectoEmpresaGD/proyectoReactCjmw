import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const VideoModal = ({ video, onClose }) => {
    const { t } = useTranslation('media');
    const embedUrl = useMemo(() => {
        const separator = video.videoUrl.includes('?') ? '&' : '?';
        return `${video.videoUrl}${separator}rel=0&modestbranding=1`;
    }, [video.videoUrl]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl max-h-[85vh] sm:h-[70vh] sm:w-[90vw] sm:max-h-[85vh]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 transition hover:bg-white"
                    aria-label={t('viewer.videoClose')}
                >
                    <X size={20} />
                </button>
                <div className="aspect-video w-full sm:h-full sm:aspect-auto">
                    <iframe
                        src={embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
};

VideoModal.propTypes = {
    video: PropTypes.shape({
        title: PropTypes.string.isRequired,
        videoUrl: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default VideoModal;