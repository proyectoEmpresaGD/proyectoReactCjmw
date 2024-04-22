
import React, { useEffect } from "react";

const GeocodingService = () => {
  useEffect(() => {
    let map;
    let marker;
    let geocoder;
    let directionsService;
    let directionsRenderer;

    function initMap() {
      map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: { lat: -34.397, lng: 150.644 },
        mapTypeControl: false,
      });
      geocoder = new window.google.maps.Geocoder();
      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer();

      const inputText = document.createElement("input");
      inputText.className = "bg-white border rounded shadow p-2 m-4";
      inputText.type = "text";
      inputText.placeholder = "Enter a location";

      const submitButton = document.createElement("input");
      submitButton.className = "bg-blue-500 text-white rounded shadow p-2 m-4 hover:bg-blue-700";
      submitButton.type = "button";
      submitButton.value = "Geocode";

      const clearButton = document.createElement("input");
      clearButton.className = "bg-white text-blue-500 border border-blue-500 rounded shadow p-2 m-4 hover:bg-blue-100";
      clearButton.type = "button";
      clearButton.value = "Clear";

      const response = document.createElement("pre");
      response.id = "response";
      response.innerText = "";

      const responseDiv = document.createElement("div");
      responseDiv.id = "response-container";
      responseDiv.appendChild(response);

      const instructionsElement = document.createElement("p");
      instructionsElement.className = "bg-white border rounded shadow p-4 m-4";
      instructionsElement.id = "instructions";
      instructionsElement.innerHTML =
        "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";

      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputText);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(submitButton);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(clearButton);

      marker = new window.google.maps.Marker({ map });

      map.addListener("click", (e) => {
        geocode({ location: e.latLng });
      });

      submitButton.addEventListener("click", () => geocode({ address: inputText.value }));
      clearButton.addEventListener("click", clear);

      // Añadir marcadores
      const puntos = [
        { lat: -34.397, lng: 150.644, title: "Sydney" },
        { lat: 40.712776, lng: -74.005974, title: "New York" },
        // Agrega más puntos aquí según sea necesario
      ];

      puntos.forEach((punto) => {
        const marker = new window.google.maps.Marker({
          position: punto,
          map: map,
          title: punto.title,
        });

        marker.addListener("click", () => {
          map.setCenter(punto);
          map.setZoom(10);
          response.innerText = `Clicked on marker: ${punto.title}`;
          calculateNearestPointAndDisplayRoute(punto);
        });
      });
    }

    function clear() {
      marker.setMap(null);
    }

    function geocode(request) {
      clear();
      geocoder
        .geocode(request)
        .then((result) => {
          const { results } = result;

          map.setCenter(results[0].geometry.location);
          marker.setPosition(results[0].geometry.location);
          marker.setMap(map);
          document.getElementById("response").innerText = JSON.stringify(result, null, 2);
          return results;
        })
        .catch((e) => {
          alert("Geocode was not successful for the following reason: " + e);
        });
    }

    function calculateNearestPointAndDisplayRoute(destination) {
      let shortestDistance = Infinity;
      let nearestPoint = null;

      // Calcular la distancia a cada punto y encontrar el más cercano
      const puntos = [
        { lat: -34.397, lng: 150.644, title: "Sydney" },
        { lat: 40.712776, lng: -74.005974, title: "New York" },
        // Agrega más puntos aquí según sea necesario
      ];

      puntos.forEach((punto) => {
        const distancia = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(destination.lat, destination.lng),
          new window.google.maps.LatLng(punto.lat, punto.lng)
        );

        if (distancia < shortestDistance) {
          shortestDistance = distancia;
          nearestPoint = punto;
        }
      });

      // Trazar la ruta al punto más cercano
      calculateAndDisplayRoute(destination, nearestPoint);
    }

    function calculateAndDisplayRoute(origin, destination) {
      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
        } else {
          alert("Directions request failed due to " + status);
        }
      });
    }

    window.initMap = initMap;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly&solution_channel=GMP_CCS_geocodingservice_v1&libraries=geometry`;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" className="h-[65vh] w-screem mx-auto"></div>;
};

export default GeocodingService;