"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState([]);

  const handleEdit = (post) => {
    router.push(`/update-post?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(post._id);

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/post/${post._id.toString()}`, {
          method: "DELETE",
        });
        const data = await response.json();
        // const filteredPosts = post.filter((p) => p._id !== post._id);
        console.log(data.post);
        setPost(data.post);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setPost(data);
    };

    if (session?.user.id) fetchPosts();
  }, []);

  console.log(session?.user);
  return (
    <div className="app">
      <Profile
        id={session?.user.id}
        name={session?.user.name}
        image={session?.user.image}
        desc={session?.user.bio}
        data={post}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MyProfile;
