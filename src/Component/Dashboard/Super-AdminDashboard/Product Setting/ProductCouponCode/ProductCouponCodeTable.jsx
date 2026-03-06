import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../ConfirmationDialog";
import ProductCouponCodeModal from "./UpdateProductCouponCode";

function ProductCouponCodeTable({ productCouponCodes, setProductCouponCodes, refreshProductCouponCodes }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductCouponCodeToDelete, setSelectedProductCouponCodeToDelete] = useState(null);
  const [isProductCouponCodeModalOpen, setIsProductCouponCodeModalOpen] = useState(false);
  const [selectedProductCouponCode, setSelectedProductCouponCode] = useState(null);
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
        const res = await fetch("/api/import-productcouponcode", { method: "POST", body: formData });
        if (!res.ok) throw new Error();
        const data = await res.json();
        toast.success(data.message || "Imported successfully!");
        await refreshProductCouponCodes();
        onClose();
      } catch { toast.error("Import failed. Please check your file."); }
    };
    const downloadTemplate = async () => {
      try {
        const res = await fetch("/api/export-productcouponcode-template");
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "Product_Coupon_Code_Template.xlsx";
        document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url);
      } catch { alert("Failed to download template."); }
    };
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <div className="p-4">
          <h5 className="mb-3">Import Product Coupon Codes</h5>
          <div className="mb-3">
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

  const handleDeleteCancel = () => { setIsDeleteDialogOpen(false); setSelectedProductCouponCodeToDelete(null); };
  const handleDeleteConfirmed = (id) => { setProductCouponCodes(prev => prev.filter(c => c._id !== id)); setIsDeleteDialogOpen(false); };
  const openDeleteDialog = (c) => { setSelectedProductCouponCodeToDelete(c); setIsDeleteDialogOpen(true); };
  const openEditModal = (c) => { setSelectedProductCouponCode(c); setIsProductCouponCodeModalOpen(true); };
  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handleProductsPerPageChange = (e) => { setProductsPerPage(Number(e.target.value)); setCurrentPage(1); };

  const filteredProductCouponCodes = productCouponCodes.filter(c => c.couponName?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredProductCouponCodes.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProductCouponCodes = filteredProductCouponCodes.slice(startIndex, startIndex + productsPerPage);

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select className="form-control form-control-sm" value={productsPerPage} onChange={handleProductsPerPageChange} style={{ minWidth: '70px' }}>
                  <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end align-items-center">
                <div className="input-group mr-2" style={{ maxWidth: '150px' }}>
                  <input type="text" className="form-control form-control-sm" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                      <th>#</th><th>Coupon Name</th><th>Name</th><th>Product Name</th>
                      <th>Original Price</th><th>Discount (%)</th><th>Final Price After Discount</th>
                      <th>Application Type</th><th>Date</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProductCouponCodes.length === 0 ? (
                      <tr><td colSpan="10" className="text-center">No data available</td></tr>
                    ) : (
                      currentProductCouponCodes.map((productCouponCode, index) => (
                        <tr key={productCouponCode._id || index}>
                          <td>{startIndex + index + 1}</td>
                          <td>{productCouponCode.couponName}</td>
                          <td>{`${productCouponCode.user.firstName} ${productCouponCode.user.lastName}`}</td>
                          <td>{productCouponCode.product.productName}</td>
                          <td>{productCouponCode.product.originalFinalPrice.toFixed(2)}</td>
                          <td>{productCouponCode.product.discountPercentage}</td>
                          <td>{productCouponCode.product.finalPriceAfterDiscount.toFixed(2)}</td>
                          <td>{productCouponCode.applicationType}</td>
                          <td>{new Date(productCouponCode.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button type="button" className="btn btn-outline-info btn-sm mr-2" title="Edit" onClick={() => openEditModal(productCouponCode)}><i className="fa fa-pencil"></i></button>
                            <button type="button" className="btn btn-outline-danger btn-sm mr-2" title="Delete" onClick={() => openDeleteDialog(productCouponCode)}><i className="fa fa-trash-o"></i></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {filteredProductCouponCodes.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * productsPerPage, filteredProductCouponCodes.length)} of {filteredProductCouponCodes.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevious}><button className="page-link">Previous</button></li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p} className={`paginate_button page-item ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}><button className="page-link">{p}</button></li>
                  ))}
                  <li className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={handleNext}><button className="page-link">Next</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteDialogOpen && <ConfirmationDialog onClose={handleDeleteCancel} deleteType="productcouponcode" id={selectedProductCouponCodeToDelete._id} onDeleted={handleDeleteConfirmed} />}
      {isProductCouponCodeModalOpen && <ProductCouponCodeModal onClose={() => setIsProductCouponCodeModalOpen(false)} refreshProductCouponCodes={refreshProductCouponCodes} selectedProductCouponCode={selectedProductCouponCode} />}
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </>
  );
}

export default ProductCouponCodeTable;
