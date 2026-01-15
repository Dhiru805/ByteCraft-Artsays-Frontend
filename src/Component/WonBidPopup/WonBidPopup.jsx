import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import getAPI from "../../api/getAPI";

const WonBidPopup = ({ userId, isAuthenticated }) => {
  const [wonBids, setWonBids] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBidIndex, setCurrentBidIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log("WonBidPopup: Not authenticated or no userId", { isAuthenticated, userId });
      return;
    }

    const fetchWonBids = async () => {
      try {
        console.log("WonBidPopup: Fetching won bids for userId:", userId);
        const res = await getAPI(`/api/cart/won-bids/${userId}`, {}, true, false);
        console.log("WonBidPopup: API response:", res);
        const bids = res?.data?.wonBids || res?.data?.data?.wonBids || [];
        console.log("WonBidPopup: Won bids found:", bids);

        if (bids.length > 0) {
          const shownBids = localStorage.getItem("shownWonBids")
            ? JSON.parse(localStorage.getItem("shownWonBids"))
            : [];

          const newBids = bids.filter(
            (bid) => !shownBids.includes(String(bid.bidId))
          );

          console.log("WonBidPopup: New bids to show:", newBids);

          if (newBids.length > 0) {
            setWonBids(newBids);
            setShowPopup(true);
            setCurrentBidIndex(0);
            console.log("WonBidPopup: Showing popup");
          }
        }
      } catch (err) {
        console.error("WonBidPopup: Error fetching won bids:", err);
      }
    };

    const timer = setTimeout(() => {
      fetchWonBids();
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId, isAuthenticated]);

  const handleClose = () => {
    if (wonBids.length > 0) {
      const shownBids = localStorage.getItem("shownWonBids")
        ? JSON.parse(localStorage.getItem("shownWonBids"))
        : [];

      const currentBidId = wonBids[currentBidIndex]?.bidId;
      if (currentBidId && !shownBids.includes(currentBidId)) {
        shownBids.push(currentBidId);
        localStorage.setItem("shownWonBids", JSON.stringify(shownBids));
      }

      if (currentBidIndex < wonBids.length - 1) {
        setCurrentBidIndex(currentBidIndex + 1);
      } else {
        setShowPopup(false);
        setWonBids([]);
        setCurrentBidIndex(0);
      }
    } else {
      setShowPopup(false);
    }
  };

  const handleViewCart = () => {
    window.location.href = `/my-account/my-cart/${userId}`;
    handleClose();
  };

  if (!showPopup || wonBids.length === 0) return null;

  const currentBid = wonBids[currentBidIndex];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2
            style={{
              color: "#AD6449",
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Congratulations! You Won the Bid
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#F4ECE9",
            borderLeft: "4px solid #AD6449",
            padding: "20px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <p style={{ marginBottom: "10px", fontSize: "16px" }}>
            <strong>Product:</strong> {currentBid.artworkName || currentBid.productName}
          </p>
          <p style={{ marginBottom: "10px", fontSize: "16px" }}>
            <strong>Winning Bid:</strong> ₹{currentBid.amount}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#E8F5E9",
            borderLeft: "4px solid #4CAF50",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0, color: "#2E7D32", fontWeight: "bold" }}>
            The product has been added to your cart!
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={handleViewCart}
            style={{
              backgroundColor: "#AD6449",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View Cart
          </button>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 
                 currentBidIndex < wonBids.length - 1 ? "#AD6449" : "#ccc",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {currentBidIndex < wonBids.length - 1 ? "Next" : "Close"}
          </button>
        </div>

        {wonBids.length > 1 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {currentBidIndex + 1} of {wonBids.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default WonBidPopup;

