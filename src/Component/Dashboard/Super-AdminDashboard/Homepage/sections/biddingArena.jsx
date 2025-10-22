// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const BiddingArenaCreate = () => {
//   const navigate = useNavigate();

//   const [homepageId, setHomepageId] = useState(null);
//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     buttonName: "",
//     buttonLink: "",
//   });
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

//         const secRes = await getAPI(`/api/homepage-sections/bidding-arena/${page._id}`);
//         if (secRes.data?.success && secRes.data?.data) {
//           const s = secRes.data.data;
//           setSectionId(s._id);
//           setFormData({
//             heading: s.heading || "",
//             description: s.description || "",
//             buttonName: s.buttonName || "",
//             buttonLink: s.buttonLink || "",
//           });
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load Homepage");
//       }
//     };
//     loadHomepageAndSection();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
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

//       const submissionData = {
//         homepageId,
//         heading: formData.heading.trim(),
//         description: formData.description.trim(),
//         buttonName: formData.buttonName.trim(),
//         buttonLink: formData.buttonLink.trim(),
//       };

//       // const endpoint = sectionId
//       //   ? `/api/homepage-sections/bidding-arena/update/${sectionId}`
//       //   : "/api/homepage-sections/bidding-arena/create";
//       // const res = await postAPI(endpoint, submissionData);
//       const res = await postAPI("/api/homepage-sections/bidding-arena/create", submissionData);

//       if (res.data.success) {
//         toast.success(res.data.message || "Bidding Arena section created!");
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
//         <h2>{sectionId ? "Edit Bidding Arena Section" : "Create Bidding Arena Section"}</h2>

//         {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit}>
           
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

          
//                 <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
//                     {loading ? "Saving..." : sectionId ? "Update Bidding Arena Section" : "Create Bidding Arena Section"}
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

// export default BiddingArenaCreate;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const BiddingArenaCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    buttonName: "",
    buttonLink: "",
  });
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

        const secRes = await getAPI(`/api/homepage-sections/bidding-arena/${page._id}`);
        if (secRes.data?.success && secRes.data?.data) {
          const s = secRes.data.data;
          setSectionId(s._id);
          setFormData({
            heading: s.heading || "",
            description: s.description || "",
            buttonName: s.buttonName || "",
            buttonLink: s.buttonLink || "",
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    loadHomepageAndSection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      const submissionData = {
        homepageId,
        heading: formData.heading.trim(),
        description: formData.description.trim(),
        buttonName: formData.buttonName.trim(),
        buttonLink: formData.buttonLink.trim(),
      };

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/bidding-arena/update/${sectionId}`
      //   : "/api/homepage-sections/bidding-arena/create";
      // const res = await postAPI(endpoint, submissionData);
      const res = await postAPI("/api/homepage-sections/bidding-arena/create", submissionData);
      if (res.data.success) {
        toast.success(res.data.message || "Bidding Arena section created!");
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
        <h2>{sectionId ? "Edit Bidding Arena Section" : "Create Bidding Arena Section"}</h2>

        {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
           
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

          
                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Saving..." : sectionId ? "Update Bidding Arena Section" : "Create Bidding Arena Section"}
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

export default BiddingArenaCreate;