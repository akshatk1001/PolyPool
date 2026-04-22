import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
  },

  { collection: 'cars_list' },
);

const Car = mongoose.model('Car', CarSchema);

export default Car;
