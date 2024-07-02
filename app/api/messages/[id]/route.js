import Chat from "@models/chat";
import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const chat = await Chat.findById(params.id)
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    return new Response(error, { status: 500 });
  }
};
