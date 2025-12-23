// import React, { useEffect, useState } from "react";
// import getAPI from "../../../api/getAPI";
// import postAPI from "../../../api/postAPI";
// import { toast } from "react-toastify";

// const PickupRequestModal = ({
//   isOpen,
//   onClose,
//   productId,
//   orderId,
//   transactionId,
//   productName,
//   buyer,
//   artist,
//   deliveryAddress,
// }) => {
//   const [buyerAddr, setBuyerAddr] = useState({});
//   const [warehouses, setWarehouses] = useState([]);
//   const [selectedWarehouse, setSelectedWarehouse] = useState(null);

//   const [pickupDate, setPickupDate] = useState("");
//   const [pickupTime, setPickupTime] = useState("");

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isOpen) return;

//     setBuyerAddr(deliveryAddress || {});
//     setPickupDate(new Date().toISOString().split("T")[0]);
//     setPickupTime("14:00:00");

//     fetchWarehouses();
//   }, [isOpen]);

//   const fetchWarehouses = async () => {
//     try {
//       const res = await getAPI(
//         `/api/delhivery/seller/${artist.id}/warehouses`,
//         {},
//         true,
//         false
//       );
//       setWarehouses(res.data.data || []);
//     } catch {
//       toast.error("Failed to fetch seller warehouses");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedWarehouse) {
//       toast.error("Please select a warehouse");
//       return;
//     }

//     setLoading(true);
//     try {
//       await postAPI(
//         "/api/delhivery/pickup/create",
//         {
//           productId,
//           orderId,
//           transactionId,
//           pickup_date: pickupDate,
//           pickup_time: pickupTime,
//           buyerAddress: buyerAddr,
//           warehouseId: selectedWarehouse.warehouseId,
//           warehouseAddressId: selectedWarehouse._id,
//         },
//         true,
//         true
//       );

//       toast.success("Pickup request created");
//       onClose();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message || "Pickup request failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="pickup-modal-overlay">
//       <div className="pickup-modal">
//         <h3>Create Pickup Request</h3>

//         <div className="section">
//           <strong>Product:</strong> {productName}
//           <br />
//           <strong>Buyer:</strong> {buyer?.name}
//           <br />
//           <strong>Artist/Seller:</strong> {artist?.name}
//         </div>

//         <hr />

//         <div className="section">
//           <h4>Buyer Address</h4>

//           {["line1", "line2", "landmark", "city", "state", "country", "pincode"].map(
//             (field) => (
//               <input
//                 key={field}
//                 placeholder={field}
//                 value={buyerAddr[field] || ""}
//                 onChange={(e) =>
//                   setBuyerAddr({
//                     ...buyerAddr,
//                     [field]: e.target.value,
//                   })
//                 }
//               />
//             )
//           )}
//         </div>

//         <hr />

//         <div className="section">
//           <h4>Pickup Warehouse</h4>

//           <select
//             value={selectedWarehouse?._id || ""}
//             onChange={(e) => {
//               const wh = warehouses.find(
//                 (w) => w._id === e.target.value
//               );
//               setSelectedWarehouse(wh);
//             }}
//           >
//             <option value="">Select Warehouse</option>
//             {warehouses.map((w) => (
//               <option key={w._id} value={w._id}>
//                 {w.warehouseName || "Warehouse"} — {w.city} (
//                 {w.warehouseId})
//               </option>
//             ))}
//           </select>
//         </div>

//         <hr />

//         <div className="section">
//           <h4>Pickup Schedule</h4>

//           <input
//             type="date"
//             value={pickupDate}
//             onChange={(e) => setPickupDate(e.target.value)}
//           />

//           <input
//             type="time"
//             step="1"
//             value={pickupTime}
//             onChange={(e) => setPickupTime(e.target.value)}
//           />
//         </div>

//         <div className="actions">
//           <button onClick={onClose} disabled={loading}>
//             Cancel
//           </button>

//           <button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Creating..." : "Create Pickup"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PickupRequestModal;

import React, { useEffect, useState } from "react";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import { toast } from "react-toastify";
import "./modal.css";

const PickupRequestModal = ({
  isOpen,
  onClose,
  productId,
  orderId,
  transactionId,
  productName,
  buyer,
  artist,
  deliveryAddress,
}) => {
  const [buyerAddr, setBuyerAddr] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setBuyerAddr(deliveryAddress || {});
    setPickupDate(new Date().toISOString().split("T")[0]);
    setPickupTime("14:00:00");

    fetchWarehouses();
  }, [isOpen]);

  const fetchWarehouses = async () => {
    try {
      const res = await getAPI(
        `/api/delhivery/seller/${artist.id}/warehouses`,
        {},
        true,
        false
      );
      setWarehouses(res.data.data || []);
    } catch {
      toast.error("Failed to fetch seller warehouses");
    }
  };

  const handleSubmit = async () => {
    if (!selectedWarehouse) {
      toast.error("Please select a warehouse");
      return;
    }

    setLoading(true);
    try {
      await postAPI(
        "/api/delhivery/pickup/create",
        {
          productId,
          orderId,
          transactionId,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          buyerAddress: buyerAddr,
          warehouseId: selectedWarehouse.warehouseId,
          warehouseAddressId: selectedWarehouse._id,
        },
        true,
        true
      );

      toast.success("Pickup request created");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Pickup request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

//   return (
//     <div className="modal fade show d-block" tabIndex="-1">
return (
  
    <div className="custom-modal-backdrop">

    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Pickup Request</h5>
            <button className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <div className="card mb-3">
              <div className="card-body">
                <p><strong>Product:</strong> {productName}</p>
                <p><strong>Buyer:</strong> {buyer?.name}</p>
                <p><strong>Artist/Seller:</strong> {artist?.name}</p>
              </div>
            </div>

            <h6>Buyer Address</h6>
            {["line1", "line2", "landmark", "city", "state", "country", "pincode"].map(
              (field) => (
                <input
                  key={field}
                  className="form-control mb-2"
                  placeholder={field}
                  value={buyerAddr[field] || ""}
                  onChange={(e) =>
                    setBuyerAddr({ ...buyerAddr, [field]: e.target.value })
                  }
                />
              )
            )}

            <h6 className="mt-3">Pickup Warehouse</h6>
            <select
              className="form-control mb-3"
              value={selectedWarehouse?._id || ""}
              onChange={(e) => {
                const wh = warehouses.find(w => w._id === e.target.value);
                setSelectedWarehouse(wh);
              }}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>
                  {w.warehouseName || "Warehouse"} — {w.city} ({w.warehouseId})
                </option>
              ))}
            </select>

            <h6>Pickup Schedule</h6>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="time"
                  step="1"
                  className="form-control"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Pickup"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PickupRequestModal;
