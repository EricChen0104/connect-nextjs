import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: String,
    required: [true, "Post is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
  likesUser: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
