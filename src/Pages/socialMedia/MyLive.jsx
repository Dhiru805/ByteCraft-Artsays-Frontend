import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
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
import { toast } from "react-toastify";
import EditLiveModal from "../../Pages/socialMedia/CreateModalLive";
import { LuEye } from "react-icons/lu";
import putAPI from "../../api/putAPI";
import postAPI from "../../api/postAPI";

const MyLive = () => {
  const { streamKey, username } = useParams();
  const [showChat, setShowChat] = useState(true);
  const [liveDetail, setLiveDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ stream, setStream ] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const videoRef = useRef(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
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
  const [isLiked, setIsLiked] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

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
const [ isConnecting, setIsConnecting ] = useState(false);
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
  
    fetchCategories();
  }, []);

  // Copy function - streamKey
  const handlesCopy = () => {
    if (liveDetail?.live?.streamKey) {
      navigator.clipboard.writeText(liveDetail?.live?.streamKey);
    }
  };

  // Setup Socket.IO for live metrics (viewers, views, likes)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const streamUrl = liveDetail?.live?.streamUrl;
    if (!userId || !streamUrl) return;

    // Initialize socket once per streamUrl
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

const updateStreamDuration = () => {
  if (streamStartTimeRef.current) {
    const elapsedTime = Date.now() - streamStartTimeRef.current;
    const formattedDuration = formatDuration(elapsedTime);
    setLiveDetail((prev) => ({
      ...prev,
      live: {
        ...prev?.live,
        streamDuration: formattedDuration,
      },
    }));
  }
};

// Format milliseconds to MM:SS or HH:MM:SS
const formatDuration = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

  // Apply delay logic using a rolling buffer
  const handleDelayChange = (newDelay) => {
    // Clear previous interval
    if (delayIntervalRef.current) {
      clearInterval(delayIntervalRef.current);
      delayIntervalRef.current = null;
    }

    setDelay(newDelay);

    if (newDelay === 0) {
      // Switch back to live player
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
      return;
    }

    // Reset last applied marker
    lastAppliedLenRef.current = 0;

    // Refresh the delayed playback every second
    delayIntervalRef.current = setInterval(() => {
      try {
        const chunks = chunksRef.current;
        const lagSeconds = Math.max(1, Math.floor(newDelay));
        if (!chunks || chunks.length <= lagSeconds) return;
        const cutoff = chunks.length - lagSeconds;
        if (cutoff === lastAppliedLenRef.current) return; // avoid redundant work
        const playable = chunks.slice(0, cutoff);
        const blob = new Blob(playable, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        if (delayedUrlRef.current) {
          URL.revokeObjectURL(delayedUrlRef.current);
        }
        delayedUrlRef.current = url;
        if (delayedVideoRef.current) {
          const v = delayedVideoRef.current;
          v.src = url;
          v.play().catch(() => {});
        }
        lastAppliedLenRef.current = cutoff;
      } catch (e) {
        console.warn("Delay update failed:", e);
      }
    }, 1000);
  };
 

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
  }, []);

   //Mic Function
  const handleMicToggle = () => {
  if (stream) {
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      setMicOn(audioTracks[0].enabled);
    }
  }
  };

  //Screenshare
  const handleScreenShare = async () => {
    try {
      // Capture screen (video only to avoid platform audio constraints)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      // Capture mic explicitly to combine with screen video
      let micStream = null;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Mic capture failed; proceeding without mic:", e);
      }

      // Build a combined stream: screen video + optional mic audio
      const tracks = [screenStream.getVideoTracks()[0]];
      if (micStream?.getAudioTracks?.()?.[0]) {
        tracks.push(micStream.getAudioTracks()[0]);
      }
      const outStream = new MediaStream(tracks);

      // Update player
      if (videoRef.current) {
        videoRef.current.srcObject = outStream;
        await videoRef.current.play().catch(() => {});
      }

      setStream(outStream);
      startRecorder(outStream);

      // When user stops screen share, revert to camera (do not end session)
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      if (screenVideoTrack) {
        screenVideoTrack.onended = async () => {
          try {
            const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
              videoRef.current.srcObject = cam;
              await videoRef.current.play().catch(() => {});
            }
            setStream(cam);
            startRecorder(cam);
          } catch (e) {
            console.error("Failed to revert to camera:", e);
            // Gracefully stop recorder if camera fails
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
              try { mediaRecorderRef.current.stop(); } catch (_) {}
            }
          }
        };
      }
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopLiveStream();
    };
  }, []);

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

    const fetchLive = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User not logged in");
          return;
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
        
        console.log("Media stream acquired:", newStream);
        console.log("Video tracks:", newStream.getVideoTracks().map(track => ({
          label: track.label,
          settings: track.getSettings(),
          capabilities: track.getCapabilities()
        })));
        console.log("Audio tracks:", newStream.getAudioTracks().map(track => ({
          label: track.label,
          settings: track.getSettings(),
          capabilities: track.getCapabilities()
        })));
      } catch (err) {
        console.error("getUserMedia error:", {
          name: err.name,
          message: err.message,
          constraint: err.constraint
        });
        let userMessage = "Failed to access camera/microphone";
        if (err.name === "NotAllowedError") {
          userMessage = "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (err.name === "NotFoundError") {
          userMessage = "No camera/microphone found. Please connect your devices and try again.";
        } else if (err.name === "NotSupportedError") {
          userMessage = "Media access not supported in this browser. Please use Chrome, Firefox, or Safari.";
        } else if (err.name === "SecurityError") {
          userMessage = "HTTPS required for media access. Please access the site over HTTPS.";
        }
        toast.error(userMessage);
        throw new Error(userMessage);
      }
      if (!newStream) {
        throw new Error("Failed to acquire media stream");
      }

      setStream(newStream);
      newStream.getAudioTracks().forEach((track) => (track.enabled = false));
      setMicOn(false);
      console.log("Stream and mic configured, micOn:", micOn);

      if (!videoRef.current) {
        console.error("videoRef.current is null, waiting for render...");
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!videoRef.current) {
          throw new Error("Video element is not available after delay. Please ensure the video player is rendered.");
        }
      }

      videoRef.current.srcObject = newStream;
      await videoRef.current.play().catch((err) => {
        console.error("Play error:", err);
        throw new Error(
          err.name === "NotAllowedError"
            ? "Autoplay blocked. User interaction may be required."
            : `Failed to play video: ${err.message}`
        );
      });
      console.log("Video playing successfully");

      // Initialize MediaRecorder (optional for local recording)
      startRecorder(newStream);

// Create live session and get streamUrl
  try {
    const userId = localStorage.getItem("userId");
    const response = await postAPI("/api/social-media/create-live", {
      userId,
      streamKey,
      title: "My Live Stream", // Adjust as needed
      description: "Live streaming now", // Adjust as needed
    }, true);
    if (response.data && response.data.success) {
      setLiveDetail(response.data.liveData);
      console.log("Live session created with streamUrl:", response.data.liveData.live.streamUrl);
    } else {
      throw new Error("Failed to create live session");
    }
  } catch (error) {
    console.error("Error creating live session:", error);
    toast.error(error.message || "Failed to start live stream");
  }

      setLiveDetail((prev) => ({
        ...prev,
        live: {
          ...prev?.live,
          isLive: true,
          streamDuration: "00:00",
        },
      }));
      console.log("liveDetail updated:", liveDetail);

      // Update database with isLive: true
      if (liveDetail?._id) {
        try {
          const updateResponse = await putAPI(`/api/social-media/update-live/${liveDetail?._id}`,
            {
              // userId: localStorage.getItem("userId"),
              live: {
                isLive: true,
                streamDuration: "00:00",
              },
            },
            true
          );
          console.log("Inside If block response: ", updateResponse);
          if (updateResponse.data && updateResponse.data.success) {
            console.log("Database updated with isLive: true");
          } else {
            console.error("Failed to update database:", updateResponse.data?.message || updateResponse.message);
          }
        } catch (error) {
          console.error("Error updating database:", error);
        }
      }

      // Notify viewers via Socket.IO only after successful setup
      if (socketRef.current && liveDetail?.live?.streamKey) {
        const roomName = `live-room-${liveDetail?.live?.streamKey}`;
        const userId = localStorage.getItem("userId");
        console.log('Joining streamer room:', roomName);
        socketRef.current.emit("startLive", {
          roomName: roomName,
          userId: userId
        });

        console.log('Emitted startLive to room:', roomName);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      streamStartTimeRef.current = null;
      setLiveDetail((prev) => ({
        ...prev,
        live: {
          ...prev?.live,
          streamDuration: "00:00",
        },
      }));
      setStream(null);
      setMicOn(false);
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
      }
      toast.error(error.message || "Failed to start live stream");
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

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Finalize duration in liveDetail
    if (streamStartTimeRef.current) {
      const elapsedTime = Date.now() - streamStartTimeRef.current;
      const finalDuration = formatDuration(elapsedTime);
      setLiveDetail((prev) => ({
        ...prev,
        live: {
          ...prev?.live,
          isLive: false,
          streamDuration: finalDuration,
        },
      }));
      streamStartTimeRef.current = null;

      // Update database with isLive: false
      if (liveDetail?._id) {
        putAPI(`/api/social-media/update-live/${liveDetail?._id}`, {
          // userId: localStorage.getItem("userId"),
          live: {
            isLive: false,
            streamDuration: finalDuration
          }
        }, true).then((updateResponse) => {
          if (updateResponse.data && updateResponse.data.success) {
            console.log("Database updated with isLive: false");
          } else {
            console.error("Failed to update database:", updateResponse.message);
          }
        }).catch((error) => {
          console.error("Error updating database:", error);
        });
      }
    }

    // Notify viewers via Socket.IO that stream ended
    if (socketRef.current && liveDetail?.live?.streamKey) {
      const roomName = `live-room-${liveDetail?.live?.streamKey}`;
      socketRef.current.emit("streamEnded", { roomName: roomName });
      console.log('Emitted streamEnded to room:', roomName);
    }

    // Safely stop MediaRecorder and finalize recording output
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        finalizeOnStopRef.current = true; // ensure onstop builds the final blob
        try { mediaRecorderRef.current.stop(); } catch (_) {}
      } else if (chunksRef.current.length > 0) {
        // If already inactive but chunks exist, finalize immediately
        try {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setRecordedUrl(url);
        } catch (_) {}
        chunksRef.current = [];
      }
    }

    // Cleanup delay resources
    if (delayIntervalRef.current) {
      clearInterval(delayIntervalRef.current);
      delayIntervalRef.current = null;
    }
    if (delayedUrlRef.current) {
      try { URL.revokeObjectURL(delayedUrlRef.current); } catch (_) {}
      delayedUrlRef.current = null;
    }

    // Leave the room
    if (socketRef.current && liveDetail?.live?.streamKey) {
      const roomName = `live-room-${liveDetail?.live?.streamKey}`;
      socketRef.current.emit("leaveLiveStream", { roomName: roomName });
    }

    toast.success("Live stream ended");
  };

   // Start stream when component mounts if liveDetail indicates a live session
  useEffect(() => {
    if (liveDetail?.live?.isLive) {
      // Reset duration to 00:00 when auto-starting a live session
      setLiveDetail((prev) => ({
        ...prev,
        live: {
          ...prev?.live,
          streamDuration: "00:00"
        }
      }));
    }
  }, [liveDetail?.live?.isLive]);
  
  // Handle modal visibility
  const handleEditClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", liveDetail?.live?.streamKey);

      socketRef.current.on("receiveMessage", (msg) => {
        setLiveDetail((prev) => ({
          ...prev,
          live: {
            ...prev.live,
            chatMessages: [...(prev.live.chatMessages || []), msg]
          }
        }));
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off("receiveMessage");
        }
      };
    }
  }, [liveDetail?.live?.streamKey])

  const handleStreamerSend = () => {
    if (socketRef.current && streamerMessage.trim()) {
      socketRef.current.emit("sendMessage", {
        streamKey: liveDetail?.live?.streamKey,
        message: streamerMessage,
      });
      setStreamerMessage("");
    }
  };

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
              {delay === 0 ? (
                stream ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                    autoPlay
                    muted
                  />
                ) : recordedUrl ? (
                <video 
                  src={recordedUrl}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                  <img
                    src={liveDetail?.thumbnail ? `${process.env.REACT_APP_API_URL}/${String(liveDetail.thumbnail).replace(/\\/g, "/")}` : ""}
                    alt={`Thumbnail for ${liveDetail?.title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )) : (
                  <video
                    ref={delayedVideoRef}
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                    autoPlay
                    muted
                  />
                )}
              {/* Top-left overlays (live badge, timer, counts) */}
              <div className="absolute top-2 left-2 flex gap-2 z-10">
                <div className="flex items-center bg-black/70 text-white px-3 py-2 rounded-md text-sm font-semibold">
                  <span className="bg-red-500 text-white p-1">Live</span>
                  <span className="bg-white text-[#000] p-1">
                    {liveDetail?.live?.streamDuration || "00:00"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#000] px-1 py-1">
                  <span><FaUserGroup /></span>
                  <span>{currentViewers || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-[#000] px-1 py-1 text-[14px]">
                  <span><i className="ri-thumb-up-line"></i></span>
                  <span>{liveDetail?.live?.likeCount || 0}</span>
                </div>
              </div>
              {/* Stream control bar */}
              <div className="absolute left-1/2 justify-center w-full p-1.5 bottom-1 transform -translate-x-1/2 flex items-center gap-4 bg-transparent shadow-lg text-lg border-t-[1px] border-[#000000]">
                <div className="flex gap-3 items-center">
                  <button aria-label="Camera" className="p-2 flex items-center justify-center" onClick={startLiveStream}>
                    <FaCamera size={20} className="text-black" />
                  </button>
                  <button aria-label="Mic" className="p-2 flex items-center justify-center" onClick={handleMicToggle}>
                    <IoMic size={20} className={micOn ? "text-green-400" : "text-black"} />
                  </button>
                  <button aria-label="Share" className="p-2 flex items-center justify-center" onClick={handleScreenShare}>
                    <MdOutlineIosShare size={20} className="text-black" />
                  </button>
                  <button aria-label="Send" className="p-2 flex items-center justify-center" onClick={() => setShowShare(!showShare)}>
                    <IoPaperPlaneOutline size={20} className="text-black" />
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
                            onClick={handleCopy}
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
                  {liveDetail?.live?.chatMessages?.map((item) => (
                    <div key={item._id} className="flex gap-1 mb-2 items-center">
                      <img
                        src={item.user?.profilePhoto}
                        alt={`${item.user?.username} avatar`}
                        className="w-11 h-11 rounded-full flex-shrink-0"
                      />
                      <div className="flex gap-1 text-[14px] text-[#000000]">
                        <h2 className="font-semibold">{item.user?.username}</h2>
                        <span>:</span>
                        <p className="font-medium">{item.message}</p>
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
                      value={streamerMessage}
                      onChange={(e) => setStreamerMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleStreamerSend()}
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
                {categories?.find(cat => String(cat._id) === String(liveDetail?.category))?.mainCategoryName}
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
            {showModal && <EditLiveModal onClose={handleModalClose} liveDetail={liveDetail} fetchLive={fetchLive}/>}
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
                          {showKey ? liveDetail?.live?.streamKey : "••••••••••••••••••"}
                      </span>
                      <button aria-label="Reveal" className="ml-2 text-gray-500" type="button" onClick={() => setShowKey((prev) => !prev)}>
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
                      <span className="sm:text-[18px] text-[10px] font-bold">
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
                <div value={delay} onChange={(e) => handleDelayChange(Number(e.target.value))} className="flex flex-col gap-1 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="latency"
                      className="radio"
                      value={0}
                      checked={delay === 0}
                      onChange={() => handleDelayChange(0)}
                    />
                    <span className="text-[16px] text-[#000000] font-medium">No Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="latency"
                      className="radio"
                      value={10}
                      checked={delay === 10}
                      onChange={() => handleDelayChange(10)}
                    />
                    <span className="text-[16px] text-[#000000] font-medium">10s Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="latency"
                      className="radio"
                      value={30}
                      checked={delay === 30}
                      onChange={() => handleDelayChange(30)}
                    />
                    <span className="text-[16px] text-[#000000] font-medium">30s Delay</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="latency"
                      className="radio"
                      value={60}
                      checked={delay === 60}
                      onChange={() => handleDelayChange(60)}
                    />
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