import { connectToDB } from "@utils/database";
import Post from "@models/post";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const posts = await Post.findById(params.id).populate("creator");
    if (!posts) return new Response("Prompt not found!", { status: 404 });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all posts", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { post, tag } = await req.json();

  try {
    await connectToDB();

    const existingPost = await Post.findById(params.id);
    if (!post) return new Response("Post not found!", { status: 404 });

    existingPost.post = post;
    existingPost.tag = tag;

    await existingPost.save();

    return new Response(JSON.stringify(existingPost), { status: 200 });
  } catch (error) {
    return new Response("Failed to update post", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    console.log(params.id);
    await Post.findByIdAndDelete(params.id);
    const post = await Post.find({}).populate("creator");
    console.log(post);
    return new Response(
      JSON.stringify({ msg: "Post deleted successfully", post }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to delete post", { status: 500 });
  }
};
