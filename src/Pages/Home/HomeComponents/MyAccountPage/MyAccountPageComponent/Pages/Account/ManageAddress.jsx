import React, { useState } from 'react';

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    state: '',
    city: '',
    street: '',
    zip: '',
    phone: '',
    email: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.street) {
      alert('Please fill in required fields');
      return;
    }

    if (editIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editIndex] = formData;
      setAddresses(updatedAddresses);
      setEditIndex(null);
    } else {
      setAddresses([...addresses, formData]);
    }

    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      country: '',
      state: '',
      city: '',
      street: '',
      zip: '',
      phone: '',
      email: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  return (
    <div className="w-[856px]">

      {/* Address List */}
      {addresses.length > 0 && (
        <div>
          <h2 className="text-xl text-gray-950 font-semibold ">Manage Address</h2>

          <div className="border-2 border-[#6F3E2D] rounded-[50px] p-4 my-4 space-y-4">
            {addresses.map((addr, index) => (
              <div key={index}>
                <div className="px-4 py-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-gray-900">{addr.city}, {addr.state}</p>
                    <p className="text-sm text-gray-600">{addr.street}, {addr.zip}</p>
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
                {/* Conditionally render <hr /> after each item except the last one */}
                {addresses.length > 1 && index < addresses.length - 1 && (
                  <hr className="border-t border-gray-300 m-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Add/Edit Address Form */}
      <form onSubmit={handleAddAddress} className="space-y-4">
        <h3 className="text-xl text-gray-950 pb-2 font-semibold">{editIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm">Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Company Name (Optional)</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Company Name"
          />
        </div>
        <div>
          <label className="block text-sm">Address Line 1 *</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Street Address"
          />
        </div>
        <div>
          <label className="block text-sm">Address Line 2 *</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Street Address"
          />
        </div>


        <div>
          <label className="block text-sm">Landmark *</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Street Address"
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
          <label className="block text-sm">Zip Code</label>
          <input
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Enter Zip Code"
          />
        </div>

        <div>
          <label className="block text-sm">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="+91 93656 00000"
          />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-2 rounded-xl"
            placeholder="Enter Email Address"
          />
        </div>

        <button type="submit" className="bg-[#6F4D34] text-white px-6 py-2 rounded-3xl">
          {editIndex !== null ? 'Update Address' : 'Add Address'}
        </button>
      </form>

    </div>
  );
};

export default ManageAddress;
