import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import useUserType from "../../../urlconfig";
import ProductRequestSkeleton from "../../../../../Component/Skeleton/artist/ProductRequestSkeleton";

const SoldProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const navigate = useNavigate();
  const userType = useUserType();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAPI("/api/orders/artist", {}, true, false);
        if (result?.data?.data && Array.isArray(result.data.data)) {
          const formatted = result.data.data.flatMap((order) => {
            return order.items
              .filter((item) => item.productId)
              .map((item, itemIndex) => ({
                id: `${order.orderId}-${item.productId._id}-${itemIndex}`, // More unique ID
                orderId: order.orderId,
                productId: item.productId._id,
                productName: item.productId.productName,
                mainImage: item.productId.mainImage,
                otherImages: item.productId.otherImages || [],
                productPrice: item.productId.sellingPrice,
                artistName: `${order.Artist?.id?.name || 'Unknown'} ${order.Artist?.id?.lastName || ''}`,
                totalQuantity: item.quantity,
              }));
          });
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching artist sold products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleImageClick = (product) => {
    const images = [product.mainImage, ...product.otherImages];
    setCurrentImages(images.filter(img => img));
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Artist Sold Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/super-admin/dashboard"); }}>
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">Artist Sold Product</li>
            </ul>
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
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search name or artist..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text bg-white border-left-0">
                      <i className="fa fa-search text-muted"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover table-custom spacing5">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Artist Name</th>
                      <th>Product Name</th>
                      <th>Product Price</th>
                      <th>Sold Product Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.length > 0 ? (
                      displayedProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                          <td>{product.artistName}</td>
                          <td className="d-flex align-items-center">
                            <img
                              src={`${BASE_URL}${product.mainImage}`}
                              className="rounded-circle avatar mr-2"
                              alt={product.productName}
                              onClick={() => handleImageClick(product)}
                              style={{
                                width: '35px',
                                height: '35px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: '1px solid #ddd'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/35?text=NA";
                              }}
                            />
                            <span className="text-truncate" style={{ maxWidth: '200px' }}>
                              {product.productName}
                            </span>
                          </td>
                          <td>{product.productPrice}</td>
                          <td>{product.totalQuantity}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-info"
                              title="View Details"
                              onClick={() => navigate(`/super-admin/artist/soldproducts/view/${product.productId}`)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">No sold products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between align-items-center mt-4">
                <span className="text-muted small">
                  Showing {filteredProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                </span>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={handlePrevious}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(num => num === 1 || num === totalPages || Math.abs(num - currentPage) <= 1)
                      .map((num, i, arr) => (
                        <React.Fragment key={num}>
                          {i > 0 && num - arr[i - 1] > 1 && (
                            <li className="page-item disabled"><span className="page-link">...</span></li>
                          )}
                          <li className={`page-item ${currentPage === num ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(num)}>{num}</button>
                          </li>
                        </React.Fragment>
                      ))}
                    <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={handleNext}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
          onClick={() => setShowPopup(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-dark border-0">
              <div className="modal-body p-0 position-relative">
                <button
                  className="btn btn-link text-white position-absolute"
                  style={{ top: '10px', right: '10px', zIndex: 10, fontSize: '1.5rem', textDecoration: 'none' }}
                  onClick={() => setShowPopup(false)}
                >
                  &times;
                </button>
                <img
                  src={`${BASE_URL}${currentImages[currentImageIndex]}`}
                  className="img-fluid w-100"
                  alt="Preview"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600?text=Image+Not+Found"; }}
                />
                {currentImages.length > 1 && (
                  <>
                    <button
                      className="btn btn-dark position-absolute"
                      style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.max(prev - 1, 0)); }}
                      disabled={currentImageIndex === 0}
                    >
                      <i className="fa fa-chevron-left"></i>
                    </button>
                    <button
                      className="btn btn-dark position-absolute"
                      style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.min(prev + 1, currentImages.length - 1)); }}
                      disabled={currentImageIndex === currentImages.length - 1}
                    >
                      <i className="fa fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldProduct;
