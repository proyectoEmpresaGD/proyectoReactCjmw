import PropTypes from 'prop-types';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VideoCard = ({ video, onSelect }) => {
    const { t } = useTranslation('media');

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl sm:rounded-3xl">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <button
                    type="button"
                    onClick={() => onSelect(video)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label={`${t('videosSection.view')} ${video.title}`}
                >
                    <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white">
                        <Play size={18} />
                        {t('videosSection.view')}
                    </span>
                </button>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{video.description}</p>
                <div className="mt-auto pt-4">
                    <button
                        type="button"
                        onClick={() => onSelect(video)}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        aria-label={`${t('videosSection.cta')} ${video.title}`}
                    >
                        <Play size={18} />
                        {t('videosSection.cta')}
                    </button>
                </div>
            </div>
        </article>
    );
};

VideoCard.propTypes = {
    video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        thumbnail: PropTypes.string.isRequired,
        videoUrl: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default VideoCard;