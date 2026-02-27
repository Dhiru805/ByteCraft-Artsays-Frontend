import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";

const UpdateMaterial = () => {
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
    const [materialNameImage, setMaterialNameImage] = useState(null);
    const [error, setError] = useState(null);
     const [materialNames, setMaterialNames] = useState([]);
     const [materialSizes, setMaterialSizes] = useState([]);
     const [materialCapacitys, setMaterialCapacitys] = useState([]);
   
     useEffect(() => {
       // Fetch supporting dropdown data
       const userId = localStorage.getItem("userId");
   
       const fetchAllDropdowns = async () => {
         const [names, types, sizes, capacitys] = await Promise.all([
           getAPI(`/api/packaging-material-setting/material-name/${userId}`),
           getAPI(`/api/packaging-material-setting/material-size/${userId}`),
           getAPI(`/api/packaging-material-setting/material-capacity/${userId}`),
         ]);
         setMaterialNames(names?.materialName || names?.data?.materialName || []);
         setMaterialSizes(sizes?.materialSize || sizes?.data?.materialSize || []);
         setMaterialCapacitys(capacitys?.materialCapacity || capacitys?.data?.materialCapacity || []);
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

useEffect(() => {
      const fetchMaterialNames = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if(!userId) return;

          const res = await getAPI(`/api/packaging-material-setting/material-name/${userId}`);
          console.log(res);
          setMaterialNames(res.materialName || res.data?.materialName || []);
        } catch(err){
          console.error("Failed to fetch materialNames", err);
        }
      };
      fetchMaterialNames();
  }, []);

  useEffect(() => {
    const fetchMaterialSizes = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if(!userId) return;

          const res = await getAPI(`/api/packaging-material-setting/material-size/${userId}`);
          console.log(res);
          setMaterialSizes(res.materialSize || res.data?.materialSize || []);
        } catch(err){
          console.error("Failed to fetch materialSizes", err);
        }
      };
      fetchMaterialSizes();
  }, []);

  useEffect(() => {
    const fetchMaterialCapacitys = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if(!userId) return;

          const res = await getAPI(`/api/packaging-material-setting/material-capacity/${userId}`);
          console.log(res);
          setMaterialCapacitys(res.materialCapacity || res.data?.materialCapacity || []);
        } catch(err){
          console.error("Failed to fetch materialCapacitys", err);
        }
      };
      fetchMaterialCapacitys();
  }, []);

  const fetchMaterialNameImage = async (userId, materialName) => {
    try {
        const res = await getAPI(`/api/packaging-material-setting/material-name/${userId}/${materialName}`);
        console.log("API Response:", res);

        const imagePath = res?.materialNameImage || res?.data?.materialNameImage;
        if (!imagePath) return null;

        // Convert Windows backslashes to forward slashes
        return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${imagePath.replace(/\\/g, "/")}`;
    } catch (err) {
        console.error("Failed to fetch image:", err);
        return null;
    }
    };

 // Handle text input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if(name === "materialName" && value) {
        try {
            const userId = localStorage.getItem("userId");
            const imageUrl = await fetchMaterialNameImage(userId, value);
            setMaterialNameImagePreview(imageUrl);
            if(imageUrl) setMaterialNameImage(null);
        } catch(err) {
            console.error("Failed to fetch material name Image:", err);
            setMaterialNameImagePreview(null);
        }
    }
  };

  // Handle Material Name Image
  const handleMaterialNameImageChange = (e) => {
    const file = e.target.files[0];
    setMaterialNameImage(file);
    if (file) {
      setMaterialNameImagePreview(URL.createObjectURL(file));
    } else {
      setMaterialNameImagePreview(null);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

     const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User not logged in.");
            setLoading(false);
        return;
    }

    console.log("UserId in handleUpdate", userId);

    // Create FormData object for multipart/form-data
    const data = new FormData();
    data.append("userId", userId);
    data.append("materialName", formData.materialName);
    data.append("size", formData.size);
    data.append("capacity", formData.capacity);
    data.append("price", formData.price);
    data.append("stockAvailable", formData.stockAvailable);
    data.append("minimumOrder", formData.minimumOrder);
    data.append("vendorSupplier", formData.vendorSupplier);
    data.append("ecoFriendly", formData.ecoFriendly);
    data.append("status", formData.status);
    data.append("deliveryEstimation", formData.deliveryEstimation);
    if (materialNameImage) {
      data.append("materialNameImage", materialNameImage);
    }

    try {
      // Send POST request to backend
      const response = await putAPI(`/api/package-material/material/update/${id}`, data);

      // Handle success
      console.log("In handleSubmit", response);
      navigate("/super-admin/packaging-material/material"); // Redirect to material list
    } catch (err) {
      // Handle error
      console.error("Error in putAPI:", err.response?.data || err.message || err);
      setError(err.response?.data?.message || "Failed to create material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Update Material</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span
                  onClick={() =>
                    navigate("/super-admin/packaging-material/material")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Packaging Material
                </span>
              </li>
              <li className="breadcrumb-item">Update Material</li>
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
                  <label>Material Name</label>
                  <select
                    type="text"
                    className="form-control"
                    name="materialName"
                    value={formData.materialName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select MaterialName --</option>
                    {
                      materialNames.map((mat) => (
                        <option key={mat._id} value={mat.materialName}>{mat.materialName}</option>
                      ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <input
                    type="file"
                    name="materialNameImage"
                    className="form-control-file"
                    accept="image/*"
                    onChange={handleMaterialNameImageChange}
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
                    onChange={handleInputChange}
                    required
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
                    type="text"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select MaterialCapacity --</option>
                    {
                      materialCapacitys.map((mat) => (
                        <option key={mat._id} value={mat.materialCapacity}>{mat.materialCapacity}</option>
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
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity Available</label>
                  <input
                    type="text"
                    className="form-control"
                    name="stockAvailable"
                    value={formData.stockAvailable}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Order Quantity(MOQ)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="minimumOrder"
                    value={formData.minimumOrder}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vendor / Supplier Info</label>
                  <input
                    type="text"
                    className="form-control"
                    name="vendorSupplier"
                    value={formData.vendorSupplier}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Eco-friendly</label>
                  <select className="form-control form-control-sm" name="ecoFriendly" value={formData.ecoFriendly}
                    onChange={handleInputChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-control form-control-sm" name="status" value={formData.status} onChange={handleInputChange}>
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
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-3"
                  disabled={loading}
                >
                   {loading ? "Updating Material..." : "Update Material"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateMaterial;