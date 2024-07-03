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
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    console.log("hi");
    const fetchPosts = async () => {
      setLoading(true);
      const response = await fetch("/api/post", { method: "GET" });
      if (response.ok) {
        const data = await response.json();

        setPost(data);
        console.log(data);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refresh]);

  return (
    <section className="app">
      <section className="innerApp">
        <button
          onClick={() => {
            setRefresh(!refresh);
          }}
        >
          refresh
        </button>
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
          <div className="flex flex-col gap-5">
            {post
              .slice()
              .reverse()
              .map((post) => (
                <PostCard
                  key={[post._id]}
                  post={post}
                  handleTagClick={() => {}}
                  postLen={10}
                />
              ))}
          </div>
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
