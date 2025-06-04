import React, { useState, useEffect } from 'react';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';
import { toast } from 'react-toastify';

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    // email: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const userId = localStorage.getItem('userId');

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddAddress = async (e) => {
  e.preventDefault();

  if (!formData.line1 || !formData.city || !formData.state || !formData.pincode) {
    alert('Please fill in required fields');
    return;
  }

  try {
    const responseGet = await getAPI(`/auth/userid/${userId}`);
    if (!responseGet.data?.user) {
      toast.error('Failed to fetch user data');
      return;
    }

    const user = responseGet.data.user;
    const updatedAddressArray = [...(user.address || [])];

    if (editIndex !== null) {
      updatedAddressArray[editIndex] = formData;
    } else {
      updatedAddressArray.push(formData);
    }

    const updatedUser = {
      ...user,
      address: updatedAddressArray
    };

    const response = await putAPI(`/auth/users/${userId}`, updatedUser, {
      'Content-Type': 'application/json', 
    });

    if (response.hasError) {
      toast.error(response.message || 'Failed to update address');
      return;
    } else {
      toast.success(response.message || 'Address updated successfully');
    }

    // Update local state
    setAddresses(updatedAddressArray);
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
    console.error(error);
  }
};


useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const response = await getAPI(`/auth/userid/${userId}`);
      if (response.data?.user?.address) {
        setAddresses(response.data.user.address);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
      console.error(error);
    }
  };

  fetchAddresses();
}, [userId]);


  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditIndex(index);
  };


  const handleDelete = async (index) => {
  try {
    const responseGet = await getAPI(`/auth/userid/${userId}`);
    if (!responseGet.data?.user) {
      toast.error('Failed to fetch user data');
      return;
    }

    const user = responseGet.data.user;
    const currentAddresses = user.address || [];

    const updatedAddresses = [...currentAddresses];
    updatedAddresses.splice(index, 1);

    const updatedUser = {
      ...user,
      address: updatedAddresses
    };

    const responsePut = await putAPI(`/auth/users/${userId}`, updatedUser, {
      'Content-Type': 'multipart/form-data',
    });

    if (responsePut.hasError) {
      toast.error(responsePut.message || 'Failed to delete address');
      return;
    }

    toast.success(responsePut.message || 'Address deleted successfully');
    toast.success('Address deleted successfully');
    setAddresses(updatedAddresses);

  } catch (error) {
    toast.error('Server error while deleting address');
    console.error(error);
  }
};


  return (
    <div className="w-[856px]">
      {addresses.length > 0 && (
        <div>
          <h2 className="text-xl text-gray-950 font-semibold">Manage Address</h2>

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
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {addresses.length > 1 && index < addresses.length - 1 && (
                  <hr className="border-t border-gray-300 m-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleAddAddress} className="space-y-4">
        <h3 className="text-xl text-gray-950 pb-2 font-semibold">{editIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>



        <div>
          <label className="block text-sm">Address Line 1 *</label>
          <input
            name="line1"
            value={formData.line1}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Address Line 1"
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
          >
            <option value="">Select City</option>
            <option value="Guwahati">Guwahati</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>


        <div>
          <label className="block text-sm">Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Enter Pincode"
          />
        </div>



        {/* <div>
          <label className="block text-sm">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Enter Email Address"
          />
        </div> */}

        <button type="submit" className="bg-[#6F4D34] text-white px-6 py-2 rounded-3xl">
          {editIndex !== null ? 'Update Address' : 'Add Address'}
        </button>
      </form>
    </div>
  );
};

export default ManageAddress;
