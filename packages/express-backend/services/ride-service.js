import mongoose from 'mongoose';
import rideModel from '../models/ride.js';
import googleMapsService from '/google-maps-service.js';

mongoose.set('debug', true);

function populateRideUsers(query) {
  return query
    .populate('driver', 'name profile_pic ratings')
    .populate('other_riders', 'name');
}

function searchRide(dest, date, price) {
  let promise;
  if (dest === undefined && date === undefined && price === undefined) {
    promise = populateRideUsers(rideModel.find());
  } else if (date === undefined && price === undefined) {
    promise = getRides(dest);
  } else if (price === undefined) {
    promise = getRidesByDate(dest, date);
  } else {
    promise = getRidesByDP(dest, date, price);
  }
  return promise;
}

function getRidesByDP(dest, date, price) {
  const search_Date = new Date(date);
  const promise = populateRideUsers(
    rideModel.find({
      destination: dest,
      start_time: { $gte: search_Date },
      cost: { $lte: Number(price) },
    }),
  ).catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination regardless of date
function getRides(dest) {
  const promise = populateRideUsers(
    rideModel.find({ destination: { $regex: dest, $options: 'i' } }),
  ).catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination on that date
function getRidesByDate(dest, date) {
  const search_Date = new Date(date);
  const promise = populateRideUsers(
    rideModel.find({
      destination: { $regex: dest, $options: 'i' },
      start_time: { $gte: search_Date },
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
function updateRide(rideId, updates) {
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

    rideToAdd.route = await googleMapsService.getRoute(rideToAdd.starting_point, rideToAdd.destination);
    rideToAdd.cities_along_route = await googleMapsService.getCitiesOnRoute(rideToAdd.route.polyline.encodedPolyline);

    const promise = rideToAdd.save().catch((err) => console.log(err));
    return promise;
  } catch (error) {
    console.error("Failed to create ride:", error);
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
