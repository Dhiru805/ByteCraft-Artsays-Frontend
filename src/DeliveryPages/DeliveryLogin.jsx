import React, { useState } from "react";
import postAPI from "../api/postAPI";

const DeliveryLogin = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await postAPI("/api/delivery-auth/login", {
        username: form.username.trim(),
        password: form.password.trim(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error (${res.status})`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }
      alert("Login Successful 🚚");



      // B) If using react-router
      // navigate("/delivery-dashboard");


    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const styles = {
    wrapper: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    },
    card: {
      background: "white",
      padding: "40px 32px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "420px",
    },
    title: {
      margin: "0 0 8px",
      fontSize: "28px",
      fontWeight: 700,
      color: "#1a1a1a",
      textAlign: "center",
    },
    subtitle: {
      margin: "0 0 32px",
      color: "#666",
      textAlign: "center",
      fontSize: "15px",
    },
    inputGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: 500,
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "border-color 0.2s",
      outline: "none",
    },
    passwordWrapper: {
      position: "relative",
    },
    eye: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "20px",
      color: "#666",
    },
    error: {
      color: "#e74c3c",
      fontSize: "14px",
      margin: "0 0 16px",
      textAlign: "center",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚚 Delivery Login</h2>
        <p style={styles.subtitle}>Access your delivery dashboard</p>

        <form onSubmit={handleLogin}>
          {}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: error && !form.username ? "#e74c3c" : "#ddd",
              }}
              autoFocus
            />
          </div>

          {}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: error && !form.password ? "#e74c3c" : "#ddd",
                }}
              />
              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              background: loading ? "#a5b4fc" : "#4f46e5",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLogin;
