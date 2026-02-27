// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const ArtIconCreate = () => {
//   const navigate = useNavigate();

//   const [homepageId, setHomepageId] = useState(null);
//   const [formData, setFormData] = useState({
//     heading: "",
//     description: "",
//     buttonName: "",
//     buttonLink: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [sectionId, setSectionId] = useState(null);

//   // useEffect(() => {
//   //   const loadHomepageAndSection = async () => {

//   useEffect(() => {
//     const ensureHomepage = async () => {
//       try {
//         const res = await getAPI("/api/homepage");
//         let page = res.data.data?.[0];
//         if (!page) {
//           toast.error("No Homepage draft found. Create the page first.");
//           navigate("/super-admin/homepage/create");
//           return;
//         }
//         setHomepageId(page._id);

//         const secRes = await getAPI(`/api/homepage-sections/art-icon/${page._id}`);
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
//     // loadHomepageAndSection();
//     ensureHomepage();
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
//       if (
//         !formData.heading.trim() ||
//         !formData.description.trim() ||
//         !formData.buttonName.trim() ||
//         !formData.buttonLink.trim()
//       ) {
//         toast.error("All fields are required");
//         setLoading(false);
//         return;
//       }

//       const submissionData = new FormData();
//       submissionData.append("homepageId", homepageId);
//       submissionData.append("heading", formData.heading.trim());
//       submissionData.append("description", formData.description.trim());
//       submissionData.append("buttonName", formData.buttonName.trim());
//       submissionData.append("buttonLink", formData.buttonLink.trim());

//       // const endpoint = sectionId
//       //   ? `/api/homepage-sections/art-icon/update/${sectionId}`
//       //   : "/api/homepage-sections/art-icon/create";
//       // const res = await postAPI(
//       //   endpoint,
//       const res = await postAPI(
//         "/api/homepage-sections/art-icon/create",
//         submissionData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (res.data.success) {
//         toast.success(res.data.message || "Art Icon section created successfully!");
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
//         <h2>{sectionId ? "Edit Art Icon Section" : "Create Art Icon Section"}</h2>

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


//                  <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                    <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
//                     {loading ? "Saving..." : sectionId ? "Update Art Icon Section" : "Create Art Icon Section"}
//                 {/* <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading || !homepageId} >*/}

//                     {loading ? "Creating..." : "Create Art Icon Section"}
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

// export default ArtIconCreate;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const ArtIconCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    buttonName: "",
    buttonLink: ""
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

        const secRes = await getAPI(`/api/homepage-sections/art-icon/${page._id}`);
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
      if (
        !formData.heading.trim() ||
        !formData.description.trim() ||
        !formData.buttonName.trim() ||
        !formData.buttonLink.trim()
      ) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("homepageId", homepageId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("buttonName", formData.buttonName.trim());
      submissionData.append("buttonLink", formData.buttonLink.trim());

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/art-icon/update/${sectionId}`
      //   : "/api/homepage-sections/art-icon/create";
      // const res = await postAPI(
      //   endpoint,
      //   submissionData,
      //   { headers: { "Content-Type": "multipart/form-data" } }
      // );

      const res = await postAPI(
        "/api/homepage-sections/art-icon/create",
        submissionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Art Icon section created successfully!");
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
        <h2>{sectionId ? "Edit Art Icon Section" : "Create Art Icon Section"}</h2>

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


                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Saving..." : sectionId ? "Update Art Icon Section" : "Create Art Icon Section"}
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

export default ArtIconCreate;