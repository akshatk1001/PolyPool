import mongoose from 'mongoose';
import cityModel from '../models/city.js';

mongoose.set('debug', true);

function getAll(){
    const promise = cityModel.find();
    return promise;
}

function autofill(dest){
    const promise = cityModel
    .filter((city) => city.name.includes(dest))
    .sort();

    return promise;
}

export default {
  getAll,
  autofill
};
