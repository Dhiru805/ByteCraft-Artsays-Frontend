import React,{ useState,useEffect, useRef  }  from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaChevronRight, FaChevronUp } from "react-icons/fa";


const user = {
  following:1234,
}
const topChat = [
  {
    id: 1,
    username: "sunnyvibes101",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    comment: "Omg finally caught you liveee 👀🔥",
  },
  {
    id: 2,
    username: "makeupbyzara",
    profilePic:
      "https://t4.ftcdn.net/jpg/11/66/06/77/360_F_1166067709_2SooAuPWXp20XkGev7oOT7nuK1VThCsN.jpg",
    comment: "This fit is giving main character ✨",
  },
  {
    id: 3,
    username: "aesthetic.rush",
    profilePic:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
    comment: "okay but why is this live so aesthetic",
  },
  {
    id: 4,
    username: "sunnyvibes101",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    comment: " Omg finally caught you liveee 👀🔥",
  },
  {
    id: 5,
    username: "skincarebabe__",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/005/897/735/non_2x/avatar-bearded-brown-haired-man-in-a-sweater-portrait-of-a-brutal-man-geologist-snowboarder-skier-student-partner-sales-manager-for-advice-bots-support-illustration-flat-vector.jpg",
    comment: "DROP THE SKINCARE ROUTINEEEE",
  },
  {
    id: 6,
    username: "cosmocraft",
    profilePic:
      "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-with-beard-vector-ilustration-png-image_6110777.png",
    comment: "Why is nobody talking about the background 😳",
  },
  {
    id: 7,
    username: "pinkpixels",
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
    comment: "this live feels illegal to watch 😩💅",
  },
  {
    id: 8,
    username: "heyyitskaran",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEwDTsw5qeyPzAFFLuPAJaeE3Q4YxSz6v0Q&s",
    comment: "can you pin this comment 🫶",
  },
  {
    id: 9,
    username: "sunnyvibes101",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    comment: "Omg finally caught you liveee 👀🔥",
  },
  {
    id: 10,
    username: "makeupbyzara",
    profilePic:
      "https://t4.ftcdn.net/jpg/11/66/06/77/360_F_1166067709_2SooAuPWXp20XkGev7oOT7nuK1VThCsN.jpg",
    comment: "This fit is giving main character ✨",
  },
  {
    id: 11,
    username: "aesthetic.rush",
    profilePic:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
    comment: "okay but why is this live so aesthetic",
  },
  {
    id: 12,
    username: "sunnyvibes101",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    comment: " Omg finally caught you liveee 👀🔥",
  },
  {
    id: 13,
    username: "skincarebabe__",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/005/897/735/non_2x/avatar-bearded-brown-haired-man-in-a-sweater-portrait-of-a-brutal-man-geologist-snowboarder-skier-student-partner-sales-manager-for-advice-bots-support-illustration-flat-vector.jpg",
    comment: "DROP THE SKINCARE ROUTINEEEE",
  },
  {
    id: 14,
    username: "cosmocraft",
    profilePic:
      "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-with-beard-vector-ilustration-png-image_6110777.png",
    comment: "Why is nobody talking about the background 😳",
  },
  {
    id: 15,
    username: "pinkpixels",
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
    comment: "this live feels illegal to watch 😩💅",
  },
  {
    id: 16,
    username: "heyyitskaran",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEwDTsw5qeyPzAFFLuPAJaeE3Q4YxSz6v0Q&s",
    comment: "can you pin this comment 🫶",
  },
];
const liveDetail = {
  userid:12345,
  title: "Lorem ipsum dolor sit amet consectetur elit est laborum.",
  username: "Vikas Khanna",
  profilePic:
    "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
  thumbnail:
    "https://img.freepik.com/premium-photo/host-channel-smiling-asian-with-joystick-playing-online-game-stratagem_31965-422116.jpg?semt=ais_hybrid&w=740",
  category: "Art",
  privacy: "Public",
  follower: "12M",
  Waited_viewers: 200,
  like: "25K",
  views: "25K",
  streamed: "2h ago",
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,  est laborum.de q,hbwk iww ighiuw iuwiwi gigoigwif gwiwif rgwif iwgf iwgf iwufwrgr grewr .
...more`,
};

const ad = {
  name: "Art Masterclass - Water Color",
  price: "₹500",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit,  est ",
  pic: "https://cdn.exoticindia.com/images/products/original/sculptures-2016/msg160.jpg",
};
const sponsor = {
  name: "Art Masterclass - Water Color",
  sponsorby: "GoPro.com",
  pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWrB_f3uqKdvDn1OMccWXycwZFG2R5YzzTFw&s",
};

const OthersLive = () => {
   const [showChat, setShowChat]=useState(true);

const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
   
  return (
    <div className="lg:w-[78%] w-full lg:mx-auto mx-0 flex flex-col lg:flex-row px-1 ">
<div className={`${showChat ? "lg:w-[70%]" : "lg:w-full"} w-full lg:px-2 flex flex-col gap-4`}>
        {/* video  */}
        <div className="w-full lg:h-[60vh] sm:h-[50vh] h-[40vh] relative ">
          <img
            src={liveDetail.thumbnail}
            alt={`Thumbnail for ${liveDetail.title}`}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute w-full mx-auto bottom-1 flex justify-between px-3 py-1.5 items-center border-t-[3px] border-[#E56500]">
            <div className="text-white lg:text-[27px] text-[23px] flex  gap-4">
            <i class="ri-play-large-fill"></i>
            <i class="ri-skip-forward-fill"></i>
            <i class="ri-volume-up-fill"></i>
            <span className=" text-[#E56500] w-4 h-4">
  •
</span>

            <span>Live</span>
            </div>
            <div className="flex gap-2 text-white lg:text-[27px] text-[23px]">
              <i class="ri-settings-3-line"></i>
              <i class="ri-fullscreen-line"></i>
            </div>
          </div>
        </div>
         {/* chat segment */}
      {showChat===true && (
        <div className="lg:hidden  self-stretch w-full h-[70vh]  border-[1px] border-[#48372D] rounded-xl flex flex-col">
        {/* header segment */}
        <header className="rounded-t-xl text-white w-full bg-[#6E4E37] flex justify-between items-center p-2 border-b border-[#48372D]">
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <h2>Top Chat</h2>
            <i className="ri-arrow-down-s-line text-xl" />
          </div>
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <i className="ri-more-fill text-xl" />
            <i
  className="ri-close-line text-xl"
  onClick={() => setShowChat(prev => !prev)}
/>

          </div>
        </header>

        <main className="w-full flex-1 overflow-y-scroll flex flex-col items-start ">
          {topChat.map((item) => (
            <div key={item.id} className="flex gap-1 mb-2 items-center">
              <img
                src={item.profilePic}
                alt={`${item.username} avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex gap-1 text-[14px] text-[#000000]">
  <div className="flex items-center gap-1 whitespace-nowrap">
    <span className="font-semibold">{item.username}</span>
    <span>:</span>
  </div>
  <p className="font-medium flex-1 min-w-0 break-words">
    {item.comment}
  </p>
</div>

            </div>
          ))}
        </main>

        {/* footer segment */}
        <div className="border-t border-[#48372D] bg-[#6E4E37] w-full flex items-center justify-between px-2 py-3 rounded-b-xl">
          <div className="flex border border-gray-100 gap-2 bg-[#6E4E37] items-center justify-between text-[#D7D0D0] text-[14px] lg:px-4.5 lg:py-2 px-3 py-1 w-[80%] rounded-xl">
            <input
              type="text"
              className="border-none placeholder:text-[18px] placeholder:text-[#D7D0D0] flex-1 bg-[#6E4E37] outline-none"
              placeholder="Add a Comment"
            />
            <MdOutlineEmojiEmotions className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <span>
              <RiMoneyDollarCircleFill className="rounded-full bg-[#6E4E37] text-gray-100 font-light text-[35px]" />
            </span>
            <span>
              <FaRegHeart className="rounded-full p-1 bg-gray-100 text-[#6E4E37] font-semibold text-[27px]" />
            </span>
          </div>
        </div>
      </div>
      )}
        {/* viideo deatail segment */}
        <div className="w-full  flex flex-col gap-4">
          <h1 className="text-[#000000] text-[20px] font-bold">
            {liveDetail.title}
          </h1>
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 sm:gap-0 sm:justify-between">
            <div className="flex gap-1.5 items-center">
              <img
                src={liveDetail.profilePic}
                alt="user profilePic"
                className="w-[40px] h-[40px] rounded-full object-cover border-[2px] border-red-500"
              />
              <div className="flex flex-col justify-betweeen ">
                <h2 className="text-[#000000] font-semibold text-lg">
                  {liveDetail.username}
                </h2>
                <div className="flex items-center gap-1 ">
                  <span className="text-[15px] text-[#48372D] font-medium">
                    {liveDetail.follower}
                  </span>
                  <span className="text-[15px] text-[#E56500] font-semibold">
                    .
                  </span>
                  <span className="text-[#6F4D34] text-[15px] font-semibold">
                    {liveDetail.category}
                  </span>
                </div>
              </div>

              {user.following===liveDetail.userid && (
                <button className="ml-3 bg-[#6E4E37]  text-[18px]  font-bold text-white rounded-[22px] lg:py-1.5 lg:px-4 px-2 py-1">
                Follow
              </button>
              )}
              {user.following!==liveDetail.userid && (
                <div className="flex items-center gap-2 sm:ml-3">
                  <button className="bg-[#48372D] text-white text-[18px]  font-bold rounded-full  px-3 py-1.5">join</button>
                  <button className="text-[#48372D] border-[1px] border-[#48372D] text-[18px]  font-bold rounded-full lg:py-1.5 lg:px-3 px-2 py-1 ">unfollow</button>
                </div>
              )}
            </div>
            {/* for buttons of like share */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex bg-[#6E4E37] rounded-[22px] px-3 py-1 gap-3">
                <button className="text-white lg:text-[18px] sm:text-[16px] font-bold">
                  <i class="ri-thumb-up-line text-white lg:text-[19px] text-[17px] font-medium"></i>{"  "}
                   {liveDetail.like}
                </button>
                <div className="w-px self-stretch  bg-gray-100  " />
                <button>
                  <i class="ri-thumb-down-line text-white lg:text-[19px] text-[17px] font-medium "></i>
                </button>
              </div>
              <button className="text-white lg:text-[18px] text-[16px] font-bold bg-[#6E4E37] rounded-[22px] px-3 py-1">
                <i class="ri-send-plane-fill  text-white bg-[#6E4E37] font-light"></i> Share
              </button>
              <button className="text-white lg:text-[18px] text-[16px] font-bold bg-[#6E4E37] rounded-[22px]  py-1 px-3">
                Report
              </button>
            </div>
          </div>
        </div>
        {
          showChat===false && 
          <button
  type="button"
  className="w-full text-center text-lg rounded-full font-bold bg-[#FEE2CC] p-1"
  onClick={() => setShowChat(prev => !prev)}
  aria-label="Toggle chat"
>
  {showChat ? "Hide Chat" : "Show Chat"}
</button>

        }
        {/* description section */}
        <div className="w-full bg-[#FEE2CC] flex flex-col px-4 py-3 rounded-xl gap-2">
          <div className="flex justify-between items-center text-[15px] text-[#000000]">
            <span>{liveDetail.views} views</span>
            <span>{liveDetail.streamed} streamed</span>
          </div>
          <div className="text-[13px] text-[#000000]">
            {liveDetail.description}
          </div>
        </div>

        <div className="flex gap-4  flex-col sm:flex-row">
          {/* Ad card */}
          <div className="sm:w-1/2 bg-[#FEE2CC] rounded-xl flex overflow-hidden ">
            {/* image */}
            <div className="w-[28%] flex-shrink-0">
              <img
                src={ad.pic}
                alt={ad.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            {/* detail */}
            <div className="flex flex-col justify-between p-3 flex-1">
              <div>
                <h3 className="text-[16px] font-medium mb-1 text-[#000000]">{ad.name}</h3>
                <p className="text-[14px] font-medium text-[#000000] mb-1">
                  {ad.price}
                </p>
                <p className="text-[12px] text-[#504D4D] line-clamp-2">
                  {ad.about}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#6E4E37]">
                  View Product
                </span>
                <FaChevronRight className="text-[#6E4E37] text-[20px] font-bold" />
              </div>
            </div>
          </div>

          {/* Sponsor card */}
          <div className="sm:w-1/2 bg-[#FEE2CC] rounded-xl flex flex-col justify-between overflow-hidden">
            <div className="flex p-3 gap-3">
              {/* image / logo */}
              <div className="flex-shrink-0">
                <img
                  src={sponsor.pic}
                  alt={sponsor.sponsorby}
                  className="w-14 h-14 object-cover rounded-full"
                />
              </div>
              {/* text */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-medium text-[#000000]">{sponsor.name}</h3>
                  <FaChevronUp className="text-[#6E4E37] text-[19px]" />
                </div>
                <div className="text-[13px] text-[#474242] mt-1 flex items-center gap-1">
                  <span className="font-medium">Sponsored</span>
                  <span className="text-[#E56500]">•</span>
                  <span className="font-medium">{sponsor.sponsorby}</span>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <button className="w-full bg-[#5E3F24] text-[18px] text-white py-2 rounded-full font-semibold hover:opacity-95 transition">
                Visit site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* chat segment */}
      {showChat===true && (
        <div className="hidden lg:flex lg:w-[29%] w-full h-[70vh] border-[1px] border-[#48372D] rounded-xl flex flex-col">
        {/* header segment */}
        <header className="relative rounded-t-xl text-white w-full bg-[#6E4E37] flex justify-between items-center p-2 border-b border-[#48372D]">
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <h2>Top Chat</h2>
            <i className="ri-arrow-down-s-line text-xl" />
          </div>
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <i className="ri-more-fill text-xl" 
        onClick={() => setIsDropdownOpen(prev => !prev)}
      
            />
           <i
  className="ri-close-line text-xl"
  onClick={() => setShowChat(prev => !prev)}
/>

          </div>
          {/* Dropdown Menu */}
      {isDropdownOpen && (
      <div
        className="absolute right-0 top-6 bg-gray-200 mt-2 vid-drop z-[999] flex flex-col bg-gray-100 text-[#000000] text-sm rounded-xl shadow-lg w-41"
        ref={dropdownRef}
      >
        <button
          className="w-full p-1 hover:bg-gray-300 rounded-t-lg flex justify-evenly "
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-user-fill"></i>
          Participants
        </button>
        <hr className="w-[85%] mx-auto border-t border-gray-800" />
        <button
          className="w-full p-1 hover:bg-gray-300 flex justify-evenly"
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-external-link-line"></i>
          Pop-up Chat
        </button>
        <hr className="w-[85%] mx-auto border-t border-gray-800" />
        <button
          className="w-full p-1 hover:bg-gray-300 rounded-b-lg  flex justify-evenly"
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-feedback-line"></i>
          Send Feedback
        </button>
        
      </div>
    )}
        </header>

        <main className="w-full flex-1 overflow-y-scroll flex flex-col items-start ">
          {topChat.map((item) => (
            <div key={item.id} className="flex gap-1 mb-2 items-center">
              <img
                src={item.profilePic}
                alt={`${item.username} avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex gap-1 text-[14px] text-[#000000]">
  <div className="flex items-center gap-1 whitespace-nowrap">
    <span className="font-semibold">{item.username}</span>
    <span>:</span>
  </div>
  <p className="font-medium flex-1 min-w-0 break-words">
    {item.comment}
  </p>
</div>

            </div>
          ))}
        </main>

        {/* footer segment */}
        <div className="border-t border-[#48372D] bg-[#6E4E37] w-full flex items-center justify-between px-2 py-3 rounded-b-xl">
          <div className="flex border border-gray-100 gap-2 bg-[#6E4E37] items-center justify-between text-[#D7D0D0] text-[14px] lg:px-4.5 lg:py-2 px-3 py-1 w-[80%] rounded-xl">
            <input
              type="text"
              className="border-none placeholder:text-[18px] placeholder:text-[#D7D0D0] flex-1 bg-[#6E4E37] outline-none"
              placeholder="Add a Comment"
            />
            <MdOutlineEmojiEmotions className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <span>
              <RiMoneyDollarCircleFill className="rounded-full bg-[#6E4E37] text-gray-100 font-light text-[35px]" />
            </span>
            <span>
              <FaRegHeart className="rounded-full p-1 bg-gray-100 text-[#6E4E37] font-semibold text-[27px]" />
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default OthersLive;
