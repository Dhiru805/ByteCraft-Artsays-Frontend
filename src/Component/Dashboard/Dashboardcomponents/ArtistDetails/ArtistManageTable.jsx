import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";




function ArtistManageTable() {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [artistForm, setArtistForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    address: {
      line1: "",
      city: "",
    },
  });

  const navigate = useNavigate(); // Initialize useNavigate for redirecting

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3001/artist/artists");
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError("Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);
  const handleEdit = (artist) => {
    console.log("Editing artist:", artist); // Log the artist data
    setEditingArtist(artist);
    setArtistForm({
      name: artist.name,
      lastName: artist.lastName,
      phone: artist.phone,
      email: artist.email,
      address: {
        line1: artist.address.line1,
        city: artist.address.city,
      },
    });
    setEditModalOpen(true);
    console.log("Modal state:", isEditModalOpen); // Check modal state
  };

  const handleDelete = async (artistId) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      try {
        await axios.delete(`http://localhost:3001/artist/artists/${artistId}`);
        setArtists(artists.filter((artist) => artist._id !== artistId));
      } catch (error) {
        console.error("Error deleting artist:", error);
        setError("Failed to delete artist");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setArtistForm({
        ...artistForm,
        address: {
          ...artistForm.address,
          [addressField]: value,
        },
      });
    } else {
      setArtistForm({
        ...artistForm,
        [name]: value,
      });
    }
  };

  const handleUpdateArtist = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating artist with:", artistForm);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/artist/update-artists/${editingArtist._id}`,
        artistForm,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the bearer token here
          },
        }
      );
      console.log("Update response:", response);
      setArtists(
        artists.map((artist) =>
          artist._id === editingArtist._id
            ? { ...artist, ...artistForm }
            : artist
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating artist:", error);
      setError("Failed to update artist");
    }
  };

  // Function to handle row click and navigate to artist detail page
  const handleRowClick = (artistId) => {
    navigate(`/artists/${artistId}`); // Navigate to the new page with the artist's ID
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}{" "}
        <button onClick={fetchArtists} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
  <>
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>Table Basic</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">
                      <i className="fa fa-dashboard"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">Table</li>
                  <li className="breadcrumb-item active">Table Basic</li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <div className="page_action">
                    <button type="button" className="btn btn-primary mx-2">
                      <i className="fa fa-download"></i> Download report
                    </button>
                    <button type="button" className="btn btn-secondary">
                      <i className="fa fa-send"></i> Send report
                    </button>
                  </div>
                  <div className="p-2 d-flex"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Basic Example 2</h2>
                </div>
                <div className="body">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 c_list">
                      <thead>
                        <tr>
                          <th>
                            <label className="fancy-checkbox">
                              <input
                                className="select-all"
                                type="checkbox"
                                name="checkbox"
                              />
                              <span></span>
                            </label>
                          </th>
                          <th>Name</th>
                          <th>Phone Or Email</th>
                          <th>Address</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artists.map((artist) => (
                          <tr
                            key={artist._id}
                            onClick={() => handleRowClick(artist._id)} // Redirect to new page on row click
                            style={{ cursor: "pointer" }} // Change cursor to pointer
                          >
                            <td style={{ width: "50px" }}>
                              <label className="fancy-checkbox">
                                <input
                                  className="checkbox-tick"
                                  type="checkbox"
                                  name="checkbox"
                                />
                                <span></span>
                              </label>
                            </td>
                            <td>
                              <img
                                src="DashboardAssets/assets/images/xs/avatar1.jpg"
                                className="rounded-circle avatar"
                                alt=""
                              />
                              <p className="c_name">
                                {artist.name}{" "}
                                {artist.lastName && (
                                  <span className="badge badge-default m-l-10 hidden-sm-down">
                                    Family
                                  </span>
                                )}
                              </p>
                            </td>
                            <td>
                              <span className="phone">
                                <i className="zmdi zmdi-phone m-r-10"></i>
                                {artist.phone || artist.email}
                              </span>
                            </td>
                            <td>
                              <address>
                                <i className="zmdi zmdi-pin"></i>
                                {artist.address.line1}, {artist.address.city}
                              </address>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-info mr-2"
                                title="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(artist);
                                }}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger js-sweetalert"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(artist._id);
                                }}
                              >
                                <i className="fa fa-trash-o"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      

      {isEditModalOpen && (
        <div className="modal model-custom-css">
          {console.log("Rendering edit modal")} {/* Debug */}
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Artist</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEditModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form
                onSubmit={handleUpdateArtist}
                className="form-artist-edit-css"
              >
                <div className="modal-body">
                  <div className="form-group custom-form-group"  >
                    <label>Name:</label>
                    <input
                      className="artist-edit-input-css"
                      type="text"
                      name="name"
                      value={artistForm.name}
                      onChange={handleFormChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="form-group custom-form-group"  >
                    <label>Last Name:</label>
                    <input
                      className="artist-edit-input-css"
                      type="text"
                      name="lastName"
                      value={artistForm.lastName}
                      onChange={handleFormChange}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="form-group custom-form-group"  >
                    <label>Phone:</label>
                    <input
                      className="artist-edit-input-css"
                      type="text"
                      name="phone"
                      value={artistForm.phone}
                      onChange={handleFormChange}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="form-group custom-form-group"  >
                    <label>Email:</label>
                    <input
                      className="artist-edit-input-css"
                      type="email"
                      name="email"
                      value={artistForm.email}
                      onChange={handleFormChange}
                      placeholder="Email"
                    />
                  </div>
                  <div className="form-group custom-form-group"  >
                    <label>Address Line 1:</label>
                    <input
                      className="artist-edit-input-css"
                      type="text"
                      name="address.line1"
                      value={artistForm.address.line1}
                      onChange={handleFormChange}
                      placeholder="Address Line 1"
                    />
                  </div>
                  <div className="form-group custom-form-group"  >
                    <label>City:</label>
                    <input
                      className="artist-edit-input-css"
                      type="text"
                      name="address.city"
                      value={artistForm.address.city}
                      onChange={handleFormChange}
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArtistManageTable;
