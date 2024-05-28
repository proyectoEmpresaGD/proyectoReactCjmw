import GeocodingService from "../../components/ComponentesContact/map"

const ModalMapa = ({ isOpen, close }) => {
    const handleClose = (e) => {
        e.stopPropagation(); // Prevent event bubbling when modal background is clicked
        close();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-auto max-h-[100%] items-center mt z-40 xl:py-[7%] lg:py-[7%] py-[25%]">
            
            <div className="bg-gradient-to-r from-[#ebdecf] to-[#8a7862] rounded-lg w-[90%]  my-auto gap-3">
            <div className="flex justify-end z-20">
                <button className="relative overflow-hidden m-4" onClick={close}>
                    <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200 justify-end' />
                </button>
                </div>
                <GeocodingService/>
            </div>
        </div>
    );
}
export default ModalMapa