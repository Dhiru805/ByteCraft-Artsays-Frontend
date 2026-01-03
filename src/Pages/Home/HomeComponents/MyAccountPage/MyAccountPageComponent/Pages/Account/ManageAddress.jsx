import React, { useState, useEffect } from "react";
import putAPI from "../../../../../../../api/putAPI";
import getAPI from "../../../../../../../api/getAPI";
import { toast } from "react-toastify";
import ConfirmationDialog from "./ConfirmationDialog";
import postAPI from "../../../../../../../api/postAPI";
const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitType, setSubmitType] = useState("Submit");
  const userId = localStorage.getItem("userId");

  const fetchAddresses = async () => {
    if (!userId) {
      setFetchError("User not logged in. Please log in to view addresses.");
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      setFetchError(null);
      const response = await getAPI(
        `/api/get-address/${userId}`,
        {},
        true,
        false
      );

      if (response.data?.data && Array.isArray(response.data.data)) {
        setAddresses(response.data.data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      setFetchError("Failed to load addresses. Please try again later.");
      toast.error("Failed to load addresses");
      console.error("Error fetching addresses:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchDefaultAddress = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await getAPI(
        `/api/get-default-address/${userId}`,
        {},
        true,
        false
      );
      if (!response.hasError && response.data?.data) {
        setSelectedAddressId(response.data.data.addressId);
      } else {
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.log("Failed to fetch default address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchDefaultAddress();
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!isValidPhone(formData.phone)){
      toast.error("enter valid number")
      return
    }
      if (submitType !== "Submit") {
        setLoading(true);
        try {
          const response = await putAPI(`/api/update-buyerAddress`, {
            userId,
            ...formData,
          });

          if (!response.hasError) {
            toast.success("Address updated successfully");
            await fetchAddresses();
            setFormData({
              addressLine1: "",
              addressLine2: "",
              landmark: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              phone: "",
            });
            setSubmitType("Submit");
          }
        } catch (err) {
          toast.error("Failed to update address.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          const response = await postAPI(
            `/api/create-address`,
            { userId, ...formData },
            true,
            false
          );

          if (!response.hasError) {
            toast.success("Address created successfully");
            await fetchAddresses();
            setFormData({
              addressLine1: "",
              addressLine2: "",
              landmark: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              phone: "",
            });
          }
        } catch (err) {
          toast.error("Failed to create address.");
        } finally {
          setLoading(false);
        }
      }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setSubmitType("Update");
    // setEditIndex(index);
  };

  const handleDeleteConfirmed = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedAddressId(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItemToDelete(null);
  };

  const handleSelectAddress = async (addressId) => {
    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-address`,
        { addressId, isDefault: true, userId },
        true,
        false
      );
      if (!response.hasError) {
        await fetchDefaultAddress();
        await fetchAddresses();
        toast.success("Default address updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Failed to set default address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl text-gray-950 font-semibold">Manage Address</h2>

      {isFetching && (
        <div className="text-gray-600 py-4">Loading addresses...</div>
      )}

      {!isFetching && fetchError && (
        <div className="text-red-500 py-4">{fetchError}</div>
      )}

      {!isFetching && !fetchError && addresses.length === 0 && (
        <div className="text-gray-600 py-4">
          No addresses found. Add a new address below.
        </div>
      )}

      {!isFetching && addresses.length > 0 && (
        <div
          className={`border-[0.6px] border-[#6F3E2D] p-4 my-4 ${
            addresses.length > 2 ? "rounded-[60px]" : "rounded-2xl"
          }`}
        >
          {addresses.map((addr, index) => (
            <div key={index}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {addr.city}, {addr.state}, {addr.country},{addr.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.addressLine1}, {addr.addressLine2}, {addr.landmark},{" "}
                    {addr.pincode}
                  </p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-[#6F3E2D] hover:text-red-900"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItemToDelete(addr._id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`hover:text-green-700 ${
                      selectedAddressId === addr._id
                        ? "px-2 py-1 rounded-lg text-white bg-green-600 font-semibold"
                        : "text-[#6F3E2D]"
                    }`}
                    disabled={loading}
                  >
                    {selectedAddressId === addr._id
                      ? "Default"
                      : "Make Default"}
                  </button>
                </div>
              </div>

              {isDeleteDialogOpen && selectedItemToDelete === addr._id && (
                <ConfirmationDialog
                  onClose={handleDeleteCancel}
                  deleteType="buyeraddress"
                  id={addr._id}
                  onDeleted={handleDeleteConfirmed}
                />
              )}

              {addresses.length > 1 && index < addresses.length - 1 && (
                <hr className="border-t border-gray-300 my-2" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Form */}
      <form onSubmit={handleAddAddress} className="space-y-4">
        <h3 className="text-xl text-gray-950 pb-2 font-semibold">
          {submitType !== "Submit" ? "Edit Address" : "Add New Address"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm">Address Line 1 *</label>
            <input
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="Address Line 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Address Line 2 *</label>
            <input
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="Address Line 2"
            />
          </div>

          <div>
            <label className="block text-sm">Land Mark</label>
            <input
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="Land Mark"
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
          <div>
            <label className="block text-sm">Phonw Number *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-2 rounded-xl"
              placeholder="Enter Phone Number"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isFetching}
          className="bg-[#6F4D34] text-white px-6 py-2 rounded-3xl"
        >
          {submitType !== "Submit"
            ? loading
              ? "Updating..."
              : "Update Address"
            : loading
            ? "Adding address..."
            : "Add Address"}
        </button>
      </form>
    </div>
  );
};

export default ManageAddress;
