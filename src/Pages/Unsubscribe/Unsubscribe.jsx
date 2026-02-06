import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

const Unsubscribe = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const doUnsubscribe = async () => {
      try {
        const res = await axiosInstance.post(`/api/newsletter/unsubscribe/${id}`);
        setStatus("success");
        setMessage(res.data.message || "You have been successfully unsubscribed.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Unable to unsubscribe. You may have already been removed."
        );
      }
    };

    if (id) {
      doUnsubscribe();
    } else {
      setStatus("error");
      setMessage("Invalid unsubscribe link.");
    }
  }, [id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid #eee",
                borderTop: "4px solid #FB5934",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ color: "#666", fontSize: "16px" }}>Processing your request...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "28px",
              }}
            >
              &#10003;
            </div>
            <h2 style={{ color: "#333", marginBottom: "12px" }}>Unsubscribed</h2>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>{message}</p>
            <p style={{ color: "#999", fontSize: "13px", marginTop: "20px" }}>
              You will no longer receive newsletter emails from Artsays.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#fce4ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "28px",
                color: "#e53935",
              }}
            >
              &#10007;
            </div>
            <h2 style={{ color: "#333", marginBottom: "12px" }}>Oops!</h2>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>{message}</p>
          </>
        )}

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "24px",
            padding: "10px 24px",
            backgroundColor: "#FB5934",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Unsubscribe;
