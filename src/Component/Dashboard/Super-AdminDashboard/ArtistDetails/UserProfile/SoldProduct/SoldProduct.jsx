// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../../urlconfig';

// const SoldProduct = ({ userId }) => {
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(10);
//     const [searchTerm, setSearchTerm] = useState('');

//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE

//     const navigate = useNavigate();
//     const userType = useUserType();

//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         try {
//     //             const result = await getAPI(`/api/getartistsoldproductbyid/${userId}`, {}, true, false);
//     //             console.log("Full API Response:", result);

//     //             if (result && result.data && Array.isArray(result.data)) {
//     //                 setProducts(result.data);
//     //             } else {
//     //                 console.error("API response does not contain an array:", result.data);
//     //                 setProducts([]);
//     //             }
//     //         } catch (error) {
//     //             console.error("Error fetching products:", error);
//     //             setProducts([]);
//     //         }
//     //     };

//     //     fetchProducts();
//     // }, [userId]);
// useEffect(() => {
//     const fetchProducts = async () => {
//         try {
//             const result = await getAPI(`/api/orders/artist/${userId}`, {}, true, false);
//             console.log("Artist Orders Response:", result);

//             if (result?.data?.data && Array.isArray(result.data.data)) {

//                 // const formatted = result.data.data.flatMap(order =>
//                 //     order.items.map(item => ({
//                 //         productId: item.product?.id || item.resellProduct?.id || item.customProduct?.id,
//                 //         productName: item.product?.productName || item.resellProduct?.productName || "Custom Product",
//                 //         productPrice: item.product?.sellingPrice || item.resellProduct?.sellingPrice || 0,
//                 //         totalQuantity: item.quantity,
//                 //         mainImage: item.product?.mainImage || item.resellProduct?.mainImage || "",
//                 //         artistName: order.artist?.name || "Unknown",
//                 //     }))
//                 // );
// const formatted = result.data.data.flatMap(order =>
//     order.items.map(item => ({
//         productId: item.product?.id || item.resellProduct?.id || item.customProduct?.id,
//         productName: item.product?.productName ||
//                      item.resellProduct?.productName ||
//                      item.customProduct?.requestTitle ||
//                      "Custom Product",
//         productPrice: item.product?.sellingPrice ||
//                       item.resellProduct?.sellingPrice ||
//                       0,
//         totalQuantity: item.quantity,
//         mainImage: item.product?.mainImage ||
//                    item.resellProduct?.mainImage ||
//                    item.customProduct?.referenceImage ||
//                    "",
//         artistName: order.Artist?.id?.name || "Unknown",
//     }))
// );

//                 setProducts(formatted);
//             } else {
//                 console.error("API response not array:", result.data);
//                 setProducts([]);
//             }

//         } catch (error) {
//             console.error("Error fetching artist sold products:", error);
//             setProducts([]);
//         }
//     };

//     fetchProducts();
// }, [userId]);

//     const totalPages = Math.ceil(products.length / productsPerPage);
//     // const filteredProducts = products.filter(product =>
//     //     product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     //     product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     //     product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
//     // );
// const filteredProducts = products.filter(product =>
//     product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
// );


//     const displayedProducts = filteredProducts.slice(
//         (currentPage - 1) * productsPerPage,
//         currentPage * productsPerPage
//     );

//     const handlePrevious = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handleProductsPerPageChange = (event) => {
//         setProductsPerPage(Number(event.target.value));
//         setCurrentPage(1);
//     };


//     return (
//         <div className="container-fluid">
//             <div className="row clearfix">
//                 <div className="col-lg-12">
//                     <div className="card">
//                         <div className="header d-flex justify-content-between align-items-center">
//                             <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                                 <label className="mb-0 mr-2">Show</label>
//                                 <select
//                                     name="DataTables_Table_0_length"
//                                     aria-controls="DataTables_Table_0"
//                                     className="form-control form-control-sm"
//                                     value={productsPerPage}
//                                     onChange={handleProductsPerPageChange}
//                                     style={{ minWidth: '70px' }}
//                                 >
//                                     {/* <option value="5">5</option> */}
//                                     <option value="10">10</option>
//                                     <option value="25">25</option>
//                                     <option value="50">50</option>
//                                     <option value="100">100</option>
//                                 </select>
//                                 <label className="mb-0 ml-2">entries</label>
//                             </div>
//                             <div className="w-100 w-md-auto d-flex justify-content-end">
//                                 <div className="input-group" style={{ maxWidth: '150px' }}>
//                                     <input
//                                         type="text"
//                                         className="form-control form-control-sm"
//                                         placeholder="Search"
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                     <i
//                                         className="fa fa-search"
//                                         style={{
//                                             position: 'absolute',
//                                             right: '10px',
//                                             top: '50%',
//                                             transform: 'translateY(-50%)',
//                                             pointerEvents: 'none',
//                                         }}
//                                     ></i>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="body">
//                             <div className="table-responsive">
//                                 <table className="table table-hover">
//                                     <thead className="thead-dark">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Artist Name</th>
//                                             <th>Product Name</th>
//                                             <th>Product Price</th>
//                                             <th>Sold Product Quantity</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {displayedProducts.map((product, index) => (
//                                             <tr key={product.productId}>
//                                                 <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                                                 <td>{product.artistName}</td>
//                                                 {/* <td>
//                                                     <img
//                                                         src={product.product}
//                                                         className="rounded-circle avatar"
//                                                         alt=""
//                                                         style={{
//                                                             width: '30px',
//                                                             height: '30px',
//                                                             objectFit: 'cover',
//                                                             marginRight: '10px'
//                                                         }}
//                                                     /> {product.productName}
//                                                 </td>
//                                               */}
//                                               <td>
//     <img
//         src={`${BASE_URL}${product.mainImage}`}
//         className="rounded-circle avatar"
//         alt={product.productName}
//         style={{
//             width: "30px",
//             height: "30px",
//             objectFit: "cover",
//             marginRight: "10px"
//         }}
//     />
//     {product.productName}
// </td>



//                                                 <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.productPrice).replace(/\.00$/, '')}</td>
//                                                 <td>{product.totalQuantity}</td>
//                                                 <td>
//                                                     <button
//                                                         className="btn btn-sm btn-outline-info mr-2"
//                                                         onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/soldproductdetails/${product.productId}`, { state: { userId } })}
//                                                     >
//                                                         <i className="fa fa-eye"></i>
//                                                     </button>

//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="pagination d-flex justify-content-between mt-4">
//                                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                                     Showing {(filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1)} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
//                                 </span>

//                                 <ul className="pagination d-flex justify-content-end w-100">
//                                     <li
//                                         className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
//                                         onClick={handlePrevious}
//                                     >
//                                         <button className="page-link">Previous</button>
//                                     </li>

//                                     {Array.from({ length: totalPages }, (_, index) => index + 1)
//                                         .filter((pageNumber) => pageNumber === currentPage)
//                                         .map((pageNumber, index, array) => {
//                                             const prevPage = array[index - 1];
//                                             if (prevPage && pageNumber - prevPage > 1) {
//                                                 return (
//                                                     <React.Fragment key={`ellipsis-${pageNumber}`}>
//                                                         <li className="page-item disabled"><span className="page-link">...</span></li>
//                                                         <li
//                                                             key={pageNumber}
//                                                             className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                                                             onClick={() => setCurrentPage(pageNumber)}
//                                                         >
//                                                             <button className="page-link">{pageNumber}</button>
//                                                         </li>
//                                                     </React.Fragment>
//                                                 );
//                                             }

//                                             return (
//                                                 <li
//                                                     key={pageNumber}
//                                                     className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                                                     onClick={() => setCurrentPage(pageNumber)}
//                                                 >
//                                                     <button className="page-link">{pageNumber}</button>
//                                                 </li>
//                                             );
//                                         })}

//                                     <li
//                                         className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
//                                         onClick={handleNext}
//                                     >
//                                         <button className="page-link">Next</button>
//                                     </li>
//                                 </ul>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SoldProduct;
import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import useUserType from "../../../../urlconfig";

const SoldProduct = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/orders/artist/${userId}`, {}, true, false);
                console.log("Artist Sold Orders:", result);

                // if (result?.data?.data && Array.isArray(result.data.data)) {
                //     console.log("ORDER DATA:", JSON.stringify(result.data.data, null, 2));

                //     const formatted = result.data.data.flatMap(order =>
                //         order.items.map(item => ({
                //             productId:
                //                 item.product?.id ||
                //                 item.resellProduct?.id ||
                //                 item.customProduct?._id,

                //             productName:
                //                 item.product?.productName ||
                //                 item.resellProduct?.productName ||
                //                 item.customProduct?.requestTitle ||
                //                 "Custom Product",

                //             mainImage:
                //                 item.product?.mainImage ||
                //                 item.resellProduct?.mainImage ||
                //                 item.customProduct?.referenceImage ||
                //                 "",

                //             productPrice:
                //                 item.product?.sellingPrice ||
                //                 item.resellProduct?.sellingPrice ||
                //                 0,

                //             totalQuantity: item.quantity,

                //             artistName:
                //                 `${order.Artist?.id?.name || "Unknown"} ${
                //                     order.Artist?.id?.lastName || ""
                //                 }`.trim(),
                //         }))
                //     );

                //     setProducts(formatted);
                if (result?.data?.data && Array.isArray(result.data.data)) {

    const formatted = result.data.data.flatMap(order => {

        const artistFullName =
            (order.Artist?.id?.name || "") +
            " " +
            (order.Artist?.id?.lastName || "");

        return order.items.map(item => {

            const product =
                item.productId ||
                item.resellProduct ||
                item.customProduct ||
                {};

            return {
                productId: product._id || "",
                productName:
                    product.productName ||
                    product.requestTitle ||
                    "Unknown Product",
                mainImage:
                    product.mainImage ||
                    product.referenceImage ||
                    "",
<<<<<<< HEAD
                productPrice: product.finalPrice || 0,
=======
                productPrice: product.sellingPrice || 0,
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                totalQuantity: item.quantity,
                artistName: artistFullName.trim()
            };
        });
    });

    setProducts(formatted);


                } else {
                    console.error("Invalid format from artist order API.");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching artist sold products:", err);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [userId]);

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="container-fluid">
            {/* Title Section */}
            <div className="block-header">
                <h2>Artist Sold Product</h2>
            </div>

            <div className="card">
                {/* Header */}
                <div className="header d-flex justify-content-between align-items-center">

                    {/* Items per page */}
                    <div className="d-flex align-items-center">
                        <label className="mr-2">Show</label>
                        <select
                            className="form-control form-control-sm"
                            value={productsPerPage}
                            onChange={e => {
                                setProductsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[10, 25, 50, 100].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <label className="ml-2">entries</label>
                    </div>

                    {/* Search */}
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <i
                            className="fa fa-search"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                            }}
                        ></i>
                    </div>
                </div>

                {/* Table */}
                <div className="body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Artist Name</th>
                                    <th>Product Name</th>
                                    <th>Product Price</th>
                                    <th>Sold Quantity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayedProducts.map((p, index) => (
                                    <tr key={`${p.productId}-${index}`}>
                                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                                        <td>{p.artistName}</td>

                                        {/* <td>
                                            <img
                                                src={`${BASE_URL}${p.mainImage}`}
                                                alt={p.productName}
                                                className="rounded-circle avatar"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    objectFit: "cover",
                                                    marginRight: "10px",
                                                }}
                                            />
                                            {p.productName}
                                        </td> */}
<td>
    <div style={{ display: "flex", alignItems: "center" }}>
        <img
            src={`${BASE_URL}${p.mainImage}`}
            className="rounded-circle avatar"
            alt={p.productName}
            style={{
                width: "30px",
                height: "30px",
                objectFit: "cover",
                marginRight: "10px"
            }}
        />
        <span>{p.productName}</span>
    </div>
</td>

                                        <td>
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                            })
                                                .format(p.productPrice)
                                                .replace(/\.00$/, "")}
                                        </td>

                                        <td>{p.totalQuantity}</td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() =>
                                                    navigate(
                                                        `/super-admin/product-fetch-view/${p.productId}`,
                                                        { state: { userId } }
                                                    )
                                                }
                                            >
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination d-flex justify-content-between mt-4">
                        <span>
                            Showing{" "}
                            {filteredProducts.length === 0
                                ? 0
                                : (currentPage - 1) * productsPerPage + 1}{" "}
                            to{" "}
                            {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
                            of {filteredProducts.length} entries
                        </span>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={handlePrevious}>
                                    Previous
                                </button>
                            </li>

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={handleNext}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoldProduct;
