import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const HeroSectionCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttons: [{ name: "", link: "" }],
    recurrentTitles: [{ title: "", image: null, duration: "" }]
  });

  const [imagePreviews, setImagePreviews] = useState([null]);
  const [existingImages, setExistingImages] = useState([null]);
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

        const sectionRes = await getAPI(`/api/homepage-sections/hero/${page._id}`);
        if (sectionRes.data.success && sectionRes.data.data) {
          const section = sectionRes.data.data;
          setSectionId(section._id);

          setFormData({
            title: section.title || "",
            description: section.description || "",
            buttons: section.buttons?.length ? section.buttons : [{ name: "", link: "" }],
            recurrentTitles: section.recurrentTitles?.length ? section.recurrentTitles.map(rt => ({
              title: rt.title || "",
              image: null,
              duration: rt.duration || ""
            })) : [{ title: "", image: null, duration: "" }]
          });

          // const existingImgs = section.recurrentTitles?.map(rt => rt.image || rt.imageUrl || null) || [null];
          // setExistingImages(existingImgs);
          // setImagePreviews(existingImgs);

          const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || `${process.env.REACT_APP_API_URL}`;
          const existingImgs = (section.recurrentTitles || []).map(rt =>
            rt.image ? `${BASE_URL}/${rt.image}` : (rt.imageUrl ? `${BASE_URL}/${rt.imageUrl}` : null)
          );
          setExistingImages(existingImgs.length ? existingImgs : [null]);
          setImagePreviews(existingImgs.length ? existingImgs : [null]);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    loadHomepageAndSection();
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
      toast.error(`${type} must be JPEG, PNG, or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleRecurrentChange = (e, idx, field) => {
    const { value, files } = e.target;
    const updated = [...formData.recurrentTitles];
    const updatedPreviews = [...imagePreviews];

    if (field === "image" && files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Recurrent Image")) return;
      updated[idx][field] = file;
      updatedPreviews[idx] = URL.createObjectURL(file);
      const updatedExisting = [...existingImages];
      updatedExisting[idx] = null;
      setExistingImages(updatedExisting);
    } else {
      updated[idx][field] = value;
    }

    setFormData({ ...formData, recurrentTitles: updated });
    setImagePreviews(updatedPreviews);
  };

  const addRecurrentTitle = () => {
    setFormData({
      ...formData,
      recurrentTitles: [...formData.recurrentTitles, { title: "", image: null, duration: "" }]
    });
    setImagePreviews([...imagePreviews, null]);
    setExistingImages([...existingImages, null]);
  };

  const removeRecurrentTitle = (idx) => {
    setFormData({
      ...formData,
      recurrentTitles: formData.recurrentTitles.filter((_, i) => i !== idx)
    });
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const handleButtonChange = (e, idx) => {
    const { name, value } = e.target;
    const updated = [...formData.buttons];
    updated[idx][name] = value;
    setFormData({ ...formData, buttons: updated });
  };

  const addButton = () => {
    setFormData({ ...formData, buttons: [...formData.buttons, { name: "", link: "" }] });
  };

  const removeButton = (idx) => {
    setFormData({ ...formData, buttons: formData.buttons.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homepageId) {
      toast.error("Homepage not ready yet. Please wait.");
      return;
    }

    setLoading(true);
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error("Title & Description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.recurrentTitles.length; i++) {
        const rt = formData.recurrentTitles[i];
        if (!rt.title.trim() || !rt.image || !rt.duration) {
          toast.error(`Recurrent Title ${i + 1} requires title, image & duration`);
          setLoading(false);
          return;
        }
      }

      for (let i = 0; i < formData.buttons.length; i++) {
        const btn = formData.buttons[i];
        if (!btn.name.trim() || !btn.link.trim()) {
          toast.error(`Button ${i + 1} requires name & link`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("homepageId", homepageId);
      submissionData.append("title", formData.title.trim());
      submissionData.append("description", formData.description.trim());

      formData.recurrentTitles.forEach((rt, idx) => {
        submissionData.append(`recurrentTitles[${idx}][title]`, rt.title.trim());
        submissionData.append(`recurrentTitles[${idx}][duration]`, rt.duration);
        if (rt.image) submissionData.append(`recurrentTitles[${idx}][image]`, rt.image);
      });

      formData.buttons.forEach((btn, idx) => {
        submissionData.append(`buttons[${idx}][name]`, btn.name.trim());
        submissionData.append(`buttons[${idx}][link]`, btn.link.trim());
      });

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/hero/update/${sectionId}`
      //   : "/api/homepage-sections/hero/create";

      // const res = await postAPI(endpoint, submissionData, {
      //   headers: { "Content-Type": "multipart/form-data" },

      const res = await postAPI("/api/homepage-sections/hero/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Hero Section saved successfully!");
        navigate("/super-admin/homepage/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save Hero Section");
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
        <h2>{sectionId ? "Edit Hero Section" : "Create Hero Section"}</h2>

        {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-control" required />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-control" rows={4} required />
                </div>

                <h4>Recurrent Titles</h4>
                {formData.recurrentTitles.map((rt, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Title *</label>
                      <input type="text" value={rt.title} onChange={(e) => handleRecurrentChange(e, idx, "title")} className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>Image *</label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleRecurrentChange(e, idx, "image")} className="form-control" required />
                      {(imagePreviews[idx] || existingImages[idx]) && <img src={imagePreviews[idx] || existingImages[idx]} alt="Recurrent Preview" style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }} />}
                    </div>
                    <div className="form-group">
                      <label>Duration (seconds) *</label>
                      <input type="number" value={rt.duration} onChange={(e) => handleRecurrentChange(e, idx, "duration")} className="form-control" required />
                    </div>
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeRecurrentTitle(idx)}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addRecurrentTitle}>Add Recurrent Title</button>


                <h4>Buttons</h4>
                {formData.buttons.map((btn, idx) => (
                  <div key={idx} className="form-group d-flex gap-2">
                    <input type="text" name="name" placeholder="Button Name" value={btn.name} onChange={(e) => handleButtonChange(e, idx)} className="form-control" required />
                    <input type="text" name="link" placeholder="Button Link" value={btn.link} onChange={(e) => handleButtonChange(e, idx)} className="form-control" required />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeButton(idx)}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addButton}>Add Button</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Saving..." : sectionId ? "Update Hero Section" : "Create Hero Section"}
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

export default HeroSectionCreate;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const HeroSectionCreate = () => {
//   const navigate = useNavigate();

//   const [homepageId, setHomepageId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     buttons: [{ name: "", link: "" }],
//     recurrentTitles: [{ title: "", image: null, duration: "" }]
//   });

//   const [imagePreviews, setImagePreviews] = useState([null]);
//   const [existingImages, setExistingImages] = useState([null]);
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

//         const sectionRes = await getAPI(`/api/homepage-sections/hero/${page._id}`);
//         if (sectionRes.data.success && sectionRes.data.data) {
//           const section = sectionRes.data.data;
//           setSectionId(section._id);

//           setFormData({
//             title: section.title || "",
//             description: section.description || "",
//             buttons: section.buttons?.length ? section.buttons : [{ name: "", link: "" }],
//             recurrentTitles: section.recurrentTitles?.length ? section.recurrentTitles.map(rt => ({
//               title: rt.title || "",
//               image: null,
//               duration: rt.duration || ""
//             })) : [{ title: "", image: null, duration: "" }]
//           });

//           // const existingImgs = section.recurrentTitles?.map(rt => rt.image || rt.imageUrl || null) || [null];
//           // setExistingImages(existingImgs);
//           // setImagePreviews(existingImgs);

//           const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || "http://localhost:3001";

//           const existingImgs =
//             section.recurrentTitles?.map(rt =>
//               rt.image ? `${BASE_URL}/${rt.image}` :
//                 rt.imageUrl ? `${BASE_URL}/${rt.imageUrl}` :
//                   null
//             ) || [null];

//           setExistingImages(existingImgs);
//           setImagePreviews(existingImgs);

//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load Homepage");
//       }
//     };
//     loadHomepageAndSection();
//   }, []);

//   const validateImageFile = (file, type) => {
//     if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
//       toast.error(`${type} must be JPEG, PNG, or SVG`);
//       return false;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${type} must be less than 5MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleRecurrentChange = (e, idx, field) => {
//     const { value, files } = e.target;
//     const updated = [...formData.recurrentTitles];
//     const updatedPreviews = [...imagePreviews];
//     const updatedExisting = [...existingImages];
//     if (field === "image" && files && files[0]) {
//       const file = files[0];
//       if (!validateImageFile(file, "Recurrent Image")) return;
//       updated[idx][field] = file;
//       updatedPreviews[idx] = URL.createObjectURL(file);

//       updatedExisting[idx] = null;
//       setExistingImages(updatedExisting);
//     } else {
//       updated[idx][field] = value;
//     }

//     setFormData({ ...formData, recurrentTitles: updated });
//     setImagePreviews(updatedPreviews);
//   };

//   const addRecurrentTitle = () => {
//     setFormData({
//       ...formData,
//       recurrentTitles: [...formData.recurrentTitles, { title: "", image: null, duration: "" }]
//     });
//     setImagePreviews([...imagePreviews, null]);
//     setExistingImages([...existingImages, null]);
//   };

//   const removeRecurrentTitle = (idx) => {
//     setFormData({
//       ...formData,
//       recurrentTitles: formData.recurrentTitles.filter((_, i) => i !== idx)
//     });
//     setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
//     setExistingImages(existingImages.filter((_, i) => i !== idx));
//   };

//   const handleButtonChange = (e, idx) => {
//     const { name, value } = e.target;
//     const updated = [...formData.buttons];
//     updated[idx][name] = value;
//     setFormData({ ...formData, buttons: updated });
//   };

//   const addButton = () => {
//     setFormData({ ...formData, buttons: [...formData.buttons, { name: "", link: "" }] });
//   };

//   const removeButton = (idx) => {
//     setFormData({ ...formData, buttons: formData.buttons.filter((_, i) => i !== idx) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!homepageId) {
//       toast.error("Homepage not ready yet. Please wait.");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (!formData.title.trim() || !formData.description.trim()) {
//         toast.error("Title & Description are required");
//         setLoading(false);
//         return;
//       }

//       for (let i = 0; i < formData.recurrentTitles.length; i++) {
//         const rt = formData.recurrentTitles[i];
//         if (!rt.title.trim() || !rt.image || !rt.duration) {
//           toast.error(`Recurrent Title ${i + 1} requires title, image & duration`);
//           setLoading(false);
//           return;
//         }
//       }

//       for (let i = 0; i < formData.buttons.length; i++) {
//         const btn = formData.buttons[i];
//         if (!btn.name.trim() || !btn.link.trim()) {
//           toast.error(`Button ${i + 1} requires name & link`);
//           setLoading(false);
//           return;
//         }
//       }

//       const submissionData = new FormData();
//       submissionData.append("homepageId", homepageId);
//       submissionData.append("title", formData.title.trim());
//       submissionData.append("description", formData.description.trim());

//       formData.recurrentTitles.forEach((rt, idx) => {
//         submissionData.append(`recurrentTitles[${idx}][title]`, rt.title.trim());
//         submissionData.append(`recurrentTitles[${idx}][duration]`, rt.duration);
//         if (rt.image) submissionData.append(`recurrentTitles[${idx}][image]`, rt.image);
//       });

//       formData.buttons.forEach((btn, idx) => {
//         submissionData.append(`buttons[${idx}][name]`, btn.name.trim());
//         submissionData.append(`buttons[${idx}][link]`, btn.link.trim());
//       });

//       const res = await postAPI("/api/homepage-sections/hero/create", submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message || "Hero Section saved successfully!");
//         navigate("/super-admin/homepage/create", { state: { reload: true } });
//       } else {
//         toast.error(res.data.message || "Failed to save Hero Section");
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
//         <h2>{sectionId ? "Edit Hero Section" : "Create Hero Section"}</h2>

//         {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">

//                 <div className="form-group">
//                   <label>Title *</label>
//                   <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-control" required />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-control" rows={4} required />
//                 </div>

//                 <h4>Recurrent Titles</h4>
//                 {formData.recurrentTitles.map((rt, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Title *</label>
//                       <input type="text" value={rt.title} onChange={(e) => handleRecurrentChange(e, idx, "title")} className="form-control" required />
//                     </div>
//                     <div className="form-group">
//                       <label>Image *</label>
//                       <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleRecurrentChange(e, idx, "image")} className="form-control" required />
//                       {(imagePreviews[idx] || existingImages[idx]) && <img src={imagePreviews[idx] || existingImages[idx]} alt="Recurrent Preview" style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }} />}
//                     </div>
//                     <div className="form-group">
//                       <label>Duration (seconds) *</label>
//                       <input type="number" value={rt.duration} onChange={(e) => handleRecurrentChange(e, idx, "duration")} className="form-control" required />
//                     </div>
//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeRecurrentTitle(idx)}>Remove</button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addRecurrentTitle}>Add Recurrent Title</button>


//                 <h4>Buttons</h4>
//                 {formData.buttons.map((btn, idx) => (
//                   <div key={idx} className="form-group d-flex gap-2">
//                     <input type="text" name="name" placeholder="Button Name" value={btn.name} onChange={(e) => handleButtonChange(e, idx)} className="form-control" required />
//                     <input type="text" name="link" placeholder="Button Link" value={btn.link} onChange={(e) => handleButtonChange(e, idx)} className="form-control" required />
//                     <button type="button" className="btn btn-danger btn-sm" onClick={() => removeButton(idx)}>Remove</button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addButton}>Add Button</button>

//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
//                     {loading ? "Saving..." : sectionId ? "Update Hero Section" : "Create Hero Section"}
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

// export default HeroSectionCreate;