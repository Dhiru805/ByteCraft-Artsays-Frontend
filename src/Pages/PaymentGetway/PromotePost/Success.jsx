import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const txnid = params.get("txnid");
    const orderId = params.get("orderId");

    if (txnid || orderId) {
      setPaymentInfo({ txnid, orderId });
    }

    sessionStorage.removeItem("cashfreePayment");
  }, [location.search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fff4 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          padding: "60px 40px",
          textAlign: "center",
        }}
      >
        {}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 30px",
            background: "linear-gradient(135deg, #38a169, #48bb78)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            color: "white",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1a1a1a",
            margin: "0 0 15px 0",
            letterSpacing: "-0.5px",
          }}
        >
          Payment Successful
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#4a5568",
            margin: "0 0 30px 0",
            lineHeight: "1.6",
          }}
        >
          Your payment was completed successfully! A confirmation receipt has
          been generated.
        </p>

        {}
        <div
          style={{
            background: "#f0fff4",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            textAlign: "left",
            borderLeft: "4px solid #38a169",
          }}
        >
          {paymentInfo?.txnid && (
            <div style={{ marginBottom: "15px", fontSize: "14px" }}>
              <span style={{ color: "#718096", fontWeight: "500" }}>
                Transaction ID
              </span>
              <p
                style={{
                  margin: "5px 0 0 0",
                  color: "#1a1a1a",
                  fontWeight: "600",
                  fontSize: "15px",
                  wordBreak: "break-all",
                }}
              >
                {paymentInfo.txnid}
              </p>
            </div>
          )}

          {paymentInfo?.orderId && (
            <div style={{ marginBottom: "15px", fontSize: "14px" }}>
              <span style={{ color: "#718096", fontWeight: "500" }}>
                Order ID
              </span>
              <p
                style={{
                  margin: "5px 0 0 0",
                  color: "#1a1a1a",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                {paymentInfo.orderId}
              </p>
            </div>
          )}

          {!paymentInfo && (
            <p style={{ color: "#718096", fontStyle: "italic" }}>
              Loading payment details...
            </p>
          )}
        </div>

        {}
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "12px",
            }}
          >
            Thank you for your payment!
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <li
              style={{
                fontSize: "14px",
                color: "#2f855a",
                paddingLeft: "24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  color: "#38a169",
                  fontWeight: "bold",
                }}
              >
                •
              </span>
              Receipt generated
            </li>
            <li
              style={{
                fontSize: "14px",
                color: "#2f855a",
                paddingLeft: "24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  color: "#38a169",
                  fontWeight: "bold",
                }}
              >
                •
              </span>
              Transaction verified
            </li>
            <li
              style={{
                fontSize: "14px",
                color: "#2f855a",
                paddingLeft: "24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  color: "#38a169",
                  fontWeight: "bold",
                }}
              >
                •
              </span>
              Confirmation email sent
            </li>
            <li
              style={{
                fontSize: "14px",
                color: "#2f855a",
                paddingLeft: "24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  color: "#38a169",
                  fontWeight: "bold",
                }}
              >
                •
              </span>
              Secure payment processed
            </li>
          </ul>
        </div>

        {}
        <button
        onClick={() =>
  navigate("/social-media/profile")
}
          style={{
            padding: "14px 24px",
            background: "white",
            color: "#38a169",
            border: "2px solid #c6f6d5",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f0fff4";
            e.target.style.borderColor = "#38a169";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.borderColor = "#c6f6d5";
          }}
        >
          Go Back
        </button>
      </div>

      {}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0% {
            transform: scale(0) rotate(-45deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        div[style*="boxShadow"] {
          animation: slideIn 0.6s ease-out;
        }
        div[style*="borderRadius: 50%"] {
          animation: bounce 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;
