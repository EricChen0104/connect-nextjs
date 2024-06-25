import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },
  bio: {
    type: String,
    default: "",
  },
  followersUser: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: {
    type: Number,
    default: 0,
  },
  fansUser: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  fans: {
    type: Number,
    default: 0,
  },
  chats: {
    type: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
