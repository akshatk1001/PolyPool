import mongoose from 'mongoose';
import rideModel from '../models/ride.js';

mongoose.set('debug', true);

function populateRideUsers(query) {
  return query
    .populate('driver', 'name')
    .populate('other_riders', 'name');
}

function searchRide(dest, date, price) {
  let promise;
  if ((dest === undefined) && date === undefined && price === undefined) {
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
  const promise = populateRideUsers(
    rideModel.find({ destination: dest, date: date, price: price }),
  )
    .catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination regardless of date
function getRides(dest) {
  const promise = populateRideUsers(
    rideModel.find({ destination: { $regex: dest, $options: 'i' } })
  ).catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination on that date
function getRidesByDate(dest, date) {
  const promise = populateRideUsers(
    rideModel.find({ destination: { $regex: dest, $options: 'i' }, date: date }),
  )
    .catch((err) => console.log(err));
  return promise;
}

//function to get a ride by its id
function getRideById(rideId) {
  const promise = populateRideUsers(rideModel.findById(rideId)).catch((err) => console.log(err));
  return promise;
}

//function to delete a ride by its id
function deleteRide(rideId) {
  const promise = rideModel
    .findByIdAndDelete(rideId)
    .catch((err) => console.log(err));
  return promise;
}

// function to create a ride in the database
function createRide(ride) {
  const rideToAdd = new rideModel(ride);
  const promise = rideToAdd.save().catch((err) => console.log(err));
  return promise;
}

export default {
  searchRide,
  getRideById,
  deleteRide,
  createRide,
};
