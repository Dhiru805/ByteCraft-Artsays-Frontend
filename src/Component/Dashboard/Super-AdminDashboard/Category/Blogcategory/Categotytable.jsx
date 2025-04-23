import React, { useState } from "react";
import ConfirmationDialog from "../../ConfirmationDialog";
import CategoryModal from "./Updatecategory";

function BlogCategoryTable({ categories, setCategories, refreshCategories }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <h2>Blog Category List</h2>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Blog Category</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
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
                    ))}
                  </tbody>
                </table>
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