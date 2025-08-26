import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";

import { LuArchive, LuSquareUserRound } from "react-icons/lu";
import { FaRegBookmark, FaRegHeart, FaRegComment } from "react-icons/fa6";
import { BsGrid3X3 } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiUserPlus } from "react-icons/bi";
import getAPI from "../../../../src/api/getAPI";

const myUser = {
  userId: 21345,
};

const user = {
 
  live: false,
  role: "Artist",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborm.",
  website: "artsays.com",
  profilePicture:
    "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
  posts: 200,
  followers: "12M",
  following: 500,
  postData: [
    {
      id: 1,
      img: "https://cdn.pixabay.com/photo/2016/12/15/20/21/texture-1909992_1280.jpg",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "nice one❤️❤️",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "great💕💕💕",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "nice 😍😍",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "🤞🤞🤞",
        },
      ],
      likes: 125432,
      date: "12 july",
    },
    {
      id: 2,
      img: "https://media.istockphoto.com/id/465579815/photo/romantic-venice.jpg?s=612x612&w=0&k=20&c=-PXOyIin6LQbO6t1LfmkUAtiCSlfqz2SmvusjnGcRNI=",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [],
      likes: 125432,
      date: "12 july",
    },
    {
      id: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMUR12eDixQtBdJRoadxu2Xm3yJ5PVPfE0A&s",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [],
      likes: 125432,
      date: "12 july",
    },
  ],
  saveData: [
    "https://img.freepik.com/free-photo/artist-painting-studio_1303-11413.jpg?semt=ais_hybrid&w=740",
    "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?fm=jpg&q=60&w=3000",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMUR12eDixQtBdJRoadxu2Xm3yJ5PVPfE0A&s",
    "https://thumbs.dreamstime.com/b/paintography-relaxed-african-man-combined-double-exposure-art-techniques-hand-drawn-paintings-profile-portrait-young-111428954.jpg",
  ],
  sellingItem: [
    {
      owner: "Medival Sculptures",
      img: "https://m.media-amazon.com/images/I/61BbMLF9HuL._UF894,1000_QL80_.jpg",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      owner: "Medival Sculptures",
      img: "https://doxzoo.com/blog/wp-content/uploads/2022/12/Untitled-design-2022-12-13T103112.260-1024x576.jpg",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      owner: "Medival Sculptures",
      img: "https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/105654/247110/1682023647171_women_selling_fruits__92049.1686996769.jpg?c=2",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
  ],
};
const suggestedUser = [
  {
    id: 1,
    username: "abd109abd",
    profession: "Art",
    profilePic:
      "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
  },
  {
    id: 2,
    username: "abd109abd",
    profession: "Sculpture Art",
    profilePic:
      "https://media.istockphoto.com/id/1135476604/photo/portrait-of-handsome-young-man-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=AffDDGYHeYW_394lHCjsmbUxhbpxza_ex8A-OsDM2GY=",
  },
  {
    id: 3,
    username: "abd109abd",
    profession: "Interior Design",
    profilePic:
      "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
  },
  {
    id: 4,
    username: "abd109abd",
    profession: "Art Fan Club",
    profilePic:
      "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    id: 5,
    username: "abd109abd",
    profession: "Art",
    profilePic:
      "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
  },
  {
    id: 6,
    username: "abd109abd",
    profession: "Sculpture Art",
    profilePic:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 7,
    username: "abd109abd",
    profession: "Interior Design",
    profilePic:
      "https://media.istockphoto.com/id/1135476604/photo/portrait-of-handsome-young-man-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=AffDDGYHeYW_394lHCjsmbUxhbpxza_ex8A-OsDM2GY=",
  },
  {
    id: 8,
    username: "abd109abd",
    profession: "Art Fan Club",
    profilePic:
      "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
];

const Profile = () => {
const userId = localStorage.getItem("userId");
const [profile, setProfile] = useState(null);
const [isMyProfile, setIsMyProfile] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for userId:", userId);
      const res = await getAPI(`/api/social-media/profile/${userId}`, {}, false, true);
      if (res?.data?.profile) {
        setProfile(res.data.profile);
        setIsMyProfile(userId === String(res?.data?.profile?._id));
         console.log(res.data.profile); 
      }
    } catch (error) {
      console.error(" Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userId) fetchProfile();

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [userId]);



  const [onPosts, setOnPosts] = useState(true);
  const [onSave, setOnSave] = useState(false);
  const [onItem, setOnItem] = useState(false);
  const [onTag, setOnTag] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [follow, setFollow] = useState(false);
  const [suggestionOn, setSuggestionOn] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null); // Replace activePost
  const activePost = activeIndex !== null ? profile?.posts[activeIndex] : null;

  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleMoreClick = (id) => setMenuOpenId(id);
  const handleCancel = () => setMenuOpenId(null);
  const handleFollowToggle = () => {
    setFollow(!follow);
  };

  const menuRef = useRef(null);

  return (
    <div className="lg:w-[56%] w-full lg:mt-8 mt-4">
    
    {activePost && (
        <div className="absolute inset-0 z-50 bg-[#000000] bg-opacity-40 flex justify-center items-center ">
          {/* Close Button Outside */}
          <button
            className="absolute top-20 right-40 text-gray-600 text-3xl font-bold z-50 mt-3 mr-12"
            onClick={() => setActiveIndex(null)}
          >
            <i className="ri-close-line"></i>
          </button>

          {/* Left Arrow */}
          {activeIndex > 0 && (
            <button
              className="absolute bg-gray-600 rounded-full left-10 -translate-x-1/3 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50"
              onClick={() => setActiveIndex(activeIndex - 1)}
            >
              <i class="ri-arrow-left-wide-fill"></i>
            </button>
          )}

          {/* Popup content - your existing layout */}
          <div className="bg-white w-full max-w-6xl h-[74vh] rounded-lg overflow-hidden flex relative">
            {/* Left Image Side */}
            <div className="w-[60%] bg-black flex items-center justify-center">
              <img
                src={activePost.image}
                alt="post"
                className="h-full object-fit w-full"
              />
            </div>

            {/* Right Content Side */}
            <div className="w-[40%] flex flex-col justify-between p-4 bg-white overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <img
                    src={profile?.profilePhoto}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">
                      {profile?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activePost.date}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleMoreClick(activePost.id)}>
                  <i className="ri-more-fill text-lg"></i>
                </button>

                {menuOpenId === activePost.id && (
                  <ul className="absolute flex flex-col rounded-xl items-center justify-between right-1 top-10 w-40 bg-gray-200 border shadow-lg z-10">
                    {[
                      "Pay Tip",
                      "Report",
                      "Unfollow",
                      "Save",
                      "Copy Link",
                      "Embed",
                      "About This Account",
                    ].map((label) => (
                      <React.Fragment key={label}>
                        <li className="w-full px-3 py-2 flex flex-col items-center justify-between text-left cursor-pointer hover:bg-gray-400">
                          {label}
                        </li>
                        <hr className="w-[75%] border-t border-gray-800" />
                      </React.Fragment>
                    ))}
                    <li
                      className="w-full px-3 py-2 flex flex-col items-center justify-between text-left cursor-pointer hover:bg-gray-400 text-red-500"
                      onClick={handleCancel}
                    >
                      Cancel
                    </li>
                  </ul>
                )}
              </div>

              {/* Caption */}
              <p className="my-4 text-[14px] whitespace-pre-line">
                {activePost.bio}
              </p>

              {/* Comments */}
              <div className="flex flex-col gap-3">
                {activePost.comments.map((comment, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <img
                      src={comment.pimg}
                      alt="profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">
                          {comment.username}
                        </span>
                        {comment.verified && (
                          <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                        )}
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex align-center justify-between mt-4">
                <div className="flex align-center justify-between gap-3">
                  <FaRegHeart className="text-xl text-[#000000]" />
                  <FaRegComment className="text-xl text-[#000000]" />
                  <IoPaperPlaneOutline className="text-xl text-[#000000]" />
                </div>
                <div className="flex align-center justify-between gap-3">
                  <Link to={"/social-media/profile/promote-post"}>
                    <button className="px-2 py-1 bg-[#48372D] text-white text-base rounded-lg">
                      Promote post
                    </button>
                  </Link>
                  <FaRegBookmark className="text-lg text-[#000000]" />
                </div>
              </div>

              {/* Like Count */}
              <p className="mt-4 font-semibold text-black">
                {activePost.likes.toLocaleString()} likes
              </p>

              {/* Comment Input */}
              <div className="flex items-center gap-2 border-t mt-4 pt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-grow outline-none text-sm"
                />
                <button className="text-[#6F4D34] font-semibold">Post</button>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          {activeIndex < user.postData.length - 1 && (
            <button
              className="absolute bg-gray-600 p-2 rounded-full right-10 mr-12 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50"
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              ›
            </button>
          )}
        </div>
      )}
      
      <div
      className={` w-full text-[#2d1b0f] flex flex-col gap-8 ${
        activePost ? "bg-black bg-opacity-50" : ""
      }`}
    >
      

      {/* profile header for large screen*/}
      { profile ?
        (<div className="hidden sm:flex items-start gap-6 lg:gap-6 w-full sm:mb-2">
        <div className="relative w-20 h-20 sm:w-[186px] sm:h-[186px] shrink-0">
          {user.live ? (
            <div className="p-[3px] sm:p-[6px] rounded-full bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] w-full h-full">
              <div className="w-full h-full bg-white rounded-full overflow-hidden">
                <img
                  src={profile.profilePhoto}
                  alt={profile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 py-0.5 text-white text-xl sm:text-sm font-semibold bg-gradient-to-r from-[#F1620E] to-[#72320C] rounded-tl-[10px] rounded-tr-[10px]">
                LIVE
              </div>
            </div>
          ) : (
            <img
              src={profile.profilePhoto}
              alt={profile.username}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-[#000000]">
              {profile.username}
            </h1>
            {/* button only enables when this profile is mine */}
            {isMyProfile ? (
              // 👤 Owner sees Edit + Boost Profile
              <div className="flex gap-2 items-center relative" ref={menuRef}>
                <Link to={"/social-media/setting/"}>
                  <button className="hidden sm:flex px-2.5 py-1 bg-[#6F4D34] text-white rounded-md text-base">
                  Edit Profile
                </button>
                </Link>
                <Link to={"/social-media/profile/promote-profile"}>
                  <button className="hidden sm:flex px-2.5 py-1 bg-[#6F4D34] text-white rounded-md text-base">
                    Boost Profile
                  </button>
                </Link>
                <button
                  className="text-xl"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <i className="ri-more-fill"></i>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full flex flex-col items-center mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <button className="bg-gray-100 font-medium w-full px-3 py-1.5 hover:bg-gray-200 rounded-t-lg">
                      Setting and privacy
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 hover:bg-gray-200">
                      Login activity
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 rounded-b-lg hover:bg-gray-200">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 👥 Visitor sees Follow + User icon + Menu
              <div className="flex gap-2 items-center relative" ref={menuRef}>
                <button
                  onClick={handleFollowToggle}
                  className={`px-2 py-1 rounded-md text-[16px] font-bold ${
                    follow
                      ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                      : "bg-[#6F4D34] text-white"
                  }`}
                >
                  {follow ? "Unfollow" : "Follow"}
                </button>

                {follow && (
                  <button className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md text-base">
                    join
                  </button>
                )}
                <button
                  className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md text-base"
                  onClick={() => setSuggestionOn((prev) => !prev)}
                >
                  <BiUserPlus className="text-xl" />
                </button>
                <button
                  className="text-xl"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <i className="ri-more-fill"></i>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full flex flex-col items-center mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <button className="bg-gray-100 font-medium w-full px-3 py-1.5 hover:bg-gray-200 rounded-t-lg">
                      Block
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 hover:bg-gray-200">
                      Report
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 hover:bg-gray-200">
                      Share to
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 rounded-b-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex sm:gap-8 gap-6 text-base">
            <p className="text-[#6E4E37] font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.postCount}
              </span>{" "}
              Posts
            </p>
            <p className="text-[#6E4E37] font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.followersCount}
              </span>{" "}
              Followers
            </p>
            <p className="text-[#6E4E37] font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.followingCount}
              </span>{" "}
              Following
            </p>
          </div>

          {/* Bio */}
          <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
            <h2 className="font-semibold text-lg text-[#000000]">
              {profile.firstName}
            </h2>
            <p className="text-[#6E4E37] font-2xl">{profile.role}</p>
            <p className="text-[#000000] font-medium">{profile.bio}</p>
            <div className="flex items-center gap-2 text-[#3d2b1f]">
              <i className="ri-link-m text-[#000000] font-medium"></i>
{profile.website && (
  <a
    href={
      profile.website?.startsWith("http")
        ? profile.website
        : `https://${profile.website}`
    }
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline text-[#000000] font-medium"
  >
    {profile.website}
  </a>
)}

            </div>
          </div>
        </div>
      </div>):(<p>profile loading</p>)}

      {/* profile header for smaall screen */}
      { profile ?
        (<div className="sm:hidden flex flex-col  gap-3 lg:gap-8 w-full ">
        <div className="flex items-center justify-between">
          <div className="flex justify-between gap-2 items-center">
            {user.live ? (
              <div className="relative w-[90px] h-[90px] p-[4px] bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] rounded-full overflow-visible">
                <img
                  src={profile.profilePhoto}
                  className="w-full h-full rounded-full object-cover"
                  alt="profile-pic"
                />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-white text-[10px] font-semibold bg-gradient-to-r from-[#F1620E] to-[#72320C] rounded-tl-[10px] rounded-tr-[10px]">
                  LIVE
                </div>
              </div>
            ) : (
              <img
                src={profile.profilePhoto}
                className="w-[90px] h-[90px] rounded-full object-cover"
                alt={profile.username}
              />
            )}

            <h1 className="text-3xl font-semibold text-[#000000]">
              {profile.username}
            </h1>
          </div>
          <div className="flex gap-2 items-center relative" ref={menuRef}>
            <button
              className="text-xl"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <i className="ri-more-fill"></i>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full flex flex-col items-center mt-2 w-40 bg-gray-200 rounded-md z-50">
                {myUser.userId === user.userId ? (
                  <>
                    <button className="bg-gray-100 font-medium w-full px-1 py-1 hover:bg-gray-200 rounded-t-lg">
                      Setting and privacy
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                      Login activity
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 rounded-b-lg hover:bg-gray-200">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200 rounded-t-lg">
                      Block
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                      Report
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                      Share to
                    </button>
                    <hr className="w-[80%] border-t border-gray-800" />
                    <button className="bg-gray-100 w-full font-medium px-1 py-1 rounded-b-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          {/* Stats */}
          <div className="flex justify-between sm:gap-8 gap-6 text-base">
            <p className="text-[#6E4E37] text-lg font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.postCount}
              </span>{" "}
              Posts
            </p>
            <p className="text-[#6E4E37] text-lg  font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.followersCount}
              </span>{" "}
              Followers
            </p>
            <p className="text-[#6E4E37] text-lg font-medium">
              <span className="font-bold text-[#48372D]">
                {profile.followingCount}
              </span>{" "}
              Following
            </p>
          </div>

          {/* Bio */}
          <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
            <h2 className="font-semibold text-lg text-[#000000]">
              {profile.firstName}
            </h2>
            <p className="text-[#6E4E37]">{profile.role}</p>
            <p className="text-[#000000] font-medium">{profile.bio}</p>
            <div className="flex items-center gap-2 text-[#3d2b1f]">
              <i className="ri-link-m text-[#000000] font-medium"></i>
             {profile.website && (
  <a
    href={
      profile.website?.startsWith("http")
        ? profile.website
        : `https://${profile.website}`
    }
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline text-[#000000] font-medium"
  >
    {profile.website}
  </a>
)}

            </div>
          </div>
        </div>
      </div>):(<p></p>)}

      {isMyProfile ? (
        <div className="sm:hidden flex justify-between items-center ">
          <Link to={"/social-media/setting/"}>
            <button className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-lg">
            Edit Profile
          </button>
          </Link>
          <Link to={"/social-media/profile/promote-profile"}>
            <button className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-lg">
              Boost Profile
            </button>
          </Link>
        </div>
      ) : (
        <div className="sm:hidden flex gap-6 justify-between items-center ">
          <button
            onClick={handleFollowToggle}
            className={`flw-btn rounded-md text-[16px] font-bold transition ${
              follow
                ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                : "bg-[#6F4D34] text-white"
            }`}
          >
            {follow ? "Unfollow" : "Follow"}
          </button>

          {follow && (
            <button className=" bg-[#6F4D34] text-white px-4 py-2 font-bold rounded-md text-lg">
              Join
            </button>
          )}
          <button
            className="flex items-center gap-2 px-2 py-2 bg-[#6F4D34] text-white rounded-md text-lg"
            onClick={() => setSuggestionOn((prev) => !prev)}
          >
            <BiUserPlus className="text-2xl" />
          </button>
        </div>
      )}

      {/* suggeted for you */}
      {suggestionOn && (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-2 mb-4">
            <p className="text-[18px] text-[#000000] ">Suggested for you</p>
            <button className="text-[18px] text-[#000000] ">See all</button>
          </div>

          {/* Scrollable Suggested Users */}
          <div className="flex gap-4 overflow-x-auto px-2 sm:pb-2">
            {suggestedUser.map((user) => (
              <div
                key={user.id}
                className="sm:min-w-[200px] sm:max-w-[200px] max-w-[100px] min-w-[100px] flex-shrink-0 border rounded-sm p-3  relative"
              >
                <button className="absolute sm:top-2 top-0 right-2 text-xl text-gray-400 hover:text-black">
                  ×
                </button>
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="sm:w-20 sm:h-20 w-[55px] h-[55px] rounded-full object-cover mx-auto mb-2"
                />
                <p className="text-center font-semibold text-[12px] text-[#000000]">
                  {user.username}
                </p>
                <p className="text-center text-[#777777] text-[10px]">
                  {user.profession}
                </p>
                <hr className="sm:mt-4 mt-2 mb-1" />
                <button className="block w-full sm:py-1 text-center text-[16px] font-bold text-[#48372D] ">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider Tabs */}
      <div className="flex justify-around items-center sm:mb-1 mx-1">
        <button
          onClick={() => {
            setOnPosts(true);
            setOnSave(false);
            setOnItem(false);
            setOnTag(false);
          }}
          className={`${
            onPosts ? "bg-[#48372D] text-white rounded-full py-1 px-5 " : ""
          } p-3`}
        >
          <BsGrid3X3 className="text-2xl" />
        </button>
        <button
          onClick={() => {
            setOnPosts(false);
            setOnSave(true);
            setOnItem(false);
            setOnTag(false);
          }}
          className={`${
            onSave ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
          } p-3`}
        >
          <FaRegBookmark className="text-2xl" />
        </button>
        <button
          onClick={() => {
            setOnPosts(false);
            setOnSave(false);
            setOnItem(true);
            setOnTag(false);
          }}
          className={`${
            onItem ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
          } p-3`}
        >
          <LuArchive className="text-2xl" />
        </button>
        <button
          onClick={() => {
            setOnPosts(false);
            setOnSave(false);
            setOnItem(false);
            setOnTag(true);
          }}
          className={`${
            onTag ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
          } p-3`}
        >
          <LuSquareUserRound className="text-2xl" />
        </button>
      </div>

{/* Posts */}
{onPosts && (
  <div className="grid grid-cols-3 sm:gap-4 gap-1 w-full">
    {profile?.posts?.slice().reverse().map((post, index) => (
      <div
        key={post._id}
        onClick={() => {
          setActiveIndex(index); // index of the post
        }}
        className="relative cursor-pointer"
      >
        {/* Show first image as cover */}
        <img
          src={post?.image?.[0]}
          alt={`post-${post._id}`}
          className="sm:h-[240px] sm:w-full h-[120px] object-cover rounded-md"
        />

        {/* If post has multiple images, show carousel icon (right) */}
        {post.image?.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
            <i className="ri-checkbox-multiple-blank-line text-white  text-lg"></i>
          </div>
        )}

        {/* If post is a multiple/collab post, show "multiple post" icon (left) */}
        {post.isMultiple && ( // 👈 add a field in your schema for grouped/collab posts
          <div className="absolute top-2 left-2 bg-black/60 p-1 rounded">
            <i className="ri-checkbox-multiple-blank-line text-white text-lg"></i>
          </div>
        )}
      </div>
    ))}
  </div>
)}


      {/* Saved */}
      {onSave && (
        <div className="grid grid-cols-3 gap-1 sm:gap-4  w-full">
          {user.saveData.map((post, index) => (
            <img
              key={index}
              src={post}
              alt={`post-${index}`}
              className="h-[120px] sm:h-[240px] sm:w-full object-cover rounded-md"
            />
          ))}
        </div>
      )}
      {/* Selling Items */}
      {/* Selling Items */}
      {onItem && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {user.sellingItem.map((item, index) => (
            <div
              key={index}
              className="bg-[#FEE2CC] rounded-lg overflow-hidden text-white flex flex-col shadow-lg"
            >
              <div className="h-[200px] bg-[#FEE2CC]">
                <img
                  src={item.img}
                  alt={item.owner}
                  className="h-full w-full"
                />
              </div>
              <div className=" selling-div flex flex-col justify-between min-h-[140px] bg-[#48372D]  p-4">
                <div className="flex flex-col justify-between">
                  <h3 className="font-semibold text-lg">Medieval Sculpture</h3>
                  <p className="text-sm text-[#B7B7B7] mt-1">
                    Own the Exclusive art
                  </p>
                  <p className="text-[10px] text-[#B7B7B7] ">{item.about}</p>
                </div>
                <hr className="mt-4 w-[100%] mx-auto text-[#A8A8A8]" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-base font-semibold text-white">
                    ₹ 500.00
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-sm bg-white text-[#6E4E37] sm:px-2 sm:py-[2px] p-0 rounded-md">
                      Buy{" "}
                      <i className="ri-shopping-cart-fill text-sm sm:text-lg"></i>
                    </button>
                    <button className="bg-[#2B211B] rounded-full">
                      {" "}
                      <i className="ri-bookmark-line text-lg text-white p-1"></i>
                    </button>
                    <button className="bg-[#2B211B] rounded-full">
                      <i className="ri-bookmark-line text-lg text-white p-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tagged */}
      {onTag && (
        <div className="text-center text-gray-500">No tagged posts</div>
      )}
    </div>
    
    </div>
    
  );
};

export default Profile;
