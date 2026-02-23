import mongoose from 'mongoose';
import userModel from '../models/user.js';
import rideModel from '../models/ride.js';

mongoose.set('debug', true);

function searchRide(destination, date, price) {
  let promise;
  if (destination === undefined && date === undefined && price === undefined){
    promise = rideModel.find();
  }else if(date === undefined && price === undefined){
    promise = getRides(destination);
  }else if(price === undefined){
    promise = getRidesByDate(destination, date);
  }else {
    promise = getRidesByDP(destination, date, price);
  }
  return promise;
}

function getRidesByDP(destination, date, price){
  const promise = rideModel
    .find({ destination: destination, date: date, price: price})
    .catch((err) => console.log(err));
  return promise
}

//function to get rides going to that destination regardless of date
function getRides(destination) {
  const promise = rideModel
    .find({ destination: destination })
    .catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination on that date
function getRidesByDate(destination, date) {
  const promise = rideModel
    .find({ destination: destination, date: date })
    .catch((err) => console.log(err));
  return promise;
}

//function to get a ride by its id
function getRideById(rideId) {
  const promise = rideModel.findById(rideId).catch((err) => console.log(err));
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
