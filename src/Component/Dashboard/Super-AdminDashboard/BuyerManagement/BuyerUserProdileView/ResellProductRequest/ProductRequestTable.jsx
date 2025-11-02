import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import getAPI from '../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../../urlconfig';

const ProductRequest = ({userId}) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); 


    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/getproductrequestbyid/${userId}`, {}, true, false);
                console.log("Full API Response:", result);

                if (result && result.data && result.data.data) {
                    const { products = [], crops = [] } = result.data.data;
                    console.log("Fetched Products and Crops:", [...products, ...crops]);
                    setProducts([...products, ...crops]);
                } else {
                    console.error("Unexpected API response structure:", result.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products and crops:", error);
                setProducts([]);
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

    const displayedProducts = filteredProducts.slice(
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
                                <table className="table table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => {
                                            const buyer = product?.buyerId || product?.userId || {};
                                            const buyerId = product?.userId?._id || product?._id || "";
                                            const name = buyer?.name || "Unknown";
                                            const lastName = buyer?.lastName || "";
                                            const productName = product?.productName || "Unnamed Product";
                                            const mainImage = product?.mainImage || "default-image.jpg";
                                            const price = product?.price !== undefined ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '') : "N/A";
                                            const createdAt = product?.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date";
                                            const status = product?.status || "Pending";

                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    <td>{name} {lastName}</td>
                                                    <td>
                                                        <img
                                                            src={mainImage}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                                marginRight: '10px'
                                                            }}
                                                        />
                                                        {productName}
                                                    </td>
                                                    <td>{price}</td>
                                                    <td>{createdAt}</td>
                                                    <td>
                                                        <button className={`btn btn-sm ${status === 'Pending' ? 'btn-outline-warning' : status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                            {status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-info mr-2"
                                                            onClick={() => {
                                                                console.log("Navigating with ID:", buyerId);
                                                                if (!buyerId) {
                                                                    console.error("Invalid ID:", product);
                                                                    toast.error("Cannot navigate: ID is missing.");
                                                                    return;
                                                                }
                                                                navigate(`/${userType}/Dashboard/buyermanagetable/buyerprofileview/${userId}/resellproductdetails/${buyerId}`,{ state: { userId } });
                                                            }}
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                                                        <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
  Showing {(filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1)} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
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
    );
};

export default ProductRequest;