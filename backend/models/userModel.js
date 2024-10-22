import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    user_name:{
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    event_id: {
      type: Array
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// module.exports = User;
export default User;
