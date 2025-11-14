import React, { useState, useEffect } from "react";
import postAPI from "../../../../api/postAPI";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";
import ConfirmationDialog from "../../ConfirmationDialog";

const Vouchers = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [materialVouchers, setMaterialVouchers] = useState("");
  const [materialVouchersImage, setMaterialVouchersImage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [price, setPrice] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterialToDelete, setSelectedMaterialToDelete] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMaterialVouchersImage(file);

    // For preview
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchMaterials = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(`/api/packaging-material-setting/material-vouchers/${userId}`);
      if(res.data.success && Array.isArray(res.data.data)) {
        setMaterials(res.data.data);
      } else if(res.data.success && res.data.data) {
        setMaterials([res.data.data]);
      } else {
        setMaterials([]);
      }
    } catch(error) {
      console.error("Error fetching materials:", error);
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

   const openViewModal = (mat) => {
    setViewMode(true);
    setViewData(mat);
    setShowPopUp(true);
  }

  const openCreateModal = () => {
    setEditMode(false);
    setMaterialVouchers("");
    setMaterialVouchersImage(null);
    setPrice("");
    setImagePreview(null);
    setEditId(null);
    setShowPopUp(true);  
  }

  const openEditModal = (mat) => {
    setEditMode(true);
    setMaterialVouchers(mat.materialVouchers);
    setMaterialVouchersImage(null);
    setPrice(mat.price);
    setImagePreview(mat.materialVouchersImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${mat.materialVouchersImage.replace(/\\/g, "/")}` : "/placeholder.jpg");
    setEditId(mat._id);
    setShowPopUp(true);
  }

  const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setSelectedMaterialToDelete(null);
    };

    const handleDeleteConfirmed = (id) => {
        setMaterials((prevMat) => prevMat.filter((mat) => mat._id !== id));
        setIsDeleteDialogOpen(false);
    };

    const openDeleteDialog = (mat) => {
        setSelectedMaterialToDelete(mat);
        setIsDeleteDialogOpen(true);
    };

  const filteredItems = materials.filter(mat => mat.materialVouchers?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredItems.length / productsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("materialVouchers", materialVouchers);
      formData.append("materialVouchersImage", materialVouchersImage);
      formData.append("price", price);

      const res = await postAPI("/api/packaging-material-setting/material-vouchers/create", formData);
      fetchMaterials();
      setShowPopUp(false);
      setMaterialVouchers("");
      setMaterialVouchersImage(null);
      setPrice("");
      setImagePreview(null);
    } catch(error){
      console.error("Error creating material:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("materialVouchers", materialVouchers);
      formData.append("materialVouchersImage", materialVouchersImage);
      formData.append("price", price);

      const res = await putAPI(`/api/packaging-material-setting/material-vouchers/update/${editId}`, formData);
      fetchMaterials();
      setShowPopUp(false);
    } catch(error){
      console.error("Error updating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Material Vouchers</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Package Material Settings</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={openCreateModal}
                >
                  <i className="fa fa-plus"></i> Create Material Vouchers
                </button>
                {showPopUp && (
                  <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "black" }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{viewMode ? "View Material Vouchers" : editMode ? "Update Material Vouchers" : "Create Material Vouchers"}</h5>
                          <button
                            type="button"
                            className="close"
                            onClick={() => {setShowPopUp(false);
                            setViewMode(false);
                            setViewData(null);
                            }}
                          >
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">{viewMode ? (
                          <div>
                            <div className="form-group">
                              <label>Material Vouchers</label>
                              <input
                                type="text"
                                className="form-control"
                                value={viewData?.materialVouchers}
                                disabled
                              />
                            </div>
                            <div className="form-group mt-3">
                              <label htmlFor="materialImage">Material Image</label>
                              {viewData?.materialVouchersImage && (
                                <div className="mt-2">
                                  <img
                                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${viewData.materialVouchersImage.replace(/\\/g, "/")}`}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ maxHeight: "200px" }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <label>Price / Unit</label>
                              <input
                                type="text"
                                className="form-control"
                                value={viewData?.price}
                                disabled
                              />
                            </div>
                          </div>
                          ) : (
                          <form onSubmit={editMode ? handleUpdate : handleSubmit}>
                            <div className="form-group">
                              <label>Material Vouchers</label>
                              <input
                                type="text"
                                className="form-control"
                                name="materialVouchers"
                                value={materialVouchers}
                                onChange={(e) => setMaterialVouchers(e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group mt-3">
                              <label htmlFor="materialImage">Material Image</label>
                              <input
                                type="file"
                                id="materialImage"
                                name="materialVouchersImage"
                                className="form-control-file"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              {imagePreview && (
                                <div className="mt-2">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ maxHeight: "200px" }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <label>Price / Unit</label>
                              <input
                                type="text"
                                className="form-control"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowPopUp(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                              >
                                {loading
                                   ? editMode ? "Updating...." : "Creating....." :
                                  editMode ? "Update Material Vouchers" : "Create Material Vouchers"}
                              </button>
                            </div>
                          </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  {/* <option value="5">5</option> */}
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
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark text-nowrap">
                    <tr>
                      <th>#</th>
                      <th>Material Image</th>
                      <th>Material Vouchers</th>
                      <th>Price / Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.filter((mat) => mat?.materialVouchers.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      materials.filter((mat) => mat?.materialVouchers.toLowerCase().includes(searchTerm.toLowerCase())).map((mat, index) => (
                        <tr key={mat._id}>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>
                          <td>
                            <img
                              src={
                                mat.materialVouchersImage
                                  ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${mat.materialVouchersImage.replace(/\\/g, "/")}`
                                  : "/placeholder.jpg"
                              }
                              className="rounded-circle"
                              alt={mat.materialVouchers}
                              style={{
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                                marginRight: '10px'
                              }}
                            />
                          </td>
                          <td>{mat.materialVouchers}</td>
                          <td>{mat.price}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="View"
                              onClick={() => openViewModal(mat)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(mat)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(mat)}
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
                  Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredItems.length)} of {filteredItems.length} entries
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
                    .map((pageNumber, index, array) => {
                      const prevPage = array[index - 1];
                      if (prevPage && pageNumber - prevPage > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${pageNumber}`}>
                            <li className="page-item disabled"><span className="page-link">...</span></li>
                            <li
                              key={pageNumber}
                              className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              <button className="page-link">{pageNumber}</button>
                            </li>
                          </React.Fragment>
                        );
                      }

                      return (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      );
                    })}

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
    </div>
    {
      isDeleteDialogOpen && (
        <ConfirmationDialog
        onClose={handleDeleteCancel}
        deleteType="materialVouchers"
        id={selectedMaterialToDelete._id}
        onDeleted={handleDeleteConfirmed}
        />
      )}
    </>
  )
}

export default Vouchers;