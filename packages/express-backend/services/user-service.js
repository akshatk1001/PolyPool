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
  const microsoftId = profile.id;
  const email = profile.emails?.[0]?.value || profile._json?.mail;

  if (!microsoftId || !email) {
    throw new Error(
      `Microsoft profile is missing id ${microsoftId} or email ${email}.`,
    );
  }

  // try to find if this user already exists
  const userByMicrosoftId = await userModel
    .findOne({ microsoftId })
    .catch((err) => {
      console.log(err);
    });
  if (userByMicrosoftId) return userByMicrosoftId;

  // create a new user if one doesn't already exist with this Microsoft ID
  const newUser = new userModel({
    microsoftId: microsoftId,
    name: profile.displayName,
    email: email,
    phone_num: profile._json?.mobilePhone || null,
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
  getUsersByMinRating,
};
