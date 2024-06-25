import { connectToDB } from "@utils/database";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { userId } = await req.json();
    const foundUsers = await User.find({
      $or: [
        { email: { $regex: userId, $options: "i" } },
        { username: { $regex: userId, $options: "i" } },
      ],
    });

    if (!foundUsers)
      return new Response(JSON.stringify({ msg: "No such user" }), {
        status: 200,
      });

    return new Response(
      JSON.stringify({ msg: "successfully find user", foundUsers }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to search users", { status: 500 });
  }
};
