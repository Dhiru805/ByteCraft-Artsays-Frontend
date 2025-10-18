import React, { useState, useEffect } from "react";
import getAPI from "../../../../src/api/getAPI";
import { toast } from 'react-toastify';
import postAPI from "../../../../src/api/postAPI";
import "../Sidebar/Side-post-sugg.css";
import "../Create-post/Post.css";


const Suggestion = () => {
  const [users, setUsers] = useState([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [mainCategories, setMainCategories] = useState([]);

  const adImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oql1QTjEkuSfZYyT2Rxsxb_CNSSjwUeyXg&s",
    "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?cs=srgb&dl=pexels-steve-1585325.jpg&fm=jpg",
    "https://i0.wp.com/montessorifromtheheart.com/wp-content/uploads/2023/03/Straw-Print-Flower-Painting-Craft.jpg?resize=1080%2C1350&ssl=1",
  ];
const userId = localStorage.getItem("userId");
 const userType= localStorage.getItem("userType");

 // helper: normalize array -> [ids]
const toIdArray = (arr) =>
  Array.isArray(arr)
    ? arr.map(x => (typeof x === "string" ? x : x?._id)).filter(Boolean)
    : [];

// helper: avoid needless setState loops
const sameIds = (a, b) => {
  if (a.length !== b.length) return false;
  const sa = [...a].sort().join(",");
  const sb = [...b].sort().join(",");
  return sa === sb;
};



useEffect(() => {
  if (!userId || !userType) return;

  let cancelled = false;
  (async () => {
    try {
      if (userType === "Seller") {
        const res = await getAPI(`/auth/getsellartwork/${userId}`);
        const ids = toIdArray(res?.data?.artwork?.categoryOfArt);
        if (!cancelled) {
          setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
        }
      } else if (userType === "Artist") {
        const res = await getAPI(`/auth/getartistdetails/${userId}`);
        const ids = toIdArray(res?.data?.artCategories);
        if (!cancelled) {
          setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
        }
      } else if (userType === "Buyer") {
        const res = await getAPI(`/auth/getpreferences/${userId}`);
        const first = res?.data?.data?.preferredArtCategories?.[0]; 
  const ids = first ? toIdArray([first]) : [];
  if (!cancelled) {
    setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
  }
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Failed to load categories");
    }
  })();

  return () => { cancelled = true; };
}, [userId, userType,mainCategories]);

// optional: see the **updated** value
// useEffect(() => {
//   console.log("mainCategories (IDs):", mainCategories);
// }, [mainCategories]);


  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        
        if (!userId) return;

        const res = await getAPI(
          `/api/social-media/suggested-users?userId=${userId}`,
          {
          userId,
          userType,
          mainCategories, // can be array, backend should handle it
        }
        );
        // console.log("Suggested users fetched:", res?.data?.suggestedUsers);
        setUsers(res?.data?.suggestedUsers || []);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);


const handleFollowToggle = async (targetUserId, isFollowing) => {
  try {
    if (isFollowing) {
      
      await postAPI(`/api/social-media/unfollow/${targetUserId}`, { userId }, true, true);
    } else {
      
      await postAPI(`/api/social-media/follow/${targetUserId}`, { userId }, true, true);
    }

    // Update UI after follow/unfollow
    setUsers((prev) =>
      prev.map((user) =>
        user._id === targetUserId ? { ...user, isFollowing: !isFollowing } : user
      )
    );
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
  }
};


  return (
    <div className="suggestion sticky top-0 overflow-y-auto lg:h-[90vh] hidden lg:flex lg:flex-col lg:w-[22%] px-2 mt-4">
      <h3 className="text-lg font-bold my-2 ml-1">Suggested for you</h3>

      {users.map((user, index) => (
        <div
          key={index}
          className="suggested flex flex-col sm:flex-row p-1 items-start sm:items-center justify-between mb-2 gap-2 border-[#6E4E37]"
        >
          {/* Avatar + Name */}
          <div className="flex items-center gap-2">
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}` || "https://via.placeholder.com/150"}
              alt="avatar"
              className="rounded-full w-9 h-9 object-cover"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-800">{user.username}</p>
              <p className="text-[8px] text-gray-600">Suggested for you</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-1 items-center sm:ml-auto">
            <button
              className={`${
                user.isFollowing
                  ? "bg-gray-200 text-black"
                  : "bg-[#6F4D34] text-white"
              } text-[11px] sm:text-sm px-2 py-[5px] rounded-lg border border-gray-300 font-semibold transition-colors duration-300 whitespace-nowrap`}
              onClick={() => handleFollowToggle(user._id, user.isFollowing)}
            >
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
    className="text-[#6E4E37] text-xl leading-none"
    onClick={() =>
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
    }
  >

              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      ))}

      <hr className="h-0.5 bg-gray-700 text-gray-400 border-none mt-2" />

      {/* Ad Section */}
      <div className="mt-3 w-full flex flex-col">
        <div className="flex border-4 border-[#4C3427] bg-[#4C3427] mb-3 rounded-xl overflow-hidden h-40 w-full">
          {adImages.map((src, idx) => {
            const isActive = idx === activeAdIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveAdIndex(idx)}
                className={`cursor-pointer transition-all duration-300 ease-in overflow-hidden ${
                  idx === 0 ? "border-l-0" : "border-l-4 border-l-[#2C211B]"
                }`}
                style={{
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: isActive ? "65%" : "15%",
                  transitionProperty: "flex-grow, flex-basis",
                }}
              >
                <img
                  src={src}
                  alt={`ad-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <p className="w-full text-sm text-[#564138] p-1.5 rounded-xl border-2 border-[#4C3427] font-bold text-[#333]">
          The art drop you didn’t know you needed!!
        </p>

        <button className="text-xs mt-2 sm:text-sm w-full font-semibold text-white bg-[#6F4D34] px-3 sm:px-4 py-2 rounded hover:bg-[#cc3e0e] transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Suggestion;
