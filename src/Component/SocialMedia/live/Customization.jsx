import React, { useState, useEffect, useRef } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { FaCamera, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import postAPI from "../../../api/postAPI";
import { toast } from "react-toastify";
import getAPI from "../../../api/getAPI";
import { useNavigate } from "react-router-dom";

const Customization = () => {
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId"),
    title: "",
    description: "",
    category: "",
    thumbnail: null,
    paidPromotion: false,
    tags: [],
    language: "",
    license: "Standard YouTube License",
    allowEmbedding: false,
    comments: {
      comments: true,
      sortBy: "top",
    },
    customization: {
      comments: {
        liveChat: false,
        liveChatReplay: false,
        liveChatSummary: false,
      },
      participantModes: {
        anyone: false,
        subscribers: false,
        liveCommentary: false,
      },
      reactions: {
        liveReactions: false,
      },
    },
    streamKey: "",
  });
  const [activeTab, setActiveTab] = useState("details");
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Preview tab state
  const [previewStream, setPreviewStream] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending'); // 'pending', 'granted', 'denied'
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const previewVideoRef = useRef(null);


  // const generateStreamKey = () => {
  //   const array = new Uint8Array(16);
  //   window.crypto.getRandomValues(array);
  //   const streamKey = Array.from(array, (byte) =>
  //     byte.toString(11).padStart(2, "0")
  //   ).join("");
  //   return streamKey;
  // };

  const generateStreamKey = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const array = new Uint8Array(11);
    window.crypto.getRandomValues(array);
    const streamKey = Array.from(array, (byte) =>
      characters[byte % characters.length]
    ).join("");
    return streamKey;
  };


  useEffect(() => {
    const streamKey = generateStreamKey();
    setFormData((prev) => ({ ...prev, streamKey }));
  }, []);

  const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "eu", name: "Basque" },
    { code: "bn", name: "Bengali" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "zh", name: "Chinese (Mandarin)" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "id", name: "Indonesian" },
    { code: "ga", name: "Irish" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "la", name: "Latin" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "mk", name: "Macedonian" },
    { code: "ms", name: "Malay" },
    { code: "mt", name: "Maltese" },
    { code: "no", name: "Norwegian" },
    { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sr", name: "Serbian" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "es", name: "Spanish" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "th", name: "Thai" },
    { code: "te", name: "Telugu" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "vi", name: "Vietnamese" },
  ];


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


  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleCustomizationChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        [section]: {
          ...prev.customization[section],
          [key]: value,
        },
      },
    }));
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleTags = (e) => {
    if ((e.key === "," || e.key === "Enter") && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, or GIF).");
        return;
      }
      setIsLoading(true);
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        alert("Failed to read the file. Please try again.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!formData.userId) return;
      try {
        const response = await getAPI(`/auth/userid/${formData.userId}`);
        const fetchedUsername = response?.data?.user?.username;
        if (fetchedUsername) {
          setUsername(fetchedUsername);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [formData.userId]);

  // Request camera and microphone permissions
  const requestMediaPermissions = async () => {
    try {
      setPermissionStatus('pending');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setPreviewStream(stream);
      setPermissionStatus('granted');
      setIsMicOn(true);
      setIsCameraOn(true);

      // Set video element source
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      toast.success("Camera and microphone access granted!");
    } catch (error) {
      console.error("Permission error:", error);
      setPermissionStatus('denied');
      
      let errorMessage = "Failed to access camera/microphone";
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera/microphone access denied. Please allow permissions in your browser settings.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera/microphone found. Please connect your devices.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Media access not supported in this browser.";
      }
      toast.error(errorMessage);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (previewStream) {
      const audioTracks = previewStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (previewStream) {
      const videoTracks = previewStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Cleanup preview stream on unmount or tab change
  useEffect(() => {
    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [previewStream]);

  // Set video source when stream changes
  useEffect(() => {
    if (previewVideoRef.current && previewStream) {
      previewVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const handleSubmit = async (e) => {
  setIsLoading(true);
 
  try {
 
    const requiredFields = [
      { field: formData.title, name: "Title" },
      { field: formData.description, name: "Description" },
      { field: formData.category, name: "Category" },
      { field: formData.language, name: "Language" },
      { field: formData.thumbnail, name: "Thumbnail" },
      { field: formData.comments.comments, name: "Comments" },
      { field: formData.comments.sortBy, name: "SortBy" },
      { field: formData.tags.length > 0, name: "Tags" },
      { field: formData.streamKey, name: "Stream Key" },
    ];
 
    const missingFields = requiredFields
      .filter(({ field }) => !field || (typeof field === "string" && !field.trim()))
      .map(({ name }) => name);
 
    if (missingFields.length > 0) {
      toast.error(`Please fill the required fields: ${missingFields.join(", ")}`);
      setIsLoading(false);
      return;
    }
 
 
    const submissionData = new FormData();
    submissionData.append("userId", formData.userId);
    submissionData.append("title", formData.title.trim());
    submissionData.append("description", formData.description.trim());
    submissionData.append("category", formData.category.trim());
    submissionData.append("paidPromotion", formData.paidPromotion);
    submissionData.append("language", formData.language.trim());
    submissionData.append("license", formData.license);
    submissionData.append("allowEmbedding", formData.allowEmbedding);
    submissionData.append("tags", JSON.stringify(formData.tags));
    submissionData.append("comments", JSON.stringify(formData.comments));
    submissionData.append("customization", JSON.stringify(formData.customization));
    submissionData.append("streamKey", formData.streamKey);
 
    if (formData.thumbnail) {
      submissionData.append("thumbnail", formData.thumbnail);
    }
 
 
    for (const [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
 
 
    const response = await postAPI(
      "/api/social-media/create-live",
      submissionData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
 
 
    if (response.data?.success) {
      toast.success(formData._id ? "Live updated successfully!" : "Live created successfully!");
      setThumbnailPreview(null);
      const resolvedStreamKey = response.data?.streamKey || formData.streamKey;
      const usernameSlug = username?.trim()
        ? username
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        : "creator";
      navigate(`/social-media/${resolvedStreamKey}/${usernameSlug || "creator"}`);
    } else {
      toast.error(response.data?.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Submit error:", error);
    toast.error(error.response?.data?.message || "Error saving live details");
  } finally {
    setIsLoading(false);
  }
};
return (
  <div className="lg:w-[56%] w-full sm:mx-auto sm:border-[0.5px] sm:border-[#48372D]  bg-white flex flex-col sm:h-[80vh] sm:rounded-t-xl sm:rounded-b-xl">
    {/* Header Tabs */}
    <header className="flex flex-col w-full border-b border-[#48372D] mb-2 sm:mb-0 ">
      <div className="flex justify-evenly w-full rounded-t-xl border-b border-[#48372D]">
        <div
          className={`flex w-1/3 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tl-2xl ${activeTab === "details" ? "bg-[#48372D] text-white" : ""
            }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </div>
        <div
          className={`flex w-1/3 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 ${activeTab === "customization" ? "bg-[#48372D] text-white" : ""
            }`}
          onClick={() => setActiveTab("customization")}
        >
          Customization
        </div>
        <div
          className={`flex w-1/3 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tr-2xl ${activeTab === "preview" ? "bg-[#48372D] text-white" : ""
            }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </div>
      </div>
      {activeTab === "details" && (
        <div className="text-xl text-[#48372D] font-bold border-[1px] border-solid p-3 border border-[#48372D]">
          Details
        </div>
      )}
      {activeTab === "customization" && (
        <div className="p-3 ">
          <h2 className="text-[26px]  font-bold text-[#48372D]">Customization</h2>
          <p className="text-[16px] text-[#474242]">
            Settings to tailor your stream to your needs
          </p>
        </div>
      )}
      {activeTab === "preview" && (
        <div className="p-3 ">
          <h2 className="text-[26px] font-bold text-[#48372D]">Preview</h2>
          <p className="text-[16px] text-[#474242]">
            Test your camera and microphone before going live
          </p>
        </div>
      )}
    </header>

    {/* Scrollable main content */}
    <main className="flex-1 overflow-y-scroll w-full sm:w-[90%] sm:mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {activeTab === "details" && (
        <div className="flex flex-col gap-6 sm:p-2">
          {/* Title */}
          <div className="flex items-center p-2.5 border-[1px] border-[#48372D] rounded-xl gap-1">
            <div className="text-[18px] text-[#474242] font-semibold ml-2">Title</div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="rounded-md outline-none border-none placeholder:text-[18px] placeholder:text-[#474242] flex-1"
              placeholder="(required)"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col items-start p-3 rounded-xl border-[1px] border-[#48372D] ">
            <div className="text-[18px] text-[#474242] font-semibold ml-2">Description</div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg placeholder:text-[#474242] placeholder:text-[17px] ml-2"
              placeholder="Tell viewers more about your stream"
            ></textarea>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#48372D] text-[20px] font-semibold">Category</h2>
            <p className="text-[#474242] text-[16px]">Add your stream to a category so viewers can find it more easily.</p>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="border-[1px] border-[#48372D] w-1/2 rounded-md p-2 text-[18px] font-bold text-[#48372D]"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-[18px] text-[#474242]">
                  {cat.mainCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#48372D] text-[20px] font-semibold">Thumbnail</h2>
            <p className="text-[#474242] text-[16px]">Select or upload a picture that represents your stream.</p>
            <label
              htmlFor="thumbnail"
              className={`w-half max-w-xs h-40 rounded-md flex flex-col items-center justify-center py-3 text-center cursor-pointer bg-white relative overflow-hidden ${!imagePreview ? 'border-dashed border-2 border-gray-400' : ''
                }`}
            >
              <input
                type="file"
                id="thumbnail"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {isLoading && <span className="text-sm text-gray-600">Loading...</span>}
              {!isLoading && !imagePreview && (
                <>
                  <RiImageAddLine size={22} className="text-gray-600" />
                  <span className="text-sm text-gray-600" aria-label="Upload a thumbnail image">
                    Upload thumbnail
                  </span>
                </>
              )}
              {imagePreview && (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                </>
              )}
            </label>
          </div>

          {/* Paid Promotion */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#48372D] text-[20px] font-semibold">Paid Promotion</h2>
            <p className="text-[#474242] text-[16px] ">If you accepted anything of value from a third party to make stream,
              you must let us know. We'll show viewers a message that your stream contains paid promotion.</p>
            <label className="mt-2 text-[#48372D] text-[20px] font-semibold">
              <input
                type="checkbox"
                name="paidPromotion"
                checked={formData.paidPromotion}
                onChange={handleChange}
                className="mr-2"
              />
              This stream contains paid promotion like a product, sponsorship, or endorsement
            </label>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#48372D] text-[20px] font-semibold">Tags</h2>
            <p className="text-[#474242] text-[16px] ">Tags can be useful in your stream, tags play a minimal role in helping users find your stream.</p>
            <div className="relative p-2 rounded-xl border-[1px] border-[#48372D]">
              <div className="flex flex-wrap items-center gap-2 text-[18px] ml-2">Enter your tags
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center px-2 py-1 bg-gray-200 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTags}
                  className="rounded-md outline-none border-none placeholder:text-[18px] placeholder:text-[#474242] flex-1"
                  placeholder="(enter a comma after each tag)"
                />
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#48372D] text-[20px] font-semibold">Language</h2>
            <p className="text-[#474242] text-[16px]">Select your stream's language</p>
            <div className="w-1/2 relative">
              <div
                className="w-full rounded-xl border-[1px] border-[#48372D] py-3 px-3 text-[18px] font-bold text-[#474242] cursor-pointer flex items-center justify-between"
                onClick={() => setShowSearch(!showSearch)}
              >
                <span>{formData.language || "Select Language"}</span>
                <span className="text-[#48372D]">&#9660;</span>
              </div>
              {showSearch && (
                <div
                  className="absolute top-full left-0 w-full mt-1 bg-white border-[1px] border-[#48372D] rounded-xl max-h-60 overflow-y-auto z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border-b-[1px] border-[#48372D] rounded-t-xl text-[16px] text-[#474242]"
                    placeholder="Search languages..."
                    autoFocus
                  />
                  <ul className="py-2">
                    {filteredLanguages.map((lang) => (
                      <li
                        key={lang.code}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, language: lang.name }));
                          setShowSearch(false);
                          setSearchTerm("");
                        }}
                        className="px-3 py-2 text-[16px] text-[#474242] cursor-pointer hover:bg-gray-100"
                      >
                        {lang.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* License */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[#48372D] text-[20px] font-semibold">License</h2>
            <label className="text-[18px] text-[#474242]">
              <input
                type="checkbox"
                name="allowEmbedding"
                checked={formData.allowEmbedding}
                onChange={handleChange}
                className="mr-2"
              />
              Allow embedding
            </label>
          </div>

          {/* Comments */}
          <div>
            <h2 className="text-[#48372D] text-[20px] font-semibold">Comments</h2>
            <div className="flex gap-6">
              <div className="sm:w-1/3 w-1/2 border-[1px] border-[#48372D] rounded-xl p-2">
                <p className="text-[18px] text-[#474242]">Comments</p>
                <select
                  value={formData.comments.comments}
                  onChange={(e) =>
                    handleNestedChange("comments", "comments", e.target.value)
                  }
                  className="w-full rounded-md p-2 text-[18px] font-bold text-[#474242]"
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                  <option value="PAUSE">PAUSE</option>
                </select>
              </div>
              <div className="sm:w-1/3 w-1/2 border-[1px] border-[#48372D] rounded-xl p-2">
                <p className="text-[18px] text-[#474242]">Sort by</p>
                <select
                  value={formData.comments.sortBy}
                  onChange={(e) =>
                    handleNestedChange("comments", "sortBy", e.target.value)
                  }
                  className="w-full rounded-md p-2 text-[18px] font-bold text-[#474242]"
                >
                  <option value="top">Top</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Tab */}
      {activeTab === "customization" && (
        <div className="min-h-full flex flex-col gap-6 ">
          {/* Comments Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Comments</h3>
            <div className="flex flex-col gap-2 text-[#48372D] text-[16px] ml-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.comments.liveChat}
                  onChange={(e) =>
                    handleCustomizationChange("comments", "liveChat", e.target.checked)
                  }
                  className="accent-[#48372D]"
                />
                <span>Live chat</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.comments.liveChatReplay}
                  onChange={(e) =>
                    handleCustomizationChange("comments", "liveChatReplay", e.target.checked)
                  }
                  className="accent-[#48372D]"
                />
                <span>Live chat replay</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.comments.liveChatSummary}
                  onChange={(e) =>
                    handleCustomizationChange("comments", "liveChatSummary", e.target.checked)
                  }
                  className="accent-[#48372D]"
                />
                <span>Live chat summary</span>
              </label>
            </div>
          </div>

          {/* Participant Modes */}
          <div>
            <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Participant modes</h3>
            <p className="text-[16px] text-[#474242] mb-2">Who can send messages</p>
            <div className="flex flex-col gap-2 text-[#48372D] text-[16px] ml-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.participantModes.anyone}
                  onChange={(e) =>
                    handleCustomizationChange("participantModes", "anyone", e.target.checked)
                  }
                  className="accent-[#48372D]"
                />
                <span>Anyone</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.participantModes.subscribers}
                  onChange={(e) =>
                    handleCustomizationChange("participantModes", "subscribers", e.target.checked)
                  }
                  className="accent-[#48372D]"
                />
                <span>Subscribers</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customization.participantModes.liveCommentary}
                  onChange={(e) =>
                    handleCustomizationChange(
                      "participantModes",
                      "liveCommentary",
                      e.target.checked
                    )
                  }
                  className="accent-[#48372D]"
                />
                <span>Live commentary (approved users)</span>
              </label>
            </div>
          </div>

          {/* Reactions */}
          <div>
            <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Reactions</h3>
            <label className="flex items-center text-[#48372D] text-[16px] ml-4  gap-2">
              <input
                type="checkbox"
                checked={formData.customization.reactions.liveReactions}
                onChange={(e) =>
                  handleCustomizationChange("reactions", "liveReactions", e.target.checked)
                }
                className="accent-[#48372D]"
              />
              <span>Live reactions</span>
            </label>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="min-h-full flex flex-col gap-6 p-2">
          {/* Permission Request Section */}
          {permissionStatus === 'pending' && !previewStream && (
            <div className="flex flex-col items-center justify-center gap-6 py-10">
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-[#48372D]/10 flex items-center justify-center">
                    <IoVideocam className="text-[#48372D] text-4xl" />
                  </div>
                  <span className="text-[#474242] text-[16px]">Camera</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-[#48372D]/10 flex items-center justify-center">
                    <FaMicrophone className="text-[#48372D] text-4xl" />
                  </div>
                  <span className="text-[#474242] text-[16px]">Microphone</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-[#48372D] text-[20px] font-semibold mb-2">
                  Allow Camera & Microphone Access
                </h3>
                <p className="text-[#474242] text-[16px] max-w-md">
                  To start your live stream, we need access to your camera and microphone. 
                  Click the button below to grant permission.
                </p>
              </div>
              <button
                onClick={requestMediaPermissions}
                className="bg-[#48372D] text-white px-8 py-3 rounded-xl text-[18px] font-semibold hover:bg-[#5a473d] transition-colors flex items-center gap-2"
              >
                <FaCamera className="text-xl" />
                Allow Access
              </button>
            </div>
          )}

          {/* Permission Denied Section */}
          {permissionStatus === 'denied' && (
            <div className="flex flex-col items-center justify-center gap-6 py-10">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <IoVideocamOff className="text-red-500 text-5xl" />
              </div>
              <div className="text-center">
                <h3 className="text-red-500 text-[20px] font-semibold mb-2">
                  Permission Denied
                </h3>
                <p className="text-[#474242] text-[16px] max-w-md">
                  Camera and microphone access was denied. Please enable permissions in your browser settings and try again.
                </p>
              </div>
              <button
                onClick={requestMediaPermissions}
                className="bg-[#48372D] text-white px-8 py-3 rounded-xl text-[18px] font-semibold hover:bg-[#5a473d] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Live Preview Section */}
          {permissionStatus === 'granted' && previewStream && (
            <div className="flex flex-col gap-6">
              {/* Video Preview */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <IoVideocamOff className="text-white text-6xl mx-auto mb-2" />
                      <p className="text-white text-[16px]">Camera is off</p>
                    </div>
                  </div>
                )}
                {/* Live indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    PREVIEW
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-6">
                <button
                  onClick={toggleCamera}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isCameraOn 
                      ? 'bg-[#48372D] text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                  title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                >
                  {isCameraOn ? <IoVideocam className="text-2xl" /> : <IoVideocamOff className="text-2xl" />}
                </button>
                <button
                  onClick={toggleMic}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isMicOn 
                      ? 'bg-[#48372D] text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                  title={isMicOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {isMicOn ? <FaMicrophone className="text-2xl" /> : <FaMicrophoneSlash className="text-2xl" />}
                </button>
              </div>

              {/* Status Info */}
              <div className="flex justify-center gap-8 text-[16px]">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isCameraOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-[#474242]">Camera: {isCameraOn ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-[#474242]">Microphone: {isMicOn ? 'On' : 'Off'}</span>
                </div>
              </div>

              {/* Ready message */}
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 text-[16px] font-medium">
                  ✓ You're all set! Click "Go Live" to start your stream.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>

    {/* Footer */}
    <div className="p-3 flex justify-between bg-white rounded-b-xl sm:border-t sm:border-[#48372D] ">
      {activeTab !== "details" && (
        <button
          className="border border-[#48372D] text-[#48372D] px-6 py-2 rounded-md hover:bg-gray-50"
          onClick={() => {
            if (activeTab === "customization") {
              setActiveTab("details");
            } else if (activeTab === "preview") {
              setActiveTab("customization");
            }
          }}
        >
          Back
        </button>
      )}
      {activeTab === "details" && <div></div>}
      <button
        className={`px-6 py-2 rounded-md ${
          activeTab === "preview" && permissionStatus !== 'granted'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#48372D] text-white hover:bg-[#5a473d]'
        }`}
        onClick={() => {
          if (activeTab === "details") {
            setActiveTab("customization");
          } else if (activeTab === "customization") {
            setActiveTab("preview");
          } else if (activeTab === "preview") {
            if (permissionStatus === 'granted') {
              // Stop preview stream before navigating
              if (previewStream) {
                previewStream.getTracks().forEach((track) => track.stop());
              }
              handleSubmit();
            } else {
              toast.error("Please grant camera and microphone permissions before going live.");
            }
          }
        }}
        disabled={activeTab === "preview" && permissionStatus !== 'granted'}
      >
        {activeTab === "details" ? "Next" : activeTab === "customization" ? "Next" : "Go Live"}
      </button>
    </div>
  </div>
);
};

export default Customization;
