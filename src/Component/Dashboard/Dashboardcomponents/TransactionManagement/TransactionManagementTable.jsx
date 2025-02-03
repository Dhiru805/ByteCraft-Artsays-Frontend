import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from "../ConfirmationDialog";

function TableManagementTable() {
  const [buyers, setBuyers] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBuyerToDelete, setSelectedBuyerToDelete] = useState(null);
  const BASE_URL = "http://localhost:3001";
  const navigate = useNavigate();

  const fetchBuyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Transactions/All-Transaction"
      );
      const buyersData = response.data;

      const parsedBuyers = buyersData.map((buyer) => {
        const parsedAddress = buyer.address
          ? typeof buyer.address === "string"
            ? JSON.parse(buyer.address)
            : buyer.address
          : {};

        // Calculate total products bought and total cost
        const totalProducts =
          buyer.transactions?.reduce(
            (sum, transaction) => sum + transaction.quantity,
            0
          ) || 0;

        const totalCost =
          buyer.transactions?.reduce(
            (sum, transaction) => sum + transaction.totalPrice,
            0
          ) || 0;

        return {
          ...buyer,
          address: parsedAddress,
          totalProducts,
          totalCost,
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
    setBuyers((prevBuyers) => prevBuyers.filter((buyer) => buyer._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (buyer) => {
    setSelectedBuyerToDelete(buyer);
    setIsDeleteDialogOpen(true);
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
                        <th>Products Bought</th>
                        <th>Total Cost</th>
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
                                  : "DashboardAssets/assets/images/user.png"
                              }
                              className="rounded-circle avatar"
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
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
                            <span>{buyer.totalProducts}</span>
                          </td>
                          <td>
                            <span>${buyer.totalCost.toFixed(2)}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/Dashboard/BuyerManageTable/BuyerProfile/${buyer._id}`
                                )
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
    </>
  );
}

export default TableManagementTable;
