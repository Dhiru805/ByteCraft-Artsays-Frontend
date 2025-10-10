

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const WhatWeDoCreate = () => {
//   const navigate = useNavigate();

//   const [aboutUsId, setAboutUsId] = useState(null); 
//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     image: null,
//     cards: [],
//     //status: "draft",
//   });

//   const [bannerPreview, setBannerPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const ensureAboutUsPage = async () => {
//       try {
//         const res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];
//         if (!page) {
//           toast.error("No About Us draft found. Create the page first.");
//           navigate("/super-admin/about-us/create");
//           return;
//         }
//         setAboutUsId(page._id);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load About Us page");
//       }
//     };

//     ensureAboutUsPage();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png)/)) {
//       toast.error(`${type} must be JPEG or PNG`);
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
//       updatedCards[index][field] = value;
//       setFormData({ ...formData, cards: updatedCards });
//     } else if (files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, "Banner image")) return;

//       setFormData({ ...formData, image: file });
//       setBannerPreview(URL.createObjectURL(file));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { cardHeading: "", cardDescription: "" }],
//     });
//   };

//   const removeCard = (idx) => {
//     setFormData({
//       ...formData,
//       cards: formData.cards.filter((_, i) => i !== idx),
//     });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!aboutUsId) {
//   //     toast.error("About Us page not ready yet. Please wait.");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     if (!formData.heading.trim() || !formData.description.trim()) {
//   //       toast.error("Heading & Description are required");
//   //       setLoading(false);
//   //       return;
//   //     }

  
//   //     for (let i = 0; i < formData.cards.length; i++) {
//   //       const c = formData.cards[i];
//   //       if (!c.cardHeading.trim() || !c.cardDescription.trim()) {
//   //         toast.error(`Card ${i + 1} requires heading & description`);
//   //         setLoading(false);
//   //         return;
//   //       }
//   //     }

//   //     const submissionData = new FormData();
//   //     submissionData.append("aboutUsId", aboutUsId); 
//   //     submissionData.append("heading", formData.heading.trim());
//   //     submissionData.append("description", formData.description.trim());
//   //     //submissionData.append("status", formData.status);
//   //   // submissionData.append("image", formData.image);

//   //     if (formData.image) submissionData.append("image", formData.image);

//   //     formData.cards.forEach((c, idx) => {
//   //       submissionData.append(`cards[${idx}][cardHeading]`, c.cardHeading.trim());
//   //       submissionData.append(`cards[${idx}][cardDescription]`, c.cardDescription.trim());
//   //     });

//   //     const res = await postAPI("/api/about-us-sections/what-we-do/create", submissionData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     if (res.data.success) {
//   //       toast.success(res.data.message || "WhatWeDo section created successfully!");
//   //       navigate("/super-admin/about-us/create", { state: { reload: true } });
//   //     } else {
//   //       toast.error(res.data.message || "Failed to create section");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.message || "Something went wrong");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!aboutUsId) {
//     toast.error("About Us page not ready yet. Please wait.");
//     return;
//   }

//   setLoading(true);

//   try {
//     if (!formData.heading.trim() || !formData.description.trim()) {
//       toast.error("Heading & Description are required");
//       setLoading(false);
//       return;
//     }

//     const submissionData = new FormData();
//     submissionData.append("aboutUsId", aboutUsId);
//     submissionData.append("heading", formData.heading.trim());
//     submissionData.append("description", formData.description.trim());

//     if (formData.image) {
//       submissionData.append("bannerImage", formData.image);
//     }

   
//     if (formData.cards.length > 0) {
//       submissionData.append("cards", JSON.stringify(formData.cards));
//     }

//     const res = await postAPI("/api/about-us-sections/what-we-do/create", submissionData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     if (res.data.success) {
//       toast.success(res.data.message || "WhatWeDo section created successfully!");
//       navigate("/super-admin/about-us/create", { state: { reload: true } });
//     } else {
//       toast.error(res.data.message || "Failed to create section");
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create What We Do Section</h2>

//         {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
             
//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input
//                     type="text"
//                     name="heading"
//                     value={formData.heading}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>

               
//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Banner Image *</label>
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/png"
//                     name="image"
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                   {bannerPreview && (
//                     <img
//                       src={bannerPreview}
//                       alt="Banner Preview"
//                       style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", marginTop: "5px" }}
//                     />
//                   )}
//                 </div>

//                 <h4>Cards Section (Optional)</h4>
//                 {formData.cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Card Heading *</label>
//                       <input
//                         type="text"
//                         value={c.cardHeading}
//                         onChange={(e) => handleChange(e, idx, "cardHeading")}
//                         className="form-control"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Card Description *</label>
//                       <textarea
//                         value={c.cardDescription}
//                         onChange={(e) => handleChange(e, idx, "cardDescription")}
//                         className="form-control"
//                         rows={3}
//                         required
//                       />
//                     </div>
//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>
//                       Remove Card
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>
//                   Add Card
//                 </button>

               
//                 {/* <div className="form-group">
//                   <label>Status</label>
//                   <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                   </select>
//                 </div> */}

                
//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
//                     {loading ? "Creating..." : "Create WhatWeDo Section"}
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

// export default WhatWeDoCreate;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const WhatWeDoCreate = () => {
  const navigate = useNavigate();

  const [aboutUsId, setAboutUsId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    image: null,
    cards: [],
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [existingBannerImage, setExistingBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        const res = await getAPI("/api/about-us");
        const page = res.data.data?.[0];
        if (!page) {
          toast.error("No About Us draft found. Create the page first.");
          navigate("/super-admin/about-us/create");
          return;
        }
        setAboutUsId(page._id);
        const sectionRes = await getAPI(`/api/about-us-sections/what-we-do/${page._id}`);
        const section = sectionRes.data.data;
        if (section) {
          setSectionId(section._id);
          setFormData({
            heading: section.heading || "",
            description: section.description || "",
            image: null,
            cards: section.cards || [],
          });
          if (section.image) {
            setExistingBannerImage(section.image);
            setBannerPreview(`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${section.image}`);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load section data");
      }
    };
    loadAboutUs();
  }, [navigate]);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${type} must be JPEG or PNG`);
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
    if (field !== null && index !== null) {
      const updatedCards = [...formData.cards];
      updatedCards[index][field] = value;
      setFormData({ ...formData, cards: updatedCards });
    } else if (files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Banner image")) return;
      setFormData({ ...formData, image: file });
      setBannerPreview(URL.createObjectURL(file));
      setExistingBannerImage(null); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardHeading: "", cardDescription: "" }],
    });
  };

  const removeCard = (idx) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== idx),
    });
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

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      if (formData.image) submissionData.append("bannerImage", formData.image);
      if (formData.cards.length > 0)
        submissionData.append("cards", JSON.stringify(formData.cards));

      const endpoint = sectionId
        ? `/api/about-us-sections/what-we-do/update/${sectionId}`
        : `/api/about-us-sections/what-we-do/create`;

      const res = await postAPI(endpoint, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "What We Do section saved successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save section");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>{sectionId ? "Edit What We Do Section" : "Create What We Do Section"}</h2>
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
                    rows={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Banner Image *</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    name="image"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {(bannerPreview || existingBannerImage) && (
                    <img
                      src={bannerPreview || existingBannerImage}
                      alt="Banner Preview"
                      style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", marginTop: "5px" }}
                    />
                  )}
                </div>

                <h4>Cards Section (Optional)</h4>
                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Card Heading *</label>
                      <input
                        type="text"
                        value={c.cardHeading}
                        onChange={(e) => handleChange(e, idx, "cardHeading")}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.cardDescription}
                        onChange={(e) => handleChange(e, idx, "cardDescription")}
                        className="form-control"
                        rows={3}
                        required
                      />
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
                    {loading ? "Saving..." : sectionId ? "Update Section" : "Create Section"}
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

export default WhatWeDoCreate;
