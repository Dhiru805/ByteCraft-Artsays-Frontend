import React, { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";

const Explorebar = () => {
  const userId = localStorage.getItem("userId");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [posts, setPosts] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAPI(
          `/api/social-media/explore?userId=${userId}`,
          true
        );
        setPosts(res.data.posts || []);
        console.log("Fetched posts:", res.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:w-[56%] w-full max-w-6xl mx-auto flex flex-col lg:mt-6 lg:px-4 pt-2">
      {/* Masonry Grid */}
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        {posts.map((art) => (
          <div
            key={art._id}
            className="relative break-inside-avoid rounded-xl overflow-hidden shadow"
          >
            {/* Post Image */}
            <img
              src={
                art.images && art.images.length > 0
                  ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${art.images[0]}`
                  : "https://via.placeholder.com/300"
              }
              alt="Art"
              className="w-full object-cover rounded-t-xl"
            />

            {/* Overlay Header */}
            <div className="absolute top-0 left-0 w-full bg-[#000000BF] bg-opacity-50 text-white flex justify-between items-center px-2 py-2.5 text-xs">
              <span className="font-medium sm:text-lg text-[15px]">{art.user.username}</span>
              <div className="flex gap-2 items-center text-lg">
                <i className="ri-shopping-cart-2-fill text-[#FB5934]"></i>
                <i
                  className="ri-more-fill cursor-pointer"
                  onClick={() =>
                    setActiveMenuId((prev) =>
                      prev === art._id ? null : art._id
                    )
                  }
                ></i>
              </div>
            </div>

            {/* Dropdown Menu */}
            {activeMenuId === art._id && (
              <div
                ref={menuRef}
                className="absolute top-2 right-1 flex flex-col items-center z-10 lg:bg-white bg-gray-100 text-black text-sm rounded-xl shadow-lg w-32"
              >
                <button className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400 rounded-t-lg">
                  Report
                </button>
                <hr className="w-full border-t border-gray-800" />
                <button className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400">
                  Save
                </button>
                <hr className="w-full border-t border-gray-800" />
                <button className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400">
                  Go to post
                </button>
                <hr className="w-full border-t border-gray-800" />
                <button className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400 rounded-b-lg">
                  Share
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorebar;
