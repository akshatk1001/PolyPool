import './cal_cities_lat_long.csv';

const fs = require('fs');
const csv = require('csv-parser');

const cities = {};

// Load CSV into memory once when server starts
function loadCities() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('cal_cities_lat_long.csv')
      .pipe(csv())
      .on('data', (row) => {
        const cityName = row.Name.trim().toLowerCase();
        cities[cityName] = {
          lat: parseFloat(row.Latitude),
          lon: parseFloat(row.Longitude)
        };
      })
      .on('end', resolve)
      .on('error', reject);
  });
}

function getCityCoordinates(cityName) {
  return cities[cityName.trim().toLowerCase()] || null;
}

export { getCityCoordinates, loadCities };