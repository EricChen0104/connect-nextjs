"use client";

import Image from "next/image";
import PostCard from "./PostCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Profile = ({ id, name, image, desc, data, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const router = useRouter();
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

  const [btnText, setBtnText] = useState("Follow");
  let isFollow = false;
  // const [follow, setFollow] = useState(isFollow);
  const [follow, setFollow] = useState(false);

  const checkUser = async () => {
    try {
      const response = await fetch(
        `/api/users/follow/${session?.user.id}/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg);
        if (data.msg === "you haven't followed yet") {
          setFollow(false);
        } else setFollow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const handleFollow = async () => {
    if (session?.user) {
      try {
        const response = await fetch(
          `/api/users/follow/${session?.user.id}/${id}`,
          {
            method: "POST",
            body: JSON.stringify({
              userId: session?.user.id,
              followerId: id,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.msg === "User cancel followed successfully.") {
            setFollow(false);
          } else setFollow(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMessage = async () => {
    if (session?.user) {
      try {
        const response = await fetch(`/api/chat/new`, {
          method: "POST",
          body: JSON.stringify({
            member: id,
            name: name,
            userId: session?.user.id,
            image,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          router.push(`/chat/chatDetail?id=${data?._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className="h-[calc(100%-10rem)] md:h-[calc(100%-8rem)] absolute top-28 w-[calc(100%-20px)] left-2.5 flex flex-col gap-8 md:w-100 md:-translate-x-1/2 md:left-1/2">
      <div className="flex items-center gap-4">
        <Image src={image} width={45} height={45} className="rounded-full" />
        <p className="text-lg font-medium">{name}</p>
      </div>
      {/* <pre
        value={desc}
        
        // maxRows={default}
        
      > */}
      <pre
        ref={textAreaRef}
        className={`text-sm ${bioLen ? "max-h-20 overflow-hidden" : ""} `}
      >
        {desc}
      </pre>
      {readmore && (
        <div
          className="text-xs text-slate-500 cursor-pointer"
          onClick={() => {
            setBioLen(!bioLen);
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
          <div>
            {follow ? (
              <button
                className="px-5 py-2 bg-transparent text-slate-800 border border-slate-800 rounded-md text-xs"
                onClick={handleFollow}
              >
                Following
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs"
              >
                {btnText}
              </button>
            )}
          </div>
        )}
        {session?.user.id === id ? (
          <button className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs">
            share your profile
          </button>
        ) : (
          <button
            onClick={handleMessage}
            className="px-5 py-2 bg-slate-800 text-white border-0 rounded-md text-xs"
          >
            Send message
          </button>
        )}
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
