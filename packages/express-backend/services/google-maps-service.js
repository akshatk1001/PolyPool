import dotenv from 'dotenv';
dotenv.config();


async function getRoute(start, dest, quality){
  let ComputeRoutesRequest = {
    origin: {
      address: `${start}, CA, USA`
    },
    destination: {
      address: `${dest}, CA, USA`
    },
    routingPreference: "TRAFFIC_AWARE",
    travelMode: "DRIVE",
    polylineQuality: quality,
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    languageCode: "en-US",
    units: "METRIC"
  };

  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY, 
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs,routes.polyline.encodedPolyline'
    },
    body: JSON.stringify(ComputeRoutesRequest),
  });

  if (!response.ok) {
    throw new Error(`Google Routes API failed: ${response.statusText}`);
  }

  const route = await response.json();
  return route.routes[0];
}

//generates the cities along a given encoded polyline
async function getCitiesOnRoute(polyline, start, dest){

  let RouteData = {
    textQuery: "City Hall", 
    includedType: "local_government_office", 
    searchAlongRouteParameters: {
      polyline: {
        encodedPolyline: polyline
      }
    }
  };
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.addressComponents,places.types'
    },
    body: JSON.stringify(RouteData),
  });
  if (!response.ok) {
    throw new Error(`Google Places API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const cities = [];
  
  if (data.places) {
    data.places.forEach(place => {
      if (place.addressComponents) {
        const cityComponent = place.addressComponents.find(component => 
          component?.types?.includes("locality")
        );

        if (cityComponent) {
          const cityName = cityComponent.longText; 
          
          if (!cities.includes(cityName) && (cityName != start && cityName != dest)) {
            cities.push(cityName);
          }
        }
      }
    });
  }
  
  return cities;
}

export default {
  getCitiesOnRoute,
  getRoute
}