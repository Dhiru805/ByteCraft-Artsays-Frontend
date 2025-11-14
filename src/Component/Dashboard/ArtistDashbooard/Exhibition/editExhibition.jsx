import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import putAPI from "../../../../api/putAPI";

const UpdateExhibition = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const exhibition = state?.exhibition;

  const [formData, setFormData] = useState({
    userType: "",
    userId: "",
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    eventLocation: {
      address: "",
      city: "",
      state: "",
      country: "",
      pin: "",
      googleMapUrl: "",
    },
    eventUrl: "",
    dailyTiming: "",
    entryType: "",
    ticketPrice: "",
    language: "",
    coverBanner: null,
    logo: null,
    hostedBy: "",
    contactDetails: {
      fullName: "",
      mobileNo: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pin: "",
    },
    guestSpeaker: "",
    earlyBirdDiscounts: [],
    maxCapacity: "",
    liveBidding: false,
    certificateDistribution: false,
    awardDistribution: false,
    eventPromotion: "Invite",
  });
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponDiscountInput, setCouponDiscountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverBannerPreview, setCoverBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleImageClick = (imageUrl) => {
    const images = [imageUrl];
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  useEffect(() => {
    if (!exhibition) {
      toast.error("No exhibition data provided.");
      navigate("/artist/exhibition");
    } else {
      setFormData({
        userType: exhibition.userType || "",
        userId: exhibition.userId || "",
        title: exhibition.title || "",
        type: exhibition.type || "",
        startDate: exhibition.startDate ? new Date(exhibition.startDate).toISOString().split("T")[0] : "",
        endDate: exhibition.endDate ? new Date(exhibition.endDate).toISOString().split("T")[0] : "",
        eventLocation: {
          address: exhibition.eventLocation?.address || "",
          city: exhibition.eventLocation?.city || "",
          state: exhibition.eventLocation?.state || "",
          country: exhibition.eventLocation?.country || "",
          pin: exhibition.eventLocation?.pin || "",
          googleMapUrl: exhibition.eventLocation?.googleMapUrl || "",
        },
        eventUrl: exhibition.eventUrl || "",
        dailyTiming: exhibition.dailyTiming || "",
        entryType: exhibition.entryType || "",
        ticketPrice: exhibition.ticketPrice || "",
        language: exhibition.language || "",
        coverBanner: null,
        logo: null,
        hostedBy: exhibition.hostedBy || "",
        contactDetails: {
          fullName: exhibition.contactDetails?.fullName || "",
          mobileNo: exhibition.contactDetails?.mobileNo || "",
          email: exhibition.contactDetails?.email || "",
          address: exhibition.contactDetails?.address || "",
          city: exhibition.contactDetails?.city || "",
          state: exhibition.contactDetails?.state || "",
          country: exhibition.contactDetails?.country || "",
          pin: exhibition.contactDetails?.pin || "",
        },
        guestSpeaker: exhibition.guestSpeaker || "",
        earlyBirdDiscounts: exhibition.earlyBirdDiscounts || [],
        maxCapacity: exhibition.maxCapacity || "",
        liveBidding: exhibition.liveBidding || false,
        certificateDistribution: exhibition.certificateDistribution || false,
        awardDistribution: exhibition.awardDistribution || false,
        eventPromotion: exhibition.eventPromotion || "Invite",
      });
      setCoverBannerPreview(
        exhibition.coverBanner ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${exhibition.coverBanner}` : null
      );
      setLogoPreview(exhibition.logo ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${exhibition.logo}` : null);
    }
  }, [exhibition, navigate]);

  useEffect(() => {
    return () => {
      if (coverBannerPreview) URL.revokeObjectURL(coverBannerPreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [coverBannerPreview, logoPreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverBanner" || name === "logo") {
      const file = files[0];
      if (file) {
        if (!file.type.match(/image\/(jpeg|png)/)) {
          toast.error(`${name} must be a JPEG or PNG file.`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${name} file size must be less than 5MB.`);
          return;
        }
        setFormData({ ...formData, [name]: file });
        if (name === "coverBanner") {
          setCoverBannerPreview(file ? URL.createObjectURL(file) : coverBannerPreview);
        } else {
          setLogoPreview(file ? URL.createObjectURL(file) : logoPreview);
        }
      }
    } else if (name.includes("eventLocation.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        eventLocation: { ...formData.eventLocation, [field]: value },
      });
    } else if (name.includes("contactDetails.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        contactDetails: { ...formData.contactDetails, [field]: value },
      });
    } else if (name === "entryType") {
      setFormData({
        ...formData,
        entryType: value,
        ticketPrice: value === "Free" ? "" : formData.ticketPrice,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleToggle = (name) => {
    setFormData({ ...formData, [name]: !formData[name] });
  };

  const handleCouponInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "code") {
      setCouponCodeInput(value);
    } else if (type === "discount") {
      setCouponDiscountInput(value);
    }
  };

  const handleAddCoupon = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const code = couponCodeInput.trim();
      const discount = couponDiscountInput.trim();
      if (code && discount && !isNaN(discount) && !formData.earlyBirdDiscounts.some((c) => c.code === code)) {
        setFormData({
          ...formData,
          earlyBirdDiscounts: [...formData.earlyBirdDiscounts, { code, discount: Number(discount) }],
        });
        setCouponCodeInput("");
        setCouponDiscountInput("");
      } else if (!code || !discount) {
        toast.error("Both coupon code and discount percentage are required.");
      } else if (isNaN(discount)) {
        toast.error("Discount must be a number.");
      } else {
        toast.error("Coupon code already exists.");
      }
    }
  };

  const removeCoupon = (index) => {
    setFormData({
      ...formData,
      earlyBirdDiscounts: formData.earlyBirdDiscounts.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requiredFields = [
        { field: formData.title, name: "Title" },
        { field: formData.type, name: "Type" },
        { field: formData.startDate, name: "Start Date" },
        { field: formData.endDate, name: "End Date" },
        { field: formData.dailyTiming, name: "Daily Timing" },
        { field: formData.entryType, name: "Entry Type" },
        { field: formData.language, name: "Language" },
        { field: formData.hostedBy, name: "Hosted By" },
        { field: formData.maxCapacity, name: "Maximum Capacity" },
        { field: formData.contactDetails.fullName, name: "Contact Full Name" },
        { field: formData.contactDetails.mobileNo, name: "Contact Mobile Number" },
        { field: formData.contactDetails.email, name: "Contact Email" },
      ];

      if (formData.type !== "Virtual") {
        requiredFields.push(
          { field: formData.eventLocation.address, name: "Event Location Address" },
          { field: formData.eventLocation.city, name: "Event Location City" },
          { field: formData.eventLocation.country, name: "Event Location Country" }
        );
      } else {
        requiredFields.push({ field: formData.eventUrl, name: "Event URL" });
      }

      if (formData.entryType === "Ticket") {
        requiredFields.push({ field: formData.ticketPrice, name: "Ticket Price" });
      }

      const missingFields = requiredFields
        .filter(({ field }) => !field || (typeof field === "string" && !field.trim()))
        .map(({ name }) => name);

      if (missingFields.length > 0) {
        toast.error(`Please fill the required fields: ${missingFields.join(", ")}`);
        setLoading(false);
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("Start date cannot be after end date");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("userType", formData.userType);
      submissionData.append("userId", formData.userId);
      submissionData.append("title", formData.title.trim());
      submissionData.append("type", formData.type);
      submissionData.append("startDate", formData.startDate);
      submissionData.append("endDate", formData.endDate);
      submissionData.append("eventLocation", JSON.stringify(formData.eventLocation));
      submissionData.append("eventUrl", formData.eventUrl ? formData.eventUrl.trim() : "");
      submissionData.append("dailyTiming", formData.dailyTiming.trim());
      submissionData.append("entryType", formData.entryType);
      submissionData.append("ticketPrice", formData.ticketPrice ? formData.ticketPrice.trim() : "");
      submissionData.append("language", formData.language.trim());
      if (formData.coverBanner instanceof File) {
        submissionData.append("coverBanner", formData.coverBanner);
      }
      if (formData.logo instanceof File) {
        submissionData.append("logo", formData.logo);
      }
      submissionData.append("hostedBy", formData.hostedBy.trim());
      submissionData.append("contactDetails", JSON.stringify(formData.contactDetails));
      submissionData.append("guestSpeaker", formData.guestSpeaker ? formData.guestSpeaker.trim() : "");
      submissionData.append("earlyBirdDiscounts", JSON.stringify(formData.earlyBirdDiscounts));
      submissionData.append("maxCapacity", formData.maxCapacity);
      submissionData.append("liveBidding", formData.liveBidding.toString());
      submissionData.append("certificateDistribution", formData.certificateDistribution.toString());
      submissionData.append("awardDistribution", formData.awardDistribution.toString());
      submissionData.append("eventPromotion", formData.eventPromotion);

      const response = await putAPI(`/api/update-exhibition/${exhibition._id}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.data) {
        toast.success(response.data.message || "Exhibition updated successfully!");
        setCoverBannerPreview(null);
        setLogoPreview(null);
        setCouponCodeInput("");
        setCouponDiscountInput("");
        navigate("/artist/exhibition");
      } else {
        toast.error(response.data.message || "Failed to update exhibition");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating exhibition");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = ["Live Event", "Physical Gallery", "Virtual"];
  const entryTypeOptions = ["Free", "Ticket"];
  const eventPromotionOptions = ["Promotion", "Invite"];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Update Exhibition</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/artist/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/artist/exhibition")} style={{ cursor: "pointer" }}>
                  Exhibitions
                </span>
              </li>
              <li className="breadcrumb-item active">Update Exhibition</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Exhibition Title"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="type">
                      Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Type</option>
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="startDate">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="endDate">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                {formData.type !== "Virtual" && (
                  <div className="form-group">
                    <label>
                      Event Location <span className="text-danger">*</span>
                    </label>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.address"
                          value={formData.eventLocation.address}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Address"
                          required={formData.type !== "Virtual"}
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.city"
                          value={formData.eventLocation.city}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="City"
                          required={formData.type !== "Virtual"}
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.state"
                          value={formData.eventLocation.state}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="State"
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.country"
                          value={formData.eventLocation.country}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Country"
                          required={formData.type !== "Virtual"}
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.pin"
                          value={formData.eventLocation.pin}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Pin Code"
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="url"
                          name="eventLocation.googleMapUrl"
                          value={formData.eventLocation.googleMapUrl}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Google Map URL"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="eventUrl">
                      Event URL {formData.type === "Virtual" && <span className="text-danger">*</span>}
                    </label>
                    <input
                      type="url"
                      id="eventUrl"
                      name="eventUrl"
                      value={formData.eventUrl}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter event URL"
                      required={formData.type === "Virtual"}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="dailyTiming">
                      Daily Timing <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="dailyTiming"
                      name="dailyTiming"
                      value={formData.dailyTiming}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 10:00 AM - 6:00 PM"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="entryType">
                      Entry Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="entryType"
                      name="entryType"
                      value={formData.entryType}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Entry Type</option>
                      {entryTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="ticketPrice">
                      Ticket Price {formData.entryType === "Ticket" && <span className="text-danger">*</span>}
                    </label>
                    <input
                      type="text"
                      id="ticketPrice"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter ticket price (e.g., ₹500)"
                      required={formData.entryType === "Ticket"}
                      disabled={formData.entryType === "Free"}
                    />
                  </div>
                </div>
                {formData.entryType === "Ticket" && (
                  <div className="form-group">
                    <label>Early Bird Discounts</label>
                    <div className="d-flex flex-wrap align-items-center form-control p-2" style={{ minHeight: "44px" }}>
                      {formData.earlyBirdDiscounts.map((coupon, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                        >
                          <span className="mr-1">
                            {coupon.code} ({coupon.discount}%)
                          </span>
                          <span
                            className="ml-1 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => removeCoupon(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => handleCouponInputChange(e, "code")}
                          onKeyDown={handleAddCoupon}
                          className="border-0 px-2"
                          style={{ outline: "none", minWidth: "100px" }}
                          placeholder="Coupon code"
                        />
                        <input
                          type="text"
                          value={couponDiscountInput}
                          onChange={(e) => handleCouponInputChange(e, "discount")}
                          onKeyDown={handleAddCoupon}
                          className="border-0 px-2"
                          style={{ outline: "none", minWidth: "100px" }}
                          placeholder="Discount %"
                        />
                      </div>
                    </div>
                    <small className="form-text text-muted">
                      Enter coupon code and discount percentage, then press Enter or comma to add.
                    </small>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="language">
                      Language <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., English, Hindi"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="hostedBy">
                      Hosted By <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="hostedBy"
                      name="hostedBy"
                      value={formData.hostedBy}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter host name or organization"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="coverBanner">
                      Cover Banner <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      id="coverBanner"
                      name="coverBanner"
                      onChange={handleChange}
                      className="form-control"
                      accept="image/jpeg,image/png"
                    />
                    {coverBannerPreview && (
                      <div className="mt-2">
                        {showPopup && (
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
                                height: '50%',
                                backgroundColor: '#111',
                                borderRadius: '12px',
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                              }}
                            >
                              <img
                                src={currentImages[currentImageIndex]?.replace(/\\/g, '/')}
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
                        )}

                        <img
                          src={coverBannerPreview}
                          alt="Cover Banner Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                          onClick={() => handleImageClick(coverBannerPreview)}

                        />
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="logo">
                      Logo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      onChange={handleChange}
                      className="form-control"
                      accept="image/jpeg,image/png"
                    />
                    {logoPreview && (
                      <div className="mt-2">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                          onClick={() => handleImageClick(logoPreview)}

                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Contact Details <span className="text-danger">*</span>
                  </label>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.fullName"
                        value={formData.contactDetails.fullName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="tel"
                        name="contactDetails.mobileNo"
                        value={formData.contactDetails.mobileNo}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Mobile Number"
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="email"
                        name="contactDetails.email"
                        value={formData.contactDetails.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.address"
                        value={formData.contactDetails.address}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Address"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.city"
                        value={formData.contactDetails.city}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="City"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.state"
                        value={formData.contactDetails.state}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="State"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.country"
                        value={formData.contactDetails.country}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Country"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.pin"
                        value={formData.contactDetails.pin}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Pin Code"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="guestSpeaker">Guest Speaker/Celebrity</label>
                    <input
                      type="text"
                      id="guestSpeaker"
                      name="guestSpeaker"
                      value={formData.guestSpeaker}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter guest speaker or celebrity name"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="maxCapacity">
                      Maximum Capacity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="maxCapacity"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter maximum capacity"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 form-group">
                    <label htmlFor="liveBidding">
                      Live Bidding Event
                    </label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="liveBidding"
                        name="liveBidding"
                        checked={formData.liveBidding}
                        onChange={() => handleToggle("liveBidding")}
                      />
                      <label className="custom-control-label" htmlFor="liveBidding">
                        {formData.liveBidding ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="certificateDistribution">
                      Certificate Distribution
                    </label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="certificateDistribution"
                        name="certificateDistribution"
                        checked={formData.certificateDistribution}
                        onChange={() => handleToggle("certificateDistribution")}
                      />
                      <label className="custom-control-label" htmlFor="certificateDistribution">
                        {formData.certificateDistribution ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="awardDistribution">
                      Award Distribution
                    </label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="awardDistribution"
                        name="awardDistribution"
                        checked={formData.awardDistribution}
                        onChange={() => handleToggle("awardDistribution")}
                      />
                      <label className="custom-control-label" htmlFor="awardDistribution">
                        {formData.awardDistribution ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="eventPromotion">
                      Event Promotion/Invite <span className="text-danger">*</span>
                    </label>
                    <select
                      id="eventPromotion"
                      name="eventPromotion"
                      value={formData.eventPromotion}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      {eventPromotionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                   
                  </div>
                </div>
                <button type="submit" className="btn btn-block btn-primary mt-3" disabled={loading}>
                  {loading ? "Updating Exhibition..." : "Update Exhibition"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateExhibition;