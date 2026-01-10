import React, { useState, useEffect } from "react";
import putAPI from "../../../../../../../api/putAPI";
import getAPI from "../../../../../../../api/getAPI";
import { toast } from "react-toastify";
import ConfirmationDialog from "./ConfirmationDialog";
import postAPI from "../../../../../../../api/postAPI";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

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

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countryOptions.find(
        (c) => c.label === formData.country || c.value === formData.country
      );
      if (selectedCountry) {
        const states = State.getStatesOfCountry(selectedCountry.value).map(
          (s) => ({
            value: s.isoCode,
            label: s.name,
          })
        );
        setStateOptions(states);
      }
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [formData.country, countryOptions]);

  useEffect(() => {
    if (formData.state && formData.country) {
      const selectedCountry = countryOptions.find(
        (c) => c.label === formData.country || c.value === formData.country
      );
      const selectedState = stateOptions.find(
        (s) => s.label === formData.state || s.value === formData.state
      );
      if (selectedCountry && selectedState) {
        const cities = City.getCitiesOfState(
          selectedCountry.value,
          selectedState.value
        ).map((c) => ({
          value: c.name,
          label: c.name,
        }));
        setCityOptions(cities);
      }
    } else {
      setCityOptions([]);
    }
  }, [formData.state, formData.country, countryOptions, stateOptions]);

  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitType, setSubmitType] = useState("Submit");
  const userId = localStorage.getItem("userId");

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      borderWidth: "2px",
      borderColor: "rgb(229, 231, 235)",
      padding: "2px 4px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgb(209, 213, 219)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6F4D34"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "black",
      "&:active": {
        backgroundColor: "#6F4D34",
      },
    }),
  };

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
    if (!isFetching && !loading && addresses.length > 0) {
      const isCurrentDefaultValid = addresses.some(addr => addr._id === selectedAddressId);
      if (!selectedAddressId || !isCurrentDefaultValid) {
        handleSelectAddress(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddressId, isFetching, loading]);

    useEffect(() => {
      fetchAddresses();
      fetchDefaultAddress();
    }, [userId]);


  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: selectedOption ? selectedOption.label : "" };
      if (name === "country") {
        newData.state = "";
        newData.city = "";
      } else if (name === "state") {
        newData.city = "";
      }
      return newData;
    });
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!formData.country || !formData.state || !formData.city) {
      toast.error("Please select country, state and city");
      return;
    }

    if (!isValidPhone(formData.phone)) {
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
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }
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

        const responsePut = await putAPI(
          `/auth/users/${userId}`,
          { selectedAddress: addressId },
          { "Content-Type": "application/json" }
        );

        if (!responsePut.hasError) {
          setSelectedAddressId(addressId);
        }
      }
    } catch (err) {
      console.error(err);
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
            <div key={addr._id}>
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
                    {selectedAddressId !== addr._id && (
                      <button
                        onClick={() => handleSelectAddress(addr._id)}
                        className="text-[#6F3E2D] hover:text-green-700"
                        disabled={loading}
                      >
                        Make Default
                      </button>
                    )}
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

              {addresses.length > 1 && index < addresses.length - 1 && <hr className="border-t border-gray-300 my-2" />}
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
            <input name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full border-2 px-3 py-2 rounded-xl" placeholder="Land Mark" />
          </div>
          <div>
            <label className="block text-sm mb-1">Country *</label>
            <Select
              options={countryOptions}
              value={countryOptions.find((c) => c.label === formData.country)}
              onChange={(val) => handleSelectChange("country", val)}
              placeholder="Select Country"
              styles={customSelectStyles}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">State *</label>
            <Select
              options={stateOptions}
              value={stateOptions.find((s) => s.label === formData.state)}
              onChange={(val) => handleSelectChange("state", val)}
              placeholder="Select State"
              styles={customSelectStyles}
              isDisabled={!formData.country}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">City *</label>
            <Select
              options={cityOptions}
              value={cityOptions.find((c) => c.label === formData.city)}
              onChange={(val) => handleSelectChange("city", val)}
              placeholder="Select City"
              styles={customSelectStyles}
              isDisabled={!formData.state}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Pincode *</label>
            <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border-2 px-3 py-2 rounded-xl" placeholder="Enter Pincode" required />
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
