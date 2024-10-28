import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { puntos, GOOGLE_MAPS_API_KEY } from "../../Constants/constants"; // Importa las constantes desde otro archivo

const GeocodingService = () => {
  const [cityName, setCityName] = useState("");
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [centerMarker, setCenterMarker] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  const llamarNumero = (telefono) => {
    window.open(`tel:${telefono}`);
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    loader.load().then(() => {
      const defaultCenter = new window.google.maps.LatLng(40.436437195598145, -3.693919201706416);
      const initialMap = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: defaultCenter,
      });
      setMap(initialMap);
      setGeocoder(new window.google.maps.Geocoder());

      const centerMarker = new window.google.maps.Marker({
        position: defaultCenter,
        map: initialMap,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });
      setCenterMarker(centerMarker);

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: initialMap,
        suppressMarkers: true,
        preserveViewport: true
      });
      setDirectionsService(directionsService);
      setDirectionsRenderer(directionsRenderer);

      const loadedMarkers = puntos.map(punto => {
        const position = new window.google.maps.LatLng(punto.lat, punto.lng);
        const marker = new window.google.maps.Marker({
          position,
          map: initialMap,
          title: punto.title
        });

        marker.addListener('click', () => {
          if (currentMarker && currentMarker.infoWindow) {
            currentMarker.infoWindow.close();
          }
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><h2>${punto.title}</h2><p>${punto.description}</p><p>${punto.direccion}</p><p>${punto.telefono}</p></div>`
          });
          infoWindow.open(initialMap, marker);
          setCurrentMarker({ marker, infoWindow });
        });

        return {
          ...punto,
          marker,
          position
        };
      });

      setMarkers(loadedMarkers);
    });
  }, []);

  // Manejador de envío de formulario
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (geocoder && map) {
      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          map.setCenter(location);
          centerMarker.setPosition(location);
          setSearchLocation(location);
        } else {
          alert('Error en la geocodificación: ' + status);
        }
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#ebdecf] to-[#8a7862] pb-[10%] xl:pb-[5%] lg:px-[5%] mx-auto">
      <div className="max-w-2xl mx-auto text-center py-[5%] xl:pb-[5%]">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Encuéntranos cerca de ti</h2>
      </div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="col-span-4 xl:col-span-3 lg:col-span-3">
          <form onSubmit={handleFormSubmit} className="relative mx-auto text-center justify-center">
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="¿Donde te encuentras?"
              className="input-clase"
            />
            <button type="submit" className="btn-clase">
              Buscar
            </button>
          </form>
          <div id="map" className="w-full" style={{ height: "65vh", borderRadius: "2%" }}></div>
        </div>
        <div className="justify-center items-center mx-auto xl:col-span-1 lg:col-span-1 col-span-4">
          <div className="mx-auto text-center justify-center overflow-auto max-h-[80%]">
            <h1 className="py-[5%] text-3xl text-white font-bold">Tus Tiendas más cercanas</h1>
            <ul>
              {nearbyStores.map(store => (
                <li className="store-list" key={store.title}>
                  <h1>{store.title}</h1>
                  <p>{store.description}</p>
                  <p>{store.direccion}</p>
                  <p>{store.telefono}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeocodingService;
