import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const CONFIGURATION = {
  "ctaTitle": "Pedir",
  "mapOptions": {"center":{"lat":37.4221,"lng":-122.0841},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":true,"zoom":11,"zoomControl":true,"maxZoom":22},
  "mapsApiKey": "AIzaSyDo-lnZnIZp6G0tKihNr7B1Wx-uHH9ZN4g",
  "capabilities": {"addressAutocompleteControl":true,"mapDisplayControl":true,"ctaControl":true}
};

function handleScriptLoad(updateQuery, autoCompleteRef) {


  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["address"], componentRestrictions: { country: "col" } }
  );
  autoComplete.setFields(["address_components", "formatted_address", "geometry"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();

  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(addressObject.geometry.location.lat());
  console.log(addressObject.geometry.location.lng());
}

function SearchLocationInput() {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDo-lnZnIZp6G0tKihNr7B1Wx-uHH9ZN4g&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
      <div class="map" id="map"></div>
    </div>
  );
}

export default SearchLocationInput;
