import React, { useState, useEffect, useMemo } from "react";
import getAPI from "../../../../src/api/getAPI";
import postAPI from "../../../../src/api/postAPI";
import Sidebar from "../Sidebar/Sidebar";
import { MdVerified } from "react-icons/md";
import { Link,  useLocation } from "react-router-dom"; //
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Post.css";

const Uploadpost = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for userId:", userId);
        const res = await getAPI(
          `/api/social-media/profile/${userId}`,
          {},
          false,
          true
        );
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          console.log(res.data.profile);
        }
      } catch (error) {
        console.error(" Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const uploadPost = async () => {
    if (images.length === 0) {
      toast.error("Please select an image before posting.");
      return;
    }

    const payload = {
      userId,
      caption: description,
      location: locationInput,
      collaborators: collaborators.map((c) => c._id),
      image: images, // currently sending only first image (schema allows one image)
    };

    try {
      const res = await postAPI(
        "/api/social-media/create-post",
        payload,
        true, // include params
        true // private (requires token)
      );

      if (res && !res.hasError) {
        toast.success("Post uploaded successfully!");
        navigate("/social-media/profile"); // Redirect to home or another page
        console.log(res.data.post);
      } else {
        toast.error(res?.message || "Failed to upload post");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const location = useLocation();
  const passedImages = useMemo(() => {
    return location.state?.images || [];
  }, [location.state?.images]);

  const [images, setImages] = useState(passedImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Form states
  const [description, setDescription] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await getAPI(
          `/api/social-media/collaborator?query=${searchQuery}`,
          {},
          false,
          true
        );

        if (res?.data?.collaborators) {
          setSuggestions(res.data.collaborators);
        }
      } catch (error) {
        console.error("Error fetching collaborator suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce typing
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // New state for location
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Fetch location suggestions (OpenStreetMap API)
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (locationInput.trim().length < 2) {
        setLocationSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${locationInput}&format=json&addressdetails=1&limit=5`,
          { headers: { "User-Agent": "your-app-name" } }
        );

        const data = await response.json();
        setLocationSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(fetchLocationSuggestions, 300); // debounce
    return () => clearTimeout(delayDebounce);
  }, [locationInput]);

  // Update images if navigation changes
  useEffect(() => {
    if (passedImages.length > 0) {
      setImages(passedImages);
      setCurrentImageIndex(0);
    }
  }, [passedImages]);

  // Carousel
  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);

    if (updatedImages.length === 0) {
      setImages([]);
      setCurrentImageIndex(0);
      return;
    }

    if (index === currentImageIndex) {
      setCurrentImageIndex(index % updatedImages.length);
    } else if (index < currentImageIndex) {
      setCurrentImageIndex((prev) => prev - 1);
    }

    setImages(updatedImages);
  };

  return (
    <div className="flex justify-between w-full">
      <Sidebar className="w-[22%] " />

      <div className="w-[78%] mx-auto flex flex-col ab  lg:mt-8">
        {/* Header */}
        <div className="w-full bg-[#000000] flex items-center justify-between rounded-t-xl header">
          <Link to="/social-media/create-post">
            <i className="text-[30px] ri-arrow-left-s-line text-white ml-2"></i>
          </Link>
          <p className="text-lg text-white font-medium">Create new post</p>
          <div></div>
        </div>

        {/* Main Section */}
        <div className="w-full abc flex lg:flex-row flex-col justify-between lg:border-[1.5px] lg:border-[#48372D] rounded-b-lg lg:h-[65vh]">
          {/* Image Carousel */}
          <div className="relative flex items-center justify-center w-[65%] bg-black image-side">
            {images.length > 0 ? (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 text-white text-3xl px-2 py-1 rounded-full z-10"
                >
                  <i className="ri-arrow-left-s-line text-white bg-[#000000CC] opacity-80 rounded-full"></i>
                </button>

                <img
                  src={images[currentImageIndex]}
                  alt="post"
                  className="object-contain h-full w-full object-cover rounded-bl-lg"
                />

                <button
                  onClick={handleNext}
                  className="absolute right-2 text-white text-3xl px-2 py-1 rounded-full z-10"
                >
                  <i className="ri-arrow-right-s-line text-white bg-[#000000CC] opacity-80 rounded-full"></i>
                </button>
              </>
            ) : (
              <p className="text-white">No images selected</p>
            )}
          </div>

          {/* Post Info Section */}
          <div className="flex flex-col items-center justify-center w-[35%] gap-4 mx-4  information-side">
            {/* Profile */}
            <div className="w-full flex items-center justify-start gap-3">
              <img
                src={profile?.profilePhoto}
                className="w-[65px] rounded-full"
                alt="Profile"
              />
              <p className="text-lg font-medium">{profile?.username}</p>
              <MdVerified className="inline text-blue-500 text-lg" />
            </div>
            {/* Post Description */}
            <div className="w-full bg-[#F0EDEB] h-40 flex flex-col items-center justify-between rounded-lg py-2 px-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-none bg-transparent outline-none my-2 mx-2 overflow-scroll"
                placeholder="Post Description "
              />
              <div className="w-full flex items-center justify-between px-2">
                <i className="ri-emoji-sticker-line text-sm"></i>
                <p className="text-sm font-medium text-gray-800">
                  {description.length}/2000
                </p>
              </div>
            </div>
            {/* Location */}
            <div className="w-full bg-[#F0EDEB] flex flex-col px-2 rounded-lg relative">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full border-none bg-transparent outline-none my-2 mx-2 overflow-scroll placeholder:text-[#1F1E1E] placeholder:font-medium text-sm"
                placeholder="Add Location"
              />
              <i className="ri-map-pin-2-fill absolute right-2 top-3 text-lg text-[#1F1E1E]"></i>

              {/* Location Suggestions Dropdown */}
              {locationSuggestions.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white rounded shadow-md max-h-40 overflow-y-auto z-20">
                  {locationSuggestions.map((loc, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200 text-sm"
                      onClick={() => {
                        setLocationInput(loc.display_name); // fill input
                        setLocationSuggestions([]); // close dropdown
                      }}
                    >
                      {loc.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Collaborators */}
            <div className="w-full bg-[#F0EDEB] flex flex-col px-2 rounded-lg relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none bg-transparent outline-none my-2 mx-2 overflow-scroll placeholder:text-[#1F1E1E] placeholder:font-medium text-sm"
                placeholder="Search Collaborators"
              />
              <i className="ri-at-line absolute right-2 top-3 text-lg text-[#1F1E1E]"></i>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white rounded shadow-md max-h-40 overflow-y-auto z-20">
                  {suggestions.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        if (!collaborators.find((c) => c._id === user._id)) {
                          setCollaborators([...collaborators, user]);
                        }
                        setSearchQuery(""); // clear search
                        setSuggestions([]); // hide dropdown
                      }}
                    >
                      <img
                        src={user?.profilePhoto}
                        alt={user?.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <p className="text-sm">{user?.username}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Collaborators */}
              <div className="flex flex-wrap gap-2 p-2">
                {collaborators.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center bg-gray-300 rounded-full px-2 py-1 text-sm"
                  >
                    <img
                      src={c?.profilePhoto}
                      alt={c?.username}
                      className="w-5 h-5 rounded-full mr-1"
                    />
                    {c?.username}
                    <button
                      className="ml-1 text-xs text-red-600"
                      onClick={() =>
                        setCollaborators(
                          collaborators.filter((col) => col._id !== c._id)
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Share To */}{" "}
            <div className="w-full bg-[#F0EDEB] flex flex-col items-center justify-between px-2 rounded-lg">
              {" "}
              <p className="text-lg font-medium">Share to</p>{" "}
              {/* Example Items (same as yours) */}{" "}
              <div className="w-full flex items-center justify-between p-1 rounded-lg">
                {" "}
                <div className="flex items-center">
                  {" "}
                  <img
                    src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"
                    className="w-[35px] rounded-full"
                    alt="Profile"
                  />{" "}
                  <div className="flex flex-col ml-2">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <p className="text-sm font-medium">Vikas Khanna</p>{" "}
                      <MdVerified className="inline text-blue-500 ml-1" />{" "}
                    </div>{" "}
                    <p className="text-sm font-light">Threads . Private</p>{" "}
                  </div>{" "}
                </div>{" "}
                <i className="ri-add-large-line text-lg text-[#1F1E1E] font-semibold"></i>{" "}
              </div>{" "}
            </div>
            {/* Post Button */}
            <div className="w-full flex items-center justify-end">
              <input
                type="submit"
                className="px-3 bg-[#6E4E37] text-white font-medium text-[21px] py-[1px] rounded-[9px]"
                value="Post"
                onClick={uploadPost}
              />
            </div>
          </div>
        </div>

        {/* Footer Thumbnails */}
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 w-full h-[130px] overflow-x-auto">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-22 h-22 rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt={`thumbnail-${index}`}
                  className={`w-[150px] h-[150px] object-cover rounded cursor-pointer ${
                    currentImageIndex === index ? "ring-2 ring-[#6E4E37]" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
                <button
                  className="absolute top-0 right-0 text-black text-xs p-1 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <i className="ri-close-line text-white bg-gray-900 p-1 rounded-full"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploadpost;
