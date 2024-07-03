"use client";

import { useState, useEffect } from "react";

import PostCard from "./PostCard";

import LoadingPostBox from "./LoadingPostBox";

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
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/post");
      if (response.ok) {
        const data = await response.json();

        setPost(data);
        console.log(data);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
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
        <PostCardList data={post} handleTagClick={() => {}} />
      )}
    </section>
  );
};

export default Feed;
