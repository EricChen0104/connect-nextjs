import { connectToDB } from "@utils/database";
import Chat from "@models/chat";
import User from "@models/user";
import Message from "@models/message";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const allChats = await Chat.find({ members: { $in: [params.userId] } })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    console.log(allChats);
    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify("Failed to fetch all chat of current user"),
      {
        status: 500,
      }
    );
  }
};
