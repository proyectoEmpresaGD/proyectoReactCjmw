
//AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg

import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GeocodingService = () => {
  const [cityName, setCityName] = useState("");
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [centerMarker, setCenterMarker] = useState(null);

  

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", // Reemplaza con tu clave API real
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    loader.load().then(() => {
      const savedCenter = JSON.parse(localStorage.getItem('mapCenter'));
      const initialCenter = savedCenter ? new window.google.maps.LatLng(savedCenter.lat, savedCenter.lng) : new window.google.maps.LatLng(40.436437195598145, -3.693919201706416);

      const initialMap = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          center: initialCenter,
      });
      setMap(initialMap);
      setGeocoder(new window.google.maps.Geocoder());

      const centerMarker = new window.google.maps.Marker({
          position: initialCenter,
          map: initialMap,
          icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(32, 32)
          }
      });
      setCenterMarker(centerMarker);

      // Restaurar y configurar los marcadores desde el localStorage
      const savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
      const loadedMarkers = savedMarkers.map(punto => {
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
            content: `<div><h2>${punto.title}</h2><p>${punto.description}</p></div>`
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
      updateNearbyStores(initialCenter, loadedMarkers);

      let debounceTimer;
      const centerChangedListener = initialMap.addListener('center_changed', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const newCenter = initialMap.getCenter();
          localStorage.setItem('mapCenter', JSON.stringify({ lat: newCenter.lat(), lng: newCenter.lng() }));
          centerMarker.setPosition(newCenter);
          updateNearbyStores(newCenter, loadedMarkers);
          console.log("Guardado en localStorage:", { lat: newCenter.lat(), lng: newCenter.lng() });
        },);  
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          initialMap.setCenter(pos);
          centerMarker.setPosition(pos);
          updateNearbyStores(new window.google.maps.LatLng(pos.lat, pos.lng), loadedMarkers);
        }, () => {
          handleLocationError(true, initialMap.getCenter());
        });
      } else {
        handleLocationError(false, initialMap.getCenter());
      }
  
      return () => {
        clearTimeout(debounceTimer);
        google.maps.event.removeListener(centerChangedListener);
      };
    });
  }, []);

  const handleLocationError = (browserHasGeolocation, pos) => {
    console.error(browserHasGeolocation ?
      "Error: The Geolocation service failed." :
      "Error: Your browser doesn't support geolocation.");
  };

  const updateNearbyStores = (center, loadedMarkers) => {
    console.log("Centro actual:", center);
    if (!loadedMarkers || loadedMarkers.length === 0) {
      console.log("No hay marcadores disponibles.");
      return;
    }

    const newNearbyStores = loadedMarkers.filter(marker => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(center, marker.position);
      console.log(`Distancia a ${marker.title}: ${distance}`);
      return distance < 10000; // Distancia en metros (10 kilómetros)
    }).map(marker => ({
      title: marker.title,
      description: marker.description
    }));

    console.log("Tiendas cercanas actualizadas:", newNearbyStores);
    setNearbyStores(newNearbyStores);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (geocoder && map) {
      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          map.setCenter(location);
          centerMarker.setPosition(location);
          updateNearbyStores(location, markers);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#ebdecf] to-[#8a7862] pb-[10%] xl:pb-[5%] lg:px-[5%] mx-auto">
      <div className="max-w-2xl mx-auto text-center py-[5%] xl:pb-[5%]">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Encuéntranos cerca de ti</h2>
      </div>
      <div className="grid xl:grid-cols-4">
        <div className="col-span-3">
          <form onSubmit={handleFormSubmit} className="relative mx-auto text-center justify-center">
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="nombre de tu ciudad"
              className="relative mx-auto ml-2 mb-6 w-[55%] md:w-[30%] text-center py-3 px-3 xl:w-[22%] xl:hover:w-[24%] lg:w-[25%] lg:hover:w-[30%] border-b-2 text-[110%] bg-white hover:bg-gray-200 text-black duration-200 hover:rounded-xl rounded"
            />
            <button type="submit" className="relative mx-auto xl:ml-2 lg:ml-2 md:ml-2 ml-4 px-3 py-3 xl:px-6 lg:px-6 w-35%  xl:w-[13%] text-center bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">
              Buscar
            </button>
          </form>
          <div id="map" style={{ height: "65vh", width: "100%", borderRadius: "2%" }}></div>
        </div>
        <div className="col-span-1 text-center mx-auto overflow-auto max-h-96">
          <h1>Tus Tiendas más cercanas</h1>
          <ul>
            {nearbyStores.map(store => (
              <li key={store.title}>{store.title} - {store.description}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeocodingService;

