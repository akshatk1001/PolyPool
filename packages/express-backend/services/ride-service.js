import mongoose from 'mongoose';
import rideModel from '../models/ride.js';
import googleMapsService from './google-maps-service.js';
import cityService from './city-service.js';

mongoose.set('debug', true);

function populateRideUsers(query) {
  return query
    .populate('driver', '_id name profile_pic ratings')
    .populate('other_riders', '_id name');
}

function searchRide(dest, date, price) {
  let promise;
  if (dest === undefined && date === undefined && price === undefined) {
    promise = populateRideUsers(rideModel.find());
  } else {
    promise = getRidesByDP(dest, date, price);
  }
  return promise;
}

function getRidesByDP(dest, date, price) {
  const search_Date = new Date(date);
  const promise = populateRideUsers(
    rideModel.find({
      $or: [
        { destination: { $regex: dest, $options: 'i' } },
        { cities_along_route: { $regex: dest, $options: 'i' } },
      ],
      start_time: { $gte: search_Date },
      cost: { $lte: Number(price) },
    }),
  ).catch((err) => console.log(err));
  return promise;
}

//function to get a ride by its id
function getRideById(rideId) {
  const promise = populateRideUsers(rideModel.findById(rideId)).catch((err) =>
    console.log(err),
  );
  return promise;
}

// Update ride details such as destination, date, or price.
async function updateRide(rideId, updates) {
  if (updates.starting_point || updates.destination) {
    let quality;
    if (
      cityService.distanceBetween(
        updates.starting_point,
        updates.destination,
      ) <= 50
    ) {
      quality = 'HIGH_QUALITY';
    } else {
      quality = 'OVERVIEW';
    }
    console.log(`quality of the line: ${quality}`);
    updates.route = await googleMapsService.getRoute(
      updates.starting_point,
      updates.destination,
      quality,
    );
    if (updates.deviation != false) {
      updates.cities_along_route = await googleMapsService.getCitiesOnRoute(
        updates.route.polyline.encodedPolyline,
        updates.starting_point,
        updates.destination,
      );
    }
  }

  if (updates.other_rider) {
    const promise = rideModel
      .findByIdAndUpdate(
        rideId,
        { $addToSet: { other_riders: updates.other_rider } },
        { new: true },
      )
      .catch((err) => console.log(err));
    return promise;
  }
  return rideModel
    .findByIdAndUpdate(rideId, updates, { new: true })
    .catch((err) => console.log(err));
}

//function to delete a ride by its id
function deleteRide(rideId) {
  const promise = rideModel
    .findByIdAndDelete(rideId)
    .catch((err) => console.log(err));
  return promise;
}

// function to create a ride in the database
async function createRide(ride) {
  try {
    const rideToAdd = new rideModel(ride);

    let quality;
    if (
      cityService.distanceBetween(
        rideToAdd.starting_point,
        rideToAdd.destination,
      ) <= 50
    ) {
      quality = 'HIGH_QUALITY';
    } else {
      quality = 'OVERVIEW';
    }
    console.log(`quality of the line: ${quality}`);
    rideToAdd.route = await googleMapsService.getRoute(
      rideToAdd.starting_point,
      rideToAdd.destination,
      quality,
    );
    if (rideToAdd.deviation != false) {
      rideToAdd.cities_along_route = await googleMapsService.getCitiesOnRoute(
        rideToAdd.route.polyline.encodedPolyline,
        rideToAdd.starting_point,
        rideToAdd.destination,
      );
    }
    const promise = rideToAdd.save().catch((err) => console.log(err));
    return promise;
  } catch (error) {
    console.error('Failed to create ride:', error);
    throw error;
  }
}

export default {
  searchRide,
  getRideById,
  deleteRide,
  createRide,
  updateRide,
};
