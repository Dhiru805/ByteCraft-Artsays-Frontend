import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
import putAPI from '../../../../api/putAPI';
import useUserType from '../../urlconfig';
import { toast } from 'react-toastify';

const Product = () => {
  const navigate = useNavigate();
  const userType = useUserType();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [viewCampaign, setViewCampaign] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;


  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const result = await getAPI(`/api/campaigns/${userId}`, {}, true, false);
        setProducts(result.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.selectedProductIds?.[0]?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleCloseCampaign = async (id) => {
    try {
      await putAPI(`/api/campaigns/${id}`, { status: 'closed' });
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === id ? { ...product, status: 'closed' } : product
        )
      );
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

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Advertise</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Advertise</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button type="button" className="btn btn-secondary mr-2" onClick={() => navigate(`/artist/advertise/sponser`)}>
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
                <select className="form-control form-control-sm" style={{ minWidth: '70px' }} value={productsPerPage} onChange={handleProductsPerPageChange}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: '150px' }}>
                  <input type="text" className="form-control form-control-sm" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <i className="fa fa-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></i>
                </div>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Product Name</th>
                      <th>Clicks</th>
                      <th>Daily Spent</th>
                      <th>Total Spent</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
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
                                <button type="button" className="btn btn-outline-info btn-sm" title="Edit" onClick={() => navigate("/artist/advertise/sponser", { state: { campaign: product } })}>
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
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

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
};

export default Product;
