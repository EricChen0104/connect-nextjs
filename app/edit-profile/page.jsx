import { Suspense } from "react";
import dynamic from "next/dynamic";

const EditProfileClient = dynamic(() => import("./Edit-profileClient"), {
  ssr: false,
});

const EditProfile = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileClient />
    </Suspense>
  );
};

export default EditProfile;
