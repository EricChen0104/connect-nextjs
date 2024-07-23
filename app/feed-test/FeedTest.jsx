"use client";

import React, { useState, useEffect, startTransition } from "react";

import PostCard from "@components/PostCard";

import LoadingPostBox from "@components/LoadingPostBox";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const PostCardList = ({ data, handleTagClick }) => {
  return (
    <div className="flex flex-col gap-5">
      {data
        .slice()
        .reverse()
        .map((post) => (
          <PostCard
            key={[post._id]}
            post={post}
            handleTagClick={handleTagClick}
            postLen={10}
          />
        ))}
    </div>
  );
};

const Feed = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isloadComment, setIsLoadComment] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await fetch("/api/post");
      if (response.ok) {
        const data = await response.json();
        startTransition(() => {
          setPosts(data);
        });

        console.log(data);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="app">
      <section className="innerApp">
        {loading ? (
          <div className="flex flex-col gap-4">
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
            <LoadingPostBox />
          </div>
        ) : (
          <PostCardList data={posts} handleTagClick={() => {}} />
        )}
      </section>
    </section>
  );
};

export default Feed;
