import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaEye, FaThumbsUp, FaComment, FaGlobe, FaLock } from 'react-icons/fa';
import getAPI from '../../api/getAPI';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import { useAuth } from '../../AuthContext';

const LiveHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="flex flex-col w-full bg-[#F9F9F9] min-h-screen">
      <main className='flex flex-row items-start sm:gap-4 w-full sm:w-[96%] mx-auto pt-4'>
        <Sidebar />
        
        <div className="flex-1 flex flex-col gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((stream) => (
                  <div key={stream._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col">
                    <div className="relative aspect-video bg-black">
                      <img 
                        src={stream.thumbnail ? (stream.thumbnail.startsWith('http') ? stream.thumbnail : `${process.env.REACT_APP_API_URL}/${stream.thumbnail}`) : 'https://via.placeholder.com/300x169?text=No+Thumbnail'} 
                        alt={stream.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {stream.live?.streamDuration || "00:00"}
                      </div>
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        {stream.live?.privacy === 'Public' ? <FaGlobe /> : <FaLock />}
                        {stream.live?.privacy}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      {stream.userId && (
                         <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <img 
                                src={stream.userId.profilePhoto ? (stream.userId.profilePhoto.startsWith('http') ? stream.userId.profilePhoto : `${process.env.REACT_APP_API_URL}/${stream.userId.profilePhoto}`) : 'https://via.placeholder.com/30'} 
                                alt={stream.userId.username} 
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-gray-700">{stream.userId.username}</span>
                         </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 mr-2" title={stream.title}>{stream.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                          {stream.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1" title={stream.description}>
                        {stream.description}
                      </p>

                      {stream.tags && stream.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {stream.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {stream.tags.length > 3 && (
                            <span className="text-[10px] text-gray-500 px-1">+{stream.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Views">
                            <FaEye /> {stream.live?.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Likes">
                            <FaThumbsUp /> {stream.live?.likeCount || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Comments">
                            <FaComment /> {stream.live?.chatMessages?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1" title="Streamed on">
                          <FaCalendarAlt />
                          {new Date(stream.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
