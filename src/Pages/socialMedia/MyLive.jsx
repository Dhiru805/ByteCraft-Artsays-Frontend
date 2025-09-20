import React, { useState, useEffect, useRef } from "react";
import NavBar from "../Home/HomeComponents/NavBar";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaCamera, FaRegEyeSlash  } from "react-icons/fa";
import { IoMic } from "react-icons/io5";
import { MdOutlineIosShare } from "react-icons/md";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import getAPI from "../../api/getAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditLiveModal from "../../Pages/socialMedia/CreateModalLive";
import { LuEye } from "react-icons/lu";


const topChat = [
  // {
  //   id: 1,
  //   username: "sunnyvibes101",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
  //   comment: "Omg finally caught you liveee 👀🔥",
  // },
  // {
  //   id: 2,
  //   username: "makeupbyzara",
  //   profilePic:
  //     "https://t4.ftcdn.net/jpg/11/66/06/77/360_F_1166067709_2SooAuPWXp20XkGev7oOT7nuK1VThCsN.jpg",
  //   comment: "This fit is giving main character ✨",
  // },
  // {
  //   id: 3,
  //   username: "aesthetic.rush",
  //   profilePic:
  //     "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  //   comment: "okay but why is this live so aesthetic",
  // },
  // {
  //   id: 4,
  //   username: "sunnyvibes101",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
  //   comment: " Omg finally caught you liveee 👀🔥",
  // },
  // {
  //   id: 5,
  //   username: "skincarebabe__",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/005/897/735/non_2x/avatar-bearded-brown-haired-man-in-a-sweater-portrait-of-a-brutal-man-geologist-snowboarder-skier-student-partner-sales-manager-for-advice-bots-support-illustration-flat-vector.jpg",
  //   comment: "DROP THE SKINCARE ROUTINEEEE",
  // },
  // {
  //   id: 6,
  //   username: "cosmocraft",
  //   profilePic:
  //     "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-with-beard-vector-ilustration-png-image_6110777.png",
  //   comment: "Why is nobody talking about the background 😳",
  // },
  // {
  //   id: 7,
  //   username: "pinkpixels",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
  //   comment: "this live feels illegal to watch 😩💅",
  // },
  // {
  //   id: 8,
  //   username: "heyyitskaran",
  //   profilePic:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEwDTsw5qeyPzAFFLuPAJaeE3Q4YxSz6v0Q&s",
  //   comment: "can you pin this comment 🫶",
  // },
  // {
  //   id: 9,
  //   username: "sunnyvibes101",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
  //   comment: "Omg finally caught you liveee 👀🔥",
  // },
  // {
  //   id: 10,
  //   username: "makeupbyzara",
  //   profilePic:
  //     "https://t4.ftcdn.net/jpg/11/66/06/77/360_F_1166067709_2SooAuPWXp20XkGev7oOT7nuK1VThCsN.jpg",
  //   comment: "This fit is giving main character ✨",
  // },
  // {
  //   id: 11,
  //   username: "aesthetic.rush",
  //   profilePic:
  //     "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  //   comment: "okay but why is this live so aesthetic",
  // },
  // {
  //   id: 12,
  //   username: "sunnyvibes101",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
  //   comment: " Omg finally caught you liveee 👀🔥",
  // },
  // {
  //   id: 13,
  //   username: "skincarebabe__",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/previews/005/897/735/non_2x/avatar-bearded-brown-haired-man-in-a-sweater-portrait-of-a-brutal-man-geologist-snowboarder-skier-student-partner-sales-manager-for-advice-bots-support-illustration-flat-vector.jpg",
  //   comment: "DROP THE SKINCARE ROUTINEEEE",
  // },
  // {
  //   id: 14,
  //   username: "cosmocraft",
  //   profilePic:
  //     "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-with-beard-vector-ilustration-png-image_6110777.png",
  //   comment: "Why is nobody talking about the background 😳",
  // },
  // {
  //   id: 15,
  //   username: "pinkpixels",
  //   profilePic:
  //     "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
  //   comment: "this live feels illegal to watch 😩💅",
  // },
  // {
  //   id: 16,
  //   username: "heyyitskaran",
  //   profilePic:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEwDTsw5qeyPzAFFLuPAJaeE3Q4YxSz6v0Q&s",
  //   comment: "can you pin this comment 🫶",
  // },
];

const MyLive = () => {
  const [showChat, setShowChat] = useState(true);
  const [liveDetail, setLiveDetail] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [ stream, setStream ] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const videoRef = useRef(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeActive, setIsYoutubeActive] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [categories, setCategories] = useState();

  //Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true); 
        if (!response.hasError) {
          setCategories(response.data.data);
        } else {
          console.error(`Failed to fetch categories:, ${response.message}`);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  // Copy function - streamKey
  const handlesCopy = () => {
    if (liveDetail?.live?.streamKey) {
      navigator.clipboard.writeText(liveDetail?.live?.streamKey);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveDetail?.live?.streamUrl);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Request camera access
  const startLiveStream = async (withAudio = false) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: withAudio });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera. Please allow permission and try again.");
    }
  };

  // Stop camera stream
  const stopLiveStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  //Screenshare
  const handleScreenShare = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true, 
    });

    // replace video in player
    if (videoRef.current) {
      videoRef.current.srcObject = screenStream;
      videoRef.current.play();
    }

    setStream(screenStream);

    // when user stops sharing manually
    screenStream.getVideoTracks()[0].onended = () => {
      stopLiveStream(); 
    };
  } catch (err) {
    console.error("Error starting screen share:", err);
  }
  };

  const handleMicToggle = () => {
  if (stream) {
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      const enabled = !audioTracks[0].enabled;
      audioTracks[0].enabled = enabled;
      setMicOn(enabled);
    } else {
      // if no audio track, request with audio
      startLiveStream(true);
      setMicOn(true);
    }
  } else {
    // start new stream with audio
    startLiveStream(true);
    setMicOn(true);
  }
};

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopLiveStream();
    };
  }, []);

  // Start stream when component mounts if liveDetail indicates a live session
  useEffect(() => {
    if (liveDetail?.isLive) {
      startLiveStream();
    }
  }, [liveDetail?.isLive]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

    //handleYoutubeShare
    const handleYoutubeShare = () => {
    const link = prompt("Enter YouTube video link:");
    if (link) {
      setYoutubeUrl(link);
      setIsYoutubeActive(true);
    }
    };

    const stopYoutubeShare = () => {
      setYoutubeUrl("");
      setIsYoutubeActive(false);
    };


  useEffect(() => {
    const fetchLive = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User not logged in");
          return;
        }

        const res = await getAPI(`/api/social-media/live/${userId}`); 
        console.log("API Response:", res.data);

        const live = res?.data?.liveData;

        if (live) {
          setLiveDetail(live); 
        } else {
          toast.error(res.data?.message || "Failed to load live details");
          setLiveDetail(null); 
        }
      } catch (err) {
        console.error("Fetch live error:", err);
        toast.error("Error fetching live details");
        setLiveDetail(null); 
      }
    };

    fetchLive();
  }, []);

  // Handle modal visibility
  const handleEditClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <div className="flex flex-col bg-white">
      <header className="w-full">
        <NavBar />
      </header>

      <main className="flex lg:py-5 flex-row gap-4 lg:w-[90%] w-full mx-auto lg:border-[1px] lg:border-solid lg:border-gray-800">
        <div className="w-full lg:px-4 lg:px-1 flex flex-col gap-10">
          {/* Video and chat */}
          <div className="w-full lg:h-[70vh] sm:h-[110vh] h-[110vh] flex lg:flex-row flex-col gap-2">
            {/* Video segment */}
            <div className={`${showChat ? "lg:w-[70%]" : "lg:w-full"} lg:h-full sm:h-[50vh] h-[42vh] w-full relative`}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                controls
                muted={false}
                style={{ display: stream ? "block" : "none" }}
              />
              {/* {!stream && liveDetail?.thumbnail && ( */}
                <img
                  src={`http://localhost:3001/${liveDetail?.thumbnail?.replace(/\\/g, "/")}`}
                  alt={`Thumbnail for ${liveDetail?.title}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              {/* )} */}
              {/* Top-left overlays (live badge, timer, counts) */}
              <div className="absolute top-2 left-2 flex gap-2">
                <div className="flex items-center bg-black/70 text-white px-3 py-2 rounded-md text-sm font-semibold">
                  <span className="bg-red-500 text-white p-1">Live</span>
                  <span className="bg-gray-100 text-black p-1">
                    {liveDetail?.live?.streamDuration || "00:00"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white px-1 py-1">
                  <span><FaUserGroup /></span>
                  <span>{liveDetail?.live?.viewersWaiting || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-white px-1 py-1 text-[14px]">
                  <span><i className="ri-thumb-up-line"></i></span>
                  <span>{liveDetail?.live?.likeCount || 0}</span>
                </div>
              </div>
              {/* Stream control bar */}
              <div className="absolute left-1/2 justify-center w-full p-1.5 bottom-1 transform -translate-x-1/2 flex items-center gap-4 bg-transparent shadow-lg text-lg border-t-[1px] border-[#000000]">
                <div className="flex gap-3 items-center">
                  <button aria-label="Camera" className="p-2 flex items-center justify-center" onClick={() => startLiveStream(micOn)}>
                    <FaCamera size={20} className="text-white" />
                  </button>
                  <button aria-label="Mic" className="p-2 flex items-center justify-center" onClick={handleMicToggle}>
                    <IoMic size={20} className={micOn ? "text-green-400" : "text-white"} />
                  </button>
                  <button aria-label="Share" className="p-2 flex items-center justify-center" onClick={handleScreenShare}>
                    <MdOutlineIosShare size={20} className="text-white" />
                  </button>
                  <button aria-label="Send" className="p-2 flex items-center justify-center" onClick={() => setShowShare(!showShare)}>
                    <IoPaperPlaneOutline size={20} className="text-white" />
                    {showShare && (
                      <div className="absolute bottom-12 left-50 bg-white text-black p-3 rounded-lg shadow-lg w-72">
                        <p className="text-sm font-semibold mb-1">Share this stream:</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={liveDetail?.live?.streamUrl}
                            readOnly
                            className="flex-1 p-1 border rounded text-xs"
                          />
                          <button
                            onClick={handlesCopy}
                            className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
                <button
                  className="sm:ml-2 flex items-center gap-2 sm:px-2 sm:py-1 p-1 bg-gray-100 text-black sm:text-[16px] text-sm font-semibold rounded-lg hover:opacity-95 transition"
                  aria-label="End Stream" onClick={stopLiveStream}
                >
                  End Stream
                </button>
                {/* <video ref={videoRef} style={{ display: stream ? "block" : "none", width: "200px", position: "absolute", top: "-220px", left: "50%", transform: "translateX(-50%)" }} /> */}
              </div>
            </div>
            {/* Chat segment */}
            {showChat && (
              <div className="lg:w-[28%] w-full lg:h-full sm:h-[60vh] h-[65vh] border-[1px] border-solid border-[#48372D] rounded-xl flex flex-col min-h-0">
                <header className="w-full flex justify-between items-center p-2 border-b-[1px] border-[#48372D]">
                  <div className="flex items-center gap-2 text-[19px] font-semibold">
                    <h2 className="font-medium">Top Chat</h2>
                    <i className="ri-arrow-down-s-line text-[25px]"></i>
                  </div>
                  <div className="flex items-center gap-2 text-[19px] font-semibold">
                    <i className="ri-more-fill text-xl font-medium"></i>
                    <i className="ri-close-line text-xl" onClick={() => setShowChat(false)} />
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
                <div className="border-t-[1px] border-[#48372D] w-full flex items-center justify-between p-2">
                  <div className="flex border-[1px] gap-8 border-[#48372D] items-center justify-between text-[#AF8065] text-[14px] lg:px-4.5 lg:py-2 px-3 py-1 w-[80%] rounded-lg">
                    <input
                      type="text"
                      className="border-none placeholder:text-[18px] placeholder:text-[#AF8065] flex-1 outline-none text-[#000000]"
                      placeholder="Add a Comment"
                    />
                    <MdOutlineEmojiEmotions className="text-xl" />
                  </div>
                  <div className="flex items-center gap-2">
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
          {showChat === false && (
            <button
              type="button"
              className="w-full text-center text-lg rounded-full font-bold border-[1px] border-[#48372D] p-1"
              onClick={() => setShowChat(true)}
              aria-label="Toggle chat"
            >
              Show Chat
            </button>
          )}
          {/* Live information */}
          <div className="w-full flex sm:flex-row flex-col justify-between border-[1px] border-[#48372D] rounded-xl lg:mt-3 sm:mt-2">
            <div className="flex flex-col p-2">
              <p className="text-[#474242] text-[14px]">Title</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail?.title ? liveDetail.title : ""}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242]" />
            <div className="flex flex-col p-2">
              <p className="text-[#474242] text-[14px]">Category</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail?.category ? liveDetail.category : ""}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242]" />
            <div className="flex flex-col p-2">
              <p className="text-[#474242] text-[14px]">Privacy</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                <i className="ri-earth-fill"></i>
                {liveDetail?.live.privacy ? liveDetail.live.privacy : ""}
              </h1>
            </div>
            <div className="w-px h-[75%] my-auto bg-[#474242]" />
            <div className="flex flex-col p-2">
              <p className="text-[#474242] text-[14px]">Viewers Waiting</p>
              <h1 className="text-[20px] text-[#48372D] font-bold">
                {liveDetail?.live.viewersWaiting ? liveDetail.live.viewersWaiting : ""}
              </h1>
            </div>
            <button
              className="h-full lg:text-[26px] sm:text-[18px] text-white font-bold bg-[#48372D] py-2 px-3 sm:rounded-r-xl rounded-xl"
              onClick={handleEditClick}
            >
              Edit
            </button>
            {showModal && <EditLiveModal onClose={handleModalClose} liveDetail={liveDetail} />}
          </div>
          {/* Create stream header */}
          <div className="w-full flex flex-col">
            <h1 className="lg:text-[26px] sm:text-[21px] text-[20px] text-[#000000] font-bold">
              Create Stream
            </h1>
            <hr className="border-0 h-[1px] bg-[#48372D] mt-3" />
          </div>
          {/* Stream link & settings */}
          <div className="w-full flex sm:flex-row flex-col rounded-xl overflow-hidden lg:gap-10 gap-2">
            {/* Left: Stream Key section */}
            <div className="sm:w-1/2 w-full flex flex-col sm:p-2 p-1.5 gap-6">
              <div>
                <p className="text-[18px] font-semibold text-[#000000] mb-1">
                  Stream key
                </p>
                <h2 className="text-[18px] font-medium text-[#000000]">
                  Select stream key
                </h2>
                <div className="relative sm:mt-2">
                  <select className="w-full rounded sm:rounded-none sm:border-0 sm:border-b sm:border-b-black border-[1px] border-[#000000] appearance-none sm:text-[18px] text-[17px] font-semibold text-[#000000] bg-white">
                    <option>Default stream key (RTMP, Variable)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-[18px] font-semibold text-[#000000]" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[18px] text-[#474242] mb-1">
                  Stream key (paste in encoder)
                </p>
                <div className="flex gap-5 items-center">
                  <div>
                    <div className="flex-1 relative rounded flex items-center py-2">
                      <span className="truncate text-[16px]">
                          {showKey ? liveDetail?.live?.streamKey : "•••••••••••••••••••••••••••••••••••••••••••••••••"}
                      </span>
                      <button aria-label="Reveal" className="ml-2 text-gray-500" type="button" onClick={() => setShowKey((prev) => !prev)}>
                        {/* <i className={showKey ? "ri-eye-off-line" : "ri-eye-line"} /> */}
                        {
                          showKey ? <LuEye size='20px'/> : <FaRegEyeSlash size='20px'/>
                        }
                      </button>
                    </div>
                    <hr className="border-0 h-[1px] bg-[#000000]" />
                  </div>
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 border-[1px] border-[#000000] sm:text-[18px] text-[14px] text-[#474242] rounded"
                    onClick={handlesCopy}>
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[18px] text-[#474242] mb-1">Stream URL</p>
                <div className="flex gap-2 items-center">
                  <div>
                    <div className="flex-1 rounded py-2 flex items-center">
                      <i className="ri-lock-fill mr-2" />
                      <span className="sm:text-[18px] text-[16px] font-bold">
                        {liveDetail?.live?.streamUrl ? liveDetail?.live?.streamUrl : ""}
                      </span>
                    </div>
                    <hr className="border-0 h-[1px] bg-[#000000]" />
                  </div>
                  <button className="lg:px-3 lg:py-1 sm:px-2 sm:py-1 p-1 sm:text-[18px] text-[14px] rounded border-[1px] border-[#000000] text-[#474242]"
                    onClick={handleCopy}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
            {/* Vertical divider */}
            <div className="sm:w-px bg-[#474242]" />
            {/* Right: Stream latency */}
            <div className="sm:w-1/2 w-full flex flex-col sm:p-6 p-1.5 gap-6">
              <div className="flex flex-col">
                <p className="text-[18px] font-semibold mb-1">Stream Delay</p>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" defaultChecked />
                    <span className="text-[16px] text-[#000000] font-medium">No Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" />
                    <span className="text-[16px] text-[#000000] font-medium">10s Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" />
                    <span className="text-[16px] text-[#000000] font-medium">30s Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="latency" className="radio" />
                    <span className="text-[16px] text-[#000000] font-medium">60s Delay</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyLive;