import dotenv from 'dotenv';
import cityService from './city-service.js';
dotenv.config();


async function getRoute(start, dest, waypoints){
  let quality;
  if (cityService.distanceBetween(start, dest) <= 100){
    quality = 'HIGH_QUALITY';
  }else {
    quality = 'OVERVIEW';
  }
  let WaypointStops = [];
  for (let i = 0; i < waypoints.length; i++){
    let loc = {location: `${waypoints[i]}, CA, USA`};
    WaypointStops.push(loc);
  }

  const ComputeRoutesRequest = {
    origin: {
      address: `${start}, CA, USA`,
    },
    destination: {
      address: `${dest}, CA, USA`,
    },
    routingPreference: "TRAFFIC_AWARE",
    travelMode: "DRIVE",
    polylineQuality: quality,
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: true,
    },
    languageCode: 'en-US',
    units: 'METRIC',
    
    ...((WaypointStops.length != 0) && {
      intermediates: WaypointStops,
      optimizeWaypointOrder: true
    })
  };

  console.log(ComputeRoutesRequest);

  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY, 
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
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
async function getCitiesOnRoute(polyline, start, dest) {
  let RouteData = {
    textQuery: 'gas station',
    searchAlongRouteParameters: {
      polyline: {
        encodedPolyline: polyline,
      },
    },
  };
  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'places.displayName,places.addressComponents,places.types',
      },
      body: JSON.stringify(RouteData),
    },
  );
  if (!response.ok) {
    throw new Error(`Google Places API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const cities = [];

  if (data.places) {
    data.places.forEach((place) => {
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
  getRoute,
};
