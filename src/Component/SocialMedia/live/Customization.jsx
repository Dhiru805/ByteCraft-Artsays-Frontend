import React, { useState, useEffect, useRef } from "react";
import { RiImageAddLine } from "react-icons/ri";
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
      try {
        const response = await getAPI(`/auth/user/${formData.userId}`);
        setUsername(response.data.username); // get username from response
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [formData.userId]);

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
      navigate(`/social-media/${response.data.streamKey}/${username}`);
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
          className={`flex w-1/2 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tl-2xl ${activeTab === "details" ? "bg-[#48372D] text-white" : ""
            }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </div>
        <div
          className={`flex w-1/2 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tr-2xl ${activeTab === "customization" ? "bg-[#48372D] text-white" : ""
            }`}
          onClick={() => setActiveTab("customization")}
        >
          Customization
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
    </main>

    {/* Footer */}
    <div className="p-3 flex justify-end bg-white rounded-b-xl sm:border-t sm:border-[#48372D] ">
      <button
        className="bg-[#48372D] text-white px-6 py-2 rounded-md"
        onClick={() => {
          if (activeTab === "details") {
            setActiveTab("customization");
          } else {
            handleSubmit();
          }
        }}
      >
        {activeTab === "details" ? "Next" : "Done"}
      </button>
    </div>
  </div>
);
};

export default Customization;
