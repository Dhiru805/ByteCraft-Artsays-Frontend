// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import postAPI from "../../../../../api/postAPI";
// import getAPI from "../../../../../api/getAPI";

// const HomeChallengesCreate = () => {
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

//         const secRes = await getAPI(`/api/homepage-sections/challenges/${page._id}`);
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
//     setLoading(true);

//     try {
//       if (!homepageId) {
//         toast.error("Homepage not ready yet. Please wait.");
//         setLoading(false);
//         return;
//       }

//       if (!heading.trim() || !description.trim()) {
//         toast.error("Both heading and description are required");
//         setLoading(false);
//         return;
//       }

//       // const endpoint = sectionId
//       //   ? `/api/homepage-sections/challenges/update/${sectionId}`
//       //   : "/api/homepage-sections/challenges/create";
//       // const res = await postAPI(
//       //   endpoint,
//       //   { homepageId, heading: heading.trim(), description: description.trim() }
//       // );

//       const res = await postAPI(
//         "/api/homepage-sections/challenges/create",
//         { homepageId, heading: heading.trim(), description: description.trim() }
//       );

//       if (res.data.data) {
//         toast.success(res.data.message || "Challenges section saved successfully!");
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
//         <h2>{sectionId ? "Edit Challenges Section" : "Create Challenges Section"}</h2>
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label>Heading *</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={heading}
//                     onChange={(e) => setHeading(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Description *</label>
//                   <textarea
//                     className="form-control"
//                     rows={3}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
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

// export default HomeChallengesCreate;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const HomeChallengesCreate = () => {
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

        const secRes = await getAPI(`/api/homepage-sections/challenges/${page._id}`);
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
    setLoading(true);

    try {
      if (!homepageId) {
        toast.error("Homepage not ready yet. Please wait.");
        setLoading(false);
        return;
      }

      if (!heading.trim() || !description.trim()) {
        toast.error("Both heading and description are required");
        setLoading(false);
        return;
      }

      // const endpoint = sectionId
      //   ? `/api/homepage-sections/challenges/update/${sectionId}`
      //   : "/api/homepage-sections/challenges/create";
      // const res = await postAPI(
      //   endpoint,
      //   { homepageId, heading: heading.trim(), description: description.trim() }
      // );
      const res = await postAPI(
        "/api/homepage-sections/challenges/create",
        { homepageId, heading: heading.trim(), description: description.trim() }
      );
      
      if (res.data.data) {
        toast.success(res.data.message || "Challenges section saved successfully!");
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
        <h2>{sectionId ? "Edit Challenges Section" : "Create Challenges Section"}</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Heading *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

export default HomeChallengesCreate;
