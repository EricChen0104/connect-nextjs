import { connectToDB } from "@utils/database";
import Chat from "@models/chat";
import User from "@models/user";
import Message from "@models/message";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const chat = await Chat.findById(params.userId)
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

    // const messagesWithReplies = chat.messages.filter(
    //   (message) => message.isReply
    // );
    // await Message.populate(messagesWithReplies, {
    //   path: "replyTextId",
    //   model: Message,
    // });
    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch User data", { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { currentUserId } = await req.json();

    await Message.updateMany(
      { chat: params.userId },
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: User,
      })
      .exec();

    return new Response("Seen all message by current user", { status: 200 });
  } catch (err) {
    return new Response("Failed to update seen messages", { status: 500 });
  }
};
