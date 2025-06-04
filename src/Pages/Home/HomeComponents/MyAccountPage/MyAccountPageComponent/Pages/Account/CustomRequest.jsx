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


const AddCustomRequestForm = () => {

  const [artistId, setArtistId] = useState('');
  const [paymentTerm, setPaymentTerm] = useState([]);


  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [colorPref, setColorPref] = useState('');
  const [colorPreferences, setColorPreferences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNegotiationPopup, setShowNegotiationPopup] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const [fileType, setFileType] = useState(null);

  // const [buyerImage, setBuyerImage] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false); // Optional for full-size view

// const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    artists: [],
    artType: '',
    size: '',
    isFramed: false,
    minBudget: 0,
    maxBudget: 0,
    paymentTerm: '',
    expectedDeadline: 0,
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
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await getAPI("/api/buyer-request", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
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
    setFormData({ ...formData, [name]: files[0] });
  } else {
    const numericFields = ['expectedDeadline', 'minBudget', 'maxBudget'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  }
};


  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleEditRequest = (request) => {
    setFormData({
      ...request,
      description: request.description || '',
      buyerImage: null
    });
    setColorPreferences(request.colourPreferences || []);
    setEditingId(request._id);
    setShowForm(true);
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteAPI(`/api/buyer-request/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    formPayload.append('Artists', JSON.stringify(formData.artists));
    if (formData.buyerImage) {
      formPayload.append('BuyerImage', formData.buyerImage);
      // formData.append("buyerImage", yourFileObject);
    }


    if (artistId) {
      formPayload.append('Artist', artistId);
    }

    // if (buyerImage) {
    //   formPayload.append('buyerImage', buyerImage, buyerImage.name);
    // }

    try {
      let response;

      response = await postAPI('/api/buyer-request', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        // body: formPayload,
      }, true);

 const data = response.data;

  if (response.status === 200 || response.status === 201) {
    toast.success(data.message || "Request created successfully!");
    const updatedRequests = await getAPI("/api/buyer-request", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(updatedRequests.data.requests || []);
  } else {
    toast.error(data.message || "Submission failed");
  }
} catch (error) {
  console.error("Submit error:", error);
  const message = error?.response?.data?.message || "An error occurred";
  toast.error(message);
}

    setFormData({
      productName: '',
      description: '',
      artists: [],
      artType: '',
      size: '',
      isFramed: false,
      minBudget: 0,
      maxBudget: 0,
      paymentTerm: '',
      expectedDeadline: 0,
      buyerImage: null,
      comments: ''
    });
    setColorPreferences([]);
    setEditingId(null);
    setShowForm(false);
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
                <th className="px-4 py-2 whitespace-nowrap">Art Type</th>
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
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <img
                        src={req.imageUrl || '/placeholder.jpg'}
                        alt="product"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {req.productName || '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">{req.artist || ''}</td>
                    <td className="px-4 py-2">{req.artType || ''}</td>
                    <td className="px-4 py-2">
                      {req.maxBudget ? `₹${req.maxBudget}` : '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">
                      {req.minBudget ? `₹${req.minBudget}` : '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">
                      {req.negotiatedBudget ? `₹${req.negotiatedBudget}` : '₹ NaN'}
                    </td>
                    <td className="px-4 py-2">{req.requestDate || ''}</td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.requestStatus === 'Approved'
                          ? 'text-green-500 border-green-500 bg-white'
                          : req.buyerRequestStatus === 'Pending'
                            ? 'text-red-500 border-red-500 bg-white'
                            : 'text-yellow-500 border-yellow-500 bg-white'
                          }`}
                      >
                        {req.requestStatus || 'Pending'}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded-lg border text-sm ${req.buyerRequestStatus === 'Approved'
                          ? 'text-green-500 border-green-500 bg-white'
                          : req.buyerRequestStatus === 'Pending'
                            ? 'text-red-500 border-red-500 bg-white'
                            : 'text-yellow-500 border-yellow-500 bg-white'
                          }`}
                      >
                        {req.buyerRequestStatus || 'Pending'}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-2 text-gray-700">
                      <FaEye
                        className="cursor-pointer text-2xl text-cyan-600 border border-cyan-400 p-1 rounded-lg"
                        title="View"
                      />
                      <GoPencil
                        onClick={() => handleEditRequest(index)}
                        className="cursor-pointer text-2xl text-sky-600 border border-sky-400 p-1 rounded-lg"
                        title="Edit"
                      />
                      <RiDeleteBin6Line
                        onClick={() => handleDeleteRequest(index)}
                        className="cursor-pointer text-2xl text-red-600 border border-red-400 p-1 rounded-lg"
                        title="Delete"
                      />
                      <LuHandshake
                        onClick={() => setShowNegotiationPopup(true)}
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
              value={formData.artists[0] || ''}
              onChange={(e) => {
                const selectedId = e.target.value;
                setArtistId(selectedId);

                // Optional: find the selected artist object if needed
                const selectedArtist = artists.find(a => a._id === selectedId);
                if (selectedArtist) {
                  setFormData({
                    ...formData,
                    artists: [selectedArtist._id], // Only one artist allowed
                  });
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
              name="frameRequired"
              checked={formData.frameRequired}
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
              name="paymentTerm" // ✅ should match formData
              value={formData.paymentTerm}
              onChange={handleChange} // ✅ use the shared handler
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
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
          </div>

          {/* Reference Image */}
          <div>
            <label className="block font-medium mb-1">Reference Image</label>
            <input
              type="file"
              name="BuyerImage"
              onChange={(e) => {
                handleChange(e);
                const file = e.target.files[0];
                if (file) {
                  const fileType = file.type;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (fileType.startsWith("image/")) {
                      setImagePreview(reader.result);
                      setFileType("image");
                    } else if (fileType === "application/pdf") {
                      setImagePreview(null);
                      setFileType("pdf");
                    } else {
                      setImagePreview(null);
                      setFileType(null);
                    }
                  };
                  reader.readAsDataURL(file);
                }

              }}
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2"
            />
            {fileType === "image" && imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '4px',
                    padding: '5px'
                  }}
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

          {/* Submit Button */}
          <button 
          type="submit" 
          // disabled={isSubmitting}
          className="bg-[#6F4D34] text-white font-semibold px-11 py-2 rounded-full">
            {/* {isSubmitting ? 'Submitting...' : 'Submit'} */}
            Submit
          </button>
        </form>
      )}



      {/* Pop-up */}
      {showNegotiationPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[537px] h-[812px] text-lg  rounded-[30px] px-6 py-8 relative shadow-lg">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h2 className="text-xl mb-2 font-semibold">Negotiable Request</h2>
              <button onClick={() => setShowNegotiationPopup(false)} className="text-xl font-bold">&times;</button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Buyer Name</label>
                <input type="text" className="w-full border rounded-xl px-3 py-2" placeholder="Buyer Name" disabled />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Request Date</label>
                <input type="date" className="w-full border rounded-xl px-3 py-2" placeholder="YYYY-MM-DD" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-2">Max Budget</label>
                  <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="40000" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-2">Min Budget</label>
                  <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="35000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Negotiable Budget</label>
                <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="45000" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea className="w-full border rounded-xl px-3 py-2" rows="3" placeholder="Send Message"></textarea>
              </div>

              <div className="flex justify-between pt-4 border-t mt-4 text-lg px-3 font-semibold">
                <button type="button" className="bg-cyan-500 text-white px-4 py-2 rounded-xl">Save Changes</button>
                <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-xl">Accepted</button>
                <button type="button" className="bg-white text-red-600 border-[0.6px] border-red-600 px-4 py-2 rounded-xl">Rejected</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default AddCustomRequestForm;
