import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
import ConfirmationDialog from '../../ConfirmationDialog';

const Certification = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertToDelete, setSelectedCertToDelete] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const fetchCertifications = async () => {
    try {
      const response = await getAPI("/api/get-certification");
      console.log("API Response:", response);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCertifications(data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      setCertifications([]);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCertToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setCertifications((prevCerts) =>
      prevCerts.filter((cert) => cert._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (cert) => {
    setSelectedCertToDelete(cert);
    setIsDeleteDialogOpen(true);
  };

  const filteredCertifications = certifications.filter((cert) => {
    const fullName = cert.userId?.name && cert.userId?.lastName 
      ? `${cert.userId.name} ${cert.userId.lastName}`.toLowerCase()
      : '';
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (cert.productId?.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.mainCategoryId?.mainCategoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.certificationId?.certificationName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCertifications.length / productsPerPage);
  const displayedCertifications = filteredCertifications.slice(
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
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Certification</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/artist/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Certification</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate(`/super-admin/certification/create-certification`)}
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
                  className="form-control form-control-sm"
                  value={productsPerPage}
                  onChange={handleProductsPerPageChange}
                  style={{ minWidth: '70px' }}
                >
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
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>User Type</th>
                      <th>Name</th>
                      <th>Product Name</th>
                      <th>Main Category</th>
                      <th>Certification Name</th>
                      <th>Estimated Days</th>
                      <th>Certification Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCertifications.map((cert, index) => (
                      <tr key={cert._id}>
                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                        <td>{cert.userType || '-'}</td>
                        <td>
                          <img
                            src={
                              cert.userId?.profilePhoto && cert.userId?.profilePhoto !== "null"
                                ? `${BASE_URL}${cert.userId.profilePhoto}`
                                : ''
                            }
                            className="rounded-circle avatar"
                            alt="Profile"
                            style={{
                              width: '30px',
                              height: '30px',
                              objectFit: 'cover',
                              marginRight: '10px',
                            }}
                          />
                          <span className="c_name">
                            {cert.userId?.name && cert.userId?.lastName ? `${cert.userId.name} ${cert.userId.lastName}` : '-'}
                          </span>
                        </td>
                        <td>
                          <img
                            src={
                              cert.productId?.mainImage && cert.productId?.mainImage !== "null"
                                ? `${BASE_URL}${cert.productId.mainImage}`
                                : ''
                            }
                            alt="Product"
                            style={{
                              width: '30px',
                              height: '30px',
                              objectFit: 'cover',
                              marginRight: '10px',
                            }}
                          />
                          {cert.productId?.productName || '-'}
                        </td>
                        <td>{cert.mainCategoryId?.mainCategoryName || '-'}</td>
                        <td>{cert.certificationId?.certificationName || '-'}</td>
                        <td>{cert.estimatedDays || '-'}</td>
                        <td>{cert.certificationPrice ? `${cert.certificationPrice}` : '-'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
                            onClick={() => openDeleteDialog(cert)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(filteredCertifications.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1)} to {Math.min(currentPage * productsPerPage, filteredCertifications.length)} of {filteredCertifications.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
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
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="certification"
          id={selectedCertToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default Certification;