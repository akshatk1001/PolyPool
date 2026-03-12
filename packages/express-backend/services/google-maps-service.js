import dotenv from 'dotenv';
dotenv.config();

//Google maps Api requests

async function getRoute(start, dest){
  let ComputeRoutesRequest = {
    origin: {
      address: `${start}, CA, USA`
    },
    destination: {
      address: `${dest}, CA, USA`
    },
    routingPreference: "TRAFFIC_AWARE",
    travelMode: "DRIVE",
    polylineQuality: "HIGH_QUALITY",
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
async function getCitiesOnRoute(polyline){

  let RouteData = {
    textQuery: "city hall", 
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
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,routingSummaries'
    },
    body: JSON.stringify(RouteData),
  });
  if (!response.ok) {
    throw new Error(`Google Places API failed: ${response.statusText}`);
  }

  const city = await response.json();
  
  if (city.places) {
    return city.places.map(place => place.displayName.text);
  }
  
  return [];
}

export default {
  getCitiesOnRoute,
  getRoute
}