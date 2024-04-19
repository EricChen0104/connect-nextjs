import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const POST = async (req) => {
  const { userId, postId, comment } = await req.json();

  try {
    await connectToDB();
    const newComment = new Comment({
      postId,
      userId,
      comment,
      likeUser: [],
      likes: 0,
    });
    await newComment.save();

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new comment", { status: 500 });
  }
};
