import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";

const ViewMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    materialName: "",
    size: "",
    capacity: "",
    price: "",
    stockAvailable: "",
    minimumOrder: "",
    vendorSupplier: "",
    ecoFriendly: "Yes",
    status: "Active",
    deliveryEstimation: ""
  });
  const [materialNameImagePreview, setMaterialNameImagePreview] = useState(null);
  const [materialNames, setMaterialNames] = useState([]);
  const [materialSizes, setMaterialSizes] = useState([]);
  const [materialCapacitys, setMaterialCapacitys] = useState([]);

  useEffect(() => {
    // Fetch supporting dropdown data
    const userId = localStorage.getItem("userId");

    const fetchAllDropdowns = async () => {
      const [names, size, capacity] = await Promise.all([
        getAPI(`/api/packaging-material-setting/material-name/${userId}`),
        getAPI(`/api/packaging-material-setting/material-size/${userId}`),
        getAPI(`/api/packaging-material-setting/material-capacity/${userId}`),
      ]);
      setMaterialNames(names?.materialName || names?.data?.materialName || []);
      setMaterialSizes(size?.materialSize || size?.data?.materialSize || []);
      setMaterialCapacitys(capacity?.materialCapacity || capacity?.data?.materialCapacity || []);
    };
    fetchAllDropdowns();
  }, []);

  useEffect(() => {
    // Fetch material data by id
    const fetchMaterial = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const res = await getAPI(`/api/package-material/material/${userId}/${id}`);
        console.log("fetchMaterial data:", res);
        const data = res?.data?.data || res?.data || res;
        setFormData({
          userId: data?.userId || "",
          materialName: data?.materialName?.materialName || "",
          size: data?.size?.materialSize || "",
          capacity: data?.capacity?.materialCapacity || "",
          price: data?.price || "",
          stockAvailable: data?.stockAvailable || "",
          minimumOrder: data?.minimumOrder || "",
          vendorSupplier: data?.vendorSupplier || "",
          ecoFriendly: data?.ecoFriendly || "Yes",
          status: data?.status || "Active",
          deliveryEstimation: data?.deliveryEstimation || ""
        });
        setMaterialNameImagePreview(
          data?.materialName?.materialNameImage
            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${data.materialName.materialNameImage.replace(/\\/g, "/")}`
            : null
        );
      } catch (err) {
        // Optionally show error
      }
      setLoading(false);
    };
    fetchMaterial();
  }, [id]);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Material</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span onClick={() => navigate("/super-admin/packaging-material/material")} style={{ cursor: "pointer" }}>
                  Packaging Material
                </span>
              </li>
              <li className="breadcrumb-item">View Material</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <form>
                  <div className="form-group">
                    <label>Material Name</label>
                    <select
                      type="text"
                      className="form-control"
                      name="materialName"
                      value={formData.materialName}
                      disabled
                    >
                      <option value="">-- Select MaterialName --</option>
                      {materialNames.map((mat) => (
                        <option key={mat._id} value={mat.materialName}>
                          {mat.materialName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="file"
                      name="materialNameImage"
                      className="form-control-file"
                      accept="image/*"
                      disabled
                      style={{ display: "none" }}
                    />
                    {materialNameImagePreview && (
                      <div className="mt-2">
                        <img
                          src={materialNameImagePreview}
                          alt="Material Name Preview"
                          className="img-thumbnail"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                  <label>Size</label>
                  <select
                    type="text"
                    className="form-control"
                    name="size"
                    value={formData.size}
                    disabled
                  >
                    <option value="">-- Select MaterialSize --</option>
                    {
                      materialSizes.map((mat) => (
                        <option key={mat._id} value={mat.materialSize}>{mat.materialSize}</option>
                      ))}
                  </select>
                </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <select
                      className="form-control"
                      name="capacity"
                      value={formData.capacity}
                      disabled
                    >
                      <option value="">-- Select MaterialCapacity --</option>
                      {materialCapacitys.map((mat) => (
                        <option key={mat._id} value={mat.materialCapacity}>
                          {mat.materialCapacity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price / Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity Available</label>
                    <input
                      type="text"
                      className="form-control"
                      name="stockAvailable"
                      value={formData.stockAvailable}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Order Quantity(MOQ)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="minimumOrder"
                      value={formData.minimumOrder}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Vendor / Supplier Info</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vendorSupplier"
                      value={formData.vendorSupplier}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Eco-friendly</label>
                    <select
                      className="form-control form-control-sm"
                      name="ecoFriendly"
                      value={formData.ecoFriendly}
                      disabled
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control form-control-sm"
                      name="status"
                      value={formData.status}
                      disabled
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Delivery Estimation Days</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deliveryEstimation"
                      value={formData.deliveryEstimation}
                      disabled
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMaterial;