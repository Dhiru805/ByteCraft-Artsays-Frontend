import React, { useState } from "react";
import NavBar from "../Home/HomeComponents/NavBar";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoMic } from "react-icons/io5";
import { MdOutlineIosShare } from "react-icons/md";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
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
  title: "Vikas Khanna",
  thumbnail:
    "https://img.freepik.com/premium-photo/host-channel-smiling-asian-with-joystick-playing-online-game-stratagem_31965-422116.jpg?semt=ais_hybrid&w=740",
  category: "Arts and Products",
  privacy: "Public",
  Waited_viewers: 200,
};

const MyLive = () => {
  const [showChat, setShowChat]=useState(true);
  return (
    <div className=" flex flex-col bg-white">
      <header className="w-full  ">
        <NavBar />
      </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className="flexlg:py-5 flex-row gap-4 lg:w-[90%] w-full mx-auto lg:border-[1px] lg:border-solid lg:border-gray-800">
        <div className="w-full lg:px-4 lg:px-1 flex flex-col gap-10">
          {/* video and chat */}
          <div className="w-full lg:h-[70vh] sm:h-[110vh] h-[110vh] flex lg:flex-row flex-col gap-2 ">
            {/* video segment */}
            <div className={` ${showChat ? "lg:w-[70%]" : "lg:w-full"} lg:h-full sm:h-[50vh] h-[42vh] w-full relative  `}>
              <img
                src={liveDetail.thumbnail}
                alt={`Thumbnail for ${liveDetail.title}`}
                className="w-full h-full object-cover rounded-lg"
              />
               {/* top-left overlays (live badge, timer, counts) */}
        <div className="absolute top-2 left-2 flex ">
          <div className="flex items-center  bg-black/70 text-white px-3 py-2 rounded-md text-sm font-semibold">
            <span className=" bg-red-500 text-white p-1">Live</span>
            <span className="bg-gray-100 text-[#000000] p-1 ">0:30</span>
          </div>
          
            <div className="flex items-center gap-1 text-white px-1 py-1">
              <span><FaUserGroup /></span>
              <span>35k</span>
            </div>
            <div className="flex items-center gap-1 text-white px-1 py-1 text-[14px]">
              <span><i class="ri-thumb-up-line"></i></span>
              <span>30k</span>
            </div>
          
        </div>
              {/* stream control bar */}
        <div className="absolute  left-1/2 justify-center w-full p-1.5 bottom-1 transform -translate-x-1/2 flex items-center gap-4 bg-transparent  shadow-lg text-lg border-t-[1px] border-[#000000]">
          <div className="flex gap-3 items-center">
            <button
              aria-label="Camera"
              className="p-2   flex items-center justify-center"
            >
              <FaCamera size={20} className="text-white"/>
            </button>
            <button
              aria-label="Mic"
              className="p-2  flex items-center justify-center"
            >
              <IoMic size={20} className="text-white"/>
            </button>
            <button
              aria-label="Share"
              className="p-2  flex items-center justify-center"
            >
              <MdOutlineIosShare size={20} className="text-white"/>
            </button>
            <button
              aria-label="Send"
              className="p-2  flex items-center justify-center"
            >
              <IoPaperPlaneOutline size={20} className="text-white"/>
            </button>
          </div>


          {/* End Stream */}
          <button
            className="sm:ml-2 flex items-center gap-2 sm:px-2 sm:py-1 p-1  bg-gray-100 text-[#000000] sm:text-[16px] text-sm font-semibold rounded-lg hover:opacity-95 transition"
            aria-label="End Stream"
          >End Stream
          </button>
        </div>
            </div>
            {/* chat segment */}
        {showChat===true && (
           <div className="lg:w-[28%] w-full lg:h-full sm:h-[60vh] h-[65vh] border-[1px] border-solid border-[#48372D] rounded-xl flex flex-col min-h-0">
  {/* header segment */}
  <header className="w-full flex justify-between items-center p-2 border-b-[1px] border-[#48372D]">
    <div className="flex items-center gap-2 text-[19px] font-semibold">
      <h2 className="font-medium">Top Chat</h2>
      <i className="ri-arrow-down-s-line text-[25px]"></i>
    </div>
    <div className="flex items-center gap-2 text-[19px] font-semibold">
      <i className="ri-more-fill text-xl font-medium"></i>
       <i
  className="ri-close-line text-xl"
  onClick={() => setShowChat(prev => !prev)}
/>
    </div>
  </header>
  <main className="w-full flex-1 overflow-y-auto flex flex-col items-start p-1">
    {topChat.map((item) => (
      <div key={item.id} className="flex gap-1 mb-2 items-center">
        <img
          src={item.profilePic}
          alt={`${item.username} avatar`}
          className="w-11 h-11 rounded-full flex-shrink-0"
        />
        <div className="flex gap-1 text-[14px] text-[#000000]">
          <h2 className="font-semibold">{item.username}</h2>
          <span>:</span>
          <p className="font-medium">{item.comment}</p>
        </div>
      </div>
    ))}
  </main>
  {/* footer segment */}
  <div className="border-t-[1px] border-[#48372D] w-full flex items-center justify-between p-2">
    <div className=" flex border-[1px] gap-8 border-[#48372D] items-center justify-between text-[#AF8065] text-[14px] lg:px-4.5 lg:py-2 px-3 py-1 w-[80%] rounded-lg ">
      <input
        type="text"
        className="border-none placeholder:text-[18px] placeholder:text-[#AF8065] flex-1 outline-none text-[#000000]"
        placeholder="Add a Comment"
      />
      <MdOutlineEmojiEmotions className="text-xl" />
    </div>
    <div className="flex items-center gap-2 ">
      <span>
        <RiMoneyDollarCircleFill className="rounded-full text-[#48372D] bg-gray font-light text-[35px]" />
      </span>
      <span>
        <FaRegHeart className="rounded-full p-1 text-white bg-[#48372D] font-semibold text-[27px]" />
      </span>
    </div>
  </div>
</div>
        )}

          </div>
          {/* show chat button */}
           {
          showChat===false && 
          <button
  type="button"
  className="w-full text-center text-lg rounded-full font-bold border-[1px] border-[#48372D]  p-1"
  onClick={() => setShowChat(prev => !prev)}
  aria-label="Toggle chat"
>
  {showChat ? "Hide Chat" : "Show Chat"}
</button>

        }
          {/* live information */}
          <div className="w-full flex sm:flex-row flex-col justify-between border-[1px] border-[#48372D] rounded-xl lg:mt-3 sm:mt-2">
            <div className="flex flex-col p-2 ">
              <p className="text-[#474242] text-[14px]">Title</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail.title}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242]  " />
            <div className="flex flex-col p-2 ">
              <p className="text-[#474242] text-[14px]">Category</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail.category}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242] " />
            <div className="flex flex-col p-2 ">
              <p className="text-[#474242] text-[14px]">Privacy</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                <i class="ri-earth-fill"></i>
                {liveDetail.privacy}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242] " />
            <div className="flex flex-col p-2 ">
              <p className="text-[#474242] text-[14px]">Viewers Waiting</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail.Waited_viewers}
              </h1>
            </div>
            <button className="h-full lg:text-[26px] sm:text-[18px] text-white font-bold bg-[#48372D] py-2 px-3 sm:rounded-r-xl  rounded-xl">
              Edit
            </button>
          </div>
          {/* crreate stream header */}
          <div className="w-full flex-flex-col">
            <h1 className="lg:text-[26px] sm:text-[21px] text-[20px] text-[#000000] font-bold">
              Create Stream
            </h1>
            <hr className="border-0 h-[1px] bg-[#48372D] mt-3" />
          </div>
          {/* stream link & setting */}
          <div className="w-full flex  sm:flex-row flex-col rounded-xl overflow-hidden lg:gap-10 gap-2">
            {/* left: Stream Key section */}
            <div className="sm:w-1/2 w-full flex flex-col sm:p-2 p-1.5 gap-6">
              <div>
                <p className="text-[18px] font-semibold text-[#0000000] mb-1">
                  Stream key
                </p>
                <h2 className="text-[18px] font-medium text-[#0000000]">
                  Select stream key
                </h2>
                <div className="relative sm:mt-2">
                  <select className="w-full  rounded  sm:rounded-none
    sm:border-0
    sm:border-b
    sm:border-b-black border-[1px] border-[#000000] appearance-none sm:text-[18px] text-[17px] font-semibold text-[#0000000] bg-white">
                    <option>Default stream key (RTMP, Variable)</option>
                    {/* other options */}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-[18px] font-semibold text-[#0000000]" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[18px] text-[#474242] mb-1">
                  Stream key (paste in encoder)
                </p>
                <div className="flex gap-5 items-center ">
                  <div>
                    <div className="flex-1 relative  rounded flex items-center  py-2">
                      <span className="truncate">
                        •••••••••••••••••••••••••••••••••
                      </span>
                      <button
                        aria-label="Reveal"
                        className="ml-2 text-gray-500"
                        type="button"
                      >
                        <i className="ri-eye-line" />
                      </button>
                    </div>
                    <hr className="border-0 h-[1px] bg-[#000000]" />
                  </div>
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 border-[1px] border-[#000000] rounded sm:text-[18px] text-[14px] text-[#474242]">
                    Reset
                  </button>
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 border-[1px]  border-[#000000] sm:text-[18px] text-[14px] text-[#474242] rounded ">
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[18px] text-[#474242]  mb-1">Stream URL</p>
                <div className="flex gap-2 items-center">
                  <div>
                    <div className="flex-1  rounded  py-2 flex items-center">
                      <i className="ri-lock-fill mr-2" />
                      <span className="sm:text-[18px] text-[16px] font-bold ">
                        rtmp://a.rtmp.youtube.com/live2
                      </span>
                    </div>
                    <hr className="border-0 h-[1px] bg-[#000000]" />
                  </div>
                  <hr className="border-0 h-[1px] bg-[#000000]" />
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 sm:text-[18px] text-[14px] rounded border-[1px]  border-[#000000]  text-[#474242]">
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[18px] text-[#474242]  mb-1">
                  Backup server URL
                </p>
                <div className="flex gap-2 items-center">
                  <div>
                    <div className="flex-1  rounded  py-2 flex items-center">
                      <i className="ri-lock-fill mr-2" />
                      <span className="sm:text-[18px] text-[16px] font-bold ">
                        rtmp://a.rtmp.youtube.com/live2
                      </span>
                    </div>
                    <hr className="border-0 h-[1px] bg-[#000000]" />
                  </div>
                  <hr className="border-0 h-[1px] bg-[#000000]" />
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 sm:text-[18px] text-[14px]  rounded border-[1px]  border-[#000000] text-[#474242]">
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* vertical divider */}
            <div className="sm:w-px bg-[#474242]" />

            {/* right: Stream latency */}
            <div className="sm:w-1/2 w-full flex flex-col sm:p-6 p-1.5 gap-6">
              <div className="flex flex-col">
                <p className="text-[18px] font-semibold  mb-1">
                  Stream latency
                </p>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="latency"
                      className="radio"
                      defaultChecked
                    />
                    <span className="text-[16px] text-[#000000] font-medium">
                      Normal latency
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" />
                    <span className="text-[16px] text-[#000000] font-medium">
                      Low-latency
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" />
                    <span className="text-[16px] text-[#000000] font-medium">
                      Ultra Low-latency
                    </span>
                  </label>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>
                  Choosing lower latency can reduce delay but may increase
                  buffering or reduce quality depending on network conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyLive;