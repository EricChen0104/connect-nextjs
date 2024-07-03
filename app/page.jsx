"use client";

import { useState, useEffect } from "react";

import PostCard from "@components/PostCard";

import LoadingPostBox from "@components/LoadingPostBox";
import Feed from "@components/Feed";

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
const Home = () => {
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
          <PostCardList data={post} handleTagClick={() => {}} />
        )}
      </section>
    </section>
  );
  // return (
  //   <section className="app">
  //     {/* <Feed /> */}

  //   </section>
  // );
};

export default Home;
