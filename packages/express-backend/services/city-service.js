import mongoose from 'mongoose';
import cityModel from '../models/city.js';

mongoose.set('debug', true);

function getAll() {
  const promise = cityModel.find();
  return promise;
}

function autofill(dest) {
  const promise = cityModel
    .find({ name: { $regex: dest, $options: 'i' } })
    .sort({ population: -1 })
    .limit(5);
  return promise;
}

// Look up a city by exact name and return its precomputed nearby cities list
function getNearbyCities(cityName) {
  const promise = cityModel
    .findOne({ name: { $regex: `^${cityName}$`, $options: 'i' } })
    .select('name nearbyCities');
  return promise;
}

export default {
  getAll,
  autofill,
  getNearbyCities,
};
