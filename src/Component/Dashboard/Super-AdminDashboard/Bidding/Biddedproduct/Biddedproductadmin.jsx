import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../../../../utils/getImageUrl';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import ProductRequestSkeleton from '../../../../Skeleton/artist/ProductRequestSkeleton';

const BiddedProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //const [productsPerPage, setproductsPerPage] = useState(5);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [successfulBids, setSuccessfulBids] = useState([]);
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();


  const fetchProducts = async () => {
    try {
      const result = await getAPI(
        "/api/bidding/successful",
        {},
        true,
        false
      );

      console.log("Successfully Completed Bids:", result);

      const completed = result?.data?.data;

      if (Array.isArray(completed)) {
        setProducts([...completed].reverse());
      } else {
        console.error("Invalid successful bidding response:", result?.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching successful bidded products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuccessfulBids = async () => {
    try {
      const result = await getAPI("/api/bidding/successful", {}, true, false);

      const completed = result?.data?.data || [];
      setSuccessfulBids(completed);

    } catch (error) {
      console.error("Error fetching successful bids:", error);
    }
  };
  // useEffect(() => {
  //     fetchProducts();
  // }, []);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      await fetchSuccessfulBids();
    };

    load();

    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const filteredProducts = products.filter((product) => {
    const s = searchTerm.toLowerCase();

    return (
      product.product?.productName?.toLowerCase().includes(s) ||
      product.highestBidder?.name?.toLowerCase().includes(s) ||
      product.seller?.name?.toLowerCase().includes(s)
    );
  });


  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) return <ProductRequestSkeleton />
  return (
    <>
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
                <table className="table table-hover text-nowrap">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Winner</th>
                      <th>Product Name</th>
                      <th>Bidded Price</th>
                      <th>Highest Bid</th>


                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                 
                  <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">No data available</td>
                      </tr>
                    ) : (
                      paginatedProducts.map((item, index) => {
                        const p = item.product;

                        const winnerRecord = successfulBids.find(s => s.bidId === item.bidId);
                        const winner = winnerRecord?.assignedWinners?.[0];


                        return (
                          <tr key={item.bidId}>

                            <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                            {/* Winner Name */}
                            <td>{winner?.name || "No Winner"}</td>

                            {/* Product Name */}
                            <td>
                              <img
                                src={getImageUrl(p?.mainImage)}
                                className="rounded-circle avatar"
                                alt=""
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  marginRight: "10px",
                                  objectFit: "cover"
                                }}
                              />
                              {p?.productName}
                            </td>


                            <td>₹{item.basePrice.toLocaleString("en-IN")}</td>

                            <td>
                              ₹{item.highestBid?.toLocaleString("en-IN") || "—"}
                            </td>

                            <td>{new Date(item.bidEnd).toLocaleDateString("en-IN")}</td>

                            <td>
                              <span className="badge badge-primary">Bidded</span>
                            </td>

                            <td>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() =>
                                  navigate(`/super-admin/product-fetch-view/${p?.id}`)
                                }
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
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
    </>
  );
};

export default BiddedProduct;
