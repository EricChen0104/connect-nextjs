import React, { useEffect } from "react";

import Image from "next/image";
import { format } from "date-fns";

const MessageBox = ({
  message,
  currentUser,
  hideAvatar,
  setReplyTextId,
  setReplyText,
  setToggle,
  isToggle,
  setTogglePosition,
  setContextReply,
  setMessageId,
  setToggleUser,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (e.type === "contextmenu") {
      // alert("right click");
      if (!isToggle) {
        setTogglePosition([e.pageX, e.pageY]);
        setContextReply(message.text);
        setMessageId(message._id);
        if (message.sender._id === currentUser.id) setToggleUser(true);
        else setToggleUser(false);
        setToggle(true);
      } else setToggle(false);
    }
  };

  return message?.sender?._id !== currentUser.id ? (
    <div
      className={`flex gap-2 ${hideAvatar ? "" : "mt-4"}`}
      onDoubleClick={() => {
        setReplyTextId(message._id);
        setReplyText(message.text);
      }}
    >
      <div className={`relative h-7 w-7 ${hideAvatar ? "invisible" : ""}`}>
        <Image src={message.sender.image} fill className="rounded-full" />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex flex-col items-start gap-1">
          {message.edited && <p className="text-xs blue_gradient">edited</p>}
          {message?.replyText && (
            <div className="flex flex-col items-start gap-1 opacity-50 cursor-pointer">
              <p className="text-xs text-black">reply</p>
              <div className="border-l-2 pl-1 border-slate-500">
                <div className="text-sm py-2 bg-blue-200 px-3 rounded-2xl rounded-bl-md">
                  {message?.replyText}
                </div>
              </div>
            </div>
          )}
          <div
            className={`bg-transparent hover:bg-slate-100 border-slate-500 border cursor-pointer px-3 py-1 max-w-56 w-fit rounded-xl transition-all`}
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <pre className="text-black text-sm bg-transparent whitespace-pre-wrap break-words">
              {message?.text}
            </pre>
          </div>
        </div>

        <div className="flex gap-1 flex-col text-xs text-slate-500">
          <p>{format(new Date(message?.createdAt), "p")}</p>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`flex justify-end ${hideAvatar ? "" : "mt-4"}`}
      onDoubleClick={() => {
        setReplyTextId(message._id);
        setReplyText(message.text);
      }}
      id={`${message?._id}`}
    >
      <div className="flex flex-col items-end gap-1">
        {message.edited && <p className="text-xs blue_gradient">edited</p>}
        {message?.replyText && (
          <div className="flex flex-col items-end gap-1 opacity-50 cursor-pointer">
            <p className="text-xs text-black">reply</p>
            <div className="border-r-2 pr-1 border-slate-500">
              <div className="text-sm py-2 bg-blue-200 px-3 rounded-2xl rounded-br-md">
                {message?.replyText}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <p className="text-xs text-slate-500">
            {format(new Date(message?.createdAt), "p")}
          </p>
          <div
            className={`bg-slate-100 hover:bg-slate-200 cursor-pointer px-3 py-1 border border-black rounded-xl max-w-56 w-fit transition-all`}
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <pre className="text-black text-sm bg-transparent whitespace-pre-wrap break-words">
              {message?.text}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
