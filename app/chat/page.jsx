"use client";

import React, { useEffect } from "react";

import ChatList from "@components/ChatList";
import Image from "next/image";

import { useRouter } from "next/navigation";

const Chat = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="app">
      <div className="innerApp">
        <div className="relative h-5 w-5 cursor-pointer" onClick={handleBack}>
          <Image src="/assets/icons/Back icon.png" fill />
        </div>
        <h3>Contact</h3>
        <ChatList />
      </div>
    </section>
  );
};

export default Chat;
