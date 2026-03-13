import mongoose from 'mongoose';
import rideModel from '../models/ride.js';
import googleMapsService from './google-maps-service.js';

mongoose.set('debug', true);

function populateRideUsers(query) {
  return query
    .populate('driver', 'name profile_pic ratings')
    .populate('other_riders', 'name')
    .populate('waitlist_riders', 'name');
}
function hasUser(users, userId) {
  return Array.isArray(users) && users.some((id) => id.toString() === userId.toString());
}

async function promoteFromWaitlist(ride) {
  const normalizedSeats = Number(ride.seats) || 0;
  if (!Array.isArray(ride.other_riders)) {
    ride.other_riders = [];
  }
  if (!Array.isArray(ride.waitlist_riders)) {
    ride.waitlist_riders = [];
  }

  while (
    ride.other_riders.length < normalizedSeats
    && ride.waitlist_riders.length > 0
  ) {
    const nextRider = ride.waitlist_riders.shift();
    if (!hasUser(ride.other_riders, nextRider)) {
      ride.other_riders.push(nextRider);
    }
  }

  await ride.save();
  return getRideById(ride._id);
}

async function joinRide(rideId, userId) {
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }

  if (!Array.isArray(ride.other_riders)) {
    ride.other_riders = [];
  }
  if (!Array.isArray(ride.waitlist_riders)) {
    ride.waitlist_riders = [];
  }

  if (ride.driver.toString() === userId.toString()) {
    return { ride: await getRideById(rideId), status: 'driver_cannot_join' };
  }

  if (hasUser(ride.other_riders, userId)) {
    return { ride: await getRideById(rideId), status: 'already_joined' };
  }

  if (hasUser(ride.waitlist_riders, userId)) {
    return { ride: await getRideById(rideId), status: 'already_waitlisted' };
  }

  const normalizedSeats = Number(ride.seats) || 0;
  if (ride.other_riders.length < normalizedSeats) {
    ride.other_riders.push(userId);
    await ride.save();
    return { ride: await getRideById(rideId), status: 'joined' };
  }

  ride.waitlist_riders.push(userId);
  await ride.save();
  return { ride: await getRideById(rideId), status: 'waitlisted' };
}

async function leaveRide(rideId, userId) {
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }

  if (!Array.isArray(ride.other_riders)) {
    ride.other_riders = [];
  }
  if (!Array.isArray(ride.waitlist_riders)) {
    ride.waitlist_riders = [];
  }

  const wasPassenger = hasUser(ride.other_riders, userId);
  const wasWaitlisted = hasUser(ride.waitlist_riders, userId);

  ride.other_riders = ride.other_riders.filter(
    (id) => id.toString() !== userId.toString(),
  );
  ride.waitlist_riders = ride.waitlist_riders.filter(
    (id) => id.toString() !== userId.toString(),
  );

  const updatedRide = await promoteFromWaitlist(ride);
  return {
    ride: updatedRide,
    status: wasPassenger ? 'left_ride' : wasWaitlisted ? 'left_waitlist' : 'not_joined',
  };
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
/*
likely don't need 
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
}*/

//function to get a ride by its id
function getRideById(rideId) {
  const promise = populateRideUsers(rideModel.findById(rideId)).catch((err) =>
    console.log(err),
  );
  return promise;
}

// Update ride details such as destination, date, or price.
async function updateRide(rideId, updates) {
  if (updates.other_rider) {
    return joinRide(rideId, updates.other_rider).then((result) => result.ride);
  }

  const ride = await rideModel.findByIdAndUpdate(rideId, updates, { new: true }).catch((err) => {
    console.log(err);
    return null;
  });

  if (!ride) {
    return null;
  }

  return promoteFromWaitlist(ride);
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

    rideToAdd.route = await googleMapsService.getRoute(
      rideToAdd.starting_point,
      rideToAdd.destination,
    );
    rideToAdd.cities_along_route = await googleMapsService.getCitiesOnRoute(
      rideToAdd.route.polyline.encodedPolyline,
      rideToAdd.starting_point,
      rideToAdd.destination,
    );

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
  joinRide,
  leaveRide,
};
