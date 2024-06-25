import { connectToDB } from "@utils/database";
import Chat from "@models/chat";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();

    const searchId = await req.json();

    const foundUser = await User.findOne({
      $or: [
        { email: { $regex: searchId, $options: "i" } },
        { username: { $regex: searchId, $options: "i" } },
      ],
    });

    console.log(foundUser);

    const searchChat = await Chat.find({
      $or: [
        { members: { $in: [foundUser._id] } },
        { name: foundUser.username },
      ],
    })
      .ppulate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(searchChat), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch user in chat list", { status: 500 });
  }
};
