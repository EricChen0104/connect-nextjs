"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const EditProfile = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("update");
  const userId = searchParams.get("id");
  const [bio, setBio] = useState({
    bio: "",
  });

  useEffect(() => {
    const getPostDetails = async () => {
      const response = await fetch(`/api/users/${userId}/edit-profile`);
      const data = await response.json();

      setBio({
        bio: data.bio,
      });
    };

    if (userId) getPostDetails();
  }, [userId]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/users/${userId}/edit-profile`, {
        method: "PATCH",
        body: JSON.stringify({
          bio: bio.bio,
        }),
      });
      if (response.ok) {
        session.user.bio = bio.bio;
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  console.log(session.user);
  return (
    <section className="app">
      <div className="bg-white absolute w-[calc(100%-20px)] md:w-100 md:-translate-x-1/2 md:left-1/2 bottom-2.5 h-[calc(100%-90px)] left-2.5 shadow-2xl rounded-xl">
        <h1 className="text-xl font-bold p-4">
          <span className="blue_gradient">Edit Profile</span>
        </h1>

        <form className="flex flex-col w-full gap-4" onSubmit={updateProfile}>
          <div className="flex justify-between items-center w-[calc(100%-40px)] ml-4 mb-3">
            <Link href="/profile">
              <Image src="/assets/icons/Back icon.png" width={25} height={25} />
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-400 px-4 py-1 rounded-lg text-neutral-50 text-sm shadow-md border-y border-x border-red-400 hover:bg-white hover:text-black transition-all"
            >
              {submitting ? `${type}...` : type}
            </button>
          </div>
          <label className="flex flex-col gap-4 px-2 border-t border-b">
            <span className="font-semibold pt-4 pl-2">Your bio</span>
            <textarea
              value={bio.bio}
              onChange={(e) => setBio({ ...bio, bio: e.target.value })}
              placeholder="Write something..."
              className="textarea mb-4 p-2 focus:outline-none"
            />
          </label>
        </form>
      </div>
    </section>
  );
};

export default EditProfile;
