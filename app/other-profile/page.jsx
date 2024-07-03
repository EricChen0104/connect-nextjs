import { Suspense } from "react";
import dynamic from "next/dynamic";

const OtherProfileClient = dynamic(() => import("./OtherProfileClient"), {
  ssr: false,
});

const otherProfile = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherProfileClient />
    </Suspense>
  );
};

export default otherProfile;
