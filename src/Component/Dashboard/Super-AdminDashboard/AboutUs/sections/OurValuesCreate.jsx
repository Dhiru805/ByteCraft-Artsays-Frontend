
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../../../../../api/axiosConfig";
// import getAPI from "../../../../../api/getAPI";

// const OurValuesCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     //status: "draft",
//     cards: [{ cardTitle: "", cardImage: null }],
//   });

//   const [cardPreviews, setCardPreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [aboutUsId, setAboutUsId] = useState(null);

//   useEffect(() => {
//     const ensureAboutUsPage = async () => {
//       try {
//         const res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];

//         if (!page) {
//           const createRes = await axiosInstance.post("/api/about-us/create", { title: "About Us" });
//           page = createRes.data.data;
//         }

//         setAboutUsId(page._id);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load About Us page");
//       }
//     };
//     ensureAboutUsPage();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value, files } = e.target;

//     if (field !== null && index !== null) {
//       const updatedCards = [...formData.cards];
//       const updatedPreviews = [...cardPreviews];

//       if (files && files[0]) {
//         const file = files[0];
//         if (!validateImageFile(file, "Card Image")) return;

//         updatedCards[index][field] = file;
//         updatedPreviews[index] = URL.createObjectURL(file);
//       } else {
//         updatedCards[index][field] = value;
//       }

//       setFormData({ ...formData, cards: updatedCards });
//       setCardPreviews(updatedPreviews);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { cardTitle: "", cardImage: null }],
//     });
//     setCardPreviews([...cardPreviews, null]);
//   };

//   const removeCard = (idx) => {
//     setFormData({
//       ...formData,
//       cards: formData.cards.filter((_, i) => i !== idx),
//     });
//     setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!aboutUsId) {
//       toast.error("About Us page not ready yet. Please wait.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (!formData.heading.trim() || !formData.description.trim()) {
//         toast.error("Heading & Description are required");
//         setLoading(false);
//         return;
//       }

//       for (let i = 0; i < formData.cards.length; i++) {
//         const c = formData.cards[i];
//         if (!c.cardTitle.trim() || !c.cardImage) {
//           toast.error(`Card ${i + 1} requires title and image`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("aboutUsId", aboutUsId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());
//       //submissionData.append("status", formData.status);

//       formData.cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
//         if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
//       });

//       const res = await axiosInstance.post("/api/about-us-sections/our-values/create", submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message || "Our Values section created successfully!");
//         navigate("/super-admin/about-us/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to create section");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Our Values Section</h2>
//         {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">

//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="form-control" required />
//                 </div>


//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={4} required />
//                 </div>

//                 {/* <div className="form-group">
//                   <label>Status</label>
//                   <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                   </select>
//                 </div> */}


//                 {formData.cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-2 rounded shadow">
//                     <div className="form-group">
//                       <label>Card Title *</label>
//                       <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, idx, "cardTitle")} className="form-control" required />
//                     </div>

//                     <div className="form-group">
//                       <label>Card Image *</label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "cardImage")} className="form-control" required />
//                       {cardPreviews[idx] && <img src={cardPreviews[idx]} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
//                     </div>

//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}

//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
//                     {loading ? "Creating..." : "Create Our Values Section"}
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

// export default OurValuesCreate;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../../../../../api/axiosConfig";
// import getAPI from "../../../../../api/getAPI";

// const OurValuesCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     cards: [{ cardTitle: "", cardImage: null }],
//   });
//   const [cardPreviews, setCardPreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [aboutUsId, setAboutUsId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);

//   useEffect(() => {
//     const fetchAboutUsAndSection = async () => {
//       try {
//         let res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];

//         if (!page) {
//           const createRes = await axiosInstance.post("/api/about-us/create", { title: "About Us" });
//           page = createRes.data.data;
//         }

//         setAboutUsId(page._id);

//         // fetch existing Our Values section
//         const sectionRes = await getAPI(`/api/about-us-sections/our-values/${page._id}`);
//         if (sectionRes.data.success && sectionRes.data.data) {
//           const s = sectionRes.data.data;
//           setSectionId(s._id);
//           setFormData({
//             heading: s.heading || "",
//             description: s.description || "",
//             cards: s.cards?.length ? s.cards.map(c => ({ cardTitle: c.cardTitle, cardImage: null })) : [{ cardTitle: "", cardImage: null }],
//           });
//           setCardPreviews(s.cards?.map(() => null) || [null]);
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load About Us page");
//       }
//     };
//     fetchAboutUsAndSection();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value, files } = e.target;

//     if (field !== null && index !== null) {
//       const updatedCards = [...formData.cards];
//       const updatedPreviews = [...cardPreviews];

//       if (files && files[0]) {
//         const file = files[0];
//         if (!validateImageFile(file, "Card Image")) return;

//         updatedCards[index][field] = file;
//         updatedPreviews[index] = URL.createObjectURL(file);
//       } else {
//         updatedCards[index][field] = value;
//       }

//       setFormData({ ...formData, cards: updatedCards });
//       setCardPreviews(updatedPreviews);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { cardTitle: "", cardImage: null }],
//     });
//     setCardPreviews([...cardPreviews, null]);
//   };

//   const removeCard = (idx) => {
//     setFormData({
//       ...formData,
//       cards: formData.cards.filter((_, i) => i !== idx),
//     });
//     setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!aboutUsId) {
//       toast.error("About Us page not ready yet. Please wait.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (!formData.heading.trim() || !formData.description.trim()) {
//         toast.error("Heading & Description are required");
//         setLoading(false);
//         return;
//       }

//       for (let i = 0; i < formData.cards.length; i++) {
//         const c = formData.cards[i];
//         if (!c.cardTitle.trim() || (!c.cardImage && !sectionId)) {
//           toast.error(`Card ${i + 1} requires title and image`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("aboutUsId", aboutUsId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());

//       formData.cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
//         if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
//       });

//       let res;
//       if (sectionId) {
//         res = await axiosInstance.post(`/api/about-us-sections/our-values/update/${sectionId}`, submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         res = await axiosInstance.post("/api/about-us-sections/our-values/create", submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       if (res.data.success) {
//         toast.success(res.data.message || "Our Values section saved successfully!");
//         navigate("/super-admin/about-us/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to save section");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Our Values Section</h2>
//         {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={4} required />
//                 </div>

//                 {formData.cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-2 rounded shadow">
//                     <div className="form-group">
//                       <label>Card Title *</label>
//                       <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, idx, "cardTitle")} className="form-control" required />
//                     </div>

//                     <div className="form-group">
//                       <label>Card Image {sectionId ? " " : "*"} </label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "cardImage")} className="form-control" />
//                       {cardPreviews[idx] && <img src={cardPreviews[idx]} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
//                     </div>

//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}

//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
//                     {loading ? "Saving..." : sectionId ? "Update Our Values" : "Create Our Values Section"}
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

// export default OurValuesCreate;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../../../../../api/axiosConfig";
// import getAPI from "../../../../../api/getAPI";

// const OurValuesCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     cards: [{ cardTitle: "", cardImage: null, existingCardImage: null }],
//   });
//   const [cardPreviews, setCardPreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [aboutUsId, setAboutUsId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);

//   useEffect(() => {
//     const fetchAboutUsAndSection = async () => {
//       try {
//         let res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];

//         if (!page) {
//           const createRes = await axiosInstance.post("/api/about-us/create", { title: "About Us" });
//           page = createRes.data.data;
//         }

//         setAboutUsId(page._id);

//         const sectionRes = await getAPI(`/api/about-us-sections/our-values/${page._id}`);
//         if (sectionRes.data.success && sectionRes.data.data) {
//           const s = sectionRes.data.data;
//           setSectionId(s._id);
//           const existingCards = s.cards?.length
//             ? s.cards.map(c => ({
//                 cardTitle: c.cardTitle,
//                 cardImage: null,
//                 existingCardImage: c.cardImageUrl || null,
//               }))
//             : [{ cardTitle: "", cardImage: null, existingCardImage: null }];

//           setFormData({
//             heading: s.heading || "",
//             description: s.description || "",
//             cards: existingCards,
//           });

//           setCardPreviews(existingCards.map(c => c.existingCardImage || null));
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load About Us page");
//       }
//     };
//     fetchAboutUsAndSection();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value, files } = e.target;

//     if (field !== null && index !== null) {
//       const updatedCards = [...formData.cards];
//       const updatedPreviews = [...cardPreviews];

//       if (files && files[0]) {
//         const file = files[0];
//         if (!validateImageFile(file, "Card Image")) return;

//         updatedCards[index][field] = file;
//         updatedPreviews[index] = URL.createObjectURL(file);
//       } else {
//         updatedCards[index][field] = value;
//       }

//       setFormData({ ...formData, cards: updatedCards });
//       setCardPreviews(updatedPreviews);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { cardTitle: "", cardImage: null, existingCardImage: null }],
//     });
//     setCardPreviews([...cardPreviews, null]);
//   };

//   const removeCard = (idx) => {
//     setFormData({
//       ...formData,
//       cards: formData.cards.filter((_, i) => i !== idx),
//     });
//     setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!aboutUsId) {
//       toast.error("About Us page not ready yet. Please wait.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (!formData.heading.trim() || !formData.description.trim()) {
//         toast.error("Heading & Description are required");
//         setLoading(false);
//         return;
//       }

//       for (let i = 0; i < formData.cards.length; i++) {
//         const c = formData.cards[i];
//         if (!c.cardTitle.trim() || (!c.cardImage && !c.existingCardImage)) {
//           toast.error(`Card ${i + 1} requires title and image`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("aboutUsId", aboutUsId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());

//       formData.cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
//         if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
//       });

//       let res;
//       if (sectionId) {
//         res = await axiosInstance.post(`/api/about-us-sections/our-values/update/${sectionId}`, submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         res = await axiosInstance.post("/api/about-us-sections/our-values/create", submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       if (res.data.success) {
//         toast.success(res.data.message || "Our Values section saved successfully!");
//         navigate("/super-admin/about-us/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to save section");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Our Values Section</h2>
//         {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={4} required />
//                 </div>

//                 {formData.cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-2 rounded shadow">
//                     <div className="form-group">
//                       <label>Card Title *</label>
//                       <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, idx, "cardTitle")} className="form-control" required />
//                     </div>

//                     <div className="form-group">
//                       <label>Card Image {sectionId ? " " : "*"} </label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "cardImage")} className="form-control" />
//                       {(cardPreviews[idx] || c.existingCardImage) && (
//                         <img src={cardPreviews[idx] || c.existingCardImage} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />
//                       )}
//                     </div>

//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}

//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
//                     {loading ? "Saving..." : sectionId ? "Update Our Values" : "Create Our Values Section"}
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

// export default OurValuesCreate;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../../api/axiosConfig";
import getAPI from "../../../../../api/getAPI";

const OurValuesCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    cards: [{ cardTitle: "", cardImage: null, existingCardImage: null }],
  });
  const [cardPreviews, setCardPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const fetchAboutUsAndSection = async () => {
      try {
        const res = await getAPI("/api/about-us");
        let page = res.data.data?.[0];

        if (!page) {
          const createRes = await axiosInstance.post("/api/about-us/create", { title: "About Us" });
          page = createRes.data.data;
        }

        setAboutUsId(page._id);

        const sectionRes = await getAPI(`/api/about-us-sections/our-values/${page._id}`);
        if (sectionRes.data.success && sectionRes.data.data) {
          const s = sectionRes.data.data;
          setSectionId(s._id);

          // const cards = s.cards?.length
          //   ? s.cards.map(c => ({
          //       cardTitle: c.cardTitle,
          //       cardImage: null,
          //       //existingCardImage: c.cardImageUrl || c.cardImage || null,
          //       existingCardImage: c.cardImageUrl ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.cardImageUrl}` : c.cardImage || null

          //     }))
          //   : [{ cardTitle: "", cardImage: null, existingCardImage: null }];
          const cards = s.cards?.length
            ? s.cards.map(c => ({
              cardTitle: c.cardTitle,
              cardImage: null,
              existingCardImage:
                c.cardImageUrl
                  ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.cardImageUrl}`
                  : c.cardImage
                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.cardImage}`
                    : null,
            }))
            : [{ cardTitle: "", cardImage: null, existingCardImage: null }];
          setFormData({
            heading: s.heading || "",
            description: s.description || "",
            cards,
          });

          setCardPreviews(cards.map(c => c.existingCardImage || null));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };

    fetchAboutUsAndSection();
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
      toast.error(`${type} must be JPEG, PNG or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (index !== null && field) {
      const updatedCards = [...formData.cards];
      const updatedPreviews = [...cardPreviews];

      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Card Image")) return;

        updatedCards[index][field] = file;
        updatedCards[index].existingCardImage = null;
        updatedPreviews[index] = URL.createObjectURL(file);
      } else {
        updatedCards[index][field] = value;
      }

      setFormData({ ...formData, cards: updatedCards });
      setCardPreviews(updatedPreviews);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardTitle: "", cardImage: null, existingCardImage: null }],
    });
    setCardPreviews([...cardPreviews, null]);
  };

  const removeCard = (idx) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== idx),
    });
    setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aboutUsId) {
      toast.error("About Us page not ready yet. Please wait.");
      return;
    }

    setLoading(true);

    try {
      if (!formData.heading.trim() || !formData.description.trim()) {
        toast.error("Heading & Description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.cards.length; i++) {
        const c = formData.cards[i];
        if (!c.cardTitle.trim() || (!c.cardImage && !c.existingCardImage)) {
          toast.error(`Card ${i + 1} requires title and image`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
        if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
      });

      const res = sectionId
        ? await axiosInstance.post(`/api/about-us-sections/our-values/update/${sectionId}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        : await axiosInstance.post("/api/about-us-sections/our-values/create", submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      if (res.data.success) {
        toast.success(res.data.message || "Our Values section saved successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save section");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>{sectionId ? "Edit Our Values Section" : "Create Our Values Section"}</h2>
        {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Heading *</label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>

                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-2 rounded shadow">
                    <div className="form-group">
                      <label>Card Title *</label>
                      <input
                        type="text"
                        value={c.cardTitle}
                        onChange={(e) => handleChange(e, idx, "cardTitle")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Image {sectionId ? " " : "*"} </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/svg+xml"
                        onChange={(e) => handleChange(e, idx, "cardImage")}
                        className="form-control"
                      />
                      {(cardPreviews[idx] || c.existingCardImage) && (
                        <img
                          src={cardPreviews[idx] || c.existingCardImage}
                          alt="Card Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }}
                        />
                      )}
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>
                      Remove Card
                    </button>
                  </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>
                  Add Card
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
                    {loading ? "Saving..." : sectionId ? "Update Our Values" : "Create Our Values Section"}
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

export default OurValuesCreate;
