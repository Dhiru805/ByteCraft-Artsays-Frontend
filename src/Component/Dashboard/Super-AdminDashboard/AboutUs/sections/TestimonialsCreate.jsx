



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const TestimonialsCreate = () => {
//   const navigate = useNavigate();

//   const [aboutUsId, setAboutUsId] = useState(null); 
//   const [formData, setFormData] = useState({
//     mainHeading: "",
//     mainDescription: "",
//     testimonials: [],
    
//   });
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
//         if (!page?._id) throw new Error("No About Us page ID found");
//         setAboutUsId(page._id);
//       } catch (err) {
//         toast.error(err.response?.data?.message || err.message || "Failed to load About Us page");
//       }
//     };
//     ensureAboutUsPage();
//   }, []);

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value } = e.target;
//     if (index !== null && field !== null) {
//       const updatedTestimonials = [...formData.testimonials];
//       updatedTestimonials[index][field] = value;
//       setFormData({ ...formData, testimonials: updatedTestimonials });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addTestimonial = () => {
//     setFormData({
//       ...formData,
//       testimonials: [...formData.testimonials, { name: "", description: "" }],
//     });
//   };

//   const removeTestimonial = (idx) => {
//     setFormData({
//       ...formData,
//       testimonials: formData.testimonials.filter((_, i) => i !== idx),
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
//   //     
//   //     if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
//   //       toast.error("Main heading and description are required");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     for (let i = 0; i < formData.testimonials.length; i++) {
//   //       const t = formData.testimonials[i];
//   //       if (!t.name.trim() || !t.description.trim()) {
//   //         toast.error(`Testimonial ${i + 1} requires name and description`);
//   //         setLoading(false);
//   //         return;
//   //       }
//   //     }

//   //     const payload = {
//   //       aboutUsId,
//   //       mainHeading: formData.mainHeading.trim(),
//   //       mainDescription: formData.mainDescription.trim(),
//   //       status: formData.status,
//   //       testimonials: formData.testimonials.map(t => ({
//   //         name: t.name.trim(),
//   //         description: t.description.trim(),
//   //       })),
//   //     };

//   //     console.log("Submitting FormData:", Array.from(submissionData.entries()));

//   //     const res = await postAPI("/api/about-us-sections/testimonials/create", payload);

//   //     if (res.data.success) {
//   //       toast.success(res.data.message || "Testimonials created successfully!");
//   //       navigate("/super-admin/about-us/create", { state: { reload: true } });
//   //     } else {
//   //       toast.error(res.data.message || "Failed to create testimonials");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.message || err.message || "Something went wrong");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!aboutUsId) {
//     toast.error("About Us page not ready yet. Please wait.");
//     return;
//   }

//   setLoading(true);

//   try {
//     if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
//       toast.error("Main heading and description are required");
//       setLoading(false);
//       return;
//     }

//     for (let i = 0; i < formData.testimonials.length; i++) {
//       const t = formData.testimonials[i];
//       if (!t.name.trim() || !t.description.trim()) {
//         toast.error(`Testimonial ${i + 1} requires name and description`);
//         setLoading(false);
//         return;
//       }
//     }

//     const payload = {
//       aboutUsId,
//       mainHeading: formData.mainHeading.trim(),
//       mainDescription: formData.mainDescription.trim(),
//      // status: formData.status,
//       testimonials: formData.testimonials.map(t => ({
//         name: t.name.trim(),
//         description: t.description.trim(),
//       })),
//     };

//     const res = await postAPI("/api/about-us-sections/testimonials/create", payload);

//     if (res.data.success) {
//       toast.success(res.data.message || "Testimonials created successfully!");
//       navigate("/super-admin/about-us/create", { state: { reload: true } });
//     } else {
//       toast.error(res.data.message || "Failed to create testimonials");
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || err.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Testimonials Section</h2>
//         {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
            
//                 <div className="form-group">
//                   <label>Main Heading *</label>
//                   <input
//                     type="text"
//                     name="mainHeading"
//                     value={formData.mainHeading}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Main Description *</label>
//                   <textarea
//                     name="mainDescription"
//                     value={formData.mainDescription}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows={4}
//                     required
//                   />
//                 </div>
//                 <h4>Testimonials Cards</h4>
//                 {formData.testimonials.map((t, idx) => (
//                   <div key={idx} className="border mb-3 p-3 rounded shadow">
//                     <div className="form-group">
//                       <label>Name *</label>
//                       <input
//                         type="text"
//                         value={t.name}
//                         onChange={(e) => handleChange(e, idx, "name")}
//                         className="form-control"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Description *</label>
//                       <textarea
//                         value={t.description}
//                         onChange={(e) => handleChange(e, idx, "description")}
//                         className="form-control"
//                         rows={3}
//                         required
//                       />
//                     </div>
//                     <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeTestimonial(idx)}>
//                       Remove Testimonial
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="btn btn-secondary mb-3" onClick={addTestimonial}>
//                   Add Testimonial
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
//                     {loading ? "Creating..." : "Create Testimonials Section"}
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

// export default TestimonialsCreate;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const TestimonialsCreate = () => {
  const navigate = useNavigate();
  const [aboutUsId, setAboutUsId] = useState(null);
  const [testimonialId, setTestimonialId] = useState(null);
  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    testimonials: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAboutUsAndTestimonials = async () => {
      try {
        const res = await getAPI("/api/about-us");
        const page = res.data.data?.[0];
        if (!page) {
          toast.error("No About Us draft found. Create the page first.");
          navigate("/super-admin/about-us/create");
          return;
        }
        setAboutUsId(page._id);

        const testRes = await getAPI(`/api/about-us-sections/testimonials/${page._id}`);
        if (testRes.data.success && testRes.data.data) {
          const t = testRes.data.data;
          setFormData({
            mainHeading: t.mainHeading || "",
            mainDescription: t.mainDescription || "",
            testimonials: t.testimonials?.length ? t.testimonials : [],
          });
          setTestimonialId(t._id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Failed to load About Us page");
      }
    };
    fetchAboutUsAndTestimonials();
  }, [navigate]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (index !== null && field !== null) {
      const updatedTestimonials = [...formData.testimonials];
      updatedTestimonials[index][field] = value;
      setFormData({ ...formData, testimonials: updatedTestimonials });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { name: "", description: "" }],
    });
  };

  const removeTestimonial = (idx) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== idx),
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
      if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
        toast.error("Main heading and description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.testimonials.length; i++) {
        const t = formData.testimonials[i];
        if (!t.name.trim() || !t.description.trim()) {
          toast.error(`Testimonial ${i + 1} requires name and description`);
          setLoading(false);
          return;
        }
      }

      const payload = {
        aboutUsId,
        mainHeading: formData.mainHeading.trim(),
        mainDescription: formData.mainDescription.trim(),
        testimonials: formData.testimonials.map((t) => ({
          name: t.name.trim(),
          description: t.description.trim(),
        })),
      };

      let res;
      if (testimonialId) {
        res = await postAPI(`/api/about-us-sections/testimonials/update/${testimonialId}`, payload);
      } else {
        res = await postAPI("/api/about-us-sections/testimonials/create", payload);
      }

      if (res.data.success) {
        toast.success(res.data.message || "Testimonials saved successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save testimonials");
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
        <h2>Edit Testimonials Section</h2>
        {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Main Heading *</label>
                  <input
                    type="text"
                    name="mainHeading"
                    value={formData.mainHeading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Main Description *</label>
                  <textarea
                    name="mainDescription"
                    value={formData.mainDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>

                <h4>Testimonials Cards</h4>
                {formData.testimonials.map((t, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleChange(e, idx, "name")}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={t.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={3}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeTestimonial(idx)}
                    >
                      Remove Testimonial
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addTestimonial}>
                  Add Testimonial
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
                    {loading ? "Saving..." : testimonialId ? "Update Testimonials" : "Create Testimonials Section"}
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

export default TestimonialsCreate;
