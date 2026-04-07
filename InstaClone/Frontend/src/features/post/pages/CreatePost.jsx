import React, { useState, useRef } from "react";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

  const [caption, setCaption] = useState("");
  const postImageInputFieldRef = useRef(null);

  const navigate = useNavigate();

  const { loading, handleCreatePost } = usePost();

  async function handleSubmit(e) {
    e.preventDefault();

    const file = postImageInputFieldRef.current.files[0];

    if (!file) return;

    await handleCreatePost(file, caption);

    navigate("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">
          Creating post...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Create Post
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            ref={postImageInputFieldRef}
            type="file"
            className="border p-2 rounded-md"
          />

          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            placeholder="Enter caption"
            className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <button
            className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Create Post
          </button>

        </form>

      </div>

    </main>
  );
};

export default CreatePost;