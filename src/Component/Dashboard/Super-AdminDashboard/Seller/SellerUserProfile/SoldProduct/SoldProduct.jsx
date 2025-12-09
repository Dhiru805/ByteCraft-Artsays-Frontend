// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../../urlconfig';

// const SoldProduct = ({ userId }) => {
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(10);

//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
//     const [searchTerm, setSearchTerm] = useState('');


//     const navigate = useNavigate();
//     const userType = useUserType();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const result = await getAPI(`/api/getsoldproductbyid/${userId}`, {}, true, false);
//                 console.log("Full API Response:", result);

//                 if (result && result.data && Array.isArray(result.data)) {
//                     setProducts(result.data);
//                 } else {
//                     console.error("API response does not contain an array:", result.data);
//                     setProducts([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 setProducts([]);
//             }
//         };

//         fetchProducts();
//     }, [userId]);

//     const filteredProducts = products.filter(product =>
//         product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
//                                             <th>Seller Name</th>
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
//                                                 <td>
//                                                     <img
//                                                         src={`${BASE_URL}${product.product}`}
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
//                                                 <td>
//                                                     {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
//                                                         .format(product.finalPrice ?? product.sellingPrice ?? 0)
//                                                         .replace(/\.00$/, '')}
//                                                 </td>
//                                                 <td>{product.totalQuantity}</td>
//                                                 <td>
//                                                     <button className="btn btn-sm btn-outline-info mr-2" onClick={() => navigate(`/${userType}/Dashboard/sellermanagetable/sellerprofile/${userId}/soldproductdetails/${product.productId}`, { state: { userId } })}>
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
//                                     Showing {(currentPage - 1) * productsPerPage + 1} to{" "}{Math.min(currentPage * productsPerPage, filteredProducts.length)} of{" "}{filteredProducts.length} entries
//                                     </span>
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



// import React, { useState, useEffect } from "react";
// import getAPI from "../../../../../../api/getAPI";
// import { useNavigate } from "react-router-dom";
// import useUserType from "../../../../urlconfig";

// const SoldProduct = ({ userId }) => {
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(10);
//     const [searchTerm, setSearchTerm] = useState("");

//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
//     const navigate = useNavigate();
//     const userType = useUserType();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const result = await getAPI(`/api/orders/seller/${userId}`, {}, true, false);
//                 console.log("Seller Orders Response:", result);

//                 if (result?.data?.data && Array.isArray(result.data.data)) {

//                     // const formatted = result.data.data.flatMap(order => {

//                     //     const sellerFullName =
//                     //         (order.Seller?.id?.name || "") +
//                     //         " " +
//                     //         (order.Seller?.id?.lastName || "");

//                     //     return order.items
//                     //         .filter(item => item.productId)
//                     //         .map(item => {
//                     //             const product = item.productId;

//                     //             return {
//                     //                 orderId: order.orderId,
//                     //                 productId: product._id,
//                     //                 productName: product.productName,
//                     //                 mainImage: product.mainImage,
//                     //                 productPrice: product.sellingPrice,
//                     //                 sellerName: sellerFullName.trim(),
//                     //                 totalQuantity: item.quantity
//                     //             };
//                     //         });
//                     // });
// const formatted = result.data.data.flatMap(order => {
//     const sellerFullName =
//         (order.Seller?.id?.name || "") +
//         " " +
//         (order.Seller?.id?.lastName || "");

//     return order.items.map(item => {

//         const product =
//             item.productId ||
//             item.product ||
//             item.resellProduct ||
//             item.customProduct ||
//             {};

//         return {
//             orderId: order.orderId,
//             productId: product._id || "",
//             productName:
//                 product.productName ||
//                 product.requestTitle ||
//                 "Unknown Product",
//             mainImage:
//                 product.mainImage ||
//                 product.referenceImage ||
//                 "",
//             productPrice: product.sellingPrice || 0,
//             totalQuantity: item.quantity,
//             sellerName: sellerFullName.trim(),
//         };
//     });
// });

//                     setProducts(formatted);
//                 } else {
//                     console.error("Invalid Seller Orders Format:", result.data);
//                     setProducts([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching seller sold products:", error);
//                 setProducts([]);
//             }
//         };

//         fetchProducts();
//     }, [userId]);

//     const filteredProducts = products.filter(p =>
//         p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const displayedProducts = filteredProducts.slice(
//         (currentPage - 1) * productsPerPage,
//         currentPage * productsPerPage
//     );

//     return (
//         <div className="container-fluid">
//             <div className="block-header">
//                 <h2>Seller Sold Product</h2>
//             </div>

//             <div className="card">
//                 <div className="header d-flex justify-content-between align-items-center">

//                     {/* Items per page */}
//                     <div className="d-flex align-items-center">
//                         <label className="mr-2">Show</label>
//                         <select
//                             className="form-control form-control-sm"
//                             value={productsPerPage}
//                             onChange={e => {
//                                 setProductsPerPage(Number(e.target.value));
//                                 setCurrentPage(1);
//                             }}
//                         >
//                             {[10, 25, 50, 100].map(num => (
//                                 <option key={num} value={num}>{num}</option>
//                             ))}
//                         </select>
//                         <label className="ml-2">entries</label>
//                     </div>

//                     {/* Search */}
//                     <div className="input-group" style={{ maxWidth: "200px" }}>
//                         <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                         />
//                         <i className="fa fa-search" style={{
//                             position: "absolute",
//                             right: "10px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             pointerEvents: "none"
//                         }}></i>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="body">
//                     <div className="table-responsive">
//                         <table className="table table-hover">
//                             <thead className="thead-dark">
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Seller Name</th>
//                                     <th>Product Name</th>
//                                     <th>Product Price</th>
//                                     <th>Sold Quantity</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {displayedProducts.map((p, index) => (
//                                     <tr key={p.productId}>
//                                         <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

//                                         <td>{p.sellerName}</td>

//                                         <td>
//                                             <div style={{ display: "flex", alignItems: "center" }}>
//                                                 <img
//                                                     src={`${BASE_URL}${p.mainImage}`}
//                                                     alt={p.productName}
//                                                     className="rounded-circle avatar"
//                                                     style={{
//                                                         width: "30px",
//                                                         height: "30px",
//                                                         objectFit: "cover",
//                                                         marginRight: "10px"
//                                                     }}
//                                                 />
//                                                 {p.productName}
//                                             </div>
//                                         </td>

//                                         <td>
//                                             {new Intl.NumberFormat("en-IN", {
//                                                 style: "currency",
//                                                 currency: "INR",
//                                             }).format(p.productPrice)}
//                                         </td>

//                                         <td>{p.totalQuantity}</td>

//                                         <td>
//                                             <button
//                                                 className="btn btn-sm btn-outline-info"
//                                                 onClick={() =>
//                                                     navigate(
//                                                         `/super-admin/seller/soldproducts/view/${p.productId}`,
//                                                         { state: { userId } }
//                                                     )
//                                                 }
//                                             >
//                                                 <i className="fa fa-eye"></i>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     <div className="pagination d-flex justify-content-between mt-4">
//                         <span>
//                             Showing {filteredProducts.length === 0
//                                 ? 0
//                                 : (currentPage - 1) * productsPerPage + 1} 
//                             to {Math.min(currentPage * productsPerPage, filteredProducts.length)} 
//                             of {filteredProducts.length} entries
//                         </span>

//                         <ul className="pagination">
//                             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                                 <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
//                                     Previous
//                                 </button>
//                             </li>

//                             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                                 <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
//                                     Next
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SoldProduct;
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './../Pereferences/Pereferences';
import Billings from './../Billings/Billings';
import Products from './../Products/Product';
import Transaction from './../Transaction/Transaction';
import SoldProduct  from './../SoldProduct/SoldProduct'
import Packagingmaterial from './../PackagingMaterial/ProductPurchasedSeller'
import getAPI from '../../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import Settings from './../UserProfile/BasicInformation';
import useUserType from '../../../../urlconfig'

const UserProfileForm = () => {
  const userType = useUserType();
  // const { userId } = useParams();
  const location = useLocation();
    const { seller } = location.state || {};

  const navigate = useNavigate(); 
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('DashboardAssets/assets/images/user.png');
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    gender: '',
    birthdate: '',
    website: ''
  });

    const userId = seller?._id;


  const fetchProfile = async () => {
    try {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
        const parsedAddress = userData.address ? (typeof userData.address === 'string' ? JSON.parse(userData.address) : userData.address) : {};

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress,
        });

const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
        const profilePhotoUrl = result.data.user.profilePhoto ? `${BASE_URL}${result.data.user.profilePhoto}` : 'DashboardAssets/assets/images/user.png';
        setPreviewImage(profilePhotoUrl);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile data");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const [activeTab, setActiveTab] = useState('Settings');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromUrl = queryParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    navigate({
      pathname: location.pathname,
      search: `?tab=${tabName}`,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const [, subKey] = name.split('.');

    setProfileData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [subKey]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('lastName', profileData.lastName);
      formData.append('address', JSON.stringify(profileData.address));
      formData.append('gender', profileData.gender);
      formData.append('birthdate', profileData.birthdate);
      formData.append('website', profileData.website);

      if (imageFile) {
        formData.append('profilePhoto', imageFile);
      }

      const response = await fetch(`/auth/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update profile: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Products', component: Products },
    { name: 'Transaction', component: Transaction },
    { name: 'Sold Products', component: SoldProduct },
    { name: 'Packaging Material', component: Packagingmaterial },
    { name: 'Billings', component: Billings },
    { name: 'Preferences', component: Preferences },

  ];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Seller Profile View</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
<span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
    <i className="fa fa-dashboard"></i>
</span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/super-admin/artist/management')}
                  style={{ cursor: 'pointer' }}
                >
                  ArtistManageTable
                </span>
              </li>
              <li className="breadcrumb-item">Seller Profile View</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <ul className="nav nav-tabs">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.name}>
                    <a
                      className={`nav-link ${activeTab === tab.name ? 'active' : ''}`}
                      onClick={() => handleTabClick(tab.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tab.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tab-content">
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  className={`tab-pane ${activeTab === tab.name ? 'active' : ''}`}
                  id={tab.name}
                >
                  <tab.component
                    userId={userId}
                    profileData={profileData}
                    previewImage={previewImage}
                    handleImageUpload={handleImageUpload}
                    handleChange={handleChange}
                    handleAddressChange={handleAddressChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
