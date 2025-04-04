import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from '../ConfirmationDialog';
import VerifyModal from "./VerifyModal"
import CreateArtistModal from "./Createmodal"
import useUserType from '../urlconfig'


function ArtistManageTable() {
  const [artists, setArtists] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtistToDelete, setSelectedArtistToDelete] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateArtistModalOpen, setIsCreateArtistModalOpen] = useState(false);
  const BASE_URL = 'http://localhost:3001';
  const navigate = useNavigate();
  const userType = useUserType();

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3001/artist/artists");
      const artistsData = response.data;

      const parsedArtists = artistsData.map((artist) => {
        const parsedAddress = artist.address
          ? typeof artist.address === "string"
            ? JSON.parse(artist.address)
            : artist.address
          : {};

        return {
          ...artist,
          address: parsedAddress,
        };
      });
      setArtists(parsedArtists);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedArtistToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setArtists((prevArtists) =>
      prevArtists.filter((artist) => artist._id !== id)
    );

    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (artist) => {
    setSelectedArtistToDelete(artist);
    setIsDeleteDialogOpen(true);
  };

  const openModal = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Artist Management</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Artist Management</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <div className="page_action">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setIsCreateArtistModalOpen(true)}
                  >
                    <i className="fa fa-plus"></i>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <h2>Artist List</h2>
                <div className="d-flex">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artists.map((artist, index) => (
                        <tr key={artist._id}>
                          <td>
                            <h6 className="mb-0">{index + 1}</h6>
                          </td>
                          <td>
                            <img
                              src={
                                artist.profilePhoto
                                  ? `${BASE_URL}${artist.profilePhoto}`
                                  : 'DashboardAssets/assets/images/user.png'
                              }
                              className="rounded-circle avatar"
                              alt=""
                              style={{
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                              }}
                            />

                            <p className="c_name">
                              {artist.name} {artist.lastName}
                            </p>
                          </td>
                          <td>
                            <span className="phone">{artist.email}</span>
                          </td>
                          <td>
                            <span className="phone">{artist.phone}</span>
                          </td>
                          <td>
                            <address>
                              <i className="zmdi zmdi-pin"></i>
                              {artist.address.city && `${artist.address.city}, `}
                              {artist.address.country && artist.address.country}
                            </address>
                          </td>
                          <td> <button className={`btn btn-sm ${artist.status === 'Verified' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                            {artist.status}
                          </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="Navigate"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/artistmanagetable/artistprofileview/${artist._id}`)
                              }

                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${artist._id}`)
                              }
                            >
                              <i class="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(artist)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => openModal(artist)}
                            >
                              <i className="fa fa-check-circle" style={{ color: "green" }}></i>
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
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="artist"
          id={selectedArtistToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {isModalOpen && selectedArtist && (
        <VerifyModal
          artist={selectedArtist}
          onClose={() => setIsModalOpen(false)}
          refreshArtists={fetchArtists}
        />
      )}
      {isCreateArtistModalOpen && (
        <CreateArtistModal onClose={() => setIsCreateArtistModalOpen(false)}
          fetchArtists={fetchArtists} />
      )}

    </>
  );
}

export default ArtistManageTable;
