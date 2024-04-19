import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  postId: {
    type: String,
    required: [true, "Post id is required."],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: String,
    required: [true, "Comment is required."],
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
  edited: {
    type: Boolean,
    default: false,
  },
});

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
