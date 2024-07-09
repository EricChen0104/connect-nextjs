"use client";

// import { useState, useEffect } from "react";

// import PostCard from "@components/PostCard";

// import LoadingPostBox from "@components/LoadingPostBox";
// import Feed from "@components/Feed";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const FeedClient = dynamic(() => import("@components/Feed"), {
  ssr: false,
});
const Home = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push("/feed-test");
      }}
      className="app"
    >
      to Feed
    </div>
    // <Suspense fallback={<div>Loading...</div>}>
    //   <FeedClient />
    // </Suspense>
  );
};

export default Home;
