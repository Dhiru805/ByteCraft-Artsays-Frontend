import React, { useState, useEffect } from 'react';
import { useConfirm } from '../../../../StatusConfirm';
import { toast } from 'react-toastify';
import getAPI from '../../../../../../api/getAPI';
import putAPI from '../../../../../../api/putAPI';
// import ConfirmationDialog from '../../ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../../urlconfig';
import { DEFAULT_PROFILE_IMAGE } from "../../../../../../Constants/ConstantsVariables";


const ProductRequest = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');


    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE

    const confirm = useConfirm();
    const navigate = useNavigate();
    const userType = useUserType();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/getartistproductbyid/${userId}`, {}, true, false);
                console.log("Full API Response:", result);
                console.log("Data Type:", typeof result.data);

                if (result && result.data && Array.isArray(result.data.data)) {
                    setProducts(result.data.data);
                } else {
                    console.error("API response does not contain an array:", result.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);



    const updateProductStatus = async (productId, status) => {
        try {
            await putAPI(
                `/api/updateproductstatus/${productId}`,
                { status: status },
                {},
                true
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === productId ? { ...product, status: status } : product
                )
            );

            if (status === 'Approved') {
                toast.success('Product Request is Approved');
            } else if (status === 'Rejected') {
                toast.error('Product Request is Rejected');
            }
        } catch (error) {
            console.error("Error updating product status:", error);
        }
    };

    const handleReject = (productId) => {
        confirm(() => updateProductStatus(productId, 'Rejected'), "Are you sure you want to reject this product?");
    };

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const totalPages = Math.ceil(products.length / productsPerPage);

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
                                        {displayedProducts.map((product, index) => (
                                            <tr key={product._id}>
                                                <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                <td>
                                                    <img
                                                        src={
                                                            product.userId.profilePhoto
                                                                ? `${BASE_URL}${product.userId.profilePhoto}`
                                                                : DEFAULT_PROFILE_IMAGE
                                                        }
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {product.userId.name} {product.userId.lastName}</td>
                                                <td>
                                                    <img
                                                        src={`${BASE_URL}${product.mainImage}`}
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {product.productName}
                                                </td>
                                                <td>
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
                                                        .format((Number(product.sellingPrice) || 0) - (Number(product.discount) || 0))
                                                        .replace(/\.00$/, '')}
                                                </td>
                                                <td>{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td>
                                                    <button className={`btn btn-sm ${product.status === 'Pending' ? 'btn-outline-warning' : product.status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                        {product.status}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-info mr-2"
                                                        onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/productrequestdetails/${product._id}`, { state: { userId } })}
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success mr-2"
                                                        title="Approved"
                                                        onClick={() => updateProductStatus(product._id, 'Approved')}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger mr-2"
                                                        title="Declined"
                                                        onClick={() => handleReject(product._id)}
                                                    >
                                                        <i className="fa fa-ban"></i>
                                                    </button>
                                                    {/* <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm mr-2"
                                                        title="Delete"
                                                        onClick={() => openDeleteDialog(product)}
                                                    >
                                                        <i className="fa fa-trash-o"></i>
                                                    </button> */}
                                                </td>
                                            </tr>
                                        ))}
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