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
    userType: "",
    userId: "",
    productId: "",
    mainCategories: [],
    certifications: [],
    certificationProvider: "",
    payOrFree: "pay",
  });

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: "Artist", label: "Artist" },
    { value: "Seller", label: "Seller" },
  ];

  const certificationProviderOptions = [
    { value: "inhouse", label: "In-house Certification" },
    { value: "thirdparty", label: "Third Party Certification" },
  ];

  const payOrFreeOptions = [
    { value: "pay", label: "Paid Certification" },
    { value: "free", label: "Free Certification" },
  ];

  useEffect(() => {
    if (!formData.userType) {
      setUsers([]);
      resetDependentFields();
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await getAPI(
          `/api/users-by-type?userType=${formData.userType}`,
          {},
          true
        );

        if (!res.hasError) {
          const userList = res.data?.data || [];
          setUsers(userList);

          if (userList.length === 1 && !formData.userId) {
            setFormData((prev) => ({
              ...prev,
              userId: userList[0]._id,
            }));
          }
        } else {
          toast.error(res.message || "Failed to load users");
        }
      } catch (err) {
        toast.error("Error while loading users");
      }
    };

    fetchUsers();
  }, [formData.userType]);

  useEffect(() => {
    if (!formData.userId) {
      setProducts([]);
      resetDependentFields();
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await getAPI(
          `/api/products-by-user?userId=${formData.userId}`,
          {},
          true
        );

        if (!res.hasError) {
          setProducts(res.data?.data || []);
        } else {
          toast.error(res.message || "Failed to load products");
        }
      } catch (err) {
        toast.error("Error while loading products");
      }
    };

    fetchProducts();
  }, [formData.userId]);

  useEffect(() => {
    if (formData.mainCategories.length === 0) {
      setCertifications([]);
      setFormData((prev) => ({ ...prev, certifications: [] }));
      return;
    }

    const fetchCertifications = async () => {
      try {
        const res = await getAPI("/api/get-certification-setting", {}, true);

        if (!res.hasError && Array.isArray(res.data?.data)) {
          const filtered = res.data.data.filter((cert) =>
            formData.mainCategories.includes(cert.mainCategoryId?._id)
          );
          setCertifications(filtered);
        } else {
          toast.error("Failed to load certification settings");
        }
      } catch (err) {
        toast.error("Error loading certifications");
      }
    };

    fetchCertifications();
  }, [formData.mainCategories]);

  const resetDependentFields = () => {
    setFormData((prev) => ({
      ...prev,
      userId: "",
      productId: "",
      mainCategories: [],
      certifications: [],
    }));
    setProducts([]);
    setCertifications([]);
  };

  const handleChange = (name, value) => {
    if (name === "certifications") {
      setFormData((prev) => ({
        ...prev,
        certifications: value ? value.map((opt) => opt.value) : [],
      }));
    } else if (name === "productId") {
      const selected = products.find((p) => p._id === value);
      setFormData((prev) => ({
        ...prev,
        productId: value || "",
        mainCategories: selected
          ? [selected.mainCategory?._id].filter(Boolean)
          : [],
        certifications: [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.userType) return toast.error("Please select type");
      if (!formData.userId) return toast.error("Please select user");
      if (!formData.productId) return toast.error("Please select product");
      if (formData.certifications.length === 0)
        return toast.error("Please select at least one certification");
      if (!formData.certificationProvider)
        return toast.error("Please select certification provider");
      if (!formData.payOrFree) return toast.error("Please select payment type");

      const payload = formData.certifications.map((certId) => {
        const cert = certifications.find((c) => c._id === certId);
        return {
          userType: formData.userType,
          userId: formData.userId,
          productId: formData.productId,
          mainCategoryId: formData.mainCategories[0],
          certificationId: certId,
          certificationProvider: formData.certificationProvider,
          estimatedDays: cert?.estimatedDays || 7,
          certificationPrice:
            formData.payOrFree === "free" ? 0 : cert?.price || 99,
          payOrFree: formData.payOrFree,
        };
      });

      const response = await postAPI("/api/create-certification-superadmin", payload, {}, true);

      if (!response.hasError) {
        const result = response.data?.data;

        if (formData.payOrFree === "free") {
          toast.success("Free certification(s) created successfully!");
          navigate("/super-admin/certification");
        } else if (result?.paymentUrl) {
          toast.info("Payment Link sent on mail");
             navigate("/super-admin/certification");
        } else {
          toast.success("Certification request created successfully");
          navigate("/super-admin/certification");
        }

        setFormData({
          userType: "",
          userId: "",
          productId: "",
          mainCategories: [],
          certifications: [],
          certificationProvider: "",
          payOrFree: "pay",
        });
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.productId);

  const userOptions = users.map((u) => ({
    value: u._id,
    label:
      `${u.name || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown user",
  }));

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.productName || "Unnamed product",
  }));

  const certificationOptions = certifications.map((c) => ({
    value: c._id,
    label: `${c.certificationName} — ₹${c.price || 99}`,
  }));

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Certification</h2>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                {}
                <div className="form-group mb-3">
                  <label className="form-label">Type *</label>
                  <Select
                    options={typeOptions}
                    value={
                      typeOptions.find((o) => o.value === formData.userType) ||
                      null
                    }
                    onChange={(opt) => handleChange("userType", opt?.value)}
                    placeholder="Select type"
                    isClearable
                  />
                </div>

                {}
                <div className="form-group mb-3">
                  <label className="form-label">User *</label>
                  <Select
                    options={userOptions}
                    value={
                      userOptions.find((o) => o.value === formData.userId) ||
                      null
                    }
                    onChange={(opt) => handleChange("userId", opt?.value)}
                    placeholder="Select user"
                    isDisabled={!formData.userType || users.length === 0}
                    isClearable
                  />

                  {formData.userType && users.length > 0 && (
                    <small className="form-text text-muted mt-1">
                      {users.length === 1
                        ? "Only 1 user found – auto selected"
                        : `${users.length} ${formData.userType.toLowerCase()}${
                            users.length > 1 ? "s" : ""
                          } available`}
                    </small>
                  )}
                </div>

                {}
                <div className="form-group mb-3">
                  <label className="form-label">Product *</label>
                  <Select
                    options={productOptions}
                    value={
                      productOptions.find(
                        (o) => o.value === formData.productId
                      ) || null
                    }
                    onChange={(opt) => handleChange("productId", opt?.value)}
                    placeholder="Select product"
                    isDisabled={!formData.userId}
                    isClearable
                  />
                </div>

                {}
                {selectedProduct && (
                  <div className="form-group mb-4">
                    <label className="form-label">Selected Product</label>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      {selectedProduct.mainImage && (
                        <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedProduct.mainImage}`}
                          alt={selectedProduct.productName}
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <div>
                        <div className="fw-bold">
                          {selectedProduct.productName}
                        </div>
                        <small className="text-muted">
                          {selectedProduct.mainCategory?.mainCategoryName ||
                            "—"}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {}
                <div className="form-group mb-3">
                  <label className="form-label">Certifications *</label>
                  <Select
                    isMulti
                    options={certificationOptions}
                    value={certificationOptions.filter((o) =>
                      formData.certifications.includes(o.value)
                    )}
                    onChange={(opts) => handleChange("certifications", opts)}
                    placeholder="Select certifications..."
                    isDisabled={certifications.length === 0}
                  />
                </div>

                {}
                <div className="form-group mb-3">
                  <label className="form-label">Provider *</label>
                  <Select
                    options={certificationProviderOptions}
                    value={
                      certificationProviderOptions.find(
                        (o) => o.value === formData.certificationProvider
                      ) || null
                    }
                    onChange={(opt) =>
                      handleChange("certificationProvider", opt?.value)
                    }
                    placeholder="Select provider"
                    isClearable
                  />
                </div>

                {}
                <div className="form-group mb-4">
                  <label className="form-label">Certification Type *</label>
                  <Select
                    options={payOrFreeOptions}
                    value={
                      payOrFreeOptions.find(
                        (o) => o.value === formData.payOrFree
                      ) || null
                    }
                    onChange={(opt) => handleChange("payOrFree", opt?.value)}
                    placeholder="Choose type"
                  />
                  <small className="form-text text-muted">
                    Free → instant creation • Paid → payment gateway
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mt-3"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : formData.payOrFree === "free"
                    ? "Create Free Certification"
                    : "Proceed to Payment"}
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
