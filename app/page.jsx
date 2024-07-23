"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const FeedClient = dynamic(() => import("@components/Feed"), {
  ssr: true,
  suspense: true,
});
const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedClient />
    </Suspense>
  );
};

export default Home;
