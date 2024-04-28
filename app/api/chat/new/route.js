import { connectToDB } from "@utils/database";
import Chat from "@models/chat";
import User from "@models/user";

export const POST = async (req) => {
  const { member } = await req.json();

  try {
    const foundUser = User.findById(member);
    if (!foundUser) return new Response("User is not exist", { status: 404 });

    const newChat = new Chat({
      member,
      name: foundUser.username,
    });

    await newChat.save();

    return new Response(
      JSON.stringify({
        msg: "tou have created the chat successfully!",
        newChat,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to create new chat", { status: 500 });
  }
};
