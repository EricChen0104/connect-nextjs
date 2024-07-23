import { Suspense } from "react";
import dynamic from "next/dynamic";

const FeedTestClient = dynamic(() => import("./FeedTest"), {
  ssr: false,
});

const FeedTest = () => {
  return <FeedTestClient />;
};

export default FeedTest;
