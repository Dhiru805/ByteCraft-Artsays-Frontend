import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import axios from 'axios';
import { 
  Settings, ChevronDown, Share2,
  ThumbsUp, Play, Maximize, Volume2,
  MoreHorizontal, X, Smile, Heart, 
  MessageSquare, Sticker, Users, Gift, ChevronRight
} from 'lucide-react';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// WebRTC Configuration
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const GIFT_ITEMS = [
  { id: 1, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 2, name: 'Love Zap', price: 299, icon: '⚡' },
  { id: 3, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 4, name: 'Love Zap', price: 299, icon: '⚡' },
  { id: 5, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 6, name: 'Love Zap', price: 299, icon: '⚡' },
  { id: 7, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 8, name: 'Love Zap', price: 299, icon: '⚡' },
  { id: 9, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 10, name: 'Love Zap', price: 299, icon: '⚡' },
  { id: 11, name: 'Pookie Skull', price: 199, icon: '💀' },
  { id: 12, name: 'Love Zap', price: 299, icon: '⚡' }
];

const STICKER_ITEMS = [
  { id: 1, name: 'Skull Heart', price: 99, icon: '💀❤️' },
  { id: 2, name: 'Lightning Love', price: 149, icon: '⚡💝' },
  { id: 3, name: 'Cute Skull', price: 99, icon: '💀🎀' },
  { id: 4, name: 'Power Heart', price: 149, icon: '💖⚡' },
  { id: 5, name: 'Skull Heart', price: 99, icon: '💀❤️' },
  { id: 6, name: 'Lightning Love', price: 149, icon: '⚡💝' },
  { id: 7, name: 'Cute Skull', price: 99, icon: '💀🎀' },
  { id: 8, name: 'Power Heart', price: 149, icon: '💖⚡' },
  { id: 9, name: 'Skull Heart', price: 99, icon: '💀❤️' },
  { id: 10, name: 'Lightning Love', price: 149, icon: '⚡💝' },
];

const MEMBERSHIP_TIERS = [
  { 
    id: 'SILVER', 
    name: 'SILVER', 
    price: '₹50/month', 
    color: 'bg-[#FCE7F3]', 
    activeColor: 'bg-[#FBCFE8]', // Pinkish styling from image
    description: 'Loyalty badges next to your name in comments and live chat',
    badges: ['🐶', '⚡', '🦉', '☠️']
  },
  { 
    id: 'GOLD', 
    name: 'GOLD', 
    price: '₹60/month', 
    color: 'bg-white', 
    activeColor: 'bg-gray-100',
    description: 'Includes all Silver perks plus exclusive member-only polls',
    badges: ['🐶', '⚡', '🦉', '☠️']
  },
  { 
    id: 'PLATINUM', 
    name: 'PLATINUM', 
    price: '₹200/month', 
    color: 'bg-white', 
    activeColor: 'bg-gray-100',
    description: 'Early access to new videos and member shout-outs',
    badges: ['🐶', '⚡', '🦉', '☠️']
  },
  { 
    id: 'PLATINUM +', 
    name: 'PLATINUM +', 
    price: '₹1000/month', 
    color: 'bg-white', 
    activeColor: 'bg-gray-100',
    description: 'Exclusive behind-the-scenes content and personal video messages',
    badges: ['🐶', '⚡', '🦉', '☠️']
  },
];

const SUPER_CHAT_TIERS = [40, 100, 200, 400, 1000, 4000];

const EMOJI_CATEGORIES = [
  {
    name: "Smileys & People",
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '🥰', '😍', '🤩', '😘', '😋', '😎']
  },
  {
    name: "Gestures",
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '👍', '👎', '👏', '🙌', '🙏', '💪']
  },
  {
    name: "Hearts & Objects",
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '🎉', '🎊', '🎁', '🎈']
  }
];

const OthersLive = () => {
  const { streamKey } = useParams();
  const navigate = useNavigate();
  
  // State
  const [liveDetail, setLiveDetail] = useState(null);
  const [isStreamerLive, setIsStreamerLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSuperChatMenu, setShowSuperChatMenu] = useState(false);
  const [superChatView, setSuperChatView] = useState('main'); // 'main' | 'gifting' | 'stickers' | 'membership' | 'superchat'
  const [streamerMemberships, setStreamerMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [superChatAmount, setSuperChatAmount] = useState(SUPER_CHAT_TIERS[0]);
  const [isMembershipsLoading, setIsMembershipsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [streamerProducts, setStreamerProducts] = useState([]);
    const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  
    // Refs
    const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch streamer memberships
  const fetchStreamerMemberships = async (userId) => {
    setIsMembershipsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // If no token, we still try to fetch if the backend allows or handle it
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/membership?userId=${userId}`, { headers });
      
      if (response.data.success && response.data.memberships) {
        const mapped = response.data.memberships.map((m, index) => ({
          id: m._id,
          name: m.title,
          price: `₹${m.price}/month`,
          color: index === 0 ? 'bg-[#FCE7F3]' : 'bg-white',
          activeColor: index === 0 ? 'bg-[#FBCFE8]' : 'bg-gray-100',
          description: m.perks && m.perks.length > 0 
            ? m.perks.map(p => p.perkName).join(', ') 
            : 'No description available',
          badges: ['🐶', '⚡', '🦉', '☠️'] // Default badges as they're not in DB schema yet
        }));
        setStreamerMemberships(mapped);
        if (mapped.length > 0) {
          setSelectedMembership(mapped[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      setIsMembershipsLoading(false);
    }
  };

  const slugify = (text) =>
    text ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "";

  const fetchStreamerProducts = async (userId, userType) => {
    try {
      const endpoint = userType === 'Seller' 
        ? `/api/getsellerproductbyid/${userId}`
        : `/api/getproductbyartist/${userId}`;
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${endpoint}`);
      if (response.data.success && response.data.data) {
        setStreamerProducts(response.data.data.slice(0, 4)); // Show top 4 products
      }
    } catch (error) {
      console.error('Error fetching streamer products:', error);
    }
  };

  // Check follow status
  const checkFollowStatus = async (streamerId) => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId || currentUserId === 'null') return;
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/social-media/profile/${streamerId}`);
      if (response.data.profile) {
        const followers = response.data.profile.followers || [];
        setFollowerCount(followers.length);
        // Handle both cases where followers are IDs or populated objects
        const isFollowing = followers.some(f => (f._id || f) === currentUserId);
        setIsFollowing(isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  // Handle follow toggle
  const handleFollowToggle = async () => {
    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!currentUserId || !token || currentUserId === 'null') {
      toast.error('Please login to follow creators');
      return;
    }

    const streamerId = liveDetail?.userId?._id;
    if (!streamerId) return;

    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/social-media/${endpoint}/${streamerId}`,
        { userId: currentUserId }, // Backend expects userId in body
        { headers: { Authorization: `Bearer ${token}` } }
      );

        if (response.status === 200 || response.status === 201) {
          setIsFollowing(!isFollowing);
          setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
          toast.success(isFollowing ? 'Unfollowed' : 'Followed');
        }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  // Fullscreen handler
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle like
  const handleLike = () => {
    let userId = localStorage.getItem('userId');
    
    // If no userId, use/create an anonymousId
    if (!userId || userId === 'null') {
      userId = localStorage.getItem('anonymousId');
      if (!userId) {
        userId = 'anon_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('anonymousId', userId);
      }
    }

    setLiked(!liked);
    if (socketRef.current) {
      socketRef.current.emit('likeStream', { streamKey, userId });
    }
    
    if (!liked) {
      toast.success('Thanks for your feedback!');
    }
  };

  const handleSendMessage = (e, customMessage) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || newMessage;
    if (!messageToSend.trim()) return;

    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');
    let profilePhoto = localStorage.getItem('profilePhoto');

    // If not logged in, use Anonymous
    if (!userId || userId === 'null') {
      userId = null;
      username = 'Anonymous';
      profilePhoto = null;
    }

    if (!customMessage) setNewMessage('');
    
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        streamKey,
        message: messageToSend,
        userId,
        username,
        profilePhoto
      });
    }
  };

  const handleJoinMembership = async (tier) => {
    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!currentUserId || !token || currentUserId === 'null') {
      toast.error('Please login to join memberships');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/membership/purchase`,
        { userId: currentUserId, membershipId: tier.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success && response.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        toast.error(response.data?.message || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error('Membership purchase error:', err);
      toast.error('Failed to initiate membership payment');
    }
  };

  const handleSendSuperChat = () => {
    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!currentUserId || !token || currentUserId === 'null') {
      toast.error('Please login to send Super Chat');
      return;
    }

    handleSendMessage(null, `Super Chat: ₹${superChatAmount} 💸`);
    setShowSuperChatMenu(false);
    setSuperChatView('main');
    toast.success('Super Chat sent!');
  };

  const handleSendGift = (gift) => {
    handleSendMessage(null, `Sent a gift: ${gift.icon} ${gift.name} 🎁`);
    setShowSuperChatMenu(false);
    setSuperChatView('main');
    toast.success(`${gift.name} gift sent!`);
  };

  const handleSendSticker = (sticker) => {
    handleSendMessage(null, `${sticker.icon}`);
    setShowSuperChatMenu(false);
    setSuperChatView('main');
  };

  // Fetch live details
  const fetchLiveDetails = async () => {
    try {
      let userId = localStorage.getItem('userId');
      if (!userId || userId === 'null') {
        userId = localStorage.getItem('anonymousId');
      }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/social-media/live/${streamKey}`);
        if (response.data.success) {
          const liveData = response.data.liveData;
          setLiveDetail(liveData);
          setIsStreamerLive(liveData.live?.isLive || false);
          setLikeCount(liveData.live?.likeCount || 0);
          setViewerCount(liveData.live?.viewCount || 0);
          
            if (liveData.userId?._id) {
              fetchStreamerMemberships(liveData.userId._id);
              checkFollowStatus(liveData.userId._id);
              fetchStreamerProducts(liveData.userId._id, liveData.userId.role);
            }

          // Check if current user (logged in or anonymous) has liked

        if (userId && liveData.live?.likes?.includes(userId)) {
          setLiked(true);
        }
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
            videoRef.current.muted = isMuted;
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

    // Handle like count updates
    socketRef.current.on('likeCountUpdate', ({ count }) => {
      setLikeCount(count);
    });

    // Handle new messages
    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: message.username,
        text: message.text,
        avatar: message.profilePhoto || 'https://i.pravatar.cc/150?u=' + message.username,
        isCreator: message.isCreator || false
      }]);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamKey]);

  if (loading) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3D2B1F]/20 border-t-[#3D2B1F] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans bg-white">
      {/* Content Area */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden custom-scrollbar justify-start gap-6">
          {/* Main Content Wrapper (Video + Info) */}
          <div className="flex-shrink-0 pt-10 pb-12 pl-4 pr-2 custom-scrollbar overflow-y-auto" style={{ width: '760px' }}>
            {/* Video Player */}
            <div 
              ref={videoContainerRef}
              className="relative bg-black overflow-hidden shadow-2xl group" 
              style={{ width: '720px', height: '540px', borderRadius: '10px' }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button className="hover:scale-110 transition-transform"><Play size={24} fill="white" /></button>
                    <button 
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.muted = !videoRef.current.muted;
                          setIsMuted(videoRef.current.muted);
                        }
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      {isMuted ? <Volume2 size={24} className="opacity-50" /> : <Volume2 size={24} />}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-bold">Live</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:scale-110 transition-transform"><Settings size={24} /></button>
                    <button 
                      onClick={toggleFullScreen}
                      className="hover:scale-110 transition-transform"
                    >
                      <Maximize size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {!isStreamerLive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-bold">Waiting for streamer...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {liveDetail?.title || 'Lorem ipsum dolor sit amet consectetur elit est laborum.'}
                  {liveDetail?.tags?.map((tag, idx) => (
                    <span key={idx} className="ml-2 text-[#6E4E37] font-medium">#{tag}</span>
                  ))}
                </h1>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img 
                      src={liveDetail?.userId?.profilePhoto || 'https://i.pravatar.cc/150?u=vikas'} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      alt="Artist"
                    />
                    <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{liveDetail?.userId?.fullName || liveDetail?.userId?.username || 'Creator'}</h3>
                            <button 
                              onClick={() => {
                                setShowSuperChatMenu(true);
                                setSuperChatView('membership');
                                if (liveDetail?.userId?._id) {
                                  fetchStreamerMemberships(liveDetail.userId._id);
                                }
                              }}
                              className="bg-[#3D2B1F] text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-[#2D1F16] transition-all"
                            >
                              Join
                            </button>
                            <button 
                              onClick={handleFollowToggle}
                              className={`${isFollowing ? 'text-gray-500 hover:text-gray-700' : 'text-[#6E4E37] hover:text-[#5a3c2d]'} text-sm font-bold transition-all ml-2`}
                            >
                              {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                          </div>
                            <p className="text-sm text-gray-500 font-medium">{followerCount} followers • {liveDetail?.category || 'General'}</p>
                        </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                      <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-full transition-all">
                        <ThumbsUp size={20} className={liked ? 'fill-[#3D2B1F] text-[#3D2B1F]' : 'text-gray-600'} />
                        <span className="font-bold text-sm">{likeCount || '0'}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-sm text-gray-700 transition-all">
                      <Share2 size={20} />
                      Share
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-sm text-gray-700 transition-all">
                      Report
                    </button>
                  </div>
                </div>

                  <div className="mt-8 bg-[#FEE2CC]/30 rounded-[24px] p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-bold text-gray-900">{followerCount} followers</span>
                    <span className="font-bold text-gray-900">Streamed 2h ago</span>
                  </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {liveDetail?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborum.de q.hbwk iww ighiuw iuwiwi gigoigwif gwiwif rgwif iwgf iwgf iwufwrgr grewr .'}
                </p>
                <button className="mt-2 text-xs font-bold text-gray-500 hover:text-gray-700">...more</button>
              </div>

              {/* Product Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {streamerProducts.length > 0 ? (
                  streamerProducts.map((product) => (
                    <div 
                      key={product._id}
                      onClick={() => navigate(`/product-details/${slugify(product.productName)}/${product._id}`)}
                      className="bg-[#FEE2CC]/30 rounded-[24px] p-4 flex items-center gap-4 group cursor-pointer hover:bg-[#FEE2CC]/50 transition-all"
                    >
                      <img 
                        src={`${imageBaseURL}${product.mainImage}`} 
                        className="w-24 h-24 rounded-2xl object-cover" 
                        alt={product.productName} 
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.productName}</h4>
                        <p className="text-sm font-bold text-gray-900 mt-1">₹ {product.finalPrice}</p>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <button className="text-gray-400 group-hover:text-gray-900 transition-all">
                          <ChevronDown className="-rotate-90" size={20} />
                        </button>
                        <span className="text-xs font-bold text-gray-900 underline whitespace-nowrap">View Product</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#FEE2CC]/30 rounded-[24px] p-4 flex items-center justify-center col-span-1 md:col-span-2">
                    <p className="text-sm text-gray-500 font-medium">No products listed by this creator yet.</p>
                  </div>
                )}

                {/* Sponsor Card (Keeping as placeholder or making slightly dynamic) */}
                <div className="bg-[#FEE2CC]/30 rounded-[24px] p-4 flex items-center gap-4 group cursor-pointer hover:bg-[#FEE2CC]/50 transition-all">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center overflow-hidden">
                    <img src="https://logo.clearbit.com/gopro.com" className="w-8 h-8 object-contain" alt="Sponsor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">Art Masterclass</h4>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Sponsored • Artsays</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/art-gallery');
                    }}
                    className="bg-[#6E4E37] text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-[#5a3c2d] transition-all"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="flex-shrink-0 bg-white border border-gray-100 flex flex-col mt-10 mb-12 shadow-sm overflow-hidden" style={{ width: '300.42px', height: '624.36px', borderRadius: '10px' }}>
            {/* Chat Header */}
            <div className="p-4 bg-[#6E4E37] flex items-center justify-between text-white">
              <div className="flex items-center gap-2 cursor-pointer">
                <h3 className="font-bold text-sm">Top Chat</h3>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center gap-3">
                <MoreHorizontal size={18} className="cursor-pointer opacity-80 hover:opacity-100" />
                <X size={18} className="cursor-pointer opacity-80 hover:opacity-100" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <img 
                    src={msg.avatar} 
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                    alt={msg.user} 
                  />
                  <div className="flex-1 min-w-0 text-sm leading-tight">
                    <span className={`${msg.isCreator ? 'font-black text-gray-900' : 'font-bold text-[#6E4E37]'}`}>
                      {msg.user}:
                    </span>
                    <span className={`ml-1 ${idx % 3 === 0 ? 'text-gray-700' : 'text-[#6E4E37]'}`}>
                      {msg.text}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#6E4E37] relative">
              {showSuperChatMenu && (
                <div className="absolute bottom-full left-0 w-full bg-white rounded-t-[20px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 z-40 pb-1" onClick={(e) => e.stopPropagation()}>
                  {superChatView === 'main' && (
                    <>
                      <div className="p-3 flex items-center justify-between">
                        <h3 className="text-black font-bold text-base" style={{ color: 'black' }}>
                          Show support to {liveDetail?.userId?.fullName || liveDetail?.userId?.username || 'Creator'}
                        </h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSuperChatMenu(false);
                            setSuperChatView('main');
                          }}
                          className="text-gray-500 hover:text-gray-800 transition-colors z-50 p-1"
                        >
                          <X size={18} className="stroke-[3]" />
                        </button>
                      </div>
                      
                      <div className="px-3 pb-3 space-y-2">
                        <button 
                          onClick={() => setSuperChatView('superchat')}
                          className="w-full bg-[#EDEDD5] hover:bg-[#E3E3C3] active:scale-[0.98] transition-all rounded-full p-2 flex items-center justify-between text-[#4A3728] group"
                        >
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <div className="w-7 h-7 rounded-full bg-[#4A3728] flex items-center justify-center text-[#EDEDD5]">
                              <MessageSquare size={14} fill="#EDEDD5" />
                            </div>
                            Super Chat
                          </div>
                          <ChevronRight size={16} className="text-[#4A3728]/70 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button 
                          onClick={() => setSuperChatView('stickers')}
                          className="w-full bg-[#EDEDD5] hover:bg-[#E3E3C3] active:scale-[0.98] transition-all rounded-full p-2 flex items-center justify-between text-[#4A3728] group"
                        >
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <div className="w-7 h-7 rounded-full bg-[#4A3728] flex items-center justify-center text-[#EDEDD5]">
                              <Sticker size={14} fill="#EDEDD5" />
                            </div>
                            Super Stickers
                          </div>
                          <ChevronRight size={16} className="text-[#4A3728]/70 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                          onClick={() => setSuperChatView('membership')}
                          className="w-full bg-[#EDEDD5] hover:bg-[#E3E3C3] active:scale-[0.98] transition-all rounded-full p-2 flex items-center justify-between text-[#4A3728] group"
                        >
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <div className="w-7 h-7 rounded-full bg-[#4A3728] flex items-center justify-center text-[#EDEDD5]">
                              <Users size={14} fill="#EDEDD5" />
                            </div>
                            Membership
                          </div>
                          <ChevronRight size={16} className="text-[#4A3728]/70 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button 
                          onClick={() => setSuperChatView('gifting')}
                          className="w-full bg-[#EDEDD5] hover:bg-[#E3E3C3] active:scale-[0.98] transition-all rounded-full p-2 flex items-center justify-between text-[#4A3728] group"
                        >
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <div className="w-7 h-7 rounded-full bg-[#4A3728] flex items-center justify-center text-[#EDEDD5]">
                              <Gift size={14} fill="#EDEDD5" />
                            </div>
                            In App Gifting
                          </div>
                          <ChevronRight size={16} className="text-[#4A3728]/70 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </>
                  )}

                      {superChatView === 'membership' && (
                        <div className="flex flex-col h-[500px]">
                          {/* Header */}
                          <div className="p-4 bg-[#FCE7F3] rounded-t-[20px] relative overflow-hidden">
                             {/* Decorative Circles */}
                            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 border-2 border-[#4A3728] rounded-full opacity-20 pointer-events-none"></div>
                            <div className="absolute left-[30%] top-[-10px] w-12 h-12 border-2 border-[#4A3728] rounded-full opacity-20 pointer-events-none"></div>
                            <div className="absolute right-[30%] bottom-[10px] w-8 h-8 border-2 border-[#4A3728] rounded-full opacity-20 pointer-events-none"></div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSuperChatMenu(false);
                                setSuperChatView('main');
                              }}
                              className="absolute right-4 top-4 text-gray-600 hover:text-black transition-colors z-50 p-2 hover:bg-white/20 rounded-full"
                            >
                              <X size={20} className="stroke-[3]" />
                            </button>
                            
                            <div className="flex items-center gap-4 mb-2 relative z-10">
                              <img 
                                src={liveDetail?.userId?.profilePhoto || 'https://via.placeholder.com/40'} 
                                alt="Creator" 
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            </div>
                            
                            <div className="relative z-10">
                              <h3 className="text-[#4A3728] text-lg font-medium leading-tight">
                                {liveDetail?.userId?.fullName || 'Creator'}
                              </h3>
                              <h2 className="text-[#4A3728] text-2xl font-bold">
                                Be a member
                              </h2>
                            </div>
                          </div>

                          <div className="flex flex-1 overflow-hidden bg-white">
                            {isMembershipsLoading ? (
                              <div className="flex-1 flex flex-col items-center justify-center p-8">
                                <div className="w-8 h-8 border-4 border-[#4A3728]/20 border-t-[#4A3728] rounded-full animate-spin mb-2"></div>
                                <p className="text-sm text-gray-500">Loading memberships...</p>
                              </div>
                            ) : streamerMemberships.length > 0 ? (
                              <>
                                {/* Left Sidebar - Tiers List */}
                                <div className="w-1/3 border-r border-gray-100 overflow-y-auto custom-scrollbar">
                                  {streamerMemberships.map((tier) => (
                                    <button
                                      key={tier.id}
                                      onClick={() => setSelectedMembership(tier)}
                                      className={`w-full text-left p-4 transition-colors relative ${
                                        selectedMembership?.id === tier.id 
                                          ? tier.activeColor 
                                          : 'hover:bg-gray-50'
                                      }`}
                                    >
                                      {selectedMembership?.id === tier.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4A3728]"></div>
                                      )}
                                      <div className="text-sm font-medium text-gray-800 mb-0.5">
                                        {tier.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {tier.price}
                                      </div>
                                    </button>
                                  ))}
                                </div>

                                {/* Right Content - Tier Details */}
                                <div className="w-2/3 p-5 overflow-y-auto custom-scrollbar">
                                  {selectedMembership ? (
                                    <>
                                      <h3 className="text-lg font-bold text-[#4A3728] mb-1">
                                        {selectedMembership.price}
                                      </h3>
                                      
                                        <button 
                                          onClick={() => handleJoinMembership(selectedMembership)}
                                          className="bg-[#5c4033] hover:bg-[#4A3728] text-white rounded-full px-6 py-1.5 text-sm font-bold mb-4 transition-colors"
                                        >
                                          Join
                                        </button>


                                      <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                                        {selectedMembership.description}
                                      </p>

                                      <div>
                                        <h4 className="text-xs font-bold text-[#4A3728] mb-2">
                                          Loyalty badges next to your name in comments and live chat
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedMembership.badges.map((badge, index) => (
                                            <span key={index} className="text-xl filter drop-shadow-sm" title="Badge">
                                              {badge}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                      Select a tier to see details
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <Users size={48} className="text-gray-200 mb-4" />
                                <h3 className="text-lg font-bold text-gray-700 mb-1">No memberships available</h3>
                                <p className="text-sm text-gray-500">This creator hasn't set up any membership tiers yet.</p>
                                <button 
                                  onClick={() => setSuperChatView('main')}
                                  className="mt-4 text-[#4A3728] font-bold text-sm underline"
                                >
                                  Go back
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}


                  {superChatView === 'stickers' && (
                    <>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex-1"></div>
                        <h3 className="text-[#FACC15] font-bold text-lg text-center flex-1 whitespace-nowrap">
                          Super Stickers
                        </h3>
                        <div className="flex-1 flex justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSuperChatMenu(false);
                              setSuperChatView('main');
                            }}
                            className="text-[#FACC15] hover:text-[#EAB308] transition-colors z-50 p-1"
                          >
                            <X size={24} className="stroke-[3]" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="px-2 pb-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-4 gap-2">
                            {STICKER_ITEMS.map((sticker) => (
                              <button 
                                key={sticker.id}
                                onClick={() => handleSendSticker(sticker)}
                                className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95 aspect-square"
                              >
                                <div className="text-4xl filter drop-shadow-sm hover:scale-110 transition-transform">
                                  {sticker.icon}
                                </div>
                              </button>
                            ))}

                        </div>
                      </div>
                    </>
                  )}

                  {superChatView === 'gifting' && (
                    <>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex-1"></div>
                        <h3 className="text-[#D93025] font-bold text-lg text-center flex-1 whitespace-nowrap">
                          In App Gifting
                        </h3>
                        <div className="flex-1 flex justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSuperChatMenu(false);
                              setSuperChatView('main');
                            }}
                            className="text-[#D93025] hover:text-[#B02018] transition-colors z-50 p-1"
                          >
                            <X size={24} className="stroke-[3]" />
                          </button>
                        </div>
                      </div>
                      
                        <div className="px-2 pb-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-4 gap-2">
                            {GIFT_ITEMS.map((gift) => (
                              <button 
                                key={gift.id}
                                onClick={() => handleSendGift(gift)}
                                className="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded-lg transition-colors group relative"
                              >
                                <div className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                                  {gift.icon}
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium text-center leading-tight line-clamp-1">
                                  {gift.name}
                                </span>
                                <div className="flex items-center gap-1 bg-[#FEF3C7] px-1.5 py-0.5 rounded-full">
                                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                                  <span className="text-[10px] font-bold text-[#4A3728]">
                                    {gift.price}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                    </>
                  )}

                  {superChatView === 'superchat' && (
                    <div className="flex flex-col">
                      <div className="p-3 flex items-center justify-between">
                        <h3 className="text-[#137333] font-bold text-lg">Super Chat</h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSuperChatMenu(false);
                            setSuperChatView('main');
                          }}
                          className="text-[#137333] hover:text-[#0d5524] transition-colors z-50 p-1"
                        >
                          <X size={24} className="stroke-[3]" />
                        </button>
                      </div>

                      <div className="px-4 pb-4">
                        {/* Preview Card */}
                        <div className="bg-[#81C995] rounded-xl p-4 text-center mb-6 shadow-sm">
                          <div className="flex items-center gap-3 justify-center">
                              <img 
                                src={localStorage.getItem('profilePhoto') || 'https://via.placeholder.com/40'} 
                                alt="User" 
                                className="w-8 h-8 rounded-full border border-white/20"
                              />
                              <span className="font-medium text-[#202124] text-base">
                                {localStorage.getItem('username') || 'Lucky Singh'}
                              </span>
                              <span className="font-bold text-[#202124] text-base">
                              ₹{superChatAmount.toFixed(1)}
                              </span>
                          </div>
                        </div>

                        <div className="text-center font-medium text-xl text-[#202124] mb-8">
                          ₹{superChatAmount.toFixed(1)}
                        </div>

                        {/* Slider */}
                        <div className="relative h-1 bg-[#E8EAED] rounded-full mb-10 mx-2">
                          {/* Active Track */}
                          <div 
                            className="absolute left-0 top-0 h-full bg-[#137333] rounded-full transition-all duration-300"
                            style={{ width: `${(SUPER_CHAT_TIERS.indexOf(superChatAmount) / (SUPER_CHAT_TIERS.length - 1)) * 100}%` }}
                          ></div>
                          
                          {/* Points */}
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-[1px]">
                            {SUPER_CHAT_TIERS.map((tier) => (
                              <button
                                key={tier}
                                onClick={() => setSuperChatAmount(tier)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 z-10 ${
                                  superChatAmount === tier 
                                    ? 'bg-[#137333] scale-[1.5]' 
                                    : superChatAmount > tier 
                                      ? 'bg-[#137333]' 
                                      : 'bg-[#C6C6C6]' // Slightly darker grey for unselected
                                }`}
                              >
                              </button>
                            ))}
                          </div>
                        </div>

                        <button className="w-full bg-[#81C995] hover:bg-[#68bd80] text-[#202124] font-medium py-3 rounded-full transition-colors active:scale-[0.98] shadow-sm">
                          Buy and Send
                        </button>

                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 w-[260px] bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
                      <div className="h-64 overflow-y-auto custom-scrollbar">
                        {EMOJI_CATEGORIES.map((category, catIdx) => (
                          <div key={catIdx} className="mb-4 last:mb-0">
                            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{category.name}</h4>
                            <div className="grid grid-cols-6 gap-2">
                              {category.emojis.map((emoji, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="aspect-square flex items-center justify-center hover:bg-gray-100 rounded text-xl transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Add a comment"
                    className="w-full bg-transparent border border-white rounded-[20px] py-2 pl-4 pr-10 text-sm text-white placeholder:text-white/70 focus:outline-none focus:bg-white/10 transition-all"
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
                  >
                    <Smile size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowSuperChatMenu(!showSuperChatMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${showSuperChatMenu ? 'bg-[#EDEDD5] text-[#3D2B1F]' : 'bg-white text-[#6E4E37] hover:bg-gray-100'}`}
                >
                  ₹
                </button>
                
                <div className="relative group">
                  <div className="absolute bottom-full right-0 hidden group-hover:flex flex-col items-center pb-4 z-50">
                    <div className="flex flex-col bg-white rounded-full shadow-xl p-1.5 gap-1 border border-black/5">
                      {['❤️', '😂', '🎊', '😳', '💯'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleSendMessage(null, emoji)}
                          className="text-lg hover:scale-125 transition-transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#6E4E37] hover:bg-gray-100 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};

export default OthersLive;
