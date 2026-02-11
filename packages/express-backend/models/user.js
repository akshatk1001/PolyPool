import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
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
      required: false,
    },
    car: {
      type: String,
      required: false,
      trim: true,
    },
    phone_num: {
      type: Number,
      required: true,
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
  },

  { collection: 'users_list' },
);

const User = mongoose.model('User', UserSchema);

export default User;
