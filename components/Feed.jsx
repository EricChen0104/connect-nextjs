"use client";

import { useState, useEffect } from "react";

import PostCard from "./PostCard";

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

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/post");
      const data = await response.json();

      setPost(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="innerApp">
      <PostCardList data={post} handleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
