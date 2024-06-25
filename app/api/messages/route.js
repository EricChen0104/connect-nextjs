import { pusherServer } from "@lib/pusher";
import Chat from "@models/chat";
import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { chatId, currentUserId, text, replyText } = await req.json();

    const currentUser = await User.findById(currentUserId);
    const isReply = replyText !== ""; // Determine if it's a reply
    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      seenBy: currentUserId,
      replyText: replyText || null,
      isReply,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
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

    // const messagesWithReplies = updatedChat.messages.filter(
    //   (message) => message.isReply
    // );
    // await Message.populate(messagesWithReplies, {
    //   path: "replyTextId",
    //   model: Message,
    // });

    await pusherServer.trigger(chatId, "new-message", newMessage);

    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.error(`Failed to trigger update-chat event`);
      }
    });
    console.log(updatedChat);
    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    return new Response(error, { status: 500 });
  }
};
