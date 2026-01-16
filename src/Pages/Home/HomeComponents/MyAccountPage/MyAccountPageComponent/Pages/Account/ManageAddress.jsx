import React, { useState, useEffect, useRef } from "react";
import putAPI from "../../../../../../../api/putAPI";
import getAPI from "../../../../../../../api/getAPI";
import { toast } from "react-toastify";
import ConfirmationDialog from "./ConfirmationDialog";
import postAPI from "../../../../../../../api/postAPI";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

    const ManageAddress = () => {
      const formRef = useRef(null);
      const [addresses, setAddresses] = useState([]);
      const [showForm, setShowForm] = useState(false);
  
      const scrollToForm = () => {
        setShowForm(true);
      };

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
        const sortedAddresses = [...response.data.data].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setAddresses(sortedAddresses);
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
              setShowForm(false);
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
              setShowForm(false);
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
      setShowForm(true);
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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          {showForm ? (
            <button 
              onClick={() => {
                setShowForm(false);
                setSubmitType("Submit");
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
              }}
              className="group flex items-center gap-2 text-gray-500 hover:text-[#5C4033] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#5C4033]/10 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              {submitType !== "Submit" ? "Edit Address" : "Add New Address"}
            </button>
          ) : (
            <>
              Manage Address
              {addresses.length > 0 && (
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
                </span>
              )}
            </>
          )}
        </h1>
        {!showForm && (
          <button 
            onClick={scrollToForm}
            className="flex items-center gap-2 bg-[#5C4033] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#4b3327] transition-all active:scale-95 shadow-lg shadow-[#5C4033]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>
        )}
      </div>

      {isFetching && (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      )}

      {!isFetching && fetchError && (
        <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-200 text-rose-600 text-center">
          {fetchError}
        </div>
      )}

      {!showForm && (
        <>
          {!isFetching && !fetchError && addresses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-300 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No addresses found</h3>
              <p className="text-gray-500 text-center max-w-xs">Add a new address to get started.</p>
            </div>
          )}

          {!isFetching && addresses.length > 0 && (
            <div className="space-y-4 mb-8">
              {addresses.map((addr, index) => (
                <div 
                  key={addr._id}
                  className={`group relative bg-white rounded-[2rem] p-6 border transition-all duration-500 ${
                    selectedAddressId === addr._id 
                      ? 'border-emerald-300 shadow-xl shadow-emerald-50/50 ring-2 ring-emerald-100' 
                      : 'border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50'
                  }`}
                >
                  {selectedAddressId === addr._id && (
                    <div className="absolute -top-3 left-6 z-10 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-lg shadow-emerald-200 ring-4 ring-white">
                      Default
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900">
                            {addr.city}, {addr.state}
                          </p>
                          <p className="text-sm text-gray-500">{addr.country} - {addr.pincode}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 pl-[52px]">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}{addr.landmark ? `, ${addr.landmark}` : ''}
                      </p>
                      <p className="text-sm text-gray-500 pl-[52px] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {addr.phone}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-90"
                        disabled={loading}
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItemToDelete(addr._id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-90"
                        disabled={loading}
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {selectedAddressId !== addr._id && (
                        <button
                          onClick={() => handleSelectAddress(addr._id)}
                          className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm font-semibold transition-all duration-300 active:scale-95"
                          disabled={loading}
                        >
                          Set Default
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
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <div ref={formRef} className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <form onSubmit={handleAddAddress} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 *</label>
                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="Enter your street address"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                <input 
                  name="landmark" 
                  value={formData.landmark} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none" 
                  placeholder="Near landmark" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find((c) => c.label === formData.country)}
                  onChange={(val) => handleSelectChange("country", val)}
                  placeholder="Select Country"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: "1rem",
                      borderWidth: "1px",
                      borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                      padding: "6px 4px",
                      boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                      backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                      "&:hover": { borderColor: "#5C4033" },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                      color: state.isSelected ? "white" : "black",
                      borderRadius: "0.5rem",
                      margin: "2px 4px",
                      width: "calc(100% - 8px)",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }),
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <Select
                  options={stateOptions}
                  value={stateOptions.find((s) => s.label === formData.state)}
                  onChange={(val) => handleSelectChange("state", val)}
                  placeholder="Select State"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: "1rem",
                      borderWidth: "1px",
                      borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                      padding: "6px 4px",
                      boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                      backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                      "&:hover": { borderColor: "#5C4033" },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                      color: state.isSelected ? "white" : "black",
                      borderRadius: "0.5rem",
                      margin: "2px 4px",
                      width: "calc(100% - 8px)",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }),
                  }}
                  isDisabled={!formData.country}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find((c) => c.label === formData.city)}
                  onChange={(val) => handleSelectChange("city", val)}
                  placeholder="Select City"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: "1rem",
                      borderWidth: "1px",
                      borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                      padding: "6px 4px",
                      boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                      backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                      "&:hover": { borderColor: "#5C4033" },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                      color: state.isSelected ? "white" : "black",
                      borderRadius: "0.5rem",
                      margin: "2px 4px",
                      width: "calc(100% - 8px)",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }),
                  }}
                  isDisabled={!formData.state}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                <input 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none" 
                  placeholder="Enter Pincode" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || isFetching}
                className="flex-1 group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {submitType !== "Submit"
                  ? loading
                    ? "Updating..."
                    : "Update Address"
                  : loading
                  ? "Adding address..."
                  : "Add Address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSubmitType("Submit");
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
                }}
                className="py-4 px-8 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageAddress;
