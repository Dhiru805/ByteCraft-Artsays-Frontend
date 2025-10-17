// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import getAPI from "../../../../api/getAPI";
// import postAPI from "../../../../api/postAPI";

// function EditCuration() {
//   const navigate = useNavigate();
//   const { id } = useParams(); 

//   const [userType, setUserType] = useState(""); // Seller or Artist
//   const [userOptions, setUserOptions] = useState([]); // Dropdown list of fetched users
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [curator, setCurator] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async (type) => {
//     try {
//       const response = await getAPI(`/api/users-by-type?userType=${type}`);
//       if (response?.hasError === false) {
//         const options = response.data.data.map((user) => ({
//           value: user._id,
//           label: `${user.name} ${user.lastName || ""}`,
//           name: `${user.name} ${user.lastName || ""}`,
//         }));
//         setUserOptions(options);
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchCurationData = async () => {
//     try {
//       const response = await getAPI(`/api/artsays-gallery/${id}`);
//       if (response?.hasError === false) {
//         const data = response.data.data;
//         setUserType(data.type);
//         setCurator(data.curator || "");

//         await fetchUsers(data.type);

//         setSelectedUser({
//           value: data.userId,
//           label: data.userName,
//           name: data.userName,
//         });

//         setLoading(false);
//       } else {
//         console.log(response);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCurationData();
//   }, []);

//   useEffect(() => {
//     if (userType) {
//       fetchUsers(userType);
//     }
//   }, [userType]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userType || !selectedUser || !curator) {
//       toast.error("Please fill all fields before submitting");
//       return;
//     }

//     try {
//       const payload = {
//         type: userType,
//         userId: selectedUser.value,
//         userName: selectedUser.name,
//         curator,
//       };

//       const response = await postAPI(`/api/artsays-gallery/update/${id}`, payload);

//       if (response?.hasError === false) {
//         toast.success(response?.message || "Curation Updated Successfully!");
//         navigate("/super-admin/artsays-gallery");
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error updating curation");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container-fluid">
//         <div className="text-center mt-5">
//           <h5>Loading Curation Details...</h5>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       {/* Header */}
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Edit Artsays Gallery</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <a href="/">
//                   <i className="fa fa-dashboard"></i>
//                 </a>
//               </li>
//               <li className="breadcrumb-item active">
//                 <Link
//                   to="/super-admin/artsays-gallery"
//                   className="text-decoration-none"
//                 >
//                   Artsays Gallery
//                 </Link>
//               </li>
//               <li className="breadcrumb-item">Edit Gallery</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               <form onSubmit={handleSubmit}>
//                 {/* Select User Type */}
//                 <div className="row">
//                   <div className="col-md-6 form-group">
//                     <label>Select Type</label>
//                     <Select
//                       options={[
//                         { value: "Artist", label: "Artist" },
//                         { value: "Seller", label: "Seller" },
//                       ]}
//                       value={
//                         userType
//                           ? { value: userType, label: userType }
//                           : null
//                       }
//                       onChange={(option) =>
//                         setUserType(option ? option.value : "")
//                       }
//                       placeholder="Select Seller or Artist"
//                       isClearable
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Conditional dropdown (Artist/Seller Names) */}
//                 {userType && (
//                   <div className="row mt-3">
//                     <div className="col-md-6 form-group">
//                       <label>
//                         {userType === "Artist"
//                           ? "Select Artist"
//                           : "Select Seller"}
//                       </label>
//                       <Select
//                         options={userOptions}
//                         value={selectedUser}
//                         onChange={setSelectedUser}
//                         placeholder={`Choose ${userType}`}
//                         isClearable
//                         isSearchable
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Curator Field */}
//                 {userType && (
//                   <div className="row mt-3">
//                     <div className="col-md-6 form-group">
//                       <label>Curator</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Curator Name"
//                         value={curator}
//                         onChange={(e) => setCurator(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 {userType && (
//                   <div className="mt-4">
//                     <button type="submit" className="btn btn-success">
//                       Update Artsays Gallery
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditCuration;




import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";

function UpdateGallery() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userType, setUserType] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [curator, setCurator] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (type) => {
    try {
      const response = await getAPI(`/api/users-by-type?userType=${type}`);
      if (response?.hasError === false) {
        const options = response.data.data.map((user) => ({
          value: user._id,
          label: `${user.name} ${user.lastName || ""}`,
          name: `${user.name} ${user.lastName || ""}`,
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGalleryData = async () => {
    try {
      const response = await getAPI(`/api/artsays-gallery/${id}`);
      if (response?.hasError === false) {
        const data = response.data.data;

        setUserType(data.type);
        setCurator(data.curator || "");

        await fetchUsers(data.type);

        setSelectedUser({
          value: data.userId,
          label: data.userName,
          name: data.userName,
        });
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
    fetchGalleryData();
  }, [id]);

  useEffect(() => {
    if (!loading && userType) {
      fetchUsers(userType);
    }
  }, [userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType || !selectedUser || !curator) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const payload = {
        type: userType,
        userId: selectedUser.value,
        userName: selectedUser.name,
        curator,
      };

      const response = await putAPI(`/api/artsays-gallery/update/${id}`, payload);
      if (response?.hasError === false) {
        toast.success(response?.message || "Gallery updated successfully!");
        navigate("/super-admin/art-gallery");
      } else {
        toast.error(response?.message || "Failed to update gallery");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating gallery");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <h5>Loading gallery details...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Edit Art Gallery</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/super-admin/art-gallery" className="text-decoration-none">
                  Art Gallery
                </Link>
              </li>
              <li className="breadcrumb-item">Edit Art Gallery</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
               
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Select Type</label>
                    <Select
                      options={[
                        { value: "Artist", label: "Artist" },
                        { value: "Seller", label: "Seller" },
                      ]}
                      value={userType ? { value: userType, label: userType } : null}
                      onChange={(option) => setUserType(option ? option.value : "")}
                      placeholder="Select Seller or Artist"
                      isClearable
                      required
                    />
                  </div>
                </div>

                {userType && (
                  <div className="row mt-3">
                    <div className="col-md-6 form-group">
                      <label>{userType === "Artist" ? "Select Artist" : "Select Seller"}</label>
                      <Select
                        options={userOptions}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        placeholder={`Choose ${userType}`}
                        isClearable
                        isSearchable
                        required
                      />
                    </div>
                  </div>
                )}

                {userType && (
                  <div className="row mt-3">
                    <div className="col-md-6 form-group">
                      <label>Curator</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Curator Name"
                        value={curator}
                        onChange={(e) => setCurator(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {userType && (
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success">
                      Update Art Gallery
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGallery;
