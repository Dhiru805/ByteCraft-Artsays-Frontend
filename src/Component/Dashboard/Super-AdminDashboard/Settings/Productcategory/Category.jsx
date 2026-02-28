// import React, { useEffect, useState } from "react"; 
// import CategoryTable from "./Categotytable";
// import CreateCategoryModal from "./Createcategory";
// import getAPI from "../../../../../api/getAPI";
// import { useNavigate } from 'react-router-dom';

// const Category = () => {
//   const [categories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();


//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const fetchSubCategoryData = async () => {
//     try {
//       const response = await getAPI(`/api/sub-category`, {}, true);
//       if (
//         !response.hasError &&
//         response.data &&
//         Array.isArray(response.data.data)
//       ) {
//         setSubCategories(response.data.data);
//         console.log("Sub Category data", response.data.data);
//       } else {
//         console.error("Invalid response format or error in response");
//       }
//     } catch (err) {
//       console.error("Error fetching Sub category List:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSubCategoryData();
//   }, []);

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Product Category</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//  <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
//     <i className="fa fa-dashboard"></i>
// </span>
//               </li>
//               <li className="breadcrumb-item">Product Category</li>
//             </ul>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse">
//               <div className="page_action">
//                 <button
//                   type="button"
//                   className="btn btn-secondary mr-2"
//                   onClick={() => setShowModal(true)}
//                 >
//                   <i className="fa fa-plus"></i> 
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <CategoryTable
//         categories={categories}
//         setSelectedSubCategory={setSelectedSubCategory}
//         setSubCategories={setSubCategories}
//         subCategories={subCategories}
//         selectedSubCategory={selectedSubCategory}
//         fetchSubCategoryData={fetchSubCategoryData}

//       />

//       {showModal && (
//         <CreateCategoryModal
//           onClose={() => setShowModal(false)}
//           fetchSubCategoryData={fetchSubCategoryData}
//         />
//       )}
//     </div>
//   );
// };

// export default Category;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./Categotytable";
import CreateCategoryModal from "./Createcategory";
import getAPI from "../../../../../api/getAPI";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";


const Category = () => {
  const navigate = useNavigate();

  // State for categories (used in create/edit modal if needed)
  const [categories, setCategories] = useState([]);
const[loading,setLoading]=useState(false);

  // State for sub-categories (used in table)
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all product categories (for dropdowns or reference)
  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      const response = await getAPI(`/api/main-category`, {}, true);
      if (!response.hasError && response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching Product Categories:", err);
    }finally{
      setLoading(false)
    }
  };

  // Fetch all sub-categories (to display in table)
  const fetchSubCategoryData = async () => {
    try {
      const response = await getAPI(`/api/sub-category`, {}, true);
      if (!response.hasError && response.data && Array.isArray(response.data.data)) {
        setSubCategories(response.data.data);
        console.log("Sub Category data:", response.data.data);
      }
    } catch (err) {
      console.error("Error fetching Sub Categories:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategoryData();
    fetchSubCategoryData();
  }, []);

  if(loading)return <ProductRequestSkeleton/>
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Product Category</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Product Category</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Category Table */}
      <CategoryTable
        subCategories={subCategories}            // ✅ sub-categories
        setSubCategories={setSubCategories}      // ✅ setter for sub-categories
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        fetchSubCategoryData={fetchSubCategoryData} // ✅ fetches sub-categories
      />


      {/* Create Sub-Category Modal */}
      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          fetchSubCategoryData={fetchSubCategoryData}
          categories={categories} // pass categories if needed for dropdowns
        />
      )}
    </div>
  );
};

export default Category;
