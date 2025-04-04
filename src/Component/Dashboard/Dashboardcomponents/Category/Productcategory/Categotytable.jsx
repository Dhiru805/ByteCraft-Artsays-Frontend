import React, { useState } from "react";
import ConfirmationDialog from "../../ConfirmationDialog";
import EditSubCategoryModal from "./Updatecategory";

const CategoryTable = ({ 
  selectedSubCategory, 
  subCategories, 
  setSubCategories, 
  setSelectedSubCategory, 
  fetchSubCategoryData 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");

  // Sort subCategories alphabetically by mainCategoryName, then categoryName, then subCategoryName
  const sortedSubCategories = [...subCategories].sort((a, b) => {
    // First compare main category names
    const mainCatCompare = a.mainCategoryName.localeCompare(b.mainCategoryName);
    if (mainCatCompare !== 0) return mainCatCompare;
    
    // If main categories are same, compare category names
    const catCompare = a.categoryName.localeCompare(b.categoryName);
    if (catCompare !== 0) return catCompare;
    
    // If categories are same, compare subcategory names
    return a.subCategoryName.localeCompare(b.subCategoryName);
  });

  const openDeleteDialog = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDialogOpen(true);
    setDeleteType("subCategory");
  };

  const openEditModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSubCategory(null);
  };

  const handleDeleteConfirmed = (id) => {
    setSubCategories((prevSubCategories) =>
      prevSubCategories.filter((subCategory) => subCategory.id !== id)
    );
  };

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <h2>Subcategory Management</h2>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Main Category</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubCategories.map((subCategory, index) => (
                      <tr key={subCategory.id}>
                        <td>{index + 1}</td>
                        <td>{subCategory.mainCategoryName}</td>
                        <td>{subCategory.categoryName}</td>
                        <td>{subCategory.subCategoryName}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm mr-2"
                            title="Edit"
                            onClick={() => openEditModal(subCategory)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mr-2"
                            title="Delete"
                            onClick={() => openDeleteDialog(subCategory)}
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
          deleteType={deleteType}
          id={selectedSubCategory.id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={selectedSubCategory}
        fetchSubCategoryData={fetchSubCategoryData}
      />
    </> 
  );
};

export default CategoryTable;