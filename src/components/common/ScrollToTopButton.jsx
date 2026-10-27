import {
    useEffect,
    useState
} from "react";

import {
    ArrowUp
} from "lucide-react";


const ScrollToTopButton = ({
    showAfter = 400,
    bottomClass = "bottom-6",
    rightClass = "right-6",
}) => {
    const [
        visible,
        setVisible
    ] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setVisible(
                window.scrollY >
                showAfter
            );
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [
        showAfter
    ]);


    const handleScrollToTop =
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };


    if (!visible) {
        return null;
    }


    return (
        <button
            type="button"
            onClick={
                handleScrollToTop
            }
            aria-label="Volver arriba"
            title="Volver arriba"
            className={`
                fixed
                ${bottomClass}
                ${rightClass}
                z-50

                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-full
                border
                border-stone-200
                bg-white

                text-stone-700

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-stone-300
                hover:text-stone-950
                hover:shadow-md

                active:translate-y-0
            `}
        >
            <ArrowUp
                className="h-5 w-5"
                aria-hidden="true"
            />
        </button>
    );
};


export default ScrollToTopButton;