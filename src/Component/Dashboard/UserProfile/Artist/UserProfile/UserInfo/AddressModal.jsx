import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import postAPI from "../../../../../../api/postAPI";
import putAPI from "../../../../../../api/putAPI";
import ConfirmationDialog from "../../../../ConfirmationDialog";
import { toast } from "react-toastify";

const SetDefaultConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h4>Confirm Default Address</h4>
        <p>{message}</p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary mr-2"
            onClick={onClose}
            style={{ minWidth: "80px" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ minWidth: "80px" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressModal = ({ isOpen, onClose, userId, fetchProfile }) => {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
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

  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
      fetchDefaultAddress();
    }
  }, [isOpen, userId]);

  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
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
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch addresses.");
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
        false,
      );
      if (!response.hasError && response.data?.data) {
        setDefaultAddressId(response.data.data.addressId);
        setError("");
      } else {
        setDefaultAddressId(null);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode") {
      setPincodeStatus({
        checked: false,
        isServiceable: false,
        message: "",
        loading: false,
      });
      setLastCheckedPincode("");
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();

    if (!pincodeStatus.isServiceable) {
      setError("Please verify pincode availability first");
      return;
    }

    setLoading(true);
    try {
      const response = await postAPI(
        `/api/create-address`,
        [{ userId, ...newAddress }],
        true,
        false,
      );

      if (!response.hasError) {
        await fetchAddresses();
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
        setPincodeStatus({
          checked: false,
          isServiceable: false,
          message: "",
          loading: false,
        });
        setLastCheckedPincode("");
        toast.success("Address added successfully");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to create address");
    } finally {
      setLoading(false);
    }
  };

  const openSetDefaultDialog = (addressId) => {
    setSelectedAddressId(addressId);
    setIsSetDefaultDialogOpen(true);
  };

  const handleSetDefault = async (addressId) => {
    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-address`,
        { addressId, isDefault: true, userId },
        true,
        false,
      );
      if (!response.hasError) {
        await fetchDefaultAddress();
        await fetchProfile?.();
        toast.success("Default address updated successfully!");
        setIsSetDefaultDialogOpen(false);
        setSelectedAddressId(null);
        setError("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to set default address");
    } finally {
      setLoading(false);
    }
  };

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

  if (!isOpen) return null;

  if (!userId) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
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
          }}
        >
          ×
        </button>
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

        {!isAddingNew && !loading && addresses.length === 0 && !error && (
          <p>No addresses found for this user.</p>
        )}

        {!isAddingNew && !loading && addresses.length > 0 && (
          <div>
            {addresses.map((address) => (
              <div
                key={address._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="radio"
                  checked={defaultAddressId === address._id}
                  readOnly
                />
                <div style={{ flex: 1 }}>
                  {address.addressLine1}, {address.city}, {address.state},{" "}
                  {address.pincode}
                </div>

                {defaultAddressId !== address._id && (
                  <div>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openSetDefaultDialog(address._id)}
                      disabled={loading}
                    >
                      Set as Default
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => openDeleteDialog(address)}
                      disabled={loading}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isAddingNew && (
          <form onSubmit={handleCreateAddress}>
            <div className="form-group mb-3">
              <label>
                Address Line 1 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                className="form-control"
                value={newAddress.addressLine1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                className="form-control"
                value={newAddress.addressLine2}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                className="form-control"
                value={newAddress.landmark}
                onChange={handleInputChange}
              />
            </div>

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
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2 mx-2"
                onClick={handleCancelAdd}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !pincodeStatus.isServiceable}
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {isDeleteDialogOpen && (
          <ConfirmationDialog
            onClose={handleDeleteCancel}
            deleteType="address"
            id={selectedAddressId}
            onDeleted={handleDeleteConfirmed}
          />
        )}

        <SetDefaultConfirmationDialog
          isOpen={isSetDefaultDialogOpen}
          onClose={() => {
            setIsSetDefaultDialogOpen(false);
            setSelectedAddressId(null);
          }}
          onConfirm={() => handleSetDefault(selectedAddressId)}
          message="Are you sure you want to set this address as default for this user?"
        />
      </div>
    </div>
  );
};

export default AddressModal;
