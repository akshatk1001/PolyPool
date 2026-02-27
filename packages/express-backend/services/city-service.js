import mongoose from 'mongoose';
import cityModel from '../models/city.js';

mongoose.set('debug', true);

function getAll(){
    const promise = cityModel.find();
    return promise;
}

function autofill(dest){
    const promise = cityModel
    .find({name: { $regex: dest, $options: 'i' }})
    .sort({population : -1})
    .limit(5);
    return promise;
}

export default {
  getAll,
  autofill
};
