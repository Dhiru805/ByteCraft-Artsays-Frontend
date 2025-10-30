import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";

const CreatePassType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    validityPeriod: "",
    productUploadLimit: "",
    basePriceRange: "",
    bidVisibility: "Public",
    biddingAnalytics: "None",
    addonAccess: [],
    supportPriority: "Standard",
    refundPolicy: "No refunds",
    earlyRenewalBonus: "",
    customBidTimeControl: "",
    exclusiveAuctionsAccess: false,
    dashboardFeatures: "",
    pricing: "",
    productUploadInfinite: false,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAPI(`/api/bidding/passes/${id}`, {}, true).then((res) => {
        if (res && res.data && res.data.data) {
          const pass = res.data.data;
          setFormData({
            name: pass.name || "",
            validityPeriod: pass.validityPeriod ? String(pass.validityPeriod) : "",
            productUploadLimit: pass.productUploadLimit === 'Infinite' ? '' : (pass.productUploadLimit ? String(pass.productUploadLimit) : ''),
            basePriceRange: pass.basePriceRange || "",
            bidVisibility: pass.bidVisibility || "Public",
            biddingAnalytics: pass.biddingAnalytics || "None",
            addonAccess: Array.isArray(pass.addonAccess) ? pass.addonAccess : [],
            supportPriority: pass.supportPriority || "Standard",
            refundPolicy: pass.refundPolicy || "No refunds",
            earlyRenewalBonus: pass.earlyRenewalBonus || "",
            customBidTimeControl: pass.customBidTimeControl || "",
            exclusiveAuctionsAccess: !!pass.exclusiveAuctionsAccess,
            dashboardFeatures: pass.dashboardFeatures || "",
            pricing: pass.pricing ? String(pass.pricing) : "",
            productUploadInfinite: pass.productUploadLimit === 'Infinite',
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "exclusiveAuctionsAccess") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "checkbox") {
      const addon = value;
      setFormData((prev) => {
        const exists = prev.addonAccess.includes(addon);
        return {
          ...prev,
          addonAccess: exists
            ? prev.addonAccess.filter((a) => a !== addon)
            : [...prev.addonAccess, addon],
        };
      });
    } else if (name === "productUploadLimit") {
      // already numeric
      const digits = String(value).replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, productUploadLimit: digits }));
    } else if (name === "basePriceRange") {
      const sanitized = String(value).replace(/[^0-9\-]/g, "");
      setFormData((prev) => ({ ...prev, basePriceRange: sanitized }));
    } else if (name === "validityPeriod") {
      const digits = String(value).replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, validityPeriod: digits }));
    } else if (name === "pricing") {
      const digits = String(value).replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, pricing: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const extractNumeric = (val) => {
    if (val == null) return null;
    if (typeof val === "number") return val;
    const m = String(val).match(/[0-9]+(?:\.[0-9]+)?/);
    return m ? parseFloat(m[0]) : null;
  };

  const validate = () => {
    const errs = [];
    if (!formData.name.trim()) errs.push("Pass Name is required");
    if (!formData.validityPeriod.trim())
      errs.push("Validity Period is required");
    else if (!/^\d+$/.test(formData.validityPeriod.trim())) errs.push('Validity Period must be a number');
    if (!formData.productUploadInfinite && !formData.productUploadLimit.trim())
      errs.push("Product Upload Limit is required");
    if (
      !formData.productUploadInfinite &&
      !/^\d+$/.test(formData.productUploadLimit)
    )
      errs.push("Product Upload Limit must be a number");
    if (!formData.basePriceRange.trim())
      errs.push("Base Price Range Allowed is required");
    else if (!/^\d+\s*-\s*\d+$/.test(formData.basePriceRange))
      errs.push("Base Price Range must be in the format min-max");
    if (!String(formData.bidVisibility).trim())
      errs.push("Bid Visibility is required");
    if (!String(formData.biddingAnalytics).trim())
      errs.push("Bidding Analytics Access is required");
    if (!String(formData.supportPriority).trim())
      errs.push("Support Priority is required");
    if (!formData.refundPolicy.trim())
      errs.push("Refund / Cancellation is required");
    if (!formData.earlyRenewalBonus.trim())
      errs.push("Early Renewal Bonus is required");
    else if (
      !/^\+?\d+\s*(day|days|month|months|year|years)$/i.test(
        formData.earlyRenewalBonus.trim()
      )
    )
      errs.push('Early Renewal Bonus must be like "+5 days"');
    if (!formData.customBidTimeControl.trim())
      errs.push("Custom Bid Time Control is required");
    if (!formData.dashboardFeatures.trim())
      errs.push("Dashboard Features is required");
    const priceNum = extractNumeric(formData.pricing);
    if (priceNum == null) errs.push("Pricing must include a numeric value");
    return errs;
  };

  const createPassType = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }
    try {
      if (id) {
        // EDIT MODE
        const res = await putAPI(`/api/bidding/passes/${id}`, formData, {}, true);
        if (!res?.hasError) {
          toast.success("Pass updated");
          navigate("/super-admin/bidding/pass-table");
        } else {
          toast.error(res?.message || "Failed to update pass");
        }
      } else {
        // CREATE MODE
        const res = await postAPI("/api/bidding/passes", formData, {}, true);
        if (!res?.hasError) {
          toast.success("Pass created");
          navigate("/super-admin/bidding/pass-table");
        } else {
          toast.error(res?.message || "Failed to create pass");
        }
      }
    } catch (e) {
      toast.error("Failed to save pass");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>{id ? "Edit Pass" : "Create Bidding Pass"}</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li
                className="breadcrumb-item"
                onClick={() => navigate("/super-admin/bidding/pass-table")}
                style={{ cursor: "pointer" }}
              >
                Bidding Pass
              </li>
              <li className="breadcrumb-item">Create</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix mt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <h5>Pass Details</h5>
            </div>
            <div className="body">
              <form onSubmit={createPassType}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>
                      Pass Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>
                      Validity Period <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="validityPeriod"
                      value={formData.validityPeriod}
                      onChange={handleFormChange}
                      placeholder="Number of days"
                      required
                      inputMode="numeric"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      Product Upload Limit (for Bidding){" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        className="form-control"
                        name="productUploadLimit"
                        value={formData.productUploadLimit}
                        onChange={handleFormChange}
                        disabled={formData.productUploadInfinite}
                        required={!formData.productUploadInfinite}
                        inputMode="numeric"
                        pattern="\d+"
                      />
                      <div className="ml-3 d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="uploadInfinite"
                          name="productUploadInfinite"
                          checked={formData.productUploadInfinite}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              productUploadInfinite: checked,
                              productUploadLimit: checked ? "Infinite" : "",
                            }));
                          }}
                        />
                        <label className="ml-1 mb-0" htmlFor="uploadInfinite">
                          Infinite
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>
                      Base Price Range Allowed{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="basePriceRange"
                      value={formData.basePriceRange}
                      onChange={handleFormChange}
                      placeholder="e.g., 1000-5000"
                      required
                      pattern="^\d+\s*-\s*\d+$"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>
                      Bid Visibility <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="bidVisibility"
                      value={formData.bidVisibility}
                      onChange={handleFormChange}
                      required
                    >
                      <option>Public</option>
                      <option>Private</option>
                      <option>Premium Only</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>
                      Bidding Analytics Access{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="biddingAnalytics"
                      value={formData.biddingAnalytics}
                      onChange={handleFormChange}
                      required
                    >
                      <option>None</option>
                      <option>Basic</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Add-on Purchase Access</label>
                    <div className="d-flex align-items-center">
                      <div className="mr-3">
                        <input
                          type="checkbox"
                          id="addonFeatured"
                          value="Featured Ads"
                          checked={formData.addonAccess.includes(
                            "Featured Ads"
                          )}
                          onChange={handleFormChange}
                        />
                        <label className="ml-1" htmlFor="addonFeatured">
                          Featured Ads
                        </label>
                      </div>
                      <div className="mr-3">
                        <input
                          type="checkbox"
                          id="addonBoost"
                          value="Boost"
                          checked={formData.addonAccess.includes("Boost")}
                          onChange={handleFormChange}
                        />
                        <label className="ml-1" htmlFor="addonBoost">
                          Boost
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      Support Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="supportPriority"
                      value={formData.supportPriority}
                      onChange={handleFormChange}
                      required
                    >
                      <option>Standard</option>
                      <option>Priority</option>
                      <option>24x7</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>
                      Refund / Cancellation{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="refundPolicy"
                      value={formData.refundPolicy}
                      onChange={handleFormChange}
                      placeholder="e.g., Refund within 7 days"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      Early Renewal Bonus <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="earlyRenewalBonus"
                      value={formData.earlyRenewalBonus}
                      onChange={handleFormChange}
                      placeholder="+5 days"
                      required
                      pattern="^\+?\d+\s*(day|days|month|months|year|years)$"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>
                      Custom Bid Time Control{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="customBidTimeControl"
                      value={formData.customBidTimeControl}
                      onChange={handleFormChange}
                      placeholder="e.g., set min/max bid time"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="exclusiveAuctionsAccess"
                      name="exclusiveAuctionsAccess"
                      checked={formData.exclusiveAuctionsAccess}
                      onChange={handleFormChange}
                    />
                    <label
                      className="ml-2 mb-0"
                      htmlFor="exclusiveAuctionsAccess"
                    >
                      Access to “Exclusive Auctions” (Premium Events)
                    </label>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>
                      Dashboard Features <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="dashboardFeatures"
                      value={formData.dashboardFeatures}
                      onChange={handleFormChange}
                      placeholder="e.g., advanced insights, alerts"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      Pricing <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleFormChange}
                      placeholder="Amount in ₹ (INR)"
                      required
                      pattern="\d+"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/super-admin/bidding/pass-table")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Pass
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePassType;
