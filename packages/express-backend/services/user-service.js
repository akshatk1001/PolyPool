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

// Update user profile fields such as phone, car, or home address.
function updateUser(userId, updates) {
  const promise = userModel
    .findByIdAndUpdate(userId, updates, { new: true })
    .catch((err) => console.log(err));
  return promise;
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
  console.log("INPUTTED PROFILE TO CREATE MS USER:", profile);
  const microsoftId = profile.oid || profile.openid;
  const email =
    profile.preferred_username ||
    profile.email ||
    profile.upn;

  // see if the account already exists in our database and return it
  const user = await userModel.findOne({ microsoftId }).catch((err) => {
    console.log(err);
  });
  if (user) return user;

  // if account doesn't exist, create a new one and return it
  const newUser = new userModel({ name: profile.displayName, email: email, microsoftId: microsoftId });
  return newUser.save().catch(err => console.log(err));
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
  getUsersByMinRating,
};
