import React from "react";

import Image from "next/image";
import { format } from "date-fns";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ChatBox = ({ chat, currentUser }) => {
  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const { data: session } = useSession();
  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === session?.user.id
  );

  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState("");
  // console.log(chat);
  useEffect(() => {
    if (chat?.members[0]._id === currentUser.id) {
      setGroupName(chat?.members[1].username);
      setGroupPhoto(chat?.members[1].image);
    } else {
      setGroupName(chat?.members[0].username);
      setGroupPhoto(chat?.members[0].image);
    }
  }, []);

  return (
    <div className="w-[calc(100%-1rem)] my-4 py-2 rounded-lg cursor-pointer shadow-md ml-2 hover:bg-slate-200">
      <div className="flex items-center px-2 gap-4">
        <div className="relative h-10 w-10">
          <Image src={groupPhoto} fill className="rounded-full" />
        </div>
        <div>
          <p className="text-sm">{groupName}</p>

          <p className="text-sm flex gap-2">
            {!lastMessage && (
              <span className="text-sm font-bold">Started a chat</span>
            )}
            {lastMessage && (
              <p
                className={`text-sm ${
                  seen ? "text-slate-500" : "font-semibold"
                } max-w-20 w-fit h-5 text-ellipsis overflow-hidden`}
              >
                {lastMessage?.text}
              </p>
            )}
            <span
              className={`text-sm ${seen ? "text-slate-500" : "font-semibold"}`}
            >
              •{" "}
              {!lastMessage
                ? format(new Date(chat?.createdAt), "p")
                : format(new Date(chat?.lastMessageAt), "p")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
