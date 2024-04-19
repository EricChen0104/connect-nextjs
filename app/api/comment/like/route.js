import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const POST = async (req) => {
  const { postId, userId } = await req.json();
  console.log(postId);
  try {
    await connectToDB();
    const post = await Comment.findById(postId);
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const alreadyLikedIndex = post.likesUser.indexOf(userId);
    if (alreadyLikedIndex !== -1) {
      // If user has already liked, remove the like
      post.likesUser.splice(alreadyLikedIndex, 1);
      post.likes -= 1;
      await post.save();
      console.log(post);
      return new Response(
        JSON.stringify({ msg: "Post unliked successfully.", post }),
        { status: 200 }
      );
    }
    post.likesUser.push(userId);
    post.likes += 1;
    await post.save();
    console.log(post);

    return new Response(
      JSON.stringify({ msg: "Post liked successfully!", post }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to like the post", { status: 500 });
  }
};
