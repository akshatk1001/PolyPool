import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    microsoftId: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    home_address: {
      type: String,
      required: false,
      trim: true,
    },
    ratings: {
      type: [Number],
      required: true,
      default: [],
    },
    car: {
      type: String,
      required: false,
      trim: true,
    },
    phone_num: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    venmo_username: {
      type: String,
      required: false,
      trim: true,
    },
    paypal_id: {
      type: String,
      required: false,
      trim: true,
    },
    instagram: {
      type: String,
      required: false,
      trim: true,
    },
    grade: {
      type: Number,
      required: false,
    },
    major: {
      type: String,
      required: false,
      trim: true,
    },
    profile_pic: {
      type: String,
      required: false,
      trim: true,
    },
    rides_as_driver: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Ride',
      required: false,
    },
    rides_as_rider: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Ride',
      required: false,
    },
    requested_rides_as_driver: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Ride',
      required: false,
    },
  },

  { collection: 'users_list' },
);

const User = mongoose.model('User', UserSchema);

export default User;
