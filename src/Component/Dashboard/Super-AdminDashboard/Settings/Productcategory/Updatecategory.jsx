import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSubCategoryModal = ({
  isOpen,
  onClose,
  subCategory,
  fetchSubCategoryData
}) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subCategoryName: "",
    categoryId: "",
    mainCategoryId: "",
    commission: "",
  });


  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true);
        if (!response.hasError) {
          setMainCategories(response.data.data);
        } else {
          toast.error(`Failed to fetch Main Categories: ${response.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while fetching main categories.");
      }
    };
    fetchMainCategories();
  }, []);


  const handleMainCategoryChange = async (e) => {
    const selectedMainCategoryId = e.target.value;
    setMainCategoryId(selectedMainCategoryId);
    setCategoryId("");
    setCategories([]);

    if (selectedMainCategoryId) {
      try {
        const response = await getAPI(
          `/api/category/${selectedMainCategoryId}`,
          {},
          true
        );
        if (!response.hasError && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          toast.error("Failed to load categories.");
        }
      } catch (err) {
        toast.error("Error fetching categories.");
      }
    }
  };


  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };


  useEffect(() => {
    if (subCategory) {
      setFormData({
        subCategoryName: subCategory.subCategoryName || "",
        commission: subCategory.commissionTerm || "",
      });
      setMainCategoryId(subCategory.mainCategoryId || "");
      setCategoryId(subCategory.categoryId || "");


      const fetchCategoriesForMainCategory = async () => {
        try {
          const response = await getAPI(
            `/api/category/${subCategory.mainCategoryId}`,
            {},
            true
          );
          if (!response.hasError && Array.isArray(response.data.data)) {
            setCategories(response.data.data);
          } else {
            toast.error("Failed to load categories.");
          }
        } catch (err) {
          toast.error("Error fetching categories.");
        }
      };

      fetchCategoriesForMainCategory();
    }
  }, [subCategory]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await putAPI(
        `/api/sub-category/${subCategory.id}`,
        {
          subCategoryName: formData.subCategoryName,
          categoryId,
          mainCategoryId,
          commissionTerm: Number(formData.commission),
        },
        {},
        true
      );

      if (!response.data.hasError) {
        toast.success("Sub Category updated successfully!");
        await fetchSubCategoryData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update SubCategory.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Subcategory</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              &#x2715;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              <div className="row mb-2 ml-2">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Main Category</label>
                    <select
                      className="form-control"
                      value={mainCategoryId}
                      onChange={handleMainCategoryChange}
                      required
                    >
                      <option value="">Select Main Category</option>
                      {mainCategories.map((mainCategory) => (
                        <option key={mainCategory._id} value={mainCategory._id}>
                          {mainCategory.mainCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={categoryId}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Sub Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subCategoryName"
                      value={formData.subCategoryName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">Commission (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="commission"
                      value={formData.commission}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter commission"
                    />
                  </div>
                </div>
              </div>


              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditSubCategoryModal;