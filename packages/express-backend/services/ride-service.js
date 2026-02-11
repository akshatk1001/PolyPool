import mongoose from 'mongoose';
import userModel from '../models/user.js';
import rideModel from '../models/ride.js';

mongoose.set('debug', true);

// function to get rides going to that destination
// function getRides(destination, date) {
//   const promise = new Promise((req, res) => {
//     rideModel.find({ destination: destination, date: date }
//         .then((rides) => { res.send(rides) }
//             .catch((err) => { send(err) })
//         )
//     })
// }

//function to get rides going to that destination regardless of date
function getRides(destination) {
  const promise = rideModel.find({ destination: destination}).catch((err) => console.log(err));
  return promise;
}

//function to get rides going to that destination on that date
function getRidesByDate(destination, date) {
  const promise = rideModel.find({ destination: destination, date: date }).catch((err) => console.log(err));
  return promise;
}

//function to get a ride by its id
function getRideById(rideId) {
  const promise = rideModel.findById(rideId).catch((err) => console.log(err));
  return promise;
}

//function to delete a ride by its id
function deleteRide(rideId) {
  const promise = rideModel.findByIdAndDelete(rideId).catch((err) => console.log(err));
  return promise;
}

// function to create a ride in the database
function createRide(ride) {
  const rideToAdd = new rideModel(ride);
  const promise = rideToAdd.save().catch((err) => console.log(err));
  return promise;
}
