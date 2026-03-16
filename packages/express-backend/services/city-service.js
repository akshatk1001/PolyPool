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

function distanceBetween(src, dest){
  const start = cityModel.find({ name: src });
  const end = cityModel.find({ name: dest });
  const R = 3959; 
  
  const toRadians = (deg) => deg * (Math.PI / 180);

  const dLat = toRadians(end.lat - start.lat);  
  const dLon = toRadians(end.lng - start.lng); 
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(start.lat)) * Math.cos(toRadians(end.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; // Distance in miles
  
  return distance;
}

export default {
  getAll,
  autofill,
  distanceBetween
};
