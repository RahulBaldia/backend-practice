import React from "react";

const Post = ({ user, post, handleLike, handleUnLike }) => {
  return (
    <div className="bg-white shadow-md rounded-lg max-w-xl mx-auto mb-6">

      {/* User */}
      <div className="flex items-center gap-3 p-3 border-b">

        <img
          src={user.profileImage}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />

        <p className="font-semibold">{user.username}</p>

      </div>

      {/* Image */}
      <img
        src={post.imgUrl}
        alt=""
        className="w-full max-h-[500px] object-cover"
      />

      {/* Icons */}
      <div className="flex justify-between p-3">

        <div className="flex gap-4">

          <button
            onClick={() =>
              post.isLiked
                ? handleUnLike(post._id)
                : handleLike(post._id)
            }
            className="text-xl"
          >
            ❤️
          </button>

          <button className="text-xl">
            💬
          </button>

          <button className="text-xl">
            📤
          </button>

        </div>

        <button className="text-xl">
          🔖
        </button>

      </div>

      {/* Caption */}
      <div className="px-3 pb-3">

        <p>
          <span className="font-semibold mr-2">
            {user.username}
          </span>
          {post.caption}
        </p>

      </div>

    </div>
  );
};

export default Post;