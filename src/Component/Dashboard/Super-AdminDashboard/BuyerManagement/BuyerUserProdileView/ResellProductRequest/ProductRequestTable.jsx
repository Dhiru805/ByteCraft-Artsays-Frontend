import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import getAPI from '../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../../urlconfig';

const ProductRequest = ({userId}) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);



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


    const displayedProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );



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
                            <div className="d-flex align-items-center">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    className="form-control form-control-sm"
                                    value={productsPerPage}
                                    onChange={handleProductsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductRequest;