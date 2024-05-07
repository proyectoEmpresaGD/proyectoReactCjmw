
//AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg

import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GeocodingService = () => {
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", // Asegúrate de usar tu clave de API válida
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    let map;
    let geocoder;
    let directionsService;
    let directionsRenderer;
    let infoWindow;

    loader.load().then(() => {
      map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 40.436437195598145, lng: -3.693919201706416 },
        styles: [
          { elementType: 'geometry', stylers: [{ color: '' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        ]
      });
      geocoder = new window.google.maps.Geocoder();
      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
      });
      infoWindow = new window.google.maps.InfoWindow();

      
      addMarkers();
    });

    const addMarkers = () => {
      const puntos = [
        { lat: -34.397, lng: 150.644, title: "Sydney" },
        { lat: 40.712776, lng: -74.005974, title: "New York" },
        { lat: 37.586784324249166, lng: -4.658694292094171, title: "CJMW Montilla" },
        { lat: 40.43679156325075, lng: -3.70976152688625, title: "showroom Madrid" }
      ];

      puntos.forEach(punto => {
        const position = new window.google.maps.LatLng(punto.lat, punto.lng);
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: punto.title
        });

        marker.addListener('click', () => {
          infoWindow.setContent(punto.title);
          infoWindow.open(map, marker);
        });
      });
    };

    const findStores = (postalCode) => {
      geocoder.geocode({ address: postalCode }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          map.setCenter(location);
          calculateNearestPointAndDisplayRoute(location);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    function calculateNearestPointAndDisplayRoute(origin) {
      let shortestDistance = Infinity;
      let nearestPoint = null;

      const puntos = [
        { lat: -34.397, lng: 150.644, title: "Sydney" },
        { lat: 40.712776, lng: -74.005974, title: "New York" },
        { lat: 37.586784324249166, lng: -4.658694292094171, title: "CJMW Montilla" },
        { lat: 40.43679156325075, lng: -3.70976152688625, title: "showroom Madrid" }
      ];

      puntos.forEach(punto => {
        const distancia = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(origin.lat(), origin.lng()),
          new window.google.maps.LatLng(punto.lat, punto.lng)
        );

        if (distancia < shortestDistance) {
          shortestDistance = distancia;
          nearestPoint = punto;
        }
      });

      if (nearestPoint) {
        const request = {
          origin: origin,
          destination: new window.google.maps.LatLng(nearestPoint.lat, nearestPoint.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            infoWindow.setContent(nearestPoint.title);
            infoWindow.setPosition(nearestPoint);
            infoWindow.open(map);
          } else {
            alert("Directions request failed due to " + status);
          }
        });
      }
    }

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="  bg-gradient-to-r from-[#ebdecf] to-[#8a7862] px-2 mx-auto">
      <input
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="Escribe aquí tu ciudad"
        className=" xl:ml-[3px] mb-6 w-10% xl:w-[12%] border-b-2 border-black bg-transparent text-[110%] focus:border-b focus:border-black focus:bg-transparent focus:w-[50%] xl:focus:w-[16%] duration-150"
      />
      <button className=" m-3 bg-slate-400 border-black hover:bg-slate-200 duration-150 rounded-md py-2 pr-1 pl-1" onClick={() => findStores(postalCode)}>
        Tienda más cercana
      </button>
      <div id="map" style={{ height: "65vh", width: "100%", margin: "auto" }} className=" h:-[65vh] w-[100%] bg-transparent"></div>
    </div>
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