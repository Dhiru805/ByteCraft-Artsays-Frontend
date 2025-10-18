import React, { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../ConfirmationDialog";

const Material = () => {

    const [materials, setMaterials] = useState([]);
    const [materialNameImage, setMaterialNameImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMaterialToDelete, setSelectedMaterialToDelete] = useState(null);

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMaterialNameImage(file);

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

    const fetchMaterials = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await getAPI(`/api/package-material/material/${userId}`);

        if (res.hasError) {
          console.error("Error fetching materials:", res.message);
          setMaterials([]);
          return;
        }
        console.log("Data:", res);
        const materialsArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setMaterials(materialsArray);

      } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterials([]);
      }
    };

 useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredItems = materials.filter(mat => mat.materialName?.materialName.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredItems.length / productsPerPage);

    return (
      <>
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>Material</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <span style={{ cursor: "pointer" }}>
                      <i className="fa fa-dashboard"></i>
                    </span>
                  </li>
                  <li className="breadcrumb-item">Packaging Material</li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <div className="page_action">
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={() => navigate(`/super-admin/packaging-material/create-packaging-material`)}
                    >
                      <i className="fa fa-plus"></i>  Create Material
                    </button>
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
                          <th>PackagingMaterialId</th>
                          <th>Material Name</th>
                          <th>Price / Unit</th>
                          <th>Stock Quantity Available</th>
                          <th>Status (Active / Inactive)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody >
                        {materials.filter((mat) => mat.materialName?.materialName.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      materials.filter((mat) => mat.materialName?.materialName.toLowerCase().includes(searchTerm.toLowerCase())).map((mat, index) => (
                        <tr key={mat._id}>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>
                          <td>
                            <img
                              src={
                                mat.materialName?.materialNameImage
                                  ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${mat.materialName?.materialNameImage.replace(/\\/g, "/")}`
                                  : "/placeholder.jpg"
                              }
                              className="rounded-circle"
                              alt={mat.materialName}
                              style={{
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                                marginRight: '10px'
                              }}
                            />
                            <span>{mat.materialName?.materialName}</span>
                          </td>
                          <td>{mat.price}</td>
                          <td className="align-center">{mat.stockAvailable}</td>
                          <td className="align-center">{mat.status}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="View"
                              onClick={() => navigate(`/super-admin/packaging-material/material/view/${mat._id}`)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => navigate(`/super-admin/packaging-material/material/edit/${mat._id}`)}
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
        deleteType="packageMaterial"
        id={selectedMaterialToDelete._id}
        onDeleted={handleDeleteConfirmed}
        />
      )}
        </>
      );
}

export default Material;