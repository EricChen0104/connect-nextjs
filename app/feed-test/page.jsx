import { Suspense } from "react";
import dynamic from "next/dynamic";

const FeedTestClient = dynamic(() => import("./FeedTest"), {
  ssr: false,
});

const FeedTest = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedTestClient />
    </Suspense>
  );
};

export default FeedTest;
