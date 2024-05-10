
//AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg

import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GeocodingService = () => {
  const [cityName, setCityName] = useState("");
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", // Replace with your API key
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    loader.load().then(() => {
      const initialMap = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 40.436437195598145, lng: -3.693919201706416 },
      });
      setMap(initialMap);
      setGeocoder(new window.google.maps.Geocoder());
      const renderer = new window.google.maps.DirectionsRenderer({
        map: initialMap
      });
      setDirectionsRenderer(renderer);
      initializeMarkers(initialMap);
    });
  }, []);

  const initializeMarkers = (map) => {
    const puntos = [
      { lat: -34.397, lng: 150.644, title: "Sydney", description: "Tienda de cortinas y más en Sydney.", imageUrl: "https://ruta/a/imagen-sydney.jpg" },
      { lat: 40.712776, lng: -74.005974, title: "New York", description: "Lo último en decoración de interiores.", imageUrl: "https://ruta/a/imagen-newyork.jpg" },
      { lat: 37.586784324249166, lng: -4.658694292094171, title: "CJMW Montilla", description: "Especialistas en cortinas y decoración.", imageUrl: "https://ruta/a/imagen-montilla.jpg" },
      { lat: 40.43679156325075, lng: -3.70976152688625, title: "showroom Madrid", description: "Showroom exclusivo con las últimas tendencias.", imageUrl: "https://ruta/a/imagen-madrid.jpg" }
    ];

    const localMarkers = puntos.map(punto => {
      const position = new window.google.maps.LatLng(punto.lat, punto.lng);
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: punto.title
      });

      // Contenido del InfoWindow incluyendo una imagen
      const infoWindowContent = `
        <div>
          <h2>${punto.title}</h2>
          <p>${punto.description}</p>
          <img src="${punto.imageUrl}" alt="${punto.title}" style="width:100%;max-width:300px;">
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', () => {
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false
        });
      });

      return marker;
    });

    setMarkers(localMarkers);
};

  const findCity = (cityName) => {
    if (!geocoder || !map) return;

    // Clear existing marker and directions before searching for new location
    if (currentMarker) {
      currentMarker.setMap(null);
      setCurrentMarker(null);
    }
    directionsRenderer.setMap(null);
    directionsRenderer.setMap(map);

    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        map.setCenter(location);

        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: cityName
        });
        setCurrentMarker(marker);

        findNearestMarkerAndRoute(location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const findNearestMarkerAndRoute = (origin) => {
    const directionsService = new window.google.maps.DirectionsService();
    let minDistance = Infinity;
    let nearestMarker = null;

    markers.forEach(marker => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(origin, marker.getPosition());

      if (distance < minDistance) {
        minDistance = distance;
        nearestMarker = marker;
      }
    });

   

    if (nearestMarker) {
      const request = {
        origin: origin,
        destination: nearestMarker.getPosition(),
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          alert("Directions request failed due to " + status);
        }
      });
    }
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    findCity(cityName);
  };

  return (
    <>
    <div className="bg-gradient-to-r from-[#ebdecf] to-[#8a7862] xl:py-[5%] py-8 lg:px-[16%] mx-auto">
    <div className="max-w-2xl mx-auto text-center py-[5%] xl:pb-[5%]">
      <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Encuéntranos cerca de tí</h2>
    </div>
      <form onSubmit={handleFormSubmit} className="relative mx-auto text-center justify-center">
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="nombre de tu ciudad"
          className="relative mx-auto ml-2 mb-6 w-[55%] md:w-[30%] text-center py-3 px-3 xl:w-[22%] xl:hover:w-[24%] lg:w-[25%] lg:hover:w-[30%] border-b-2 text-[110%] bg-white hover:bg-gray-200 text-black duration-200 hover:rounded-xl rounded "
        />
        <button type="submit" className="relative mx-auto xl:ml-2 lg:ml-2 md:ml-2 ml-4 px-3 py-3 xl:px-6 lg:px-6 w-35%  xl:w-[13%] text-center bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">
          Buscar
        </button>
      </form>
      <div id="map" style={{ height: "65vh", width: "100%" }}></div>
    </div>
    </>
  );
};

export default GeocodingService;



//import  { useEffect } from "react";


// const GeocodingService = () => {
//   useEffect(() => {
//     let map;
//     let marker;
//     let geocoder;
//     let directionsService;
//     let directionsRenderer;
//     let response; // Declarar variable response

//     function initMap() {
//       map = new window.google.maps.Map(document.getElementById("map"), {
//         zoom: 3,
//         center: { lat: 40.436437195598145, lng: -3.693919201706416 },
//         mapTypeControl: false,
//       });
//       geocoder = new window.google.maps.Geocoder();
//       directionsService = new window.google.maps.DirectionsService();
//       directionsRenderer = new window.google.maps.DirectionsRenderer();

//       const inputText = document.createElement("input");
//       inputText.className = "bg-white border rounded shadow p-2 m-4";
//       inputText.type = "text";
//       inputText.placeholder = "Enter a location";

//       const submitButton = document.createElement("input");
//       submitButton.className = "bg-blue-500 text-white rounded shadow p-2 m-4 hover:bg-blue-700";
//       submitButton.type = "button";
//       submitButton.value = "Geocode";

//       const clearButton = document.createElement("input");
//       clearButton.className = "bg-white text-blue-500 border border-blue-500 rounded shadow p-2 m-4 hover:bg-blue-100 duration:200";
//       clearButton.type = "button";
//       clearButton.value = "Clear";

//       // Crear el elemento "response"
//       response = document.createElement("pre");
//       response.id = "response";
//       response.innerText = "";

//       const responseDiv = document.createElement("div");
//       responseDiv.id = "response-container";
//       responseDiv.appendChild(response);

//       const instructionsElement = document.createElement("p");
//       instructionsElement.className = "bg-white border rounded shadow p-4 m-4";
//       instructionsElement.id = "instructions";

//       map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputText);
//       map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(submitButton);
//       map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(clearButton);
//       marker = new window.google.maps.Marker({ map });
//       map.addListener("click", (e) => {
//         geocode({ location: e.latLng });
//       });

//       submitButton.addEventListener("click", () => geocode({ address: inputText.value }));
//       clearButton.addEventListener("click", clear);

//       // Añadir marcadores
//       const puntos = [
//         { lat: -34.397, lng: 150.644, title: "Sydney" },
//         { lat: 40.712776, lng: -74.005974, title: "New York" },
//         { lat: 37.586784324249166, lng: -4.658694292094171, title:"CJMW Montilla"},
//         { lat:40.43679156325075 , lng: -3.70976152688625, title:"showroom Madrid"}
//         // Agrega más puntos aquí según sea necesario
//       ];
      
//       puntos.forEach((punto) => {
        
//         const marker = new window.google.maps.Marker({
//           position: punto,
//           map: map,
//           title: punto.title,
          
//         });

//         marker.addListener("click", () => {
//           map.setCenter(punto);
//           map.setZoom(10);
//           response.innerText = `Clicked on marker: ${punto.title}`;
//           calculateNearestPointAndDisplayRoute(punto);
//         });
//       });
//     }

//     function clear() {
//       marker.setMap(null);
//     }

//     function geocode(request) {
//       clear();
//       geocoder
//         .geocode(request)
//         .then((result) => {
//           const { results } = result;

//           map.setCenter(results[0].geometry.location);
//           marker.setPosition(results[0].geometry.location);
//           marker.setMap(map);

//           // Acceder al elemento "response" y establecer su contenido
//           response.innerText = JSON.stringify(result, null, 2);

//           return results;
//         })
//         .catch((e) => {
//           alert("Geocode was not successful for the following reason: " + e);
//         });
//     }

//     function calculateNearestPointAndDisplayRoute(destination) {
//       let shortestDistance = Infinity;
//       let nearestPoint = null;

//       // Calcular la distancia a cada punto y encontrar el más cercano
//       const puntos = [
//         { lat: -34.397, lng: 150.644, title: "Sydney" },
//         { lat: 40.712776, lng: -74.005974, title: "New York" }, 
//         { lat: 37.58663949629884,lng: -4.658668668908988, title:"CJMW Montilla"},
//         { lat:40.43679156325075 , lng: -3.70976152688625, title:"showroom Madrid"}
        

//         // Agrega más puntos aquí según sea necesario
//       ];

//       puntos.forEach((punto) => {
//         const distancia = window.google.maps.geometry.spherical.computeDistanceBetween(
//           new window.google.maps.LatLng(destination.lat, destination.lng),
//           new window.google.maps.LatLng(punto.lat, punto.lng)
//         );

//         if (distancia < shortestDistance) {
//           shortestDistance = distancia;
//           nearestPoint = punto;
//         }
//       });

//       // Trazar la ruta al punto más cercano
//       calculateAndDisplayRoute(destination, nearestPoint);
//     }

//     function calculateAndDisplayRoute(origin, destination) {
//       const request = {
//         origin: origin,
//         destination: destination,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       };
//       directionsService.route(request, (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           directionsRenderer.setDirections(result);
//           directionsRenderer.setMap(map);
//         } else {
//           alert("Directions request failed due to " + status);
//         }
//       });
//     }

//     window.initMap = initMap;

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly&libraries=marker&solution_channel=GMP_CCS_geocodingservice_v1&libraries=geometry`;
//     script.defer = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return <div id="map" className="h-[65vh] w-screen mx-auto"></div>;
// };

// export default GeocodingService;