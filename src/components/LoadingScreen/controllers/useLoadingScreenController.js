import { useEffect, useState } from "react";


const LOADING_DURATION_MS = 3000;
const FADE_OUT_DURATION_MS = 450;


export default function useLoadingScreenController() {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);


    useEffect(() => {
        const fadeTimer = window.setTimeout(
            () => {
                setIsLeaving(true);
            },
            LOADING_DURATION_MS - FADE_OUT_DURATION_MS
        );


        const closeTimer = window.setTimeout(
            () => {
                setIsVisible(false);
            },
            LOADING_DURATION_MS
        );


        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(closeTimer);
        };
    }, []);


    return {
        isVisible,
        isLeaving,
    };
}