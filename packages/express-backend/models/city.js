import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    }
  },

  { collection: 'cities_list' },
);

const City = mongoose.model('City', CitySchema);

export default City;
