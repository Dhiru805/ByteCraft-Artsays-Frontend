import React, { useState } from 'react';
import axios from 'axios';

const BuyerModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  selectedBuyer,
  fetchBuyers
}) => {
  const [loading, setLoading] = useState(false);



  const handleUpdateBuyer = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/api/buyers/update-buyer/${selectedBuyer._id}`, formData);
      fetchBuyers(); 
      setIsModalOpen(false); 
    } catch (error) {
      console.error('Error updating buyer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isModalOpen && (
      <div className="modal" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Buyer</h5>
              <button
                type="button"
                className="close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleUpdateBuyer}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BuyerModal;
