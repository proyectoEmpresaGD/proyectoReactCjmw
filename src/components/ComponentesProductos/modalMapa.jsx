import { useEffect } from "react";
import { createPortal } from "react-dom";
import GeocodingService from "../../components/ComponentesContact/map";

const ModalMapa = ({ isOpen, close }) => {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, close]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="
                fixed
                inset-0
                z-[99999]
                flex
                items-center
                justify-center
                overflow-hidden
                bg-white
                p-3
                sm:p-5
                lg:p-8
            "
        >
            <div
                className="
                    flex
                    h-full
                    max-h-[900px]
                    w-full
                    max-w-[1600px]
                    min-h-0
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                    shadow-xl
                "
            >
                {/* CABECERA INDEPENDIENTE */}
                <div
                    className="
                        flex
                        h-16
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-neutral-200
                        bg-white
                        px-5
                    "
                >
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Puntos de venta
                    </h2>

                    <button
                        type="button"
                        onClick={close}
                        aria-label="Cerrar mapa"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-neutral-200
                            bg-white
                            text-2xl
                            leading-none
                            text-neutral-700
                            shadow-sm
                            transition
                            hover:bg-neutral-100
                            hover:text-black
                        "
                    >
                        ×
                    </button>
                </div>

                {/* MAPA Y PUNTOS DE VENTA */}
                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-hidden
                        bg-white
                        p-4
                    "
                >
                    <GeocodingService
                        embedded
                        showAllStoresOnLoad
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModalMapa;