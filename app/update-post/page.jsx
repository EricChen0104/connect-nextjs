"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";

const EditPost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    description: "",
    tag: "",
  });

  useEffect(() => {
    const getPostDetails = async () => {
      const response = await fetch(`/api/post/${postId}`);
      const data = await response.json();

      setPost({
        description: data.post,
        tag: data.tag,
      });
    };

    if (postId) getPostDetails();
  }, [postId]);

  const updatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!postId) return alert("Post ID not found");

    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
          post: post.description,
          tag: post.tag,
        }),
      });
      if (response.ok) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePost}
      />
    </div>
  );
};

export default EditPost;
