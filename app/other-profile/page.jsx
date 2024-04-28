"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { motion } from "framer-motion";

import Profile from "@components/Profile";
import Image from "next/image";

const otherProfile = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [post, setPost] = useState([]);
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();

      const response2 = await fetch(`/api/users/${userId}/edit-profile`, {
        method: "GET",
      });
      const data2 = await response2.json();
      console.log(data2);
      console.log(data);
      setUser(data2);
      setPost(data);
      setIsLoading(false);
    };

    const fetchUser = async () => {};
    fetchPosts();
    fetchUser();
  }, []);

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="app">
      <motion.div
        onClick={handleBack}
        className="cursor-pointer absolute top-20 left-2 md:left-8"
        whileTap={{ x: 10 }}
        transition={{
          duration: 0.25,
        }}
      >
        <Image src="/assets/icons/Back icon.png" width={20} height={20} />
      </motion.div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <Profile
          id={user._id}
          name={user.username}
          image={user.image}
          desc={user.bio}
          data={post}
          handleEdit={() => {}}
          handleDelete={() => {}}
        />
      )}
    </div>
  );
};

export default otherProfile;
