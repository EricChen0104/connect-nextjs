"use client";

import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

const CommentCard = (post) => {
  console.log(post);
  const router = useRouter();
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState(post.post.comment);

  const textAreaRef = useRef(null);
  const editAreaRef = useRef(null);
  let [readmore, setReadMore] = useState(false);
  let [expand, setExpand] = useState(5);
  let [readmoreT, setReadMoreT] = useState("more");

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
  }, [commentText]); // Run only on initial render

  const handleExpand = () => {
    if (expand === 100) {
      setExpand(5);
      setReadMoreT("more");
    } else {
      setExpand(100);
      setReadMoreT("less");
    }
  };

  const [editTextArea, setEditTextarea] = useState(false);
  const [editComment, setEditComment] = useState(post.post.comment);
  const [edited, setEdited] = useState(post.post.edited);

  const handleEdit = () => {
    setEditTextarea(!editTextArea);
  };
  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(`/api/comment/${post.post._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comment: editComment,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setCommentText(data.comment);
        setEditTextarea(!editTextArea);
        setEdited(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [deleted, setDeleted] = useState(false);
  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Do you sure you want to delete this comment?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/comment/${post.post._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setDeleted(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleToViewProfile = () => {
    if (session?.user.id === post.post.userId._id) router.push("/profile");
    else router.push(`/other-profile?id=${post.post.userId._id}`);
  };
  let isLike = false;
  if (session) {
    isLike = post.post.likesUser.indexOf(session?.user.id) !== -1;
    console.log(isLike);
  }
  const [liked, setLiked] = useState(isLike);
  let [likesNum, setLikesNum] = useState(post.post.likes);
  const handleLike = async () => {
    if (session) {
      try {
        console.log(post.post._id);
        const response = await fetch("/api/comment/like", {
          method: "POST",
          body: JSON.stringify({
            postId: post.post._id,
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
  return (
    <div>
      {deleted && (
        <div className="bg-gray-700 flex gap-2 py-4">
          <Image
            src="/assets/icons/X icon.png"
            width={20}
            height={18}
            className="ml-3"
          />
          <p className=" text-white text-sm">The comment had been deleted.</p>
        </div>
      )}
      {!deleted && (
        <div>
          <div className="flex items-center gap-2 w-full mt-2 cursor-pointer">
            <Image
              src={post.post.userId.image}
              width={20}
              height={20}
              className="rounded-full"
              onClick={handleToViewProfile}
            />
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2 items-center">
                <p className="text-sm" onClick={handleToViewProfile}>
                  {post.post.userId.username}
                </p>
                {edited && <p className="text-xs text-slate-600">Edited</p>}
              </div>
              {session?.user.id === post.post.userId._id && (
                <div className="flex gap-5 mr-2">
                  <button onClick={handleEdit}>
                    <Image
                      src="/assets/icons/Edit icon.png"
                      width={15}
                      height={15}
                    />
                  </button>
                  <button onClick={handleDelete}>
                    <Image
                      src="/assets/icons/Delete icon.png"
                      width={15}
                      height={15}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between my-2 items-start">
            {!editTextArea && (
              <TextareaAutosize
                className="textarea_post text-sm ml-7 overflow-hidden"
                maxRows={expand}
                ref={textAreaRef}
              >
                {commentText}
              </TextareaAutosize>
            )}
            {editTextArea && (
              <div className="w-full">
                <TextareaAutosize
                  type="text"
                  className="resize-none focus:outline-none bg-slate-50 rounded-md ml-7 text-sm outline-lime-950 w-[calc(70%)]"
                  onChange={(e) => setEditComment(e.target.value)}
                  value={editComment}
                ></TextareaAutosize>
                <div className="flex ml-5 gap-2 my-2">
                  <button
                    className="text-sm px-2 py-1 orange_gradient"
                    onClick={() => {
                      setEditTextarea(!editTextArea);
                    }}
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleSubmitEdit}
                    className="text-xs px-3 py-3px border border-slate-600 rounded-full bg-slate-600 text-white transition-all hover:bg-transparent hover:text-black"
                  >
                    done
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 mr-3 justify-start">
              <motion.div
                className="h-3 w-3 relative"
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
              <p className="text-sm">{likesNum}</p>
            </div>
          </div>
          {readmore && (
            <div
              className="text-xs text-slate-500 cursor-pointer ml-7 mb-2"
              onClick={handleExpand}
            >
              ...read {readmoreT}
            </div>
          )}
          <hr />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
