import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from '../ConfirmationDialog';
import VerifyModal from "./VerifyModal"
import CreateSellerModal from "./Createmodal";
import useUserType from '../urlconfig';

function SellerManageTable() {
  const [sellers, setSellers] = useState([]);
  const userType = useUserType(); 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSellerToDelete, setSelectedSellerToDelete] = useState(null);
  const [isCreateSellerModalOpen, setIsCreateSellerModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

  const BASE_URL = 'http://localhost:3001';
  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/get-Allsellers");
      const sellersData = response.data;

      const parsedSellers = sellersData.map((seller) => {
        const parsedAddress = seller.address
          ? typeof seller.address === "string"
            ? JSON.parse(seller.address)
            : seller.address
          : {};

        return {
          ...seller,
          address: parsedAddress,
        };
      });
      setSellers(parsedSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSellerToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setSellers((prevSellers) =>
      prevSellers.filter((seller) => seller._id !== id)
    );

    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (seller) => {
    setSelectedSellerToDelete(seller);
    setIsDeleteDialogOpen(true);
  };

  const openModal = (seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
};


  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Seller Management</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Seller Management</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <div className="page_action">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setIsCreateSellerModalOpen(true)}
                  >
                    <i className="fa fa-plus"></i>
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
                <h2>Seller List</h2>
                <div className="d-flex">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((seller, index) => (
                        <tr key={seller._id}>
                          <td>
                            <h6 className="mb-0">{index + 1}</h6>
                          </td>
                          <td>
                            <img
                              src={
                                seller.profilePhoto
                                  ? `${BASE_URL}${seller.profilePhoto}`
                                  : 'DashboardAssets/assets/images/user.png'
                              }
                              className="rounded-circle avatar"
                              alt=""
                              style={{
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                              }}
                            />

                            <p className="c_name">
                              {seller.name} {seller.lastName}
                            </p>
                          </td>
                          <td>
                            <span className="phone">{seller.email}</span>
                          </td>
                          <td>
                            <span className="phone">{seller.phone}</span>
                          </td>
                          <td>
                            <address>
                              <i className="zmdi zmdi-pin"></i>
                              {seller.address.city && `${seller.address.city}, `}
                              {seller.address.country && seller.address.country}
                            </address>
                          </td>
                          <td> 
  <button className={`btn btn-sm ${seller.status === 'Verified' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
    {seller.status}
  </button>
</td>

                          <td>
                          <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="Navigate"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/sellermanagetable/sellerprofileview/${seller._id}`)
                              }

                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/sellermanagetable/sellerprofile/${seller._id}`)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(seller)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => openModal(seller)}
                            >
                              <i className="fa fa-check-circle" style={{ color: "green" }}></i>
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
      </div>
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="seller"
          id={selectedSellerToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isModalOpen && selectedSeller && (
  <VerifyModal
    seller={selectedSeller}
    onClose={() => setIsModalOpen(false)}
    refreshSellers={fetchSellers}
  />
)}
{isCreateSellerModalOpen && (
  <CreateSellerModal
    onClose={() => setIsCreateSellerModalOpen(false)}
    fetchSellers={fetchSellers} 
  />
)}


    </>
  );
}

export default SellerManageTable;
