import React, { useState } from 'react';

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: ''
  });

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

    setAddresses([...addresses, formData]);
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      country: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    });
  };

  const handleDelete = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Address</h2>

      {/* Address List */}
      {addresses.length > 0 && (
        <div className="border rounded p-4 space-y-4">
          {addresses.map((addr, index) => (
            <div key={index} className="border rounded p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">{addr.city}, {addr.state}</p>
                <p className="text-sm text-gray-500">{addr.street}, {addr.zip}</p>
              </div>
              <div className="space-x-2 text-sm text-right">
                <button className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(index)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      <form onSubmit={handleAddAddress} className="space-y-4">
        <h3 className="text-lg font-semibold">Add New Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="First Name *"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Last Name *"
          />
        </div>
        <input
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Company Name (Optional)"
        />

        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Country *</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="Germany">Germany</option>
        </select>

        <input
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Street Address *"
        />

        <select
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select City *</option>
          <option value="Guwahati">Guwahati</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>

        <select
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select State *</option>
          <option value="Assam">Assam</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
        </select>

        <input
          name="zip"
          value={formData.zip}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Enter Zip Code"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Enter Phone Number"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Enter Email Address"
        />
        <button type="submit" className="bg-[#5F3E2D] text-white px-6 py-2 rounded">
          Add Address
        </button>
      </form>
    </div>
  );
};

export default ManageAddress;
