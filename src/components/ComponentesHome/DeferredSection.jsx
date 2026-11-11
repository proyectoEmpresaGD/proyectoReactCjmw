import {
    useEffect,
    useRef,
    useState,
} from "react";


const DEFAULT_ROOT_MARGIN =
    "700px 0px";


export default function DeferredSection({
    children,
    minHeight = "700px",
    rootMargin = DEFAULT_ROOT_MARGIN,
}) {
    const containerRef =
        useRef(
            null
        );


    const [
        shouldRender,
        setShouldRender,
    ] = useState(
        false
    );


    useEffect(
        () => {
            if (
                shouldRender
            ) {
                return undefined;
            }


            const element =
                containerRef.current;


            if (
                !element
            ) {
                return undefined;
            }


            if (
                typeof IntersectionObserver ===
                "undefined"
            ) {
                setShouldRender(
                    true
                );

                return undefined;
            }


            const observer =
                new IntersectionObserver(
                    entries => {
                        if (
                            entries.some(
                                entry =>
                                    entry.isIntersecting
                            )
                        ) {
                            setShouldRender(
                                true
                            );

                            observer.disconnect();
                        }
                    },
                    {
                        rootMargin,
                    }
                );


            observer.observe(
                element
            );


            return () => {
                observer.disconnect();
            };
        },
        [
            rootMargin,
            shouldRender,
        ]
    );


    return (
        <div
            ref={
                containerRef
            }
            style={{
                minHeight:
                    shouldRender
                        ? undefined
                        : minHeight,
            }}
        >
            {
                shouldRender
                    ? children
                    : null
            }
        </div>
    );
}