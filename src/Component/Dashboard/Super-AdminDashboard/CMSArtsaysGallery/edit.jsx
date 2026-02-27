// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import getAPI from "../../../../api/getAPI";
// import putAPI from "../../../../api/putAPI";

// function ArtsaysGalleryEdit() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("draft");
//   const [loading, setLoading] = useState(true);

//   const fetchGallery = async () => {
//     try {
//       const response = await getAPI(`/api/CMS-artsays-gallery/${id}`);
//       if (response?.hasError === false) {
//         const data = response.data;
//         setTitle(data.title);
//         setDescription(data.description);
//         setStatus(data.status || "draft");
//       } else {
//         toast.error(response?.message || "Gallery not found");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error fetching gallery");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGallery();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !description) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     console.log("UPDATE - Sending payload:", { title, description, status });
//     console.log("UPDATE - Status type:", typeof status, "Value:", status);

//     try {
//       const payload = { title, description, status };
//       const response = await putAPI(`/api/CMS-artsays-gallery/update/${id}`, payload);
//       console.log("UPDATE - API Response:", response);
//       if (response?.hasError === false) {
//         toast.success(response?.message || "Gallery updated successfully!");
//         navigate("/super-admin/CMS-art-gallery");
//       } else {
//         toast.error(response?.message || "Failed to update gallery");
//       }
//     } catch (error) {
//       console.log("UPDATE - Error:", error);
//       toast.error("Error updating gallery");
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-5">Loading gallery details...</div>;
//   }

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Edit Art Gallery CMS</h2>
//       </div>

//       <div className="card">
//         <div className="body">
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Title</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="form-group mt-3">
//               <label>Description</label>
//               <textarea
//                 className="form-control"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="form-group mt-3">
//               <label>Status</label>
//               <select
//                 className="form-control"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//               </select>
//             </div>

//             <button type="submit" className="btn btn-success mt-4">
//               Update Gallery
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ArtsaysGalleryEdit;





import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";

function ArtsaysGalleryEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const response = await getAPI(`/api/CMS-artsays-gallery/${id}`);
      if (response?.hasError === false) {
        const data = response.data.data;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setSectionTitle(data.sectionTitle || "");
        setSectionDescription(data.sectionDescription || "");
        setStatus(data.status || "draft");
      } else {
        toast.error(response?.message || "Gallery not found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !sectionTitle || !sectionDescription) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      title,
      description,
      sectionTitle,
      sectionDescription,
      status,
    };

    console.log("UPDATE - Sending payload:", payload);

    try {
      const response = await putAPI(`/api/CMS-artsays-gallery/update/${id}`, payload);
      console.log("UPDATE - API Response:", response);

      if (response?.hasError === false) {
        toast.success(response?.message || "Gallery updated successfully!");
        navigate("/super-admin/CMS-art-gallery");
      } else {
        toast.error(response?.message || "Failed to update gallery");
      }
    } catch (error) {
      console.log("UPDATE - Error:", error);
      toast.error("Error updating gallery");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading gallery details...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Art Gallery CMS</h2>
      </div>

      <div className="card">
        <div className="body">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group mt-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Section Title */}
            <div className="form-group mt-3">
              <label>Section Title</label>
              <input
                type="text"
                className="form-control"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                required
              />
            </div>

            {/* Section Description */}
            <div className="form-group mt-3">
              <label>Section Description</label>
              <textarea
                className="form-control"
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group mt-3">
              <label>Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success mt-4">
              Update Gallery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArtsaysGalleryEdit;
