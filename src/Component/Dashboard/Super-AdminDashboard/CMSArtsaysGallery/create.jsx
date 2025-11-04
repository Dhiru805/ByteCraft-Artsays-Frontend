// import { useState } from "react";
// import { Link , useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// function ArtsaysGalleryCreate() {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("draft");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !description) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     console.log("CREATE - Sending payload:", { title, description, status });
//     console.log("CREATE - Status type:", typeof status, "Value:", status);

//     try {
//       const payload = { title, description, status };
//       const response = await postAPI("/api/CMS-artsays-gallery/create", payload);
//       console.log("CREATE - API Response:", response);
//       if (response?.hasError === false) {
//         toast.success(response?.message || "Gallery created successfully!");
//         navigate("/super-admin/CMS-art-gallery");
//       } else {
//         toast.error(response?.message || "Failed to create gallery");
//       }
//     } catch (error) {
//       console.log("CREATE - Error:", error);
//       toast.error("Error creating gallery");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Art Gallery CMS</h2>
       
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
//               Create Gallery
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ArtsaysGalleryCreate;



// import { useState } from "react";
// import { Link , useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// function ArtsaysGalleryCreate() {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("draft");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !description) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       const payload = { title, description, status };
//       const response = await postAPI("/api/CMS-artsays-gallery/create", payload);
//       if (response?.hasError === false) {
//         toast.success(response?.message || "Gallery created successfully!");
//         navigate("/super-admin/CMS-art-gallery");
//       } else {
//         toast.error(response?.message || "Failed to create gallery");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error creating gallery");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Art Gallery CMS</h2>
       
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
//               Create Gallery
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ArtsaysGalleryCreate;



//ADDED 2 MORE FIELDS FOR CAROUSEL



  import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";

function ArtsaysGalleryCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [status, setStatus] = useState("draft");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !sectionTitle || !sectionDescription) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const payload = {
        title,
        description,
        sectionTitle,
        sectionDescription,
        status,
      };

      const response = await postAPI("/api/CMS-artsays-gallery/create", payload);

      if (response?.hasError === false) {
        toast.success(response?.message || "Gallery created successfully!");
        navigate("/super-admin/CMS-art-gallery");
      } else {
        toast.error(response?.message || "Failed to create gallery");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating gallery");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Art Gallery CMS</h2>
      </div>

      <div className="card">
        <div className="body">
          <form onSubmit={handleSubmit}>
           
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

            <div className="form-group mt-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

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

            <div className="form-group mt-3">
              <label>Section Description</label>
              <textarea
                className="form-control"
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                required
              />
            </div>

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
              Create Gallery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArtsaysGalleryCreate;
