import { useEffect, useState } from 'react';

export default function useFixedPopover(
    anchorRef,
    isOpen,
    preferredOffset = { x: 0, y: 10 },
    minPad = 8,
    estWidth = 260
) {
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
