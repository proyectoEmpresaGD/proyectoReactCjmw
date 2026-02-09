import { useEffect, useMemo, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import {
    Facebook,
    Linkedin,
    Twitter,
    Mail,
    MessageCircle,
} from "lucide-react";
import useFixedPopover from './hooks/useFixedPopover';

const isMobileDevice = () =>
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

const ShareActions = ({ t, shareTitle, shareText, shareUrl, onCloseModal }) => {
    const [showShare, setShowShare] = useState(false);
    const shareBtnRef = useRef(null);
    const sharePos = useFixedPopover(shareBtnRef, showShare, { x: 0, y: 10 }, 8, 260);

    const encodedUrl = useMemo(() => encodeURIComponent(shareUrl), [shareUrl]);
    const encodedText = useMemo(() => encodeURIComponent(shareText), [shareText]);

    const shareUrlFor = (name) => {
        switch (name) {
            case 'Facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'Twitter':
                return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            case 'WhatsApp':
                return isMobileDevice()
                    ? `https://wa.me/?text=${encodedText}%20${encodedUrl}`
                    : `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
            case 'LinkedIn':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            case 'Gmail':
                return `https://mail.google.com/mail/?view=cm&to=&su=${encodedText}&body=${encodedUrl}`;
            case 'Email':
                return `mailto:?subject=${encodedText}&body=${encodedUrl}`;
            default:
                return shareUrl;
        }
    };

    const onShareButtonClick = async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                return;
            }
        } catch {
            // si el usuario cancela o falla, abrimos el popover
        }
        setShowShare((s) => !s);
    };

    useEffect(() => {
        if (!showShare) return;

        const onDocClick = (e) => {
            if (shareBtnRef.current && !shareBtnRef.current.contains(e.target)) setShowShare(false);
        };

        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [showShare]);

    const items = [
        { name: 'Facebook', color: '#1877F2', icon: Facebook },
        { name: 'Twitter', color: '#000000', icon: Twitter },
        { name: 'WhatsApp', color: '#25D366', icon: MessageCircle },
        { name: 'LinkedIn', color: '#0A66C2', icon: Linkedin },
        { name: 'Gmail', color: '#EA4335', icon: Mail },
        { name: 'Email', color: '#334155', icon: Mail },
    ];

    return (
        <div className="flex items-center gap-2 sm:gap-3 justify-end lg:justify-end">
            <button
                ref={shareBtnRef}
                onClick={onShareButtonClick}
                className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-gray-700 shadow-sm transition hover:shadow-md hover:scale-105"
                title={t('share', 'Share')}
                type="button"
            >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('share', 'Share')}</span>
            </button>

            {showShare && (
                <div
                    style={{ position: 'fixed', top: sharePos.top, left: sharePos.left }}
                    className="z-50 flex max-w-[90vw] flex-wrap items-center gap-2 rounded-xl bg-white p-2 sm:p-3 shadow-lg border border-gray-100"
                >
                    {items.map((s) => (
                        <a
                            key={s.name}
                            href={shareUrlFor(s.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-2 sm:p-2.5 transition hover:scale-110"
                            style={{ backgroundColor: s.color }}
                            title={s.name}
                            aria-label={`Compartir por ${s.name}`}
                        >
                            <s.icon className="text-white h-5 w-5 sm:h-5 sm:w-5" />
                        </a>
                    ))}
                </div>
            )}

            <button
                onClick={onCloseModal}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-800 shadow-sm transition hover:scale-105 hover:shadow-md"
                title={t('closeModal')}
                type="button"
            >
                <img
                    src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/undo_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                    alt={t('closeAlt')}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                />
            </button>
        </div>
    );
};

export default ShareActions;
