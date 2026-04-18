import React from "react";

const PickupModal = ({
  show,
  onClose,
  onConfirm,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  orderCreatedAt,
}) => {
  if (!show) return null;

  const orderDate = orderCreatedAt ? new Date(orderCreatedAt) : new Date();

  const today = new Date();

  const minDateObj = today > orderDate ? today : orderDate;

  const maxDateObj = new Date(orderDate);
  maxDateObj.setDate(maxDateObj.getDate() + 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const minDate = formatDate(minDateObj);
  const maxDate = formatDate(maxDateObj);

  const handleConfirm = () => {
    if (!pickupDate || !pickupTime) {
      alert("Please select pickup date & time");
      return;
    }

    if (pickupDate < minDate || pickupDate > maxDate) {
      alert("Pickup date must be within 7 days from order date");
      return;
    }

    onConfirm();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "24px",
          width: "400px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h5 style={{ marginBottom: "15px", fontWeight: "600" }}>
          Schedule Pickup
        </h5>

        {}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Pickup Date
          </label>
          <input
            type="date"
            className="form-control"
            value={pickupDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
          <small style={{ color: "#888" }}>
            Allowed: {minDate} → {maxDate}
          </small>
        </div>

        {}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            Pickup Time
          </label>
          <input
            type="time"
            className="form-control"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>

        {}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-success btn-sm" onClick={handleConfirm}>
            Confirm Pickup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupModal;
