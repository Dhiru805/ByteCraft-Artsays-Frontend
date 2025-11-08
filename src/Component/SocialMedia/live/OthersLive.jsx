import React,{ useState,useEffect, useRef  }  from "react";
import { MdOutlineEmojiEmotions, MdPeopleAlt } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaRegHeart, FaAngleRight } from "react-icons/fa";
import { BiCommentCheck } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaChevronRight, FaChevronUp } from "react-icons/fa";
import Picker from 'emoji-picker-react';
import getAPI from "../../../api/getAPI";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

const user = {
  following:1234,
}

const ad = {
  name: "Art Masterclass - Water Color",
  price: "₹500",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit,  est ",
  pic: "https://cdn.exoticindia.com/images/products/original/sculptures-2016/msg160.jpg",
};
const sponsor = {
  name: "Art Masterclass - Water Color",
  sponsorby: "GoPro.com",
  pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWrB_f3uqKdvDn1OMccWXycwZFG2R5YzzTFw&s",
};

const OthersLive = () => {
  const [topChat, setTopChat] = useState([]);
  const [showChat, setShowChat]=useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [showSuperChat, setShowSuperChat] = useState(false);
  const [value, setValue] = useState(40);
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [liveDetail, setLiveDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [categories, setCategories] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderRef = useRef(null);
  const volumeTimeoutRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const socketRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasFallbackAttempted, setHasFallbackAttempted] = useState(false);
  const [recoveryDisabled, setRecoveryDisabled] = useState(false);
  const { streamKey } = useParams();

    // WebRTC Configuration - STUN-only for localhost testing
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
  iceCandidatePoolSize: 10
};

  // Safe play helper
  const tryPlay = async (video) => {
    try {
      await video.play();
    } catch (err) {
      console.warn("Autoplay prevented, waiting for user interaction", err);
      // Show a custom "Click to Play" overlay if needed
    }
  };

  // Helper function for HLS fallback
  const attemptHLSFallback = (videoElement, streamUrl) => {
    try {
      // Clear existing source
      videoElement.src = '';
      videoElement.srcObject = null;
      videoElement.load();

      if (Hls.isSupported()) {
        console.log("Using HLS.js for fallback");
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed successfully");
          tryPlay(videoElement);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("HLS network error, trying to recover");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("HLS media error, trying to recover");
                hls.recoverMediaError();
                break;
              default:
                console.log("HLS fatal error, destroying instance");
                hls.destroy();
                toast.error("Unable to load video stream");
                break;
            }
          }
        });

        // Store HLS instance for cleanup
        videoElement.hls = hls;
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("Using native HLS support");
        videoElement.src = streamUrl;
        tryPlay(videoElement);
      } else {
        toast.error("HLS format not supported on this browser");
      }
    } catch (error) {
      console.error("HLS fallback failed:", error);
      toast.error("Failed to load video stream");
    }
  };

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Enhanced stream URL validation
  const validateStreamUrl = (url) => {
    if (!url || typeof url !== 'string') {
      console.log('Invalid stream URL: empty or not a string');
      return false;
    }
    
    if (url.trim() === '') {
      console.log('Invalid stream URL: empty string');
      return false;
    }
    
    if (url.startsWith('blob:')) {
      console.log('🚫 Invalid stream URL: blob URL detected');
      return false;
    }
    
    // Block WebRTC URLs for HLS fallback (they're not HLS streams)
    if (url.startsWith('webrtc://')) {
      console.log('🚫 WEBRTC URL BLOCKED FOR HLS FALLBACK:', url);
      return false;
    }
    
    if (!isValidUrl(url)) {
      console.log('Invalid stream URL: malformed URL');
      return false;
    }
    
    console.log('Stream URL validation passed:', url);
    return true;
  };

  // Comprehensive video source monitoring
  const monitorVideoSources = () => {
    if (!videoElement) return;
    
    // Check for blob URLs
    if (videoElement.src && videoElement.src.startsWith('blob:')) {
      console.log('🚫 MONITOR: Blob URL detected in video element:', videoElement.src);
      return;
    }
    
    // Check for empty or invalid sources
    if (videoElement.src && videoElement.src.trim() === '') {
      console.log('📝 MONITOR: Empty src detected, clearing');
      videoElement.src = '';
      videoElement.load();
      return;
    }
    
    // Log current state for debugging
    console.log('📊 MONITOR: Video element state:', {
      src: videoElement.src,
      hasSrcObject: !!videoElement.srcObject,
      readyState: videoElement.readyState,
      networkState: videoElement.networkState,
      paused: videoElement.paused,
      ended: videoElement.ended
    });
  };

  // Function to format stream time ago (when stream ended)
  const formatStreamTimeAgo = (liveDetail) => {
    if (!liveDetail) return "streamed just now";
    
    // If currently live, show "LIVE" instead
    if (liveDetail.live?.isLive) {
      return "LIVE";
    }
    
    // Calculate when stream ended based on duration
    const streamStartTime = liveDetail.createdAt;
    const streamDuration = liveDetail.live?.streamDuration;
    
    if (!streamStartTime || !streamDuration) return "streamed just now";
    
    // Parse stream duration to get total seconds
    let totalSeconds = 0;
    if (typeof streamDuration === 'string' && streamDuration.includes(':')) {
      // Format: "00:07" or "01:30"
      const [minutes, seconds] = streamDuration.split(':').map(Number);
      totalSeconds = minutes * 60 + seconds;
    } else if (typeof streamDuration === 'number') {
      totalSeconds = streamDuration;
    }
    
    // Calculate when stream ended
    const streamStart = new Date(streamStartTime);
    const streamEndTime = new Date(streamStart.getTime() + (totalSeconds * 1000));
    
    // Calculate time difference from when stream ended
    const now = new Date();
    const timeDiffMs = now - streamEndTime;
    const timeDiffSeconds = Math.floor(timeDiffMs / 1000);
    const timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    
    if (timeDiffSeconds < 60) {
      return "streamed just now";
    } else if (timeDiffMinutes < 60) {
      return `streamed ${timeDiffMinutes}m ago`;
    } else if (timeDiffHours < 24) {
      const remainingMinutes = timeDiffMinutes % 60;
      if (remainingMinutes === 0) {
        return `streamed ${timeDiffHours}h ago`;
      } else {
        return `streamed ${timeDiffHours}h ${remainingMinutes}m ago`;
      }
    } else {
      return `streamed ${timeDiffDays}d ago`;
    }
  };

  // Function to render tags
  const renderTags = (tags) => {
    // Use provided tags or fallback to sample tags for demo
    let displayTags = ["art", "artwork"]; 
    
    if (tags && Array.isArray(tags) && tags.length > 0) {
      displayTags = [];
      
      // Process each tag in the array
      tags.forEach((tag, index) => {
        
        if (typeof tag === 'string') {
          if (tag.startsWith('[') && tag.endsWith(']')) {
            try {
              const parsedArray = JSON.parse(tag);
              console.log("Parsed array:", parsedArray);
              if (Array.isArray(parsedArray)) {
                displayTags.push(...parsedArray);
              } else {
                displayTags.push(tag);
              }
            } catch (e) {
              console.error("Error parsing tag array:", e);
              displayTags.push(tag);
            }
          } else {
            // Regular string tag
            displayTags.push(tag);
          }
        } else {
          // Non-string tag, convert to string
          displayTags.push(String(tag));
        }
      });
      
      // If no valid tags found, use fallback
      if (displayTags.length === 0) {
        displayTags = ["art", "artwork"];
      }
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => {
          // Remove # if already present and clean up the tag
          let cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
          cleanTag = cleanTag.trim();
          
          // Make first letter lowercase and rest lowercase
          cleanTag = cleanTag.toLowerCase();
          
          return (
            <span 
              key={index}
              className="text-[#8B4513] font-semibold text-lg"
            >
              #{cleanTag}
            </span>
          );
        })}
      </div>
    );
  };

  const onEmojiClick = (emojiObject) => {
    setInputText((prev) => prev + emojiObject.emoji);
    setShowPicker(false); // Hide picker after selection
  };

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

  // Handle volume toggle
  const handleVolumeToggle = () => {
    if (videoElement) {
      if (isMuted) {
        videoElement.muted = false;
        videoElement.volume = volume / 100;
        setIsMuted(false);
      } else {
        videoElement.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (videoElement) {
      videoElement.volume = newVolume / 100;
      if (newVolume > 0) {
        videoElement.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveDetail?.live?.streamUrl || '');
      toast.success('Stream URL copied to clipboard!');
      setShowShare(false); // Hide the share popup after copying
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle share button click
  const handleShareClick = () => {
    setShowShare(!showShare);
  };

  // Handle click outside to close share popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShare && !event.target.closest('.share-popup-container')) {
        setShowShare(false);
      }
    };

    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showShare]);


  // Handle volume slider show with 2-second timeout
  const handleVolumeMouseEnter = () => {
    setShowVolumeSlider(true);
    
    // Clear existing timeout
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    
    // Set new timeout to hide after 2 seconds
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  const handleVolumeMouseLeave = () => {
    // Clear timeout when mouse leaves
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    // Don't hide immediately, let the timeout handle it
  };

  // Handle fullscreen toggle
  const handleFullscreen = async () => {
    if (!videoElement) return;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        if (videoElement.requestFullscreen) {
          await videoElement.requestFullscreen();
        } else if (videoElement.webkitRequestFullscreen) {
          await videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) {
          await videoElement.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Handle video element reference
  const handleVideoRef = (element) => {
  if (!element) return;

  // ✅ cleanup previous listeners if exist
  if (element._removeListeners) {
    element._removeListeners();
  }

  setVideoElement(element);

  // ✅ Comprehensive blob URL prevention and cleanup
  const clearInvalidSources = () => {
    if (element.src && element.src.startsWith('blob:')) {
      console.log('🚫 BLOCKED: Invalid blob URL detected:', element.src);
      element.src = '';
      element.srcObject = null;
      element.load();
      return true; // Indicates cleanup was performed
    }
    return false;
  };

  // Clear any existing invalid sources
  clearInvalidSources();

  // ✅ Monitor for blob URL attempts
  // ✅ Monitor setAttribute calls (only if not already overridden)
  if (!element._setAttributeOverridden) {
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name, value) {
      if (name === 'src' && value && value.startsWith('blob:')) {
        console.log('🚫 BLOCKED: Attempt to set blob URL via setAttribute:', value);
        return; // Block the blob URL
      }
      return originalSetAttribute.call(this, name, value);
    };
    element._setAttributeOverridden = true;
  }

  // ✅ Monitor direct src property changes
  // Monitor direct src property changes (only if not already defined)
  if (!element._srcPropertyRedefined) {
    let currentSrc = element.src;
    try {
      Object.defineProperty(element, 'src', {
        get() {
          return currentSrc;
        },
        set(value) {
          if (value && value.startsWith('blob:')) {
            console.log('🚫 BLOCKED: Attempt to set blob URL via src property:', value);
            currentSrc = '';
            element.srcObject = null;
            element.load();
            return;
          }
          currentSrc = value;
        }
      });
      element._srcPropertyRedefined = true;
    } catch (error) {
      console.log('⚠️ Could not redefine src property (already defined):', error.message);
    }
  }

  // ✅ attach remote stream if exists
  if (remoteStream) {
    console.log('Attaching remote stream to video element');
    element.srcObject = remoteStream;
    element.src = ''; // Clear src when using srcObject
  }

  // --- Safe play helper ---
  const tryPlay = async (video) => {
    try {
      await video.play();
    } catch (err) {
      console.warn("Autoplay prevented, waiting for user interaction", err);
      // Show a custom "Click to Play" overlay if needed
    }
  };

  // --- Event Handlers ---
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);
  const handleLoadStart = () => console.log("Video stream loading started");
  const handleCanPlay = () => {
    console.log("Video stream can start playing");
    if (liveDetail?.live?.isLive) {
      setIsPlaying(true);
      tryPlay(element); // ✅ ensure playback
    }
  };

  const handleVideoError = (e) => {
    const error = e.target?.error;
    const videoElement = e.target;

    if (!error) {
      console.error("Video error event fired without MediaError object");
      return;
    }

    console.error("🚨 Video error:", error);
    console.log("Video element src:", videoElement.src);
    console.log("Video element srcObject:", !!videoElement.srcObject);

    // 🚫 AGGRESSIVE: Clear ALL sources immediately on any error
    const clearAllSources = () => {
      console.log("🧹 CLEARING ALL SOURCES due to video error");
    };

    // Handle different error codes
    switch (error.code) {
      case 1: // MEDIA_ERR_ABORTED
        console.log("Video loading was aborted");
        clearAllSources();
        break;
      case 2: // MEDIA_ERR_NETWORK
        console.log("Network error occurred while loading video");
        clearAllSources();
        toast.error("Network error - please check your connection");
        break;
      case 3: // MEDIA_ERR_DECODE
        console.log("Error occurred while decoding video");
        clearAllSources();
        toast.error("Video format not supported");
        break;
      case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
        console.log("🚨 FORMAT ERROR DETECTED - Clearing all sources");
        clearAllSources();
        
        // Wait a moment before attempting fallback
        setTimeout(() => {
          // Try HLS.js fallback for unsupported formats
          if (liveDetail?.live?.streamUrl && validateStreamUrl(liveDetail.live.streamUrl)) {
            console.log("🔄 Attempting HLS.js fallback after format error...");
            attemptHLSFallback(videoElement, liveDetail.live.streamUrl);
          } else {
            console.log("🚫 No valid HLS fallback URL available (WebRTC stream detected)");
            toast.error("WebRTC stream format error - please reconnect to the stream");
          }
        }, 1000);
        break;
      default:
        console.log("Unknown video error:", error.code);
        clearAllSources();
        toast.error("Video playback error occurred");
    }
  };

  // Helper function for HLS fallback
  const attemptHLSFallback = (videoElement, streamUrl) => {
    try {
      console.log("🔄 Starting HLS fallback with URL:", streamUrl);
      
      // AGGRESSIVE: Clear ALL sources and wait
      videoElement.src = '';
      videoElement.srcObject = null;
      videoElement.load();
      
      // Wait a moment to ensure cleanup
      setTimeout(() => {
        // Double-check that no blob URLs exist
        if (videoElement.src && videoElement.src.startsWith('blob:')) {
          console.log("🚫 BLOB URL STILL EXISTS, FORCE CLEARING");
          videoElement.src = '';
          videoElement.srcObject = null;
          videoElement.load();
        }

      if (Hls.isSupported()) {
          console.log("Using HLS.js for fallback");
          
          // Destroy any existing HLS instance
          if (videoElement.hls) {
            console.log("Destroying existing HLS instance");
            videoElement.hls.destroy();
            videoElement.hls = null;
          }
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            // Add more robust error handling
            maxBufferLength: 30,
            maxMaxBufferLength: 60
          });
          
          hls.loadSource(streamUrl);
          hls.attachMedia(videoElement);
          
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("✅ HLS manifest parsed successfully");
            // Ensure no blob URLs before playing
            if (videoElement.src && videoElement.src.startsWith('blob:')) {
              console.log("🚫 BLOB URL DETECTED IN HLS, CLEARING");
              videoElement.src = '';
            }
            tryPlay(videoElement);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("HLS network error, trying to recover");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("HLS media error, trying to recover");
                  hls.recoverMediaError();
                  break;
                default:
                  console.log("HLS fatal error, destroying instance");
                  hls.destroy();
                  videoElement.hls = null;
                  // Clear any sources that might have been set
                  videoElement.src = '';
                  videoElement.srcObject = null;
                  videoElement.load();
                  toast.error("Unable to load video stream");
                  break;
              }
            }
          });
          
          // Store HLS instance for cleanup
          videoElement.hls = hls;
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          console.log("Using native HLS support");
          // Ensure no blob URLs before setting
          if (videoElement.src && videoElement.src.startsWith('blob:')) {
            console.log("🚫 BLOB URL DETECTED BEFORE NATIVE HLS, CLEARING");
            videoElement.src = '';
          }
          videoElement.src = streamUrl;
          tryPlay(videoElement);
      } else {
          console.log("❌ HLS format not supported on this browser");
          toast.error("HLS format not supported on this browser");
        }
      }, 500); // Wait 500ms before attempting HLS
      
    } catch (error) {
      console.error("HLS fallback failed:", error);
      // Clear any sources on error
      videoElement.src = '';
      videoElement.srcObject = null;
      videoElement.load();
      toast.error("Failed to load video stream");
    }
  };

  // --- Attach listeners ---
  element.addEventListener("play", handlePlay);
  element.addEventListener("pause", handlePause);
  element.addEventListener("ended", handleEnded);
  element.addEventListener("loadstart", handleLoadStart);
  element.addEventListener("canplay", handleCanPlay);
  element.addEventListener("error", handleVideoError);

  // --- Save cleanup ---
  element._removeListeners = () => {
    element.removeEventListener("play", handlePlay);
    element.removeEventListener("pause", handlePause);
    element.removeEventListener("ended", handleEnded);
    element.removeEventListener("loadstart", handleLoadStart);
    element.removeEventListener("canplay", handleCanPlay);
    element.removeEventListener("error", handleVideoError);
  };
};

  // Update video element when remote stream changes
  useEffect(() => {
    if (videoElement && remoteStream) {
      console.log('Setting remote stream to video element');
      console.log('Remote stream tracks:', remoteStream.getTracks().map(track => ({
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState
      })));
      
      // Clear any existing src before setting srcObject
      videoElement.src = '';
      videoElement.srcObject = remoteStream;
      
      // Ensure video is not paused before playing
      if (videoElement.paused && !isConnecting) {
        videoElement.muted = true;
        videoElement.play().catch(error => {
          console.error("Error playing remote stream:", error);
          // If autoplay fails, show user interaction required message
          if (error.name === 'NotAllowedError') {
            console.log("Autoplay blocked - user interaction required");
          } else if (error.name === 'NotSupportedError') {
            console.log("Remote stream format not supported");
            // Clear the stream and try fallback
            videoElement.srcObject = null;
            if (liveDetail?.live?.streamUrl && isValidUrl(liveDetail.live.streamUrl)) {
              console.log("Trying HLS fallback after WebRTC format error");
              attemptHLSFallback(videoElement, liveDetail.live.streamUrl);
            }
          }
        });
      }
    } else if (videoElement && !remoteStream) {
      console.log('Clearing remote stream from video element');
      videoElement.srcObject = null;
    }
  }, [videoElement, remoteStream, isConnecting]);

  // Periodic monitoring for blob URLs and invalid sources
  useEffect(() => {
    if (!videoElement) return;

    const monitoringInterval = setInterval(() => {
      monitorVideoSources();
    }, 1000); // Check every 1 second for more aggressive monitoring

    return () => {
      clearInterval(monitoringInterval);
    };
  }, [videoElement]);

  // AGGRESSIVE: Override all possible ways blob URLs can be set (only if not already overridden)
  useEffect(() => {
    if (!videoElement) return;

    // Override the video element's load method to prevent blob URLs
    if (!videoElement._loadMethodOverridden) {
      const originalLoad = videoElement.load;
      videoElement.load = function() {
        if (this.src && this.src.startsWith('blob:')) {
          console.log("🚫 BLOB URL DETECTED IN LOAD METHOD, CLEARING");
          this.src = '';
          this.srcObject = null;
        }
        return originalLoad.call(this);
      };
      videoElement._loadMethodOverridden = true;
    }

    // Override the video element's play method to check for blob URLs
    if (!videoElement._playMethodOverridden) {
      const originalPlay = videoElement.play;
      videoElement.play = function() {
        if (this.src && this.src.startsWith('blob:')) {
          console.log("🚫 BLOB URL DETECTED IN PLAY METHOD, CLEARING");
          this.src = '';
          this.srcObject = null;
          this.load();
          return Promise.reject(new Error("Blob URL detected and cleared"));
        }
        return originalPlay.call(this);
      };
      videoElement._playMethodOverridden = true;
    }

    // Override the video element's pause method to check for blob URLs
    if (!videoElement._pauseMethodOverridden) {
      const originalPause = videoElement.pause;
      videoElement.pause = function() {
        if (this.src && this.src.startsWith('blob:')) {
          console.log("🚫 BLOB URL DETECTED IN PAUSE METHOD, CLEARING");
          this.src = '';
          this.srcObject = null;
          this.load();
        }
        return originalPause.call(this);
      };
      videoElement._pauseMethodOverridden = true;
    }

    return () => {
      // No need to restore methods since we're checking for overrides
    };
  }, [videoElement]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Press 'F' for fullscreen toggle
      if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Only trigger if not typing in input fields
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          handleFullscreen();
        }
      }
      // Press 'Escape' to exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        handleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen]);

  // Auto-play live stream when available (for non-WebRTC streams)
  useEffect(() => {
    if (videoElement && liveDetail?.live?.isLive && liveDetail?.live?.streamUrl && !remoteStream && !isConnecting) {
      console.log("Attempting to play live stream:", liveDetail.live.streamUrl);
      
      // Validate stream URL with enhanced validation
      if (!validateStreamUrl(liveDetail.live.streamUrl)) {
        console.warn("Invalid stream URL detected");
        toast.error("Invalid live stream URL");
        return;
      }

      // Clear any existing src/srcObject and HLS instances
      videoElement.src = '';
      videoElement.srcObject = null;
      if (videoElement.hls) {
        videoElement.hls.destroy();
        videoElement.hls = null;
      }
      videoElement.load();

      const url = liveDetail.live.streamUrl;
      
      // Check if it's an HLS stream
      if (url.endsWith('.m3u8') || url.includes('m3u8')) {
        console.log("Detected HLS stream, using HLS.js");
        attemptHLSFallback(videoElement, url);
      } else {
        // Regular video stream
        videoElement.src = url;
        videoElement.load();
        
      // Only try to play if video is paused and not already playing
      if (videoElement.paused) {
        videoElement.play().catch(error => {
          console.error("Auto-play failed:", {
            name: error.name,
            message: error.message,
            src: liveDetail.live.streamUrl
          });

          // Handle different error types appropriately
          switch (error.name) {
            case 'NotAllowedError':
              // Browser blocks autoplay - this is expected, user needs to interact
              console.log("Auto-play blocked by browser - waiting for user interaction");
              // The play button will be shown via the overlay condition
              break;

            case 'NotSupportedError':
              // Video format not supported - try HLS fallback
              console.log("Trying HLS fallback for unsupported format");
              attemptHLSFallback(videoElement, url);
              break;

            case 'AbortError':
              // Play was aborted (usually by another play call or source change)
              console.log("Play was aborted - likely due to source change");
              break;

            default:
              // Other errors - show user-friendly message
              console.error("Unexpected play error:", error);
              toast.error("Failed to load live stream");
              break;
          }
        });
        }
      }
    }
  }, [videoElement, liveDetail?.live?.isLive, liveDetail?.live?.streamUrl, remoteStream, isConnecting]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

    const fetchLive = async () => {
    try {
      setLoading(true);
      console.log("Fetching live data for streamKey:", streamKey);
      
      if(!streamKey){
        toast.error("No streamKey Provided");
        setLoading(false);
        return;
      }
      
      // Fetch live data for the current user
      const res = await getAPI(`/api/social-media/live/${streamKey}`);
      console.log("Live data fetched:", res?.data);

      if(res?.hasError) {
        toast.error(res.message || "Failed to load live data");
        setLiveDetail(null);
        setLoading(false);
        return;
      }

      const live = res?.data?.liveData;

      if(live){
        console.log("Setting live detail:", live);
        console.log("Stream URL:", live.live?.streamUrl);
        setLiveDetail(live);
      } else {
        toast.error("No live data found");
        setLiveDetail(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live:", error);
      setLiveDetail(null);
      setLoading(false);
    }
  };

  // Helper function for HLS fallback
    const fallbackToHLS = () => {
        if (liveDetail?.live?.streamUrl && videoElement && isValidUrl(liveDetail.live.streamUrl)) {
          console.log('Falling back to HLS stream:', liveDetail.live.streamUrl);
        attemptHLSFallback(videoElement, liveDetail.live.streamUrl);
            toast.info('Switched to backup stream');
        } else {
          toast.error('No valid backup stream available');
        }
    };

  // Connect to live stream using WebRTC
  const connectToStreamWithRetry = async () => {
    if (!liveDetail?.live?.streamUrl || isConnecting) {
      console.log('Cannot connect to stream:', {
        hasStreamUrl: !!liveDetail?.live?.streamUrl,
        isConnecting
      });
      return;
    }

    if (retryCount > 1) {  // Max 2 retries
      console.log('Max retries exceeded, falling back to HLS');
      fallbackToHLS();
      return;
    }

    console.log(`Starting WebRTC connection attempt ${retryCount + 1}`);
    setIsConnecting(true);

    // Set a timeout for connection
    const connectionTimeout = setTimeout(() => {
      console.error('WebRTC connection timeout after 15 seconds');
      if (videoElement) {
        videoElement.pause();
        setIsPlaying(false);
      }
      setIsConnecting(false);

      // Retry logic with backoff
      setRetryCount(prev => prev + 1);
      if (retryCount < 1) {  // Max 2 retries
        console.log(`Retrying WebRTC connection in 3 seconds (attempt ${retryCount + 2})`);
        setTimeout(() => {
          connectToStreamWithRetry();
        }, 3000);  // 3s backoff
      } else {
        console.log('Max retries reached, falling back to HLS');
        fallbackToHLS();
        setRetryCount(0); // Reset for future connections
      }
    }, 15000); // Reduced timeout to 15 seconds

    try {
      // Create peer connection
      const pc = new RTCPeerConnection(rtcConfig);
      setPeerConnection(pc);

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('✅ Received remote stream');
        console.log('Stream tracks:', event.streams[0].getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          label: track.label
        })));
        
        // Validate stream before setting
        const stream = event.streams[0];
        if (stream && stream.getTracks().length > 0) {
        clearTimeout(connectionTimeout);
          setRemoteStream(stream);
        setIsConnecting(false);
        setRetryCount(0); // Reset on success
        toast.success('Connected to live stream!');
        } else {
          console.error('Invalid remote stream received - no tracks');
          clearTimeout(connectionTimeout);
          setIsConnecting(false);
          toast.error('Invalid stream received from broadcaster');
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected') {
          console.log('✅ ICE connected successfully');
        } else if (pc.iceConnectionState === 'failed') {
          console.log('❌ ICE failed - trying alternative connection');
          // For localhost, try direct connection
          pc.addIceCandidate({ candidate: 'candidate:1 1 UDP 2130706431 127.0.0.1 0 typ host' });
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Local ICE candidate generated:', event.candidate.candidate);
          if (socketRef.current) {
            socketRef.current.emit('viewerIceCandidate', {
              roomName: roomName,
              candidate: event.candidate
            });
          }
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          clearTimeout(connectionTimeout);
          setIsConnecting(false);
          setRetryCount(0);
        } else if (pc.connectionState === 'failed') {
          clearTimeout(connectionTimeout);
          if (videoElement) {
            videoElement.pause();
            setIsPlaying(false);
          }
          setIsConnecting(false);
          console.log('WebRTC connection failed');

          // Retry logic with backoff
          setRetryCount(prev => prev + 1);
          if (retryCount < 1) {  // Max 2 retries
            console.log(`Retrying WebRTC connection in 3 seconds (attempt ${retryCount + 2})`);
            setTimeout(() => {
              connectToStreamWithRetry();
            }, 3000);  // 3s backoff
          } else {
            console.log('Max retries reached, falling back to HLS');
            fallbackToHLS();
            setRetryCount(0); // Reset for future connections
          }
        }
      };

      // Connect to socket
      const socket = io(process.env.REACT_APP_API_BASE, {
        transports: ["websocket", "polling"],
        timeout: 5000,
        forceNew: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to socket server');
        // Test join to validate room
        const streamKey = liveDetail?.live?.streamKey;
        const roomName = `live-room-${streamKey}`;
        if (roomName && socketRef.current) {
          socketRef.current.emit('joinLiveStream', {
            roomName: roomName,
            userId: localStorage.getItem("userId")
          });
          console.log('Test join emitted for room:', roomName);
        }
      });

      socket.on('disconnect', () => {
        console.log('Viewer socket disconnected');
        setRemoteStream(null);
        setIsConnecting(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', {
          message: error.message,
          type: error.type
        });
        clearTimeout(connectionTimeout);
        if (videoElement) {
          videoElement.pause();
          setIsPlaying(false);
        }
        setIsConnecting(false);
        console.log('Socket connection failed');

        // Retry logic for socket error with backoff
        setRetryCount(prev => prev + 1);
        if (retryCount < 1) {  // Max 2 retries
          console.log(`Retrying socket connection in 3 seconds (attempt ${retryCount + 2})`);
          setTimeout(() => {
            connectToStreamWithRetry();
          }, 3000);  // 3s backoff
        } else {
          console.log('Max socket retries reached, falling back to HLS');
          fallbackToHLS();
          setRetryCount(0); // Reset for future connections
        }
      });

      // Join the live stream room with simplified room name (moved up for scoping)
      const streamKey = liveDetail?.live?.streamKey;
      const roomName = `live-room-${streamKey}`;
      console.log('Joining room:', roomName);

      if (roomName && socketRef.current) {
        socketRef.current.emit('joinLiveStream', {
          roomName: roomName,
          userId: localStorage.getItem("userId")
        });
      } else {
        console.error('Cannot join: invalid roomName or socket');
        clearTimeout(connectionTimeout);
        setIsConnecting(false);
        return;
      }

      // Handle offer from streamer
      socket.on('streamerOffer', async (data) => {
        console.log('Received streamerOffer:', data);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit('viewerAnswer', {
            roomName: roomName,
            answer: answer
          });

          console.log('Sent viewerAnswer to streamer');
        } catch (error) {
          console.error('Error handling streamer offer:', error);
          clearTimeout(connectionTimeout);
          if (videoElement) {
            videoElement.pause();
            setIsPlaying(false);
          }
          setIsConnecting(false);
        }
      });

      // Handle ICE candidate from streamer
      socket.on('streamerIceCandidate', async (data) => {
        try {
          if (data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log('Added ICE Candidate from streamer');
          }
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      });

      // Handle stream end
      socket.on('streamEnded', () => {
        console.log('Stream ended by streamer');
        setRemoteStream(null);
        setIsConnecting(false);
        setRetryCount(0);  // Stop retries on end
        toast.info('Stream has ended');
        if (pc) {
          pc.close();
          setPeerConnection(null);
        }
        // Prevent further retries
        if (connectionTimeout) clearTimeout(connectionTimeout);
      });

    } catch (error) {
      console.error('Error connecting to stream:', error);
      clearTimeout(connectionTimeout);
      if (videoElement) {
        videoElement.pause();
        setIsPlaying(false);
      }
      setIsConnecting(false);
      console.log('WebRTC connection error occurred');

      // Retry logic
      setRetryCount(prev => prev + 1);
      if (retryCount < 1) {
        console.log(`Retrying WebRTC connection in 3 seconds (attempt ${retryCount + 2})`);
        setTimeout(() => {
          connectToStreamWithRetry();
        }, 3000);
      } else {
        console.log('Max retries reached, falling back to HLS');
        fallbackToHLS();
        setRetryCount(0); // Reset for future connections
      }
    }
  };

// Add this function to diagnose network issues
const diagnoseNetwork = async () => {
  console.log('=== Network Diagnostics ===');
  
  // Test STUN server connectivity
  try {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const startTime = Date.now();
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const responseTime = Date.now() - startTime;
        console.log(`✅ STUN server response time: ${responseTime}ms`);
        pc.close();
      }
    };
    
    // Create a data channel to trigger ICE gathering
    pc.createDataChannel('test');
    await pc.createOffer();
    await pc.setLocalDescription(await pc.createOffer());
    
    setTimeout(() => {
      console.log('❌ STUN server timeout');
      pc.close();
    }, 5000);
    
  } catch (error) {
    console.error('❌ STUN server test failed:', error);
  }
  
  // Test socket connectivity
  try {
    const testSocket = io(process.env.REACT_APP_API_BASE, { 
      transports: ["websocket"],
      timeout: 5000
    });
    
    testSocket.on('connect', () => {
      console.log('✅ Socket server is reachable');
      testSocket.disconnect();
    });
    
    testSocket.on('connect_error', (error) => {
      console.error('❌ Socket server unreachable:', error.message);
      testSocket.disconnect();
    });
    
  } catch (error) {
    console.error('❌ Socket connection test failed:', error);
  }
  
  console.log('=== End Diagnostics ===');
};

// Add this enhanced error handling
const handleConnectionError = (error, context) => {
  console.error(`Connection error in ${context}:`, error);
  
  let userMessage = 'Connection failed';
  
  if (error.name === 'NotAllowedError') {
    userMessage = 'Camera/microphone access denied. Please allow permissions and try again.';
  } else if (error.name === 'NotFoundError') {
    userMessage = 'No camera/microphone found. Please connect your devices.';
  } else if (error.name === 'NotSupportedError') {
    userMessage = 'WebRTC not supported in this browser. Please use Chrome, Firefox, or Safari.';
  } else if (error.name === 'SecurityError') {
    userMessage = 'HTTPS required for WebRTC. Please access the site over HTTPS.';
  } else if (error.message.includes('CORS')) {
    userMessage = 'Network policy blocking connection. Try using a different network.';
  } else if (error.message.includes('timeout')) {
    userMessage = 'Connection timeout. Please check your internet connection and try again.';
  }
  
  toast.error(userMessage);
  setIsConnecting(false);
};


  // Disconnect from stream
  const disconnectFromStream = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (videoElement) {
      videoElement.pause();
      setIsPlaying(false);
    }
    setRemoteStream(null);
    setIsConnecting(false);
    setRetryCount(0);
  };

  // Fetch user profile details (followers, following, etc.)
  const fetchUserProfile = async (userId) => {
    userId = localStorage.getItem("userId");
    try {
      if (!userId) {
        console.warn("No userId provided for profile fetch");
        return;
      }
      
      const res = await getAPI(`/api/social-media/profile/${userId}`);
      const profile = res?.data?.profile;
      
      if (profile) {
        setUserProfile(profile);
        console.log("User profile fetched:", profile);
      } else {
        console.warn("No profile data received for userId:", userId);
      }
    } catch (err) {
      console.error("Fetch user profile error:", err);
      // Don't show error toast for profile fetch as it's not critical
    }
  };

  useEffect(() => {
    fetchLive();
  }, [streamKey]); // Add streamKey dependency to refetch if route changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectFromStream();
    };
  }, []);

  // Fetch user profile when liveDetail is available
  useEffect(() => {
    if (liveDetail?.userId) {
      // Handle both string userId and populated user object
      const userId = typeof liveDetail.userId === 'string' 
        ? liveDetail.userId 
        : liveDetail.userId._id || liveDetail.userId.id;
      
      if (userId) {
        console.log("Fetching profile for userId:", userId);
        fetchUserProfile(userId);
      } else {
        console.warn("Could not extract userId from liveDetail.userId:", liveDetail.userId);
      }
    }
  }, [liveDetail?.userId]);

  // Check if current user is following this profile
  useEffect(() => {
    if (userProfile && liveDetail?.userId) {
      const currentUserId = localStorage.getItem("userId");
      if (userProfile.followers && Array.isArray(userProfile.followers)) {
        const isUserFollowing = userProfile.followers.some(follower => 
          String(follower._id || follower) === String(currentUserId)
        );
        setIsFollowing(isUserFollowing);
        console.log('Following status:', isUserFollowing, 'for user:', userProfile.username);
      } else {
        setIsFollowing(false);
      }
    }
  }, [userProfile, liveDetail?.userId]);

  // Initialize like state when liveDetail changes
  useEffect(() => {
    if (liveDetail) {
      setLikeCount(liveDetail.live?.likeCount || 0);
      
      // Check if current user has liked this stream
      const currentUserId = localStorage.getItem("userId");
      if (liveDetail.likes && Array.isArray(liveDetail.likes)) {
        const hasLiked = liveDetail.likes.some(like => 
          String(like._id || like) === String(currentUserId)
        );
        setIsLiked(hasLiked);
      } else {
        setIsLiked(false);
      }
    }
  }, [liveDetail]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!liveDetail?.userId) {
      console.error("No target user ID available for follow/unfollow");
      return;
    }
    
    setFollowLoading(true);
    try {
      const currentUserId = localStorage.getItem("userId");
      
      if (!currentUserId) {
        toast.error("Please log in to follow users");
        setFollowLoading(false);
        return;
      }
      
      // Handle both string userId and populated user object
      const targetUserId = typeof liveDetail.userId === 'string' 
        ? liveDetail.userId 
        : liveDetail.userId._id || liveDetail.userId.id;
      
      if (!targetUserId) {
        console.error("Could not extract target userId for follow/unfollow");
        toast.error("Invalid user ID");
        setFollowLoading(false);
        return;
      }
      
      // Prevent following yourself
      if (currentUserId === targetUserId) {
        toast.error("You cannot follow yourself");
        setFollowLoading(false);
        return;
      }
      
      console.log('Follow/Unfollow action:', {
        currentUserId,
        targetUserId,
        isCurrentlyFollowing: isFollowing,
        action: isFollowing ? 'unfollow' : 'follow'
      });
      
      const endpoint = isFollowing 
        ? `/api/social-media/unfollow/${targetUserId}`
        : `/api/social-media/follow/${targetUserId}`;
      
      const response = await getAPI(endpoint, {
        userId: currentUserId
      }, true);
      
      if (response.success) {
        // Update the local state immediately for better UX
        setIsFollowing(!isFollowing);
        
        // Show success message
        const action = isFollowing ? "Unfollowed" : "Followed";
        toast.success(`${action} successfully`);
        
        // Refresh user profile to update follower count
        const userId = typeof liveDetail.userId === 'string' 
          ? liveDetail.userId 
          : liveDetail.userId._id || liveDetail.userId.id;
        if (userId) {
          fetchUserProfile(userId);
        }
        
        console.log('Follow/Unfollow successful:', {
          action,
          targetUserId,
          newFollowingStatus: !isFollowing
        });
      } else {
        toast.error(response.message || "Failed to update follow status");
        console.error('Follow/Unfollow failed:', response);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!liveDetail?._id) return;
    
    try {
      const currentUserId = localStorage.getItem("userId");
      const endpoint = isLiked 
        ? `/api/social-media/unlike-live/${liveDetail._id}`
        : `/api/social-media/like-live/${liveDetail._id}`;
      
      const response = await getAPI(endpoint, {
        userId: currentUserId
      }, true);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        toast.success(isLiked ? "Unliked" : "Liked!");
      } else {
        toast.error(response.message || "Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      toast.error("Failed to update like status");
    }
  };

  // Cleanup video event listeners
  useEffect(() => {
    return () => {
      if (videoElement) {
        // Existing removals (fallback for basic listeners)
        videoElement.removeEventListener('play', () => setIsPlaying(true));
        videoElement.removeEventListener('pause', () => setIsPlaying(false));
        videoElement.removeEventListener('ended', () => setIsPlaying(false));
        videoElement.removeEventListener('error', () => {});

        // Cleanup HLS if attached
        if (videoElement.hls) {
          videoElement.hls.destroy();
          videoElement.hls = null;
        }

        // NEW: Custom cleanup for enhanced listeners
        if (videoElement && videoElement._removeListeners) {
          videoElement._removeListeners();
        }
      }
      
      // Cleanup volume timeout
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }

      // Reset fallback flag on unmount
      setHasFallbackAttempted(false);
      setRecoveryDisabled(false);
    };
  }, [videoElement]);

   // Handle play/pause functionality
  const handlePlayPause = () => {
    if (isConnecting) {
      console.log('Cannot play/pause while connecting');
      return;
    }

    if (!videoElement) return;

    // Check for valid WebRTC stream
    const hasWebRTCStream = remoteStream && videoElement.srcObject === remoteStream;
    // Check for valid HLS stream URL
    const hasHLSStream = liveDetail?.live?.streamUrl && isValidUrl(liveDetail.live.streamUrl);

    if (!hasWebRTCStream && !hasHLSStream) {
      toast.error('No valid video source available. The stream may not be live or the stream URL is invalid.');
      return;
    }

    // Prevent playing if src and srcObject are both empty
    if (!videoElement.src && !videoElement.srcObject) {
      toast.error('No video source attached. Please wait for the stream to start.');
      return;
    }

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      videoElement.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          if (liveDetail?.live?.isLive) {
            toast.error("Unable to play live stream");
          } else {
            toast.error("Unable to play video");
          }
        });
    }
  };

  // Auto-connect to live stream when available
  useEffect(() => {
    console.log('Auto-connect effect triggered:', {
      isLive: liveDetail?.live?.isLive,
      hasRemoteStream: !!remoteStream,
      isConnecting,
      streamUrl: liveDetail?.live?.streamUrl
    });

    if (liveDetail?.live?.isLive && !remoteStream && !isConnecting) {
      console.log('Attempting to auto-connect to live stream...');
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        connectToStreamWithRetry();
      }, 1000);
    } else if (!liveDetail?.live?.isLive && remoteStream) {
      console.log('Disconnecting from ended stream...');
      disconnectFromStream();
    }
  }, [liveDetail?.live?.isLive, liveDetail?.live?.streamUrl]);

  // --- WebRTC signaling and connection logic ---
  const viewerSocketIdRef = useRef(null);

  useEffect(() => {
    // Only run if liveDetail?.live?.isLive and streamKey exist
    if (!liveDetail?.live?.isLive || !streamKey) return;
    // Import socket.io-client if not global
    const io = window.io || require("socket.io-client").io;
    const socket = io(process.env.REACT_APP_API_BASE || `${process.env.REACT_APP_API_URL}`, { transports: ["websocket"] });
    socketRef.current = socket;
    const roomName = `live-room-${streamKey}`;
    const userId = localStorage.getItem("userId") || `viewer-${Math.random()}`;
    // Join room
    socket.emit("joinLiveStream", { roomName, userId });
    viewerSocketIdRef.current = socket.id;

    // Listen for streamerOffer
    socket.on("streamerOffer", async ({ roomName: offerRoom, offer, viewerSocketId }) => {
      if (offerRoom !== roomName) return;
      // Setup peer connection
      const pc = new RTCPeerConnection(rtcConfig);
      setPeerConnection(pc);
      // Attach remote stream
      pc.ontrack = (event) => {
        console.log('✅ Received remote stream in useEffect');
        const stream = event.streams[0];
        console.log('Stream tracks:', stream.getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          label: track.label
        })));
        
        // Validate stream before setting
        if (stream && stream.getTracks().length > 0) {
          setRemoteStream(stream);
          if (videoElement) {
            videoElement.src = ''; // Clear src before setting srcObject
            videoElement.srcObject = stream;
          }
        } else {
          console.error('Invalid remote stream received in useEffect - no tracks');
        }
      };
      // ICE candidate from viewer
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("viewerIceCandidate", { roomName, candidate: event.candidate });
        }
      };
      await pc.setRemoteDescription(new window.RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("viewerAnswer", { roomName, answer, viewerSocketId: socket.id });
    });

    // Listen for streamerIceCandidate
    socket.on("streamerIceCandidate", async ({ roomName: iceRoom, candidate, viewerSocketId }) => {
      if (iceRoom !== roomName) return;
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new window.RTCIceCandidate(candidate));
        } catch (err) {
          // Ignore duplicate or invalid candidate errors
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (peerConnection) peerConnection.close();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [liveDetail?.live?.isLive, streamKey, videoElement]);

  const debugLocalhostConnection = () => {
    console.log('=== Enhanced Debug Info ===');
    console.log('Socket connected:', socketRef.current?.connected);
    console.log('Peer connection state:', peerConnection?.connectionState);
    console.log('ICE connection state:', peerConnection?.iceConnectionState);
    console.log('Has remote stream:', !!remoteStream);
    console.log('Stream URL:', liveDetail?.live?.streamUrl);
    console.log('Stream Key:', liveDetail?.live?.streamKey);
    console.log('User ID:', localStorage.getItem('userId'));
    console.log('RTC Config:', rtcConfig);
    if (socketRef.current && socketRef.current._events) {
      console.log('Socket events:', Object.keys(socketRef.current._events));
    } else {
      console.log('Socket events: No events available');
    }
    
    // Enhanced video element debugging
    if (videoElement) {
      console.log('=== Video Element State ===');
      console.log('Video src:', videoElement.src);
      console.log('Video srcObject:', !!videoElement.srcObject);
      console.log('Video readyState:', videoElement.readyState);
      console.log('Video networkState:', videoElement.networkState);
      console.log('Video paused:', videoElement.paused);
      console.log('Video ended:', videoElement.ended);
      console.log('Video muted:', videoElement.muted);
      console.log('Video volume:', videoElement.volume);
      console.log('Video currentTime:', videoElement.currentTime);
      console.log('Video duration:', videoElement.duration);
      
      // Check for blob URLs
      if (videoElement.src && videoElement.src.startsWith('blob:')) {
        console.log('🚨 BLOB URL DETECTED:', videoElement.src);
      }
      
      // Check for HLS instance
      if (videoElement.hls) {
        console.log('HLS instance exists:', !!videoElement.hls);
        console.log('HLS ready state:', videoElement.hls.readyState);
      }
    } else {
      console.log('Video element: Not available');
    }
    
    console.log('=== End Debug ===');
  };

  useEffect(() => {
  if (videoElement && liveDetail?.live?.streamUrl) {
    const url = liveDetail.live.streamUrl;
    if (url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = url;
      }
    } else {
      videoElement.src = url;
    }
  }
}, [videoElement, liveDetail?.live?.streamUrl]);

useEffect(() => {
  if (!socketRef.current || !liveDetail?.live?.streamKey) return;

  socketRef.current.emit("joinRoom", liveDetail?.live?.streamKey);

  const handleReceiveMessage = (msg) => {
    setTopChat((prev) => [...prev, {
      id: msg._id,
      username: msg.user.username,
      profilePic: msg.user.profilePhoto,
      comment: msg.message
    }]);
  };

  socketRef.current.on("receiveMessage", handleReceiveMessage);

  return () => {
    if (socketRef.current) {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    }
  };
}, [liveDetail?.live?.streamKey]);

const handleSend = () => {
  if (!socketRef.current || !inputText.trim()) return;

  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.error("Please log in to send messages");
    return;
  }

  socketRef.current.emit("sendMessage", {
    streamKey,
    userId,
    message: inputText,
  });
  setInputText("");
};

  return (
    <div className="lg:w-[78%] w-full lg:mx-auto mx-0 flex flex-col lg:flex-row px-1 ">
      <div className={`${showChat ? "lg:w-[70%]" : "lg:w-full"} w-full lg:px-2 flex flex-col gap-4`}>
        {/* video  */}
        <div className="w-full lg:h-[60vh] sm:h-[50vh] h-[40vh] relative ">
          {liveDetail ? (
            <>
              {/* Video Element */}
              <video
                ref={handleVideoRef}
                className="w-full h-full object-cover rounded-xl"
                controls={isFullscreen}
                muted={isMuted}
                playsInline
                poster={liveDetail?.live?.isLive ? "" : (liveDetail?.thumbnail ? `${process.env.REACT_APP_API_URL}/${String(liveDetail.thumbnail).replace(/\\/g, "/")}` : "")}
                crossOrigin="anonymous"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Connection Status Overlay */}
              {liveDetail?.live?.isLive && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                  {isConnecting && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to stream...</span>
                    </div>
                  )}
                  {!isConnecting && !remoteStream && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Stream unavailable</span>
                    </div>
                  )}
                  {!isConnecting && remoteStream && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Play Button for Auto-play Blocked */}
              {liveDetail?.live?.isLive && remoteStream && videoElement && videoElement.paused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <button
                    onClick={handlePlayPause}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 text-lg font-semibold"
                  >
                    <i className="ri-play-fill text-2xl"></i>
                    Click to Start Live Stream
                  </button>
                </div>
              )}

              {/* Debug/Test Button */}
              {liveDetail?.live?.isLive && !remoteStream && !isConnecting && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={connectToStreamWithRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Connect to Stream
                  </button>
                  <button
                    onClick={debugLocalhostConnection}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Debug Connection
                  </button>
                  <button
                    onClick={() => {
                      const streamId = liveDetail?._id || 'default-stream';
                      const simpleStreamUrl = `stream-${streamId}`;
                      console.log('Socket status:', socketRef.current?.connected);
                      console.log('Live detail:', liveDetail);
                      console.log('Original Stream URL:', liveDetail?.live?.streamUrl);
                      console.log('Simple Stream URL:', simpleStreamUrl);
                      console.log('Live ID:', liveDetail?._id);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Debug Info
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
              <p className="text-gray-500">Loading live details...</p>
            </div>
          )}
          <div className="absolute w-full mx-auto bottom-1 flex justify-between px-3 py-1.5 items-center border-t-[3px] border-[#E56500]">
            <div className="text-white lg:text-[27px] text-[23px] flex  gap-4">
            <button 
              onClick={handlePlayPause}
              className="hover:scale-110 transition-transform duration-200 cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              <i class={isPlaying ? "ri-pause-fill" : "ri-play-large-fill"}></i>
            </button>
            <div className="relative flex items-center">
              <button 
                onClick={handleVolumeToggle}
                onMouseEnter={handleVolumeMouseEnter}
                onMouseLeave={handleVolumeMouseLeave}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                <i class={isMuted ? "ri-volume-mute-fill" : "ri-volume-up-fill"}></i>
              </button>
              
              {/* Volume Slider - Inline positioned */}
              <div 
                ref={volumeSliderRef}
                onMouseEnter={handleVolumeMouseEnter}
                onMouseLeave={handleVolumeMouseLeave}
                className={`transition-all duration-200 ${showVolumeSlider ? 'opacity-100 ml-2' : 'opacity-0 pointer-events-none w-0'}`}
              >
                <div className="bg-black bg-opacity-90 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${volume}%, #6b7280 ${volume}%, #6b7280 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <span className=" text-[#E56500] w-4 h-4">
              •
            </span>

            <span>Live</span>
            </div>
            <div className="flex gap-2 text-white lg:text-[27px] text-[23px]">
              <button 
                onClick={handleFullscreen}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <i class={isFullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}></i>
              </button>
            </div>
          </div>
        </div>
         {/* chat segment */}
      {showChat===true && (
        <div className="lg:hidden  self-stretch w-full h-[70vh]  border-[1px] border-[#48372D] rounded-xl flex flex-col">
        {/* header segment */}
        <header className="rounded-t-xl text-white w-full bg-[#6E4E37] flex justify-between items-center p-2 border-b border-[#48372D]">
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <h2>Top Chat</h2>
            <i className="ri-arrow-down-s-line text-xl" />
          </div>
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <i className="ri-more-fill text-xl" />
            <i
              className="ri-close-line text-xl"
              onClick={() => setShowChat(prev => !prev)}
            />
          </div>
        </header>

        <main className="w-full flex-1 overflow-y-scroll flex flex-col items-start ">
          {topChat.map((item) => (
            <div key={item.id} className="flex gap-1 mb-2 items-center">
              <img
                src={item.profilePic}
                alt={`${item.username} avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex gap-1 text-[14px] text-[#000000]">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-semibold">{item.username}</span>
                  <span>:</span>
                </div>
                <p className="font-medium flex-1 min-w-0 break-words">
                  {item.comment}
                </p>
              </div>
            </div>
          ))}
        </main>

        {/* footer segment */}
        <div className="border-t border-[#48372D] bg-[#6E4E37] w-full flex items-center justify-between px-2 py-3 rounded-b-xl">
          <div className="flex border border-gray-100 gap-2 bg-[#6E4E37] items-center justify-between text-[#D7D0D0] text-[14px] lg:px-4.5 lg:py-2 px-3 py-1 w-[80%] rounded-xl">
            <input
              type="text"
              className="border-none placeholder:text-[18px] placeholder:text-[#D7D0D0] flex-1 bg-[#6E4E37] outline-none"
              placeholder="Add a Comment"
            />
            <MdOutlineEmojiEmotions className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <span>
              <RiMoneyDollarCircleFill className="rounded-full bg-[#6E4E37] text-gray-100 font-light text-[35px]" />
            </span>
             <span onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)} className="cursor-pointer">
              <FaRegHeart className="rounded-full p-1 bg-gray-100 text-[#6E4E37] font-semibold text-[27px]" />
              {
                showReactions && (
                  <div onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}
                  className="absolute top-0 flex flex-col gap-0 bg-[#3c2a21] p-0.5 rounded-full shadow-lg z-50 font-semibold text-[20px]">
                    <span className="cursor-pointer hover:scale-110 transition">❤️</span>
                    <span className="cursor-pointer hover:scale-110 transition">😂</span>
                    <span className="cursor-pointer hover:scale-110 transition">🎊</span>
                    <span className="cursor-pointer hover:scale-110 transition">😳</span>
                    <span className="cursor-pointer hover:scale-110 transition">💯</span>
                  </div>
                )
              }
            </span>
          </div>
        </div>
      </div>
      )}
        {/* video detail segment */}
        <div className="w-full  flex flex-col gap-4">
          <div className="flex flex-row">
            <h1 className="text-[#000000] text-[20px] font-bold mr-1">
              {liveDetail?.title + "." || "Loading..."}
          </h1>
            {renderTags(liveDetail?.tags)}
          </div>
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 sm:gap-0 sm:justify-between">
            <div className="flex gap-1.5 items-center">
                <div className="relative">
              <img
                    src={liveDetail?.userId?.profilePhoto || userProfile?.profilePhoto || "https://via.placeholder.com/40"}
                alt="user profilePic"
                    className={`w-[40px] h-[40px] rounded-full object-cover ${
                      liveDetail?.live?.isLive 
                        ? "border-[3px] border-red-500 ring-2 ring-red-500 ring-opacity-50" 
                        : "border-[2px] border-gray-300"
                    }`}
                  />
                </div>
              <div className="flex flex-col justify-betweeen ">
                <h2 className="text-[#000000] font-semibold text-lg">
                  {liveDetail?.userId?.name + " " + liveDetail?.userId?.lastName || userProfile?.name + " " + userProfile?.lastName || "Loading..."}
                </h2>
                <div className="flex items-center gap-1 ">
                  <span className="text-[15px] text-[#48372D] font-medium">
                    {userProfile?.followersCount || "0"} 
                  </span>
                  <span className="text-[15px] text-[#E56500] font-semibold">
                    .
                  </span>
                  <span className="text-[#6F4D34] text-[15px] font-medium">
                  {categories?.find(cat => String(cat._id) === String(liveDetail?.category))?.mainCategoryName}
                  </span>
                </div>
              </div>

              {!isFollowing && (
                <button 
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                  className="ml-3 bg-[#6E4E37] text-[18px] font-bold text-white rounded-[22px] lg:py-1.5 lg:px-4 px-2 py-1 hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? "..." : "Follow"}
              </button>
              )}
              {isFollowing && (
                <div className="flex items-center gap-2 sm:ml-3">
                  <button className="bg-[#48372D] text-white text-[18px] font-bold rounded-full px-3 py-1.5 hover:opacity-90">
                    Join
                  </button>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                    className="text-[#48372D] border-[1px] border-[#48372D] text-[18px] font-bold rounded-full lg:py-1.5 lg:px-3 px-2 py-1 hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? "..." : "Unfollow"}
                  </button>
                </div>
              )}
            </div>
            {/* for buttons of like share */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex bg-[#6E4E37] rounded-[22px] px-3 py-1 gap-3">
                <button className="text-white lg:text-[18px] sm:text-[16px] font-bold">
                  <i class="ri-thumb-up-line text-white lg:text-[19px] text-[17px] font-medium"></i>{"  "}
                   {liveDetail?.likeCount || "0"}
                </button>
                <div className="w-px self-stretch  bg-gray-100  " />
                <button>
                  <i class="ri-thumb-down-line text-white lg:text-[19px] text-[17px] font-medium "></i>
                </button>
              </div>
              <button 
                onClick={handleShareClick}
                className="text-white lg:text-[18px] text-[16px] font-bold bg-[#6E4E37] rounded-[22px] px-3 py-1 hover:bg-[#5a3e2d] transition-colors duration-200"
              >
                <i class="ri-send-plane-fill  text-white bg-[#6E4E37] font-light"></i> Share
              </button>
              <button className="text-white lg:text-[18px] text-[16px] font-bold bg-[#6E4E37] rounded-[22px]  py-1 px-3">
                Report
              </button>
            </div>
            
            {/* Share Popup */}
            {showShare && (
              <div className="share-popup-container absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white text-black p-3 rounded-lg shadow-lg w-72 z-50">
                <p className="text-sm font-semibold mb-1">Share this stream:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={liveDetail?.live?.streamUrl || ''}
                    readOnly
                    className="flex-1 p-1 border rounded text-xs"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {
          showChat===false && 
          <button
            type="button"
            className="w-full text-center text-lg rounded-full font-bold bg-[#FEE2CC] p-1"
            onClick={() => setShowChat(prev => !prev)}
            aria-label="Toggle chat"
          >
            {showChat ? "Hide Chat" : "Show Chat"}
          </button>

        }
        {/* description section */}
        <div className="w-full bg-[#FEE2CC] flex flex-col px-4 py-3 rounded-xl gap-2">
          <div className="flex justify-between items-center text-[15px] text-[#000000]">
            <span>{liveDetail?.live?.viewCount || "0"} views</span>
            <span>{formatStreamTimeAgo(liveDetail?.live?.streamDuration)}</span>
          </div>
          <div className="text-[13px] text-[#000000]">
            {liveDetail?.description || "Loading description..."}
          </div>
        </div>

        <div className="flex gap-4  flex-col sm:flex-row">
          {/* Ad card */}
          <div className="sm:w-1/2 bg-[#FEE2CC] rounded-xl flex overflow-hidden ">
            {/* image */}
            <div className="w-[28%] flex-shrink-0">
              <img
                src={ad.pic}
                alt={ad.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            {/* detail */}
            <div className="flex flex-col justify-between p-3 flex-1">
              <div>
                <h3 className="text-[16px] font-medium mb-1 text-[#000000]">{ad.name}</h3>
                <p className="text-[14px] font-medium text-[#000000] mb-1">
                  {ad.price}
                </p>
                <p className="text-[12px] text-[#504D4D] line-clamp-2">
                  {ad.about}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#6E4E37]">
                  View Product
                </span>
                <FaChevronRight className="text-[#6E4E37] text-[20px] font-bold" />
              </div>
            </div>
          </div>

          {/* Sponsor card */}
          <div className="sm:w-1/2 bg-[#FEE2CC] rounded-xl flex flex-col justify-between overflow-hidden">
            <div className="flex p-3 gap-3">
              {/* image / logo */}
              <div className="flex-shrink-0">
                <img
                  src={sponsor.pic}
                  alt={sponsor.sponsorby}
                  className="w-14 h-14 object-cover rounded-full"
                />
              </div>
              {/* text */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-medium text-[#000000]">{sponsor.name}</h3>
                  <FaChevronUp className="text-[#6E4E37] text-[19px]" />
                </div>
                <div className="text-[13px] text-[#474242] mt-1 flex items-center gap-1">
                  <span className="font-medium">Sponsored</span>
                  <span className="text-[#E56500]">•</span>
                  <span className="font-medium">{sponsor.sponsorby}</span>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <button className="w-full bg-[#5E3F24] text-[18px] text-white py-2 rounded-full font-semibold hover:opacity-95 transition">
                Visit site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* chat segment */}
      {showChat===true && (
        <div className="hidden lg:flex lg:w-[29%] w-full h-[70vh] border-[1px] border-[#48372D] rounded-xl flex flex-col">
        {/* header segment */}
        <header className="relative rounded-t-xl text-white w-full bg-[#6E4E37] flex justify-between items-center p-2 border-b border-[#48372D]">
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <h2>Top Chat</h2>
            <i className="ri-arrow-down-s-line text-xl" />
          </div>
          <div className="flex items-center gap-2 text-[19px] font-medium">
            <i className="ri-more-fill text-xl" 
        onClick={() => setIsDropdownOpen(prev => !prev)}
      
            />
           <i
          className="ri-close-line text-xl"
          onClick={() => setShowChat(prev => !prev)}
        />

          </div>
          {/* Dropdown Menu */}
      {isDropdownOpen && (
      <div
        className="absolute right-0 top-6 bg-gray-200 mt-2 vid-drop z-[999] flex flex-col bg-gray-100 text-[#000000] text-sm rounded-xl shadow-lg w-41"
        ref={dropdownRef}
      >
        <button
          className="w-full p-1 hover:bg-gray-300 rounded-t-lg flex justify-evenly "
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-user-fill"></i>
          Participants
        </button>
        <hr className="w-[85%] mx-auto border-t border-gray-800" />
        <button
          className="w-full p-1 hover:bg-gray-300 flex justify-evenly"
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-external-link-line"></i>
          Pop-up Chat
        </button>
        <hr className="w-[85%] mx-auto border-t border-gray-800" />
        <button
          className="w-full p-1 hover:bg-gray-300 rounded-b-lg  flex justify-evenly"
          onClick={() => setIsDropdownOpen(false)}
        >
        <i class="ri-feedback-line"></i>
          Send Feedback
        </button>
        
      </div>
    )}
        </header>

        <main className="w-full flex-1 overflow-y-scroll flex flex-col items-start ">
          {topChat.map((item) => (
            <div key={item.id} className="flex gap-1 mb-2 items-center">
              <img
                src={item.profilePic}
                alt={`${item.username} avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex gap-1 text-[14px] text-[#000000]">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-semibold">{item.username}</span>
                  <span>:</span>
                </div>
                <p className="font-medium flex-1 min-w-0 break-words">
                  {item.comment}
                </p>
              </div>
            </div>
          ))}
        </main>

        {/* footer segment */}
        <div className="border-t border-[#48372D] bg-[#6E4E37] w-full flex items-center justify-between px-2 py-3 rounded-b-xl">
          <div className="flex border border-gray-100 gap-2 bg-[#6E4E37] items-center justify-between text-[#D7D0D0] text-[14px] lg:px-4.5 lg:px-2 py-1 w-[80%] rounded-xl">
            <input
              type="text"
              className="border-none placeholder:text-[18px] placeholder:text-[#D7D0D0] flex-1 bg-[#6E4E37] outline-none"
              placeholder="Add a Comment"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={() => setShowPicker((prev) => !prev)} className="ml-2">
              <MdOutlineEmojiEmotions className="text-xl" />
            </button>
            {
              showPicker && (
                <div className="absolute z-10 w-[280px] h-[350px] overflow-hidden">
                  <Picker onEmojiClick={onEmojiClick}/>
                </div>
              )
            }
          </div>
          <div className="flex items-center gap-0.5 relative inline-block">
            <span onClick={() => setShowSupportOptions(true)} className="w-full">
              <RiMoneyDollarCircleFill className="rounded-full bg-[#6E4E37] text-gray-100 font-light text-[35px] cursor-pointer" />
            </span>

            {showSupportOptions && (
             <div className="absolute bottom-12 right-[2px] w-[310px] rounded-xl bg-white shadow-lg p-4 z-50 border border-[#FFF] transform transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 font-bold text-[15px] text-[#6E4E37]">Show support to Vikas_k</span>
                  <button
                    onClick={() => setShowSupportOptions(false)}
                    className="text-base px-2 py-0.5 text-[#000] rounded hover:bg-[#ede6de]"
                  >
                    <IoClose className="text-xl text-[#000]"/>
                  </button>
                </div>

                <div className="space-y-3">
                  <div onClick={() => setShowSuperChat(!showSuperChat)} className="relative flex items-center justify-between gap-1 cursor-pointer bg-[#E7E7B1] px-1 rounded-full transition">
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-[#6E4E37] p-2 flex items-center justify-center">
                        <BiCommentCheck className="text-xl text-white" />
                      </div>
                      <span className="text-[#4E3B23] font-semibold">Super Chat</span>
                    </div>
                    <FaAngleRight className="text-xl text-[#000]" onClick={() => setShowSuperChat(false)}/>
                    {showSuperChat && (
                      <div className="fixed left-1/2 transform -translate-x-1/2 w-[310px] rounded-lg bg-white shadow-xl p-3 z-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-[#30953D]">Super Chat</span>
                          <button
                            onClick={() => setShowSuperChat(false)}
                            className="text-[#30953D] hover:bg-gray-100 rounded p-1"
                          >
                            <IoClose className="text-sm"/>
                          </button>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center bg-[#A9D6A9] rounded-md py-1.5 px-3 mb-2">
                            <p className="text-[#000] text-sm font-medium">Lucky Singh</p>
                            <p className="text-[#000] text-sm font-medium">₹{value}.0</p>
                          </div>
                          <div className="flex flex-col items-center mb-2">
                            <span className="text-[#000] text-sm font-semibold mb-2">₹{value}.0</span>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={value} 
                              onChange={(e) => {setValue(e.target.value)}} 
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mb-2"
                              style={{
                                background: `linear-gradient(to right, #30953D 0%, #30953D ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <button className="w-full bg-[#A9D6A9] text-sm text-[#000] font-medium py-2 rounded-md hover:bg-[#98c498] transition-colors">
                            Buy and Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 cursor-pointer bg-[#E7E7B1] px-1 rounded-full transition">
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-[#6E4E37] p-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-white">ar_stickers</span>
                      </div>
                      <span className="text-[#4E3B23] font-semibold">Super Stickers</span>
                    </div>
                    <FaAngleRight className="text-xl text-[#000]"/>
                  </div>
                  <div className="flex items-center justify-between gap-1 cursor-pointer bg-[#E7E7B1] px-1 rounded-full transition">
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-[#6E4E37] p-2 flex items-center justify-center">
                        <MdPeopleAlt className="text-xl text-white" />
                      </div>
                      <span className="text-[#4E3B23] font-semibold">Membership</span>
                    </div>
                    <FaAngleRight className="text-xl text-[#000]"/>
                  </div>
                  {/* <div className="flex items-center justify-between gap-1 cursor-pointer bg-[#E7E7B1] px-1 rounded-full transition">
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-[#6E4E37] p-2 flex items-center justify-center">
                        <CiGift className="text-xl text-white" />
                      </div>
                      <span className="text-[#4E3B23] font-semibold">In App Gifting</span>
                    </div>
                    <FaAngleRight className="text-xl text-[#000]"/>
                  </div> */}
                </div>
              </div>
            )}
  
            <span onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)} className="cursor-pointer">
              <FaRegHeart className="rounded-full p-1 bg-gray-100 text-[#6E4E37] font-semibold text-[27px]" />
              {
                showReactions && (
                  <div onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}
                  className="absolute bottom-0 flex flex-col gap-0 bg-[#3c2a21] p-0.5 rounded-full shadow-lg z-50 font-semibold text-[20px]">
                    <span className="cursor-pointer hover:scale-110 transition">❤️</span>
                    <span className="cursor-pointer hover:scale-110 transition">😂</span>
                    <span className="cursor-pointer hover:scale-110 transition">🎊</span>
                    <span className="cursor-pointer hover:scale-110 transition">😳</span>
                    <span className="cursor-pointer hover:scale-110 transition">💯</span>
                  </div>
                )
              }
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default OthersLive;
