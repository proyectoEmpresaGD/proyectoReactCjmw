import { GoogleMap, LoadScript } from "@react-google-maps/api";



const Map = () => {
    const mapStyles = {
        height: "55vh",
        width: "55%",
        margin: "auto",
        border: "3px solid #8a7862",
        overflow: "hidden",
        borderRadius: "6px"
    };

    
    const containerStyles = {
        height: "60vh",
        width: "100%", 
        background: "linear-gradient(to right, #ebdecf, #8a7862)",

    };

    const defaultCenter = {
        lat: 40.712776,
        lng: -74.005974,
    };

    return (
        <div style={containerStyles}>
            <LoadScript googleMapsApiKey="AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={defaultCenter}
                />
            </LoadScript>
        </div>
    );
};

export default Map;