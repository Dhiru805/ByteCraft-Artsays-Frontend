import React, { useState } from "react";
import ConfirmationDialog from "../../../ConfirmationDialog";
import CategoryModal from "./Updatecategory";

function BlogCategoryTable({ categories, setCategories, refreshCategories }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <label className="mb-0 mr-2">Show</label>
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="form-control form-control-sm"
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                >
                  <option value="10">5</option>
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
              <div className="pagination d-flex justify-content-end mt-4">
                <ul className="pagination">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((pageNumber) =>
                      // pageNumber >= currentPage &&
                      // pageNumber < currentPage + 3
                      pageNumber === currentPage 
                    )
                    .map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    ))}
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

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="blogcategory"
          id={selectedCategoryToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          onClose={() => setIsCategoryModalOpen(false)}
          refreshCategories={refreshCategories}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
}

export default BlogCategoryTable;
