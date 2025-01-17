import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuyerModal from './BuyerEditModal'; 


const BuyerManagement = () => {
  
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/buyers/get-Allbuyer');
      setBuyers(response.data);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    }
  };

  const handleEditClick = (buyer) => {
    setSelectedBuyer(buyer);
    setFormData({ name: buyer.name, email: buyer.email });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteBuyer = async (buyerId) => {
    if (window.confirm('Are you sure you want to delete this buyer?')) {
      try {
        await axios.delete(`http://localhost:3001/api/buyers/delete-buyer/${buyerId}`);
        fetchBuyers(); 
      } catch (error) {
        console.error('Error deleting buyer:', error);
      }
    }
  };

  return (
  <>
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>All Buyers</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">
                      <i className="fa fa-dashboard"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">APP</li>
                  <li className="breadcrumb-item active">All Buyers</li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <div className="page_action">
                  </div>
                  <div className="p-2 d-flex"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Buyers</h2>
                </div>
                <div className="body">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 c_list">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Orders</th>
                          <th>Wishlist</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buyers.map((buyer, index) => (
                          <tr key={buyer._id}>
                            <td>{index + 1}</td>
                            <td>{buyer.name}</td>
                            <td>{buyer.email}</td>
                            <td>{buyer.ordersCount || 0}</td>
                            <td>{buyer.wishlistCount || 0}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary mr-2"
                                onClick={() => handleEditClick(buyer)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteBuyer(buyer._id)}
                              >
                                Delete
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
      <BuyerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        selectedBuyer={selectedBuyer}
        fetchBuyers={fetchBuyers}
      />
      </>
  );
};

export default BuyerManagement;
