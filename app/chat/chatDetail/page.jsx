"use client";
import React, { useEffect, useState, useRef } from "react";

import ChatList from "@components/ChatList";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import TextareaAutosize from "react-textarea-autosize";
import MessageBox from "@components/MessageBox";
import { pusherClient } from "@lib/pusher";

import ContextBox from "@components/message-context/ContextBox";

import { motion } from "framer-motion";

const ChatDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  const { data: session } = useSession();

  const [chat, setChat] = useState({});
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState("");

  const [groupName, setGroupName] = useState("");
  const [groupUserId, setGroupUserId] = useState("");
  const [groupPhoto, setGroupPhoto] = useState("");

  const seenMessages = async () => {
    try {
      await fetch(`/api/chat/${chatId}/chatDetail`, {
        method: "POST",
        body: JSON.stringify({
          currentUserId: session?.user.id,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  const getDetail = async () => {
    try {
      const response = await fetch(`/api/chat/${chatId}/chatDetail`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setChat(data);
        setLoading(false);
        if (data?.members[0]._id === session?.user.id) {
          setGroupName(data?.members[1].username);
          setGroupPhoto(data?.members[1].image);
          setGroupUserId(data?.members[1]._id);
        } else {
          setGroupName(data?.members[0].username);
          setGroupPhoto(data?.members[0].image);
          setGroupUserId(data?.members[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user && chatId) {
      getDetail();
      seenMessages();
      console.log(chat);
    }
  }, [session?.user, chatId]);

  const [replyTextId, setReplyTextId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");

  const [contextReply, setContextReply] = useState("");

  const sendText = async () => {
    if (editText !== "") {
      const response = await fetch("/api/messages", {
        method: "PATCH",
        body: JSON.stringify({
          editText: text,
          messageId,
          chatId,
        }),
      });
      if (response.ok) {
        setText("");
        setEditText("");
      }
    } else {
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({
            chatId: chatId,
            currentUserId: session?.user.id,
            text,
            replyText,
          }),
        });

        if (response.ok) {
          setText("");
          setReplyText("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    const handleGetChat = async () => {
      try {
        const response = await fetch(`/api/messages/${chatId}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setChat(data);
        }
      } catch (error) {
        alert(error);
      }
    };

    pusherClient.bind("new-message", handleMessage);
    pusherClient.bind("delete-message", handleGetChat);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
      pusherClient.unbind("delete-message", handleGetChat);
    };
  }, [chatId]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [chat?.messages, replyText]);

  const [isToggle, setToggle] = useState(false);
  const [togglePosition, setTogglePosition] = useState([0, 0]);

  const [messageId, setMessageId] = useState("");
  const [toggleUser, setToggleUser] = useState(false);

  const renderMessages = (messages, setReplyTextId, setReplyText) => {
    let prevSender = null;
    let prevSenderTime = new Date(messages.createdAt);

    return messages.map((message, index) => {
      let hideAvatar = prevSender === message.sender._id;
      console.log(message.createdAt);
      console.log(prevSenderTime);

      const currentTime = new Date(message.createdAt);

      const timeDifference = Math.abs(currentTime - prevSenderTime);
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      console.log(minutesDifference);
      prevSender = message.sender._id;
      prevSenderTime = new Date(message.createdAt);
      if (hideAvatar && minutesDifference > 2) {
        hideAvatar = false;
      }

      return (
        <MessageBox
          key={index}
          message={message}
          currentUser={session?.user}
          hideAvatar={hideAvatar}
          setReplyTextId={setReplyTextId}
          setReplyText={setReplyText}
          setToggle={setToggle}
          isToggle={isToggle}
          setTogglePosition={setTogglePosition}
          setContextReply={setContextReply}
          setMessageId={setMessageId}
          setToggleUser={setToggleUser}
        />
      );
    });
  };

  const parentRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);
  useEffect(() => {
    // Function to update the width
    const updateWidth = () => {
      if (parentRef.current) {
        setParentWidth(parentRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const handleCancelReply = () => {
    setReplyTextId("");
    setReplyText("");
  };

  const handleCancelEdit = () => {
    setEditText("");
    setText("");
  };

  const handleDeleteText = async () => {
    try {
      const response = await fetch(`/api/messages`, {
        method: "DELETE",
        body: JSON.stringify({
          messageId,
          chatId,
        }),
      });
      if (response.ok) setToggle(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleToProfile = () => {
    if (session?.user.id === groupUserId) router.push("/profile");
    else router.push(`/other-profile?id=${groupUserId}`);
  };

  return (
    <section className="app-chat">
      <div className="innerApp-chat">
        <motion.div
          onClick={handleBack}
          className="relative w-5 h-5 mb-2 cursor-pointer"
          whileTap={{ x: 10 }}
          transition={{
            duration: 0.25,
          }}
        >
          <Image src="/assets/icons/Back icon.png" fill />
        </motion.div>
        <div className="flex w-full h-[calc(100%-3rem)] gap-2">
          <div className="hidden md:block w-[calc(29rem)]">
            <ChatList />
          </div>
          <div
            className="w-full h-full bg-white rounded-md shadow-lg"
            ref={parentRef}
          >
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="h-full">
                <div className="w-full border flex items-center gap-2 py-2 px-3 rounded-t-md">
                  <div
                    className="relative w-8 h-8 cursor-pointer"
                    onClick={handleToProfile}
                  >
                    <Image src={groupPhoto} fill className="rounded-full" />
                  </div>
                  <p
                    className="text-sm cursor-pointer"
                    onClick={handleToProfile}
                  >
                    {groupName}
                  </p>
                </div>
                <div
                  className={`px-3 ${
                    replyText ? "h-[calc(100%-9.2rem)]" : "h-[calc(100%-7rem)]"
                  } w-full bg-transparent overflow-auto flex flex-col items-center gap-10`}
                >
                  <div className="flex flex-col items-center mt-10 gap-2">
                    <div className="relative h-20 w-20">
                      <Image src={groupPhoto} fill className="rounded-full" />
                    </div>
                    <p>{groupName}</p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    {renderMessages(
                      chat?.messages,
                      setReplyTextId,
                      setReplyText
                    )}
                    {/* {chat?.messages.map((message, index) => (
                      <MessageBox
                        key={index}
                        message={message}
                        currentUser={session?.user}
                      />
                    ))} */}
                    <div ref={bottomRef}></div>
                  </div>
                </div>
                <div
                  className="flex flex-col items-start mt-2 absolute bottom-8 left-4 md:left-auto md:right-0"
                  style={{ width: `calc(${parentWidth}px - 1rem)` }}
                >
                  {replyText !== "" && (
                    <div className="w-[calc(100%-1rem)] mb-1 bg-slate-100 border-l-8 px-2 py-2 rounded-md flex justify-between">
                      <p
                        className="text-sm truncate overflow-hidden whitespace-nowrap"
                        // style={{
                        //   display: "-webkit-box",
                        //   WebkitBoxOrient: "vertical",
                        //   WebkitLineClamp: 1,
                        // }}
                      >
                        {replyText}
                      </p>

                      <div
                        className="relative h-5 w-5 cursor-pointer"
                        onClick={handleCancelReply}
                      >
                        <Image src="/assets/icons/Cross icon.png" fill />
                      </div>
                    </div>
                  )}
                  {editText !== "" && (
                    <div className="w-[calc(100%-1rem)] mb-1 bg-slate-100 border-l-8 px-2 py-2 rounded-md flex justify-between">
                      <p
                        className="text-sm truncate overflow-hidden whitespace-nowrap"
                        // style={{
                        //   display: "-webkit-box",
                        //   WebkitBoxOrient: "vertical",
                        //   WebkitLineClamp: 1,
                        // }}
                      >
                        {editText}
                      </p>

                      <div
                        className="relative h-5 w-5 cursor-pointer"
                        onClick={handleCancelEdit}
                      >
                        <Image src="/assets/icons/Cross icon.png" fill />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 w-[calc(100%-1rem)] bg-slate-100 rounded-lg shadow-md px-4 py-2">
                    <TextareaAutosize
                      className="resize-none w-full bg-transparent text-sm py-1 focus:outline-none max-h-16 transition-all"
                      placeholder="Send message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 cursor-pointer">
                        <Image src="/assets/icons/Photo search.png" fill />
                      </div>
                      <button
                        className="text-sm bg-blue-500 text-white px-4 py-1 rounded-full transition-all"
                        onClick={sendText}
                      >
                        {editText ? "Done" : "Send"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContextBox
        isToggle={isToggle}
        setToggle={setToggle}
        togglePosition={togglePosition}
        contextReply={contextReply}
        setReplyText={setReplyText}
        setMessageId={setMessageId}
        handleDeleteText={handleDeleteText}
        toggleUser={toggleUser}
        setText={setText}
        setEditText={setEditText}
      />
    </section>
  );
};

export default ChatDetail;
