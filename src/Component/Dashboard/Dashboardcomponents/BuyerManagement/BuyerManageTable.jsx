import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from '../ConfirmationDialog';
import VerifyModal from "./VerifyModal"
import CreateBuyerModal from "./Createmodal";
import useUserType from '../urlconfig';

function BuyerManageTable() {
  const [buyers, setBuyers] = useState([]);
  const userType = useUserType();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBuyerToDelete, setSelectedBuyerToDelete] = useState(null);
  const [isCreateBuyerModalOpen, setIsCreateBuyerModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE_URL = 'http://localhost:3001';
  const navigate = useNavigate();

  const fetchBuyers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/buyers/get-Allbuyer");
      const buyersData = response.data;

      const parsedBuyers = buyersData.map((buyer) => {
        const parsedAddress = buyer.address
          ? typeof buyer.address === "string"
            ? JSON.parse(buyer.address)
            : buyer.address
          : {};

        return {
          ...buyer,
          address: parsedAddress,
        };
      });
      setBuyers(parsedBuyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBuyerToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setBuyers((prevBuyers) =>
      prevBuyers.filter((buyer) => buyer._id !== id)
    );

    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (buyer) => {
    setSelectedBuyerToDelete(buyer);
    setIsDeleteDialogOpen(true);
  };
  const openModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Buyer Management</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Buyer Management</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <div className="page_action">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setIsCreateBuyerModalOpen(true)}
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
                <h2>Buyer List</h2>
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
                      {buyers.map((buyer, index) => (
                        <tr key={buyer._id}>
                          <td>
                            <h6 className="mb-0">{index + 1}</h6>
                          </td>
                          <td>
                            <img
                              src={
                                buyer.profilePhoto
                                  ? `${BASE_URL}${buyer.profilePhoto}`
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
                              {buyer.name} {buyer.lastName}
                            </p>
                          </td>
                          <td>
                            <span className="phone">{buyer.email}</span>
                          </td>
                          <td>
                            <span className="phone">{buyer.phone}</span>
                          </td>
                          <td>
                            <address>
                              <i className="zmdi zmdi-pin"></i>
                              {buyer.address.city && `${buyer.address.city}, `}
                              {buyer.address.country && buyer.address.country}
                            </address>
                          </td>
                          <td>
                            <button className={`btn btn-sm ${buyer.status === 'Verified' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                              {buyer.status}
                            </button>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-2"
                              title="Navigate"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/buyermanagetable/buyerprofileview/${buyer._id}`)
                              }

                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate(`/${userType}/Dashboard/buyermanagetable/buyerprofile/${buyer._id}`)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(buyer)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => openModal(buyer)}
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
          deleteType="buyer"
          id={selectedBuyerToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isModalOpen && selectedBuyer && (
        <VerifyModal
          buyer={selectedBuyer}
          onClose={() => setIsModalOpen(false)}
          refreshBuyers={fetchBuyers}
        />
      )}
      {isCreateBuyerModalOpen && (
        <CreateBuyerModal
          onClose={() => setIsCreateBuyerModalOpen(false)}
          fetchBuyers={fetchBuyers}
        />
      )}


    </>
  );
}

export default BuyerManageTable;
