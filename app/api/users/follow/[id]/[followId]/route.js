import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    console.log(params.id);
    console.log(params.followId);
    const foundUser = await User.findById(params.id);

    if (!foundUser)
      return new Response("Failed to find User.", { status: 404 });

    const alreadyFollowIndex = foundUser.followersUser.indexOf(params.id);

    if (alreadyFollowIndex !== -1)
      return new Response(
        JSON.stringify({ msg: "you have already followed", foundUser }),
        { status: 200 }
      );

    return new Response(
      JSON.stringify({ msg: "you haven't followed yet", foundUser }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch user", { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  const { userId, followerId } = await req.json();
  try {
    await connectToDB();

    const post = await User.findById(followerId);
    const user = await User.findById(userId);

    if (!post) return new Response("User not found.", { status: 404 });

    const alreadyisFanIndex = post.fansUser.indexOf(userId);
    const alreadyFollowIndex = user.followersUser.indexOf(userId);

    if (alreadyisFanIndex !== -1) {
      // If user has already liked, remove the like
      post.fansUser.splice(alreadyisFanIndex, 1);
      user.followersUser.splice(alreadyFollowIndex, 1);
      post.fans -= 1;
      user.followers -= 1;
      await post.save();
      await user.save();
      return new Response(
        JSON.stringify({ msg: "User cancel followed successfully.", post }),
        { status: 200 }
      );
    }
    post.fansUser.push(userId);
    user.followersUser.push(userId);
    post.fans += 1;
    user.followers += 1;
    await post.save();
    await user.save();

    return new Response(
      JSON.stringify({ msg: "User followed successfully!", post }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to follow the User", { status: 500 });
  }
};
