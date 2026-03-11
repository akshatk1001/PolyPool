import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


//Google maps Api requests

async function getRoute(origin, dest){
  let ComputeRoutesRequest = {
    "origin": {
      "location": {
        "address": `${origin}, CA`
      },
    },
    "destination": {
      "location": {
        "address": `${dest}, CA`
      },
    },
    "routing_preference": "TRAFFIC_AWARE",
    "travel_mode": "DRIVE",
    "polylineQuality": "HIGH_QUALITY"
  };

  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY, //needs to pull from .env
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs,routes.polyline.encodedPolyline'
    },
    body: json.stringify(ComputeRoutesRequest),
  });

  if (!response.ok) {
    throw new Error(`Google Routes API failed: ${response.statusText}`);
  }

  const route = await response.json();
  return route.routes[0];
}

//generates the cities along a given encoded polyline
async function getCitiesOnRoute(polyline){

  headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': api_key,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
  }

  data = {
    "textQuery": "city", 
    "searchAlongRouteParameters": {
      "polyline": {
        "encodedPolyline": polyline
      }
    }
  };
  const cities = fetch('https://places.googleapis.com/v1/places:searchText', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Google Places API failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.places) {
    return data.places.map(place => place.displayName.text);
  }
  
  return [];
}

export default {
  getCitiesOnRoute,
  getRoute
}