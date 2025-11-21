// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../urlconfig';

// const ProductRequest = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage, setProductsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentImages, setCurrentImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;



//   const navigate = useNavigate();
//   const userType = useUserType();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const result = await getAPI("/api/getbuyerpurchaseproduct", {}, true, false);
//         console.log("Full API Response:", result);
//         console.log("Data Type:", typeof result.data);

//         if (result && result.data && Array.isArray(result.data.purchases)) {
//           setProducts(result.data.purchases);
//         } else {
//           console.error("API response does not contain an array:", result.data);
//           setProducts([]);
//         }

//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       }
//     };

//     fetchProducts();
//   }, []);



//   const filteredProducts = products.filter(product => {
//     const fullName = `${product.buyer.name} ${product.buyer.lastName}`.toLowerCase();
//     return fullName.includes(searchTerm.toLowerCase());
//   });




//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const displayedProducts = filteredProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );
//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleProductsPerPageChange = (event) => {
//     setProductsPerPage(Number(event.target.value));
//     setCurrentPage(1);
//   };

//   const handleImageClick = (product) => {
//     const productData = product.product || product.resellProduct;
//     const images = [productData?.mainImage, ...(productData?.otherImages || [])].filter(Boolean);
//     setCurrentImages(images);
//     setCurrentImageIndex(0);
//     setShowPopup(true);
//   };

//   const goToPreviousImage = () => {
//     setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   const goToNextImage = () => {
//     setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Buyer Product Purchased</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
//                   <i className="fa fa-dashboard"></i>
//                 </span>
//               </li>
//               <li className="breadcrumb-item">Buyer Product Purchased</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   name="DataTables_Table_0_length"
//                   aria-controls="DataTables_Table_0"
//                   className="form-control form-control-sm"
//                   value={productsPerPage}
//                   onChange={handleProductsPerPageChange}
//                   style={{ minWidth: '70px' }}
//                 >
//                   {/* <option value="5">5</option> */}
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <label className="mb-0 ml-2">entries</label>
//               </div>
//               <div className="w-100 w-md-auto d-flex justify-content-end">
//                 <div className="input-group" style={{ maxWidth: '150px' }}>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     placeholder="Search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <i
//                     className="fa fa-search"
//                     style={{
//                       position: 'absolute',
//                       right: '10px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       pointerEvents: 'none',
//                     }}
//                   ></i>
//                 </div>
//               </div>
//             </div>
//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>#</th>
//                       <th>Name</th>
//                       <th>Product Name</th>
//                       <th>Product Price</th>
//                       <th>Product Quantity</th>
//                       <th>Payment Type</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedProducts.map((product, index) => {
//                       const productData = product.product || product.resellProduct;
//                       return (
//                         <tr key={product._id}>
//                           <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                           <td>{product.buyer.name} {product.buyer.lastName}</td>

//                           <td>
//                             {productData ? (
//                               <>
//                                 <img
//                                   src={`${BASE_URL}${productData.mainImage}`}
//                                   className="rounded-circle avatar"
//                                   alt=""
//                                   onClick={() => handleImageClick(product)}
//                                   style={{
//                                     width: '30px',
//                                     height: '30px',
//                                     objectFit: 'cover',
//                                     marginRight: '10px',
//                                     cursor: 'pointer'
//                                   }}
//                                 />{product.productName}
//                               </>
//                             ) : (
//                               "No Product Data"
//                             )}
//                           </td>
//                           <td>
//                             {productData
//                               ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
//                                 .format(productData.price)
//                                 .replace(/\.00$/, '')
//                               : 'N/A'}
//                           </td>
//                           <td>{product.quantity}</td>
//                           <td>{product.paymentMethod}</td>
//                           <td>
//                             {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
//                           </td>
//                           <td>
//                             {productData && (
//                               <button className="btn btn-sm btn-outline-info mr-2"
//                                 onClick={() => navigate(`/${userType}/Dashboard/buyerproductpurchased/productpurchaseddetails/${product._id}`)}>
//                                 <i className="fa fa-eye"></i>
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                   Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
//                 </span>

//                 <ul className="pagination d-flex justify-content-end w-100">
//                   <li
//                     className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
//                     onClick={handlePrevious}
//                   >
//                     <button className="page-link">Previous</button>
//                   </li>

//                   {Array.from({ length: totalPages }, (_, index) => index + 1)
//                     .filter((pageNumber) => pageNumber === currentPage)
//                     .map((pageNumber, index, array) => {
//                       const prevPage = array[index - 1];
//                       if (prevPage && pageNumber - prevPage > 1) {
//                         return (
//                           <React.Fragment key={`ellipsis-${pageNumber}`}>
//                             <li className="page-item disabled"><span className="page-link">...</span></li>
//                             <li
//                               key={pageNumber}
//                               className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                               onClick={() => setCurrentPage(pageNumber)}
//                             >
//                               <button className="page-link">{pageNumber}</button>
//                             </li>
//                           </React.Fragment>
//                         );
//                       }

//                       return (
//                         <li
//                           key={pageNumber}
//                           className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                           onClick={() => setCurrentPage(pageNumber)}
//                         >
//                           <button className="page-link">{pageNumber}</button>
//                         </li>
//                       );
//                     })}

//                   <li
//                     className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
//                     onClick={handleNext}
//                   >
//                     <button className="page-link">Next</button>
//                   </li>
//                 </ul>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//       {showPopup && (
//         <div onClick={() => setShowPopup(false)} style={{
//           position: 'fixed',
//           top: 0, left: 0, right: 0, bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.65)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000,
//         }}>
//           <div onClick={(e) => e.stopPropagation()} style={{
//             position: 'relative',
//             width: '500px',
//             height: '600px',
//             backgroundColor: '#111',
//             borderRadius: '12px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             overflow: 'hidden',
//           }}>
//             <button onClick={goToPreviousImage} style={{
//               position: 'absolute',
//               left: '10px', top: '50%',
//               transform: 'translateY(-50%)',
//               fontSize: '2rem',
//               color: currentImageIndex === 0 ? '#666' : '#fff',
//               background: 'black',
//               border: 'none',
//               cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
//               zIndex: 2,
//             }} disabled={currentImageIndex === 0}>&#10094;</button>

//             <img src={`${BASE_URL}${currentImages[currentImageIndex]}`} alt="Popup" style={{
//               width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px',
//             }} />

//             <button onClick={goToNextImage} style={{
//               position: 'absolute',
//               right: '10px', top: '50%',
//               transform: 'translateY(-50%)',
//               fontSize: '2rem',
//               color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
//               background: 'black',
//               border: 'none',
//               cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
//               zIndex: 2,
//             }} disabled={currentImageIndex === currentImages.length - 1}>&#10095;</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductRequest;



// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../urlconfig';

// const ProductRequest = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage, setProductsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentImages, setCurrentImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const navigate = useNavigate();
//   const userType = useUserType();
//   const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

//   // Fetch purchased products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const result = await getAPI('/api/getbuyerpurchaseproduct', {}, true, false);
//         if (result?.data?.purchases && Array.isArray(result.data.purchases)) {
//           setProducts(result.data.purchases);

//           result.data.purchases.forEach((p, idx) => {
//             if (!p?.buyer) console.warn(`Purchase #${idx} has null buyer`);
//             if (!p?.product && !p?.resellProduct && !p?.customProduct)
//               console.warn(`Purchase #${idx} has no product data`);
//           });
//         } else {
//           setProducts([]);
//         }
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setProducts([]);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter((product) => {
//     const fullName = `${product.buyer?.name || ''} ${product.buyer?.lastName || ''}`.toLowerCase();
//     return fullName.includes(searchTerm.toLowerCase());
//   });

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const displayedProducts = filteredProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   const handleProductsPerPageChange = (e) => {
//     setProductsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleImageClick = (product) => {
//     const productData = product.product || product.resellProduct || product.customProduct || {};
//     const images = [productData?.mainImage, ...(productData?.otherImages || [])].filter(Boolean);
//     setCurrentImages(images);
//     setCurrentImageIndex(0);
//     setShowPopup(true);
//   };

//   const goToPreviousImage = () => setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
//   const goToNextImage = () => setCurrentImageIndex((prev) => Math.min(prev + 1, currentImages.length - 1));

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Buyer Product Purchased</h2>
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="header d-flex justify-content-between align-items-center">
//           <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//             <label className="mb-0 mr-2">Show</label>
//             <select
//               className="form-control form-control-sm"
//               value={productsPerPage}
//               onChange={handleProductsPerPageChange}
//               style={{ minWidth: '70px' }}
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//             <label className="mb-0 ml-2">entries</label>
//           </div>

//           <div className="w-100 w-md-auto d-flex justify-content-end">
//             <input
//               type="text"
//               className="form-control form-control-sm"
//               placeholder="Search Buyer"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ maxWidth: '150px' }}
//             />
//           </div>
//         </div>

//         <div className="body">
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="thead-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>Buyer Name</th>
//                   <th>Product Name</th>
//                   <th>Quantity</th>
//                   <th>Price</th>
//                   <th>Payment Method</th>
//                   <th>Date</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedProducts.map((product, index) => {
//                   const productData = product.product || product.resellProduct || product.customProduct || {};
//                   const buyerData = product.buyer || {};

//                   return (
//                     <tr key={product._id}>
//                       <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                       <td>{buyerData.name || 'N/A'} {buyerData.lastName || ''}</td>
//                       <td>{productData.productName || 'N/A'}</td>
//                       <td>{product.quantity || 'N/A'}</td>
//                       <td>
//                         {productData.price
//                           ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(productData.price)
//                           : 'N/A'}
//                       </td>
//                       <td>{product.paymentMethod || 'N/A'}</td>
//                       <td>{new Date(product.createdAt).toLocaleDateString('en-IN')}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-info"
//                           onClick={() =>
//                             navigate(`/${userType}/Dashboard/buyerproductpurchased/productpurchaseddetails/${product._id}`)
//                           }
//                         >
//                           <i className="fa fa-eye"></i>
//                         </button>
//                         {productData.mainImage && (
//                           <img
//                             src={`${BASE_URL}${productData.mainImage}`}
//                             alt="thumbnail"
//                             className="rounded-circle ml-2"
//                             style={{ width: '30px', height: '30px', objectFit: 'cover', cursor: 'pointer' }}
//                             onClick={() => handleImageClick(product)}
//                           />
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-flex justify-content-between mt-3">
//             <span>
//               Showing {(currentPage - 1) * productsPerPage + 1} to{' '}
//               {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
//             </span>
//             <div>
//               <button className="btn btn-sm btn-outline-secondary mr-2" onClick={handlePrevious} disabled={currentPage === 1}>
//                 Previous
//               </button>
//               <button className="btn btn-sm btn-outline-secondary" onClick={handleNext} disabled={currentPage === totalPages}>
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Popup */}
//       {showPopup && (
//         <div
//           onClick={() => setShowPopup(false)}
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.65)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               position: 'relative',
//               width: '500px',
//               height: '600px',
//               backgroundColor: '#111',
//               borderRadius: '12px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               overflow: 'hidden',
//             }}
//           >
//             <button
//               onClick={goToPreviousImage}
//               disabled={currentImageIndex === 0}
//               style={{
//                 position: 'absolute',
//                 left: '10px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 fontSize: '2rem',
//                 color: currentImageIndex === 0 ? '#666' : '#fff',
//                 background: 'black',
//                 border: 'none',
//                 cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
//                 zIndex: 2,
//               }}
//             >
//               &#10094;
//             </button>

//             <img
//               src={`${BASE_URL}${currentImages[currentImageIndex]}`}
//               alt="Popup"
//               style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
//             />

//             <button
//               onClick={goToNextImage}
//               disabled={currentImageIndex === currentImages.length - 1}
//               style={{
//                 position: 'absolute',
//                 right: '10px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 fontSize: '2rem',
//                 color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
//                 background: 'black',
//                 border: 'none',
//                 cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
//                 zIndex: 2,
//               }}
//             >
//               &#10095;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductRequest;



import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';

const ProductRequest = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();
  const userType = useUserType();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || '';

  // Fetch purchased products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAPI('/api/getbuyerpurchaseproduct', {}, true, false);
         console.log('API result:', result);
        if (result?.data?.purchases && Array.isArray(result.data.purchases)) {
          setProducts(result.data.purchases);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Helper: Get product data safely
  const getProductData = (product) => {
    return product.product || product.resellProduct || product.customProduct || {};
  };

  // Helper: Get buyer data safely
  const getBuyerData = (product) => {
    return product.buyer || {};
  };

  // Filter products by search term
  const filteredProducts = products.filter((product) => {
    const buyer = getBuyerData(product);
    const fullName = `${buyer.name || buyer.firstName || ''} ${buyer.lastName || buyer.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Image popup
  const handleImageClick = (product) => {
    const { mainImage, otherImages } = getProductData(product);
    const images = [mainImage, ...(otherImages || [])].filter(Boolean);
    if (images.length === 0) return;
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const goToPreviousImage = () => setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  const goToNextImage = () => setCurrentImageIndex((prev) => Math.min(prev + 1, currentImages.length - 1));

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Buyer Product Purchased</h2>
      </div>

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
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <label className="mb-0 ml-2">entries</label>
          </div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search Buyer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '150px' }}
          />
        </div>

        <div className="body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Buyer Name</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {products.length === 0 ? 'No purchase records found' : 'No results match your search'}
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product, index) => {
                    const productData = getProductData(product);
                    const buyerData = getBuyerData(product);

                    return (
                      <tr key={product._id || index}>
                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                        <td>{`${buyerData.name || buyerData.firstName || ''} ${buyerData.lastName || buyerData.last_name || ''}`}</td>
                        <td>{productData.productName || productData.ProductName || productData.name || 'N/A'}</td>
                        <td>{product.quantity}</td>
                        <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.finalPrice || product.totalPrice)}</td>
                        <td>
                          <span className={`badge badge-${product.paymentMethod === 'UPI' ? 'info' : product.paymentMethod === 'Credit Card' ? 'success' : product.paymentMethod === 'Cash on Delivery' ? 'warning' : 'secondary'}`}>
                            {product.paymentMethod}
                          </span>
                        </td>
                        <td>{product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => navigate(`/${userType}/Dashboard/buyerproductpurchased/productpurchaseddetails/${product._id}`)}
                            title="View Details"
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

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">
              Showing {filteredProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
            <div>
              <button className="btn btn-sm btn-outline-secondary mr-2" onClick={handlePrevious} disabled={currentPage === 1}>
                <i className="fa fa-chevron-left mr-1"></i> Previous
              </button>
              <span className="mx-2 text-muted">Page {currentPage} of {totalPages || 1}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
                Next <i className="fa fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && currentImages.length > 0 && (
        <div
          onClick={() => setShowPopup(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', width: '600px', height: '700px', backgroundColor: '#1a1a1a', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', color: '#fff', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>&times;</button>

            <button onClick={goToPreviousImage} disabled={currentImageIndex === 0} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '30px', color: currentImageIndex === 0 ? '#555' : '#fff', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>&#10094;</button>

            <img src={`${BASE_URL}${currentImages[currentImageIndex]}`} alt={`Product ${currentImageIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />

            <button onClick={goToNextImage} disabled={currentImageIndex === currentImages.length - 1} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '30px', color: currentImageIndex === currentImages.length - 1 ? '#555' : '#fff', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>&#10095;</button>

            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '8px 20px', borderRadius: '25px', fontSize: '14px', fontWeight: '500' }}>
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRequest;
