import  { useEffect } from "react";

const GeocodingService = () => {
  useEffect(() => {
    let map;
    let marker;
    let geocoder;
    let response;

    function initMap() {
      map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 },
        mapTypeControl: false,
      });
      geocoder = new window.google.maps.Geocoder();

      const inputText = document.createElement("input");

      inputText.type = "text";
      inputText.placeholder = "Enter a location";

      const submitButton = document.createElement("input");

      submitButton.type = "button";
      submitButton.value = "Geocode";
      submitButton.classList.add("button", "button-primary");

      const clearButton = document.createElement("input");

      clearButton.type = "button";
      clearButton.value = "Clear";
      clearButton.classList.add("button", "button-secondary");
      response = document.createElement("pre");
      response.id = "response";
      response.innerText = "";
      const responseDiv = document.createElement("div");
      responseDiv.id = "response-container";
      responseDiv.appendChild(response);

      const instructionsElement = document.createElement("p");

      instructionsElement.id = "instructions";
      instructionsElement.innerHTML =
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputText);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(submitButton);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(clearButton);
      
      marker = new window.google.maps.Marker({
        map,
      });
      map.addListener("click", (e) => {
        geocode({ location: e.latLng });
      });
      submitButton.addEventListener("click", () =>
        geocode({ address: inputText.value })
      );
      clearButton.addEventListener("click", () => {
        clear();
      });
      clear();
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
          response.innerText = JSON.stringify(result, null, 2);
          return results;
        })
        .catch((e) => {
          alert("Geocode was not successful for the following reason: " + e);
        });
    }

    window.initMap = initMap;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly&solution_channel=GMP_CCS_geocodingservice_v1`;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ height: "100vh" }}></div>;
};

export default GeocodingService;