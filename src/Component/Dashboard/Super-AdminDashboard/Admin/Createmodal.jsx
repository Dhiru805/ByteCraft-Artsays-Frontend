// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// // // ✅ Added import to get all sidebar labels
// import { allSidebarLabels } from "../../Sidebar/sidebar";

// const CreateAdminModal = ({ onClose, fetchAdmins }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "Super-Admin",
//     role: "super-admin", 
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading]=useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true)

//     for (const key in formData) {
//       if (!formData[key]) {
//         toast.error("Please fill in all fields");
//         return;
//       }
//     }

//     if (!isValidEmail(formData.email)) {
//       toast.error("Invalid email format");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await postAPI("/auth/createuser", formData);



//       toast.success(response.data.message);
//       fetchAdmins();
//       onClose();
//     } catch (error) {
//       console.error("Error response:", error);
//       toast.error(error.response?.data?.message || "An unexpected error occurred");
//     }finally{
//       setLoading(false)
//     }
//   };

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Create Admin</h5>
//             <button type="button" className="close" onClick={onClose}>
//               <span>&times;</span>
//             </button>
//           </div>
//           <div className="modal-body">
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>First Name</label>
//                 <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Last Name</label>
//                 <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
//               </div>
//               <div className="form-group position-relative">
//                 <label>Password</label>
//                 <div className="input-group">
//                   <input 
//                     type={showPassword ? "text" : "password"} 
//                     className="form-control" 
//                     name="password" 
//                     value={formData.password} 
//                     onChange={handleChange} 
//                     required 
//                   />
//                   <div className="input-group-append">
//                     <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
//                       <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="form-group position-relative">
//                 <label>Confirm Password</label>
//                 <div className="input-group">
//                   <input 
//                     type={showConfirmPassword ? "text" : "password"} 
//                     className="form-control" 
//                     name="confirmPassword" 
//                     value={formData.confirmPassword} 
//                     onChange={handleChange} 
//                     required 
//                   />
//                   <div className="input-group-append">
//                     <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                       <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>


//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={onClose}>
//                   Cancel
//                 </button>
//                 <button 
//                 type="submit" 
//                 className="btn btn-primary"
//                 disabled={loading}>
//                  {loading?"Creating.....":"Create Admin"} 
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;

// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";
// import { allSidebarLabels } from "../../Sidebar/sidebar";

// const CreateAdminModal = ({ onClose, fetchAdmins }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "Super-Admin",
//     role: "super-admin",
//     hiddenLabels: [] // store labels to HIDE
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleToggleLabel = (label) => {
//     setFormData((prev) => {
//       const hidden = prev.hiddenLabels.includes(label)
//         ? prev.hiddenLabels.filter((l) => l !== label)
//         : [...prev.hiddenLabels, label];
//       return { ...prev, hiddenLabels: hidden };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     for (const key in formData) {
//       if (!formData[key] && key !== "hiddenLabels") {
//         toast.error("Please fill in all fields");
//         setLoading(false);
//         return;
//       }
//     }

//     if (!isValidEmail(formData.email)) {
//       toast.error("Invalid email format");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await postAPI("/auth/createuser", formData);

//       // Store hidden labels for this admin
//       localStorage.setItem(
//         `admin_hiddenLabels_${formData.email}`,
//         JSON.stringify(formData.hiddenLabels)
//       );

//       toast.success(response.data.message);
//       fetchAdmins();
//       onClose();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
//       {/* ✅ Embedded Styles */}
//       <style>
//         {`
//           .switch {
//             position: relative;
//             display: inline-block;
//             width: 46px;
//             height: 24px;
//           }
//           .switch input {
//             opacity: 0;
//             width: 0;
//             height: 0;
//           }
//           .slider {
//             position: absolute;
//             cursor: pointer;
//             top: 0; left: 0; right: 0; bottom: 0;
//             background-color: #ccc;
//             transition: .4s;
//             border-radius: 24px;
//           }
//           .slider:before {
//             position: absolute;
//             content: "";
//             height: 18px; width: 18px;
//             left: 3px; bottom: 3px;
//             background-color: white;
//             transition: .4s;
//             border-radius: 50%;
//           }
//           input:checked + .slider {
//             background-color: #2196F3;
//           }
//           input:checked + .slider:before {
//             transform: translateX(22px);
//           }
//           .scrollable-modal-body {
//             max-height: 70vh;
//             overflow-y: auto;
//             padding-right: 10px;
//           }
//           @media (max-width: 768px) {
//             .scrollable-modal-body {
//               max-height: 60vh;
//             }
//           }
//         `}
//       </style>

//       <div className="modal-dialog modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Create Admin</h5>
//             <button type="button" className="close" onClick={onClose}>
//               <span>&times;</span>
//             </button>
//           </div>

//           <div className="modal-body scrollable-modal-body">
//             <form onSubmit={handleSubmit}>
//               {/* First Name */}
//               <div className="form-group">
//                 <label>First Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Last Name */}
//               <div className="form-group">
//                 <label>Last Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className="form-group position-relative">
//                 <label>Password</label>
//                 <div className="input-group">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className="form-control"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="input-group-append">
//                     <span
//                       className="input-group-text"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div className="form-group position-relative">
//                 <label>Confirm Password</label>
//                 <div className="input-group">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     className="form-control"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="input-group-append">
//                     <span
//                       className="input-group-text"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* ✅ Toggle Sidebar Label Access */}
//               <div className="form-group mt-4">
//                 <label className="form-label">Sidebar Tab Visibility</label>
//                 <small className="d-block text-muted mb-2">
//                   (Toggle ON to hide tab for this admin)
//                 </small>
//                 <div className="row">
//                   {allSidebarLabels.map((label) => (
//                     <div className="col-6 col-md-4 mb-2" key={label}>
//                       <div className="d-flex align-items-center">
//                         <label className="switch me-2">
//                           <input
//                             type="checkbox"
//                             checked={formData.hiddenLabels.includes(label)}
//                             onChange={() => handleToggleLabel(label)}
//                             id={`toggle-${label}`}
//                           />
//                           <span className="slider round"></span>
//                         </label>
//                         <label htmlFor={`toggle-${label}`} className="mb-0">
//                           {label}
//                         </label>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Footer Buttons */}
//               <div className="modal-footer d-flex flex-column flex-md-row justify-content-between gap-2">
//                 <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={onClose}>
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100 w-md-auto"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating..." : "Create Admin"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;




// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";
// import { allSidebarLabels } from "../../Sidebar/sidebar";

// const CreateAdminModal = ({ onClose, fetchAdmins }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "Super-Admin",
//     role: "super-admin",
//     hiddenLabels: []
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ⛔ Prevent hiding "Admin" label
//   const handleToggleLabel = (label, checked) => {
//     if (label === "Admin") return;

//     const updatedHidden = checked
//       ? [...formData.hiddenLabels, label] // hide it
//       : formData.hiddenLabels.filter((l) => l !== label); // unhide it

//     setFormData((prev) => ({
//       ...prev,
//       hiddenLabels: updatedHidden
//     }));
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     for (const key in formData) {
//       if (!formData[key] && key !== "hiddenLabels") {
//         toast.error("Please fill in all fields");
//         setLoading(false);
//         return;
//       }
//     }

//     if (!isValidEmail(formData.email)) {
//       toast.error("Invalid email format");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await postAPI("/auth/createuser", formData);

//       // ✅ Save hidden labels (ensure Admin is not hidden)
//       const safeHidden = formData.hiddenLabels.filter(label => label !== "Admin");

//       localStorage.setItem(
//         `admin_hiddenLabels_${formData.email}`,
//         JSON.stringify(safeHidden)
//       );

//       // 🔄 Notify sidebar via synthetic storage event
//       window.dispatchEvent(
//         new StorageEvent("storage", {
//           key: `admin_hiddenLabels_${formData.email}`,
//           newValue: JSON.stringify(safeHidden)
//         })
//       );

//       toast.success(response.data.message);
//       fetchAdmins();
//       onClose();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
//       <style>
//         {`
//           .switch {
//             position: relative;
//             display: inline-block;
//             width: 46px;
//             height: 24px;
//           }
//           .switch input {
//             opacity: 0;
//             width: 0;
//             height: 0;
//           }
//           .slider {
//             position: absolute;
//             cursor: pointer;
//             top: 0; left: 0; right: 0; bottom: 0;
//             background-color: #ccc;
//             transition: .4s;
//             border-radius: 24px;
//           }
//           .slider:before {
//             position: absolute;
//             content: "";
//             height: 18px; width: 18px;
//             left: 3px; bottom: 3px;
//             background-color: white;
//             transition: .4s;
//             border-radius: 50%;
//           }
//           input:checked + .slider {
//             background-color: #2196F3;
//           }
//           input:checked + .slider:before {
//             transform: translateX(22px);
//           }
//           .scrollable-modal-body {
//             max-height: 70vh;
//             overflow-y: auto;
//             padding-right: 10px;
//           }
//           @media (max-width: 768px) {
//             .scrollable-modal-body {
//               max-height: 60vh;
//             }
//           }
//         `}
//       </style>

//       <div className="modal-dialog modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Create Admin</h5>
//             <button type="button" className="close" onClick={onClose}>
//               <span>&times;</span>
//             </button>
//           </div>

//           <div className="modal-body scrollable-modal-body">
//             <form onSubmit={handleSubmit}>
//               {/* First Name */}
//               <div className="form-group">
//                 <label>First Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Last Name */}
//               <div className="form-group">
//                 <label>Last Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className="form-group position-relative">
//                 <label>Password</label>
//                 <div className="input-group">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className="form-control"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="input-group-append">
//                     <span
//                       className="input-group-text"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div className="form-group position-relative">
//                 <label>Confirm Password</label>
//                 <div className="input-group">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     className="form-control"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="input-group-append">
//                     <span
//                       className="input-group-text"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Toggle Sidebar Label Access */}
//               <div className="form-group mt-4">
//                 <label className="form-label">Sidebar Tab Visibility</label>
//                 <small className="d-block text-muted mb-2">
//                   (Toggle ON to hide tab for this admin)
//                 </small>
//                 <div className="row">
//                   {allSidebarLabels.map((label) => {
//                     const checked = formData.hiddenLabels.includes(label);
//                     return (
//                       <div className="col-6 col-md-4 mb-2" key={label}>
//                         <div className="d-flex align-items-center">
//                           <label className="switch me-2">
//                             <input
//                               type="checkbox"
//                               checked={checked}
//                               onChange={(e) =>
//                                 handleToggleLabel(label, e.target.checked)
//                               }
//                               id={`toggle-${label}`}
//                               disabled={label === "Admin"}
//                             />
//                             <span className="slider round"></span>
//                           </label>
//                           <label htmlFor={`toggle-${label}`} className="mb-0">
//                             {label}{" "}
//                             {label === "Admin" && (
//                               <small className="text-muted">(Always visible)</small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="modal-footer d-flex flex-column flex-md-row justify-content-between gap-2">
//                 <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={onClose}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary w-100 w-md-auto" disabled={loading}>
//                   {loading ? "Creating..." : "Create Admin"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;



// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";
// import { allSidebarLabels } from "../../Sidebar/sidebar";
// import { useNavigate } from "react-router-dom";

// const CreateAdminModal = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "Super-Admin",
//     role: "super-admin",
//     hiddenLabels: [],
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // const handleToggleLabel = (label, checked) => {
//   //   if (label === "Admin") return;
//   //   const updatedHidden = checked
//   //     ? [...formData.hiddenLabels, label]
//   //     : formData.hiddenLabels.filter((l) => l !== label);
//   //   setFormData((prev) => ({ ...prev, hiddenLabels: updatedHidden }));
//   // };


//    const handleToggleLabel = (label, isChecked) => {
//   const updatedHiddenLabels = isChecked
//     ? formData.hiddenLabels.filter((l) => l !== label) // ON => make visible => remove from hidden list
//     : [...formData.hiddenLabels, label];              // OFF => hide => add to hidden list

//   setFormData({ ...formData, hiddenLabels: updatedHiddenLabels });
// };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     for (const key in formData) {
//       if (!formData[key] && key !== "hiddenLabels") {
//         toast.error("Please fill in all fields");
//         setLoading(false);
//         return;
//       }
//     }

//     if (!isValidEmail(formData.email)) {
//       toast.error("Invalid email format");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await postAPI("/auth/createuser", formData);

//       const safeHidden = formData.hiddenLabels.filter((l) => l !== "Admin");
//       localStorage.setItem(
//         `admin_hiddenLabels_${formData.email}`,
//         JSON.stringify(safeHidden)
//       );

//       window.dispatchEvent(
//         new StorageEvent("storage", {
//           key: `admin_hiddenLabels_${formData.email}`,
//           newValue: JSON.stringify(safeHidden),
//         })
//       );

//       toast.success(response.data.message);
//       navigate("/super-admin/admin");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       {/* ✅ Embedded styles for toggle switch and scrollable modal */}
//       <style>{`
//         .switch {
//           position: relative;
//           display: inline-block;
//           width: 46px;
//           height: 24px;
//         }
//         .switch input {
//           opacity: 0;
//           width: 0;
//           height: 0;
//         }
//         .slider {
//           position: absolute;
//           cursor: pointer;
//           top: 0; left: 0; right: 0; bottom: 0;
//           background-color: #ccc;
//           transition: .4s;
//           border-radius: 24px;
//         }
//         .slider:before {
//           position: absolute;
//           content: "";
//           height: 18px;
//           width: 18px;
//           left: 3px;
//           bottom: 3px;
//           background-color: white;
//           transition: .4s;
//           border-radius: 50%;
//         }
//         input:checked + .slider {
//           background-color: #2196F3;
//         }
//         input:checked + .slider:before {
//           transform: translateX(22px);
//         }
//         .scrollable-modal-body {
//           max-height: 70vh;
//           overflow-y: auto;
//         }
//         @media (max-width: 768px) {
//           .scrollable-modal-body {
//             max-height: 60vh;
//           }
//         }
//       `}</style>

//       <div className="block-header d-flex justify-content-between align-items-center">
//         <h2>Create Admin</h2>
//         <button className="btn btn-secondary" onClick={() => navigate(-1)}>
//           <i className="fa fa-arrow-left"></i> Back
//         </button>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body scrollable-modal-body">
//               <form onSubmit={handleSubmit}>
//                 {/* First Name */}
//                 <div className="form-group">
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div className="form-group">
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="form-group">
//                   <label>Password</label>
//                   <div className="input-group">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       className="form-control"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                     />
//                     <div className="input-group-append">
//                       <span
//                         className="input-group-text"
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="form-group">
//                   <label>Confirm Password</label>
//                   <div className="input-group">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       className="form-control"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required
//                     />
//                     <div className="input-group-append">
//                       <span
//                         className="input-group-text"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Toggle Labels */}
//                 <div className="form-group mt-4">
//                   <label className="form-label">Sidebar Tab Visibility</label>
//                   <small className="d-block text-muted mb-2">
//                     (Toggle OFF to hide tab for this admin)
//                   </small>
//                   <div className="row">
//                     {allSidebarLabels.map((label) => {
//                       // const checked = formData.hiddenLabels.includes(label);
//                       const checked = !formData.hiddenLabels.includes(label);
//                       return (
//                         <div className="col-12 col-md-6 mb-2" key={label}>
//                           <div className="d-flex justify-content-between align-items-center px-2">
//                             <label className="mb-0">
//                               {label}{" "}
//                               {label === "Admin" && (
//                                 <small className="text-muted"></small>
//                               )}
//                             </label>
//                             <label className="switch" style={{ transform: "scale(0.8)" }}>
//                               <input
//                                 type="checkbox"
//                                 checked={checked}
//                                 onChange={(e) =>
//                                   handleToggleLabel(label, e.target.checked)
//                                 }
//                                 disabled={label === "Admin"}
//                               />
//                               <span className="slider round"></span>
//                             </label>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>


//                 {/* Buttons */}
//                 <div className="form-group d-flex justify-content-end flex-wrap">
//                   <button
//                     type="button"
//                     className="btn btn-secondary "
//                     style={{ marginRight: "16px" }}
//                     onClick={() => navigate(-1)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary w-20 w-md-auto"
//                     disabled={loading}
//                   >
//                     {loading ? "Creating..." : "Create Admin"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;




          import React, { useState } from "react";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";
import { allSidebarLabels } from "../../Sidebar/sidebar";
import { useNavigate } from "react-router-dom";

const CreateAdminModal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Super-Admin",
    role: "super-admin",
    hiddenItems: {
      labels: [],
      subtabs: {}
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleItem = (type, parentLabel, label, isChecked) => {
    setFormData(prev => {
      const newData = {...prev};
      
      if (type === 'label') {
        newData.hiddenItems.labels = isChecked
          ? newData.hiddenItems.labels.filter(l => l !== label)
          : [...newData.hiddenItems.labels, label];
      } else if (type === 'subtab') {
        const parentSubtabs = newData.hiddenItems.subtabs[parentLabel] || [];
        newData.hiddenItems.subtabs = {
          ...newData.hiddenItems.subtabs,
          [parentLabel]: isChecked
            ? parentSubtabs.filter(l => l !== label)
            : [...parentSubtabs, label]
        };
      }
      
      return newData;
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    for (const key in formData) {
      if (!formData[key] && key !== "hiddenItems") {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await postAPI("/auth/createuser", formData);

      const safeHiddenItems = {
        labels: formData.hiddenItems.labels.filter(l => l !== "Admin"),
        subtabs: formData.hiddenItems.subtabs
      };

      localStorage.setItem(
        `admin_hiddenItems_${formData.email}`,
        JSON.stringify(safeHiddenItems)
      );

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: `admin_hiddenItems_${formData.email}`,
          newValue: JSON.stringify(safeHiddenItems),
        })
      );

      toast.success(response.data.message);
      navigate("/super-admin/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderToggleSwitches = () => {
    return allSidebarLabels.mainLabels.map((label) => {
      const isLabelHidden = formData.hiddenItems.labels.includes(label);
      const hasSubtabs = allSidebarLabels.subtabs[label];
      
      return (
        <React.Fragment key={label}>
          <div className="col-12 col-md-6 mb-2">
            <div className="d-flex justify-content-between align-items-center px-2">
              <label className="mb-0">
                {label}
                {label === "Admin" && <small className="text-muted"> (Required)</small>}
              </label>
              <label className="switch" style={{ transform: "scale(0.8)" }}>
                <input
                  type="checkbox"
                  checked={!isLabelHidden}
                  onChange={(e) => handleToggleItem('label', null, label, e.target.checked)}
                  disabled={label === "Admin"}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {hasSubtabs && !isLabelHidden && (
            <div className="col-12 pl-4">
              {allSidebarLabels.subtabs[label].map((subLabel) => {
                const isSubtabHidden = (formData.hiddenItems.subtabs[label] || []).includes(subLabel);
                return (
                  <div className="col-12 col-md-6 mb-2" key={`${label}-${subLabel}`}>
                    <div className="d-flex justify-content-between align-items-center px-2">
                      <label className="mb-0 text-muted">
                        {subLabel}
                      </label>
                      <label className="switch" style={{ transform: "scale(0.7)" }}>
                        <input
                          type="checkbox"
                          checked={!isSubtabHidden}
                          onChange={(e) => 
                            handleToggleItem('subtab', label, subLabel, e.target.checked)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="container-fluid">
      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        .scrollable-modal-body {
          max-height: 70vh;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .scrollable-modal-body {
            max-height: 60vh;
          }
        }
      `}</style>

      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Create Admin</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left"></i> Back
        </button>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body scrollable-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <label className="form-label">Sidebar Visibility Controls</label>
                  <small className="d-block text-muted mb-2">
                    Toggle OFF to hide items for this admin
                  </small>
                  <div className="row">
                    {renderToggleSwitches()}
                  </div>
                </div>

                <div className="form-group d-flex justify-content-end flex-wrap">
                  <button
                    type="button"
                    className="btn btn-secondary "
                    style={{ marginRight: "16px" }}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-20 w-md-auto"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;



// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";
// import { useNavigate } from "react-router-dom";
// import { allSidebarLabels } from "../../Sidebar/sidebar";

// export const allSidebarLabels = [
//   { label: "Dashboard", subLabels: [] },
//   ...(typeof window !== "undefined" &&
//   localStorage.getItem("email") === "shantu131201@gmail.com"
//     ? [{ label: "Admin", subLabels: [] }]
//     : []),
//   { label: "Blogs", subLabels: [] },
//   {
//     label: "Artist",
//     subLabels: [
//       "Management", "Blog Request", "Blogs", "Product Request", "Products", "Sold Product"
//     ]
//   },
//   {
//     label: "Buyer",
//     subLabels: [
//       "Management", "Product Purchased", "Resell Product Request", "Sold Product"
//     ]
//   },
//   {
//     label: "Seller",
//     subLabels: [
//       "Management", "Products", "Product Request", "Sold  Product"
//     ]
//   },
//   { label: "Product", subLabels: [] },
//   { label: "Custom Order", subLabels: [] },
//   { label: "Product Purchased", subLabels: [] },
//   {
//     label: "Bidding",
//     subLabels: ["All Products", "Bidded Product", "Bidding Pass"]
//   },
//   { label: "Certification Services", subLabels: [] },
//   { label: "Sponsor", subLabels: [] },
//   {
//     label: "Settings",
//     subLabels: ["Product Category", "Blog Category", "Email Setting", "Marketing"]
//   }
// ];

// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";
// import { useNavigate } from "react-router-dom";

// export const allSidebarLabels = [
//   { label: "Dashboard", subLabels: [] },
//   ...(typeof window !== "undefined" &&
//   localStorage.getItem("email") === "shantu131201@gmail.com"
//     ? [{ label: "Admin", subLabels: [] }]
//     : []),
//   { label: "Blogs", subLabels: [] },
//   {
//     label: "Artist",
//     subLabels: [
//       "Management", "Blog Request", "Blogs", "Product Request", "Products", "Sold Product"
//     ]
//   },
//   {
//     label: "Buyer",
//     subLabels: [
//       "Management", "Product Purchased", "Resell Product Request", "Sold Product"
//     ]
//   },
//   {
//     label: "Seller",
//     subLabels: [
//       "Management", "Products", "Product Request", "Sold  Product"
//     ]
//   },
//   { label: "Product", subLabels: [] },
//   { label: "Custom Order", subLabels: [] },
//   { label: "Product Purchased", subLabels: [] },
//   {
//     label: "Bidding",
//     subLabels: ["All Products", "Bidded Product", "Bidding Pass"]
//   },
//   { label: "Certification Services", subLabels: [] },
//   { label: "Sponsor", subLabels: [] },
//   {
//     label: "Settings",
//     subLabels: ["Product Category", "Blog Category", "Email Setting", "Marketing"]
//   }
// ];

// const CreateAdminModal = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "Super-Admin",
//     role: "super-admin",
//     hiddenLabels: [],
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleToggleLabel = (label, isChecked) => {
//     const updatedHiddenLabels = isChecked
//       ? formData.hiddenLabels.filter((l) => l !== label)
//       : [...formData.hiddenLabels, label];
//     setFormData({ ...formData, hiddenLabels: updatedHiddenLabels });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     for (const key in formData) {
//       if (!formData[key] && key !== "hiddenLabels") {
//         toast.error("Please fill in all fields");
//         setLoading(false);
//         return;
//       }
//     }

//     if (!isValidEmail(formData.email)) {
//       toast.error("Invalid email format");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await postAPI("/auth/createuser", formData);
//       const safeHidden = formData.hiddenLabels.filter((l) => l !== "Admin");

//       localStorage.setItem(
//         `admin_hiddenLabels_${formData.email}`,
//         JSON.stringify(safeHidden)
//       );

//       window.dispatchEvent(
//         new StorageEvent("storage", {
//           key: `admin_hiddenLabels_${formData.email}`,
//           newValue: JSON.stringify(safeHidden),
//         })
//       );

//       toast.success(response.data.message);
//       navigate("/super-admin/admin");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isHidden = (label) => formData.hiddenLabels.includes(label);

//   return (
//     <div className="container-fluid">
//       <div className="block-header d-flex justify-content-between align-items-center">
//         <h2>Create Admin</h2>
//         <button className="btn btn-secondary" onClick={() => navigate(-1)}>
//           <i className="fa fa-arrow-left"></i> Back
//         </button>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body scrollable-modal-body">
//               <form onSubmit={handleSubmit}>
//                 {/* Fields */}
//                 {["firstName", "lastName", "email"].map((field) => (
//                   <div className="form-group" key={field}>
//                     <label>{field.replace(/([A-Z])/g, " $1")}</label>
//                     <input
//                       type={field === "email" ? "email" : "text"}
//                       className="form-control"
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 ))}

//                 {/* Password Fields */}
//                 {["password", "confirmPassword"].map((field, i) => (
//                   <div className="form-group" key={field}>
//                     <label>{field.replace(/([A-Z])/g, " $1")}</label>
//                     <div className="input-group">
//                       <input
//                         type={(i ? showConfirmPassword : showPassword) ? "text" : "password"}
//                         className="form-control"
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         required
//                       />
//                       <div className="input-group-append">
//                         <span
//                           className="input-group-text"
//                           onClick={() =>
//                             i ? setShowConfirmPassword(!showConfirmPassword)
//                               : setShowPassword(!showPassword)
//                           }
//                           style={{ cursor: "pointer" }}
//                         >
//                           <i className={`fa ${i ? showConfirmPassword : showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Toggle Section */}
//                 <div className="form-group mt-4">
//                   <label className="form-label">Sidebar Tab Visibility</label>
//                   <small className="d-block text-muted mb-2">
//                     (Toggle OFF to hide for this admin)
//                   </small>
//                   <div className="row">
//                     {allSidebarLabels.map(({ label, subLabels }) => {
//                       const checked = !isHidden(label);
//                       return (
//                         <div key={label} className="col-12 mb-2">
//                           <div className="d-flex justify-content-between align-items-center px-2">
//                             <label className="mb-0">
//                               {label}
//                             </label>
//                             <label className="switch" style={{ transform: "scale(0.8)" }}>
//                               <input
//                                 type="checkbox"
//                                 checked={checked}
//                                 onChange={(e) =>
//                                   handleToggleLabel(label, e.target.checked)
//                                 }
//                                 disabled={label === "Admin"}
//                               />
//                               <span className="slider round"></span>
//                             </label>
//                           </div>

//                           {/* Show subLabels only if parent is visible */}
//                           {checked && subLabels?.length > 0 && (
//                             <div className="ml-4 mt-2">
//                               {subLabels.map((sub) => {
//                                 const subChecked = !isHidden(sub);
//                                 return (
//                                   <div
//                                     className="d-flex justify-content-between align-items-center px-2"
//                                     key={`${label}-${sub}`}
//                                   >
//                                     <label className="mb-0">{sub}</label>
//                                     <label className="switch" style={{ transform: "scale(0.7)" }}>
//                                       <input
//                                         type="checkbox"
//                                         checked={subChecked}
//                                         onChange={(e) =>
//                                           handleToggleLabel(sub, e.target.checked)
//                                         }
//                                       />
//                                       <span className="slider round"></span>
//                                     </label>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="form-group d-flex justify-content-end flex-wrap">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     style={{ marginRight: "16px" }}
//                     onClick={() => navigate(-1)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? "Creating..." : "Create Admin"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;





    
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// // All Sidebar Labels & Sub-labels
// export const allSidebarLabels = [
//   { label: "Dashboard" },
//   { label: "Admin", alwaysVisible: true },
//   { label: "Blogs" },
//   { label: "Artist" },
//   { label: "Buyer" },
//   { label: "Seller" },
//   {
//     label: "Product",
//     subLabels: ["Add Product", "Edit Product", "Delete Product"]
//   },
//   {
//     label: "Custom Order",
//     subLabels: ["Create Order", "Track Order"]
//   },
//   { label: "Product Purchased" },
//   { label: "Bidding" },
//   { label: "Certification Services" },
//   { label: "Sponsor" },
//   { label: "Settings" }
// ];

// const CreateAdminModal = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     hiddenLabels: [],
//     hiddenSubLabels: {}
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Toggle main label visibility
//   const handleToggleLabel = (label, checked) => {
//     setFormData(prev => {
//       let updated = { ...prev };

//       if (checked) {
//         // toggle ON → label should be VISIBLE → REMOVE from hiddenLabels
//         updated.hiddenLabels = prev.hiddenLabels.filter(l => l !== label);
//       } else {
//         // toggle OFF → label should be HIDDEN → ADD to hiddenLabels
//         updated.hiddenLabels = [...new Set([...prev.hiddenLabels, label])];
//       }

//       // If toggling OFF parent, also hide all subLabels
//       const labelObj = allSidebarLabels.find(item => item.label === label);
//       if (!checked && labelObj?.subLabels) {
//         updated.hiddenSubLabels[label] = labelObj.subLabels;
//       } else if (checked) {
//         delete updated.hiddenSubLabels[label];
//       }

//       return updated;
//     });
//   };

//   // Toggle individual sub-label
//   const handleToggleSubLabel = (parentLabel, subLabel, checked) => {
//     setFormData(prev => {
//       const updatedHidden = { ...prev.hiddenSubLabels };

//       const currentHidden = updatedHidden[parentLabel] || [];

//       if (!checked) {
//         // Hide sublabel
//         updatedHidden[parentLabel] = [...new Set([...currentHidden, subLabel])];
//       } else {
//         // Show sublabel
//         updatedHidden[parentLabel] = currentHidden.filter(s => s !== subLabel);
//       }

//       return {
//         ...prev,
//         hiddenSubLabels: updatedHidden
//       };
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async e => {
//     e.preventDefault();
//     const { email, hiddenLabels } = formData;

//     if (!email.trim()) {
//       toast.error("Please enter email");
//       return;
//     }

//     setLoading(true);
//     try {
//       // API call to create admin with sidebar visibility preferences
//       await axios.post("/api/create-admin", formData);

//       toast.success("Admin created successfully!");
//       navigate(-1); // Go back
//     } catch (error) {
//       toast.error("Failed to create admin");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h2>Create Admin</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Email Input */}
//         <div className="form-group mb-3">
//           <label className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             placeholder="admin@example.com"
//             value={formData.email}
//             onChange={e =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//             required
//           />
//         </div>

//         {/* Sidebar Label Toggle */}
//         <div className="form-group mt-4">
//           <label className="form-label">Sidebar Tab Visibility</label>
//           <small className="d-block text-muted mb-2">
//             (Toggle ON to make visible for this admin)
//           </small>
//           <div className="row">
//             {allSidebarLabels.map(item => {
//               const label = item.label;
//               const isChecked = !formData.hiddenLabels.includes(label);
//               const isDisabled = item.alwaysVisible;

//               return (
//                 <div className="col-12 col-md-6 mb-3" key={label}>
//                   <div className="d-flex align-items-center justify-content-between">
//                     <label className="mb-0">
//                       {label}{" "}
//                       {isDisabled && (
//                         <small className="text-muted">(Always visible)</small>
//                       )}
//                     </label>
//                     <label className="switch">
//                       <input
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={e =>
//                           handleToggleLabel(label, e.target.checked)
//                         }
//                         disabled={isDisabled}
//                       />
//                       <span className="slider round"></span>
//                     </label>
//                   </div>

//                   {/* Show sub-labels if parent is ON */}
//                   {item.subLabels && isChecked && (
//                     <div className="ms-4 mt-2">
//                       {item.subLabels.map(sub => {
//                         const subHidden =
//                           formData.hiddenSubLabels[label] || [];
//                         const isSubChecked = !subHidden.includes(sub);

//                         return (
//                           <div
//                             className="d-flex justify-content-between mb-1"
//                             key={sub}
//                           >
//                             <small>{sub}</small>
//                             <label className="switch small">
//                               <input
//                                 type="checkbox"
//                                 checked={isSubChecked}
//                                 onChange={e =>
//                                   handleToggleSubLabel(
//                                     label,
//                                     sub,
//                                     e.target.checked
//                                   )
//                                 }
//                               />
//                               <span className="slider round small"></span>
//                             </label>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="form-group d-flex justify-content-end gap-2 mt-4">
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Create Admin"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAdminModal;



// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// // import { menuConfig } from "../../Sidebar/menuConfig";
//  import { allSidebarLabels } from "../../Sidebar/sidebar";

// const CreateAdminModal = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     password: "",
//     hiddenLabels: [],
//     hiddenSubLabels: []
//   });

//   useEffect(() => {
//     const email = formData.email;
//     if (email) {
//       const savedLabels = JSON.parse(localStorage.getItem(`admin_hiddenLabels_${email}`)) || [];
//       const savedSubLabels = JSON.parse(localStorage.getItem(`admin_hiddenSubLabels_${email}`)) || [];
//       setFormData(prev => ({
//         ...prev,
//         hiddenLabels: savedLabels,
//         hiddenSubLabels: savedSubLabels
//       }));
//     }
//   }, [formData.email]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleToggleLabel = (label, isChecked) => {
//     const updatedHiddenLabels = isChecked
//       ? formData.hiddenLabels.filter((l) => l !== label)
//       : [...formData.hiddenLabels, label];

//     setFormData({ ...formData, hiddenLabels: updatedHiddenLabels });
//   };

//   const handleToggleSubLabel = (subLabel, isChecked) => {
//     const updatedHiddenSubLabels = isChecked
//       ? formData.hiddenSubLabels.filter((l) => l !== subLabel)
//       : [...formData.hiddenSubLabels, subLabel];

//     setFormData({ ...formData, hiddenSubLabels: updatedHiddenSubLabels });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const safeHidden = formData.hiddenLabels.filter((l) => l !== "Admin");
//     const safeHiddenSub = formData.hiddenSubLabels;

//     localStorage.setItem(`admin_hiddenLabels_${formData.email}`, JSON.stringify(safeHidden));
//     localStorage.setItem(`admin_hiddenSubLabels_${formData.email}`, JSON.stringify(safeHiddenSub));

//     toast.success("Admin settings saved!");
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Create Admin</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <div className="form-group mt-4">
//             <label className="form-label">Sidebar Tab Visibility</label>
//             <small className="d-block text-muted mb-2">
//               (Toggle OFF to hide tab for this admin)
//             </small>
//             <div className="row">
//               {/* {allSidebarLabels.map((label) => {
//                 const checked = !formData.hiddenLabels.includes(label);
//                 const subTabs = menuConfig["Super-Admin"]?.find((item) => item.label === label)?.subTabs || []; */}

//                 return (
//                   <div className="col-12 mb-2" key={label}>
//                     <div className="d-flex justify-content-between align-items-center px-2">
//                       <label className="mb-0">{label}</label>
//                       <label className="switch" style={{ transform: "scale(0.8)" }}>
//                         <input
//                           type="checkbox"
//                           checked={checked}
//                           onChange={(e) => handleToggleLabel(label, e.target.checked)}
//                           disabled={label === "Admin"}
//                         />
//                         <span className="slider round"></span>
//                       </label>
//                     </div>

//                     {checked && subTabs.length > 0 && (
//                       <ul className="ml-4 mt-2">
//                         {subTabs.map((sub) => {
//                           const subChecked = !formData.hiddenSubLabels.includes(sub.label);
//                           return (
//                             <li key={sub.label} className="d-flex justify-content-between align-items-center mb-1">
//                               <small>{sub.label}</small>
//                               <label className="switch" style={{ transform: "scale(0.7)" }}>
//                                 <input
//                                   type="checkbox"
//                                   checked={subChecked}
//                                   onChange={(e) => handleToggleSubLabel(sub.label, e.target.checked)}
//                                 />
//                                 <span className="slider round"></span>
//                               </label>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <button type="submit">Save Admin</button>
//           <button type="button" onClick={onClose}>Cancel</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminModal;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
//  import { allSidebarLabels } from "../../Sidebar/sidebar";

// const CreateAdminModal = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     hiddenLabels: []
//   });

//   const [loading, setLoading] = useState(false);
//   const [labelVisibility, setLabelVisibility] = useState({});
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     // Initialize label visibility
//     const visibilityState = {};
//     allSidebarLabels.forEach(label => {
//       const [parent] = label.split("::");
//       if (!visibilityState.hasOwnProperty(parent)) {
//         visibilityState[parent] = true; // by default visible
//       }
//     });
//     setLabelVisibility(visibilityState);
//   }, []);

//   // Handle toggle (ON means visible = not hidden)
//   const handleToggleLabel = (label, isChecked) => {
//     const updatedHidden = isChecked
//       ? formData.hiddenLabels.filter(l => l !== label)
//       : [...formData.hiddenLabels, label];

//     setFormData(prev => ({
//       ...prev,
//       hiddenLabels: updatedHidden
//     }));

//     const [parent] = label.split("::");
//     if (!label.includes("::")) {
//       setLabelVisibility(prev => ({
//         ...prev,
//         [parent]: isChecked
//       }));
//     }
//   };

//   const handleInputChange = e => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Here you can make API call to create admin
//       console.log("Creating admin with:", formData);
//       // Simulate success
//       setTimeout(() => {
//         localStorage.setItem(
//           `admin_hiddenLabels_${formData.email}`,
//           JSON.stringify(formData.hiddenLabels)
//         );
//         setLoading(false);
//         navigate(-1); // go back
//       }, 1000);
//     } catch (error) {
//       console.error("Error creating admin", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h4>Create Admin</h4>
//       <form onSubmit={handleSubmit}>
//         {/* Email Input */}
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* Toggle Sidebar Labels */}
//         <div className="form-group mt-4">
//           <label className="form-label">Sidebar Tab Visibility</label>
//           <small className="d-block text-muted mb-2">
//             (Toggle ON to show tab for this admin)
//           </small>
//           <div className="row">
//             {allSidebarLabels.map((label) => {
//               const isSubLabel = label.includes("::");
//               const [parent, child] = label.split("::");

//               // Determine checked state
//               const checked = !formData.hiddenLabels.includes(label);

//               // Hide sub-labels if parent is OFF
//               if (isSubLabel && !labelVisibility[parent]) return null;

//               return (
//                 <div
//                   className={`col-6 col-md-4 mb-2 ${isSubLabel ? "ms-4 ps-3" : ""}`}
//                   key={label}
//                 >
//                   <div className="d-flex align-items-center justify-content-between">
//                     <label className="mb-0">
//                       {isSubLabel ? child : parent}{" "}
//                       {label === "Admin" && (
//                         <small className="text-muted">(Always visible)</small>
//                       )}
//                     </label>
//                     <label className="switch">
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={(e) => handleToggleLabel(label, e.target.checked)}
//                         disabled={label === "Admin" && email === "shantu131201@gmail.com"}
//                       />
//                       <span className="slider round"></span>
//                     </label>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="form-group d-flex justify-content-end gap-2 mt-4">
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Create Admin"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAdminModal;
