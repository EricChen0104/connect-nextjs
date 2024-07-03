import { Suspense } from "react";
import dynamic from "next/dynamic";

const ChatDetailClient = dynamic(() => import("./ChatDetailClient"), {
  ssr: false,
});

const ChatDetail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatDetailClient />
    </Suspense>
  );
};

export default ChatDetail;
