import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const BiddedProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    
    

    const navigate = useNavigate();
const [artistId, setArtistId] = useState(null);

useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decoded = jwtDecode(token);
            setArtistId(decoded.userId);
        } catch (e) {
            console.error("Token decode failed:", e);
        }
    }
}, []);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const result = await getAPI("/api/getbiddedproduct", {}, true, false);
    //             if (result && result.data && Array.isArray(result.data.biddedProducts)) {
    //                 setProducts(result.data.biddedProducts);
    //             } else {
    //                 console.error("API response does not contain an array:", result.data);
    //                 setProducts([]);
    //             }

    //         } catch (error) {
    //             console.error("Error fetching products:", error);
    //             setProducts([]);
    //         }
    //     };

    //     fetchProducts();
    // }, []);
// useEffect(() => {
//     if (!artistId) return;

//     const fetchData = async () => {
//         try {
//             const result = await getAPI(
//                 `/api/artist-bidded-products/${artistId}`,
//                 {},
//                 true,
//                 false
//             );

//             console.log("Artist Bidded Products:", result.data);

//             if (result?.data?.data && Array.isArray(result.data.data)) {
//                 setProducts(result.data.data);
//             } else {
//                 console.error("Invalid format:", result);
//                 setProducts([]);
//             }
//         } catch (error) {
//             console.error("Error fetching artist bidded products:", error);
//             setProducts([]);
//         }
//     };

//     fetchData();
// }, [artistId]);
useEffect(() => {
  const fetchBiddedProducts = async () => {
    try {
      console.log("🔥 Fetching artist bidded products with ID:", artistId);

      const response = await getAPI(
        `/api/artist-bidded-products/${artistId}`,
        {},
        true,
        false
      );

      console.log("🔥 API FULL RESPONSE:", response);

      if (response?.data?.data && Array.isArray(response.data.data)) {
        console.log("🔥 Setting products:", response.data.data);
        setProducts(response.data.data);
      } else {
        console.log("❌ API returned unexpected format:", response);
        setProducts([]);
      }
    } catch (error) {
      console.log("❌ Fetch Error:", error);
      setProducts([]);
    }
  };

  if (artistId) fetchBiddedProducts();
}, [artistId]);


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

//  const filteredProducts = products.filter(product =>
//         product?.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product?.buyer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

const filteredProducts = products.filter(item =>
  item.product?.productName
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())
);


    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // const displayedProducts = filteredProducts.slice(
    //     (currentPage - 1) * productsPerPage,
    //     currentPage * productsPerPage
    // );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



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
                                            <th>Buyer Name</th>
                                            <th>Product Name</th>
                                            <th>Bidded Price</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {paginatedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedProducts.map((product, index) => {
                                                const productData = product.product?.product;
                                                const buyer = product.buyer;
                                                return (
                                                    <tr key={product._id}>
                                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{buyer.name} {buyer.lastName}</td>
                                                        <td>
                                                            {productData ? (
                                                                <>
                                                                    <img
                                                                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${productData.mainImage}`}
                                                                        className="rounded-circle avatar"
                                                                        alt=""
                                                                        style={{
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            objectFit: 'cover',
                                                                            marginRight: '10px'
                                                                        }}
                                                                    />
                                                                    {productData.productName}
                                                                </>
                                                            ) : (
                                                                "No Product Data"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {productData
                                                                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
                                                                    .format(product.totalPrice)
                                                                    .replace(/\.00$/, '')
                                                                : 'N/A'}
                                                        </td>
                                                        <td>
                                                            {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/Dashboard/biddedproduct/productdetails/${productData._id}`)}
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                            </button>

                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody> */}

                                    <tbody>
  {paginatedProducts.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center">No data available</td>
    </tr>
  ) : (
    paginatedProducts.map((item, index) => {
      const product = item.product;

      return (
        <tr key={item.bidId}>
          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

          <td>{item.assignedWinners?.[0]?.name || "No Buyer Yet"}</td>

          <td>
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${product.mainImage}`}
              className="rounded-circle avatar"
              alt=""
              style={{
                width: "30px",
                height: "30px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            {product.productName}
          </td>

          <td>
            {item.assignedWinners?.length
              ? item.assignedWinners[0].amount
              : "No Bids"}
          </td>

          <td>{new Date(item.createdAt).toLocaleDateString()}</td>

          <td>
            <button
              className="btn btn-sm btn-outline-info mr-2"
              onClick={() =>
                navigate(`/artist/product-fetch-view-artist/${product.id}`)
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
