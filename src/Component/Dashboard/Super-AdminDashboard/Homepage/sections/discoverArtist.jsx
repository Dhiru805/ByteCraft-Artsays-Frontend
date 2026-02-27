// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const DiscoverArtistCreate = () => {
//   const navigate = useNavigate();

//   const [heading, setHeading] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [homepageId, setHomepageId] = useState(null);
//   const [sectionId, setSectionId] = useState(null);

//   useEffect(() => {
//     const loadHomepageAndSection = async () => {
//       try {
//         const res = await getAPI("/api/homepage");
//         let page = res.data.data?.[0];
//         if (!page) {
//           const createRes = await postAPI("/api/homepage/create", { title: "Homepage" });
//           page = createRes.data.data;
//         }
//         setHomepageId(page._id);

//         const secRes = await getAPI(`/api/homepage-sections/discover-artist/${page._id}`);
//         if (secRes.data?.success && secRes.data?.data) {
//           const s = secRes.data.data;
//           setSectionId(s._id);
//           setHeading(s.heading || "");
//           setDescription(s.description || "");
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load Homepage");
//       }
//     };
//     loadHomepageAndSection();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!heading.trim() || !description.trim()) {
//       toast.error("Heading and Description are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (!homepageId) {
//         toast.error("Homepage not ready yet. Please wait.");
//         setLoading(false);
//         return;
//       }

//       const payload = { homepageId, heading: heading.trim(), description: description.trim() };

//       // const endpoint = sectionId
//       //   ? `/api/homepage-sections/discover-artist/update/${sectionId}`
//       //   : "/api/homepage-sections/discover-artist/create";
//       // const res = await postAPI(endpoint, payload);

//        const res = await postAPI("/api/homepage-sections/discover-artist/create", payload);

//       if (res.data.data) {
//         toast.success(res.data.message || "Discover Artist section saved successfully!");
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
//         <h2>{sectionId ? "Edit Discover Artist Section" : "Create Discover Artist Section"}</h2>
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input
//                     type="text"
//                     value={heading}
//                     onChange={(e) => setHeading(e.target.value)}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="form-control"
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary" disabled={loading}>
//                   {loading ? "Saving..." : "Save Section"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscoverArtistCreate;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const DiscoverArtistCreate = () => {
  const navigate = useNavigate();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [homepageId, setHomepageId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const loadHomepageAndSection = async () => {
      try {
        const res = await getAPI("/api/homepage");
        let page = res.data.data?.[0];
        if (!page) {
          const createRes = await postAPI("/api/homepage/create", { title: "Homepage" });
          page = createRes.data.data;
        }
        setHomepageId(page._id);

        const secRes = await getAPI(`/api/homepage-sections/discover-artist/${page._id}`);
        if (secRes.data?.success && secRes.data?.data) {
          const s = secRes.data.data;
          setSectionId(s._id);
          setHeading(s.heading || "");
          setDescription(s.description || "");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    loadHomepageAndSection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading.trim() || !description.trim()) {
      toast.error("Heading and Description are required");
      return;
    }

    setLoading(true);
    try {
      if (!homepageId) {
        toast.error("Homepage not ready yet. Please wait.");
        setLoading(false);
        return;
      }

      const payload = { homepageId, heading: heading.trim(), description: description.trim() };

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/discover-artist/update/${sectionId}`
      //   : "/api/homepage-sections/discover-artist/create";
      // const res = await postAPI(endpoint, payload);


      const res = await postAPI("/api/homepage-sections/discover-artist/create", payload);


      if (res.data.data) {
        toast.success(res.data.message || "Discover Artist section saved successfully!");
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
        <h2>{sectionId ? "Edit Discover Artist Section" : "Create Discover Artist Section"}</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Heading *</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Section"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverArtistCreate;