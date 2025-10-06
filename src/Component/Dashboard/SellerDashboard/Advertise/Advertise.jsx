import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
import putAPI from '../../../../api/putAPI';
import ConfirmationDialog from '../../ConfirmationDialog';
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";
import { toast } from 'react-toastify';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE


  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const result = await getAPI(`/api/campaigns/${userId}`, {}, true, false);
        setProducts(result.data.data);
        console.log(result.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  const handleImageClick = (product) => {
    const images = [product.mainImage, ...(product.otherImages || [])];
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };


  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (product) => {
    setSelectedProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseCampaign = async (id) => {
    try {
      await putAPI(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === id ? { ...product, status: 'closed' } : product
        )
      );

      toast.error("Campaign is closed successfully");
    } catch (error) {
      console.error("Error closing campaign:", error);
      toast.error("Failed to close the campaign");
    }
  };
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Advertise</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/seller/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Advertise</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate(`/seller/advertise/sponser`)}
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

            {/* Table */}
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Product Name</th>
                      <th>Market Price</th>
                      <th>Selling Price</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product =>
                        product.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.selectedProductIds?.[0]?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((product, index) => {
                        const capitalizeFirstLetter = (string) => {
                          if (!string) return '';
                          return string.charAt(0).toUpperCase() + string.slice(1);
                        };
                        const statusClass = (() => {
                          switch (product.status.toLowerCase()) {
                            case 'published':
                              return 'btn-outline-success';
                            case 'closed':
                              return 'btn-outline-danger';
                            case 'draft':
                              return 'btn-outline-primary';
                            default:
                              return 'btn-outline-secondary';
                          }
                        })();

                        return (
                          <tr key={product._id}>
                            <td>{index + 1}</td>
                            <td>{product.campaignName}</td>
                            <td>

                              <img
                                src={product.mainImage ? `${BASE_URL}${product.mainImage}` : DEFAULT_PROFILE_IMAGE}
                                className="rounded-circle avatar"
                                alt=""
                                onClick={() => handleImageClick(product)}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  objectFit: 'cover',
                                  marginRight: '10px',
                                  cursor: 'pointer'
                                }}
                              />{product.productName}

                              {product.selectedProductIds?.[0]?.productName || 'N/A'}</td>
                            <td>{product.selectedProductIds?.[0]?.price || 'N/A'}</td>
                            <td>{product.sellingPrice || 'N/A'}</td>
                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${statusClass}`}
                                style={{ textAlign: 'center' }}
                              >
                                {capitalizeFirstLetter(product.status)}
                              </button>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  title="Bidding Pass"
                                >
                                  <i className="fa fa-eye"></i>
                                </button>
                                {product.status?.toLowerCase() !== "closed" && (
                                  <>
                                    {product.status?.toLowerCase() === "draft" && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-info btn-sm"
                                        title="Edit"
                                        onClick={() =>
                                          navigate("/seller/advertise/sponser", {
                                            state: { campaign: product }
                                          })
                                        }
                                      >
                                        <i className="fa fa-pencil"></i>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete"
                                      onClick={() => openDeleteDialog(product)}
                                    >
                                      <i className="fa fa-trash-o"></i>
                                    </button>

                                    {product.status?.toLowerCase() !== "draft" && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm"
                                        title="Close"
                                        onClick={() => handleCloseCampaign(product._id)}
                                      >
                                        <i className="fas fa-times-circle"></i>
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
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
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              height: '50%',
              backgroundColor: '#111',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Left Arrow */}
            <button
              onClick={goToPreviousImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2rem',
                color: currentImageIndex === 0 ? '#666' : '#fff',
                background: 'Black',
                border: 'none',
                cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                zIndex: 2,
              }}
              disabled={currentImageIndex === 0}
            >
              &#10094;
            </button>

            {/* Image */}
            <img
              src={`${BASE_URL}${currentImages[currentImageIndex]}`}
              alt="Popup"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />

            {/* Right Arrow */}
            <button
              onClick={goToNextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2rem',
                color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
                background: 'Black',
                border: 'none',
                cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
                zIndex: 2,
              }}
              disabled={currentImageIndex === currentImages.length - 1}
            >
              &#10095;
            </button>

          </div>

        </div>
      )}
      {isDeleteDialogOpen && selectedProductToDelete && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="campaign"
          id={selectedProductToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

    </div>

  );

};

export default Product;
