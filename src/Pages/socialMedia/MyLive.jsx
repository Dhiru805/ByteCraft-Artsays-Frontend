import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
// import NavBar from "../Home/HomeComponents/NavBar";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaCamera, FaRegEyeSlash  } from "react-icons/fa";
import { IoMic } from "react-icons/io5";
import { MdOutlineIosShare } from "react-icons/md";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import getAPI from "../../api/getAPI";
import { toast } from "react-toastify";
import EditLiveModal from "../../Pages/socialMedia/CreateModalLive";
import { LuEye } from "react-icons/lu";
import putAPI from "../../api/putAPI";
import postAPI from "../../api/postAPI";

const MyLive = () => {
  const { streamKey } = useParams();
  const [showChat, setShowChat] = useState(true);
  const [liveDetail, setLiveDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ stream, setStream ] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const videoRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isYoutubeActive, setIsYoutubeActive] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [categories, setCategories] = useState();
  const [recordedUrl, setRecordedUrl] = useState(null);
  const mediaRecorderRef = useRef();
  const chunksRef = useRef([]);
  const delayedVideoRef = useRef(null);
  const [delay, setDelay] = useState(0);
  const timerRef = useRef(null);
  const streamStartTimeRef = useRef(null);
  const finalizeOnStopRef = useRef(false);
  const delayIntervalRef = useRef(null);
  const delayedUrlRef = useRef(null);
  const lastAppliedLenRef = useRef(0);
  const capSecondsRef = useRef(120);
  const socketRef = useRef(null);
  const [currentViewers, setCurrentViewers] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isLiked, setIsLiked] = useState(false);

   // WebRTC Configuration - Enhanced for better compatibility
    const rtcConfig = {
  iceServers: [
    // Primary STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.nextcloud.com:443' }
  ],
  iceTransportPolicy: 'all',
  iceCandidatePoolSize: 10,
  // Enhanced codec preferences for better compatibility
  sdpSemantics: 'unified-plan',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

const peerConnectionsRef = useRef({}); // Store peer connections for multiple viewers
// eslint-disable-next-line no-unused-vars
const [ isConnecting, setIsConnecting ] = useState(false);
// eslint-disable-next-line no-unused-vars
const [streamer, setStreamer] = useState(null);
const [streamerMessage, setStreamerMessage] = useState("");

// Socket setup for streamer
useEffect(() => {
  const socket = io(process.env.REACT_APP_API_BASE, { 
    transports: ["websocket", "polling"],
    timeout: 5000
  });
  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("Streamer socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Streamer socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Streamer socket connection error:", error);
  });

  // Handle viewer joining
  socket.on("viewerJoined", (data) => {
    const { roomName, viewerSocketId } = data;
    const expectedRoom = `live-room-${liveDetail?.live?.streamKey}`;
    if (roomName === expectedRoom && !peerConnectionsRef.current[viewerSocketId]) {
      console.log(`New viewer joined room ${roomName}:`, viewerSocketId);
      initializePeerConnection(viewerSocketId);
    }
  });

  // Handle viewer answer
  socket.on("viewerAnswer", async (data) => {
    const { roomName, answer } = data;
    const expectedRoom = `live-room-${liveDetail?.live?.streamKey}`;
    if (roomName === expectedRoom) {
      // Find the correct peer connection for this viewer
      const viewerSocketId = Object.keys(peerConnectionsRef.current).find(id => 
        peerConnectionsRef.current[id] && !peerConnectionsRef.current[id].closed
      );
      
      if (viewerSocketId && peerConnectionsRef.current[viewerSocketId]) {
        try {
          await peerConnectionsRef.current[viewerSocketId].setRemoteDescription(new RTCSessionDescription(answer));
          console.log(`Set remote description for viewer ${viewerSocketId}`);
        } catch (error) {
          console.error(`Error setting remote description for ${viewerSocketId}:`, error);
        }
      } else {
        console.warn(`No active peer connection found for viewer answer in room ${roomName}`);
      }
    }
  });

  // Handle viewer ICE candidate
  socket.on("viewerIceCandidate", async (data) => {
    const { roomName, candidate } = data;
    const expectedRoom = `live-room-${liveDetail?.live?.streamKey}`;
    if (roomName === expectedRoom) {
      // Find the correct peer connection for this viewer
      const viewerSocketId = Object.keys(peerConnectionsRef.current).find(id => 
        peerConnectionsRef.current[id] && !peerConnectionsRef.current[id].closed
      );
      
      if (viewerSocketId && peerConnectionsRef.current[viewerSocketId]) {
        try {
          await peerConnectionsRef.current[viewerSocketId].addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`Added ICE candidate from viewer ${viewerSocketId}`);
        } catch (error) {
          console.error(`Error adding ICE candidate from ${viewerSocketId}:`, error);
        }
      } else {
        console.warn(`No active peer connection found for ICE candidate in room ${roomName}`);
      }
    }
  });

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      if (pc) pc.close();
    });
    peerConnectionsRef.current = {};
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [liveDetail?.live?.streamKey]);

const initializePeerConnection = (viewerSocketId) => {
  if (!stream) {
    console.error("No local stream available for peer connection");
    return;
  }

  const pc = new RTCPeerConnection(rtcConfig);
  peerConnectionsRef.current[viewerSocketId] = pc;

  // Add local stream tracks to peer connection
  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
    console.log(`Added track to peer connection: ${track.kind}`);
  });

  pc.onicecandidate = (event) => {
    if (event.candidate && socketRef.current) {
      const roomName = `live-room-${liveDetail?.live?.streamKey}`;
      socketRef.current.emit("streamerIceCandidate", {
        roomName: roomName,
        candidate: event.candidate,
        viewerSocketId: viewerSocketId
      });
      console.log(`Generated ICE candidate for viewer ${viewerSocketId}`);
    }
  };

  pc.onconnectionstatechange = () => {
    console.log(`Peer connection state for ${viewerSocketId}:`, pc.connectionState);
    if (pc.connectionState === 'failed') {
      console.error(`Peer connection failed for ${viewerSocketId}`);
      // Clean up failed connection
      delete peerConnectionsRef.current[viewerSocketId];
      pc.close();
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log(`ICE connection state for ${viewerSocketId}:`, pc.iceConnectionState);
  };

  // Create and send offer with enhanced codec preferences
  pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  })
    .then(async (offer) => {
      // Modify SDP to prefer VP8/VP9 over H.264 for better browser compatibility
      offer.sdp = offer.sdp.replace(/m=video (\d+) RTP\/SAVPF (\d+)/, (match, port, payloadTypes) => {
        // Prefer VP8 (96), VP9 (98), H.264 (100) in that order
        return `m=video ${port} RTP/SAVPF 96 98 100`;
      });
      
      // Add codec-specific parameters for better compatibility
      offer.sdp = offer.sdp.replace(/a=rtpmap:96 VP8\/90000/, 'a=rtpmap:96 VP8/90000\r\na=fmtp:96 max-fr=60;max-fs=8192');
      offer.sdp = offer.sdp.replace(/a=rtpmap:98 VP9\/90000/, 'a=rtpmap:98 VP9/90000\r\na=fmtp:98 max-fr=60;max-fs=8192');
      
      await pc.setLocalDescription(offer);
      
      const roomName = `live-room-${liveDetail?.live?.streamKey}`;
      if (socketRef.current) {
        socketRef.current.emit("streamerOffer", {
          roomName: roomName,
          offer: offer,
          viewerSocketId: viewerSocketId
        });
        console.log(`Sent enhanced streamerOffer to viewer ${viewerSocketId} in room ${roomName}`);
      }
    })
    .catch((error) => {
      console.error(`Error creating offer for viewer ${viewerSocketId}:`, error);
      // Clean up on error
      delete peerConnectionsRef.current[viewerSocketId];
      pc.close();
    });
};



// Logic added till here from above

  // Start or restart MediaRecorder on the provided stream
  const startRecorder = (srcStream) => {
    if (!srcStream) return;
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch (_) {}
      }
      const preferredMime = "video/webm;codecs=vp8,opus";
      const mimeType = (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(preferredMime))
        ? preferredMime
        : "video/webm";
      const recorder = new MediaRecorder(srcStream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          // Trim rolling buffer to avoid unbounded growth
          const maxKeep = Math.max(60, Number(capSecondsRef.current || 120));
          if (chunksRef.current.length > maxKeep) {
            chunksRef.current.splice(0, chunksRef.current.length - maxKeep);
          }
        }
      };
      recorder.onstop = () => {
        // Only finalize into a single blob when explicitly ending the session
        if (finalizeOnStopRef.current) {
          try {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setRecordedUrl(url);
          } catch (_) {}
          chunksRef.current = [];
          finalizeOnStopRef.current = false;
        }
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      console.log("MediaRecorder started with:", mimeType);
    } catch (err) {
      console.error("Failed to start MediaRecorder:", err);
    }
  };

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
  
  // State
  const [liveDetail, setLiveDetail] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [streamDelay, setStreamDelay] = useState('none');
  const [timer, setTimer] = useState(0);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const delayedStreamRef = useRef(null); // Delayed stream for viewers
  const frameBufferRef = useRef([]); // Buffer for delayed frames
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const delayIntervalRef = useRef(null);
  const viewersRef = useRef(new Set()); // Track all connected viewer IDs
  const peerConnectionsRef = useRef({}); // Store peer connections for each viewer

  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Calculate thumbnail URL
  const thumbnailUrl = React.useMemo(() => {
    let thumb = liveDetail?.thumbnail;
    if (thumb && !thumb.startsWith('http') && !thumb.startsWith('data:')) {
      const cleanPath = thumb.startsWith('/') ? thumb.slice(1) : thumb;
      thumb = `${process.env.REACT_APP_API_URL}/${cleanPath}`;
    }
    return thumb;
  }, [liveDetail]);

  // Handle send message (creator)
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'Creator';
    const profilePhoto = localStorage.getItem('profilePhoto');

    setNewMessage('');
    
    if (socketRef.current) {
      try { socketRef.current.disconnect(); } catch (_) {}
      socketRef.current = null;
    }
    const socket = io(process.env.REACT_APP_API_BASE, { transports: ["websocket"] });
    socketRef.current = socket;

    // Join room and request like status
    socket.emit("joinLive", { streamUrl, userId });
    socket.emit("getLikeStatus", { streamUrl, userId });

    // Listeners
    const handleViewers = (payload) => {
      if (!payload || payload.streamUrl !== streamUrl) return;
      if (typeof payload.currentViewers === "number") setCurrentViewers(payload.currentViewers);
      if (typeof payload.totalViews === "number") {
        setLiveDetail((prev) => ({
          ...prev,
          live: { ...prev?.live, viewCount: payload.totalViews },
        }));
      }
    };
    socket.on("viewersCountUpdated", handleViewers);

    const handleLikeCount = (payload) => {
      if (!payload || payload.streamUrl !== streamUrl) return;
      if (typeof payload.likeCount === "number") {
        setLiveDetail((prev) => ({
          ...prev,
          live: { ...prev?.live, likeCount: payload.likeCount },
        }));
      }
      if (typeof payload.isLiked === "boolean" && payload.userId === userId) setIsLiked(payload.isLiked);
    };
    socket.on("likeCountUpdated", handleLikeCount);
    socket.on("likeToggleSuccess", handleLikeCount);

    const handleLikeStatus = (payload) => {
      if (!payload || payload.streamUrl !== streamUrl) return;
      if (typeof payload.isLiked === "boolean") setIsLiked(payload.isLiked);
    };
    socket.on("likeStatus", handleLikeStatus);

    return () => {
      try {
        socket.emit("leaveLive", { streamUrl, userId });
        socket.off("viewersCountUpdated", handleViewers);
        socket.off("likeCountUpdated", handleLikeCount);
        socket.off("likeToggleSuccess", handleLikeCount);
        socket.off("likeStatus", handleLikeStatus);
        socket.disconnect();
      } catch (_) {}
      socketRef.current = null;
    };
  }, [liveDetail?.live?.streamUrl]);

  // eslint-disable-next-line no-unused-vars
  const handleToggleLike = () => {
    const userId = localStorage.getItem("userId");
    const streamUrl = liveDetail?.live?.streamUrl;
    if (!userId || !streamUrl || !socketRef.current) return;
    socketRef.current.emit("toggleLike", { streamUrl, userId });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveDetail?.live?.streamUrl);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Create delayed stream for viewers
  const createDelayedStream = useCallback((originalStream, delaySeconds) => {
    // Clear any existing delay resources first
    if (delayIntervalRef.current) {
      clearInterval(delayIntervalRef.current);
      delayIntervalRef.current = null;
    }
    frameBufferRef.current = [];

    if (delaySeconds === 0 || delaySeconds === 'none') {
      delayedStreamRef.current = originalStream;
      return originalStream;
    }

    // Create two canvases - one for capturing, one for output
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = 1280;
    captureCanvas.height = 720;
    const captureCtx = captureCanvas.getContext('2d');

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = 1280;
    outputCanvas.height = 720;
    const outputCtx = outputCanvas.getContext('2d');
    canvasRef.current = outputCanvas;

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Create hidden video element to capture frames
    const hiddenVideo = document.createElement('video');
    hiddenVideo.srcObject = originalStream;
    hiddenVideo.muted = true;
    hiddenVideo.playsInline = true;
    hiddenVideo.play();

    const delayMs = delaySeconds * 1000;

    // Use requestAnimationFrame for smoother capture
    let lastCaptureTime = 0;
    const captureInterval = 1000 / 30; // 30 fps

    const captureAndRender = (timestamp) => {
      if (!delayIntervalRef.current) return; // Stopped

      if (timestamp - lastCaptureTime >= captureInterval) {
        lastCaptureTime = timestamp;

        if (hiddenVideo.readyState >= 2) {
          // Capture current frame to capture canvas
          captureCtx.drawImage(hiddenVideo, 0, 0, 1280, 720);
          
          // Store frame with timestamp
          frameBufferRef.current.push({
            imageData: captureCtx.getImageData(0, 0, 1280, 720),
            timestamp: Date.now()
          });

          // Find and render the frame that should be shown (delayed by X seconds)
          const targetTime = Date.now() - delayMs;
          
          // Find the frame closest to target time
          let frameToShow = null;
          while (frameBufferRef.current.length > 0) {
            const oldestFrame = frameBufferRef.current[0];
            if (oldestFrame.timestamp <= targetTime) {
              frameToShow = frameBufferRef.current.shift();
            } else {
              break;
            }
          }

          // Draw the delayed frame to output canvas
          if (frameToShow) {
            outputCtx.putImageData(frameToShow.imageData, 0, 0);
          }
        }
      }

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopLiveStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

    //handleYoutubeShare
    // eslint-disable-next-line no-unused-vars
    const handleYoutubeShare = () => {
    const link = prompt("Enter YouTube video link:");
    if (link) {
      setYoutubeUrl(link);
      setIsYoutubeActive(true);
    }
    };

    // eslint-disable-next-line no-unused-vars
    const stopYoutubeShare = () => {
      setYoutubeUrl("");
      setIsYoutubeActive(false);
    };

    // Create delayed video stream from output canvas
    const delayedVideoStream = outputCanvas.captureStream(30);
    const delayedVideoTrack = delayedVideoStream.getVideoTracks()[0];

    // Handle audio delay using AudioContext
    const audioTrack = originalStream.getAudioTracks()[0];
    let delayedAudioTrack = audioTrack;

    if (audioTrack && delaySeconds > 0) {
      try {
        // Close existing audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        if (!streamKey) {
          toast.error("Stream key not found in URL");
          return;
        }

        const res = await getAPI(`/api/social-media/live/${streamKey}`); 
        console.log("API Response:", res.data);

        const live = res?.data?.liveData;

        if (live) {
          // Reset streamDuration to 00:00 if not currently live
          const updatedLive = {
            ...live,
            live: {
              ...live.live,
              streamDuration: live.live?.isLive ? live.live.streamDuration : "00:00"
            }
          };
          setLiveDetail(updatedLive); 
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
    
    useEffect(() => {
      fetchLive();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streamKey]);

    useEffect(() => {
      console.log("videoRef updated:", videoRef.current);
    }, [videoRef]);

    // Request camera access
  const startLiveStream = async () => {
    console.log("startLiveStream called, videoRef.current:", videoRef.current);
    try {
      console.log("Starting live stream...");
      if (stream) {
        console.log("Stopping existing stream...");
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        if (videoRef.current) {
          console.log("Clearing video srcObject...");
          videoRef.current.srcObject = null;
        }
      }

      if (timerRef.current) {
        console.log("Clearing existing timer...");
        clearInterval(timerRef.current);
      }
      streamStartTimeRef.current = Date.now();
      timerRef.current = setInterval(updateStreamDuration, 1000);
      console.log("Timer started, start time:", streamStartTimeRef.current);

      // Ensure duration is reset to 00:00 when starting
      setLiveDetail((prev) => ({
        ...prev,
        live: {
          ...prev?.live,
          streamDuration: "00:00",
        },
      }));

      console.log("Requesting media stream...");
      let newStream;
      try {
        // Enhanced video constraints for better compatibility
        const videoConstraints = {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: "user",
          // Prefer hardware acceleration
          advanced: [
            { width: 1280, height: 720 },
            { width: 854, height: 480 },
            { width: 640, height: 360 }
          ]
        };

        const audioConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        };

        newStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints,
        });
        
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(new MediaStream([audioTrack]));
        
        // DelayNode max is 179 seconds, so we're safe up to 60s
        const delayNode = audioContextRef.current.createDelay(180);
        delayNode.delayTime.value = delaySeconds;
        
        const destination = audioContextRef.current.createMediaStreamDestination();
        
        source.connect(delayNode);
        delayNode.connect(destination);
        
        delayedAudioTrack = destination.stream.getAudioTracks()[0];
      } catch (error) {
        console.error('Error creating audio delay:', error);
      }
    }

    // Combine delayed video and audio
    const delayedStream = new MediaStream();
    delayedStream.addTrack(delayedVideoTrack);
    if (delayedAudioTrack) {
      delayedStream.addTrack(delayedAudioTrack);
    }

    delayedStreamRef.current = delayedStream;
    console.log(`Stream delay created: ${delaySeconds}s`);
    return delayedStream;
  }, []);

  // Update delayed stream when delay changes
  useEffect(() => {
    if (isLive && streamRef.current) {
      const delaySeconds = streamDelay === 'none' ? 0 : parseInt(streamDelay);
      const delayedStream = createDelayedStream(streamRef.current, delaySeconds);
      
      // Update all peer connections with the new delayed stream
      Object.entries(peerConnectionsRef.current).forEach(([viewerId, pc]) => {
        const senders = pc.getSenders();
        
        delayedStream.getTracks().forEach(newTrack => {
          const sender = senders.find(s => s.track && s.track.kind === newTrack.kind);
          if (sender) {
            sender.replaceTrack(newTrack);
          }
        });
      });
      
      toast.info(`Stream delay set to ${delaySeconds === 0 ? 'none' : delaySeconds + 's'}`);
    }
  }, [streamDelay, isLive, createDelayedStream]);

  // Cleanup delay resources
  useEffect(() => {
    return () => {
      // Set to null/false to stop requestAnimationFrame loop
      delayIntervalRef.current = null;
      frameBufferRef.current = [];
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Fetch live details
  const fetchLive = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/social-media/live/${streamKey}`);
      if (response.data.success) {
        setLiveDetail(response.data.liveData);
        setLikeCount(response.data.liveData.live?.likeCount || 0);
        setViewerCount(response.data.liveData.live?.viewCount || 0);
        
        // Store creator info in localStorage if not present
        if (response.data.liveData.userId) {
          const creatorId = response.data.liveData.userId._id || response.data.liveData.userId;
          const creatorName = response.data.liveData.userId.username || response.data.liveData.userId.name;
          const creatorPhoto = response.data.liveData.userId.profilePhoto;
          
          if (!localStorage.getItem('username') || localStorage.getItem('userId') === creatorId) {
            localStorage.setItem('username', creatorName || 'Creator');
            if (creatorPhoto) localStorage.setItem('profilePhoto', creatorPhoto);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching live:', error);
      toast.error('Failed to load live stream details');
    }
  }, [streamKey]);

  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  // Create peer connection for a specific viewer
  const createPeerConnectionForViewer = useCallback(async (viewerSocketId) => {
    try {
      console.log('Creating peer connection for viewer:', viewerSocketId);
      
      // Use delayed stream for viewers, fall back to original stream
      const streamToSend = delayedStreamRef.current || streamRef.current;
      console.log('Current stream tracks:', streamToSend?.getTracks());
      
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionsRef.current[viewerSocketId] = peerConnection;

      // Add delayed stream tracks to peer connection (viewers get the delayed version)
      if (streamToSend) {
        streamToSend.getTracks().forEach(track => {
          console.log('Adding track to peer connection:', track.kind);
          peerConnection.addTrack(track, streamToSend);
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
  }, [streamKey]);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      // Creator joins their own stream room
      socketRef.current.emit('joinLive', { streamKey, userId: localStorage.getItem('userId') });
    });

    // Handle new viewer joining
    socketRef.current.on('newViewer', async ({ viewerSocketId }) => {
      console.log('New viewer joined:', viewerSocketId);
      viewersRef.current.add(viewerSocketId);
      if (streamRef.current) {
        await createPeerConnectionForViewer(viewerSocketId);
      }
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

    // Handle like count updates
    socketRef.current.on('likeCountUpdate', ({ count }) => {
      setLikeCount(count);
    });

    // Handle incoming chat messages
    socketRef.current.on('newMessage', ({ username, text, profilePhoto, isCreator }) => {
      console.log('New message received:', { username, text, isCreator });
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: username,
        text: text,
        avatar: profilePhoto || `https://i.pravatar.cc/150?u=${username}`,
        isCreator: isCreator || false
      }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [streamKey, createPeerConnectionForViewer]);

  // Start live stream
  const startLiveStream = async () => {
    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      
      // Apply current mic/camera states
      stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
      stream.getVideoTracks().forEach(track => track.enabled = isCameraOn);

      // Show original stream to broadcaster (no delay for self-preview)
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create delayed stream for viewers
      const delaySeconds = streamDelay === 'none' ? 0 : parseInt(streamDelay);
      createDelayedStream(stream, delaySeconds);

      // Notify server that streaming has started
      console.log('Emitting startLive with streamKey:', streamKey);
      socketRef.current.emit('startLive', { streamKey });

      socketRef.current.on('liveStarted', ({ success }) => {
        console.log('Received liveStarted response:', success);
        if (success) {
          setIsLive(true);
          toast.success(`Live stream started!${delaySeconds > 0 ? ` (${delaySeconds}s delay)` : ''}`);
          
          // Start connections for all waiting viewers
          viewersRef.current.forEach(viewerId => {
            createPeerConnectionForViewer(viewerId);
          });
        }
      });

    } catch (error) {
      console.error('Error starting live:', error);
      toast.error('Failed to start live stream. Please check camera permissions.');
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
      toast.info(`Microphone ${!isMicOn ? 'enabled' : 'disabled'}`);
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
      toast.info(`Camera ${!isCameraOn ? 'enabled' : 'disabled'}`);
    } else {
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track in all peer connections
        Object.values(peerConnectionsRef.current).forEach(pc => {
          const senders = pc.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        });

        // Update local video
        if (videoRef.current) {
          const audioTrack = streamRef.current?.getAudioTracks()[0];
          const newStream = new MediaStream([screenTrack]);
          if (audioTrack) newStream.addTrack(audioTrack);
          videoRef.current.srcObject = newStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
        toast.success('Screen sharing started');
      } else {
        await stopScreenShare();
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast.error('Failed to share screen');
    }
  };

  const stopScreenShare = async () => {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      const cameraTrack = cameraStream.getVideoTracks()[0];

      // Replace track in all peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => {
        const senders = pc.getSenders();
        const videoSender = senders.find(s => s.track && s.track.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(cameraTrack);
        }
      });

      // Update local video and streamRef
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      
      // Stop old tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      streamRef.current = cameraStream;

      // Re-apply mic/camera states
      cameraStream.getAudioTracks().forEach(track => track.enabled = isMicOn);
      cameraStream.getVideoTracks().forEach(track => track.enabled = isCameraOn);

      setIsScreenSharing(false);
      toast.info('Screen sharing stopped');
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  // Stop live stream
  const stopLiveStream = () => {
    // Capture thumbnail from video before stopping (fallback only)
    let capturedThumbnail = null;
    if (!liveDetail?.thumbnail && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        capturedThumbnail = canvas.toDataURL('image/jpeg', 0.7);
      } catch (e) {
        console.error('Failed to capture thumbnail', e);
      }
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop delayed stream tracks
    if (delayedStreamRef.current) {
      delayedStreamRef.current.getTracks().forEach(track => track.stop());
      delayedStreamRef.current = null;
    }

    // Clean up delay resources
    // Stop delay loop (set to null to break requestAnimationFrame)
    delayIntervalRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    frameBufferRef.current = [];

    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};

    // Notify server
    socketRef.current.emit('stopLive', { streamKey });

    setIsLive(false);
    toast.info('Live stream stopped');

    // Process thumbnail URL
    let finalThumbnail = liveDetail?.thumbnail;
    if (finalThumbnail && !finalThumbnail.startsWith('http') && !finalThumbnail.startsWith('data:')) {
      // Remove leading slash if present to avoid double slashes if API_URL has one
      const cleanPath = finalThumbnail.startsWith('/') ? finalThumbnail.slice(1) : finalThumbnail;
      finalThumbnail = `${process.env.REACT_APP_API_URL}/${cleanPath}`;
    }
    
    // Navigate to Post Live page with analytics
    navigate('/artsays-community/post-live', {
      state: {
        totalViews: viewerCount,
        comments: messages.length,
        likes: likeCount,
        name: liveDetail?.username || localStorage.getItem('username') || 'Creator',
        thumbnail: finalThumbnail || capturedThumbnail || 'https://via.placeholder.com/150',
        description: liveDetail?.title || 'Live Stream',
        duration: formatTime(timer),
        streamKey: streamKey
      }
    });
  };

  return (
    <div className="flex flex-col w-full bg-[#F9F9F9]">
      <div 
        className="mx-auto w-full bg-white border border-[#48372D] rounded-[10px] p-6 shadow-sm mb-[-30px]"
        style={{ 
          width: '1216.65px', 
          minHeight: '1372.98px',
          marginTop: '20px',
          maxWidth: '95%'
        }}
      >
        {/* Top Section: Video and Chat */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Video Player Area */}
          <div className="flex-1 relative bg-black rounded-xl overflow-hidden aspect-video shadow-lg group">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Thumbnail Overlay (Before Live) */}
            {!isLive && thumbnailUrl && (
              <div className="absolute inset-0 z-10">
                <img 
                  src={thumbnailUrl} 
                  alt="Stream Thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}

            {/* Center Go Live Button (Before Live) */}
            {!isLive && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                 <button 
                    onClick={startLiveStream}
                    className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-red-700 transition shadow-lg transform hover:scale-105"
                  >
                    Go Live
                  </button>
              </div>
            )}
            
            {/* Video Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-30">
              <div className="bg-[#FF0000] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                LIVE
              </div>
              <div className="bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-medium">
                {formatTime(timer)}
              </div>
              <div className="bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                <FaUsers className="text-[12px]" /> {viewerCount}
              </div>
              <div className="bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                <FaThumbsUp className="text-[12px]" /> {likeCount}
              </div>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
              <div className="flex items-center justify-center gap-6">
                {/* Control Buttons */}
                <button 
                  onClick={toggleCamera}
                  className={`p-2 rounded-full transition ${isCameraOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white'}`}
                  title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  <FaCamera size={20} />
                </button>
                <button 
                  onClick={toggleMic}
                  className={`p-2 rounded-full transition ${isMicOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white'}`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  <FaMicrophone size={20} />
                </button>
                <button 
                  onClick={toggleScreenShare}
                  className={`p-2 rounded-full transition ${isScreenSharing ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
                >
                  <FaUpload size={20} />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
                  <FaPaperPlane size={20} />
                </button>

                {/* End Stream Button (Only visible when live) */}
                {isLive && (
                  <button 
                    onClick={stopLiveStream}
                    className="bg-white text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                  >
                    End Stream
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:w-[380px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[500px] lg:h-auto">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <span>Top Chat</span>
                <FaChevronDown size={12} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaEllipsisV size={14} />
                <FaTimes size={14} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Real-time Chat Messages */}
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((chat, i) => (
                  <div key={chat.id || i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img src={chat.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm">
                      <span className={`mr-2 ${chat.isCreator ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>{chat.user}:</span>
                      <span className="text-gray-700">{chat.text}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100">
              <div className="bg-[#F9F9F9] rounded-lg p-2">
                <div className="flex items-center gap-2 mb-2">
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
                      placeholder="Add a comment" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      <FaSmile size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    className="px-3 py-2 bg-[#48372D] text-white rounded-lg hover:bg-[#3a2c24] transition-colors"
                  >
                    <FaPaperPlane size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Info Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Title</div>
              <div className="font-bold text-gray-800">{liveDetail?.title || 'Vikas Khanna'}</div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Category</div>
              <div className="font-bold text-gray-800">{liveDetail?.category || 'Arts and Art Products'}</div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Privacy</div>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <FaGlobeAmericas size={14} className="text-gray-500" />
                <span>Public</span>
              </div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Viewers</div>
              <div className="font-bold text-gray-800">{viewerCount}</div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Likes</div>
              <div className="font-bold text-gray-800">{likeCount}</div>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#48372D] text-white px-8 py-4 font-bold hover:bg-[#3a2c24] transition"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Bottom Section: Create Stream */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Create Stream</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Stream Keys */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stream key</label>
                <div className="text-xs text-gray-500 mb-2">Select stream key</div>
                <select className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                  <option>Default stream key (RTMP, Variable)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stream key (paste in encoder)</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type={showStreamKey ? "text" : "password"} 
                      value={streamKey} 
                      readOnly
                      className="w-full border border-gray-300 rounded-md p-2 pr-10 text-sm bg-gray-50"
                    />
                    <button 
                      onClick={() => setShowStreamKey(!showStreamKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showStreamKey ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(streamKey);
                      toast.success('Stream key copied!');
                    }}
                    className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stream URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock size={12} />
                    </div>
                    <input 
                      type="text" 
                      value={viewerUrl} 
                      readOnly
                      className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm bg-gray-50"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(viewerUrl);
                      toast.success('Stream URL copied!');
                    }}
                    className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Stream Delay */}
            <div className="lg:w-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-bold text-gray-700">Stream Delay</label>
                <FaQuestionCircle size={14} className="text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {[
                  { label: '5s Delay', value: '5' },
                  { label: '15s Delay', value: '15' },
                  { label: '30s Delay', value: '30' },
                  { label: '60s Delay', value: '60'}
                ].map((option) => (
                  <label 
                    key={option.value} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setStreamDelay(option.value)}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${streamDelay === option.value ? 'border-orange-500' : 'border-gray-300 group-hover:border-orange-500'}`}>
                      {streamDelay === option.value && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                    </div>
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </label>
                ))}
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
