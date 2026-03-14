import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";

const EditLiveModal = ({ onClose, liveDetail, fetchLive}) => {
  const [formData, setFormData] = useState({
  _id: liveDetail._id,
  userId: localStorage.getItem("userId"),
  title: liveDetail.title,
  description: liveDetail.description,
  category: liveDetail.category,
  tags: liveDetail.tags,   
  thumbnail: liveDetail.thumbnail,
  comments: {
    comments: liveDetail.comments.comments,
    sortBy: liveDetail.comments.sortBy,
  },
  privacy: liveDetail.privacy,
  streamKey: liveDetail.streamKey
});

  const [thumbnail, setThumbnail] = useState(null); 
  const [preview, setPreview] = useState(liveDetail?.thumbnail ? `${process.env.REACT_APP_API_URL}/${liveDetail?.thumbnail?.replace(/\\/g, "/")}` : ""); // preview existing/new
  const [loading, setLoading] = useState(false);
  const [categories, setCategories ] = useState([]);
  const [tagInput, setTagInput] = useState("");

  //To fetch Categories
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

  //To fetch LiveDetails
  useEffect(() => {
  const fetchLiveDetails = async () => {
    try {
      // const userId = liveDetail?.userId?._id || liveDetail?.userId;
      const streamKey = liveDetail?.live?.streamKey;
        if (!streamKey) {
          console.error("No valid userId provided");
          toast.error("Invalid user ID");
          return;
        }
        console.log(streamKey);
      const response = await getAPI(`/api/social-media/live/${streamKey}`, true);

      if (!response.hasError && response.data?.data) {
        const live = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
        if(live){
            setFormData({
            _id: live._id,
            userId: live.userId,
            title: live.title || "",
            description: live.description || "",
            category: live.category || "",
            tags: live.tags || [],
            thumbnail: live.thumbnail || null,
            comments: {
              comments: live.comments?.comments || "ON",
              sortBy: live.comments?.sortBy || "top",
            },
            privacy: live.privacy || "Public",
          });

          // Set preview to fully-qualified URL if thumbnail exists
          if (live.thumbnail) {
            const normalized = String(live.thumbnail).replace(/\\\\/g, "/");
            setPreview(`${process.env.REACT_APP_API_URL}/${normalized}`);
          } else {
            setPreview("");
          }
        }
      }
      console.log(response)
    } catch (error) {
      console.error("Error fetching live details:", error);
      toast.error("Failed to load live details");
    }
  };

  if (liveDetail?.userId) {
    fetchLiveDetails();
  }
}, [liveDetail]);


  // Handle text/checkbox/select changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (parent, key, value) => {
  setFormData((prev) => ({
    ...prev,
    [parent]: {
      ...prev[parent],
      [key]: value,
    },
  }));
};

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //tagInputs
   const handleTags = (e) => {
    if ((e.key === "," || e.key === 'Enter') && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  //Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

 // Handle submit
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const requiredFields = [
          { field: formData.title, name: "Title" },
          { field: formData.description, name: "Description" },
          { field: formData.category, name: "Category" },
          { field: formData.thumbnail, name: "Thumbnail" },
          { field: formData.comments.comments, name: "Comments" },
          { field: formData.comments.sortBy, name: "SortBy" },
          { field: formData.tags.length > 0, name: "Tags" },
        ];
         
        const missingFields = requiredFields
          .filter(({ field }) => !field || (typeof field === "string" && !field.trim()))
          .map(({ name }) => name);
         
          if (missingFields.length > 0) {
           toast.error(`Please fill the required fields: ${missingFields.join(", ")}`);
            return;
        }

        const payload = new FormData();
        payload.append("userId", formData.userId);
        payload.append("title", formData.title.trim());
        payload.append("category", formData.category.trim());
        payload.append("description", formData.description.trim());
        payload.append("tags", JSON.stringify(formData.tags || []));
        payload.append("comments", JSON.stringify(formData.comments || {}));
        payload.append("live", JSON.stringify({ privacy: formData.privacy }));

        if (thumbnail) {
        payload.append("thumbnail", thumbnail); 
        } else {
          payload.append("thumbnail", formData.thumbnail);
        }

        const response = await putAPI(
        `/api/social-media/update-live/${liveDetail._id}`,
        payload,
        {},
        true
        );

        if (response.data?.success) {
        toast.success("Live details updated!");
        fetchLive(); 
        onClose();   
        } else {
        toast.error(response.message || "Error updating live");
        }
    } catch (error) {
        console.error("Update error:", error);
        toast.error(error.response?.data?.message || "Error updating live");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="modal-dialog modal-lg" style={{maxWidth: "90%", width: "50%"}}>
        <div className="modal-content" style={{ display: "flex", flexDirection: "column", height: "100%"}}>
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Live Session</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none"}}>
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group flex flex-col">
                <label className="block mb-2">Category</label>
                <select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    className="border-[1px] w-full rounded-md p-2 text-[#48372D]"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className=" text-[#474242]">
                        {cat.mainCategoryName}
                    </option>
                    ))}
                </select>
                </div>

              {/* Tags */}
              <div className="form-group">
                <label className="block mb-2">Tags</label>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-0 border rounded-md p-2 flex items-center gap-2">
                    {Array.isArray(formData.tags) && formData.tags.length > 0 && formData.tags.map((tag, idx) => (
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
                        className="w-full border-none outline-none placeholder:text-[16px] placeholder:text-[#474242] flex-1"
                        placeholder="Enter a comma after each tag"
                    />
                    </div>
                </div>
                </div>

              {/* Thumbnail */}
              <div className="form-group">
                <label>Thumbnail</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Thumbnail Preview"
                    style={{ width: "120px", marginTop: "10px", borderRadius: "6px" }}
                  />
                )}
              </div>

              {/* Comments */}
              {/* Comments Section */}
            <div className="form-group">
            <label className="d-block mb-2 font-weight-bold">Comments</label>
            <div className="d-flex gap-3">
                {/* Comments Toggle */}
                <div className="flex-grow-1 border rounded p-2">
                <p className="mb-1">Comments</p>
                <select
                    value={formData.comments.comments}
                    onChange={(e) =>
                    handleNestedChange("comments", "comments", e.target.value)
                    }
                    className="form-control"
                >
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                    <option value="PAUSE">PAUSE</option>
                </select>
                </div>

                {/* Sort By */}
                <div className="flex-grow-1 border rounded p-2">
                <p className="mb-1">Sort by</p>
                <select
                    value={formData.comments.sortBy}
                    onChange={(e) =>
                    handleNestedChange("comments", "sortBy", e.target.value)
                    }
                    className="form-control"
                >
                    <option value="top">Top</option>
                    <option value="newest">Newest</option>
                </select>
                </div>
            </div>
            </div>

              {/* Privacy */}
              <div className="form-group">
                <label>Privacy</label>
                <select
                  className="form-control"
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleChange}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Members Only">Members Only</option>
                </select>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLiveModal;
