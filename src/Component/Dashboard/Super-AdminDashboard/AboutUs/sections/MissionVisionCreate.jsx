// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const MissionVisionCreate = () => {
//   const navigate = useNavigate();

//   const [cards, setCards] = useState([
//     { icon: null, heading: "", description: "", sideImage: null },
//   ]);
//   const [iconPreviews, setIconPreviews] = useState([null]);
//   const [sideImagePreviews, setSideImagePreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [aboutUsId, setAboutUsId] = useState(null);

//   useEffect(() => {
//     const ensureAboutUsPage = async () => {
//       try {
//         const res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];
//         if (!page) {
//           const createRes = await postAPI("/api/about-us/create", { title: "About Us" });
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
//     if (!file.type.match(/image\/(jpeg|png|svg)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, index, field) => {
//     const { files, value } = e.target;
//     const updatedCards = [...cards];
//     const updatedIconPreviews = [...iconPreviews];
//     const updatedSidePreviews = [...sideImagePreviews];

//     if (files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, field === "icon" ? "Icon" : "Side Image")) return;

//       updatedCards[index][field] = file;

//       if (field === "icon") updatedIconPreviews[index] = URL.createObjectURL(file);
//       else updatedSidePreviews[index] = URL.createObjectURL(file);
//     } else {
//       updatedCards[index][field] = value;
//     }

//     setCards(updatedCards);
//     setIconPreviews(updatedIconPreviews);
//     setSideImagePreviews(updatedSidePreviews);
//   };

//   const addCard = () => {
//     setCards([...cards, { icon: null, heading: "", description: "", sideImage: null }]);
//     setIconPreviews([...iconPreviews, null]);
//     setSideImagePreviews([...sideImagePreviews, null]);
//   };

//   const removeCard = (idx) => {
//     setCards(cards.filter((_, i) => i !== idx));
//     setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
//     setSideImagePreviews(sideImagePreviews.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!aboutUsId) {
//         toast.error("About Us page not ready yet. Please wait.");
//         setLoading(false);
//         return;
//       }
//       for (let i = 0; i < cards.length; i++) {
//         const c = cards[i];
//         if (!c.heading.trim() || !c.description.trim()) {
//           toast.error(`Card ${i + 1} requires heading & description`);
//           setLoading(false);
//           return;
//         }
//         if (!c.icon || !c.sideImage) {
//           toast.error(`Card ${i + 1} requires icon and side image`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("aboutUsId", aboutUsId);
//       cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][heading]`, c.heading.trim());
//         submissionData.append(`cards[${idx}][description]`, c.description.trim());
//         if (c.icon) submissionData.append(`cards[${idx}][icon]`, c.icon);
//         if (c.sideImage) submissionData.append(`cards[${idx}][sideImage]`, c.sideImage);
//       });

//       const res = await postAPI("/api/about-us-sections/mission-vision/create", submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.data) {
//         toast.success(res.data.message || "Mission & Vision cards created successfully!");
//         navigate("/super-admin/about-us/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to create cards");
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
//         <h2>Create Mission & Vision Cards</h2>
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 {cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Emoji/Icon *</label>
//                       <input type="file" accept="image/jpeg,image/png, image/svg+xml" onChange={(e) => handleChange(e, idx, "icon")} className="form-control" required />
//                       {iconPreviews[idx] && <img src={iconPreviews[idx]} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />}
//                     </div>

//                     <div className="form-group">
//                       <label>Heading *</label>
//                       <input type="text" value={c.heading} onChange={(e) => handleChange(e, idx, "heading")} className="form-control" required />
//                     </div>

//                     <div className="form-group">
//                       <label>Description *</label>
//                       <textarea value={c.description} onChange={(e) => handleChange(e, idx, "description")} className="form-control" rows={3} required />
//                     </div>

//                     <div className="form-group">
//                       <label>Side Image *</label>
//                       <input type="file" accept="image/jpeg,image/png, image/svg+xml" onChange={(e) => handleChange(e, idx, "sideImage")} className="form-control" required />
//                       {sideImagePreviews[idx] && <img src={sideImagePreviews[idx]} alt="Side Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
//                     </div>

//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading}>
//                     {loading ? "Creating..." : "Create Cards"}
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

// export default MissionVisionCreate;












// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const MissionVisionCreate = () => {
//   const navigate = useNavigate();

//   const [cards, setCards] = useState([{ icon: null, heading: "", description: "", sideImage: null }]);
//   const [iconPreviews, setIconPreviews] = useState([null]);
//   const [sideImagePreviews, setSideImagePreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [aboutUsId, setAboutUsId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);

//   useEffect(() => {
//     const fetchAboutUsAndSection = async () => {
//       try {
//         let res = await getAPI("/api/about-us");
//         let page = res.data.data?.[0];

//         if (!page) {
//           const createRes = await postAPI("/api/about-us/create", { title: "About Us" });
//           page = createRes.data.data;
//         }

//         setAboutUsId(page._id);

//         const sectionRes = await getAPI(`/api/about-us-sections/mission-vision/${page._id}`);
//         if (sectionRes.data.success && sectionRes.data.data) {
//           const s = sectionRes.data.data;
//           setSectionId(s._id);
//           setCards(
//             s.cards?.length
//               ? s.cards.map(c => ({ icon: null, heading: c.heading, description: c.description, sideImage: null }))
//               : [{ icon: null, heading: "", description: "", sideImage: null }]
//           );
//           setIconPreviews(s.cards?.map(() => null) || [null]);
//           setSideImagePreviews(s.cards?.map(() => null) || [null]);
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load About Us page");
//       }
//     };

//     fetchAboutUsAndSection();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg)/)) {
//       toast.error(`${type} must be JPEG, PNG or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, index, field) => {
//     const { files, value } = e.target;
//     const updatedCards = [...cards];
//     const updatedIconPreviews = [...iconPreviews];
//     const updatedSidePreviews = [...sideImagePreviews];

//     if (files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, field === "icon" ? "Icon" : "Side Image")) return;

//       updatedCards[index][field] = file;

//       if (field === "icon") updatedIconPreviews[index] = URL.createObjectURL(file);
//       else updatedSidePreviews[index] = URL.createObjectURL(file);
//     } else {
//       updatedCards[index][field] = value;
//     }

//     setCards(updatedCards);
//     setIconPreviews(updatedIconPreviews);
//     setSideImagePreviews(updatedSidePreviews);
//   };

//   const addCard = () => {
//     setCards([...cards, { icon: null, heading: "", description: "", sideImage: null }]);
//     setIconPreviews([...iconPreviews, null]);
//     setSideImagePreviews([...sideImagePreviews, null]);
//   };

//   const removeCard = idx => {
//     setCards(cards.filter((_, i) => i !== idx));
//     setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
//     setSideImagePreviews(sideImagePreviews.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!aboutUsId) {
//         toast.error("About Us page not ready yet. Please wait.");
//         setLoading(false);
//         return;
//       }

//       for (let i = 0; i < cards.length; i++) {
//         const c = cards[i];
//         if (!c.heading.trim() || !c.description.trim()) {
//           toast.error(`Card ${i + 1} requires heading & description`);
//           setLoading(false);
//           return;
//         }
//         if (!c.icon && !sectionId) {
//           toast.error(`Card ${i + 1} requires icon`);
//           setLoading(false);
//           return;
//         }
//         if (!c.sideImage && !sectionId) {
//           toast.error(`Card ${i + 1} requires side image`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("aboutUsId", aboutUsId);
//       cards.forEach((c, idx) => {
//         submissionData.append(`cards[${idx}][heading]`, c.heading.trim());
//         submissionData.append(`cards[${idx}][description]`, c.description.trim());
//         if (c.icon) submissionData.append(`cards[${idx}][icon]`, c.icon);
//         if (c.sideImage) submissionData.append(`cards[${idx}][sideImage]`, c.sideImage);
//       });

//       let res;
//       if (sectionId) {
//         res = await postAPI(`/api/about-us-sections/mission-vision/update/${sectionId}`, submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         res = await postAPI("/api/about-us-sections/mission-vision/create", submissionData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       if (res.data.success) {
//         toast.success(res.data.message || "Mission & Vision cards saved successfully!");
//         navigate("/super-admin/about-us/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to save cards");
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
//         <h2>Create Mission & Vision Cards</h2>
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 {cards.map((c, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Emoji/Icon {sectionId ? " " : "*"} </label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={e => handleChange(e, idx, "icon")} className="form-control" />
//                       {iconPreviews[idx] && <img src={iconPreviews[idx]} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />}
//                     </div>

//                     <div className="form-group">
//                       <label>Heading *</label>
//                       <input type="text" value={c.heading} onChange={e => handleChange(e, idx, "heading")} className="form-control" required />
//                     </div>

//                     <div className="form-group">
//                       <label>Description *</label>
//                       <textarea value={c.description} onChange={e => handleChange(e, idx, "description")} className="form-control" rows={3} required />
//                     </div>

//                     <div className="form-group">
//                       <label>Side Image {sectionId ? " " : "*"} </label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={e => handleChange(e, idx, "sideImage")} className="form-control" />
//                       {sideImagePreviews[idx] && <img src={sideImagePreviews[idx]} alt="Side Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
//                     </div>

//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading}>
//                     {loading ? "Saving..." : sectionId ? "Update Cards" : "Create Cards"}
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

// export default MissionVisionCreate;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const MissionVisionCreate = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState([{ icon: null, heading: "", description: "", sideImage: null, existingIcon: null, existingSideImage: null }]);
  const [iconPreviews, setIconPreviews] = useState([null]);
  const [sideImagePreviews, setSideImagePreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const fetchAboutUsAndSection = async () => {
      try {
        let res = await getAPI("/api/about-us");
        let page = res.data.data?.[0];

        if (!page) {
          const createRes = await postAPI("/api/about-us/create", { title: "About Us" });
          page = createRes.data.data;
        }

        setAboutUsId(page._id);

        const sectionRes = await getAPI(`/api/about-us-sections/mission-vision/${page._id}`);
        if (sectionRes.data.success && sectionRes.data.data) {
          const s = sectionRes.data.data;
          setSectionId(s._id);

          // const existingCards = s.cards?.length
          //   ? s.cards.map(c => ({
          //       icon: null,
          //       heading: c.heading,
          //       description: c.description,
          //       sideImage: null,
          //       existingIcon: c.iconUrl || c.icon || null,
          //       existingSideImage: c.sideImageUrl || c.sideImage || null,
          //     }))
          //   : [{ icon: null, heading: "", description: "", sideImage: null, existingIcon: null, existingSideImage: null }];
          const existingCards = s.cards?.length
            ? s.cards.map(c => ({
              icon: null,
              heading: c.heading,
              description: c.description,
              sideImage: null,
              existingIcon: c.icon
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.icon}`
                : c.iconUrl || null,
              existingSideImage: c.sideImage
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.sideImage}`
                : c.sideImageUrl || null,
            }))
            : [{ icon: null, heading: "", description: "", sideImage: null, existingIcon: null, existingSideImage: null }];
          setCards(existingCards);
          setIconPreviews(existingCards.map(c => c.existingIcon || null));
          setSideImagePreviews(existingCards.map(c => c.existingSideImage || null));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };

    fetchAboutUsAndSection();
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg)/)) {
      toast.error(`${type} must be JPEG, PNG or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index, field) => {
    const { files, value } = e.target;
    const updatedCards = [...cards];
    const updatedIconPreviews = [...iconPreviews];
    const updatedSidePreviews = [...sideImagePreviews];

    if (files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, field === "icon" ? "Icon" : "Side Image")) return;

      updatedCards[index][field] = file;
      if (field === "icon") updatedIconPreviews[index] = URL.createObjectURL(file);
      else updatedSidePreviews[index] = URL.createObjectURL(file);
    } else {
      updatedCards[index][field] = value;
    }

    setCards(updatedCards);
    setIconPreviews(updatedIconPreviews);
    setSideImagePreviews(updatedSidePreviews);
  };

  const addCard = () => {
    setCards([...cards, { icon: null, heading: "", description: "", sideImage: null, existingIcon: null, existingSideImage: null }]);
    setIconPreviews([...iconPreviews, null]);
    setSideImagePreviews([...sideImagePreviews, null]);
  };

  const removeCard = idx => {
    setCards(cards.filter((_, i) => i !== idx));
    setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
    setSideImagePreviews(sideImagePreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!aboutUsId) {
        toast.error("About Us page not ready yet. Please wait.");
        setLoading(false);
        return;
      }

      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (!c.heading.trim() || !c.description.trim()) {
          toast.error(`Card ${i + 1} requires heading & description`);
          setLoading(false);
          return;
        }
        if (!c.icon && !c.existingIcon) {
          toast.error(`Card ${i + 1} requires an icon`);
          setLoading(false);
          return;
        }
        if (!c.sideImage && !c.existingSideImage) {
          toast.error(`Card ${i + 1} requires a side image`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);

      cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][heading]`, c.heading.trim());
        submissionData.append(`cards[${idx}][description]`, c.description.trim());
        if (c.icon) submissionData.append(`cards[${idx}][icon]`, c.icon);
        if (c.sideImage) submissionData.append(`cards[${idx}][sideImage]`, c.sideImage);
      });

      let res;
      if (sectionId) {
        res = await postAPI(`/api/about-us-sections/mission-vision/update/${sectionId}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await postAPI("/api/about-us-sections/mission-vision/create", submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || "Mission & Vision cards saved successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save cards");
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
        <h2>Edit Mission & Vision Cards</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Emoji/Icon {sectionId ? " " : "*"} </label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={e => handleChange(e, idx, "icon")} className="form-control" />
                      {(iconPreviews[idx] || c.existingIcon) && (
                        <img src={iconPreviews[idx] || c.existingIcon} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Heading *</label>
                      <input type="text" value={c.heading} onChange={e => handleChange(e, idx, "heading")} className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea value={c.description} onChange={e => handleChange(e, idx, "description")} className="form-control" rows={3} required />
                    </div>

                    <div className="form-group">
                      <label>Side Image {sectionId ? " " : "*"} </label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={e => handleChange(e, idx, "sideImage")} className="form-control" />
                      {(sideImagePreviews[idx] || c.existingSideImage) && (
                        <img src={sideImagePreviews[idx] || c.existingSideImage} alt="Side Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />
                      )}
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : sectionId ? "Update Cards" : "Create Cards"}
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

export default MissionVisionCreate;
