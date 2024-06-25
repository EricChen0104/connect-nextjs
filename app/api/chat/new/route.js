import { connectToDB } from "@utils/database";
import Chat from "@models/chat";
import User from "@models/user";
import { pusherServer } from "@lib/pusher";

export const POST = async (req) => {
  const { member, name, userId, image } = await req.json();

  try {
    await connectToDB();
    console.log(member);
    const foundChat = await Chat.findOne({
      $or: [{ members: [userId, member] }, { members: [member, userId] }],
    });
    console.log(foundChat);
    if (foundChat)
      return new Response(JSON.stringify(foundChat), { status: 200 });

    const newChat = new Chat({
      members: [userId, member],
      name,
      groupPhoto: image,
    });

    await newChat.save();

    const upadteAllMembers = newChat.members.map(async (memberId) => {
      await User.findByIdAndUpdate(
        memberId,
        { $addToSet: { chats: newChat._id } },
        { new: true }
      );
    });
    Promise.all(upadteAllMembers);

    newChat.members.map((member) => {
      pusherServer.trigger(member._id.toString(), "new-chat", newChat);
    });

    return new Response(JSON.stringify(newChat), { status: 200 });
  } catch (error) {
    return new Response("Failed to create new chat", { status: 500 });
  }
};
