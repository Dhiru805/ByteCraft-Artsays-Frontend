import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';

const ProductRequest = () => {
    const [crops, setCrops] = useState([]);
    const [resellProducts, setResellProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

    const navigate = useNavigate();
    const userType = useUserType();

    const token = localStorage.getItem('token');
    let userId = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.userId;
        } catch (error) {
            console.error("Invalid token format", error);
        }
    }

    useEffect(() => {
        if (!userId) {
            console.error('User ID not found in token');
            return;
        }

        const fetchProducts = async () => {
            try {
                const result = await getAPI(`${process.env.REACT_APP_API_URL}/api/getproductbybuyerid/${userId}`, {}, true, false);
                console.log("Full API Response:", result);

                if (result && result.data) {
                    const { crops, resellProducts, buyer } = result.data;

                    const updatedResellProducts = Array.isArray(resellProducts)
                        ? resellProducts.map(product => ({
                            ...product,
                            buyerDetails: buyer 
                        }))
                        : [];

                    setCrops(Array.isArray(crops) ? crops : []);
                    setResellProducts(updatedResellProducts);
                } else {
                    console.error("Invalid API response structure:", result.data);
                    setCrops([]);
                    setResellProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setCrops([]);
                setResellProducts([]);
            }
        };

        fetchProducts();
    }, [userId]);


    const allProducts = [...crops, ...resellProducts];
    const displayedProducts = allProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

 ;

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
                                                                        return;
                                                                    }
                                                                    navigate(`/${userType}/Dashboard/productrequest/productdetails/${buyerId}`);
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
