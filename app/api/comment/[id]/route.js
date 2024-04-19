import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const comments = await Comment.find({ postId: params.id }).populate(
      "userId"
    );
    if (!comments) return new Response("Post not found", { status: 404 });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all comments", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { comment } = await req.json();

  try {
    await connectToDB();

    const comments = await Comment.findById(params.id);
    if (!comments) return new Response("Comment not found!", { status: 404 });

    comments.comment = comment;
    comments.edited = true;

    await comments.save();

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Failed to update the comment", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Comment.findByIdAndDelete(params.id);
    return new Response("The commment has been deleted successfully", {
      status: 200,
    });
  } catch (errror) {
    return new Response("Failed to delete comment", { status: 500 });
  }
};
