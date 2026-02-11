import mongoose from 'mongoose';
import User from './user.js';

const RideSchema = new mongoose.Schema(
  {
    starting_point: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    driver: {
      type: User,
      required: true,
    },
    other_riders: {
      type: [User],
      required: false,
    },
    cost: {
      type: Number,
      required: true,
    },
    car: {
      type: String,
      required: false,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    deviation: {
      type: Number,
      required: true,
    },
    cities_along_route: {
      type: [String],
      required: true,
    },
  },

  { collection: 'rides_list' },
);

const Ride = mongoose.model('Ride', RideSchema);

export default Ride;
