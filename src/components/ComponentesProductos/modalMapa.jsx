import GeocodingService from "../../components/ComponentesContact/map"

const ModalMapa = ({ isOpen, close }) => {
    const handleClose = (e) => {
        e.stopPropagation(); // Prevent event bubbling when modal background is clicked
        close();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-auto max-h-[100%] items-center z-40 py-[7%]">
            <div className="bg-white rounded-lg w-[90%]  my-auto gap-3">
                <GeocodingService/>
            </div>
        </div>
    );
}
export default ModalMapa