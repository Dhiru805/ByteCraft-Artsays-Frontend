import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../ConfirmationDialog";
import ProductTypeModal from "./UpdateProductType";

function ProductTypeTable({ productTypes, setProductTypes, refreshProductTypes }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductTypeToDelete, setSelectedProductTypeToDelete] = useState(null);
  const [isProductTypeModalOpen, setIsProductTypeModalOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const ImportModal = ({ isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleImport = async () => {
      if (!selectedFile) return alert("Please select a file before importing.");
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await fetch("/api/import-producttype", { method: "POST", body: formData });
        if (!res.ok) throw new Error();
        const data = await res.json();
        toast.success(data.message || "Imported successfully!");
        await refreshProductTypes();
        onClose();
      } catch { toast.error("Import failed. Please check your file."); }
    };
    const downloadTemplate = async () => {
      try {
        const res = await fetch("/api/export-producttype-template");
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "Product_Type_Template.xlsx";
        document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url);
      } catch { alert("Failed to download template."); }
    };
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <div className="p-4">
          <h5 className="mb-3">Import Product Types</h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button type="button" className="btn btn-outline-success btn-sm" onClick={downloadTemplate}>
              <i className="fa fa-download mr-2"></i> Download Template
            </button>
          </div>
          <label className="mb-2">Upload your filled Excel file:</label>
          <input type="file" accept=".xlsx,.xls" onChange={e => setSelectedFile(e.target.files[0])} className="form-control mb-3" />
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="mr-2">Cancel</Button>
            <Button variant="success" onClick={handleImport}>Import</Button>
          </div>
        </div>
      </Modal>
    );
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductTypeToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setProductTypes((prevProductTypes) =>
      prevProductTypes.filter((productType) => productType._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (productType) => {
    setSelectedProductTypeToDelete(productType);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (productType) => {
    setSelectedProductType(productType);
    setIsProductTypeModalOpen(true);
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

  const filteredProductTypes = productTypes.filter(productType =>
    productType.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProductTypes.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProductTypes = filteredProductTypes.slice(startIndex, startIndex + productsPerPage);

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
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
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end align-items-center">
                <div className="input-group mr-2" style={{ maxWidth: '150px' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fa fa-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></i>
                </div>
                <button type="button" className="btn btn-outline-success btn-sm" onClick={() => setIsImportModalOpen(true)}>
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
                      <th>Product Type</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProductTypes.length === 0 ? (
                      <tr><td colSpan="4" className="text-center">No data available</td></tr>
                    ) : (
                      currentProductTypes.map((productType, index) => (
                        <tr key={productType._id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{productType.name}</td>
                          <td>{new Date(productType.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button type="button" className="btn btn-outline-info btn-sm mr-2" title="Edit" onClick={() => openEditModal(productType)}>
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-outline-danger btn-sm mr-2" title="Delete" onClick={() => openDeleteDialog(productType)}>
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
                  Showing {filteredProductTypes.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * productsPerPage, filteredProductTypes.length)} of {filteredProductTypes.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevious}>
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === currentPage).map((pageNumber) => (
                    <li key={pageNumber} className={`paginate_button page-item active`} onClick={() => setCurrentPage(pageNumber)}>
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
                  <li className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={handleNext}>
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
          deleteType="producttype"
          id={selectedProductTypeToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isProductTypeModalOpen && (
        <ProductTypeModal
          onClose={() => setIsProductTypeModalOpen(false)}
          refreshProductTypes={refreshProductTypes}
          selectedProductType={selectedProductType}
        />
      )}
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </>
  );
}

export default ProductTypeTable;
