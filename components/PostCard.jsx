"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";

const PostCard = ({
  post,
  handleTagClick,
  handleEdit,
  handleDelete,
  postLen,
  loadComment,
}) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  let isLike = false;
  if (session) {
    isLike = post.likesUser.indexOf(session?.user.id) !== -1;
    console.log(isLike);
  }
  const [liked, setLiked] = useState(isLike);
  let [likesNum, setLikesNum] = useState(post.likes);

  const handleToViewPost = () => {
    router.push(`/view-post?id=${post._id}`);
  };

  const handleLike = async () => {
    if (session) {
      try {
        console.log(post._id);
        const response = await fetch("/api/post/like", {
          method: "POST",
          body: JSON.stringify({
            postId: post._id,
            userId: session?.user.id,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLikesNum(data.post.likes);
          if (data.msg === "Post unliked successfully.") setLiked(false);
          else setLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const textAreaRef = useRef(null);
  let [readmore, setReadMore] = useState(false);
  const checkOverflow = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      const isOverflowing = textarea.scrollHeight > textarea.clientHeight;
      if (isOverflowing) {
        setReadMore(true);
      }
    }
  };

  useEffect(() => {
    checkOverflow();
  }, []); // Run only on initial render

  const handleToViewProfile = () => {
    console.log(post);
    if (session?.user.id === post.creator._id) router.push("/profile");
    else router.push(`/other-profile?id=${post.creator._id}`);
  };

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComment = async () => {
      const response = await fetch(`/api/comment/${post._id}`);
      const data = await response.json();

      console.log(data);
      setComments(data);
    };

    fetchComment();
  }, [loadComment]);

  return (
    <div className="border border-black flex flex-col rounded-md shadow-lg bg-transparent">
      <div
        className="flex gap-2 w-full p-2 items-center justify-start border-b border-black rounded-md shadow-md cursor-pointer"
        onClick={handleToViewProfile}
      >
        <Image
          src={post.creator.image}
          width={25}
          height={25}
          className="rounded-full"
        />
        <p>{post.creator.username}</p>
      </div>

      <div onClick={handleToViewPost} className="flex flex-col gap-2 m-2 my-4">
        <TextareaAutosize
          value={post.post}
          className="textarea_post"
          maxRows={postLen}
          ref={textAreaRef}
        />
        {readmore ? (
          <p
            className="text-xs text-slate-500 cursor-pointer underline"
            onClick={handleToViewPost}
          >
            read more
          </p>
        ) : (
          <p></p>
        )}
        <div className="text-xs">{post.tag}</div>
      </div>

      <div className="">
        <div className="flex justify-between items-center">
          <div className="m-2 flex gap-5">
            <div className="flex gap-1 items-center">
              <motion.div
                className="h-4 w-4 relative"
                whileTap={{ scale: 1.9 }}
                transition={{
                  duration: 0.25,
                }}
                onClick={handleLike}
              >
                <Image
                  src={
                    liked
                      ? "/assets/icons/liked.png"
                      : "/assets/icons/Like-icon.png"
                  }
                  layout="fill"
                  className="cursor-pointer"
                />
              </motion.div>

              <p className="text-xs">{likesNum}</p>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={handleToViewPost}
            >
              <Image
                src="/assets/icons/Comment-icon.png"
                width={18}
                height={18}
              />
              <p className="text-xs">{comments.length}</p>
            </div>
          </div>
          {session?.user.id === post.creator._id && pathName === "/profile" && (
            <div className="flex gap-5 mr-2">
              <button onClick={handleEdit}>
                <Image
                  src="/assets/icons/Edit icon.png"
                  width={20}
                  height={20}
                />
              </button>
              <button onClick={handleDelete}>
                <Image
                  src="/assets/icons/Delete icon.png"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
