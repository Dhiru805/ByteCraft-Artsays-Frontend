import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
import putAPI from '../../../../api/putAPI';
<<<<<<< HEAD
=======
import ConfirmationDialog from '../../ConfirmationDialog';
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
import { toast } from 'react-toastify';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [viewCampaign, setViewCampaign] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [loading, setLoading] = useState(false);
=======
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE
const [loading,setLoading]=useState(false);
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      try {
        const result = await getAPI(`/api/campaigns/${userId}`, {}, true, false);
        setProducts(result.data.data);
<<<<<<< HEAD
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
=======
        console.log(result.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      finally {
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
<<<<<<< HEAD
    product.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.selectedProductIds?.[0]?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
=======
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

<<<<<<< HEAD
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

<<<<<<< HEAD
  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
=======

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
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  };

  const handleCloseCampaign = async (id) => {
    try {
<<<<<<< HEAD
      await putAPI(`/api/campaigns/${id}`, { status: 'closed' });
=======
      await putAPI(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === id ? { ...product, status: 'closed' } : product
        )
      );
<<<<<<< HEAD
      toast.success("Campaign stopped successfully");
    } catch (error) {
      console.error("Error closing campaign:", error);
      toast.error("Failed to stop the campaign");
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'btn-outline-success';
      case 'closed': return 'btn-outline-danger';
      case 'draft': return 'btn-outline-primary';
      case 'paused_low_wallet':
      case 'paused_daily_limit': return 'btn-outline-warning';
      default: return 'btn-outline-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paused_low_wallet': return 'Low Balance';
      case 'paused_daily_limit': return 'Daily Limit';
      default: return capitalizeFirstLetter(status);
    }
  };

  if (loading) return <AdvertiseSkeleton />;

=======

      toast.error("Campaign is closed successfully");
    } catch (error) {
      console.error("Error closing campaign:", error);
      toast.error("Failed to close the campaign");
    }
  };

  if(loading)return <AdvertiseSkeleton/>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Advertise</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
<<<<<<< HEAD
                <span onClick={() => navigate('/seller/dashboard')} style={{ cursor: 'pointer' }}>
=======
                <span
                  onClick={() => navigate('/seller/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Advertise</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
<<<<<<< HEAD
                <button type="button" className="btn btn-secondary mr-2" onClick={() => navigate(`/seller/advertise/sponser`)}>
=======
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate(`/seller/advertise/sponser`)}
                >
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
<<<<<<< HEAD
                <select className="form-control form-control-sm" style={{ minWidth: '70px' }} value={productsPerPage} onChange={handleProductsPerPageChange}>
=======
                <select
                  className="form-control form-control-sm"
                  style={{ minWidth: '70px' }}
                >
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: '150px' }}>
<<<<<<< HEAD
                  <input type="text" className="form-control form-control-sm" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <i className="fa fa-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></i>
=======
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
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                </div>
              </div>
            </div>

<<<<<<< HEAD
=======
            {/* Table */}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Product Name</th>
<<<<<<< HEAD
                      <th>Clicks</th>
                      <th>Daily Spent</th>
                      <th>Total Spent</th>
=======
                      <th>Market Price</th>
                      <th>Selling Price</th>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {displayedProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                        <td>{product.campaignName}</td>
                        <td>{product.selectedProductIds?.[0]?.productName || product.selectedProductsDetails?.[0]?.productName || 'N/A'}</td>
                        <td>{product.clicks || 0}</td>
                        <td>{(product.dailySpent || 0).toFixed(2)}</td>
                        <td>{(product.totalSpent || 0).toFixed(2)}</td>
                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className={`btn btn-sm ${getStatusClass(product.status)}`}>{getStatusLabel(product.status)}</button>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* View */}
                            <button className="btn btn-sm btn-outline-info" title="View" onClick={() => setViewCampaign(product)}>
                              <i className="fa fa-eye"></i>
                            </button>

                            {product.status?.toLowerCase() !== "closed" && (
                              <>
                                {/* Edit */}
                                <button type="button" className="btn btn-outline-info btn-sm" title="Edit" onClick={() => navigate("/seller/advertise/sponser", { state: { campaign: product } })}>
                                  <i className="fa fa-pencil"></i>
                                </button>

                                {/* Stop - show for all non-draft, non-closed */}
                                {product.status?.toLowerCase() !== "draft" && (
                                  <button type="button" className="btn btn-outline-dark btn-sm" title="Stop Campaign" onClick={() => handleCloseCampaign(product._id)}>
                                    <i className="fas fa-stop-circle"></i>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevious}>
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((pageNumber, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && pageNumber - prev > 1;
                      return (
                        <React.Fragment key={pageNumber}>
                          {showEllipsis && <li className="page-item disabled"><span className="page-link">...</span></li>}
                          <li className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => setCurrentPage(pageNumber)}>
                            <button className="page-link">{pageNumber}</button>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  <li className={`paginate_button page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`} onClick={handleNext}>
=======
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
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
<<<<<<< HEAD
=======

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

      {/* View Campaign Modal */}
      {viewCampaign && (
        <div onClick={() => setViewCampaign(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '700px', maxHeight: '85vh', overflow: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setViewCampaign(null)} style={{ position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#333' }}>&times;</button>

            <h4 className="mb-3">{viewCampaign.campaignName}</h4>

            <div className="row mb-3">
              <div className="col-sm-6">
                <strong>Status:</strong>{' '}
                <span className={`btn btn-sm ${getStatusClass(viewCampaign.status)}`}>{getStatusLabel(viewCampaign.status)}</span>
              </div>
              <div className="col-sm-6">
                <strong>Country:</strong> {viewCampaign.country || 'N/A'}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6"><strong>Start Date:</strong> {viewCampaign.startDate || 'N/A'}</div>
              <div className="col-sm-6"><strong>End Date:</strong> {viewCampaign.endDate || 'No End Date'}</div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6"><strong>Daily Budget:</strong> {viewCampaign.dailyBudget || 0}</div>
              <div className="col-sm-6"><strong>Daily Spent:</strong> {(viewCampaign.dailySpent || 0).toFixed(2)}</div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6"><strong>Total Spent:</strong> {(viewCampaign.totalSpent || 0).toFixed(2)}</div>
              <div className="col-sm-6"><strong>Clicks:</strong> {viewCampaign.clicks || 0}</div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6"><strong>Impressions:</strong> {viewCampaign.impressions || 0}</div>
              <div className="col-sm-6"><strong>Bidding Strategy:</strong> {capitalizeFirstLetter(viewCampaign.biddingStrategy?.replace(/-/g, ' '))}</div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6"><strong>Targeting:</strong> {capitalizeFirstLetter(viewCampaign.targetingType)}</div>
              <div className="col-sm-6"><strong>Default Bid:</strong> {viewCampaign.defaultBid || 0}</div>
            </div>

            {/* Products */}
            {(viewCampaign.selectedProductsDetails?.length > 0 || viewCampaign.selectedProductIds?.length > 0) && (
              <div className="mb-3">
                <strong>Products:</strong>
                <div className="mt-2">
                  {(viewCampaign.selectedProductsDetails || viewCampaign.selectedProductIds || []).map((p, i) => (
                      <div key={i} className="d-flex align-items-center mb-2 p-2" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                        <div>
                          <div><strong>{p.productName || 'N/A'}</strong></div>
                          {p.finalPrice != null && <small>Price: {p.finalPrice}</small>}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bid Adjustments */}
            {viewCampaign.bidAdjustments && (
              <div className="mb-3">
                <strong>Bid Adjustments:</strong>
                <div className="row mt-1">
                  {Object.entries(viewCampaign.bidAdjustments).filter(([_, v]) => v > 0).map(([key, val]) => (
                    <div className="col-sm-4 mb-1" key={key}>
                      <small>{capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))}: <strong>{val}%</strong></small>
                    </div>
                  ))}
                  {Object.values(viewCampaign.bidAdjustments).every(v => v === 0) && <div className="col-12"><small className="text-muted">No adjustments set</small></div>}
                </div>
              </div>
            )}

            {/* Keywords */}
            {viewCampaign.selectedKeywords?.length > 0 && (
              <div className="mb-3">
                <strong>Keywords:</strong>
                <div className="mt-1 d-flex flex-wrap gap-1">
                  {viewCampaign.selectedKeywords.map((kw, i) => (
                    <span key={i} className="badge badge-secondary mr-1 mb-1" style={{ padding: '5px 10px' }}>
                      {kw.keyword} ({kw.matchType}) - Bid: {kw.bid}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
=======
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

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
};

export default Product;


<<<<<<< HEAD
function AdvertiseSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-40 bg-gray-300 rounded mb-3"></div>
=======
 function AdvertiseSkeleton() {
  return (
    <div className="p-4 animate-pulse">

      {/* Header Section */}
      <div className="mb-6">
        <div className="h-7 w-40 bg-gray-300 rounded mb-3"></div>

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
<<<<<<< HEAD
      <div className="flex justify-end mb-4">
        <div className="h-9 w-9 bg-gray-300 rounded"></div>
      </div>
      <div className="bg-white p-4 shadow rounded mb-4 flex flex-col md:flex-row justify-between gap-4">
=======

      {/* Action Button Row */}
      <div className="flex justify-end mb-4">
        <div className="h-9 w-9 bg-gray-300 rounded"></div>
      </div>

      {/* Filters (Show entries + Search) */}
      <div className="bg-white p-4 shadow rounded mb-4 flex flex-col md:flex-row justify-between gap-4">

        {/* Show entries */}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        <div className="hidden md:flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
        </div>
<<<<<<< HEAD
=======

        {/* Search */}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        <div className="flex justify-end items-center">
          <div className="relative w-40">
            <div className="h-8 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 absolute right-2 top-2 rounded"></div>
          </div>
        </div>
<<<<<<< HEAD
      </div>
      <div className="bg-white p-4 shadow rounded">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                {["#","Name","Product Name","Clicks","Daily Spent","Total Spent","Date","Status","Action"].map((col, idx) => (
                  <th key={idx} className="py-3"><div className="h-4 w-24 bg-gray-300 rounded"></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-t">
                  {Array.from({ length: 9 }).map((_, colIdx) => (
                    <td key={colIdx} className="py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
=======

      </div>

      {/* Table Section */}
      <div className="bg-white p-4 shadow rounded">
        <div className="overflow-x-auto">

          {/* Table Header */}
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                {[
                  "#",
                  "Name",
                  "Product Name",
                  "Market Price",
                  "Selling Price",
                  "Date",
                  "Status",
                  "Action",
                ].map((col, idx) => (
                  <th key={idx} className="py-3">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body Skeleton (8 rows) */}
            <tbody>
              {Array.from({ length: 8 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-t">
                  {Array.from({ length: 8 }).map((_, colIdx) => (
                    <td key={colIdx} className="py-4">
                      <div
                        className={`${
                          colIdx === 2
                            ? "flex items-center gap-3"
                            : ""
                        }`}
                      >
                        {/* Circle image for Product column */}
                        {colIdx === 2 && (
                          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                        )}

                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </td>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                  ))}
                </tr>
              ))}
            </tbody>
<<<<<<< HEAD
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="hidden sm:block h-4 w-64 bg-gray-300 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
=======

          </table>
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center mt-6">

          {/* Showing entries text */}
          <div className="hidden sm:block h-4 w-64 bg-gray-300 rounded"></div>

          {/* Pagination buttons */}
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>

        </div>

      </div>

      {/* Optional Popup Skeleton */}
      {/* Uncomment if needed */}
      {/* 
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
        <div className="w-80 h-80 bg-gray-800 rounded-lg"></div>
      </div>
      */}

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    </div>
  );
}
