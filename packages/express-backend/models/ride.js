import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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
    date_time: {
        type: Date,
        required: true,
    },
    id: {
        type: String,
        required: true,
        trim: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    other_riders: {
        type: Array[String],
        required: false,
    },
    cost: {
        type: float,
        required: true,
    },
    car: {
        type: String,
        required: false,
        trim: true,
    },
    
  },

  { collection: 'users_list' },
);

const User = mongoose.model('User', UserSchema);

export default User;
