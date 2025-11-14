// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const WhyFromArtsaysCreate = () => {
//   const navigate = useNavigate();

//   const [homepageId, setHomepageId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     buttonName: "",
//     buttonLink: "",
//     cards: [],
//   });

//   const [loading, setLoading] = useState(false);

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

//         // Fetch existing why buy artsays section
//         const sectionRes = await getAPI(`/api/homepage-sections/why-buy-artsays/${page._id}`);
//         if (sectionRes.data.success && sectionRes.data.data) {
//           const section = sectionRes.data.data;
//           setSectionId(section._id);

//           setFormData({
//             heading: section.heading || "",
//             description: section.description || "",
//             buttonName: section.buttonName || "",
//             buttonLink: section.buttonLink || "",
//             cards: section.cards?.length ? section.cards.map(card => ({
//               image: null,
//               preview: card.icon || card.iconUrl || null,
//               title: card.heading || card.title || "",
//               description: card.description || ""
//             })) : []
//           });
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load Homepage");
//       }
//     };
//     loadHomepageAndSection();
//   }, []);

//   const validateImageFile = (file) => {
//     if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
//       toast.error("Card image must be JPEG or PNG");
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Card image must be less than 5MB");
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e, idx = null, field = null) => {
//     const { name, value, files } = e.target;

//     if (idx !== null && field !== null) {
//       const updatedCards = [...formData.cards];
//       if (field === "image" && files && files[0]) {
//         const file = files[0];
//         if (!validateImageFile(file)) return;
//         updatedCards[idx].image = file;
//         updatedCards[idx].preview = URL.createObjectURL(file);
//       } else {
//         updatedCards[idx][field] = value;
//       }
//       setFormData({ ...formData, cards: updatedCards });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [...formData.cards, { image: null, preview: null, title: "", description: "" }],
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
//   //   if (!homepageId) {
//   //     toast.error("Homepage not ready yet. Please wait.");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     if (!formData.heading.trim() || !formData.description.trim()) {
//   //       toast.error("Heading & Description are required");
//   //       setLoading(false);
//   //       return;
//   //     }
//   //     if (!formData.buttonName.trim() || !formData.buttonLink.trim()) {
//   //       toast.error("Button Name & Link are required");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const submissionData = new FormData();
//   //     submissionData.append("homepageId", homepageId);
//   //     submissionData.append("heading", formData.heading.trim());
//   //     submissionData.append("description", formData.description.trim());
//   //     submissionData.append("buttonName", formData.buttonName.trim());
//   //     submissionData.append("buttonLink", formData.buttonLink.trim());

//   //     formData.cards.forEach((c, idx) => {
//   //       if (c.image) submissionData.append(`cards[${idx}][icon]`, c.image);
//   //       submissionData.append(`cards[${idx}][heading]`, c.title.trim());
//   //       submissionData.append(`cards[${idx}][description]`, c.description.trim());
//   //     });

//   //     const res = await postAPI("/api/homepage-sections/why-buy-artsays/create", submissionData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     if (res.data.success) {
//   //       toast.success(res.data.message || "Section created successfully!");
//   //       navigate("/super-admin/homepage/create", { state: { reload: true } });
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

//       if (formData.cards.length === 0) {
//         toast.error("At least one card is required");
//         setLoading(false);
//         return;
//       }

//       const submissionData = new FormData();
//       submissionData.append("homepageId", homepageId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());
//       submissionData.append("buttonName", formData.buttonName.trim());
//       submissionData.append("buttonLink", formData.buttonLink.trim());


//       for (let idx = 0; idx < formData.cards.length; idx++) {
//         const c = formData.cards[idx];

//         if (!c.image) {
//           toast.error(`Card ${idx + 1} icon file is required`);
//           setLoading(false);
//           return;
//         }
//         if (!c.title.trim() || !c.description.trim()) {
//           toast.error(`Card ${idx + 1} title and description are required`);
//           setLoading(false);
//           return;
//         }

//         submissionData.append(`cards[${idx}][icon]`, c.image);
//         submissionData.append(`cards[${idx}][heading]`, c.title.trim());
//         submissionData.append(`cards[${idx}][description]`, c.description.trim());
//       }

//       // const endpoint = sectionId
//       //   ? `/api/homepage-sections/why-buy-artsays/update/${sectionId}`
//       //   : "/api/homepage-sections/why-buy-artsays/create";

//       // const res = await postAPI(endpoint, submissionData, {
//       //   headers: { "Content-Type": "multipart/form-data" },

//       const res = await postAPI("/api/homepage-sections/why-buy-artsays/create", submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message || "Section saved successfully!");
//         navigate("/super-admin/homepage/create", { state: { reload: true } });
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
//         <h2>{sectionId ? "Edit Why From Artsays Section" : "Create Why From Artsays Section"}</h2>

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
//                     onChange={handleChange}
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
//                     onChange={handleChange}
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
//                         accept="image/jpeg,image/png"
//                         onChange={(e) => handleChange(e, idx, "image")}
//                         className="form-control"
//                         required
//                       />
//                       {c.preview && (
//                         <img
//                           src={c.preview}
//                           alt="Preview"
//                           style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "4px" }}
//                         />
//                       )}
//                     </div>
//                     <div className="form-group">
//                       <label>Card Title *</label>
//                       <input
//                         type="text"
//                         value={c.title}
//                         onChange={(e) => handleChange(e, idx, "title")}
//                         className="form-control"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Card Description *</label>
//                       <textarea
//                         value={c.description}
//                         onChange={(e) => handleChange(e, idx, "description")}
//                         className="form-control"
//                         rows={3}
//                         required
//                       />
//                     </div>
//                     <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCard(idx)}>
//                       Remove Card
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>
//                   Add Card
//                 </button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
//                     {loading ? "Saving..." : sectionId ? "Update Why From Artsays Section" : "Create Why From Artsays Section"}
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

// export default WhyFromArtsaysCreate;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const WhyFromArtsaysCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    buttonName: "",
    buttonLink: "",
    cards: [],
  });

  const [loading, setLoading] = useState(false);

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

        const sectionRes = await getAPI(`/api/homepage-sections/why-buy-artsays/${page._id}`);
        if (sectionRes.data.success && sectionRes.data.data) {
          const section = sectionRes.data.data;
          setSectionId(section._id);

          setFormData({
            heading: section.heading || "",
            description: section.description || "",
            buttonName: section.buttonName || "",
            buttonLink: section.buttonLink || "",
            cards: section.cards?.length ? section.cards.map(card => ({
              image: null,
              //preview: card.icon || card.iconUrl || null,
              preview: card.icon
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${card.icon}`
          : null,
              title: card.heading || card.title || "",
              description: card.description || ""
            })) : []
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    loadHomepageAndSection();
  }, []);

  const validateImageFile = (file) => {
    if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
      toast.error("Card image must be JPEG or PNG");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Card image must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleChange = (e, idx = null, field = null) => {
    const { name, value, files } = e.target;

    if (idx !== null && field !== null) {
      const updatedCards = [...formData.cards];
      if (field === "image" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file)) return;
        updatedCards[idx].image = file;
        updatedCards[idx].preview = URL.createObjectURL(file);
      } else {
        updatedCards[idx][field] = value;
      }
      setFormData({ ...formData, cards: updatedCards });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { image: null, preview: null, title: "", description: "" }],
    });
  };

  const removeCard = (idx) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== idx),
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!homepageId) {
  //     toast.error("Homepage not ready yet. Please wait.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     if (!formData.heading.trim() || !formData.description.trim()) {
  //       toast.error("Heading & Description are required");
  //       setLoading(false);
  //       return;
  //     }
  //     if (!formData.buttonName.trim() || !formData.buttonLink.trim()) {
  //       toast.error("Button Name & Link are required");
  //       setLoading(false);
  //       return;
  //     }

  //     const submissionData = new FormData();
  //     submissionData.append("homepageId", homepageId);
  //     submissionData.append("heading", formData.heading.trim());
  //     submissionData.append("description", formData.description.trim());
  //     submissionData.append("buttonName", formData.buttonName.trim());
  //     submissionData.append("buttonLink", formData.buttonLink.trim());

  //     formData.cards.forEach((c, idx) => {
  //       if (c.image) submissionData.append(`cards[${idx}][icon]`, c.image);
  //       submissionData.append(`cards[${idx}][heading]`, c.title.trim());
  //       submissionData.append(`cards[${idx}][description]`, c.description.trim());
  //     });

  //     const res = await postAPI("/api/homepage-sections/why-buy-artsays/create", submissionData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (res.data.success) {
  //       toast.success(res.data.message || "Section created successfully!");
  //       navigate("/super-admin/homepage/create", { state: { reload: true } });
  //     } else {
  //       toast.error(res.data.message || "Failed to create section");
  //     }
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      if (formData.cards.length === 0) {
        toast.error("At least one card is required");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("homepageId", homepageId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("buttonName", formData.buttonName.trim());
      submissionData.append("buttonLink", formData.buttonLink.trim());


      for (let idx = 0; idx < formData.cards.length; idx++) {
        const c = formData.cards[idx];

        if (!c.image) {
          toast.error(`Card ${idx + 1} icon file is required`);
          setLoading(false);
          return;
        }
        if (!c.title.trim() || !c.description.trim()) {
          toast.error(`Card ${idx + 1} title and description are required`);
          setLoading(false);
          return;
        }

        submissionData.append(`cards[${idx}][icon]`, c.image);
        submissionData.append(`cards[${idx}][heading]`, c.title.trim());
        submissionData.append(`cards[${idx}][description]`, c.description.trim());
      }

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/why-buy-artsays/update/${sectionId}`
      //   : "/api/homepage-sections/why-buy-artsays/create";

      // const res = await postAPI(endpoint, submissionData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      const res = await postAPI("/api/homepage-sections/why-buy-artsays/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Section saved successfully!");
        navigate("/super-admin/homepage/create", { state: { reload: true } });
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
        <h2>{sectionId ? "Edit Why From Artsays Section" : "Create Why From Artsays Section"}</h2>

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


                <div className="form-group">
                  <label>Button Name *</label>
                  <input
                    type="text"
                    name="buttonName"
                    value={formData.buttonName}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleChange(e, idx, "image")}
                        className="form-control"
                        required
                      />
                      {c.preview && (
                        <img
                          src={c.preview}
                          alt="Preview"
                          style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "4px" }}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Card Title *</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => handleChange(e, idx, "title")}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={3}
                        required
                      />
                    </div>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCard(idx)}>
                      Remove Card
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>
                  Add Card
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Saving..." : sectionId ? "Update Why From Artsays Section" : "Create Why From Artsays Section"}
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

export default WhyFromArtsaysCreate;