import React, { useState, useEffect } from 'react';
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuHandshake } from "react-icons/lu";
import { FaEye } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import postAPI from '../../../../../../../api/postAPI';
import deleteAPI from '../../../../../../../api/deleteAPI';
import getAPI from '../../../../../../../api/getAPI';
import putAPI from '../../../../../../../api/putAPI';


const AddCustomRequestForm = () => {

  const [showNegotiationPopup, setShowNegotiationPopup] = useState(false);
  const [negotiationData, setNegotiationData] = useState({
    buyerName: '',
    requestDate: '',
    maxBudget: '',
    minBudget: '',
    negotiatedBudget: '',
    notes: '',
    status: 'pending', // default
  });

  const [negotiatedBudget, setNegotiatedBudget] = useState('');
  const [notes, setNotes] = useState('');


  const [artistId, setArtistId] = useState('');
  const [paymentTerm, setPaymentTerm] = useState([]);

  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [colorPref, setColorPref] = useState('');
  const [colorPreferences, setColorPreferences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedArtistName, setSelectedArtistName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);


  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    artType: '',
    size: '',
    isFramed: false,
    minBudget: '',
    maxBudget: '',
    paymentTerm: '',
    expectedDeadline: '',
    buyerImage: null,
    comments: '',
    description: ''
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getAPI("/artist/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast.error('Failed to fetch Artists');
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await getAPI("/api/get-buyer-request");
        setRequests(response.data.buyerRequests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error('Failed to fetch requests');
      }
    };

    fetchArtists();
    fetchRequests();
  }, [token]);

  const handleAddColor = () => {
    if (colorPref.trim() && !colorPreferences.includes(colorPref.trim())) {
      setColorPreferences([...colorPreferences, colorPref.trim()]);
      setColorPref('');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      const file = files && files.length > 0 ? files[0] : null;
      setFormData({ ...formData, [name]: file });
    } else {
      const numericFields = ['expectedDeadline', 'minBudget', 'maxBudget', 'negotiatedBudget'];
      setFormData({
        ...formData,
        [name]: numericFields.includes(name) ? Number(value) : value,
      });
    }
  };


  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  // const handleEditRequest = (request) => {
  //   setFormData({
  //     ...request,
  //     description: request.description || '',
  //     buyerImage: null
  //   });


  //   if (request.Artist?.id) {
  //     setArtistId(request.Artist.id);
  //   }

  //   setColorPreferences(request.colourPreferences || []);
  //   setEditingId(request._id);
  //   setShowForm(true);
  // };

  const handleEditRequest = async (id) => {
    try {
      const response = await getAPI('/api/get-buyer-request');
      const allRequests = response.data.buyerRequests;

      const existingData = allRequests.find(req => req._id === id);
      if (!existingData) {
        toast.error("Request not found");
        return;
      }

      setFormData({
        productName: existingData.ProductName || '',
        description: existingData.Description || '',
        artType: existingData.ArtType || '',
        size: existingData.Size || '',
        isFramed: existingData.IsFramed || false,
        minBudget: existingData.MinBudget || '',
        maxBudget: existingData.MaxBudget || '',
        paymentTerm: existingData.PaymentTerm || '',
        expectedDeadline: existingData.ExpectedDeadline || '',
        buyerImage: existingData.Buyer.id.profilePhoto || null,
        comments: existingData.Comments || ''
      });

      setColorPreferences(existingData.ColourPreferences || []);
      setArtistId(existingData.Artist?.id || '');
      setSelectedArtistName(
        `${existingData.Artist?.name || ''} ${existingData.Artist?.lastname || ''}`.trim()
      );

      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      console.error("Error loading request for editing:", error);
      toast.error("Failed to load request");
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteAPI(`/api/delete-buyer-requests/${id}`);
      toast.success("Request deleted");
      setRequests(requests.filter(req => req._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete request");
    }
  };

  const handleImageClick = () => {
    setShowFullImage(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tempElement = document.createElement("div");
    tempElement.innerHTML = formData.description;
    const plainTextDescription = tempElement.innerText;

    const formPayload = new FormData();
    formPayload.append('ProductName', formData.productName);
    formPayload.append('Description', plainTextDescription);
    formPayload.append('ArtType', formData.artType);
    formPayload.append('Size', formData.size);
    formPayload.append('IsFramed', formData.isFramed);
    formPayload.append('MinBudget', formData.minBudget);
    formPayload.append('MaxBudget', formData.maxBudget);
    formPayload.append('PaymentTerm', formData.paymentTerm);
    formPayload.append('ExpectedDeadline', formData.expectedDeadline);

    formPayload.append('Comments', formData.comments);
    formPayload.append('ColourPreferences', JSON.stringify(colorPreferences));

    if (formData.buyerImage) {
      formPayload.append('BuyerImage', formData.buyerImage);
    }

    if (!artistId) {
      toast.error("Please select an artist.");
      return;
    }

    const selectedArtist = artists.find((a) => a._id === artistId);
    if (!selectedArtist) {
      toast.error("Selected artist not found.");
      return;
    }

    formPayload.append('Artist', selectedArtist._id);

    try {

      let response;

      if (editingId) {
        response = await putAPI(`/api/update-buyer-request/${editingId}`, formPayload);
      } else {
        response = await postAPI('/api/buyer-request', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }, true);
      }

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        toast.success(data.message || "Request created successfully!");
        const updatedRequests = await getAPI("/api/buyer-request");
        setRequests(updatedRequests.data.requests || []);
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      const message = error?.response?.data?.message || "An error occurred";
      toast.error(message);
    }

    //Reset form
    setFormData({
      productName: '',
      description: '',
      artType: '',
      size: '',
      isFramed: false,
      minBudget: '',
      maxBudget: '',
      paymentTerm: '',
      expectedDeadline: '',
      buyerImage: null,
      comments: ''
    });
    setColorPreferences([]);
    setEditingId(null);
    setShowForm(false);
    setArtistId('');
    setIsSubmitting(false);
  };

  const handleNegotiationAction = async (actionType) => {
    if (!selectedRequest) return;

    const payload = {
      negotiatedBudget,
      notes,
      status: actionType === 'save' ? selectedRequest.status : actionType,
    };

    try {
      // Send update to correct negotiation endpoint
      const updatedData = await putAPI(`/update-negiotaite-Buyer-budget/${selectedRequest._id}`, payload);

      // Update UI state (either with optimistic payload or from server response)
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? { ...req, ...updatedData } // or use ...payload if server returns nothing
            : req
        )
      );

      setShowNegotiationPopup(false);
    } catch (err) {
      console.error("Failed to update negotiation data:", err);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sans-serif'] }, { 'size': ['small', 'large', 'huge'] }],
      [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      ['blockquote'],
      // ['fullscreen'],
      ['help'],
    ],
  };

  const editorStyle = {
    fontFamily: 'Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif',
    fontSize: '12px',
  };

  return (
    <div className="w-[856px]  ">
      <div className='flex justify-between mb-[30px] h-[48px] '>

        <h2 className="text-2xl text-gray-950 top-[480px] left-[506px] font-semibold">Custom Requests</h2>

        <div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#6F4D34] text-white text-[16px] text-semibold px-4 py-2 rounded-xl flex"
          >
            <FaPlus className='mt-1' />  &nbsp; Add Request
          </button>
        </div>
      </div>

      {/* Table of Requests */}

      <div className="border-2 rounded-3xl p-4 w-full max-w-5xl mx-auto bg-white">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Buyer Request List</h2>

          {/* Search Bar */}
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full border border-gray-300 rounded-full pl-9 pr-4 py-2 text-sm transition"
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg font-semibold" />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">#</th>
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
              {requests.length > 0 ? (
                requests.map((req, index) => (
                  <tr key={req._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">

                      <img
                        src={`http://localhost:3001/${req.BuyerImage}`}
                        // src={req.Buyer.id.profilePhoto ? req.Buyer.id.profilePhoto : '/placeholder.jpg'} alt="product"
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      {req.ProductName || '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">{req.Artist?.id?.name || ''} {req.Artist?.id?.lastName || ''}</td>
                    <td className="px-4 py-2">
                      {req.MaxBudget ? `₹${req.MaxBudget}` : '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">
                      {req.MinBudget ? `₹${req.MinBudget}` : '₹ NaN'}
                    </td>

                    <td className="px-4 py-2">{req.NegotiatedBudget || "—"}</td>


                    <td className="px-4 py-2">
                      {req?.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                    </td>

                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.RequestStatus === 'Approved'
                          ? 'text-green-500 border-green-500 bg-white'
                          : req.BuyerStatus === 'Pending'
                            ? 'text-red-500 border-red-500 bg-white'
                            : 'text-yellow-500 border-yellow-500 bg-white'
                          }`}
                      >
                        {req.RequestStatus || 'Pending'}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.BuyerStatus === 'Approved'
                          ? 'text-green-500 border-green-500 bg-white'
                          : req.BuyerStatus === 'Pending'
                            ? 'text-red-500 border-red-500 bg-white'
                            : 'text-yellow-500 border-yellow-500 bg-white'
                          }`}
                      >
                        {req.BuyerStatus || 'Pending'}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-2 text-gray-700">
                      <FaEye
                        className="cursor-pointer text-2xl text-cyan-600 border border-cyan-400 p-1 rounded-lg"
                        title="View"
                      />
                      <GoPencil
                        onClick={() => handleEditRequest(req._id)}
                        className="cursor-pointer text-2xl text-sky-600 border border-sky-400 p-1 rounded-lg"
                        title="Edit"
                      />
                      <RiDeleteBin6Line
                        onClick={() => handleDeleteRequest(req._id)}
                        className="cursor-pointer text-2xl text-red-600 border border-red-400 p-1 rounded-lg"
                        title="Delete"
                      />
                      <LuHandshake
                        onClick={() => {
                          setNegotiationData({
                            buyerName: `${req.Buyer?.id?.name} ${" "} ${req.Buyer?.id.lastName}` || '',
                            requestDate: req.createdAt?.substring(0, 10) || '',
                            maxBudget: req.MaxBudget || '',
                            minBudget: req.MinBudget || '',
                            negotiatedBudget: req.negotiatedBudget || '',
                            notes: req.notes || '',
                            status: req.status || '',
                          });
                          setSelectedRequest(req);  // req = clicked request
                          setShowNegotiationPopup(true);
                          setNegotiatedBudget(req.NegotiatedBudget || '');
                          setNotes(req.Notes || '');

                        }}
                        className="cursor-pointer text-2xl text-white bg-gray-500 p-1 rounded-lg"
                        title="Negotiate"
                      />

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form (Conditional) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-5  p-6 ">
          <h3 className="text-xl font-semibold">Add Custom Request</h3>

          {/* Product Name */}
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

          {/* Select Artist */}
          <div>
            <label className="block font-medium mb-1">Select Artist</label>
            <select
              id="artistSelect"
              name="artist"
              value={artistId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setArtistId(selectedId);

                // If you want to update selectedArtistName when user selects a new artist:
                const selectedArtist = artists.find(a => a._id === selectedId);
                if (selectedArtist) {
                  setSelectedArtistName(`${selectedArtist.name} ${selectedArtist.lastName || ''}`.trim());
                } else {
                  setSelectedArtistName('');
                }
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

          {/* Art Type */}
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

          {/* Size */}
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

          {/* Color Preferences */}
          <div>
            <label className="block font-medium mb-1">Color Preferences</label>
            <div className="flex w-full items-center border-2 border-gray-300 rounded-xl px-2">
              <input
                type="text"
                value={colorPref}
                onChange={(e) => setColorPref(e.target.value)}
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
            <div className='pt-2 text-sm text-gray-400'>Click "Add" to include each colour preference</div>

            {colorPreferences.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
                {colorPreferences.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Frame Required */}
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

          {/* Budget */}
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

          {/* Payment Term */}
          <div>
            <label className="block font-medium mb-1">Payment Term</label>
            <select
              id="paymentTerm"
              name="paymentTerm"
              value={formData.paymentTerm}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select payment option</option>
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
              <option value="two-step">Two Step Payment</option>
            </select>

          </div>

          {/* Deadline */}
          <div>
            <label className="block font-medium mb-1">Expected Deadline (days)</label>
            <input
              type="number"
              name="expectedDeadline"
              value={formData.expectedDeadline}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
          </div>

          {/* Reference Image */}
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

            {/* Image preview */}
            {fileType === "image" && imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-[200px] rounded-md border p-1"
                  onClick={() => setShowFullImage(true)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}

            {/* PDF preview */}
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

            {/* Full Image Modal */}
            {showFullImage && fileType === "image" && imagePreview && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Full Image"
                    className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                  />
                  <button
                    className="absolute top-2 right-2 text-white text-2xl"
                    onClick={() => setShowFullImage(false)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Additional Comments */}
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

          {/* Detailed description */}
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#6F4D34] text-white font-semibold px-11 py-2 rounded-full">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}



      {/* Pop-up */}
      {showNegotiationPopup && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[537px] h-[812px] text-lg rounded-[30px] px-6 py-8 relative shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h2 className="text-xl mb-2 font-semibold">Negotiable Request</h2>
              <button onClick={() => setShowNegotiationPopup(false)} className="text-xl font-bold">&times;</button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Buyer Name</label>
                <input
                  type="text"
                  className="w-full border rounded-xl px-3 py-2"
                  value={`${selectedRequest.Buyer?.id.name} ${selectedRequest.Buyer?.id.lastName}`}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Request Date</label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-3 py-2"
                  value={selectedRequest.createdAt?.substring(0, 10)}
                  disabled
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-2">Max Budget</label>
                  <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2"
                    value={selectedRequest.MaxBudget}
                    disabled
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-2">Min Budget</label>
                  <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2"
                    value={selectedRequest.MinBudget}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Negotiated Budget</label>
                <input
                  type="number"
                  className="w-full border rounded-xl px-3 py-2"
                  value={negotiatedBudget}
                  onChange={(e) => setNegotiatedBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full border rounded-xl px-3 py-2"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4 border-t mt-4 text-lg px-3 font-semibold">
                <button
                  type="button"
                  className="bg-cyan-500 text-white px-4 py-2 rounded-xl"
                  onClick={() => handleNegotiationAction('save')}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-xl"
                  onClick={() => handleNegotiationAction('accepted')}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-xl"
                  onClick={() => handleNegotiationAction('rejected')}
                >
                  Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddCustomRequestForm;
