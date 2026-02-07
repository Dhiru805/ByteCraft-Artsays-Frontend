import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaTrash } from 'react-icons/fa';
import { BsBroadcast } from 'react-icons/bs';
import getAPI from '../../api/getAPI';
import postAPI from '../../api/postAPI';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import { useAuth } from '../../AuthContext';
import { toast } from 'react-toastify';
import { DEFAULT_PROFILE_IMAGE } from '../../Constants/ConstantsVariables';

const LiveHistory = () => {
  const [history, setHistory] = useState([]);
  const [activeLives, setActiveLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingLiveId, setDeletingLiveId] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { userType } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getAPI(`/api/social-media/live-history/${userId}`);
        if (!response.hasError && response.data.success) {
          setHistory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching live history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  // Fetch active live streams
  useEffect(() => {
    const fetchActiveLives = async () => {
      try {
        const res = await getAPI("/api/social-media/active-lives", {}, true, true);
        if (res?.data?.success) {
          setActiveLives(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching active lives:", err);
      }
    };
    fetchActiveLives();
    const interval = setInterval(fetchActiveLives, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteLive = async (e, streamId, streamKey) => {
    e.stopPropagation();
    if (!streamKey) {
      toast.error("Cannot delete: missing stream key");
      return;
    }
    try {
      setDeletingLiveId(streamId);
      const res = await postAPI(
        `/api/social-media/delete-live`,
        { streamKey },
        true,
        true
      );
      if (res?.data?.success) {
        toast.success("Live stream deleted");
        setHistory((prev) => prev.filter((s) => s._id !== streamId));
      } else {
        toast.error(res?.data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting live stream:", err);
      toast.error("Error deleting live stream");
    } finally {
      setDeletingLiveId(null);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F9F9F9] min-h-screen">
      <main className='grid grid-cols-12 gap-2 p-2'>
        <Sidebar />
        
        <div className="col-span-12 lg:col-span-6 w-full my-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/artsays-community/create-live')}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Live Stream History</h1>
              </div>

              {/* Active Live Streams */}
              {activeLives.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <BsBroadcast className="text-red-500" />
                    Live Now
                  </h2>
                  <div className="flex flex-col gap-4 w-full">
                    {activeLives.map((stream) => {
                      const thumb = stream.thumbnail
                        ? stream.thumbnail.startsWith("http")
                          ? stream.thumbnail
                          : `${process.env.REACT_APP_API_URL}/${stream.thumbnail.replace(/\\/g, "/")}`
                        : "/assets/profile/user.png";

                      const profileImg = stream.userId?.profilePhoto
                        ? stream.userId.profilePhoto.startsWith("http")
                          ? stream.userId.profilePhoto
                          : `${process.env.REACT_APP_API_URL}/${stream.userId.profilePhoto}`
                        : DEFAULT_PROFILE_IMAGE;

                      return (
                        <div
                          key={stream._id}
                          className="relative flex flex-row bg-[#FFE5D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[140px] pl-3 cursor-pointer"
                          onClick={() => navigate(`/artsays-community/live/${stream.live?.streamKey}`)}
                        >
                          {/* Left Accent Bar */}
                          <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FF6B6B] z-10"></div>

                          {/* Layout Container */}
                          <div className="flex flex-row w-full p-2 py-3 gap-3 md:gap-4 items-start">
                            {/* Thumbnail Section */}
                            <div className="relative w-[160px] sm:w-[240px] aspect-video flex-shrink-0">
                              <div className="w-full h-full rounded-xl overflow-hidden relative group cursor-pointer bg-black/10">
                                <img
                                  src={thumb}
                                  alt={stream.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay & Play Button */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                                    <FaPlay className="ml-1 text-xs sm:text-sm" />
                                  </div>
                                </div>
                                {/* LIVE Badge */}
                                <div className="absolute top-1 left-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                  <BsBroadcast className="text-xs" /> LIVE
                                </div>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col justify-between h-full min-h-[90px] text-[#48372D]">
                              <div>
                                <h3 className="font-bold text-sm sm:text-lg text-[#48372D] leading-tight line-clamp-2 mb-0.5" title={stream.title}>
                                  {stream.title}
                                </h3>
                                <div className="text-[10px] sm:text-xs text-gray-600 mb-2 flex items-center gap-1 flex-wrap">
                                  <span>{stream.live?.viewCount || 0} watching</span>
                                  <span>•</span>
                                  <span className="text-red-500 font-semibold">Streaming Now</span>
                                </div>

                                {/* User Info */}
                                {stream.userId && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <img
                                      src={profileImg}
                                      alt={stream.userId.username}
                                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                                    />
                                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                                      {stream.userId.username || "User"}
                                    </span>
                                  </div>
                                )}

                                <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed hidden sm:block">
                                  {stream.description}
                                </p>
                              </div>

                              {/* Tags/Category Button */}
                              <div className="mt-auto">
                                <span className="bg-[#5D4037] text-white text-[10px] px-2 py-0.5 sm:py-1 rounded inline-block">
                                  {stream.category || "New"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {loading ? (
              <div className="text-center py-10 text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg mb-2">No past live streams found.</p>
                <p className="text-sm">
                  {userType === 'Buyer' 
                    ? "Check back later for new streams from creators." 
                    : "Your published live streams will appear here."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                {history.map((stream) => {
                  const thumb = stream.thumbnail 
                    ? (stream.thumbnail.startsWith('http') ? stream.thumbnail : `${process.env.REACT_APP_API_URL}/${stream.thumbnail.replace(/\\/g, '/')}`) 
                    : '/assets/profile/user.png';

                  return (
                    <div 
                      key={stream._id} 
                      className="relative flex flex-row bg-[#FFE5D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[140px] pl-3 cursor-pointer" 
                      onClick={() => {
                        navigate('/artsays-community/post-live', {
                          state: {
                            totalViews: stream.live?.viewCount || 0,
                            comments: 0,
                            likes: stream.live?.likeCount || 0,
                            name: stream.userId?.username || 'Creator',
                            thumbnail: thumb,
                            description: stream.title || 'Live Stream',
                            duration: stream.live?.streamDuration || '00:00',
                            streamKey: stream.live?.streamKey,
                            isPublished: stream.live?.isPublished || false,
                            isOwner: true
                          }
                        });
                      }}
                    >
                      {/* Left Accent Bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FF6B6B] z-10"></div>
                      
                      {/* Layout Container with Padding */}
                      <div className="flex flex-row w-full p-2 py-3 gap-3 md:gap-4 items-start">
                          
                        {/* Thumbnail Section */}
                        <div className="relative w-[160px] sm:w-[240px] aspect-video flex-shrink-0">
                          <div className="w-full h-full rounded-xl overflow-hidden relative group cursor-pointer bg-black/10">
                            <img 
                              src={thumb} 
                              alt={stream.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay & Play Button */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                                <FaPlay className="ml-1 text-xs sm:text-sm" />
                              </div>
                            </div>
                            {/* Duration Badge */}
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {stream.live?.streamDuration || "00:00"}
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col justify-between h-full min-h-[90px] text-[#48372D]">
                          <div>
                            <div className="flex justify-between items-start mb-0.5">
                              <h3 className="font-bold text-sm sm:text-lg text-[#48372D] leading-tight line-clamp-2" title={stream.title}>
                                {stream.title}
                              </h3>
                              <button
                                className="text-[#48372D] hover:text-red-600 p-1 shrink-0"
                                title="Delete live stream"
                                disabled={deletingLiveId === stream._id}
                                onClick={(e) => handleDeleteLive(e, stream._id, stream.live?.streamKey)}
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="text-[10px] sm:text-xs text-gray-600 mb-2 flex items-center gap-1 flex-wrap">
                              <span>{stream.live?.viewCount || 0} views</span>
                              <span>•</span>
                              <span>Streamed {new Date(stream.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* User Info */}
                            {stream.userId && (
                              <div className="flex items-center gap-2 mb-2">
                                <img
                                  src={stream.userId.profilePhoto 
                                    ? (stream.userId.profilePhoto.startsWith('http') ? stream.userId.profilePhoto : `${process.env.REACT_APP_API_URL}/${stream.userId.profilePhoto}`) 
                                    : DEFAULT_PROFILE_IMAGE}
                                  alt={stream.userId.username}
                                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                                />
                                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{stream.userId.username || "User"}</span>
                              </div>
                            )}

                            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed hidden sm:block">
                              {stream.description}
                            </p>
                          </div>

                          {/* Tags/Category Button */}
                          <div className="mt-auto">
                            <span className="bg-[#5D4037] text-white text-[10px] px-2 py-0.5 sm:py-1 rounded inline-block">
                              {stream.category || "New"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Suggestion />
      </main>
    </div>
  );
};

export default LiveHistory;
