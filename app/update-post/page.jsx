import { Suspense } from "react";
import dynamic from "next/dynamic";

const EditProfileClient = dynamic(() => import("./EditPostClient"), {
  ssr: false,
});

const EditPost = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileClient />
    </Suspense>
  );
};

export default EditPost;
