import React from "react";

import ChatList from "@components/ChatList";

const Chat = () => {
  return (
    <section className="app">
      <div className="innerApp">
        <h3>Contact</h3>
        <ChatList />
      </div>
    </section>
  );
};

export default Chat;
