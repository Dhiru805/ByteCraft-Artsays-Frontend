import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import axios from 'axios';
import EditLiveModal from './CreateModalLive';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const MyLive = () => {
  const { streamKey } = useParams();
  const navigate = useNavigate();
  
  // State
  const [liveDetail, setLiveDetail] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  
  // Refs
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnectionsRef = useRef({}); // Store peer connections for each viewer

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Fetch live details
  const fetchLive = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/social-media/live/${streamKey}`);
      if (response.data.success) {
        setLiveDetail(response.data.liveData);
      }
    } catch (error) {
      console.error('Error fetching live:', error);
      toast.error('Failed to load live stream details');
    }
  };

  useEffect(() => {
    fetchLive();
  }, [streamKey]);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    // Handle new viewer joining
    socketRef.current.on('newViewer', async ({ viewerSocketId }) => {
      console.log('New viewer joined:', viewerSocketId);
      await createPeerConnectionForViewer(viewerSocketId);
    });

    // Handle viewer answer
    socketRef.current.on('answer', async ({ answer, viewerSocketId }) => {
      console.log('Received answer from viewer:', viewerSocketId);
      const peerConnection = peerConnectionsRef.current[viewerSocketId];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle viewer ICE candidate
    socketRef.current.on('viewer-ice-candidate', async ({ candidate, viewerSocketId }) => {
      const peerConnection = peerConnectionsRef.current[viewerSocketId];
      if (peerConnection && candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle viewer count updates
    socketRef.current.on('viewerCountUpdate', ({ count }) => {
      setViewerCount(count);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [streamKey]);

  // Create peer connection for a specific viewer
  const createPeerConnectionForViewer = async (viewerSocketId) => {
    try {
      console.log('Creating peer connection for viewer:', viewerSocketId);
      console.log('Current stream tracks:', streamRef.current?.getTracks());
      
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionsRef.current[viewerSocketId] = peerConnection;

      // Add local stream tracks to peer connection
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('Adding track to peer connection:', track.kind);
          peerConnection.addTrack(track, streamRef.current);
        });
      } else {
        console.error('No stream available to add to peer connection!');
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to viewer:', viewerSocketId);
          socketRef.current.emit('ice-candidate', {
            viewerSocketId,
            candidate: event.candidate
          });
        }
      };

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      console.log('Sending offer to viewer:', viewerSocketId);
      socketRef.current.emit('offer', {
        streamKey,
        viewerSocketId,
        offer
      });

      console.log('Offer sent to viewer:', viewerSocketId);
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  };

  // Start live stream
  const startLiveStream = async () => {
    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Notify server that streaming has started
      console.log('Emitting startLive with streamKey:', streamKey);
      socketRef.current.emit('startLive', { streamKey });

      socketRef.current.on('liveStarted', ({ success }) => {
        console.log('Received liveStarted response:', success);
        if (success) {
          setIsLive(true);
          toast.success('Live stream started!');
        }
      });

    } catch (error) {
      console.error('Error starting live:', error);
      toast.error('Failed to start live stream. Please check camera permissions.');
    }
  };

  // Stop live stream
  const stopLiveStream = () => {
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};

    // Notify server
    socketRef.current.emit('stopLive', { streamKey });

    setIsLive(false);
    toast.info('Live stream stopped');
    
    // Navigate back
    navigate('/social-media/create-live');
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen pt-4">
      <div className="max-w-[1800px] mx-auto w-full">
        {/* Video Container */}
        <div className="bg-black w-full">
          <div className="max-w-full mx-auto" style={{ maxHeight: '80vh' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
              style={{ maxHeight: '80vh' }}
            />
          </div>
        </div>

        {/* Content Below Video */}
        <div className="p-4 sm:p-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1">
                {/* Title and Actions */}
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
                        {liveDetail?.userId?.fullName || liveDetail?.userId?.username || 'Your Channel'}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{liveDetail?.userId?.username || 'channel'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">{viewerCount} viewers</span>
                      {isLive && (
                        <span className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Stream Key: {streamKey}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200">
                  {!isLive ? (
                    <button
                      onClick={startLiveStream}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      Go Live
                    </button>
                  ) : (
                    <button
                      onClick={stopLiveStream}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      End Stream
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-full font-medium border border-gray-300 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>

                {/* Description */}
                {liveDetail && (
                  <div className="bg-[#FEE2CC] bg-opacity-30 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {liveDetail?.description || 'No description'}
                        </p>
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
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-[400px] space-y-4">
                {/* Share Your Stream */}
                <div className="bg-gradient-to-br from-[#6E4E37] to-[#5a3c2d] rounded-xl p-4 shadow-md">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Your Stream
                  </h3>
                  <p className="text-xs text-[#FEE2CC] mb-3">Share this link with your audience</p>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 mb-3">
                    <p className="text-xs text-white mb-1 font-medium">Stream Link:</p>
                    <p className="text-xs text-gray-900 break-all font-mono">
                      {`${window.location.origin}/social-media/live/${streamKey}`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/social-media/live/${streamKey}`);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="w-full bg-white hover:bg-gray-100 text-[#6E4E37] py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-[#48372D] mb-3">Stream Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-gray-700">
                        {isLive ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            Broadcasting
                          </span>
                        ) : (
                          <span className="text-gray-500">Offline</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Viewers</span>
                      <span className="font-medium text-gray-700">{viewerCount}</span>
                    </div>
                    {liveDetail?.category && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium text-gray-700">{liveDetail.category}</span>
                      </div>
                    )}
                    {liveDetail?.language && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Language</span>
                        <span className="font-medium text-gray-700">{liveDetail.language}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FEE2CC] to-[#FED7B0] rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-[#48372D] mb-2">Streaming Tips</h3>
                  <ul className="space-y-2 text-xs text-[#6E4E37]">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Ensure good lighting and audio quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Interact with your viewers regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Check your internet connection before going live</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditLiveModal
          onClose={() => setShowModal(false)}
          liveDetail={liveDetail}
          fetchLive={fetchLive}
        />
      )}
    </div>
  );
};

export default MyLive;
