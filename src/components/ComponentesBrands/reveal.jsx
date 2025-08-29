// src/components/Reveal.jsx
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

/** Componente de animación: slide-up + fade al entrar en viewport */
const Reveal = forwardRef(function Reveal(
    {
        children,
        className = "",
        delayMs = 0,
        durationMs = 700,
        distancePx = 24,
        once = true,
        as: As = "div",
    },
    externalRef
) {
    const localRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // Soporte para ref externo + interno
    const setRefs = useCallback(
        (node) => {
            localRef.current = node;
            if (typeof externalRef === "function") externalRef(node);
            else if (externalRef && typeof externalRef === "object") {
                externalRef.current = node;
            }
        },
        [externalRef]
    );

    useEffect(() => {
        const el = localRef.current;
        if (!el) return;

        // Respeta usuarios con “reducir movimiento”
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) {
            setVisible(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) io.unobserve(entry.target);
                    } else if (!once) {
                        setVisible(false);
                    }
                }
            },
            {
                root: null,
                rootMargin: "0px 0px -15% 0px",
                threshold: 0.1,
            }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [once]);

    const style = {
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "ease-out",
        transitionDelay: `${delayMs}ms`,
        transform: visible ? "translateY(0px)" : `translateY(${distancePx}px)`,
        opacity: visible ? 1 : 0,
        willChange: "transform, opacity",
    };

    return (
        <As ref={setRefs} style={style} className={className}>
            {children}
        </As>
    );
});

export default Reveal;
