"use client";

import Image from "next/image";
import PostCard from "./PostCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import TextareaAutosize from "react-textarea-autosize";

const Profile = ({ id, name, image, desc, data, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) router.push("/");
  const handleToEdit = () => {
    router.push(`/edit-profile?id=${session?.user.id}`);
  };

  const textAreaRef = useRef(null);
  let [readmore, setReadMore] = useState(false);
  const [bioLen, setBioLen] = useState(10);
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

  return (
    <section className="h-[calc(100%-8rem)] absolute top-28 w-[calc(100%-20px)] left-2.5 flex flex-col gap-8 md:w-100 md:-translate-x-1/2 md:left-1/2">
      <div className="flex items-center gap-4">
        <Image src={image} width={45} height={45} className="rounded-full" />
        <p className="text-lg font-medium">{name}</p>
      </div>
      <TextareaAutosize
        value={desc}
        className="textarea_post"
        // maxRows={default}
        ref={textAreaRef}
      />
      {readmore && (
        <div
          className="text-xs text-slate-500 cursor-pointer"
          onClick={() => {
            setBioLen(false);
          }}
        >
          ...readmore
        </div>
      )}
      <div className="flex justify-between items-center">
        {session?.user.id === id && (
          <button
            onClick={handleToEdit}
            className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs"
          >
            Edit
          </button>
        )}
        {session?.user.id !== id && (
          <button className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs">
            Follow
          </button>
        )}
        <button className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs">
          Send message
        </button>
      </div>
      <hr />
      <div className="flex flex-col gap-5 h-[calc(100%-17rem)] overflow-auto">
        {data
          .slice()
          .reverse()
          .map((post) => (
            <PostCard
              key={[post._id]}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
              postLen={10}
            />
          ))}
      </div>
    </section>
  );
};

export default Profile;
