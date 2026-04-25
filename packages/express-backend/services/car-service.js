import mongoose from 'mongoose';
import carModel from '../models/cars.js';

mongoose.set('debug', true);

const brands = [
  'toyota',
  'honda',
  'ford',
  'chevrolet',
  'nissan',
  'volkswagen',
  'hyundai',
  'kia',
  'subaru',
  'mazda',
  'jeep',
  'dodge',
  'ram',
  'gmc',
  'tesla',
  'bmw',
  'mercedes-benz',
  'audi',
  'lexus',
  'acura',
  'infiniti',
  'cadillac',
  'buick',
  'lincoln',
  'chrysler',
  'volvo',
  'mitsubishi',
  'land rover',
  'porsche',
  'mini',
  'fiat',
  'alfa romeo',
  'jaguar',
  'genesis',
  'maserati',
  'polestar',
  'rivian',
  'lucid',
  'saturn',
  'pontiac',
  'scion',
  'mercury',
  'oldsmobile',
  'saab',
  'suzuki',
  'isuzu',
  'hummer',
  'smart',
  'plymouth',
  'datsun',
];

function getAll() {
  const promise = carModel.find();
  return promise;
}

function getCar(car) {
  const make = '';
  const model = '';
  const year = 0;
  for (const item of car.split(' ')) {
    if (isNaN(item)) {
      item.toLowerCase() in brands ? (make = item) : (model = item);
    } else {
      year = Number(item);
    }
  }
  const promise = carModel
    .find({
      Make: { $regex: make, $options: 'i' },
      Model: { $regex: Model, $options: 'i' },
      Year: year,
    })
    .catch((err) => console.log(err));
  return promise;
}
function addCar(car) {
  const newCar = new carModel();
  for (const item of car.split(' ')) {
    if (isNaN(item)) {
      item.toLowerCase() in brands
        ? (newCar.Make = item)
        : (newCar.Model = item);
    } else {
      const num = Number(item);
      num > 10 ? (newCar.Year = num) : (newCar.Seats = num);
    }
  }
}
