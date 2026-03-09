// One-time seed script: precomputes which cities are within 15 miles
// of each other and saves the results to each city's nearbyCities field.
//
// Usage (from packages/express-backend/):
//   node seedNearbyCities.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import City from './models/city.js';

dotenv.config();

const RADIUS_MILES = 15;

// Haversine formula — calculates the distance in miles between two
// latitude/longitude points on Earth's surface.
// It converts degrees to radians, then uses trig to account for the
// curvature of the Earth (radius ≈ 3,959 miles).
function haversine(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3959; // Earth's radius in miles

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log('Connected to MongoDB');

  const cities = await City.find().lean(); // .lean() returns plain JS objects (faster)
  console.log(`Loaded ${cities.length} cities`);

  let updated = 0;

  for (const city of cities) {
    // Compare this city against every other city
    const nearby = [];

    for (const other of cities) {
      if (city._id.toString() === other._id.toString()) continue;

      const dist = haversine(city.lat, city.lng, other.lat, other.lng);

      if (dist <= RADIUS_MILES) {
        nearby.push({
          name: other.name,
          distance: Math.round(dist * 10) / 10, // round to 1 decimal
        });
      }
    }

    // Sort closest cities first
    nearby.sort((a, b) => a.distance - b.distance);

    await City.updateOne({ _id: city._id }, { $set: { nearbyCities: nearby } });
    updated++;

    if (updated % 50 === 0) {
      console.log(`Updated ${updated} / ${cities.length} cities...`);
    }
  }

  console.log(`Done! Updated ${updated} cities.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
