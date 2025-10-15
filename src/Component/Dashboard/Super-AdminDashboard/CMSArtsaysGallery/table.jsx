// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import getAPI from "../../../../api/getAPI";
// import deleteAPI from "../../../../api/deleteAPI";
// import ConfirmationDialog from "../../ConfirmationDialog";
// import { toast } from "react-toastify";

// function ArtsaysGalleryTable() {
//   const navigate = useNavigate();

//   const [galleries, setGalleries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedGallery, setSelectedGallery] = useState(null);

//   const fetchGalleries = async () => {
//     try {
//       const response = await getAPI("/api/CMS-CMS-artsays-gallery");
//       if (response?.hasError === false) {
//         setGalleries(response.data.data);
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error fetching galleries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGalleries();
//   }, []);

//   const openDeleteDialog = (gallery) => {
//     setSelectedGallery(gallery);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleDeleteCancel = () => {
//     setSelectedGallery(null);
//     setIsDeleteDialogOpen(false);
//   };

//   const handleDeleteConfirmed = async (id) => {
//     try {
//       const response = await deleteAPI(`/api/CMS-CMS-artsays-gallery/delete/${id}`);
//       if (response?.hasError === false) {
//         toast.success(response?.message || "Deleted successfully");
//         fetchGalleries();
//       } else {
//         toast.error(response?.message || "Delete failed");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error deleting gallery");
//     }
//     setIsDeleteDialogOpen(false);
//     setSelectedGallery(null);
//   };

//   if (loading) {
//     return <div className="text-center mt-5">Loading Galleries...</div>;
//   }

//   return (
//     <div className="container-fluid">
//       <div className="block-header d-flex justify-content-between align-items-center mb-3">
//         <h2>Artsays Gallery</h2>
//         <button
//           className="btn btn-secondary"
//           onClick={() => navigate("/super-admin/CMS-CMS-artsays-gallery/create")}
//         >
//           <i className="fa fa-plus"></i> Add Gallery
//         </button>
//       </div>

//       <div className="card">
//         <div className="body">
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="thead-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>Title</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {galleries.length > 0 ? (
//                   galleries.map((gallery, index) => (
//                     <tr key={gallery._id}>
//                       <td>{index + 1}</td>
//                       <td>{gallery.title}</td>
//                       <td>
//                         <button
//                           className="btn btn-outline-info btn-sm mx-1"
//                           onClick={() =>
//                             navigate(
//                               `/super-admin/CMS-CMS-artsays-gallery/edit/${gallery._id}`
//                             )
//                           }
//                         >
//                           <i className="fa fa-pencil"></i>
//                         </button>
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => openDeleteDialog(gallery)}
//                         >
//                           <i className="fa fa-trash-o"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-center">
//                       No Galleries found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType="artsaysGallery"
//           id={selectedGallery?._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}
//     </div>
//   );
// }

// export default ArtsaysGalleryTable;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import deleteAPI from "../../../../api/deleteAPI";
import { toast } from "react-toastify";

function ArtsaysGalleryTable() {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGalleries = async () => {
    try {
      const response = await getAPI("/api/CMS-artsays-gallery");
      if (response?.hasError === false) {
        setGalleries(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching galleries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;
    try {
      const response = await deleteAPI(`/api/CMS-artsays-gallery/delete/${id}`);
      if (response?.hasError === false) {
        toast.success("Gallery deleted successfully");
        fetchGalleries();
      } else {
        toast.error(response?.message || "Failed to delete gallery");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting gallery");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Galleries...</div>;

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center mb-3">
        <h2>Artsays Gallery</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/super-admin/CMS-artsays-gallery/create")}
        >
          <i className="fa fa-plus"></i> Add Gallery
        </button>
      </div>

      <div className="card">
        <div className="body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleries.length ? (
                  galleries.map((gallery, index) => (
                    <tr key={gallery._id}>
                      <td>{index + 1}</td>
                      <td>{gallery.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            gallery.status === "published"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {gallery.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm mx-1"
                          onClick={() =>
                            navigate(`/super-admin/CMS-artsays-gallery/edit/${gallery._id}`)
                          }
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(gallery._id)}
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Galleries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtsaysGalleryTable;
