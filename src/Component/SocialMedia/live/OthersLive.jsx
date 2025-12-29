import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// WebRTC Configuration
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const OthersLive = () => {
  const { streamKey } = useParams();
  
  // State
  const [liveDetail, setLiveDetail] = useState(null);
  const [isStreamerLive, setIsStreamerLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  
  // Refs
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Handle like/dislike
  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Thanks for your feedback!');
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
    } else {
      setDisliked(true);
      setDislikeCount(prev => prev + 1);
      if (liked) {
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      toast.info('Thanks for your feedback!');
    }
  };

  // Fetch live details
  const fetchLiveDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/social-media/live/${streamKey}`);
      if (response.data.success) {
        setLiveDetail(response.data.liveData);
        setIsStreamerLive(response.data.liveData.live?.isLive || false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live details:', error);
      toast.error('Failed to load live stream');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (streamKey) {
      fetchLiveDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamKey]);

  // Initialize socket and WebRTC
  useEffect(() => {
    if (!streamKey) return;

    const userId = localStorage.getItem('userId') || 'anonymous';
    socketRef.current = io(SOCKET_URL);

    // Handle WebRTC offer (defined inside useEffect to avoid dependency issues)
    const handleOffer = async (offer) => {
      try {
        console.log('Handling offer from streamer...');
        // Create peer connection
        peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
        console.log('Peer connection created');

        // Handle incoming tracks (video/audio from streamer)
        peerConnectionRef.current.ontrack = (event) => {
          console.log('Received remote track:', event.track.kind);
          console.log('Event streams:', event.streams);
          if (videoRef.current && event.streams[0]) {
            console.log('Setting video srcObject');
            videoRef.current.srcObject = event.streams[0];
            setIsStreamerLive(true);
            // Mute initially to allow autoplay (browser policy)
            videoRef.current.muted = true;
            // Ensure video plays
            videoRef.current.play().then(() => {
              console.log('Video playing successfully');
            }).catch(err => {
              console.error('Error playing video:', err.name, err.message);
              // If still fails, user will need to click to play
              toast.info('Click on the video to start playback');
            });
          } else {
            console.error('Video ref or stream not available');
          }
        };

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Sending ICE candidate to streamer');
            socketRef.current.emit('viewer-ice-candidate', {
              streamKey,
              candidate: event.candidate
            });
          }
        };

        // Set remote description and create answer
        console.log('Setting remote description...');
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Creating answer...');
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        // Send answer to streamer
        console.log('Sending answer to streamer...');
        socketRef.current.emit('answer', {
          streamKey,
          answer
        });

        console.log('Answer sent to streamer successfully');
      } catch (error) {
        console.error('Error handling offer:', error);
        toast.error('Failed to connect to stream');
      }
    };

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      
      // Join the live stream
      socketRef.current.emit('joinLive', { streamKey, userId });
    });

    // Handle successful join
    socketRef.current.on('joinedLive', ({ streamerActive }) => {
      console.log('Joined live - Streamer active:', streamerActive);
      if (streamerActive) {
        console.log('Streamer is active, waiting for offer...');
      } else {
        console.log('Streamer not active yet');
        toast.info('Waiting for streamer to start...');
      }
    });

    // Handle WebRTC offer from streamer
    socketRef.current.on('offer', async ({ offer }) => {
      console.log('Received offer from streamer:', offer);
      await handleOffer(offer);
    });

    // Handle ICE candidates from streamer
    socketRef.current.on('ice-candidate', async ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle viewer count updates
    socketRef.current.on('viewerCountUpdate', ({ count }) => {
      setViewerCount(count);
    });

    // Handle stream ended
    socketRef.current.on('streamEnded', () => {
      toast.info('Stream has ended');
      setIsStreamerLive(false);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveLive', { streamKey, userId });
        socketRef.current.disconnect();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [streamKey]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen pt-4">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500 text-lg">Loading stream...</div>
        </div>
      ) : (
        <div className="max-w-[1800px] mx-auto w-full">
          {/* Video Player */}
          <div className="bg-black w-full relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
              style={{ maxHeight: '80vh' }}
            />
            
            {/* Live Badge */}
            {isStreamerLive && (
              <div className="absolute top-4 left-4 bg-red-600 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white font-bold text-sm">LIVE</span>
              </div>
            )}

            {/* Viewer Count */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-80 backdrop-blur-sm px-3 py-1.5 rounded text-white text-sm font-medium">
              {viewerCount} watching
            </div>

            {/* Waiting Message */}
            {!isStreamerLive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Waiting for stream to start...</p>
                  <p className="text-sm text-gray-400 mt-2">The streamer will be live shortly</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Below Video */}
          <div className="p-4 sm:p-6">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                  {/* Title and Stats */}
                  <div className="mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#48372D] mb-3">
                      {liveDetail?.title || 'Live Stream'}
                    </h1>
                    
                    {/* Channel Name */}
                    <div className="flex items-center gap-3 mb-3">
                      {liveDetail?.userId?.profilePhoto ? (
                        <img 
                          src={liveDetail.userId.profilePhoto} 
                          alt={liveDetail.userId.username}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#6E4E37] flex items-center justify-center text-white font-semibold">
                          {liveDetail?.userId?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {liveDetail?.userId?.fullName || liveDetail?.userId?.username || 'Channel'}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{liveDetail?.userId?.username || 'channel'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">{viewerCount} viewers</span>
                      {isStreamerLive && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1.5 text-red-600 font-medium">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            Live now
                          </span>
                        </>
                      )}
                      {liveDetail?.category && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{liveDetail.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Like/Dislike Buttons */}
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-l-full font-medium transition ${
                          liked 
                            ? 'bg-[#6E4E37] text-white' 
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm font-semibold">{likeCount}</span>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button
                        onClick={handleDislike}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-r-full font-medium transition ${
                          disliked 
                            ? 'bg-[#6E4E37] text-white' 
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={disliked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                        <span className="text-sm font-semibold">{dislikeCount}</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-gray-700 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-sm font-semibold">Share</span>
                    </button>
                  </div>

                  {/* Description */}
                  <div className="bg-[#FEE2CC] bg-opacity-30 p-4 rounded-xl mb-4">
                    <h3 className="font-semibold text-[#48372D] mb-2">About</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {liveDetail?.description || 'No description available'}
                    </p>
                    
                    {/* Tags */}
                    {liveDetail?.tags && liveDetail.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {liveDetail.tags.map((tag, index) => (
                          <span key={index} className="bg-[#6E4E37] text-white px-3 py-1 rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-[400px] space-y-4">
                  {/* Stream Info Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-[#48372D] mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Stream Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium">
                          {isStreamerLive ? (
                            <span className="text-red-600 flex items-center gap-1">
                              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                              Live
                            </span>
                          ) : (
                            <span className="text-gray-500">Offline</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Viewers</span>
                        <span className="font-medium text-gray-700">{viewerCount}</span>
                      </div>
                      {liveDetail?.category && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Category</span>
                          <span className="font-medium text-gray-700">{liveDetail.category}</span>
                        </div>
                      )}
                      {liveDetail?.language && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Language</span>
                          <span className="font-medium text-gray-700">{liveDetail.language}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share Card */}
                  <div className="bg-gradient-to-br from-[#FEE2CC] to-[#FED7B0] rounded-xl p-4 shadow-sm">
                    <h3 className="font-semibold text-[#48372D] mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Enjoying the stream?
                    </h3>
                    <p className="text-xs text-[#6E4E37] mb-3">Share this live stream with your friends!</p>
                    <button className="w-full bg-[#6E4E37] hover:bg-[#5a3c2d] text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OthersLive;
