import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditInsuranceSettingModal = ({
  isOpen,
  onClose,
  insuranceSetting,
  fetchInsuranceSettingData,
}) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
  });
  const [formData, setFormData] = useState({
    mainCategoryId: "",
    insuranceName: "",
    oneYear: { percentage: "", gst: "" },
    lifeTime: { percentage: "", gst: "" },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await getAPI("/api/sub-category", {}, true);
        const categoryItems = response.data.data;
        if (categoryItems && categoryItems.length > 0) {
          const mainCategoriesMap = new Map();

          categoryItems.forEach((item) => {
            if (item.mainCategoryId && !mainCategoriesMap.has(item.mainCategoryId)) {
              mainCategoriesMap.set(item.mainCategoryId, {
                value: item.mainCategoryId,
                label: item.mainCategoryName,
              });
            }
          });

          setCategoryData({
            mainCategories: Array.from(mainCategoriesMap.values()),
          });
        } else {
          toast.warn("No main categories found.");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load category data.");
      }
    };
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (insuranceSetting) {
      setFormData({
        mainCategoryId: insuranceSetting.mainCategoryId?._id || insuranceSetting.mainCategoryId || "",
        insuranceName: insuranceSetting.insuranceName || "",
        oneYear: {
          percentage: insuranceSetting.oneYear?.percentage !== undefined ? insuranceSetting.oneYear.percentage : "",
          gst: insuranceSetting.oneYear?.gst !== undefined ? insuranceSetting.oneYear.gst : "",
        },
        lifeTime: {
          percentage: insuranceSetting.lifeTime?.percentage !== undefined ? insuranceSetting.lifeTime.percentage : "",
          gst: insuranceSetting.lifeTime?.gst !== undefined ? insuranceSetting.lifeTime.gst : "",
        },
      });
    }
  }, [insuranceSetting]);

  const handleInputChange = (field, value, option = null) => {
    if (option) {
      setFormData((prev) => ({
        ...prev,
        [option]: {
          ...prev[option],
          [field]: value === "" ? "" : parseFloat(Number(value).toFixed(2)),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { mainCategoryId, insuranceName, oneYear, lifeTime } = formData;
      if (!mainCategoryId || !insuranceName) {
        toast.error("Please fill in all category and insurance name fields.");
        setLoading(false);
        return;
      }
      const options = { oneYear, lifeTime };
      for (const [opt, optionObj] of Object.entries(options)) {
        if (
          isNaN(optionObj.percentage) ||
          Number(optionObj.percentage) < 0 ||
          isNaN(optionObj.gst) ||
          Number(optionObj.gst) < 0
        ) {
          toast.error(`Please enter valid non-negative numbers for ${opt === "oneYear" ? "1 Year" : "Life Time"} percentage and GST.`);
          setLoading(false);
          return;
        }
      }

      const response = await putAPI(
        `/api/update-insurance-setting/${insuranceSetting._id}`,
        {
          mainCategoryId,
          insuranceName,
          oneYear: {
            percentage: Number(oneYear.percentage),
            gst: Number(oneYear.gst),
          },
          lifeTime: {
            percentage: Number(lifeTime.percentage),
            gst: Number(lifeTime.gst),
          },
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Insurance setting updated successfully!");
        await fetchInsuranceSettingData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update insurance setting.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      mainCategoryId: "",
      insuranceName: "",
      oneYear: { percentage: "", gst: "" },
      lifeTime: { percentage: "", gst: "" },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Insurance Setting</h5>
            <button
              type="button"
              className="close"
              onClick={handleClose}
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Main Category</label>
                  <select
                    className="form-control"
                    value={formData.mainCategoryId}
                    onChange={(e) => handleInputChange("mainCategoryId", e.target.value)}
                    required
                  >
                    <option value="">Select Main Category</option>
                    {categoryData.mainCategories.map((mainCategory) => (
                      <option key={mainCategory.value} value={mainCategory.value}>
                        {mainCategory.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Insurance Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.insuranceName}
                    onChange={(e) => handleInputChange("insuranceName", e.target.value)}
                    disabled={!formData.mainCategoryId}
                    placeholder={formData.mainCategoryId ? "Enter Insurance Name" : ""}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Insurance Option</th>
                      <th scope="col">Percentage</th>
                      <th scope="col">GST (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["oneYear", "lifeTime"].map((option) => (
                      <tr key={option}>
                        <td>{option === "oneYear" ? "1 Year" : "Life Time"}</td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData[option].percentage}
                            onChange={(e) => handleInputChange("percentage", e.target.value, option)}
                            disabled={!formData.mainCategoryId || !formData.insuranceName}
                            placeholder={formData.mainCategoryId && formData.insuranceName ? "Percentage" : ""}
                            min="0"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData[option].gst}
                            onChange={(e) => handleInputChange("gst", e.target.value, option)}
                            disabled={!formData.mainCategoryId || !formData.insuranceName}
                            placeholder={formData.mainCategoryId && formData.insuranceName ? "GST (%)" : ""}
                            min="0"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInsuranceSettingModal;