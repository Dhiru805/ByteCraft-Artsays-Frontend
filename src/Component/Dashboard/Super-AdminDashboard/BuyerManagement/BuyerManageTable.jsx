import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../../ConfirmationDialog';
import VerifyModal from "./VerifyModal"
import CreateBuyerModal from "./Createmodal";
import useUserType from '../../urlconfig';
import getAPI from "../../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";

function BuyerManageTable() {
  const [buyers, setBuyers] = useState([]);
  const userType = useUserType();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBuyerToDelete, setSelectedBuyerToDelete] = useState(null);
  const [isCreateBuyerModalOpen, setIsCreateBuyerModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const navigate = useNavigate();

  const fetchBuyers = async () => {
    try {
      const response = await getAPI("/api/buyers/get-Allbuyer");
      const buyersData = response.data;

      const parsedBuyers = buyersData.map((buyer) => {
        const parsedAddress = buyer.address
          ? typeof buyer.address === "string"
            ? JSON.parse(buyer.address)
            : buyer.address
          : {};

        return {
          ...buyer,
          address: parsedAddress,
        };
      });
      setBuyers(parsedBuyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBuyerToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setBuyers((prevBuyers) =>
      prevBuyers.filter((buyer) => buyer._id !== id)
    );

    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (buyer) => {
    setSelectedBuyerToDelete(buyer);
    setIsDeleteDialogOpen(true);
  };
  const openModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const fullName = `${buyer.name} ${buyer.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });


  const totalPages = Math.ceil(filteredBuyers.length / productsPerPage);

  const displayedBuyers = filteredBuyers.slice(
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
              <h2>Buyer Management</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                    <i className="fa fa-dashboard"></i>
                  </span>
                </li>
                <li className="breadcrumb-item">Buyer Management</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <div className="page_action">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setIsCreateBuyerModalOpen(true)}
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
                      {displayedBuyers.map((buyer, index) => (
                        <tr key={buyer._id}>
                          <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                          <td>
                            <img
                              src={
                                buyer.profilePhoto
                                  ? `${BASE_URL}${buyer.profilePhoto}`
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
                              {buyer.name} {buyer.lastName}
                            </p>
                          </td>
                          <td>
                            <span className="phone">{buyer.email}</span>
                          </td>
                          <td>
                            <span className="phone">{buyer.phone}</span>
                          </td>
                          <td>
                            <address>
                              <i className="zmdi zmdi-pin"></i>
                              {buyer.address.city && `${buyer.address.city}, `}
                              {buyer.address.country && buyer.address.country}
                            </address>
                          </td>
                          <td>
                            <button className={`btn btn-sm ${buyer.status === 'Verified' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                              {buyer.status}
                            </button>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="Navigate"
                              onClick={() =>
                                navigate("/super-admin/buyer/management/productview/", { state: { buyer } })
                              }

                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate("/super-admin/buyer/management/productedit/", { state: { buyer } })
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(buyer)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => openModal(buyer)}
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
                    Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredBuyers.length)} of {filteredBuyers.length} entries
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
          deleteType="buyer"
          id={selectedBuyerToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isModalOpen && selectedBuyer && (
        <VerifyModal
          buyer={selectedBuyer}
          onClose={() => setIsModalOpen(false)}
          refreshBuyers={fetchBuyers}
        />
      )}
      {isCreateBuyerModalOpen && (
        <CreateBuyerModal
          onClose={() => setIsCreateBuyerModalOpen(false)}
          fetchBuyers={fetchBuyers}
        />
      )}


    </>
  );
}

export default BuyerManageTable;
