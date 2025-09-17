import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line, RiProhibited2Line } from "react-icons/ri";
import { LuHandshake } from "react-icons/lu";
import { FaEye, FaCheck, FaRupeeSign, FaSpinner } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../../../api/postAPI";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import NegotiateModal from "./NegotiateModal";
import ViewBuyerRequest from "./ViewRequest";
import { DEFAULT_PROFILE_IMAGE } from './constant';
import CreatableSelect from "react-select/creatable";

const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [viewRequest, setViewRequest] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequestToDelete, setSelectedRequestToDelete] = useState(null);
  const [descriptionError, setDescriptionError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const sizeOptions = [
    { value: "A4", label: "A4" },
    { value: "14x14", label: "14x14" },
    { value: "A3", label: "A3" },
    { value: "3:4", label: "3:4" },
    { value: "14x20", label: "14x20" },
  ];

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    artType: "",
    size: "",
    isFramed: false,
    minBudget: "",
    maxBudget: "",
    paymentTerm: "",
    installmentDuration: "",
    expectedDeadline: "",
    buyerImage: null,
    comments: "",
  });

  const fetchAddresses = async () => {
    if (!userId) {
      setFetchError('User not logged in. Please log in to view addresses.');
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      setFetchError(null);
      const response = await getAPI(`/auth/userid/${userId}`);
      console.log("Fetched user data:", response.data.user);

      if (response.data?.user?.address && Array.isArray(response.data.user.address)) {
        setAddresses(response.data.user.address);
        setSelectedAddressId(response.data.user.selectedAddress || null);
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
      setFetchError('Failed to load addresses. Please try again later.');
      toast.error('Failed to load addresses');
      console.error('Error fetching addresses:', error);
    } finally {
      setIsFetching(false);
    }
  };

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
    fetchAddresses();
  }, [token, userId]);

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

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleEditRequest = async (id) => {
    try {
      setShowViewModal(false);
      setViewRequest(null);
      const response = await getAPI("/api/get-buyer-request");
      const allRequests = response.data.buyerRequests;

      const existingData = allRequests.find((req) => req._id === id);
      if (!existingData) {
        toast.error("Request not found");
        return;
      }

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

      if (existingData.BuyerSelectedAddress && Object.keys(existingData.BuyerSelectedAddress).length > 0) {
        const matchingAddress = addresses.find(addr =>
          addr.line1 === existingData.BuyerSelectedAddress.line1 &&
          addr.line2 === existingData.BuyerSelectedAddress.line2 &&
          addr.landmark === existingData.BuyerSelectedAddress.landmark &&
          addr.city === existingData.BuyerSelectedAddress.city &&
          addr.state === existingData.BuyerSelectedAddress.state &&
          addr.country === existingData.BuyerSelectedAddress.country &&
          addr.pincode === existingData.BuyerSelectedAddress.pincode
        );
        setSelectedAddressId(matchingAddress?._id || null);
      } else {
        setSelectedAddressId(null);
      }

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

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await getAPI(`/api/main-category`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const mainCategories = response.data.data;
        let categoryList = [];

        for (const mainCat of mainCategories) {
          const categoryResponse = await getAPI(`/api/category/${mainCat._id}`, {}, true);
          if (!categoryResponse.hasError && Array.isArray(categoryResponse.data?.data)) {
            for (const cat of categoryResponse.data.data) {
              categoryList.push({
                value: cat.id,
                label: cat.categoryName,
                mainCategoryId: mainCat._id,
                type: 'category',
              });

              const subCategoryResponse = await getAPI(`/api/sub-category/${cat.id}`, {}, true);
              if (!subCategoryResponse.hasError && Array.isArray(subCategoryResponse.data?.data)) {
                const subCategories = subCategoryResponse.data.data.map((subCat) => ({
                  value: subCat.id,
                  label: `${subCat.subCategoryName}`,
                  mainCategoryId: mainCat._id,
                  parentCategoryId: cat.id,
                  type: 'sub-category',
                }));
                categoryList.push(...subCategories);
              }
            }
          }
        }

        setAllCategories(categoryList);
      } else {
        toast.error("Failed to load main categories.");
      }
    } catch (err) {
      console.error("Error fetching all categories:", err);
      toast.error("Something went wrong while fetching categories.");
    }
  };

  const handleArtTypeChange = (selectedOption) => {
    const value = selectedOption?.label || "";
    setFormData((prev) => ({
      ...prev,
      artType: value,
    }));
    setSelectedCategory(selectedOption?.label || "");
  };

  const handleSizeChange = (selectedOption) => {
    setFormData({ ...formData, size: selectedOption?.value || "" });
  };

  // const handleImageClick = () => {
  //   setShowFullImage((prev) => !prev);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tempElement = document.createElement("div");
    tempElement.innerHTML = formData.description;
    const plainTextDescription = tempElement.innerText.trim();

    if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!artistId) {
      toast.error("Please select an artist");
      return;
    }

    if (!formData.artType) {
      toast.error("Art type is required");
      return;
    }

    if (!formData.size) {
      toast.error("Size is required");
      return;
    }

    if (!formData.minBudget) {
      toast.error("Minimum budget is required");
      return;
    }

    if (!formData.maxBudget) {
      toast.error("Maximum budget is required");
      return;
    }

    if (!formData.paymentTerm) {
      toast.error("Payment term is required");
      return;
    }

    if (!formData.expectedDeadline) {
      toast.error("Expected deadline is required");
      return;
    }

    if (!formData.paymentTerm) {
      alert("Please select a payment term.");
      return;
    }

    if (formData.paymentTerm === "Installment" && !formData.installmentDuration) {
      alert("Please select an installment duration.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!plainTextDescription) {
      toast.error("Description is required");
      setDescriptionError(true);
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      setIsSubmitting(false);
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
    if (formData.paymentTerm === "Installment") {
      formPayload.append("InstallmentDuration", formData.installmentDuration);
    }
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

    // Append the selected address to the form payload
    if (selectedAddressId) {
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        formPayload.append("BuyerSelectedAddress[line1]", selectedAddress.line1 || "");
        formPayload.append("BuyerSelectedAddress[line2]", selectedAddress.line2 || "");
        formPayload.append("BuyerSelectedAddress[landmark]", selectedAddress.landmark || "");
        formPayload.append("BuyerSelectedAddress[city]", selectedAddress.city || "");
        formPayload.append("BuyerSelectedAddress[state]", selectedAddress.state || "");
        formPayload.append("BuyerSelectedAddress[country]", selectedAddress.country || "");
        formPayload.append("BuyerSelectedAddress[pincode]", selectedAddress.pincode || "");
      } else {
        toast.error("Selected address not found.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let response;
      if (editingId) {
        response = await putAPI(`/api/update-buyer-request/${editingId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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

      if (response && response.data) {
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
        setSelectedAddressId(null);
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
      setSelectedAddressId(null);
      await fetchRequests();
    }
  };

  const handleViewRequest = (req) => {
    setShowForm(false);
    setEditingId(null);
    setViewRequest(req);
    setShowViewModal(true);
  };

  const handleStatusUpdate = async (status, comment = "", req) => {
    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-negiotaite-Buyer-budget/${req}`,
        {
          rejectedcomment: comment,
          BuyerStatus: status,
          RequestStatus: status,
        }
      );
      if (response && response.data) {
        toast.success(`Buyer request ${status.toLowerCase()} successfully`);
        if (showRejectModal) setShowRejectModal(false);
      } else {
        toast.error(response?.message || `Failed to update buyer request status`);
      }
    } catch (error) {
      console.error("Error updating buyer request status:", error);
      toast.error(error.response?.data?.message || "Error updating buyer request status");
    } finally {
      setLoading(false);
      await fetchRequests();
    }
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
      await fetchRequests();
    }
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
    setSelectedAddressId(null);
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

  const getLatestNegotiatedBudget = (req) => {
    const buyerBudgets = Array.isArray(req.BuyerNegotiatedBudgets) ? req.BuyerNegotiatedBudgets : [];
    const artistBudgets = Array.isArray(req.ArtistNegotiatedBudgets) ? req.ArtistNegotiatedBudgets : [];
    const allBudgets = [...buyerBudgets, ...artistBudgets];
    return allBudgets.length > 0 ? `₹${allBudgets[allBudgets.length - 1]}` : "—";
  };

  const filteredRequests = requests.filter((req) =>
    req.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (imagePath) => {
    const fullPath = `${BASE_URL}/${imagePath}`;
    setCurrentImages([fullPath]);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  return (
    <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl text-gray-950 font-semibold">Custom Requests</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <input
              type="text"
              placeholder="Search request"
              className="w-full border-2 border-gray-300 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setShowViewModal(false);
              setViewRequest(null);
            }} className="bg-[#6F4D34] text-white text-[15px] font-semibold px-4 py-2 rounded-xl flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Request
          </button>
        </div>
      </div>
      <div className="border-2 rounded-3xl w-full bg-white">
        <div className="overflow-x-auto pb-4 rounded-3xl w-full">
          <table className="lg:min-w-[1100px] table-auto w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#6F4D34] text-white">
              <tr className="text-center">
                <th className="px-4 py-7 whitespace-nowrap">#</th>
                <th className="px-4 py-2 whitespace-nowrap">Product Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Artist Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Artist Negotiated Budget</th>
                <th className="px-4 py-2 whitespace-nowrap">Request Date</th>
                <th className="px-4 py-2 whitespace-nowrap">Artist Request Status</th>
                <th className="px-4 py-2 whitespace-nowrap">Buyer Request Status</th>
                <th className="px-4 py-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, index) => (
                  <tr key={req._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      {req.BuyerImage ? (
                        <img
                          src={`${BASE_URL}/${req.BuyerImage}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Buyer"
                          onClick={() => handleImageClick(req.BuyerImage)}
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
                      {req.ProductName || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {req.Artist?.id?.name || ""} {req.Artist?.id?.lastName || ""}
                    </td>
                    <td className="px-4 py-2">{getLatestNegotiatedBudget(req)}</td>
                    <td className="px-4 py-2">
                      {req?.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—"}
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
                      {(
                        (req.BuyerNegotiatedBudgets.length === 0 && req.ArtistNegotiatedBudgets.length < 2 && req.RequestStatus === "Pending") &&
                        <GoPencil
                          onClick={() => handleEditRequest(req._id)}
                          className="cursor-pointer text-2xl text-sky-600 border border-sky-400 p-1 rounded-lg"
                          title="Edit"
                        />)}
                      {(
                        (
                          (req.BuyerNegotiatedBudgets.length === 0 && req.ArtistNegotiatedBudgets.length === 1) ||
                          (req.BuyerNegotiatedBudgets.length === 1 && req.ArtistNegotiatedBudgets.length === 2) ||
                          (req.BuyerNegotiatedBudgets.length === 2 && req.ArtistNegotiatedBudgets.length === 3)
                        ) &&
                        (req.RequestStatus === "Pending")
                      ) && (
                          loading ? (
                            <div className="w-6 h-6 flex items-center justify-center border border-green-400 rounded-lg">
                              <FaSpinner
                                className="animate-spin text-2xl text-green-600 p-1 rounded-lg"
                                title="Loading..."
                              />
                            </div>
                          ) : (
                            <FaCheck
                              onClick={() => handleStatusUpdate("Approved", "", req._id)}
                              className="cursor-pointer text-2xl text-green-600 border border-green-400 p-1 rounded-lg"
                              title="Accept"
                            />
                          )
                        )}
                      {(
                        (
                          (req.BuyerNegotiatedBudgets.length === 0 && req.ArtistNegotiatedBudgets.length === 1) ||
                          (req.BuyerNegotiatedBudgets.length === 1 && req.ArtistNegotiatedBudgets.length === 2)
                        ) &&
                        (req.RequestStatus === "Pending")
                      ) && (
                          <LuHandshake
                            onClick={() => {
                              setSelectedRequest(req);
                              setShowNegotiationModal(true);
                            }}
                            className="cursor-pointer text-2xl text-white bg-gray-500 p-1 rounded-lg"
                            title="Negotiate"
                          />
                        )}
                      {(
                        (req.RequestStatus === "Approved")
                      ) && (
                          <FaRupeeSign
                            className="cursor-pointer text-2xl text-blue-500 p-1 border rounded-lg"
                            title="Payment"
                          />
                        )}
                      {(
                        req.BuyerNegotiatedBudgets.length === 2 && req.ArtistNegotiatedBudgets.length === 3 &&
                        req.RequestStatus !== "Approved" && req.RequestStatus !== "Rejected"
                      ) && (
                          loading ? (
                            <div className="w-8 h-8 flex items-center justify-center border border-green-400 rounded-lg">
                              <FaSpinner
                                className="animate-spin text-2xl text-red-600 p-1 rounded-lg"
                                title="Loading..."
                              />
                            </div>
                          ) : (
                            <RiProhibited2Line
                              onClick={() => setShowRejectModal(true)}
                              className="cursor-pointer text-2xl text-red-600 border border-red-400 p-1 rounded-lg"
                              title="Reject"
                            />
                          )
                        )}
                      {showRejectModal && (
                        <div
                          className="modal fade show"
                          style={{
                            display: "block",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1050,
                          }}
                        >
                          <div
                            className="modal-dialog modal-dialog-scrollable"
                            style={{
                              maxWidth: "500px",
                              margin: "1.75rem auto",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                maxHeight: "80vh",
                              }}
                            >
                              <div className="modal-header">
                                <h5 className="modal-title">Reject Request</h5>
                                <button
                                  className="btn-close"
                                  onClick={() => setShowRejectModal(false)}
                                  disabled={loading}
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div
                                className="modal-body"
                                style={{
                                  overflowY: "auto",
                                  maxHeight: "60vh",
                                }}
                              >
                                <label htmlFor="rejectComment" className="form-label">
                                  Rejection Comment
                                </label>
                                <textarea
                                  className="form-control"
                                  id="rejectComment"
                                  name="rejectComment"
                                  rows="4"
                                  value={rejectComment}
                                  onChange={(e) => setRejectComment(e.target.value)}
                                  disabled={loading}
                                />
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="text-[16px] py-1 px-3 text-zinc-900 border-[1.6px] rounded-lg border-zinc-600"
                                  onClick={() => setShowRejectModal(false)}
                                  disabled={loading}
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => {
                                    if (!rejectComment.trim()) {
                                      toast.error("Please enter a rejection comment before saving.");
                                      return;
                                    }
                                    handleStatusUpdate("Rejected", rejectComment, req._id);
                                  }}
                                  disabled={loading}
                                >
                                  {loading ? "Rejecting" : "Save Rejection"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
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
        <div className="w-full max-w-[1076px] mx-auto px-0 sm:px-0 lg:px-0">
          <form onSubmit={handleSubmit} className="space-y-5 py-6">
            <h3 className="text-xl font-semibold">
              {editingId ? "Edit Custom Request" : "Add Custom Request"}
            </h3>
            <div>
              <label className="block font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
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
              <label className="block font-medium mb-1">Select Artist <span className="text-red-500">*</span></label>
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
                <option value="">Select an artist <span className="text-red-500">*</span></option>
                {artists.map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.name} {artist.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Art Type <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                options={allCategories}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    artType: selectedOption ? selectedOption.label : "",
                  }));
                }}
                value={
                  allCategories.find((cat) => cat.label === formData.artType) ||
                  (formData.artType ? { label: formData.artType, value: formData.artType } : null)
                }
                isClearable
                isSearchable
                placeholder="Select or type art type"
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Select Size <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                options={sizeOptions}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    size: selectedOption ? selectedOption.label : "",
                  }));
                }}
                value={
                  sizeOptions.find((opt) => opt.label === formData.size) ||
                  (formData.size ? { label: formData.size, value: formData.size } : null)
                }
                isClearable
                isSearchable
                placeholder="Select or type size"
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Select Delivery Address <span className="text-red-500">*</span></label>
              {isFetching ? (
                <p>Loading addresses...</p>
              ) : fetchError ? (
                <p className="text-red-500">{fetchError}</p>
              ) : addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <div key={address._id} className="flex items-center">
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={() => handleAddressChange(address._id)}
                        className="mr-2"
                        required
                      />
                      <label>
                        {address.line1}, {address.line2 ? `${address.line2}, ` : ''}{address.landmark ? `${address.landmark}, ` : ''}{address.city}, {address.state}, {address.country}, {address.pincode}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No addresses found. Please add an address in your profile.</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Color Preferences </label>
              <div className="flex w-full items-center border-2 border-gray-300 rounded-xl px-2">
                <input
                  type="text"
                  value={colorPref}
                  onChange={(e) => setColorPref(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
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
              <label className="font-medium">Frame Required </label>
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
                <label className="block font-medium mb-1">Minimum Budget ($) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="minBudget"
                  value={formData.minBudget}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Maximum Budget ($) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className={formData.paymentTerm === "Installment" ? "md:w-1/2 w-full" : "w-full"}>
                <label className="block font-medium mb-1">Payment Term <span className="text-red-500">*</span></label>
                <select
                  id="paymentTerm"
                  name="paymentTerm"
                  value={formData.paymentTerm}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
                  required
                >
                  <option value="">Select payment option</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Installment">Installment</option>
                  <option value="Two Step Payment">Two Step Payment</option>
                </select>
              </div>

              {/* Show only when Installment is selected */}
              {formData.paymentTerm === "Installment" && (
                <div className="md:w-1/2 w-full">
                  <label className="block font-medium mb-1">Installment Duration <span className="text-red-500">*</span></label>
                  <select
                    id="installmentDuration"
                    name="installmentDuration"
                    value={formData.installmentDuration}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
                  >
                    <option value="">Select duration</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="9">9 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              )}
            </div>            <div>
              <label className="block font-medium mb-1">Expected Deadline (days) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="expectedDeadline"
                value={formData.expectedDeadline}
                onChange={handleChange}
                min="0"
                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Reference Image <span className="text-red-500">*</span></label>
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
                    onClick={handleImageClick}
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
              <label htmlFor="description">Detailed Description <span className="text-red-500">*</span></label>
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
        </div>
      )}
      {showViewModal && viewRequest && (
        <div className="mt-6 p-6 bg-gray-50 border-2 rounded-3xl">
          <ViewBuyerRequest
            request={viewRequest}
            onClose={() => {
              setShowViewModal(false);
              setViewRequest(null);
              fetchRequests();
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
            fetchRequests();
          }}
          onSubmit={handleNegotiationSubmit}
        />
      )}
      {
        showPopup && (
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '500px',
                height: '600px',
                backgroundColor: '#111',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <img
                src={currentImages[currentImageIndex]}
                alt="Popup"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            </div>
          </div>
        )
      }

    </div>
  );
};

export default AddCustomRequestForm;