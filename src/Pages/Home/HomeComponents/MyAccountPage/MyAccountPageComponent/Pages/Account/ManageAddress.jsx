import React, { useState, useEffect } from 'react';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';
import { toast } from 'react-toastify';
import ConfirmationDialog from './ConfirmationDialog';

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 

  const userId = localStorage.getItem('userId');

  const fetchAddresses = async () => {
    if (!userId) {
      setFetchError('User not logged in. Please log in to view addresses.');
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      setFetchError(null);
      const response = await getAPI(`/auth/userid/${userId}`);
      if (response.data?.user?.address && Array.isArray(response.data.user.address)) {
        setAddresses(response.data.user.address);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      setFetchError('Failed to load addresses. Please try again later.');
      toast.error('Failed to load addresses');
      console.error('Error fetching addresses:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.line1 || !formData.city || !formData.state || !formData.pincode) {
      setLoading(false);
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const responseGet = await getAPI(`/auth/userid/${userId}`);
      if (!responseGet.data?.user) {
        setLoading(false);
        toast.error('Failed to fetch user data');
        return;
      }

      const user = responseGet.data.user;
      const updatedAddressArray = [...(Array.isArray(user.address) ? user.address : [])];

      if (editIndex !== null) {
        updatedAddressArray[editIndex] = formData;
      } else {
        updatedAddressArray.push(formData);
      }

      const updatedUser = {
        ...user,
        address: updatedAddressArray,
      };

      const response = await putAPI(`/auth/users/${userId}`, updatedUser, {
        'Content-Type': 'application/json',
      });

      if (response.hasError) {
        setLoading(false);
        toast.error(response.message || 'Failed to update address');
        return;
      }

      toast.success(response.message || 'Address updated successfully');
      await fetchAddresses();

      setEditIndex(null);
      setFormData({
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
      });
    } catch (error) {
      toast.error('Server error while updating address');
      console.error('Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditIndex(index);
  };

  const handleDeleteConfirmed = async (index) => {
    try {
      const responseGet = await getAPI(`/auth/userid/${userId}`);
      if (!responseGet.data?.user) {
        toast.error('Failed to fetch user data');
        return;
      }

      const user = responseGet.data.user;
      const updatedAddresses = [...(Array.isArray(user.address) ? user.address : [])];
      updatedAddresses.splice(index, 1);

      const updatedUser = {
        ...user,
        address: updatedAddresses,
      };

      const responsePut = await putAPI(`/auth/users/${userId}`, updatedUser, {
        'Content-Type': 'application/json',
      });

      if (responsePut.hasError) {
        toast.error(responsePut.message || 'Failed to delete address');
        return;
      }

      toast.success(responsePut.message || 'Address deleted successfully');
      await fetchAddresses();
    } catch (error) {
      toast.error('Server error while deleting address');
      console.error('Error deleting address:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItemToDelete(null);
  };

  return (
    <div className="w-[1208px]">
      <h2 className="text-xl text-gray-950 font-semibold">Manage Address</h2>

      {isFetching && <div className="text-gray-600 py-4">Loading addresses...</div>}

      {!isFetching && fetchError && (
        <div className="text-red-500 py-4">{fetchError}</div>
      )}

      {!isFetching && !fetchError && addresses.length === 0 && (
        <div className="text-gray-600 py-4">No addresses found. Add a new address below.</div>
      )}

      {!isFetching && addresses.length > 0 && (
        <div className="border-[0.6px] border-[#6F3E2D] rounded-[50px] p-4 my-4 space-y-4">
          {addresses.map((addr, index) => (
            <div key={index}>
              <div className="px-4 py-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{addr.city}, {addr.state}</p>
                  <p className="text-sm text-gray-600">{addr.line1}, {addr.pincode}</p>
                </div>
                <div className="space-x-6 text-lg font-semibold">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-[#6F3E2D] hover:text-red-900"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItemToDelete(index);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Delete
                  </button>
                  {isDeleteDialogOpen && selectedItemToDelete === index && (
                    <ConfirmationDialog
                      onClose={handleDeleteCancel}
                      deleteType="address"
                      id={index}
                      onDeleted={handleDeleteConfirmed}
                    />
                  )}
                </div>
              </div>
              {addresses.length > 1 && index < addresses.length - 1 && (
                <hr className="border-t border-gray-300 m-4" />
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddAddress} className="space-y-4">
        <h3 className="text-xl text-gray-950 pb-2 font-semibold">
          {editIndex !== null ? 'Edit Address' : 'Add New Address'}
        </h3>

        <div>
          <label className="block text-sm">Address Line 1 *</label>
          <input
            name="line1"
            value={formData.line1}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Address Line 1"
            required
          />
        </div>

        <div>
          <label className="block text-sm">Address Line 2</label>
          <input
            name="line2"
            value={formData.line2}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Address Line 2"
          />
        </div>

        <div>
          <label className="block text-sm">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            required
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            required
          >
            <option value="">Select State</option>
            <option value="Assam">Assam</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            required
          >
            <option value="">Select City</option>
            <option value="Guwahati">Guwahati</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Pincode *</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Enter Pincode"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || isFetching}
          className="bg-[#6F4D34] text-white px-6 py-2 rounded-3xl"
        >
          {editIndex !== null
            ? (loading ? 'Updating...' : 'Update Address')
            : (loading ? 'Adding address...' : 'Add Address')}
        </button>
      </form>
    </div>
  );
};

export default ManageAddress;