import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    nearbyCities: {
      type: [
        {
          name: { type: String, required: true },
          distance: { type: Number, required: true },
        },
      ],
      default: [],
    },
  },

  { collection: 'cities_list' },
);

const City = mongoose.model('City', CitySchema);

export default City;
