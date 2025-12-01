import React from "react";
import { useEffect, useState } from "react";
import getAPI from "../../api/getAPI";
import Sidebar from "../../Component/SocialMedia/Sidebar/Sidebar";
import Suggestion from "../../Component/SocialMedia/Suggestion/Suggestion";
import { Link } from "react-router-dom";

const Saved = () => {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await getAPI(
          `/api/social-media/profile/${userId}`,
          {},
          false,
          true
        );
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setSaved(res.data.profile.saved);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="flex flex-col">
      <main className="flex l flex-row lg:gap-4 lg:w-[96%] mx-auto">
        <Sidebar />
        {loading && <p>...loading</p>}
        
        <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full relative">
          {saved
            ?.slice()
            .reverse()
            .map((post, index) => (
              <div key={post._id} className="relative">
                <Link to={`/social-media/single-post/${post._id}`}>
                  <img
                    
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.images[0]}`}
                    alt={`post-${index}`}
                    className="h-[120px] sm:h-[240px] sm:w-full object-cover rounded-md cursor-pointer"
                  />
                </Link>
                {/* Multi-image icon */}
                {post.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
                    <i className="ri-checkbox-multiple-blank-line text-gray-100 text-lg"></i>
                  </div>
                )}
              </div>
            ))}
        </div>
        <Suggestion />
      </main>
    </div>
  );
};

export default Saved;
