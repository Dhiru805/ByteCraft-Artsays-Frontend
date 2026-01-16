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
import { DEFAULT_PROFILE_IMAGE } from "./constant";
import CreatableSelect from "react-select/creatable";

const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

const AddCustomRequestForm = () => {
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [artistId, setArtistId] = useState("");
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      setFetchError("User not logged in. Please log in to view addresses.");
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      setFetchError(null);
      const response = await getAPI(
        `/api/get-address/${userId}`,
        {},
        true,
        false
      );

      if (response.data?.data && Array.isArray(response.data.data)) {
        const userAddresses = response.data.data;
        const normalizedAddresses = userAddresses.map((addr) => ({
          ...addr,
          _id: String(addr._id || addr.id),
          // Map fields to match CustomRequest expectations
          line1: addr.addressLine1 || addr.line1 || "",
          line2: addr.addressLine2 || addr.line2 || "",
          landmark: addr.landmark || "",
          city: addr.city || "",
          state: addr.state || "",
          country: addr.country || "",
          pincode: addr.pincode || "",
        }));

        setAddresses(normalizedAddresses);

        if (!selectedAddressId) {
          // Check for a default address if possible, otherwise select first
          const defaultAddress = normalizedAddresses.find(a => a.isDefault);
          setSelectedAddressId(defaultAddress?._id || normalizedAddresses[0]._id);
        }
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
      setFetchError("Failed to load addresses. Please try again later.");
      console.error("Error fetching addresses:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await getAPI("/api/get-buyer-request");
      const fetchedRequests = response.data.buyerRequests || [];
      const sortedRequests = [...fetchedRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(sortedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getAPI("/artist/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
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
    setSelectedAddressId(String(addressId));
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
        artistName = `${existingData.Artist.id.name || ""} ${existingData.Artist.id.lastName || ""
          }`.trim();
      } else if (existingData.Artist) {
        artistId = existingData.Artist._id || "";
        artistName = `${existingData.Artist.name || ""} ${existingData.Artist.lastName || ""
          }`.trim();
      }
      setArtistId(artistId);
      setSelectedArtistName(artistName);

      if (
        existingData.BuyerSelectedAddress &&
        Object.keys(existingData.BuyerSelectedAddress).length > 0
      ) {
        const matchingAddress = addresses.find(
          (addr) =>
            (addr.line1 || "").trim() === (existingData.BuyerSelectedAddress.line1 || "").trim() &&
            (addr.city || "").trim() === (existingData.BuyerSelectedAddress.city || "").trim() &&
            (addr.pincode || "").trim() === (existingData.BuyerSelectedAddress.pincode || "").trim()
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
          const categoryResponse = await getAPI(
            `/api/category/${mainCat._id}`,
            {},
            true
          );
          if (
            !categoryResponse.hasError &&
            Array.isArray(categoryResponse.data?.data)
          ) {
            for (const cat of categoryResponse.data.data) {
              const categoryId = cat._id || cat.id;

              categoryList.push({
                value: categoryId,
                label: cat.categoryName,
                mainCategoryId: mainCat._id,
                type: "category",
              });

              try {
                const subCategoryResponse = await getAPI(
                  `/api/sub-category/${categoryId}`,
                  {},
                  true
                );

                if (
                  !subCategoryResponse.hasError &&
                  Array.isArray(subCategoryResponse.data?.data)
                ) {
                  const subCategories = subCategoryResponse.data.data.map(
                    (subCat) => ({
                      value: subCat._id || subCat.id,
                      label: subCat.subCategoryName,
                      mainCategoryId: mainCat._id,
                      parentCategoryId: categoryId,
                      type: "sub-category",
                    })
                  );

                  categoryList.push(...subCategories);
                }
              } catch (err) {
                // Expected case: some categories might not have sub-categories
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
      // toast.error("Something went wrong while fetching categories.");
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

    // 🔹 Convert ReactQuill HTML to plain text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = formData.description;
    const plainTextDescription = tempElement.innerText.trim();

    // 🔹 COMMON VALIDATION (fixes Buyer bug)
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

    if (Number(formData.minBudget) > Number(formData.maxBudget)) {
      toast.error("Minimum budget cannot be greater than maximum budget");
      return;
    }

    if (!formData.paymentTerm) {
      toast.error("Payment term is required");
      return;
    }

    if (
      formData.paymentTerm === "Installment" &&
      !formData.installmentDuration
    ) {
      toast.error("Please select an installment duration");
      return;
    }

    if (!formData.expectedDeadline) {
      toast.error("Expected deadline is required");
      return;
    }

    if (!plainTextDescription) {
      toast.error("Detailed description is required");
      setDescriptionError(true);
      return;
    }
    if (!formData.comments || !formData.comments.trim()) {
      toast.error("Notes / comments are required");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    setDescriptionError(false);
    setIsSubmitting(true);

    try {
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
      formPayload.append(
        "ColourPreferences",
        JSON.stringify(colorPreferences)
      );

      if (formData.paymentTerm === "Installment") {
        formPayload.append(
          "InstallmentDuration",
          formData.installmentDuration
        );
      }

      if (formData.buyerImage) {
        formPayload.append("BuyerImage", formData.buyerImage);
      }

      // 🔹 Artist
      const selectedArtist = artists.find((a) => a._id === artistId);
      if (!selectedArtist) {
        toast.error("Selected artist not found");
        return;
      }
      formPayload.append("Artist", selectedArtist._id);

      // 🔹 Address
      const selectedAddress = addresses.find(
        (addr) => addr._id === selectedAddressId
      );
      if (!selectedAddress) {
        toast.error("Selected address not found");
        return;
      }

      formPayload.append(
        "BuyerSelectedAddress[line1]",
        selectedAddress.line1 || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[line2]",
        selectedAddress.line2 || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[landmark]",
        selectedAddress.landmark || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[city]",
        selectedAddress.city || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[state]",
        selectedAddress.state || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[country]",
        selectedAddress.country || ""
      );
      formPayload.append(
        "BuyerSelectedAddress[pincode]",
        selectedAddress.pincode || ""
      );

      // 🔹 API CALL
      let response;
      if (editingId) {
        response = await putAPI(
          `/api/update-buyer-request/${editingId}`,
          formPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await postAPI(
          "/api/buyer-request",
          formPayload,
          { headers: { "Content-Type": "multipart/form-data" } },
          true
        );
      }

      toast.success(
        response?.data?.message || "Request submitted successfully"
      );

      await fetchRequests();

      // 🔹 RESET FORM
      setFormData({
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

      setColorPreferences([]);
      setEditingId(null);
      setShowForm(false);
      setArtistId("");
      setSelectedArtistName("");
      setImagePreview(null);
      setFileType(null);
      setSelectedAddressId(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error?.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
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
        toast.error(
          response?.message || `Failed to update buyer request status`
        );
      }
    } catch (error) {
      console.error("Error updating buyer request status:", error);
      toast.error(
        error.response?.data?.message || "Error updating buyer request status"
      );
    } finally {
      setLoading(false);
      await fetchRequests();
    }
  };

  const handleNegotiationSubmit = async (updatedRequest) => {
    try {
      setLoading(true);

      // Submit negotiation to backend
      const response = await putAPI(
        `/api/update-negiotaite-Buyer-budget/${updatedRequest._id}`,
        updatedRequest
      );

      if (response && response.data) {
        toast.success("Negotiation submitted successfully!");

        // 1️⃣ Update local state immediately so Buyer sees the button
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === updatedRequest._id ? { ...req, ...updatedRequest } : req
          )
        );

        // 2️⃣ Optionally, re-fetch requests from backend to be extra safe
        await fetchRequests();

        setShowNegotiationModal(false);
        setSelectedRequest(null);
      } else {
        toast.error("Failed to update negotiation");
      }
    } catch (error) {
      console.error("Negotiation error:", error);
      toast.error("Failed to update negotiation");
    } finally {
      setLoading(false);
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
    const buyerBudgets = Array.isArray(req.BuyerNegotiatedBudgets)
      ? req.BuyerNegotiatedBudgets
      : [];
    const artistBudgets = Array.isArray(req.ArtistNegotiatedBudgets)
      ? req.ArtistNegotiatedBudgets
      : [];
    const allBudgets = [...buyerBudgets, ...artistBudgets];
    return allBudgets.length > 0
      ? `₹${allBudgets[allBudgets.length - 1]}`
      : "—";
  };

  const filteredRequests = requests.filter((req) =>
    req.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiatePayment = async (requestId, amount) => {
  if (!amount || amount === "—" || !requestId) {
    toast.error("Cannot initiate payment: Invalid amount or request");
    return;
  }

  try {
    toast.info("Initiating payment...");

    const response = await postAPI(
      "/api/custom-payment-request", 
      {
        userId: localStorage.getItem("userId"),
        customRequestId: requestId,
        amount: Number(amount.replace("₹", "").trim()), 
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data?.success && response.data?.data?.paymentUrl) {
      window.location.href = response.data.data.paymentUrl;
    } else {
      toast.error(response.data?.message || "Failed to get payment URL");
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    const msg = error?.response?.data?.message || "Something went wrong";
    toast.error(msg);
  }
};

  const handleImageClick = (imagePath) => {
    const fullPath = `${BASE_URL}/${imagePath}`;
    setCurrentImages([fullPath]);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header & Add Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Custom Requests
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-3">Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setShowViewModal(false);
              setViewRequest(null);
            }}
            className="group relative flex items-center justify-center gap-2 bg-[#5C4033] hover:bg-[#4b3327] text-white py-3 px-6 rounded-2xl font-bold shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <FaPlus className="text-sm" />
            <span>Add Request</span>
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
            <tr key={req._id} className="border-b hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3">{index + 1}</td>

              {/* Product Name + Image */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 justify-center">
                  {req.BuyerImage ? (
                    <img
                      src={`${BASE_URL}/${req.BuyerImage}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer"
                      alt="Reference"
                      onClick={() => handleImageClick(req.BuyerImage)}
                      onError={(e) => {
                        e.target.src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {req.ProductName?.length > 18 ? req.ProductName.substring(0, 18) + '...' : req.ProductName || '—'}
                    </p>
                    <p className="text-xs text-gray-500">{req.ArtType || 'General'}</p>
                  </div>
                </div>
              </td>

              {/* Artist Name */}
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {req.Artist?.id?.name || req.Artist?.name || ''}{' '}
                  {req.Artist?.id?.lastName || req.Artist?.lastName || ''}
                </p>
              </td>

              {/* Latest Negotiated Budget */}
              <td className="px-4 py-3">
                <span className="text-sm font-bold text-gray-900">
                  {getLatestNegotiatedBudget(req)}
                </span>
              </td>

              {/* Request Date */}
              <td className="px-4 py-3">
                <p className="text-sm text-gray-600">
                  {req?.createdAt
                    ? new Date(req.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—'}
                </p>
              </td>

              {/* Artist Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    req.RequestStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : req.RequestStatus === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {req.RequestStatus || 'Pending'}
                </span>
              </td>

              {/* Buyer Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    req.BuyerStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : req.BuyerStatus === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {req.BuyerStatus || 'Pending'}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* View */}
                  <button
                    onClick={() => handleViewRequest(req)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all shadow-sm active:scale-95"
                    title="View Details"
                  >
                    <FaEye className="text-base" />
                  </button>

                  {/* Edit - only very early stage */}
                  {req.BuyerNegotiatedBudgets.length === 0 &&
                    req.ArtistNegotiatedBudgets.length < 2 &&
                    req.RequestStatus === 'Pending' && (
                      <button
                        onClick={() => handleEditRequest(req._id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm active:scale-95"
                        title="Edit Request"
                      >
                        <GoPencil className="text-base" />
                      </button>
                    )}

                  {/* Accept / Approve */}
                  {req.RequestStatus === 'Pending' &&
                    ((req.BuyerNegotiatedBudgets.length === 0 && req.ArtistNegotiatedBudgets.length === 1) ||
                      (req.BuyerNegotiatedBudgets.length === 1 && req.ArtistNegotiatedBudgets.length === 2) ||
                      (req.BuyerNegotiatedBudgets.length === 2 && req.ArtistNegotiatedBudgets.length === 3)) && (
                      <button
                        onClick={() => handleStatusUpdate('Approved', '', req._id)}
                        disabled={loading}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Accept & Approve"
                      >
                        {loading ? <FaSpinner className="animate-spin text-base" /> : <FaCheck className="text-base" />}
                      </button>
                    )}

                  {/* Negotiate */}
                  {req.RequestStatus === 'Pending' &&
                    ((req.BuyerNegotiatedBudgets.length === 0 && req.ArtistNegotiatedBudgets.length === 1) ||
                      (req.BuyerNegotiatedBudgets.length === 1 && req.ArtistNegotiatedBudgets.length === 2)) && (
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowNegotiationModal(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all shadow-sm active:scale-95"
                        title="Negotiate Budget"
                      >
                        <LuHandshake className="text-base" />
                      </button>
                    )}

                  {/* Make Payment */}
                  {req.RequestStatus === 'Approved' && (
                    <button
                      onClick={() => {
                        const amount = getLatestNegotiatedBudget(req);
                        if (amount === '—') {
                          toast.warn('No negotiated amount available yet');
                          return;
                        }
                        handleInitiatePayment(req._id, amount);
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm active:scale-95"
                      title="Proceed to Payment"
                    >
                      <FaRupeeSign className="text-base" />
                    </button>
                  )}

                  {/* Reject - final stage */}
                  {req.BuyerNegotiatedBudgets.length === 2 &&
                    req.ArtistNegotiatedBudgets.length === 3 &&
                    req.RequestStatus !== 'Approved' &&
                    req.RequestStatus !== 'Rejected' && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={loading}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Reject Request"
                      >
                        {loading ? <FaSpinner className="animate-spin text-base" /> : <RiProhibited2Line className="text-base" />}
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="px-6 py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-500">No custom requests found</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

          {/* Pagination */}
          <div className="px-6 py-5 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-900">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * rowsPerPage, filteredRequests.length)}</span> of <span className="text-gray-900">{filteredRequests.length}</span> entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#5C4033] hover:border-[#5C4033]/30 disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                        ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20'
                        : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#5C4033] hover:border-[#5C4033]/30 disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-2xl shadow-blue-50/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingId ? "Edit Custom Request" : "Add New Custom Request"}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="What would you like to request?"
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  required
                />
              </div>

              {/* Artist & Art Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Artist <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="artistSelect"
                    name="artist"
                    value={artistId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setArtistId(selectedId);
                      const selectedArtist = artists.find(a => a._id === selectedId);
                      setSelectedArtistName(selectedArtist ? `${selectedArtist.name} ${selectedArtist.lastName || ""}`.trim() : "");
                    }}
                    className="w-full appearance-none border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none cursor-pointer"
                    required
                  >
                    <option value="">Choose an Artist</option>
                    {artists.map((artist) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name} {artist.lastName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Art Type <span className="text-rose-500">*</span>
                </label>
                <CreatableSelect
                  options={allCategories}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({
                      ...prev,
                      artType: selectedOption ? selectedOption.label : "",
                    }));
                  }}
                  value={
                    allCategories.find(cat => cat.label === formData.artType) ||
                    (formData.artType ? { label: formData.artType, value: formData.artType } : null)
                  }
                  isClearable
                  placeholder="Select or type art type"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: "1rem",
                      borderWidth: "1px",
                      borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                      padding: "6px 4px",
                      backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    }),
                  }}
                />
              </div>

              {/* Size & Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Size <span className="text-rose-500">*</span>
                </label>
                <CreatableSelect
                  options={sizeOptions}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({
                      ...prev,
                      size: selectedOption ? selectedOption.label : "",
                    }));
                  }}
                  value={
                    sizeOptions.find(opt => opt.label === formData.size) ||
                    (formData.size ? { label: formData.size, value: formData.size } : null)
                  }
                  isClearable
                  placeholder="Select or type size"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: "1rem",
                      borderWidth: "1px",
                      borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                      padding: "6px 4px",
                      backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    }),
                  }}
                />
              </div>

              {/* Colors & Frame */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color Preferences</label>
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
                  <input
                    type="text"
                    value={colorPref}
                    onChange={(e) => setColorPref(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddColor(); } }}
                    placeholder="e.g. Royal Blue"
                    className="flex-grow bg-transparent px-3 py-1.5 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-[#5C4033] text-white px-4 py-1.5 text-sm font-bold rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {colorPreferences.map((color, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                      {color}
                      <button
                        type="button"
                        onClick={() => setColorPreferences(colorPreferences.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-rose-500"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  {isFetching ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm italic">
                      <FaSpinner className="animate-spin" /> Loading addresses...
                    </div>
                  ) : fetchError ? (
                    <p className="text-rose-500 text-sm">{fetchError}</p>
                  ) : addresses.length > 0 ? (
                    addresses.map((address) => (
                      <label key={address._id} className="flex items-start gap-3 cursor-pointer group/addr">
                        <div className="relative flex items-center mt-1">
                          <input
                            type="radio"
                            name="selectedAddress"
                            value={address._id}
                            checked={String(selectedAddressId) === String(address._id)}
                            onChange={() => handleAddressChange(address._id)}
                              className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:bg-[#5C4033] checked:border-white checked:border-[4px] ring-1 ring-[#5C4033] transition-all duration-300"

                          />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${String(selectedAddressId) === String(address._id) ? 'text-[#5C4033]' : 'text-gray-600'} transition-colors`}>
                            {address.city}, {address.state}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {address.line1}, {address.pincode}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No addresses found. Please add one in profile.</p>
                  )}
                </div>
              </div>

              {/* Budgets */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Budget (₹) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Budget (₹) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className={`group flex items-center justify-between p-4 w-full rounded-2xl border transition-all duration-300 cursor-pointer ${formData.isFramed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-blue-200'}`} onClick={() => setFormData({ ...formData, isFramed: !formData.isFramed })}>
                  <div className="flex items-center gap-3">
                    <div className={`!w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.isFramed ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 8h8v8H8z" /></svg>
                    </div>
                    <span className={`font-bold text-sm ${formData.isFramed ? 'text-emerald-900' : 'text-gray-600'}`}>Frame Required</span>
                  </div>
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isFramed ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isFramed ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
              </div>

              {/* Payment & Deadline */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className={formData.paymentTerm === "Installment" ? "md:w-1/2 w-full" : "w-full"}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Term <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      id="paymentTerm"
                      name="paymentTerm"
                      value={formData.paymentTerm}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none cursor-pointer"
                      required
                    >
                      <option value="">Select Payment Option</option>
                      <option value="Full Payment">Full Payment</option>
                      <option value="Installment">Installment</option>
                      <option value="Two Step Payment">Two Step Payment</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {formData.paymentTerm === "Installment" && (
                  <div className="md:w-1/2 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select
                        name="installmentDuration"
                        value={formData.installmentDuration}
                        onChange={handleChange}
                        className="w-full appearance-none border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none cursor-pointer"
                      >
                        <option value="">Select Duration</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Deadline (Days) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  name="expectedDeadline"
                  value={formData.expectedDeadline}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="30"
                />
              </div>

              {/* Reference Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Document/Image <span className="text-rose-500">*</span></label>
                <div className="relative group/upload">
                  <input
                    type="file"
                    name="buyerImage"
                    id="buyerImage"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      handleChange(e);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (file.type.startsWith("image/")) {
                          setImagePreview(reader.result);
                          setFileType("image");
                        } else if (file.type === "application/pdf") {
                          setImagePreview(reader.result);
                          setFileType("pdf");
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="buyerImage" className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 hover:bg-white hover:border-[#5C4033]/50 transition-all cursor-pointer group-hover/upload:shadow-inner">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover/upload:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-700">Click to upload reference file</span>
                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Images or PDF</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    {fileType === "image" ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-white ring-2 ring-gray-100">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">File Selected</p>
                      <button type="button" onClick={() => { setImagePreview(null); setFileType(null); }} className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 mt-1">Remove File</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comments & Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes <span className="text-rose-500">*</span></label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-200 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all outline-none resize-none"
                  placeholder="Anything else the artist should know?"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description <span className="text-rose-500">*</span></label>
                <div className={`rounded-[2rem] overflow-hidden border transition-all ${descriptionError ? 'border-rose-300 ring-4 ring-rose-50' : 'border-gray-200'}`}>
                  <ReactQuill
                    id="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Provide a thorough breakdown of your vision..."
                    modules={modules}
                    theme="snow"
                    style={editorStyle}
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex-1 sm:flex-none flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {isSubmitting ? <FaSpinner className="animate-spin" /> : editingId ? "Update Request" : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none py-4 px-12 rounded-2xl font-bold text-lg text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showViewModal && viewRequest && (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => { setShowViewModal(false); setViewRequest(null); fetchRequests(); }}
              className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="text-sm font-bold uppercase tracking-widest">Back to List</span>
            </button>
          </div>
          <ViewBuyerRequest request={viewRequest} onClose={() => { setShowViewModal(false); setViewRequest(null); fetchRequests(); }} />
        </div>
      )}

      {/* Negotiation Modal */}
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

      {/* Image Preview Popup */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-lg transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="w-full aspect-square bg-gray-50">
              <img
                src={currentImages[currentImageIndex]}
                alt="Popup"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomRequestForm;
