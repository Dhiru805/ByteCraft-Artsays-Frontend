import React, { useState } from "react";
import ConfirmationDialog from "../../../ConfirmationDialog";
import EditSubCategoryModal from "./Updatecategory";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);


    const filteredSubCategories = subCategories.filter(subCategory => {
        const matchMainCategory = (subCategory.mainCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = (subCategory.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchSubCategory = (subCategory.subCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchMainCategory || matchCategory || matchSubCategory;
    });

    const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
    const displayedSubCategories = filteredSubCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            prevSubCategories.filter((subCategory) => (subCategory._id || subCategory.id) !== id)
        );
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const ImportCategoryModal = ({ isOpen, onClose, fetchSubCategoryData }) => {
        const [selectedFile, setSelectedFile] = useState(null);

        const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

        const handleImport = async () => {
            if (!selectedFile) return alert("Please select a file before importing.");

            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const response = await fetch("/api/import-product-categories", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to import categories");

                const data = await response.json();
                toast.success(data.message || "Categories imported successfully!");

                if (data.newCategories && data.newCategories.length > 0) {
                    setSubCategories(prev => [...prev, ...data.newCategories]);
                }

                await fetchSubCategoryData();
                onClose();
            } catch (error) {
                console.error("Error importing categories:", error);
                toast.error("Failed to import categories. Please check your file.");
            }
        };

        return (
            <Modal show={isOpen} onHide={onClose} centered>
                <div className="p-4">
                    <h5 className="mb-3">Import Product Categories</h5>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={async () => {
                                try {
                                    const response = await fetch(
                                        "/api/export-product-category-template",
                                        { method: "GET" }
                                    );

                                    if (!response.ok) throw new Error("Failed to fetch template");

                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "Product_Category_Template.xlsx";
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error("Error downloading template:", error);
                                    alert("Failed to download template. Please try again.");
                                }
                            }}
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
                        <Button variant="secondary" onClick={onClose} className="mr-2">
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleImport}>
                            Import
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <>
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
                            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    name="DataTables_Table_0_length"
                                    aria-controls="DataTables_Table_0"
                                    className="form-control form-control-sm"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    style={{ minWidth: '70px' }}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
                            </div>

                            <div className="w-100 w-md-auto d-flex justify-content-end">
                                <div className="input-group" style={{ maxWidth: '150px' }}>
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
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                        }}
                                    ></i>
                                </div>

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
                                            <th>Main Category</th>
                                            <th>Category</th>
                                            <th>Sub Category</th>
                                            <th>Commission Term</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedSubCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : (
                                            displayedSubCategories.map((subCategory, index) => (
                                                <tr key={(subCategory._id || subCategory.id) || index}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{subCategory.mainCategoryName}</td>
                                                    <td>{subCategory.categoryName}</td>
                                                    <td>{subCategory.subCategoryName}</td>
                                                    <td>{subCategory.commissionTerm ?? "NA"}</td>
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
                                                            className="btn btn-outline-danger btn-sm"
                                                            title="Delete"
                                                            onClick={() => openDeleteDialog(subCategory)}
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
                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubCategories.length)} of {filteredSubCategories.length} entries
                                </span>

                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={handlePrevious}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                                        .filter((pageNumber) => pageNumber === currentPage)
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

            <ImportCategoryModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                fetchSubCategoryData={fetchSubCategoryData}
            />

            {isDeleteDialogOpen && (
                <ConfirmationDialog
                    onClose={handleDeleteCancel}
                    deleteType={deleteType}
                    id={selectedSubCategory?._id || selectedSubCategory?.id}
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
