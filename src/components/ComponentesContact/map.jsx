
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
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeActive, setRouteActive] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);

  const llamarNumero = (telefono) => {
    window.open(`tel:${telefono}`);
  };

  const puntos = [
    { lat: -34.397, lng: 150.644, title: "Sydney", description: "Tienda de cortinas y más en Sydney." },
    { lat: 40.712776, lng: -74.005974, title: "New York", description: "Lo último en decoración de interiores." },
    { lat: 37.586784, lng: -4.658694, title: "CJMW Montilla", description: "Especialistas en cortinas y decoración.", direccion: "Avenida Andalucia 19", telefono: "656565656" },
    { lat: 37.46784, lng: -4.658694, title: "Prueba", description: "Especialistas en cortinas y decoración." },
    { lat: 40.436792, lng: -3.709762, title: "Showroom Madrid", description: "Showroom exclusivo con las últimas tendencias." }
  ];

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    loader.load().then(() => {
      // Usar la ubicación guardada o el centro por defecto
      const savedCenter = JSON.parse(localStorage.getItem('mapCenter'));
      const defaultCenter = savedCenter ? new window.google.maps.LatLng(savedCenter.lat, savedCenter.lng) : new window.google.maps.LatLng(40.436437195598145, -3.693919201706416);

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

      // Usar geolocalización para centrar el mapa si se tienen permisos
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          initialMap.setCenter(pos);
          centerMarker.setPosition(pos);
          updateNearbyStores(new window.google.maps.LatLng(pos.lat, pos.lng), loadedMarkers, directionsService, directionsRenderer, true);
        }, () => {
          handleLocationError(true, initialMap.getCenter());
          updateNearbyStores(defaultCenter, loadedMarkers, directionsService, directionsRenderer, true);
        });
      } else {
        handleLocationError(false, initialMap.getCenter());
        updateNearbyStores(defaultCenter, loadedMarkers, directionsService, directionsRenderer, true);
      }

      let debounceTimer;
      const centerChangedListener = initialMap.addListener('center_changed', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const newCenter = initialMap.getCenter();
          localStorage.setItem('mapCenter', JSON.stringify({ lat: newCenter.lat(), lng: newCenter.lng() }));
          centerMarker.setPosition(newCenter);
          setSearchLocation(null);
          updateNearbyStores(newCenter, loadedMarkers, directionsService, directionsRenderer, false);
          console.log("Guardado en localStorage:", { lat: newCenter.lat(), lng: newCenter.lng() });
        }, );
      });

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

  const updateNearbyStores = (center, loadedMarkers, directionsService, directionsRenderer, shouldRenderRoute) => {
    console.log("Centro actual:", center);
    if (!loadedMarkers || loadedMarkers.length === 0) {
      console.log("No hay marcadores disponibles.");
      return;
    }

    if (!directionsService || !directionsRenderer) {
      console.error("Directions service or renderer not initialized");
      return;
    }

    let closestStore = null;
    let minDistance = Infinity;
    const nearbyStores = [];

    loadedMarkers.forEach(marker => {
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(center, marker.position);
      if (distance < 10000) {
        nearbyStores.push({
          title: marker.title,
          description: marker.description,
          direccion: marker.direccion,
          telefono: marker.telefono,
          position: marker.position
        });
      }
      if (distance < minDistance) {
        closestStore = { marker, distance };
        minDistance = distance;
      }
    });

    if (closestStore && shouldRenderRoute) {
      console.log("Tienda más cercana:", closestStore.marker.title, closestStore.distance);

      directionsService.route({
        origin: center,
        destination: closestStore.marker.position,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          setRouteActive(true);
          // Agregar la tienda más cercana a las tiendas cercanas
          setNearbyStores([{
            title: closestStore.marker.title,
            description: closestStore.marker.description,
            direccion: closestStore.marker.direccion,
            telefono: closestStore.marker.telefono,
            position: closestStore.marker.position
          }]);
        } else {
          console.error('Error al obtener las direcciones:', status);
        }
      });
    } else {
      directionsRenderer.set('directions', null);
      setRouteActive(false);
      setNearbyStores(nearbyStores);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (geocoder && map) {
      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          map.setCenter(location);
          centerMarker.setPosition(location);
          setSearchLocation(location);
          updateNearbyStores(location, markers, directionsService, directionsRenderer, true);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  };

  const handleDirectionClick = (store) => {
    if (searchLocation) {
      directionsService.route({
        origin: searchLocation,
        destination: store.position,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          setRouteActive(true);
        } else {
          console.error('Error al obtener las direcciones:', status);
        }
      });
    } else if (centerMarker) {
      directionsService.route({
        origin: centerMarker.getPosition(),
        destination: store.position,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          setRouteActive(true);
        } else {
          console.error('Error al obtener las direcciones:', status);
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
              placeholder="nombre de tu ciudad"
              className="relative mx-auto ml-2 mb-6 w-[55%] md:w-[30%] text-center py-3 px-3 xl:w-[22%] xl:hover:w-[24%] lg:w-[25%] lg:hover:w-[30%] border-b-2 text-[110%] bg-white hover:bg-gray-200 text-black duration-200 hover:rounded-xl rounded"
            />
            <button type="submit" className="relative mx-auto xl:ml-2 lg:ml-2 md:ml-2 ml-4 px-3 py-3 xl:px-6 lg:px-6 w-35% xl:w-[13%] text-center bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">
              Buscar
            </button>
          </form>
          <div id="map" className="w-full" style={{ height: "65vh", borderRadius: "2%" }}></div>
        </div>
        <div className="justify-center items-center mx-auto xl:col-span-1 lg:col-span-1 col-span-4">
          <div className="mx-auto text-center justify-center overflow-auto max-h-96">
            <h1 className="py-[5%] text-3xl text-white font-bold">Tus Tiendas más cercanas</h1>
            <ul>
              {nearbyStores.map(store => (
                <li className="bg-white py-2 px-2 border-2 border-gray-500 hover:scale-110 duration-200 mx-8 my-1" key={store.title}>
                  <h1>{store.title}</h1>
                  <p>{store.description}</p>
                  <p>
                    <div className="flex mx-auto justify-center">
                      <button onClick={() => handleDirectionClick(store)}>
                        <svg className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>{store.direccion}
                    </div>
                  </p>
                  <p>
                    <div className="flex mx-auto justify-center">
                      <button onClick={() => llamarNumero(store.telefono)}>
                        <svg className="text-gray-600 w-7 h-7 hover:scale-150 transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.210l-2.257 1.130a11.042 11.042 0 005.516 5.516l1.130-2.257a1 1 0 011.210-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>{store.telefono}
                    </div>
                  </p>
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

