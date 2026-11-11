import {
    useEffect,
    useState,
} from "react";


const MOBILE_HOME_QUERY =
    "(max-width: 768px)";


export default function useHomeViewport() {
    const [
        isMobileHome,
        setIsMobileHome,
    ] = useState(
        () => {
            if (
                typeof window ===
                    "undefined" ||
                typeof window.matchMedia !==
                    "function"
            ) {
                return false;
            }


            return window
                .matchMedia(
                    MOBILE_HOME_QUERY
                )
                .matches;
        }
    );


    useEffect(
        () => {
            if (
                typeof window ===
                    "undefined" ||
                typeof window.matchMedia !==
                    "function"
            ) {
                return undefined;
            }


            const mediaQuery =
                window.matchMedia(
                    MOBILE_HOME_QUERY
                );


            const handleChange =
                event => {
                    setIsMobileHome(
                        event.matches
                    );
                };


            setIsMobileHome(
                mediaQuery.matches
            );


            mediaQuery.addEventListener?.(
                "change",
                handleChange
            );


            return () => {
                mediaQuery.removeEventListener?.(
                    "change",
                    handleChange
                );
            };
        },
        []
    );


    return {
        isMobileHome,
    };
}
