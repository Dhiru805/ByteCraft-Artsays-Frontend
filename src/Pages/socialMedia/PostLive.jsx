import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShare, FaUpload, FaTrash } from 'react-icons/fa';
import postAPI from '../../api/postAPI';
import { toast } from 'react-toastify';

const PostLive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    totalViews = 0, 
    comments = 0, 
    likes = 0, 
    name = 'Creator Name', 
    thumbnail = 'https://via.placeholder.com/150', 
    description = 'Live Stream Description',
    duration = '00:00',
    streamKey,
    isPublished = false,
    isOwner = true
  } = location.state || {};

  const handlePublish = async () => {
    if (!streamKey) {
      toast.error('Stream key missing, cannot publish');
      return;
    }
    try {
      await postAPI('/api/social-media/publish-live', { streamKey });
      toast.success('Live stream published successfully');
      navigate('/artsays-community/live-history');
    } catch (error) {
      console.error('Error publishing live stream:', error);
      toast.error('Failed to publish live stream');
    }
  };

  const handleDelete = async () => {
    if (!streamKey) {
      navigate('/artsays-community');
      return;
    }
    try {
      await postAPI('/api/social-media/delete-live', { streamKey });
      toast.success('Live stream deleted');
      navigate('/artsays-community');
    } catch (error) {
      console.error('Error deleting live stream:', error);
      toast.error('Failed to delete live stream');
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F9F9F9] min-h-screen p-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Video/Thumbnail Section */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative aspect-video bg-black">
              <img src={thumbnail} alt="Stream Thumbnail" className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {duration}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${name}`} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                    <p className="text-xs text-gray-500">12M • Art</p>
                  </div>
                </div>
                  <div className="flex items-center gap-2">
                    {isOwner && !isPublished && (
                      <button 
                        onClick={handlePublish}
                        className="px-6 py-2 bg-[#48372D] text-white rounded-lg font-bold hover:bg-[#3a2c24]"
                      >
                        Publish
                      </button>
                    )}
                    {isOwner && (
                      <button 
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                      <FaShare />
                    </button>
                  </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm mb-1">{totalViews} views</h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{description}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Streamed now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Product & Sponsors */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Featured Product */}
            <div className="flex-1 bg-[#EAE0D5] rounded-xl p-4 flex items-center gap-4">
               <div className="w-20 h-20 bg-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-gray-500">
                  <FaUpload className="mb-1" />
                  <span>Drag photos</span>
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-gray-800 mb-1">Featured Product Title</div>
                 <div className="text-xs text-gray-600 mb-2">₹ 00.00</div>
                 <div className="border border-gray-400 rounded px-2 py-1 text-xs text-center text-gray-600 mb-2">Add Product Description</div>
                 <div className="flex justify-between items-center text-xs text-gray-700 font-medium cursor-pointer">
                   <span>Paste Link here</span>
                   <span>&gt;</span>
                 </div>
               </div>
            </div>

            {/* Sponsors */}
            <div className="flex-1 bg-[#FBEAD2] rounded-xl p-4">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                   <div>
                     <div className="text-sm font-bold text-gray-800">Select Sponsors</div>
                     <div className="text-[10px] text-gray-600">Sponsored • sponsored site</div>
                   </div>
                 </div>
                 <span className="text-gray-600">^</span>
               </div>
               <div className="bg-[#6D5D53] text-white text-center py-2 rounded-lg text-sm font-medium cursor-pointer">
                 Paste sponsored link
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-900">Session Insights</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Total Views" value={totalViews} />
            <StatBox label="Super Stickers" value="4k" />
            <StatBox label="Comments" value={comments} />
            <StatBox label="Memberships" value="90" />
            <StatBox label="Likes" value={likes} />
            <StatBox label="In App Gifting" value="₹15,000" />
            <StatBox label="Super Chat" value="2k" />
            <StatBox label="Total Earnings" value="₹15,000" />
          </div>

          {/* Statistics List */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-center mb-4">Statistics</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Peak Live Viewers -</span>
              <span>145</span>
            </div>
            <div className="mb-2">
              <div className="text-sm mb-1">Top Locations</div>
              <LocationBar label="India" value={75} />
              <LocationBar label="US" value={15} color="bg-[#6D5D53]" />
              <LocationBar label="US" value={10} color="bg-[#D4C5B9]" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Shares -</span>
                <span>145</span>
              </div>
              <div className="flex justify-between">
                <span>New Followers Gained -</span>
                <span>145</span>
              </div>
              <div className="flex justify-between">
                <span>Art work Sold -</span>
                <span>145</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
             <h3 className="font-bold text-center mb-4">Revenue Breakdown</h3>
             <div className="flex justify-center">
               {/* Placeholder for Pie Chart */}
               <div className="w-48 h-48 rounded-full bg-orange-200 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-[#6D5D53]"></div>
                 <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#FBEAD2]"></div>
                 <div className="z-10 bg-white rounded-full w-16 h-16 flex items-center justify-center text-xs font-bold">
                    Chart
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="max-w-7xl mx-auto w-full flex justify-end gap-4 mt-6">
        <button className="px-6 py-2 border border-gray-800 rounded-lg font-bold text-gray-800 hover:bg-gray-50">
          Delete
        </button>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="bg-white border border-gray-800 rounded-xl p-1 flex flex-col items-center min-w-[80px]">
    <div className="text-[10px] font-medium text-white bg-[#48372D] w-full text-center rounded-md py-1 mb-1">{label}</div>
    <div className="font-bold text-lg text-gray-900">{value}</div>
  </div>
);

const LocationBar = ({ label, value, color = "bg-[#48372D]" }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className={`h-4 rounded-full ${color} flex items-center justify-center text-[10px] text-white`} style={{ width: `${value}%`, minWidth: '40px' }}>
      {label}
    </div>
    <span className="text-xs">{value}</span>
  </div>
);

export default PostLive;
