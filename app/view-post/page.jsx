import { Suspense } from "react";
import dynamic from "next/dynamic";

const ViewPostClient = dynamic(() => import("./ViewPostClient"), {
  ssr: false,
});

const viewPost = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewPostClient />
    </Suspense>
  );
};

export default viewPost;
