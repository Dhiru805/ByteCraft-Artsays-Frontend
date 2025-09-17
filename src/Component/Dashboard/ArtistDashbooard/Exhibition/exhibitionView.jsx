import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewExhibition = () => {
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

  const typeOptions = ["Live Event", "Physical Gallery", "Virtual"];
  const entryTypeOptions = ["Free", "Ticket"];
  const eventPromotionOptions = ["Promotion", "Invite"];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Exhibition</h2>
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
              <li className="breadcrumb-item active">View Exhibition</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">

              {exhibition?.status === "Rejected" && (
                <div style={{
                  backgroundColor: "#f8d7da",
                  borderLeft: "6px solid #dc3545",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px"
                }}>
                  <h5 style={{ color: "#721c24", marginBottom: "8px" }}>
                    Request Rejected
                  </h5>
                  <p style={{ margin: 0, color: "#721c24" }}>
                    <strong>Reason:</strong> {exhibition.rejectComment || "No reason provided."}
                  </p>
                </div>
              )}
              <form>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      className="form-control"
                      placeholder="Enter Exhibition Title"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      className="form-control show-tick"
                      disabled
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
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
                {formData.type !== "Virtual" && (
                  <div className="form-group">
                    <label>Event Location</label>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.address"
                          value={formData.eventLocation.address}
                          className="form-control"
                          placeholder="Address"
                          disabled
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.city"
                          value={formData.eventLocation.city}
                          className="form-control"
                          placeholder="City"
                          disabled
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.state"
                          value={formData.eventLocation.state}
                          className="form-control"
                          placeholder="State"
                          disabled
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.country"
                          value={formData.eventLocation.country}
                          className="form-control"
                          placeholder="Country"
                          disabled
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="text"
                          name="eventLocation.pin"
                          value={formData.eventLocation.pin}
                          className="form-control"
                          placeholder="Pin Code"
                          disabled
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <input
                          type="url"
                          name="eventLocation.googleMapUrl"
                          value={formData.eventLocation.googleMapUrl}
                          className="form-control"
                          placeholder="Google Map URL"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="eventUrl">Event URL</label>
                    <input
                      type="url"
                      id="eventUrl"
                      name="eventUrl"
                      value={formData.eventUrl}
                      className="form-control"
                      placeholder="Enter event URL"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="dailyTiming">Daily Timing</label>
                    <input
                      type="text"
                      id="dailyTiming"
                      name="dailyTiming"
                      value={formData.dailyTiming}
                      className="form-control"
                      placeholder="e.g., 10:00 AM - 6:00 PM"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="entryType">Entry Type</label>
                    <select
                      id="entryType"
                      name="entryType"
                      value={formData.entryType}
                      className="form-control show-tick"
                      disabled
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
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <input
                      type="text"
                      id="ticketPrice"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      className="form-control"
                      placeholder="Enter ticket price (e.g., ₹500)"
                      disabled
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="language">Language</label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={formData.language}
                      className="form-control"
                      placeholder="e.g., English, Hindi"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="hostedBy">Hosted By</label>
                    <input
                      type="text"
                      id="hostedBy"
                      name="hostedBy"
                      value={formData.hostedBy}
                      className="form-control"
                      placeholder="Enter host name or organization"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="coverBanner">Cover Banner</label>
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
                    <label htmlFor="logo">Logo</label>
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
                  <label>Contact Details</label>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.fullName"
                        value={formData.contactDetails.fullName}
                        className="form-control"
                        placeholder="Full Name"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="tel"
                        name="contactDetails.mobileNo"
                        value={formData.contactDetails.mobileNo}
                        className="form-control"
                        placeholder="Mobile Number"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="email"
                        name="contactDetails.email"
                        value={formData.contactDetails.email}
                        className="form-control"
                        placeholder="Email Address"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.address"
                        value={formData.contactDetails.address}
                        className="form-control"
                        placeholder="Address"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.city"
                        value={formData.contactDetails.city}
                        className="form-control"
                        placeholder="City"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.state"
                        value={formData.contactDetails.state}
                        className="form-control"
                        placeholder="State"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.country"
                        value={formData.contactDetails.country}
                        className="form-control"
                        placeholder="Country"
                        disabled
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="contactDetails.pin"
                        value={formData.contactDetails.pin}
                        className="form-control"
                        placeholder="Pin Code"
                        disabled
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
                      className="form-control"
                      placeholder="Enter guest speaker or celebrity name"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="maxCapacity">Maximum Capacity</label>
                    <input
                      type="number"
                      id="maxCapacity"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      className="form-control"
                      placeholder="Enter maximum capacity"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 form-group">
                    <label htmlFor="liveBidding">Live Bidding Event</label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="liveBidding"
                        name="liveBidding"
                        checked={formData.liveBidding}
                        disabled
                      />
                      <label className="custom-control-label" htmlFor="liveBidding">
                        {formData.liveBidding ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="certificateDistribution">Certificate Distribution</label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="certificateDistribution"
                        name="certificateDistribution"
                        checked={formData.certificateDistribution}
                        disabled
                      />
                      <label className="custom-control-label" htmlFor="certificateDistribution">
                        {formData.certificateDistribution ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="awardDistribution">Award Distribution</label>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="awardDistribution"
                        name="awardDistribution"
                        checked={formData.awardDistribution}
                        disabled
                      />
                      <label className="custom-control-label" htmlFor="awardDistribution">
                        {formData.awardDistribution ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <label htmlFor="eventPromotion">Event Promotion/Invite</label>
                    <select
                      id="eventPromotion"
                      name="eventPromotion"
                      value={formData.eventPromotion}
                      className="form-control show-tick"
                      disabled
                    >
                      <option value="">Select Promotion Type</option>
                      {eventPromotionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExhibition;