import GeocodingService from "../../components/ComponentesContact/map";

const ModalMapa = ({ isOpen, close }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex max-h-[100%] items-center justify-center overflow-auto bg-black bg-opacity-50 py-[25%] lg:py-[7%] xl:py-[7%]">
            <div className="my-auto w-[90%] gap-3 rounded-lg bg-gradient-to-r from-[#ebdecf] to-[#8a7862]">
                <div className="z-20 flex justify-end">
                    <button
                        type="button"
                        className="relative m-4 overflow-hidden"
                        onClick={close}
                    >
                        <img
                            src="close.svg"
                            alt=""
                            className="h-6 w-6 justify-end transition-transform duration-200 hover:scale-125"
                        />
                    </button>
                </div>

                <GeocodingService embedded />
            </div>
        </div>
    );
};

export default ModalMapa;