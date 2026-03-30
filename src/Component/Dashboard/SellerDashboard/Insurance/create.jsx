import React, { useState, useEffect, useMemo } from "react";
import { getImageUrl } from '../../../../utils/getImageUrl';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";

function CreateInsurance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: localStorage.getItem("userType") || "Seller",
    userId: localStorage.getItem("userId") || "",
    productId: "",
    mainCategories: [],
    insurance: "",
    insuranceProvider: "",
     insuranceName:"",
  });

  const [products, setProducts] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const insuranceProviderOptions = [
    { value: "inhouse", label: "In-house Insurance" },
    { value: "thirdparty", label: "Third Party Insurance" },
  ];

  useEffect(() => {
    if (formData.userId) {
      const fetchProducts = async () => {
        try {
          const response = await getAPI(
            `/api/products-by-user?userId=${formData.userId}`,
            {},
            true
          );
          if (!response.hasError) {
            setProducts(response.data.data);
            setFormData((prev) => ({
              ...prev,
              productId: "",
              mainCategories: [],
              insurance: "",
            }));
          } else {
            toast.error(`Failed to fetch products: ${response.message}`);
          }
        } catch (error) {
          toast.error("Error fetching products.");
        }
      };
      fetchProducts();
    }
  }, [formData.userId]);

  useEffect(() => {
    if (formData.mainCategories.length > 0) {
      const fetchInsurances = async () => {
        try {
          const response = await getAPI(
            "/api/get-insurance-settings",
            {},
            true
          );

          if (!response.hasError && Array.isArray(response.data.data)) {
            const filtered = response.data.data.filter((setting) =>
              formData.mainCategories.includes(setting.mainCategoryId?._id)
            );

            const options = filtered.flatMap((setting) => {
              const baseName = setting.insuranceName || "Insurance Plan";
              const opts = [];

              if (setting.oneYear) {
                opts.push({
                  _id: `${setting._id} - Yearly`,
                  name: `${baseName} - Yearly`,
                  duration: "Yearly",
                  percentage: setting.oneYear.percentage,
                  gst: setting.oneYear.gst,
                });
              }

              if (setting.lifeTime) {
                opts.push({
                  _id: `${setting._id} - Lifetime`,
                  name: `${baseName} - Lifetime`,
                  duration: "Lifetime",
                  percentage: setting.lifeTime.percentage,
                  gst: setting.lifeTime.gst,
                });
              }

              return opts;
            });

            setInsurances(options);

            if (options.length === 0) {
              toast.warn("No insurance options available for this category.");
            }
          }
        } catch (error) {
          toast.error("Error loading insurance plans.");
        }
      };
      fetchInsurances();
    } else {
      setInsurances([]);
      setFormData((prev) => ({ ...prev, insurance: "" }));
    }
  }, [formData.mainCategories]);

  useEffect(() => {
    const prod = products.find((p) => p._id === formData.productId);
    setSelectedProduct(prod || null);

    if (prod) {
      setFormData((prev) => ({
        ...prev,
        mainCategories: [prod.mainCategory._id],
        insurance: "",
      }));
    }
  }, [formData.productId, products]);

  const handleChange = (name, value) => {
    if (name === "insurance") {
      setFormData((prev) => ({ ...prev, [name]: value ? value.value : "" }));
    } else if (name === "productId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        insurance: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectedInsurance = useMemo(() => {
    return insurances.find((ins) => ins._id === formData.insurance);
  }, [formData.insurance, insurances]);

  const insurancePrice = useMemo(() => {
    if (!selectedInsurance || !selectedProduct?.sellingPrice) return 0;
    return (
      selectedProduct.sellingPrice *
      (selectedInsurance.percentage / 100)
    ).toFixed(2);
  }, [selectedInsurance, selectedProduct]);

  const insuranceGstAmount = useMemo(() => {
    if (!selectedInsurance || !insurancePrice) return 0;
    return (insurancePrice * (selectedInsurance.gst / 100)).toFixed(2);
  }, [selectedInsurance, insurancePrice]);

  const totalInsuranceCost = useMemo(() => {
    return (Number(insurancePrice) + Number(insuranceGstAmount)).toFixed(2);
  }, [insurancePrice, insuranceGstAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.productId) {
        toast.error("Please select a product.");
        return;
      }
      if (!formData.insurance) {
        toast.error("Please select one insurance plan.");
        return;
      }
      if (!formData.insuranceProvider) {
        toast.error("Please select an insurance provider.");
        return;
      }

      const ins = selectedInsurance;

      const submissionData = {
        userType: formData.userType,
        userId: formData.userId,
        productId: formData.productId,
        mainCategoryId: formData.mainCategories[0],
        insuranceId: formData.insurance,
        insuranceProvider: formData.insuranceProvider,
       duration: ins.duration ,
        insurancePrice: Number(totalInsuranceCost),
        percentage: ins.percentage,
        gst: ins.gst,
         insuranceName:ins.name
      };

      const response = await postAPI(
        "/api/create-insurance",
        submissionData,
        {},
        true
      );

      if (response?.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        toast.error(`Failed: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.productName,
  }));

  const insuranceOptions = insurances.map((ins) => ({
    value: ins._id,
    label: `${ins.name} (${ins.duration}) - ${ins.percentage}%`,
  }));

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Insurance</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <a href="/seller/insurance">Insurance</a>
              </li>
              <li className="breadcrumb-item">Create Insurance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                {}
                <div className="form-group">
                  <label>
                    Product <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    options={productOptions}
                    value={
                      productOptions.find(
                        (opt) => opt.value === formData.productId
                      ) || null
                    }
                    onChange={(opt) =>
                      handleChange("productId", opt?.value || "")
                    }
                    placeholder="Select Product"
                    isClearable
                  />
                </div>

                {selectedProduct && (
                  <div className="form-group">
                    <label>Selected Product</label>
                    <div className="d-flex align-items-center">
                      <img
                        src={getImageUrl(selectedProduct.mainImage)}
                        alt={selectedProduct.productName}
                        className="img-thumbnail mr-3"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                      <div>
                        <p>
                          <strong>{selectedProduct.productName}</strong>
                        </p>
                        <p className="mb-0">
                          ₹{selectedProduct.sellingPrice?.toFixed(2) || "0.00"}
                        </p>
                        <small>
                          {selectedProduct.mainCategory?.mainCategoryName ||
                            "Unknown"}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {}
                <div className="form-group">
                  <label>
                    Insurance Plan <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    options={insuranceOptions}
                    value={
                      insuranceOptions.find(
                        (opt) => opt.value === formData.insurance
                      ) || null
                    }
                    onChange={(opt) => handleChange("insurance", opt)}
                    placeholder="Choose protection plan"
                    isDisabled={!selectedProduct || insurances.length === 0}
                  />
                  <small className="form-text text-muted">
                    Select one insurance option
                  </small>
                </div>

                {}
                {selectedInsurance && selectedProduct && (
                  <div className="form-group">
                    <label>Insurance Cost Breakdown</label>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th>Rate</th>
                          <th>Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedInsurance.name}</td>
                          <td>{selectedInsurance.percentage}%</td>
                          <td>{insurancePrice}</td>
                        </tr>
                        <tr>
                          <td>GST on Insurance</td>
                          <td>{selectedInsurance.gst}%</td>
                          <td>{insuranceGstAmount}</td>
                        </tr>
                        <tr className="table-success">
                          <td>
                            <strong>Total</strong>
                          </td>
                          <td colSpan="2">
                            <strong>₹{totalInsuranceCost}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {}
                <div className="form-group">
                  <label>
                    Insurance Provider <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    options={insuranceProviderOptions}
                    value={
                      insuranceProviderOptions.find(
                        (opt) => opt.value === formData.insuranceProvider
                      ) || null
                    }
                    onChange={(opt) =>
                      handleChange("insuranceProvider", opt?.value || "")
                    }
                    placeholder="Select Provider"
                    isClearable
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-4"
                  disabled={
                    loading ||
                    !selectedProduct ||
                    !formData.insurance ||
                    !formData.insuranceProvider
                  }
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateInsurance;
