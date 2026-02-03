import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';;
import { useEffect, useState } from 'react';

export function useFixedPopover(anchorRef, isOpen, preferredOffset = { x: 0, y: 10 }, minPad = 8, estWidth = 260) {
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!isOpen) return;

        const place = () => {
            const el = anchorRef.current;
            if (!el) return;

            const r = el.getBoundingClientRect();
            let left = r.left + preferredOffset.x;
            let top = r.bottom + preferredOffset.y;

            const maxLeft = window.innerWidth - estWidth - minPad;
            left = Math.max(minPad, Math.min(left, maxLeft));

            const estimatedH = 56;
            if (top + estimatedH > window.innerHeight - minPad) {
                top = r.top - preferredOffset.y - estimatedH;
            }

            setPos({ top, left });
        };

        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);

        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    }, [anchorRef, isOpen, preferredOffset.x, preferredOffset.y, minPad, estWidth]);

    return pos;
}

export function encryptProductId(productId) {
    const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
    const encrypted = CryptoJS.AES.encrypt(productId, secretKey).toString();
    const someSecureToken = uuidv4();
    return `https://www.cjmw.eu/#/products?pid=${encodeURIComponent(encrypted)}&sid=${someSecureToken}`;
}

export function isMobileUserAgent() {
    if (typeof navigator === 'undefined') return false;
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export function shareUrlFor({ name, url, text }) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (name) {
        case 'Facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case 'Twitter':
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        case 'WhatsApp':
            return isMobileUserAgent()
                ? `https://wa.me/?text=${encodedText}%20${encodedUrl}`
                : `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        case 'LinkedIn':
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        case 'Gmail':
            return `https://mail.google.com/mail/?view=cm&to=&su=${encodedText}&body=${encodedUrl}`;
        case 'Email':
            return `mailto:?subject=${encodedText}&body=${encodedUrl}`;
        default:
            return url;
    }
}

export async function generateProductPdf({ etiquetaEl, filename }) {
    if (!etiquetaEl) return;
    const { default: html2pdf } = await import('html2pdf.js');
    const opts = {
        margin: 0,
        filename,
        html2canvas: {
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 3000,
            backgroundColor: null,
            logging: false,
        },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
    };

    etiquetaEl.getBoundingClientRect();
    await html2pdf().set(opts).from(etiquetaEl).save();
}
