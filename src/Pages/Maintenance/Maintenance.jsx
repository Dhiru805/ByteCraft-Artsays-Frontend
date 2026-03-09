import React from "react";

const Maintenance = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #3a3a3a 100%)",
        color: "#fff",
        textAlign: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: 600 }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🔧</div>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 16,
            background: "linear-gradient(90deg, #ffd89b, #19547b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Under Maintenance
        </h1>
        <p
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          We're currently performing scheduled maintenance.
          <br />
          We'll be back shortly. Thank you for your patience.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 50,
            padding: "12px 28px",
            fontSize: "1.3rem",
            color: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd89b", display: "inline-block", animation: "spin 2s linear infinite" }} />
          Maintenance in Progress
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
