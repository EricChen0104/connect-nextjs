"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PostCard from "@components/PostCard";

import CommentCard from "@components/CommentCard";

import TextareaAutosize from "react-textarea-autosize";

import { motion } from "framer-motion";

const viewPost = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const textareaRef = useRef(null);
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);
  let [loadComment, setLoadComment] = useState(false);
  const [commentT, setCommentT] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`api/post/${postId}`);
      const data = await response.json();

      setPost(data);
    };

    fetchPosts();
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/comment/new`, {
        method: "POST",
        body: JSON.stringify({
          comment: comment,
          userId: session?.user.id,
          postId: postId,
        }),
      });
      if (response.ok) {
        setLoadComment(!loadComment);
        textareaRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [waitLoad, setWaitLoad] = useState(false);
  useEffect(() => {
    const fetchComment = async () => {
      setWaitLoad(true);
      const response = await fetch(`/api/comment/${postId}`);
      const data = await response.json();

      console.log(data);
      setComments(data);
      setWaitLoad(false);
    };

    fetchComment();
  }, [loadComment]);

  const handleBack = () => {
    router.back();
  };
  return (
    <section className="app">
      <div className="innerApp">
        <div className="mb-2">
          <motion.div
            onClick={handleBack}
            className="cursor-pointer"
            whileTap={{ x: 10 }}
            transition={{
              duration: 0.25,
            }}
          >
            <Image src="/assets/icons/Back icon.png" width={20} height={20} />
          </motion.div>
        </div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && post !== null && (
          <PostCard
            post={post}
            handleTagClick={() => {}}
            loadComment={loadComment}
          />
        )}
        <hr className="mt-8" />
        <h3 className="mt-2 text-lg flex mb-2">
          {comments.length} Comment {comments.length > 1 && <div>s</div>}
        </h3>

        {session && (
          <div>
            <div className="flex items-start gap-2 border border-slate-950 rounded-md justify-between p-2">
              <TextareaAutosize
                type="text"
                className="w-[calc(100%-2.5rem)] bg-transparent focus:outline-none resize-none"
                onChange={(e) => setComment(e.target.value)}
                ref={textareaRef}
              />
              <motion.button
                className="py-1 px-4 bg-slate-600 text-white text-xs rounded-md"
                onClick={handleSubmit}
                whileTap={{ scale: 1.1 }}
                transition={{
                  duration: 0.1,
                  ease: "easeInOut",
                }}
              >
                send
              </motion.button>
            </div>
          </div>
        )}
        {waitLoad === false &&
          comments
            .slice()
            .reverse()
            .map((post) => <CommentCard post={post} />)}
        {waitLoad && <div>Loading...</div>}
      </div>
    </section>
  );
};

export default viewPost;
