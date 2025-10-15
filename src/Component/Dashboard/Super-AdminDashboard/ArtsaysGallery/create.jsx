import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import postAPI from "../../../../api/postAPI";
import getAPI from "../../../../api/getAPI";

function CreateCuration() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState(""); // Seller or Artist
  const [userOptions, setUserOptions] = useState([]); // Dropdown list (artists/sellers)
  const [selectedUser, setSelectedUser] = useState(null);
  const [curator, setCurator] = useState("");

  const fetchUsers = async (type) => {
    try {
      const response = await getAPI(`/api/users-by-type?userType=${type}`);
      if (response?.hasError === false) {
        const options = response.data.data.map((user) => ({
          value: user._id,
          label: `${user.name} ${user.lastName || ""}`,
          name: `${user.name} ${user.lastName || ""}`,
        }));
        setUserOptions(options);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userType) {
      fetchUsers(userType);
      setSelectedUser(null);
    }
  }, [userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType || !selectedUser || !curator) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const payload = {
        type: userType,
        userId: selectedUser.value,
        userName: selectedUser.name,
        curator,
      };

      const response = await postAPI("/api/artsays-gallery/create", payload);

      if (response?.hasError === false) {
        toast.success(response?.message || "Curation Created Successfully!");
        setUserType("");
        setSelectedUser(null);
        setCurator("");
        navigate("/super-admin/artsays-gallery");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating curation.");
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Curation</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link
                  to="/super-admin/curations"
                  className="text-decoration-none"
                >
                  Curations
                </Link>
              </li>
              <li className="breadcrumb-item">Create Curation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                {/* Select User Type */}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Select Type</label>
                    <Select
                      options={[
                        { value: "Artist", label: "Artist" },
                        { value: "Seller", label: "Seller" },
                      ]}
                      value={
                        userType
                          ? { value: userType, label: userType }
                          : null
                      }
                      onChange={(option) =>
                        setUserType(option ? option.value : "")
                      }
                      placeholder="Select Seller or Artist"
                      isClearable
                      required
                    />
                  </div>
                </div>

                {/* Conditional dropdown (Artist/Seller Names) */}
                {userType && (
                  <div className="row mt-3">
                    <div className="col-md-6 form-group">
                      <label>
                        {userType === "Artist"
                          ? "Select Artist"
                          : "Select Seller"}
                      </label>
                      <Select
                        options={userOptions}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        placeholder={`Choose ${userType}`}
                        isClearable
                        isSearchable
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Curator Field */}
                {userType && (
                  <div className="row mt-3">
                    <div className="col-md-6 form-group">
                      <label>Curator</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Curator Name"
                        value={curator}
                        onChange={(e) => setCurator(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {userType && (
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success">
                      Create Curation
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCuration;
