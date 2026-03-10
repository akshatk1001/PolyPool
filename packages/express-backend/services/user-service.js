import mongoose from 'mongoose';
import userModel from '../models/user.js';

// Get a list of users, optionally filtered by name.
function getUsers(name) {
  const query = name ? { name: name } : {};
  const promise = userModel.find(query).catch((err) => console.log(err));
  return promise;
}

// Get a single user by id.
function getUserById(userId) {
  const promise = userModel.findById(userId).catch((err) => console.log(err));
  return promise;
}


// Update ride details such as destination, date, or price.
function updateUser(userId, updates) {
  // if rides_as_passenger was changed then we need to modify that in the user array
  if (updates.rides_as_passenger !== undefined) {
    const userUpdate = Array.isArray(updates.rides_as_passenger)
      // if it's an array, replace the whole list since that means they removed themselves from a ride
      ? { rides_as_passenger: updates.rides_as_passenger } 
      // if it's not an array, add this ride to the list because that means they requested to join a ride
      : { $addToSet: { rides_as_passenger: updates.rides_as_passenger } };
    const promise = userModel
    .findByIdAndUpdate(userId, userUpdate, { new: true })
    .catch((err) => console.log(err));
  return promise;
  }

  // if rides_as_driver was changed then we need to modify that in the user array
  if (updates.rides_as_driver !== undefined) {
    const userUpdate = Array.isArray(updates.rides_as_driver)
      ? { rides_as_driver: updates.rides_as_driver }
      : { $addToSet: { rides_as_driver: updates.rides_as_driver } };
    const promise = userModel
    .findByIdAndUpdate(userId, userUpdate, { new: true })
    .catch((err) => console.log(err));
  return promise;
  }
  return userModel.findByIdAndUpdate(userId, updates, { new: true }).catch((err) => console.log(err));
}

// Delete a user entirely.
function deleteUser(userId) {
  const promise = userModel
    .findByIdAndDelete(userId)
    .catch((err) => console.log(err));
  return promise;
}

// Get Venmo username for a user.
function getVenmo(userId) {
  const promise = userModel
    .findById(userId)
    .select('venmo_username')
    .catch((err) => console.log(err));
  return promise;
}

// Get PayPal ID for a user.
function getPaypal(userId) {
  const promise = userModel
    .findById(userId)
    .select('paypal_id')
    .catch((err) => console.log(err));
  return promise;
}

// Add a new rating for a driver or rider.
function addRating(userId, rating) {
  const promise = userModel
    .findByIdAndUpdate(userId, { $push: { ratings: rating } }, { new: true })
    .catch((err) => console.log(err));
  return promise;
}

// Get all users with a minimum average rating (useful for filtering safe drivers).
function getUsersByMinRating(minRating) {
  const promise = userModel.find({}).catch((err) => console.log(err));
  return promise;
}

// Find or create a user from a Microsoft SSO profile.
async function findOrCreateMicrosoftUser(profile) {
  const microsoftId = profile.id;
  const email = profile.emails?.[0]?.value || profile._json?.mail;

  if (!microsoftId || !email) {
    throw new Error(
      `Microsoft profile is missing id ${microsoftId} or email ${email}.`,
    );
  }

  if (!email.endsWith('@calpoly.edu')) {
    throw new Error('non_calpoly_email');
  }

  // try to find if this user already exists
  const userByMicrosoftId = await userModel
    .findOne({ microsoftId })
    .catch((err) => {
      console.log(err);
    });
  if (userByMicrosoftId) return userByMicrosoftId;

  // create new user account immediately 
  const newUser = new userModel({
    microsoftId,
    name: profile.displayName,
    email,
  });
  return newUser.save();
}

// Create a new Microsoft user after they have provided their phone number.
async function createMicrosoftUser(microsoftId, name, email, phoneNum) {
  const newUser = new userModel({
    microsoftId: microsoftId,
    name: name,
    email: email,
    phone_num: phoneNum,
  });
  return newUser.save().catch((err) => console.log(err));
}

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getVenmo,
  getPaypal,
  addRating,
  findOrCreateMicrosoftUser,
  createMicrosoftUser,
  getUsersByMinRating,
};
