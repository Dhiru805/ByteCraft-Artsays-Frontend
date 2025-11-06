// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import putAPI from "../../../../api/putAPI";
// import getAPI from "../../../../api/getAPI";
// import axiosInstance from "../../../../api/axiosConfig";

// const InsuranceEdit = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const page = state?.page;

//   const [formData, setFormData] = useState({
//     section1Heading: "",
//     section1Description: "",
//     section1Cards: [],
//     section2Heading: "",
//     section2Description: "",
//     section2Cards: [],
//     section3Heading: "",
//     section3Description: "",
//     status: "draft",
//   });

//   const [section1Previews, setSection1Previews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [existingPublishedCount, setExistingPublishedCount] = useState(0);

//   useEffect(() => {
//     if (!page) {
//       toast.error("No insurance page provided.");
//       navigate("/super-admin/insurance");
//       return;
//     }

//     setFormData({
//       section1Heading: page.section1Heading || page.section1?.heading || "",
//       section1Description: page.section1Description || page.section1?.description || "",
//       section1Cards: (page.section1Cards || page.section1?.cards || []).map((c) => ({
//         title: c.title || "",
//         description: c.description || "",
//         image: null,
//         existingImage: c.image || null,
//       })),
//       section2Heading: page.section2Heading || page.section2?.heading || "",
//       section2Description: page.section2Description || page.section2?.description || "",
//       section2Cards: (page.section2Cards || page.section2?.cards || []).map((c) => ({
//         title: c.title || "",
//         description: c.description || "",
//       })),
//       section3Heading: page.section3Heading || "",
//       section3Description: page.section3Description || "",
//       status: page.status || "draft",
//     });

//     const base = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
//     setSection1Previews(
//       (page.section1Cards || page.section1?.cards || []).map((c) =>
//         c.image ? `${base}/${c.image}` : null
//       )
//     );

//     (async () => {
//       try {
//         const res = await getAPI("/api/insurance");
//         const data = Array.isArray(res.data.data) ? res.data.data : [];
//         setExistingPublishedCount(
//           data.filter((d) => d.status === "published" && d._id !== page._id).length
//         );
//       } catch (err) {
//         console.warn("Could not fetch insurance pages list", err);
//       }
//     })();
//   }, [page, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const validateImageFile = (file, friendlyName) => {
//     if (!file.type.match(/image\/(jpeg|png)/)) {
//       toast.error(`${friendlyName} must be JPEG or PNG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${friendlyName} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const addSection1Card = () => {
//     setFormData((p) => ({
//       ...p,
//       section1Cards: [...p.section1Cards, { title: "", description: "", image: null, existingImage: null }],
//     }));
//     setSection1Previews((p) => [...p, null]);
//   };

//   const updateSection1Card = (index, field, value) => {
//     setFormData((p) => {
//       const copy = [...p.section1Cards];
//       copy[index][field] = value;
//       return { ...p, section1Cards: copy };
//     });
//   };

//   const updateSection1CardImage = (index, file) => {
//     if (!file) return;
//     if (!validateImageFile(file, "Section 1 Card Image")) return;
//     setFormData((p) => {
//       const copy = [...p.section1Cards];
//       copy[index].image = file;
//       return { ...p, section1Cards: copy };
//     });
//     setSection1Previews((p) => {
//       const copy = [...p];
//       copy[index] = URL.createObjectURL(file);
//       return copy;
//     });
//   };

//   const removeSection1Card = (index) => {
//     setFormData((p) => {
//       const copy = [...p.section1Cards];
//       copy.splice(index, 1);
//       return { ...p, section1Cards: copy };
//     });
//     setSection1Previews((p) => {
//       const copy = [...p];
//       copy.splice(index, 1);
//       return copy;
//     });
//   };

//   const removeSection1CardImage = (index) => {
//     setFormData((p) => {
//       const copy = [...p.section1Cards];
//       copy[index].image = null;
//       copy[index].existingImage = null;
//       return { ...p, section1Cards: copy };
//     });
//     setSection1Previews((p) => {
//       const copy = [...p];
//       copy[index] = null;
//       return copy;
//     });
//   };

//   const addSection2Card = () => {
//     setFormData((p) => ({
//       ...p,
//       section2Cards: [...p.section2Cards, { title: "", description: "" }],
//     }));
//   };

//   const updateSection2Card = (index, field, value) => {
//     setFormData((p) => {
//       const copy = [...p.section2Cards];
//       copy[index][field] = value;
//       return { ...p, section2Cards: copy };
//     });
//   };

//   const removeSection2Card = (index) => {
//     setFormData((p) => {
//       const copy = [...p.section2Cards];
//       copy.splice(index, 1);
//       return { ...p, section2Cards: copy };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!formData.section1Heading.trim() || !formData.section1Description.trim()) {
//         toast.error("Section 1 heading and description are required");
//         setLoading(false);
//         return;
//       }

//       if (formData.status === "published" && existingPublishedCount > 0) {
//         const confirm = window.confirm(
//           `There are ${existingPublishedCount} other published insurance page(s). Publish this and unpublish others?`
//         );
//         if (!confirm) {
//           setLoading(false);
//           return;
//         }
//         try {
//           await axiosInstance.put("/api/insurance/published");
//         } catch (err) {
//           console.warn("unpublishAll failed (maybe not available)", err);
//         }
//       }

//       const submission = new FormData();
//       submission.append("section1Heading", formData.section1Heading.trim());
//       submission.append("section1Description", formData.section1Description.trim());
//       submission.append("section2Heading", formData.section2Heading.trim());
//       submission.append("section2Description", formData.section2Description.trim());
//       submission.append("section3Heading", formData.section3Heading.trim());
//       submission.append("section3Description", formData.section3Description.trim());
//       submission.append("status", formData.status);

//       formData.section1Cards.forEach((c, i) => {
//         submission.append(`section1Cards[${i}][title]`, (c.title || "").trim());
//         submission.append(`section1Cards[${i}][description]`, (c.description || "").trim());
//         if (c.image instanceof File) {
//           submission.append(`section1Cards[${i}][image]`, c.image);
//         } else if (c.existingImage) {
//           submission.append(`section1Cards[${i}][existingImage]`, c.existingImage);
//         }
//       });

//       formData.section2Cards.forEach((c, i) => {
//         submission.append(`section2Cards[${i}][title]`, (c.title || "").trim());
//         submission.append(`section2Cards[${i}][description]`, (c.description || "").trim());
//       });

//       const res = await putAPI(`/api/insurance/update/${page._id}`, submission, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data?.data) {
//         toast.success(res.data.message || "Insurance page updated successfully.");
//         navigate("/super-admin/insurance", { state: { reload: true } });
//       } else {
//         toast.error(res.data?.message || "Failed to update insurance page");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Edit Insurance Page</h2>
//       </div>

//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         {/* Section 1 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 1</h5>
//           <div className="form-group">
//             <label>Section 1 Heading</label>
//             <input
//               name="section1Heading"
//               className="form-control"
//               value={formData.section1Heading}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Section 1 Description</label>
//             <textarea
//               name="section1Description"
//               rows={3}
//               className="form-control"
//               value={formData.section1Description}
//               onChange={handleChange}
//             />
//           </div>

//           <h6>Cards</h6>
//           {formData.section1Cards.map((card, idx) => (
//             <div key={idx} className="border p-2 mb-3">
//               <div className="form-group">
//                 <label>Card Title</label>
//                 <input
//                   className="form-control"
//                   value={card.title}
//                   onChange={(e) => updateSection1Card(idx, "title", e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Card Description</label>
//                 <textarea
//                   className="form-control"
//                   rows={2}
//                   value={card.description}
//                   onChange={(e) => updateSection1Card(idx, "description", e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Card Image</label>
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png"
//                   className="form-control"
//                   onChange={(e) => updateSection1CardImage(idx, e.target.files[0])}
//                 />
//                 {section1Previews[idx] && (
//                   <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
//                     <img
//                       src={section1Previews[idx]}
//                       alt="s1-preview"
//                       style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 6 }}
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-sm btn-danger"
//                       style={{ position: "absolute", top: -6, right: -6 }}
//                       onClick={() => removeSection1CardImage(idx)}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection1Card(idx)}>
//                 Remove Card
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addSection1Card}>
//             + Add Card
//           </button>
//         </div>

//         {/* Section 2 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 2</h5>
//           <div className="form-group">
//             <label>Section 2 Heading</label>
//             <input
//               name="section2Heading"
//               className="form-control"
//               value={formData.section2Heading}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Section 2 Description</label>
//             <textarea
//               name="section2Description"
//               rows={3}
//               className="form-control"
//               value={formData.section2Description}
//               onChange={handleChange}
//             />
//           </div>

//           <h6>Cards</h6>
//           {formData.section2Cards.map((card, idx) => (
//             <div key={idx} className="border p-2 mb-3">
//               <div className="form-group">
//                 <label>Title</label>
//                 <input
//                   className="form-control"
//                   value={card.title}
//                   onChange={(e) => updateSection2Card(idx, "title", e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Description</label>
//                 <textarea
//                   className="form-control"
//                   rows={2}
//                   value={card.description}
//                   onChange={(e) => updateSection2Card(idx, "description", e.target.value)}
//                 />
//               </div>
//               <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection2Card(idx)}>
//                 Remove Card
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addSection2Card}>
//             + Add Card
//           </button>
//         </div>

//         {/* Section 3 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 3</h5>
//           <div className="form-group">
//             <label>Section 3 Heading</label>
//             <input
//               name="section3Heading"
//               className="form-control"
//               value={formData.section3Heading}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Section 3 Description</label>
//             <textarea
//               name="section3Description"
//               rows={3}
//               className="form-control"
//               value={formData.section3Description}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Status</h5>
//           <select
//             name="status"
//             className="form-control"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>
//         </div>

//         <div className="d-flex" style={{ gap: 12 }}>
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? "Updating..." : "Update Insurance Page"}
//           </button>
//           <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default InsuranceEdit;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import getAPI from "../../../../api/getAPI";
// import putAPI from "../../../../api/putAPI";

// const InsuranceEdit = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     section1Heading: "",
//     section1Description: "",
//     section1Cards: [],
//     section2Heading: "",
//     section2Description: "",
//     section2Cards: [],
//     section3Heading: "",
//     section3Description: "",
//     section3Cards: [],
//     status: "draft",
//   });

//   const [previews, setPreviews] = useState({
//     section1Cards: [],
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getAPI(`/api/insurance/${id}`);
//         const data = res.data;

//         setFormData({
//           section1Heading: data.section1Heading || "",
//           section1Description: data.section1Description || "",
//           section1Cards: data.section1Cards || [],
//           section2Heading: data.section2Heading || "",
//           section2Description: data.section2Description || "",
//           section2Cards: data.section2Cards || [],
//           section3Heading: data.section3Heading || "",
//           section3Description: data.section3Description || "",
//           section3Cards: data.section3Cards || [],
//           status: data.status || "draft",
//         });

//         setPreviews({
//           section1Cards: (data.section1Cards || []).map((card) => card.image || null),
//         });
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load insurance data");
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const updateSection1Card = (index, field, value) => {
//     const updated = [...formData.section1Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section1Cards: updated });

//     if (field === "image") {
//       const updatedPreviews = [...previews.section1Cards];
//       updatedPreviews[index] = value ? URL.createObjectURL(value) : null;
//       setPreviews({ ...previews, section1Cards: updatedPreviews });
//     }
//   };

//   const addSection1Card = () => {
//     setFormData({
//       ...formData,
//       section1Cards: [...formData.section1Cards, { image: null, title: "", description: "" }],
//     });
//     setPreviews({ ...previews, section1Cards: [...previews.section1Cards, null] });
//   };

//   const removeSection1Card = (index) => {
//     const updated = [...formData.section1Cards];
//     const updatedPreviews = [...previews.section1Cards];
//     updated.splice(index, 1);
//     updatedPreviews.splice(index, 1);
//     setFormData({ ...formData, section1Cards: updated });
//     setPreviews({ ...previews, section1Cards: updatedPreviews });
//   };

//   const addSection2Card = () => {
//     setFormData({
//       ...formData,
//       section2Cards: [...formData.section2Cards, { title: "", description: "" }],
//     });
//   };

//   const updateSection2Card = (index, field, value) => {
//     const updated = [...formData.section2Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section2Cards: updated });
//   };

//   const removeSection2Card = (index) => {
//     const updated = [...formData.section2Cards];
//     updated.splice(index, 1);
//     setFormData({ ...formData, section2Cards: updated });
//   };

//   const addSection3Card = () => {
//     setFormData({
//       ...formData,
//       section3Cards: [
//         ...formData.section3Cards,
//         {
//           heading: "",
//           description: "",
//           price: "",
//           cancelCondition: "",
//           eligibility: "",
//           pointers: [],
//         },
//       ],
//     });
//   };

//   const updateSection3Card = (index, field, value) => {
//     const updated = [...formData.section3Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const removeSection3Card = (index) => {
//     const updated = [...formData.section3Cards];
//     updated.splice(index, 1);
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const addPointer = (cardIndex) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers.push("");
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const updatePointer = (cardIndex, pointerIndex, value) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers[pointerIndex] = value;
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const removePointer = (cardIndex, pointerIndex) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers.splice(pointerIndex, 1);
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();

//       Object.keys(formData).forEach((key) => {
//         if (Array.isArray(formData[key])) return;
//         data.append(key, formData[key]);
//       });

//       formData.section1Cards.forEach((card, i) => {
//         data.append(`section1Cards[${i}][title]`, card.title);
//         data.append(`section1Cards[${i}][description]`, card.description);
//         if (card.image && typeof card.image !== "string")
//           data.append(`section1Cards[${i}][image]`, card.image);
//       });

//       formData.section2Cards.forEach((card, i) => {
//         data.append(`section2Cards[${i}][title]`, card.title);
//         data.append(`section2Cards[${i}][description]`, card.description);
//       });

//       formData.section3Cards.forEach((card, i) => {
//         data.append(`section3Cards[${i}][heading]`, card.heading);
//         data.append(`section3Cards[${i}][description]`, card.description);
//         data.append(`section3Cards[${i}][price]`, card.price);
//         data.append(`section3Cards[${i}][cancelCondition]`, card.cancelCondition);
//         data.append(`section3Cards[${i}][eligibility]`, card.eligibility);
//         card.pointers.forEach((p, j) => {
//           data.append(`section3Cards[${i}][pointers][${j}]`, p);
//         });
//       });

//       await putAPI(`/api/insurance/update/${id}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Insurance page updated successfully!");
//       navigate("/super-admin/insurance");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to update insurance page");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Edit Insurance Page</h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Section 1 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 1</h5>
//           <input
//             name="section1Heading"
//             placeholder="Section 1 Heading"
//             className="form-control mb-2"
//             value={formData.section1Heading}
//             onChange={handleChange}
//           />
//           <textarea
//             name="section1Description"
//             placeholder="Section 1 Description"
//             className="form-control mb-2"
//             value={formData.section1Description}
//             onChange={handleChange}
//           />
//           <h6>Cards (Image, Title, Description)</h6>
//           {formData.section1Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <label>Card Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) => updateSection1Card(index, "image", e.target.files[0])}
//               />
//               {previews.section1Cards[index] && (
//                 <img
//                   src={previews.section1Cards[index]}
//                   alt="Preview"
//                   className="img-thumbnail mb-2"
//                   style={{ width: "150px", height: "auto" }}
//                 />
//               )}
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateSection1Card(index, "title", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) => updateSection1Card(index, "description", e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection1Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addSection1Card}>
//             + Add Section 1 Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Section 2</h5>
//           <input
//             name="section2Heading"
//             placeholder="Section 2 Heading"
//             className="form-control mb-2"
//             value={formData.section2Heading}
//             onChange={handleChange}
//           />
//           <textarea
//             name="section2Description"
//             placeholder="Section 2 Description"
//             className="form-control mb-2"
//             value={formData.section2Description}
//             onChange={handleChange}
//           />
//           <h6>Cards (Title, Description)</h6>
//           {formData.section2Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateSection2Card(index, "title", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) => updateSection2Card(index, "description", e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection2Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addSection2Card}>
//             + Add Section 2 Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Section 3</h5>
//           <input
//             name="section3Heading"
//             placeholder="Section 3 Heading"
//             className="form-control mb-2"
//             value={formData.section3Heading}
//             onChange={handleChange}
//           />
//           <textarea
//             name="section3Description"
//             placeholder="Section 3 Description"
//             className="form-control mb-2"
//             value={formData.section3Description}
//             onChange={handleChange}
//           />

//           <h6>Cards</h6>
//           {formData.section3Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Heading"
//                 value={card.heading}
//                 onChange={(e) => updateSection3Card(index, "heading", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) => updateSection3Card(index, "description", e.target.value)}
//               />
//               <input
//                 className="form-control mb-2"
//                 placeholder="Price"
//                 value={card.price}
//                 onChange={(e) => updateSection3Card(index, "price", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2 small"
//                 placeholder="Cancel Condition"
//                 value={card.cancelCondition}
//                 onChange={(e) => updateSection3Card(index, "cancelCondition", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Eligibility"
//                 value={card.eligibility}
//                 onChange={(e) => updateSection3Card(index, "eligibility", e.target.value)}
//               />

//               <div className="mt-2">
//                 <h6>Pointers</h6>
//                 {card.pointers.map((pointer, pIndex) => (
//                   <div key={pIndex} className="d-flex mb-2">
//                     <input
//                       className="form-control me-2"
//                       placeholder={`Pointer ${pIndex + 1}`}
//                       value={pointer}
//                       onChange={(e) => updatePointer(index, pIndex, e.target.value)}
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-danger btn-sm"
//                       onClick={() => removePointer(index, pIndex)}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   className="btn btn-secondary btn-sm"
//                   onClick={() => addPointer(index)}
//                 >
//                   + Add Pointer
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm mt-3"
//                 onClick={() => removeSection3Card(index)}
//               >
//                 Remove Card
//               </button>
//             </div>
//           ))}

//           <button type="button" className="btn btn-primary" onClick={addSection3Card}>
//             + Add Section 3 Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Status</h5>
//           <select
//             name="status"
//             className="form-control mb-2"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>
//         </div>

//         <button type="submit" className="btn btn-success">
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InsuranceEdit;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";

const InsuranceEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    section1Heading: "",
    section1Description: "",
    section1Cards: [],
    section2Heading: "",
    section2Description: "",
    section2Cards: [],
    section3Heading: "",
    section3Description: "",
    section3Cards: [],
    status: "draft",
  });

  const [section1Previews, setSection1Previews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingPublishedCount, setExistingPublishedCount] = useState(0);

  useEffect(() => {
    if (!page) {
      toast.error("No insurance page provided.");
      navigate("/super-admin/insurance");
      return;
    }

    setFormData({
      section1Heading: page.section1Heading || page.section1?.heading || "",
      section1Description:
        page.section1Description || page.section1?.description || "",
      section1Cards:
        (page.section1Cards || page.section1?.cards || []).map((c) => ({
          title: c.title || "",
          description: c.description || "",
          image: null,
          existingImage: c.image || null,
        })) || [],
      section2Heading: page.section2Heading || page.section2?.heading || "",
      section2Description:
        page.section2Description || page.section2?.description || "",
      section2Cards:
        (page.section2Cards || page.section2?.cards || []).map((c) => ({
          title: c.title || "",
          description: c.description || "",
          price: c.price || "",
          cancelCondition: c.cancelCondition || "",
        })) || [],
      section3Heading: page.section3Heading || "",
      section3Description: page.section3Description || "",
      section3Cards:
        page.section3Cards?.map((c) => ({
          heading: c.heading || "",
          description: c.description || "",
          price: c.price || "",
          //price: c.price?.toString() || "",
          cancelCondition: c.cancelCondition || "",
          eligibility: c.eligibility || "",
          pointers: c.pointers || [""],
          buttonName: c.buttonName || "",
          buttonLink: c.buttonLink || "",
        })) || [],

      status: page.status || "draft",
    });

    const base = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
    setSection1Previews(
      (page.section1Cards || page.section1?.cards || []).map((c) =>
        c.image ? `${base}/${c.image}` : null
      )
    );

    (async () => {
      try {
        const res = await getAPI("/api/insurance");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setExistingPublishedCount(
          data.filter((d) => d.status === "published" && d._id !== page._id)
            .length
        );
      } catch (err) {
        console.warn("Could not fetch insurance pages list", err);
      }
    })();
  }, [page, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateImageFile = (file, friendlyName) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${friendlyName} must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${friendlyName} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const addSection1Card = () => {
    setFormData((p) => ({
      ...p,
      section1Cards: [
        ...p.section1Cards,
        { title: "", description: "", image: null, existingImage: null },
      ],
    }));
    setSection1Previews((p) => [...p, null]);
  };

  const updateSection1Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index][field] = value;
      return { ...p, section1Cards: copy };
    });
  };

  const updateSection1CardImage = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Section 1 Card Image")) return;
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index].image = file;
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const removeSection1Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy.splice(index, 1);
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeSection1CardImage = (index) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index].image = null;
      copy[index].existingImage = null;
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy[index] = null;
      return copy;
    });
  };

  const addSection2Card = () => {
    setFormData((p) => ({
      ...p,
      section2Cards: [
        ...p.section2Cards,
        { title: "", description: "", price: "", cancelCondition: "" },
      ],
    }));
  };

  const updateSection2Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy[index][field] = value;
      return { ...p, section2Cards: copy };
    });
  };

  const removeSection2Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy.splice(index, 1);
      return { ...p, section2Cards: copy };
    });
  };

  const addSection3Card = () => {
    setFormData((p) => ({
      ...p,
      section3Cards: [
        ...p.section3Cards,
        {
          heading: "",
          description: "",
          price: "",
          cancelCondition: "",
          eligibility: "",
          pointers: [""],
          buttonName: "",
          buttonLink: "",
        },
      ],
    }));
  };

  const updateSection3Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section3Cards];
      copy[index][field] = value;
      return { ...p, section3Cards: copy };
    });
  };

  const removeSection3Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section3Cards];
      copy.splice(index, 1);
      return { ...p, section3Cards: copy };
    });
  };

 const addPointer = (cardIdx) => {
    const updated = [...formData.section3Cards];
    updated[cardIdx].pointers.push("");
    setFormData({ ...formData, section3Cards: updated });
  };
  const removePointer = (cardIdx, pointerIdx) => {
    setFormData((p) => {
      const copy = [...p.section3Cards];
      copy[cardIdx].pointers.splice(pointerIdx, 1);
      return { ...p, section3Cards: copy };
    });
  };

  const updatePointer = (cardIdx, pointerIdx, value) => {
    setFormData((p) => {
      const copy = [...p.section3Cards];
      copy[cardIdx].pointers[pointerIdx] = value;
      return { ...p, section3Cards: copy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.section1Heading.trim() ||
        !formData.section1Description.trim()
      ) {
        toast.error("Section 1 heading and description are required");
        setLoading(false);
        return;
      }

      if (formData.status === "published" && existingPublishedCount > 0) {
        const confirm = window.confirm(
          `There are ${existingPublishedCount} other published insurance page(s). Publish this and unpublish others?`
        );
        if (!confirm) {
          setLoading(false);
          return;
        }
        try {
          await axiosInstance.put("/api/insurance/published");
        } catch (err) {
          console.warn("unpublishAll failed (maybe not available)", err);
        }
      }

      const submission = new FormData();
      submission.append("section1Heading", formData.section1Heading.trim());
      submission.append(
        "section1Description",
        formData.section1Description.trim()
      );
      submission.append("section2Heading", formData.section2Heading.trim());
      submission.append(
        "section2Description",
        formData.section2Description.trim()
      );
      submission.append("section3Heading", formData.section3Heading.trim());
      submission.append(
        "section3Description",
        formData.section3Description.trim()
      );
      submission.append("status", formData.status);

      formData.section1Cards.forEach((c, i) => {
        submission.append(`section1Cards[${i}][title]`, (c.title || "").trim());
        submission.append(
          `section1Cards[${i}][description]`,
          (c.description || "").trim()
        );
        if (c.image instanceof File) {
          submission.append(`section1Cards[${i}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(
            `section1Cards[${i}][existingImage]`,
            c.existingImage
          );
        }
      });

      formData.section2Cards.forEach((c, i) => {
        submission.append(`section2Cards[${i}][title]`, (c.title || "").trim());
        submission.append(
          `section2Cards[${i}][description]`,
          (c.description || "").trim()
        );
        submission.append(`section2Cards[${i}][price]`, (c.price || "").trim());
        submission.append(
          `section2Cards[${i}][cancelCondition]`,
          (c.cancelCondition || "").trim()
        );
      });

      formData.section3Cards.forEach((c, i) => {
        submission.append(
          `section3Cards[${i}][heading]`,
          (c.heading || "").trim()
        );
        submission.append(
          `section3Cards[${i}][description]`,
          (c.description || "").trim()
        );
        submission.append(`section3Cards[${i}][price]`, (c.price || "").trim());
        submission.append(
          `section3Cards[${i}][cancelCondition]`,
          (c.cancelCondition || "").trim()
        );
        submission.append(
          `section3Cards[${i}][eligibility]`,
          (c.eligibility || "").trim()
        );
        c.pointers.forEach((p, j) => {
          submission.append(`section3Cards[${i}][pointers][${j}]`, p);
        });
        submission.append(
          `section3Cards[${i}][buttonName]`,
          (c.buttonName || "").trim()
        );
        submission.append(
          `section3Cards[${i}][buttonLink]`,
          (c.buttonLink || "").trim()
        );
      });

      const res = await putAPI(
        `/api/insurance/update/${page._id}`,
        submission,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.data) {
        toast.success(
          res.data.message || "Insurance page updated successfully."
        );
        navigate("/super-admin/insurance", { state: { reload: true } });
      } else {
        toast.error(res.data?.message || "Failed to update insurance page");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Insurance Page</h2>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card p-3 mb-4">
          <h5>Section 1</h5>
          <input
            name="section1Heading"
            placeholder="Section 1 Heading"
            className="form-control mb-2"
            value={formData.section1Heading}
            onChange={handleChange}
          />
          <textarea
            name="section1Description"
            placeholder="Section 1 Description"
            className="form-control mb-2"
            value={formData.section1Description}
            onChange={handleChange}
          />
          <h6>Cards (Image, Title, Description)</h6>
          {formData.section1Cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <label>Card Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) =>
                  updateSection1Card(index, "image", e.target.files[0])
                }
              />
            
              {section1Previews[index] && (
                <img
                  src={section1Previews[index]}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ width: "150px", height: "auto" }}
                />
              )}

              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) =>
                  updateSection1Card(index, "title", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) =>
                  updateSection1Card(index, "description", e.target.value)
                }
              />
              <div className="form-group">
                <label>Card Image</label>
                 <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="form-control"
                  onChange={(e) => updateSection1CardImage(index, e.target.files[0])}
                />
                {section1Previews[index] && (
                  <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                    <img
                      src={section1Previews[index]}
                      alt="s1-preview"
                      style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ position: "absolute", top: -6, right: -6 }}
                      onClick={() => removeSection1CardImage(index)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeSection1Card(index)}
              >
                Remove Card
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSection1Card}
          >
            + Add Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 2</h5>
          <input
            name="section2Heading"
            placeholder="Section 2 Heading"
            className="form-control mb-2"
            value={formData.section2Heading}
            onChange={handleChange}
          />
          <textarea
            name="section2Description"
            placeholder="Section 2 Description"
            className="form-control mb-2"
            value={formData.section2Description}
            onChange={handleChange}
          />
          <h6>Cards (Title, Description)</h6>
          {formData.section2Cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) =>
                  updateSection2Card(index, "title", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) =>
                  updateSection2Card(index, "description", e.target.value)
                }
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeSection2Card(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSection2Card}
          >
            + Add Section 2 Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 3</h5>
          <div className="form-group">
            <label>Section 3 Heading</label>
            <input
              name="section3Heading"
              className="form-control"
              value={formData.section3Heading}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Section 3 Description</label>
            <textarea
              name="section3Description"
              rows={3}
              className="form-control"
              value={formData.section3Description}
              onChange={handleChange}
            />
          </div>

          <h6>Cards</h6>
          {formData.section3Cards.map((card, idx) => (
            <div key={idx} className="border p-3 mb-3">
              <div className="form-group">
                <label>Heading</label>
                <input
                  className="form-control"
                  value={card.heading}
                  onChange={(e) =>
                    updateSection3Card(idx, "heading", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={card.description}
                  onChange={(e) =>
                    updateSection3Card(idx, "description", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={card.price}
                  onChange={(e) =>
                    updateSection3Card(idx, "price", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <small className="text-muted">Cancel Condition</small>
                <input
                  type="text"
                  className="form-control"
                  value={card.cancelCondition}
                  onChange={(e) =>
                    updateSection3Card(idx, "cancelCondition", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Eligibility</label>
                <input
                  className="form-control"
                  value={card.eligibility}
                  onChange={(e) =>
                    updateSection3Card(idx, "eligibility", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Pointers</label>
                {card.pointers.map((p, j) => (
                  <div key={j} className="d-flex mb-2" style={{ gap: 8 }}>
                    <input
                      className="form-control"
                      value={p}
                      onChange={(e) => updatePointer(idx, j, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removePointer(idx, j)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => addPointer(idx)}
                >
                  + Add Pointer
                </button>
              </div>
              <div className="form-group">
                <label>Button Name</label>
                <input
                  className="form-control"
                  value={card.buttonName}
                  onChange={(e) =>
                    updateSection3Card(idx, "buttonName", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Button Link</label>
                <input
                  className="form-control"
                  value={card.buttonLink}
                  onChange={(e) =>
                    updateSection3Card(idx, "buttonLink", e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={() => removeSection3Card(idx)}
              >
                Remove Card
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSection3Card}
          >
            + Add Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Status</h5>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="d-flex" style={{ gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Insurance Page"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceEdit;
