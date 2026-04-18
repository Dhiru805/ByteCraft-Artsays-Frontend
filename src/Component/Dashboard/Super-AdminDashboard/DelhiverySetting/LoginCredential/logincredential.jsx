// import React, { useState, useEffect, useCallback } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import getAPI from "../../../../../api/getAPI";
// import postAPI from "../../../../../api/postAPI";
// import { toast } from "react-toastify";

// const API_BASE = process.env.REACT_APP_API_URL;

// export default function DelhiverySettings() {
//   const [settings, setSettings] = useState({
//     username: "",
//     password: "",
//     env: "test",
//     loginEnabled: true,
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const fetchSettings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await getAPI(`${API_BASE}/api/get-delhivery-credentials`);

//       if (res.data && !res.data.hasError && res.data.data) {
//         const data = res.data.data;
//         setSettings({
//           username: data.username || "",
//           password: data.password || "",
//           env: data.env || "test",
//           loginEnabled: data.loginEnabled !== false,
//         });
//       }
//     } catch (err) {
//       console.error("Failed to load Delhivery credentials:", err);
//       toast.error("Failed to load Delhivery login settings");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchSettings();
//   }, [fetchSettings]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSettings((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleToggleLogin = () => {
//     setSettings((prev) => ({ ...prev, loginEnabled: !prev.loginEnabled }));
//   };

//   const handleSave = async () => {
//     if (!settings.username.trim() || !settings.password.trim()) {
//       toast.error("Both Username and Password are required");
//       return;
//     }

//     setSaving(true);
//     try {
//       await postAPI(`${API_BASE}/api/save-delhivery-credentials`, settings);

//       toast.success("Delhivery login credentials saved successfully!");
//       await fetchSettings(); // refresh displayed values
//     } catch (err) {
//       const errorMsg = err?.response?.data?.message || "Failed to save Delhivery credentials";
//       toast.error(errorMsg);
//       console.error("Save error:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container-fluid">
//         <div className="block-header">
//           <div className="row">
//             <div className="col-lg-6 col-md-6 col-sm-12">
//               <h2>Delhivery Login Settings</h2>
//             </div>
//           </div>
//         </div>
//         <div className="row clearfix">
//           <div className="col-lg-12">
//             <div className="card">
//               <div className="body text-center p-5">Loading settings...</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Delhivery Login Settings</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <a href="/">
//                   <i className="fa fa-dashboard"></i>
//                 </a>
//               </li>
//               <li className="breadcrumb-item active">Delhivery Login Settings</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <div className="row">

//                 {/* Username */}
//                 <div className="col-md-6">
//                   <div className="form-group mb-3">
//                     <label className="form-label">
//                       Username <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="username"
//                       value={settings.username}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="Enter Delhivery username"
//                       required
//                       autoComplete="username"
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="col-md-6">
//                   <div className="form-group mb-3">
//                     <label className="form-label">
//                       Password <span className="text-danger">*</span>
//                     </label>
//                     <div className="position-relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={settings.password}
//                         onChange={handleChange}
//                         className="form-control"
//                         style={{ paddingRight: "44px" }}
//                         placeholder="Enter Delhivery password"
//                         required
//                         autoComplete="current-password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{
//                           position: "absolute",
//                           right: "12px",
//                           top: "7px",
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                         }}
//                       >
//                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Environment */}
//                 <div className="col-md-6">
//                   <div className="form-group mb-3">
//                     <label className="form-label">
//                       Environment <span className="text-danger">*</span>
//                     </label>
//                     <select
//                       name="env"
//                       value={settings.env}
//                       onChange={handleChange}
//                       className="form-control"
//                     >
//                       <option value="test">Test (Sandbox)</option>
//                       <option value="prod">Production (Live)</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Login Enabled Toggle */}
//                 <div className="col-md-12 mt-2">
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "16px 20px",
//                       background: settings.loginEnabled ? "#e8f5e9" : "#fce4ec",
//                       borderRadius: 8,
//                       border: `1px solid ${settings.loginEnabled ? "#a5d6a7" : "#f48fb1"}`,
//                       marginBottom: 16,
//                     }}
//                   >
//                     <div>
//                       <div style={{ fontWeight: 600, fontSize: "1.4rem" }}>
//                         Delhivery Login
//                       </div>
//                       <div style={{ fontSize: "1.15rem", color: "#555", marginTop: 4 }}>
//                         {settings.loginEnabled
//                           ? "Delhivery login is currently enabled. Shipping & logistics features are active."
//                           : "Delhivery login is currently disabled. Shipping & logistics features are turned off."}
//                       </div>
//                     </div>

//                     {/* Custom Toggle Switch */}
//                     <div
//                       onClick={handleToggleLogin}
//                       style={{
//                         width: 56,
//                         height: 30,
//                         borderRadius: 15,
//                         background: settings.loginEnabled ? "#4caf50" : "#e53935",
//                         cursor: "pointer",
//                         position: "relative",
//                         transition: "background 0.25s ease",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: 5,
//                           left: settings.loginEnabled ? 30 : 5,
//                           width: 20,
//                           height: 20,
//                           borderRadius: "50%",
//                           background: "#fff",
//                           transition: "left 0.25s ease",
//                           boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </div>

//               <div className="text-end mt-4">
//                 <button
//                   type="button"
//                   className="btn btn-primary btn-lg px-5"
//                   onClick={handleSave}
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Delhivery Credentials"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

export default function DelhiverySettings() {
  const [settings, setSettings] = useState({
    username: "",
    password: "",
    authorizationToken: "",
    env: "test",
    loginEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`${API_BASE}/api/get-delhivery-credentials`);

      if (res.data && !res.data.hasError && res.data.data) {
        const data = res.data.data;
        setSettings({
          username: data.username || "",
          password: data.password || "",
          authorizationToken: data.authorizationToken || "",
          env: data.env || "test",
          loginEnabled: data.loginEnabled !== false,
        });
      }
    } catch (err) {
      console.error("Failed to load Delhivery credentials:", err);
      toast.error("Failed to load Delhivery settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleLogin = () => {
    setSettings((prev) => ({ ...prev, loginEnabled: !prev.loginEnabled }));
  };

  const handleSave = async () => {
    if (!settings.username.trim() || !settings.password.trim()) {
      toast.error("Username and Password are required");
      return;
    }

    setSaving(true);
    try {
      await postAPI(`${API_BASE}/api/save-delhivery-credentials`, settings);

      toast.success("Delhivery credentials saved successfully!");
      await fetchSettings(); // refresh
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to save credentials";
      toast.error(errorMsg);
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="block-header">
          <h2>Delhivery Login Settings</h2>
        </div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="body text-center p-5">Loading settings...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Delhivery Login Settings</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">Delhivery Login Settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="row">

                {/* Username */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={settings.username}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Delhivery username"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={settings.password}
                        onChange={handleChange}
                        className="form-control"
                        style={{ paddingRight: "44px" }}
                        placeholder="Enter Delhivery password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "7px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Authorization Token (Bearer / API Key) */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Authorization Token</label>
                    <div className="position-relative">
                      <input
                        type={showToken ? "text" : "password"}
                        name="authorizationToken"
                        value={settings.authorizationToken}
                        onChange={handleChange}
                        className="form-control"
                        style={{ paddingRight: "44px" }}
                        placeholder="Enter Bearer token (optional)"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "7px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <small className="form-text text-muted">
                      Optional – used in newer Delhivery API versions
                    </small>
                  </div>
                </div>

                {/* Environment */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Environment <span className="text-danger">*</span>
                    </label>
                    <select
                      name="env"
                      value={settings.env}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="test">Test (Sandbox)</option>
                      <option value="prod">Production (Live)</option>
                    </select>
                  </div>
                </div>

                {/* Login Enabled Toggle – full width */}
                <div className="col-md-12 mt-3">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: settings.loginEnabled ? "#e8f5e9" : "#fce4ec",
                      borderRadius: 8,
                      border: `1px solid ${settings.loginEnabled ? "#a5d6a7" : "#f48fb1"}`,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1.4rem" }}>
                        Delhivery Integration
                      </div>
                      <div style={{ fontSize: "1.15rem", color: "#555", marginTop: 4 }}>
                        {settings.loginEnabled
                          ? "Integration is enabled – shipping features are active."
                          : "Integration is disabled – shipping features are turned off."}
                      </div>
                    </div>

                    <div
                      onClick={handleToggleLogin}
                      style={{
                        width: 56,
                        height: 30,
                        borderRadius: 15,
                        background: settings.loginEnabled ? "#4caf50" : "#e53935",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.25s ease",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 5,
                          left: settings.loginEnabled ? 30 : 5,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.25s ease",
                          boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg px-5"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Saving...
                    </>
                  ) : (
                    "Save Delhivery Credentials"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}