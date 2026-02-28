<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import postAPI from '../../../../../api/postAPI';
import putAPI from '../../../../../api/putAPI';
import ConfirmationDialog from '../../../ConfirmationDialog';
import { toast } from 'react-toastify';

const SetDefaultConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
=======
import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import putAPI from "../../../../../api/putAPI";
import ConfirmationDialog from "../../../ConfirmationDialog";
import { toast } from "react-toastify";

const SetDefaultConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  if (!isOpen) return null;

  return (
    <div
      style={{
<<<<<<< HEAD
        position: 'fixed',
=======
        position: "fixed",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
<<<<<<< HEAD
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
=======
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        zIndex: 2000,
      }}
    >
      <div
        style={{
<<<<<<< HEAD
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
=======
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        }}
      >
        <h4>Confirm Default Address</h4>
        <p>{message}</p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary mr-2"
            onClick={onClose}
<<<<<<< HEAD
            style={{ minWidth: '80px' }}
=======
            style={{ minWidth: "80px" }}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
<<<<<<< HEAD
            style={{ minWidth: '80px' }}
=======
            style={{ minWidth: "80px" }}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD



const AddressModal = ({ isOpen, onClose,userId,fetchProfile}) => {


=======
const AddressModal = ({ isOpen, onClose, userId, fetchProfile }) => {
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
<<<<<<< HEAD
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const [isSetDefaultDialogOpen, setIsSetDefaultDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');



=======
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [pincodeStatus, setPincodeStatus] = useState({
    checked: false,
    isServiceable: false,
    message: "",
    loading: false,
  });

  const [lastCheckedPincode, setLastCheckedPincode] = useState("");
  const [error, setError] = useState("");
  const [isSetDefaultDialogOpen, setIsSetDefaultDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
      fetchDefaultAddress();
    }
  }, [isOpen, userId]);

<<<<<<< HEAD



=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
<<<<<<< HEAD
      const response = await getAPI(`/api/get-address/${userId}`, {}, true, false);
      if (!response.hasError) {
        const addressData = response.data.data || response.data;
        setAddresses(Array.isArray(addressData) ? addressData : [addressData]);
        setError('');
=======
      const response = await getAPI(
        `/api/get-address/${userId}`,
        {},
        true,
        false,
      );
      if (!response.hasError) {
        const addressData = response.data.data || response.data;
        setAddresses(Array.isArray(addressData) ? addressData : [addressData]);
        setError("");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      } else {
        setError(response.message);
      }
    } catch (err) {
<<<<<<< HEAD
      setError('Failed to fetch addresses.');
=======
      setError("Failed to fetch addresses.");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    } finally {
      setLoading(false);
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
<<<<<<< HEAD
        false
      );
      if (!response.hasError && response.data?.data) {
        setDefaultAddressId(response.data.data.addressId);
        setError('');
      } else {
        setDefaultAddressId(null);
        setError(response.message || 'No default address found for this user.');
      }
    } catch (err) {
      setError('Failed to fetch default address.');
=======
        false,
      );
      if (!response.hasError && response.data?.data) {
        setDefaultAddressId(response.data.data.addressId);
        setError("");
      } else {
        setDefaultAddressId(null);
      }
    } catch (err) {
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD


=======
  const checkPincodeAvailability = async () => {
    const pin = newAddress.pincode.trim();

    if (!pin || !/^\d{6}$/.test(pin)) {
      setPincodeStatus({
        checked: true,
        isServiceable: false,
        message: "Please enter valid 6-digit pincode",
        loading: false,
      });
      return;
    }

    if (pin === lastCheckedPincode && pincodeStatus.checked) return;

    setPincodeStatus((prev) => ({ ...prev, loading: true }));

    try {
      const response = await getAPI(
        `/api/check-pincode/${pin}`,
        {},
        true,
        false,
      );

      if (response.hasError) {
        throw new Error(response.message);
      }

      const { isServiceable, city, state, country } = response.data.data;

      setPincodeStatus({
        checked: true,
        isServiceable,
        message: isServiceable
          ? "Service available ✓"
          : "Delivery not available ✗",
        loading: false,
      });

      setLastCheckedPincode(pin);

      if (isServiceable && city && state && country) {
        setNewAddress((prev) => ({
          ...prev,
          city: prev.city || city,
          state: prev.state || state,
          country: prev.country || country,
        }));
      }
    } catch (err) {
      setPincodeStatus({
        checked: true,
        isServiceable: false,
        message: "Could not verify pincode",
        loading: false,
      });
    }
  };
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
<<<<<<< HEAD
=======

    if (name === "pincode") {
      setPincodeStatus({
        checked: false,
        isServiceable: false,
        message: "",
        loading: false,
      });
      setLastCheckedPincode("");
    }
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
=======

    if (!pincodeStatus.isServiceable) {
      setError("Please verify pincode availability first");
      return;
    }

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    setLoading(true);
    try {
      const response = await postAPI(
        `/api/create-address`,
        [{ userId, ...newAddress }],
        true,
<<<<<<< HEAD
        false
      );
=======
        false,
      );

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      if (!response.hasError) {
        await fetchAddresses();
        setIsAddingNew(false);
        setNewAddress({
<<<<<<< HEAD
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
        });
        setError('');
=======
          addressLine1: "",
          addressLine2: "",
          landmark: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        });
        setPincodeStatus({
          checked: false,
          isServiceable: false,
          message: "",
          loading: false,
        });
        setLastCheckedPincode("");
        toast.success("Address added successfully");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      } else {
        setError(response.message);
      }
    } catch (err) {
<<<<<<< HEAD
      setError('Failed to create address.');
=======
      setError("Failed to create address");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const openSetDefaultDialog = (addressId) => {
    setSelectedAddressId(addressId);
    setIsSetDefaultDialogOpen(true);
  };

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const handleSetDefault = async (addressId) => {
    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-address`,
        { addressId, isDefault: true, userId },
        true,
<<<<<<< HEAD
        false
      );
      if (!response.hasError) {
        await fetchDefaultAddress();
        await fetchProfile();
        toast.success("Default address updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
        setIsSetDefaultDialogOpen(false);
        setSelectedAddressId(null);
        onClose();
        setError('');
=======
        false,
      );
      if (!response.hasError) {
        await fetchDefaultAddress();
        await fetchProfile?.();
        toast.success("Default address updated successfully!");
        setIsSetDefaultDialogOpen(false);
        setSelectedAddressId(null);
        setError("");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
      } else {
        setError(response.message);
      }
    } catch (err) {
<<<<<<< HEAD
      setError('Failed to set default address.');
=======
      setError("Failed to set default address");
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD



=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const openDeleteDialog = (address) => {
    setSelectedAddressId(address._id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAddressId(null);
  };

  const handleDeleteConfirmed = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedAddressId(null);
  };

<<<<<<< HEAD



  const openSetDefaultDialog = (addressId) => {
    setSelectedAddressId(addressId);
    setIsSetDefaultDialogOpen(true);
  };

  const handleSetDefaultCancel = () => {
    setIsSetDefaultDialogOpen(false);
    setSelectedAddressId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewAddress({
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    });
    setError('');
  };




=======
  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewAddress({
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setError("");
  };

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  if (!isOpen) return null;

  if (!userId) {
    return (
      <div
        style={{
<<<<<<< HEAD
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
=======
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          zIndex: 1000,
        }}
      >
        <div
          style={{
<<<<<<< HEAD
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center',
=======
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          }}
        >
          <p>Please log in to manage addresses.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD



  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
=======
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        zIndex: 1000,
      }}
    >
      <div
        style={{
<<<<<<< HEAD
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        { }
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
=======
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          }}
        >
          ×
        </button>
<<<<<<< HEAD

        <h2>Addresses</h2>

        <button
          onClick={() => setIsAddingNew(true)}
          className="btn btn-primary mb-3"
          disabled={loading}
        >
          + Add New Address
        </button>

        { }
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        { }
        {loading && <div>Loading...</div>}

        { }
=======
        {!isAddingNew && <h2>Addresses</h2>}
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn btn-primary mb-3"
            disabled={loading}
          >
            + Add New Address
          </button>
        )}
        {isAddingNew && <h3 className="mb-3">Add New Address</h3>}

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && <div>Loading...</div>}

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        {!isAddingNew && !loading && addresses.length === 0 && !error && (
          <p>No addresses found for this user.</p>
        )}

<<<<<<< HEAD
        { }
=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        {!isAddingNew && !loading && addresses.length > 0 && (
          <div>
            {addresses.map((address) => (
              <div
                key={address._id}
                style={{
<<<<<<< HEAD
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={`${address.addressLine1}, ${address.addressLine2 || ''}, ${address.landmark || ''
                  }, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`}
=======
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
              >
                <input
                  type="radio"
                  checked={defaultAddressId === address._id}
                  readOnly
<<<<<<< HEAD
                  style={{ marginRight: '10px' }}
                />
                <span style={{ flex: 1 }}>
                  {address.addressLine1}, {address.city}, {address.state},{' '}
                  {address.country}, {address.pincode}
                </span>
=======
                />
                <div style={{ flex: 1 }}>
                  {address.addressLine1}, {address.city}, {address.state},{" "}
                  {address.pincode}
                </div>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

                {defaultAddressId !== address._id && (
                  <div>
                    <button
<<<<<<< HEAD
                      className="btn btn-sm btn-outline-primary mx-2"
=======
                      className="btn btn-sm btn-outline-primary me-2"
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                      onClick={() => openSetDefaultDialog(address._id)}
                      disabled={loading}
                    >
                      Set as Default
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => openDeleteDialog(address)}
                      disabled={loading}
<<<<<<< HEAD
                      title="Delete Address"
                    >
                      <i className="fa fa-trash-o"></i>
=======
                    >
                      <i className="fa fa-trash"></i>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

<<<<<<< HEAD
        { }
        {isAddingNew && (
          <form onSubmit={handleCreateAddress}>
            <div className="form-group">
              <label>Address Line 1 *</label>
=======
        {isAddingNew && (
          <form onSubmit={handleCreateAddress}>
            <div className="form-group mb-3">
              <label>
                Address Line 1 <span style={{ color: "red" }}>*</span>
              </label>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
              <input
                type="text"
                name="addressLine1"
                className="form-control"
                value={newAddress.addressLine1}
                onChange={handleInputChange}
                required
<<<<<<< HEAD
                
              />
            </div>

            <div className="form-group">
=======
              />
            </div>

            <div className="form-group mb-3">
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
              <label>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                className="form-control"
                value={newAddress.addressLine2}
                onChange={handleInputChange}
              />
            </div>

<<<<<<< HEAD
            <div className="form-group">
=======
            <div className="form-group mb-3">
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                className="form-control"
                value={newAddress.landmark}
                onChange={handleInputChange}
              />
            </div>

<<<<<<< HEAD
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={newAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={newAddress.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                className="form-control"
                value={newAddress.pincode}
                onChange={handleInputChange}
                required
                pattern="\d{6}"
                title="Pincode must be a 6-digit number"
              />
=======
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>
                  City <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>
                  State <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>
                  Country <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  className="form-control"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>
                  Pincode <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="pincode"
                    className="form-control mx-2"
                    value={newAddress.pincode}
                    onChange={handleInputChange}
                    required
                    pattern="\d{6}"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={checkPincodeAvailability}
                    disabled={pincodeStatus.loading}
                  >
                    {pincodeStatus.loading
                      ? "Checking..."
                      : "Check Availability"}
                  </button>
                </div>
                {pincodeStatus.checked && (
                  <small
                    className={
                      pincodeStatus.isServiceable
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {pincodeStatus.message}
                  </small>
                )}
              </div>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
<<<<<<< HEAD
                className="btn btn-secondary mr-2"
=======
                className="btn btn-secondary me-2 mx-2"
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                onClick={handleCancelAdd}
                disabled={loading}
              >
                Cancel
              </button>
<<<<<<< HEAD
              <button type="submit" className="btn btn-primary" disabled={loading}>
=======
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !pincodeStatus.isServiceable}
              >
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                Save Address
              </button>
            </div>
          </form>
        )}

<<<<<<< HEAD
        { }
=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        {isDeleteDialogOpen && (
          <ConfirmationDialog
            onClose={handleDeleteCancel}
            deleteType="address"
            id={selectedAddressId}
            onDeleted={handleDeleteConfirmed}
          />
        )}

<<<<<<< HEAD
        { }
        <SetDefaultConfirmationDialog
          isOpen={isSetDefaultDialogOpen}
          onClose={handleSetDefaultCancel}
=======
        <SetDefaultConfirmationDialog
          isOpen={isSetDefaultDialogOpen}
          onClose={() => {
            setIsSetDefaultDialogOpen(false);
            setSelectedAddressId(null);
          }}
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
          onConfirm={() => handleSetDefault(selectedAddressId)}
          message="Are you sure you want to set this address as default for this user?"
        />
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AddressModal;
=======
export default AddressModal;
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
