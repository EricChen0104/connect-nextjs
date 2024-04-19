import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const user = await User.findById(params.id);
    if (!user) return new Response("User not found!", { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch User", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { bio } = await req.json();
  try {
    await connectToDB();

    const existingUser = await User.findById(params.id);

    existingUser.bio = bio;
    await existingUser.save();

    return new Response(JSON.stringify(existingUser), { status: 200 });
  } catch (error) {
    return new Response("Failed to update your profile", { status: 500 });
  }
};
