// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const HowToBuyCreate = () => {
//   const navigate = useNavigate();

//   const [homepageId, setHomepageId] = useState(null);
//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     buttonName: "",
//     buttonLink: "",
//     cards: [
//       { image: null, title: "", description: "", icons: [] }
//     ]
//   });

//   const [imagePreviews, setImagePreviews] = useState([null]);
//   const [iconPreviews, setIconPreviews] = useState([[ ]]); 
//   const [existingCardImages, setExistingCardImages] = useState([null]);
//   const [existingIcons, setExistingIcons] = useState([[ ]]);
//   const [loading, setLoading] = useState(false);
//   const [sectionId, setSectionId] = useState(null);

//   useEffect(() => {
//     const loadHomepageAndSection = async () => {
//       try {
//         const res = await getAPI("/api/homepage");
//         let page = res.data.data?.[0];
//         if (!page) {
//           toast.error("No Homepage draft found. Create the page first.");
//           navigate("/super-admin/homepage/create");
//           return;
//         }
//         setHomepageId(page._id);

//         const secRes = await getAPI(`/api/homepage-sections/how-to-buy/${page._id}`);
//         if (secRes.data?.success && secRes.data?.data) {
//           const s = secRes.data.data;
//           setSectionId(s._id);
//           setFormData({
//             heading: s.heading || "",
//             description: s.description || "",
//             buttonName: s.buttonName || "",
//             buttonLink: s.buttonLink || "",
//             cards: (s.cards || []).map(c => ({
//               image: null,
//               title: c.title || c.heading || "",
//               description: c.description || "",
//               icons: (c.icons || []).map(() => null),
//             }))
//           });

//           setExistingCardImages((s.cards || []).map(c => c.imageUrl || c.image || null));
//           setImagePreviews((s.cards || []).map(c => c.imageUrl || c.image || null));
//           setExistingIcons((s.cards || []).map(c => (c.iconUrls || c.icons || []).map(u => u?.url || u || null)));
//           setIconPreviews((s.cards || []).map(c => (c.iconUrls || c.icons || []).map(u => u?.url || u || null)));
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load Homepage");
//       }
//     };
//     loadHomepageAndSection();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, cardIdx, field, iconIdx = null) => {
//     const { files, value } = e.target;
//     const updatedCards = [...formData.cards];
//     const updatedImagePreviews = [...imagePreviews];
//     const updatedIconPreviews = [...iconPreviews];

//     if (field === "icons" && files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, "Icon")) return;
//       updatedCards[cardIdx].icons[iconIdx] = file;
//       updatedIconPreviews[cardIdx][iconIdx] = URL.createObjectURL(file);
//       const updatedExistingIcons = [...existingIcons];
//       if (!updatedExistingIcons[cardIdx]) updatedExistingIcons[cardIdx] = [];
//       updatedExistingIcons[cardIdx][iconIdx] = null;
//       setExistingIcons(updatedExistingIcons);
//     } else if (files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, "Card Image")) return;
//       updatedCards[cardIdx][field] = file;
//       updatedImagePreviews[cardIdx] = URL.createObjectURL(file);
//       const updatedExisting = [...existingCardImages];
//       updatedExisting[cardIdx] = null;
//       setExistingCardImages(updatedExisting);
//     } else {
//       updatedCards[cardIdx][field] = value;
//     }

//     setFormData({ ...formData, cards: updatedCards });
//     setImagePreviews(updatedImagePreviews);
//     setIconPreviews(updatedIconPreviews);
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { image: null, title: "", description: "", icons: [] }]
//     });
//     setImagePreviews([...imagePreviews, null]);
//     setIconPreviews([...iconPreviews, []]);
//   };

//   const removeCard = (idx) => {
//     setFormData({ ...formData, cards: formData.cards.filter((_, i) => i !== idx) });
//     setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
//     setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
//   };

//   const addIcon = (cardIdx) => {
//     const updatedCards = [...formData.cards];
//     updatedCards[cardIdx].icons.push(null);
//     const updatedIcons = [...iconPreviews];
//     updatedIcons[cardIdx].push(null);
//     setFormData({ ...formData, cards: updatedCards });
//     setIconPreviews(updatedIcons);
//   };

//   const removeIcon = (cardIdx, iconIdx) => {
//     const updatedCards = [...formData.cards];
//     updatedCards[cardIdx].icons = updatedCards[cardIdx].icons.filter((_, i) => i !== iconIdx);
//     const updatedIcons = [...iconPreviews];
//     updatedIcons[cardIdx] = updatedIcons[cardIdx].filter((_, i) => i !== iconIdx);
//     setFormData({ ...formData, cards: updatedCards });
//     setIconPreviews(updatedIcons);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!homepageId) {
//       toast.error("Homepage not ready yet. Please wait.");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (!formData.heading.trim() || !formData.description.trim()) {
//         toast.error("Heading & Description are required");
//         setLoading(false);
//         return;
//       }
//       if (!formData.buttonName.trim() || !formData.buttonLink.trim()) {
//         toast.error("Button Name & Link are required");
//         setLoading(false);
//         return;
//       }

//       const submissionData = new FormData();
//       submissionData.append("homepageId", homepageId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());
//       submissionData.append("buttonName", formData.buttonName.trim());
//       submissionData.append("buttonLink", formData.buttonLink.trim());

//       formData.cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][title]`, c.title.trim());
//         submissionData.append(`cards[${idx}][description]`, c.description.trim());
//         if (c.image) submissionData.append(`cards[${idx}][image]`, c.image);
//         c.icons.forEach((icon, i) => {
//           if (icon) submissionData.append(`cards[${idx}][icons][${i}]`, icon);
//         });
//       });

//       const res = await postAPI("/api/homepage-sections/how-to-buy/create", submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message || "How To Buy section created successfully!");
//         navigate("/super-admin/homepage/create", { state: { reload: true } });
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
//         <h2>Create How To Buy Section</h2>

//         {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

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
//                     onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="form-control"
//                     rows={4}
//                     required
//                   />
//                 </div>


//                 <div className="form-group">
//                   <label>Button Name *</label>
//                   <input
//                     type="text"
//                     name="buttonName"
//                     value={formData.buttonName}
//                     onChange={(e) => setFormData({ ...formData, buttonName: e.target.value })}
//                     className="form-control"
//                     required
//                   />
//                 </div>


//                 <div className="form-group">
//                   <label>Button Link *</label>
//                   <input
//                     type="text"
//                     name="buttonLink"
//                     value={formData.buttonLink}
//                     onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <h4>Cards</h4>
//                 {formData.cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Card Image *</label>
//                       <input
//                         type="file"
//                         accept="image/jpeg,image/png,image/svg+xml"
//                         onChange={(e) => handleChange(e, idx, "image")}
//                         className="form-control"
//                         required
//                       />
//                       {(imagePreviews[idx] || existingCardImages[idx]) && (
//                         <img src={imagePreviews[idx] || existingCardImages[idx]} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }} />
//                       )}
//                     </div>

//                     <div className="form-group">
//                       <label>Title *</label>
//                       <input
//                         type="text"
//                         value={c.title}
//                         onChange={(e) => handleChange(e, idx, "title")}
//                         className="form-control"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Description *</label>
//                       <textarea
//                         value={c.description}
//                         onChange={(e) => handleChange(e, idx, "description")}
//                         className="form-control"
//                         rows={3}
//                         required
//                       />
//                     </div>

//                     <h6>Icons (Optional)</h6>
//                     {c.icons.map((icon, i) => (
//                       <div key={i} className="form-group d-flex align-items-center">
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png,image/svg+xml"
//                           onChange={(e) => handleChange(e, idx, "icons", i)}
//                           className="form-control"
//                         />
//                         {(iconPreviews[idx]?.[i] || existingIcons[idx]?.[i]) && (
//                           <img src={iconPreviews[idx]?.[i] || existingIcons[idx]?.[i]} alt="Icon Preview" style={{ maxWidth: "60px", maxHeight: "60px", marginLeft: "5px" }} />
//                         )}
//                         <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => removeIcon(idx, i)}>Remove</button>
//                       </div>
//                     ))}
//                     <button type="button" className="btn btn-secondary btn-sm" onClick={() => addIcon(idx)}>Add Icon</button>

//                     <br />
//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>


//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
//                     {loading ? "Saving..." : sectionId ? "Update How To Buy Section" : "Create How To Buy Section"}
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

// export default HowToBuyCreate;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const HowToBuyCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    buttonName: "",
    buttonLink: "",
    cards: [
      { image: null, title: "", description: "", icons: [] }
    ]
  });

  const [imagePreviews, setImagePreviews] = useState([null]);
  const [iconPreviews, setIconPreviews] = useState([[]]);
  const [existingCardImages, setExistingCardImages] = useState([null]);
  const [existingIcons, setExistingIcons] = useState([[]]);
  const [loading, setLoading] = useState(false);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const loadHomepageAndSection = async () => {
      try {
        const res = await getAPI("/api/homepage");
        let page = res.data.data?.[0];
        if (!page) {
          toast.error("No Homepage draft found. Create the page first.");
          navigate("/super-admin/homepage/create");
          return;
        }
        setHomepageId(page._id);

        const secRes = await getAPI(`/api/homepage-sections/how-to-buy/${page._id}`);
        if (secRes.data?.success && secRes.data?.data) {
          const s = secRes.data.data;
          setSectionId(s._id);
          setFormData({
            heading: s.heading || "",
            description: s.description || "",
            buttonName: s.buttonName || "",
            buttonLink: s.buttonLink || "",
            cards: (s.cards || []).map(c => ({
              image: null,
              title: c.title || c.heading || "",
              description: c.description || "",
              icons: (c.icons || []).map(() => null),
            }))
          });

          // setExistingCardImages((s.cards || []).map(c => c.imageUrl || c.image || null));
          // setImagePreviews((s.cards || []).map(c => c.imageUrl || c.image || null));
          // setExistingIcons((s.cards || []).map(c => (c.iconUrls || c.icons || []).map(u => u?.url || u || null)));
          // setIconPreviews((s.cards || []).map(c => (c.iconUrls || c.icons || []).map(u => u?.url || u || null)));
          const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || `${process.env.REACT_APP_API_URL}`;

          setExistingCardImages(
            (s.cards || []).map(c =>
              c.image ? `${BASE_URL}/${c.image}` : null
            )
          );

          setImagePreviews(
            (s.cards || []).map(c =>
              c.image ? `${BASE_URL}/${c.image}` : null
            )
          );

          setExistingIcons(
            (s.cards || []).map(c =>
              (c.icons || []).map(icon =>
                icon ? `${BASE_URL}/${icon}` : null
              )
            )
          );

          setIconPreviews(
            (s.cards || []).map(c =>
              (c.icons || []).map(icon =>
                icon ? `${BASE_URL}/${icon}` : null
              )
            )
          );

        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    loadHomepageAndSection();
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
      toast.error(`${type} must be JPEG, PNG or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, cardIdx, field, iconIdx = null) => {
    const { files, value } = e.target;
    const updatedCards = [...formData.cards];
    const updatedImagePreviews = [...imagePreviews];
    const updatedIconPreviews = [...iconPreviews];

    if (field === "icons" && files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Icon")) return;
      updatedCards[cardIdx].icons[iconIdx] = file;
      updatedIconPreviews[cardIdx][iconIdx] = URL.createObjectURL(file);
      const updatedExistingIcons = [...existingIcons];
      if (!updatedExistingIcons[cardIdx]) updatedExistingIcons[cardIdx] = [];
      updatedExistingIcons[cardIdx][iconIdx] = null;
      setExistingIcons(updatedExistingIcons);
    } else if (files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Card Image")) return;
      updatedCards[cardIdx][field] = file;
      updatedImagePreviews[cardIdx] = URL.createObjectURL(file);
      const updatedExisting = [...existingCardImages];
      updatedExisting[cardIdx] = null;
      setExistingCardImages(updatedExisting);
    } else {
      updatedCards[cardIdx][field] = value;
    }

    setFormData({ ...formData, cards: updatedCards });
    setImagePreviews(updatedImagePreviews);
    setIconPreviews(updatedIconPreviews);
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { image: null, title: "", description: "", icons: [] }]
    });
    setImagePreviews([...imagePreviews, null]);
    setIconPreviews([...iconPreviews, []]);
  };

  const removeCard = (idx) => {
    setFormData({ ...formData, cards: formData.cards.filter((_, i) => i !== idx) });
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
    setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
  };

  const addIcon = (cardIdx) => {
    const updatedCards = [...formData.cards];
    updatedCards[cardIdx].icons.push(null);
    const updatedIcons = [...iconPreviews];
    updatedIcons[cardIdx].push(null);
    setFormData({ ...formData, cards: updatedCards });
    setIconPreviews(updatedIcons);
  };

  const removeIcon = (cardIdx, iconIdx) => {
    const updatedCards = [...formData.cards];
    updatedCards[cardIdx].icons = updatedCards[cardIdx].icons.filter((_, i) => i !== iconIdx);
    const updatedIcons = [...iconPreviews];
    updatedIcons[cardIdx] = updatedIcons[cardIdx].filter((_, i) => i !== iconIdx);
    setFormData({ ...formData, cards: updatedCards });
    setIconPreviews(updatedIcons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homepageId) {
      toast.error("Homepage not ready yet. Please wait.");
      return;
    }

    setLoading(true);
    try {
      if (!formData.heading.trim() || !formData.description.trim()) {
        toast.error("Heading & Description are required");
        setLoading(false);
        return;
      }
      if (!formData.buttonName.trim() || !formData.buttonLink.trim()) {
        toast.error("Button Name & Link are required");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("homepageId", homepageId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("buttonName", formData.buttonName.trim());
      submissionData.append("buttonLink", formData.buttonLink.trim());

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][title]`, c.title.trim());
        submissionData.append(`cards[${idx}][description]`, c.description.trim());
        if (c.image) submissionData.append(`cards[${idx}][image]`, c.image);
        c.icons.forEach((icon, i) => {
          if (icon) submissionData.append(`cards[${idx}][icons][${i}]`, icon);
        });
      });

      const res = await postAPI("/api/homepage-sections/how-to-buy/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "How To Buy section created successfully!");
        navigate("/super-admin/homepage/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to create section");
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
        <h2>Create How To Buy Section</h2>

        {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

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
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Button Name *</label>
                  <input
                    type="text"
                    name="buttonName"
                    value={formData.buttonName}
                    onChange={(e) => setFormData({ ...formData, buttonName: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Button Link *</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <h4>Cards</h4>
                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Card Image *</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/svg+xml"
                        onChange={(e) => handleChange(e, idx, "image")}
                        className="form-control"
                        required
                      />
                      {(imagePreviews[idx] || existingCardImages[idx]) && (
                        <img src={imagePreviews[idx] || existingCardImages[idx]}
                         alt="Card Preview"
                         style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }} />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => handleChange(e, idx, "title")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={c.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={3}
                        required
                      />
                    </div>

                    <h6>Icons (Optional)</h6>
                    {c.icons.map((icon, i) => (
                      <div key={i} className="form-group d-flex align-items-center">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml"
                          onChange={(e) => handleChange(e, idx, "icons", i)}
                          className="form-control"
                        />
                        {(iconPreviews[idx]?.[i] || existingIcons[idx]?.[i]) && (
                          <img src={iconPreviews[idx]?.[i] || existingIcons[idx]?.[i]} alt="Icon Preview" style={{ maxWidth: "60px", maxHeight: "60px", marginLeft: "5px" }} />
                        )}
                        <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => removeIcon(idx, i)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addIcon(idx)}>Add Icon</button>

                    <br />
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>


                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Saving..." : sectionId ? "Update How To Buy Section" : "Create How To Buy Section"}
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

export default HowToBuyCreate;