import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import postAPI from "../../../../src/api/postAPI"; // adjust path

const ProfileSuggestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { users: initialUsers = [], viewedUserId } = location.state || {};
  const [users, setUsers] = useState(initialUsers);

  // ✅ your own userId from localStorage
  const userId = localStorage.getItem("userId");

  // ✅ Toggle Follow/Unfollow
  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId }, // 👈 send your own userId
          true,
          true
        );
      } else {
        await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId }, // 👈 send your own userId
          true,
          true
        );
      }

      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  // ✅ Remove user from list
  const handleRemoveUser = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  // ✅ Go back and send updated list
  const handleBack = () => {
    navigate(-1, { state: { updatedUsers: users } });
  };

  return (
    <div className="mx-auto w-[78%]">
      {/* Back Button */}
      <div className="flex items-center gap-2"><button onClick={handleBack} className="text-xl font-bold mb-4">
        ← 
      </button>

      <h2 className="text-xl font-bold mb-4">Suggested Users</h2></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-col items-center justify-between border rounded-lg p-4 relative"
          >
            {/* Remove button (X) */}
            <button
              onClick={() => handleRemoveUser(user._id)}
              className="absolute top-2 right-2 text-xl text-gray-400 hover:text-black"
            >
              ×
            </button>

            {/* Avatar */}
            <img
              src={
                user?.profilePhoto
                  ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
              }
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />

            {/* Username */}
            <p className="text-center font-semibold text-sm">{user.username}</p>
            <p className="text-center text-gray-600 text-xs">{user.role}</p>

            {/* ✅ Follow / Unfollow Button */}
            <button
              className={`mt-2 px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                user.isFollowing
                  ? "bg-gray-200 text-black"
                  : "bg-[#6F4D34] text-white"
              }`}
              onClick={() => handleFollowToggle(user._id, user.isFollowing)}
            >
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSuggestion;
