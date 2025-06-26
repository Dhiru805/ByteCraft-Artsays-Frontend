import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuHandshake } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../../../api/postAPI";
import deleteAPI from "../../../../../../../api/deleteAPI";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import NegotiateModal from "./NegotiateModal";
import ViewBuyerRequest from "./ViewRequest";
import ConfirmationDialog from "./ConfirmationDialog";
import { DEFAULT_PROFILE_IMAGE } from './constant';

const AddCustomRequestForm = () => {
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [artistId, setArtistId] = useState("");
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [colorPref, setColorPref] = useState("");
  const [colorPreferences, setColorPreferences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequestToDelete, setSelectedRequestToDelete] = useState(null);
  const [descriptionError, setDescriptionError] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    artType: "",
    size: "",
    isFramed: false,
    minBudget: "",
    maxBudget: "",
    paymentTerm: "",
    expectedDeadline: "",
    buyerImage: null,
    comments: "",
  });

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const response = await getAPI("/api/get-buyer-request");
      setRequests(response.data.buyerRequests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getAPI("/artist/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast.error("Failed to fetch Artists");
      }
    };

    fetchArtists();
    fetchRequests();
  }, [token]);

  const handleAddColor = () => {
    if (colorPref.trim() && !colorPreferences.includes(colorPref.trim())) {
      setColorPreferences([...colorPreferences, colorPref.trim()]);
      setColorPref("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files && files.length > 0 ? files[0] : null;
      setFormData({ ...formData, [name]: file });
    } else {
      const numericFields = ["expectedDeadline", "minBudget", "maxBudget"];
      setFormData({
        ...formData,
        [name]: numericFields.includes(name) ? Number(value) : value,
      });
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleEditRequest = async (id) => {
    try {
      const response = await getAPI("/api/get-buyer-request");
      const allRequests = response.data.buyerRequests;

      const existingData = allRequests.find((req) => req._id === id);
      if (!existingData) {
        toast.error("Request not found");
        return;
      }
      console.log("existingData.Artist:", existingData.Artist);

      // Set form data
      setFormData({
        productName: existingData.ProductName || "",
        description: existingData.Description || "",
        artType: existingData.ArtType || "",
        size: existingData.Size || "",
        isFramed: existingData.IsFramed || false,
        minBudget: existingData.MinBudget || "",
        maxBudget: existingData.MaxBudget || "",
        paymentTerm: existingData.PaymentTerm || "",
        expectedDeadline: existingData.ExpectedDeadline || "",
        buyerImage: existingData.BuyerImage || null,
        comments: existingData.Comments || "",
      });

      setColorPreferences(existingData.ColourPreferences || []);

      // Set artist details
      let artistName = "";
      let artistId = "";
      if (existingData.Artist?.id) {
        artistId = existingData.Artist.id._id || "";
        artistName = `${existingData.Artist.id.name || ""} ${existingData.Artist.id.lastName || ""}`.trim();
      } else if (existingData.Artist) {
        artistId = existingData.Artist._id || "";
        artistName = `${existingData.Artist.name || ""} ${existingData.Artist.lastName || ""}`.trim();
      }
      setArtistId(artistId);
      setSelectedArtistName(artistName);

      // Set image preview and file type for existing image
      if (existingData.BuyerImage) {
        const imageUrl = `api/${existingData.BuyerImage}`;
        setImagePreview(imageUrl);
        setFileType(existingData.BuyerImage.endsWith(".pdf") ? "pdf" : "image");
      } else {
        setImagePreview(null);
        setFileType(null);
      }
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      console.error("Error loading request for editing:", error);
      toast.error("Failed to load request");
    }
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await deleteAPI(`/api/delete-buyer-requests/${id}`);
      toast.success("Request deleted successfully");
      await fetchRequests();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete request");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRequestToDelete(null);
      await fetchRequests();
    }
  };

  const handleImageClick = () => {
    setShowFullImage((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tempElement = document.createElement("div");
    tempElement.innerHTML = formData.description;
    const plainTextDescription = tempElement.innerText.trim();

    if (!plainTextDescription) {
      toast.error("Description is required");
      setDescriptionError(true);
      return;
    }

    setDescriptionError(false);
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("ProductName", formData.productName);
    formPayload.append("Description", plainTextDescription);
    formPayload.append("ArtType", formData.artType);
    formPayload.append("Size", formData.size);
    formPayload.append("IsFramed", formData.isFramed);
    formPayload.append("MinBudget", formData.minBudget);
    formPayload.append("MaxBudget", formData.maxBudget);
    formPayload.append("PaymentTerm", formData.paymentTerm);
    formPayload.append("ExpectedDeadline", formData.expectedDeadline);
    formPayload.append("Comments", formData.comments);
    formPayload.append("ColourPreferences", JSON.stringify(colorPreferences));

    if (formData.buyerImage) {
      formPayload.append("BuyerImage", formData.buyerImage);
    }

    if (!artistId) {
      toast.error("Please select an artist.");
      setIsSubmitting(false);
      return;
    }

    const selectedArtist = artists.find((a) => a._id === artistId);
    if (!selectedArtist) {
      toast.error("Selected artist not found.");
      setIsSubmitting(false);
      return;
    }

    formPayload.append("Artist", selectedArtist._id);

    try {
      let response;
      if (editingId) {
        response = await putAPI(`/api/update-buyer-request/${editingId}`, formPayload);
      } else {
        response = await postAPI(
          "/api/buyer-request",
          formPayload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
          true
        );
      }

      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        toast.success(data.message || "Request created successfully!");
        await fetchRequests();
        setFormData({
          productName: "",
          description: "",
          artType: "",
          size: "",
          isFramed: false,
          minBudget: "",
          maxBudget: "",
          paymentTerm: "",
          expectedDeadline: "",
          buyerImage: null,
          comments: "",
        });
        setColorPreferences([]);
        setEditingId(null);
        setShowForm(false);
        setArtistId("");
        setImagePreview(null);
        setFileType(null);
        setSelectedArtistName("");
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      const message = error?.response?.data?.message || "An error occurred";
      toast.error(message);
    } finally {
      setFormData({
        productName: "",
        description: "",
        artType: "",
        size: "",
        isFramed: false,
        minBudget: "",
        maxBudget: "",
        paymentTerm: "",
        expectedDeadline: "",
        buyerImage: null,
        comments: "",
      });
      setColorPreferences([]);
      setEditingId(null);
      setShowForm(false);
      setArtistId("");
      setSelectedArtistName("");
      setIsSubmitting(false);
      await fetchRequests();
    }
  };

  const handleViewRequest = (req) => {
    setViewRequest(req);
    setShowViewModal(true);
  };

  const handleNegotiationSubmit = async (updatedRequest) => {
    try {
      toast.success("Negotiation submitted successfully!");
      await fetchRequests();
    } catch (error) {
      console.error("Negotiation error:", error);
      toast.error("Failed to update negotiation");
    } finally {
      setShowNegotiationModal(false);
      setSelectedRequest(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRequestToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      productName: "",
      description: "",
      artType: "",
      size: "",
      isFramed: false,
      minBudget: "",
      maxBudget: "",
      paymentTerm: "",
      expectedDeadline: "",
      buyerImage: null,
      comments: "",
    });
    setColorPreferences([]);
    setEditingId(null);
    setArtistId("");
    setSelectedArtistName("");
    setImagePreview(null);
    setFileType(null);
  };

  const modules = {
    toolbar: [
      [{ font: ["sans-serif"] }, { size: ["small", "large", "huge"] }],
      [{ header: "1" }, { header: "2" }, "bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["code-block"],
      ["blockquote"],
    ],
  };

  const editorStyle = {
    fontFamily: "Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif",
    fontSize: "12px",
  };

  const filteredRequests = requests.filter((req) =>
    req.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[1208px]">
      <div className="flex justify-between mb-[30px] h-[48px]">
        <h2 className="text-2xl text-gray-950 font-semibold">
          Custom Requests
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search request"
              className="w-full border-2 border-gray-300 rounded-xl pl-9 pr-4 py-2 text-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#6F4D34] text-white text-[16px] font-semibold px-4 py-2 rounded-xl flex items-center"
          >
            <FaPlus className="mr-2" /> Add Request
          </button>
        </div>
      </div>

      <div className="border-2 rounded-3xl p-0 m-0 w-full bg-white">
        <div className="overflow-x-auto sm:overflow-x-auto overflow-x-hidden pb-4 rounded-3xl w-full max-w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#6F4D34] text-white">
              <tr>
                <th className="px-4 py-7 whitespace-nowrap border-r">#</th>
                <th className="px-4 py-2 whitespace-nowrap">Product Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Artist Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Max Budget</th>
                <th className="px-4 py-2 whitespace-nowrap">Min Budget</th>
                <th className="px-4 py-2 whitespace-nowrap">Negotiated Budget</th>
                <th className="px-4 py-2 whitespace-nowrap">Request Date</th>
                <th className="px-4 py-2 whitespace-nowrap">Request Status</th>
                <th className="px-4 py-2 whitespace-nowrap">Buyer Request Status</th>
                <th className="px-4 py-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, index) => (
                  <tr key={req._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      {req.BuyerImage ? (
                        <img
                          src={`http://localhost:3001/${req.BuyerImage}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Buyer"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_PROFILE_IMAGE;
                          }}
                        />
                      ) : (
                        <img
                          src={DEFAULT_PROFILE_IMAGE}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Default Buyer"
                        />
                      )}
                      {req.ProductName || "₹ NaN"}
                    </td>
                    <td className="px-4 py-2">
                      {req.Artist?.id?.name || ""} {req.Artist?.id?.lastName || ""}
                    </td>
                    <td className="px-4 py-2">
                      {req.MaxBudget ? `₹${req.MaxBudget}` : "₹ NaN"}
                    </td>
                    <td className="px-4 py-2">
                      {req.MinBudget ? `₹${req.MinBudget}` : "₹ NaN"}
                    </td>
                    <td className="px-4 py-2">{req.NegotiatedBudget[req.NegotiatedBudget.length - 1] || "—"}</td>
                    <td className="px-4 py-2">
                      {req?.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.RequestStatus === "Approved"
                            ? "text-green-500 border-green-500 bg-white"
                            : req.RequestStatus === "Pending"
                              ? "text-yellow-500 border-yellow-500 bg-white"
                              : "text-red-500 border-red-500 bg-white"
                          }`}
                      >
                        {req.RequestStatus || "Pending"}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.BuyerStatus === "Approved"
                            ? "text-green-500 border-green-500 bg-white"
                            : req.BuyerStatus === "Pending"
                              ? "text-yellow-500 border-yellow-500 bg-white"
                              : "text-red-500 border-red-500 bg-white"
                          }`}
                      >
                        {req.BuyerStatus || "Pending"}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-2 text-gray-700">
                      <FaEye
                        onClick={() => handleViewRequest(req)}
                        className="cursor-pointer text-2xl text-cyan-600 border border-cyan-400 p-1 rounded-lg"
                        title="View"
                      />
                      <GoPencil
                        onClick={() => handleEditRequest(req._id)}
                        className="cursor-pointer text-2xl text-sky-600 border border-sky-400 p-1 rounded-lg"
                        title="Edit"
                      />
                      <RiDeleteBin6Line
                        onClick={() => {
                          setSelectedRequestToDelete(req._id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="cursor-pointer text-2xl text-red-600 border border-red-400 p-1 rounded-lg"
                        title="Delete"
                      />
                      {isDeleteDialogOpen && selectedRequestToDelete === req._id && (
                        <ConfirmationDialog
                          onClose={handleDeleteCancel}
                          deleteType="buyerRequest"
                          id={selectedRequestToDelete}
                          onDeleted={handleDeleteConfirmed}
                        />
                      )}
                      {req.RequestStatus === "Approved" && (
                        <LuHandshake
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowNegotiationModal(true);
                          }}
                          className="cursor-pointer text-2xl text-white bg-gray-500 p-1 rounded-lg"
                          title="Negotiate"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <h3 className="text-xl font-semibold">
            {editingId ? "Edit Custom Request" : "Add Custom Request"}
          </h3>
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Select Artist</label>
            <select
              id="artistSelect"
              name="artist"
              value={artistId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setArtistId(selectedId);
                const selectedArtist = artists.find((a) => a._id === selectedId);
                setSelectedArtistName(
                  selectedArtist
                    ? `${selectedArtist.name} ${selectedArtist.lastName || ""}`.trim()
                    : ""
                );
              }}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
              required
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.name} {artist.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Art Type</label>
            <input
              type="text"
              name="artType"
              value={formData.artType}
              onChange={handleChange}
              placeholder="e.g., Painting, Sculpture"
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g., A4, 24x36"
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Color Preferences</label>
            <div className="flex w-full items-center border-2 border-gray-300 rounded-xl px-2">
              <input
                type="text"
                value={colorPref}
                onChange={(e) => setColorPref(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="Add a color"
                className="flex-grow px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-[#6F4D34] text-white px-3 py-1 font-semibold rounded"
              >
                Add
              </button>
            </div>
            <div className="pt-2 text-sm text-gray-400">
              Click "Add" to include each colour preference
            </div>
            {colorPreferences.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
                {colorPreferences.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <label className="font-medium">Frame Required</label>
            <input
              type="checkbox"
              name="isFramed"
              checked={formData.isFramed}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Minimum Budget ($)</label>
              <input
                type="number"
                name="minBudget"
                value={formData.minBudget}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Maximum Budget ($)</label>
              <input
                type="number"
                name="maxBudget"
                value={formData.maxBudget}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Payment Term</label>
            <select
              id="paymentTerm"
              name="paymentTerm"
              value={formData.paymentTerm}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
              required
            >
              <option value="">Select payment option</option>
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
              <option value="two-step">Two Step Payment</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Expected Deadline (days)</label>
            <input
              type="number"
              name="expectedDeadline"
              value={formData.expectedDeadline}
              onChange={handleChange}
              min="0"
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Reference Image</label>
            <input
              type="file"
              name="buyerImage"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
                if (!file) return;
                handleChange(e);
                const fileType = file.type;
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (fileType.startsWith("image/")) {
                    setImagePreview(reader.result);
                    setFileType("image");
                  } else if (fileType === "application/pdf") {
                    setImagePreview(reader.result);
                    setFileType("pdf");
                  } else {
                    setImagePreview(null);
                    setFileType(null);
                  }
                };
                reader.readAsDataURL(file);
              }}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
            {fileType === "image" && imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-[200px] rounded-md border p-1"
                  onClick={() => setShowFullImage(true)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            )}
            {fileType === "pdf" && imagePreview && (
              <a
                href={imagePreview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-200 text-sm w-[120px] px-6 py-2 rounded-xl border mt-2 text-center"
              >
                View PDF
              </a>
            )}
            {showFullImage && fileType === "image" && imagePreview && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Full Image"
                    className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                  />
                  <button
                    className="absolute top-2 right-2 text-red-600 text-3xl"
                    onClick={() => setShowFullImage(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Additional Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            ></textarea>
          </div>
          <div className="form-group mt-3">
            <label htmlFor="description">Detailed Description</label>
            <ReactQuill
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your request in detail..."
              modules={modules}
              theme="snow"
              style={editorStyle}
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6F4D34] text-white font-semibold px-11 py-2 rounded-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 font-semibold px-11 py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showViewModal && viewRequest && (
        <div className="mt-6 p-6 bg-gray-50 border-2 rounded-3xl">
          <ViewBuyerRequest
            request={viewRequest}
            onClose={() => {
              setShowViewModal(false);
              setViewRequest(null);
            }}
          />
        </div>
      )}

      {showNegotiationModal && selectedRequest && (
        <NegotiateModal
          request={selectedRequest}
          onClose={() => {
            setShowNegotiationModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleNegotiationSubmit}
        />
      )}
    </div>
  );
};

export default AddCustomRequestForm;