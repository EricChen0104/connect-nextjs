"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import ChatBox from "./ChatBox";
import LoadingChatBox from "./LoadingChatBox";

import { useRouter } from "next/navigation";
import { pusherClient } from "@lib/pusher";

const ChatList = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  const [search, setSearch] = useState("");

  const router = useRouter();
  const getChats = async () => {
    // if (search === "") {
    try {
      const response = await fetch(`/api/chat/${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();

        setChats(data);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    // } else {
    //   try {
    //     const response = await fetch(`/api/chat/${currentUser}/searchChat`, {
    //       method: "POST",
    //       body: JSON.stringify({
    //         userId: search,
    //       }),
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(data);
    //       setChats(data);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      console.log("fuck you. you son of a bitch");
      pusherClient.subscribe(currentUser.id);

      const handleChatUpdate = (updatedChat) => {
        setLoading(true);
        getChats();
        if (!setLoading) {
          setChats((allChats) =>
            allChats.map((chat) => {
              if (chat._id === updatedChat.id) {
                return { ...chat, messages: updatedChat.messages };
              } else {
                return chat;
              }
            })
          );
        }
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser.id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search chat..."
        className="w-full px-2 py-1 rounded-md bg-slate-200 text-sm"
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex flex-col">
          {chats?.map((_, index) => (
            <LoadingChatBox key={index} />
          ))}
        </div>
      ) : (
        // <LoadingChatBox />
        <div>
          {chats?.map((chat, index) => (
            <div
              onClick={() => {
                router.push(`/chat/chatDetail?id=${chat._id}`);
                getChats();
              }}
            >
              <ChatBox chat={chat} index={index} currentUser={currentUser} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
