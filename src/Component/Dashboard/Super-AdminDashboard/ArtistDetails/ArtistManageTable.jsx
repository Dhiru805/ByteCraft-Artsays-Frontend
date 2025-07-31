import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../../ConfirmationDialog';
import VerifyModal from "./VerifyModal"
import CreateArtistModal from "./Createmodal"
import useUserType from '../../urlconfig'
import getAPI from "../../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";


function ArtistManageTable() {
  const [artists, setArtists] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtistToDelete, setSelectedArtistToDelete] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateArtistModalOpen, setIsCreateArtistModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);


  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const navigate = useNavigate();
  const userType = useUserType();

  const fetchArtists = async () => {
    try {
      const response = await getAPI("/artist/artists");
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

  const filteredArtists = artists.filter((artist) => {
    const fullName = `${artist.name} ${artist.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });


  const totalPages = Math.ceil(filteredArtists.length / productsPerPage);
  const displayedArtists = filteredArtists.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
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
                  <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                    <i className="fa fa-dashboard"></i>
                  </span>
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
                <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                  <label className="mb-0 mr-2">Show</label>
                  <select
                    name="DataTables_Table_0_length"
                    aria-controls="DataTables_Table_0"
                    className="form-control form-control-sm"
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange}
                    style={{ minWidth: '70px' }}
                  >
                    {/* <option value="5">5</option> */}
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label className="mb-0 ml-2">entries</label>
                </div>
                <div className="w-100 w-md-auto d-flex justify-content-end">
                  <div className="input-group" style={{ maxWidth: '150px' }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i
                      className="fa fa-search"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    ></i>
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
                      {displayedArtists.map((artist, index) => (
                        <tr key={artist._id}>
                          <td>
                            <h6 className="mb-0">{(currentPage - 1) * productsPerPage + index + 1}</h6>
                          </td>
                          <td>
                            <img
                              src={
                                artist.profilePhoto && artist.profilePhoto !== "null"
                                  ? `${BASE_URL}${artist.profilePhoto}`
                                  : DEFAULT_PROFILE_IMAGE
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
                              onClick={() => {
                                localStorage.setItem("selectedArtist", JSON.stringify(artist));
                                localStorage.setItem("selectedArtistId", artist._id);
                                navigate("/super-admin/artist/management/artistprofileview", { state: { artist } });
                              }}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => {
                                localStorage.setItem("selectedArtist", JSON.stringify(artist));
                                localStorage.setItem("selectedArtistId", artist._id);
                                navigate("/super-admin/artist/management/artisteditreuqest/", { state: { artist } });
                              }}
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
                              <i className="fa fa-info-circle" style={{ color: "green" }}></i>
                            </button>


                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination d-flex justify-content-between mt-4">
                  <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                    Showing {(filteredArtists.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1)} to {Math.min(currentPage * productsPerPage, filteredArtists.length)} of {filteredArtists.length} entries
                  </span>

                  <ul className="pagination d-flex justify-content-end w-100">
                    <li
                      className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={handlePrevious}
                    >
                      <button className="page-link">Previous</button>
                    </li>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((pageNumber) => pageNumber === currentPage)
                      .map((pageNumber, index, array) => {
                        const prevPage = array[index - 1];
                        if (prevPage && pageNumber - prevPage > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${pageNumber}`}>
                              <li className="page-item disabled"><span className="page-link">...</span></li>
                              <li
                                key={pageNumber}
                                className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                <button className="page-link">{pageNumber}</button>
                              </li>
                            </React.Fragment>
                          );
                        }

                        return (
                          <li
                            key={pageNumber}
                            className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            <button className="page-link">{pageNumber}</button>
                          </li>
                        );
                      })}

                    <li
                      className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={handleNext}
                    >
                      <button className="page-link">Next</button>
                    </li>
                  </ul>
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
