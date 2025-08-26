import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
import useUserType from '../../urlconfig';
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";


const Product = () => {
  const navigate = useNavigate();
  const userType = useUserType();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [productsPerPage, setProductsPerPage] = useState(10);


  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const result = await getAPI(`/api/get-certificationbyId/${userId}`, {}, true, false);
        setProducts(result.data.data);
        console.log(result.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleImageClick = (product) => {
    const images = [product.mainImage, ...(product.otherImages || [])];
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); // UPDATED
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
                  onClick={() => navigate('/seller/dashboard')}
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
                  onClick={() => navigate(`/seller/certification/create-certification`)}
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
                      <th>Main Category</th>
                      <th>Certification Name</th>
                      <th>Estimated Days</th>
                      <th>Certification Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.length > 0 ? (
                      displayedProducts.map((product, index) => (
                        <tr key={product._id}>
                          <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                          {/* User Name */}
                          <td>
                            {product.userId?.name} {product.userId?.lastName}
                          </td>

                          {/* Product Name + Image */}
                          <td>
                            <img
                              src={product.productId?.mainImage ? `${BASE_URL}${product.productId.mainImage}` : DEFAULT_PROFILE_IMAGE}
                              className="rounded-circle avatar"
                              alt=""
                              onClick={() => handleImageClick(product.productId)}
                              style={{
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                                marginRight: '10px',
                                cursor: 'pointer'
                              }}
                            />
                            {product.productId?.productName || "N/A"}
                          </td>

                          {/* Main Category Name */}
                          <td>{product.mainCategoryId?.mainCategoryName || "N/A"}</td>

                          {/* Certification Name */}
                          <td>{product.certificationId?.certificationName || "N/A"}</td>

                          {/* Estimated Days */}
                          <td>{product.certificationId?.estimatedDays || "N/A"}</td>

                          {/* Certification Price */}
                          <td>{product.certificationPrice || "N/A"}</td>

                          {/* Actions */}
                          <td>
                            <button className="btn btn-sm btn-outline-info mr-2">
                              <i className="fa fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No products found
                        </td>
                      </tr>
                    )}
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
          </div>

        </div>
      )}

    </div>
  );
};

export default Product;
