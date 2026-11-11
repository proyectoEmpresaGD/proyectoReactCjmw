import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Instagram,
    ExternalLink,
} from "lucide-react";


export default function InstagramDropdown({
    items = [],
    buttonClassName = "",
}) {
    const [
        isOpen,
        setIsOpen,
    ] = useState(
        false
    );


    const dropdownRef =
        useRef(
            null
        );


    useEffect(
        () => {
            const handlePointerDown =
                event => {
                    if (
                        !dropdownRef.current?.contains(
                            event.target
                        )
                    ) {
                        setIsOpen(
                            false
                        );
                    }
                };


            const handleKeyDown =
                event => {
                    if (
                        event.key ===
                        "Escape"
                    ) {
                        setIsOpen(
                            false
                        );
                    }
                };


            document.addEventListener(
                "pointerdown",
                handlePointerDown
            );

            document.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {
                document.removeEventListener(
                    "pointerdown",
                    handlePointerDown
                );

                document.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };
        },
        []
    );


    if (
        !items?.length
    ) {
        return null;
    }


    return (
        <div
            ref={
                dropdownRef
            }
            className="
                relative
                inline-flex
            "
        >
            <button
                type="button"
                aria-label="Instagram"
                aria-expanded={
                    isOpen
                }
                onClick={() =>
                    setIsOpen(
                        current =>
                            !current
                    )
                }
                className={
                    buttonClassName
                }
            >
                <Instagram
                    className="
                        h-[17px]
                        w-[17px]
                        text-white
                    "
                />
            </button>


            {isOpen && (
                <div
                    className="
                        absolute
                        bottom-full
                        left-0
                        z-[100]
                        mb-3

                        w-[min(280px,calc(100vw-2rem))]
                        max-w-[calc(100vw-2rem)]

                        overflow-hidden
                        rounded-2xl
                        border
                        border-stone-200
                        bg-white
                        p-2
                        text-stone-950

                        shadow-[0_20px_60px_-25px_rgba(0,0,0,0.4)]

                        sm:w-[280px]
                    "
                >
                    <div
                        className="
                            px-3
                            pb-2
                            pt-1
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.22em]
                                text-stone-400
                            "
                        >
                            Instagram
                        </p>
                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >
                        {items.map(
                            item => (
                                <a
                                    key={
                                        item.href ||
                                        item.label
                                    }
                                    href={
                                        item.href
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() =>
                                        setIsOpen(
                                            false
                                        )
                                    }
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-xl
                                        px-3
                                        py-3
                                        transition-colors

                                        hover:bg-stone-100
                                    "
                                >
                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >
                                        <p
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                                text-stone-900
                                            "
                                        >
                                            {
                                                item.label
                                            }
                                        </p>


                                        {item.username && (
                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-[10px]
                                                    text-stone-400
                                                "
                                            >
                                                {
                                                    item.username
                                                }
                                            </p>
                                        )}
                                    </div>


                                    <ExternalLink
                                        className="
                                            h-3.5
                                            w-3.5
                                            shrink-0
                                            text-stone-400
                                            transition-colors

                                            group-hover:text-stone-950
                                        "
                                    />
                                </a>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}