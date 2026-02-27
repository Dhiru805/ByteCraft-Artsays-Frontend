// import React, { useState } from "react";
// import ConfirmationDialog from "../../../ConfirmationDialog";
// import CategoryModal from "./Updatecategory";

// function BlogCategoryTable({ categories, setCategories, refreshCategories }) {
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [productsPerPage, setProductsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');


//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const handleDeleteCancel = () => {
//     setIsDeleteDialogOpen(false);
//     setSelectedCategoryToDelete(null);
//   };

//   const handleDeleteConfirmed = (id) => {
//     setCategories((prevCategories) =>
//       prevCategories.filter((category) => category._id !== id)
//     );
//     setIsDeleteDialogOpen(false);
//   };

//   const openDeleteDialog = (category) => {
//     setSelectedCategoryToDelete(category);
//     setIsDeleteDialogOpen(true);
//   };

//   const openEditModal = (category) => {
//     setSelectedCategory(category);
//     setIsCategoryModalOpen(true);
//   };


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

//   const filteredCategories = categories.filter(category =>
//     category.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredCategories.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);



//   return (
//     <>
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

//                 {/*  Import button */}
//                 <button
//                   type="button"
//                   className="btn btn-outline-success btn-sm ml-2"
//                   // onClick={() => setIsImportModalOpen(true)}
//                 >
//                   <i className="fa fa-upload mr-1"></i> Import 
//                 </button>

//               </div>
//             </div>
//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>#</th>
//                       <th>Blog Category</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentCategories.length === 0 ? (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No data available
//                         </td>
//                       </tr>
//                     ) : (
//                       currentCategories.map((category, index) => (
//                         <tr key={category._id}>
//                           <td>{startIndex + index + 1}</td>
//                           <td>{category.name}</td>
//                           <td>{new Date(category.createdAt).toLocaleDateString()}</td>
//                           <td>
//                             <button
//                               type="button"
//                               className="btn btn-outline-info btn-sm mr-2"
//                               title="Edit"
//                               onClick={() => openEditModal(category)}
//                             >
//                               <i className="fa fa-pencil"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn btn-outline-danger btn-sm mr-2"
//                               title="Delete"
//                               onClick={() => openDeleteDialog(category)}
//                             >
//                               <i className="fa fa-trash-o"></i>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                   Showing {filteredCategories.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * productsPerPage, filteredCategories.length)} of {filteredCategories.length} entries
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

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType="blogcategory"
//           id={selectedCategoryToDelete._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}

//       {isCategoryModalOpen && (
//         <CategoryModal
//           onClose={() => setIsCategoryModalOpen(false)}
//           refreshCategories={refreshCategories}
//           selectedCategory={selectedCategory}
//         />
//       )}
//     </>
//   );
// }

// export default BlogCategoryTable;


import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ConfirmationDialog from "../../../ConfirmationDialog";
import CategoryModal from "./Updatecategory";
import { toast } from "react-toastify";

function BlogCategoryTable({ categories, setCategories, refreshCategories }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // === Import Modal states ===
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCategoryToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // === Handle File Change for Import ===
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // === Handle Import Function ===
  const handleImport = async () => {
    if (!selectedFile) {
      toast.warning("Please choose a file before importing!");
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:3001/api/import-blog-categories", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Import failed");

      const result = await response.json();
      toast.success(result.message || "Blog categories imported successfully!");

      setIsImportModalOpen(false);
      setSelectedFile(null);
      refreshCategories();
    } catch (error) {
      console.error("Error importing:", error);
      toast.error("Failed to import blog categories. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  // === Download Template ===
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/export-blog-category-template", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Blog_Category_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template. Please try again.");
    }
  };

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
                  style={{ minWidth: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "150px" }}>
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
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  ></i>
                </div>

                {/* Import Button */}
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <i className="fa fa-upload mr-1"></i> Import
                </button>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Blog Category</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      currentCategories.map((category, index) => (
                        <tr key={category._id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{category.name}</td>
                          <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(category)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(category)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredCategories.length === 0
                    ? 0
                    : startIndex + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredCategories.length
                  )}{" "}
                  of {filteredCategories.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""
                          }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    )
                  )}

                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
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

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="blogcategory"
          id={selectedCategoryToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {/* Edit Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          onClose={() => setIsCategoryModalOpen(false)}
          refreshCategories={refreshCategories}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Import Modal */}
      <Modal show={isImportModalOpen} onHide={() => setIsImportModalOpen(false)} centered>
        <div className="p-4">
          <h5 className="mb-3">Import Blog Categories</h5>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={handleDownloadTemplate}
            >
              <i className="fa fa-download mr-2"></i> Download Template
            </button>
          </div>

          <label className="mb-2">Upload your filled Excel file:</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="form-control mb-3"
          />

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => setIsImportModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleImport}
              disabled={isImporting}
            >
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BlogCategoryTable;






