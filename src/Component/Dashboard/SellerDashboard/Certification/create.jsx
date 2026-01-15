import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";

function CreateCertification() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: localStorage.getItem("userType") || "Seller",
    userId: localStorage.getItem("userId") || "",
    productId: "",
    mainCategories: [],
    certifications: [],
    certificationProvider: "",
  });
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const certificationProviderOptions = [
    { value: "inhouse", label: "In-house Certification" },
    { value: "thirdparty", label: "Third Party Certification" },
  ];

  useEffect(() => {
    if (formData.userId) {
      const fetchProducts = async () => {
        try {
          const response = await getAPI(`/api/products-by-user?userId=${formData.userId}`, {}, true);
          if (!response.hasError) {
            setProducts(response.data.data);
            setFormData((prev) => ({ ...prev, productId: "", mainCategories: [], certifications: [] }));
            const categories = [...new Set(response.data.data.map((product) => product.mainCategory._id))];
            setMainCategories(categories);
          } else {
            toast.error(`Failed to fetch products: ${response.message}`);
          }
        } catch (error) {
          toast.error("An error occurred while fetching products.");
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
      setMainCategories([]);
      setFormData((prev) => ({ ...prev, productId: "", mainCategories: [], certifications: [] }));
    }
  }, [formData.userId]);

  useEffect(() => {
    if (formData.mainCategories.length > 0) {
      const fetchCertifications = async () => {
        try {
          const response = await getAPI(`/api/get-certification-setting`, {}, true);
          if (!response.hasError && Array.isArray(response.data.data)) {
            const filteredCertifications = response.data.data.filter((cert) =>
              formData.mainCategories.includes(cert.mainCategoryId?._id)
            );
            setCertifications(filteredCertifications);
            if (filteredCertifications.length === 0) {
              toast.warn("No certifications available for the selected product's category.");
            }
          } else {
            toast.error("Failed to fetch certifications.");
          }
        } catch (error) {
          toast.error("An error occurred while fetching certifications.");
        }
      };
      fetchCertifications();
    } else {
      setCertifications([]);
      setFormData((prev) => ({ ...prev, certifications: [] }));
    }
  }, [formData.mainCategories]);

  const handleChange = (name, value) => {
    if (name === "certifications") {
      setFormData((prev) => ({ ...prev, [name]: value ? value.map((option) => option.value) : [] }));
    } else if (name === "productId") {
      const selectedProduct = products.find((product) => product._id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        mainCategories: selectedProduct ? [selectedProduct.mainCategory._id] : [],
        certifications: [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.productId) {
        toast.error("Please select a product.");
        setLoading(false);
        return;
      }
      if (formData.certifications.length === 0) {
        toast.error("Please select at least one certification.");
        setLoading(false);
        return;
      }
      if (!formData.certificationProvider) {
        toast.error("Please select a certification provider.");
        setLoading(false);
        return;
      }

      const submissionData = formData.certifications.map((certId) => {
        const cert = certifications.find((c) => c._id === certId);
        return {
          userType: formData.userType,
          userId: formData.userId,
          productId: formData.productId,
          mainCategoryId: formData.mainCategories[0],
          certificationId: certId,
          certificationProvider: formData.certificationProvider,
          estimatedDays: cert ? cert.estimatedDays : 0,
          certificationPrice: 99,
        };
      });

      const response = await postAPI("/api/create-certification", submissionData, {}, true);
      if (!response.hasError) {
        toast.success("Certification(s) created successfully!");
        setFormData({
          userType: localStorage.getItem("userType") || "Seller",
          userId: localStorage.getItem("userId") || "",
          productId: "",
          mainCategories: [],
          certifications: [],
          certificationProvider: "",
        });
        navigate("/seller/certification");
      } else {
        toast.error(`Failed to create certifications: ${response.message}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the certifications.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((product) => product._id === formData.productId);

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.productName,
  }));

  const certificationOptions = certifications.map((cert) => ({
    value: cert._id,
    label: `${cert.certificationName} (₹99)`,
  }));

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Certification</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <a href="/seller/certification">Certification</a>
              </li>
              <li className="breadcrumb-item">Create Certification</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="productId">Product</label>
                  <Select
                    id="productId"
                    name="productId"
                    options={productOptions}
                    value={productOptions.find((option) => option.value === formData.productId) || null}
                    onChange={(option) => handleChange("productId", option ? option.value : "")}
                    placeholder="Select Product"
                    isClearable
                  />
                </div>
                {selectedProduct && (
                  <div className="form-group">
                    <label>Product Details</label>
                    <div className="d-flex align-items-center">
                      <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedProduct.mainImage}`}
                        alt={selectedProduct.productName}
                        className="img-thumbnail mr-3"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                      <div>
                        <p><strong>Product Name:</strong> {selectedProduct.productName}</p>
                        <p>
                          <strong>Main Category:</strong>{" "}
                          {selectedProduct.mainCategory?.mainCategoryName || selectedProduct.mainCategory?._id || "Unknown"}
                        </p>
                        <p><strong>Product Type:</strong> {selectedProduct.productType}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="certifications">Certifications (Price: ₹99 each)</label>
                  <Select
                    id="certifications"
                    name="certifications"
                    options={certificationOptions}
                    value={certificationOptions.filter((option) => formData.certifications.includes(option.value))}
                    onChange={(options) => handleChange("certifications", options)}
                    placeholder="Select Certifications"
                    isMulti
                    isDisabled={formData.mainCategories.length === 0 || certifications.length === 0}
                  />
                  <small className="form-text text-muted">
                    Select one or more certifications
                  </small>
                </div>
                {formData.certifications.length > 0 && (
                  <div className="form-group">
                    <label>Selected Certifications</label>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Certification Name</th>
                          <th>Estimated Days</th>
                          <th>Price (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.certifications.map((certId) => {
                          const cert = certifications.find((c) => c._id === certId);
                          return cert ? (
                            <tr key={cert._id}>
                              <td>{cert.certificationName}</td>
                              <td>{cert.estimatedDays}</td>
                              <td>₹99</td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                    <p><strong>Estimated Delivery:</strong> {Math.max(...formData.certifications.map((certId) => {
                      const cert = certifications.find((c) => c._id === certId);
                      return cert ? cert.estimatedDays : 0;
                    }))} days</p>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="certificationProvider">Certification Provider</label>
                  <Select
                    id="certificationProvider"
                    name="certificationProvider"
                    options={certificationProviderOptions}
                    value={certificationProviderOptions.find((option) => option.value === formData.certificationProvider) || null}
                    onChange={(option) => handleChange("certificationProvider", option ? option.value : "")}
                    placeholder="Select Certification Provider"
                    isClearable
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-3"
                  disabled={loading}
                >
                  {loading ? "Creating Certification..." : "Create Certification"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCertification;