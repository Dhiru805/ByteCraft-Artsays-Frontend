import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import { toast } from "react-toastify";

function VerificationBadges() {
  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await getAPI("/api/badges", {}, true);
        setBadges(response.data.data || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Failed to load badges");
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Verification Badges</h2>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {badges.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No badges found
                        </td>
                      </tr>
                    ) : (
                      badges.map((badge, index) => (
                        <tr key={badge._id}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${badge.badgeImage}`}
                              alt="Badge"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                          </td>
                          <td>{badge.badgeName}</td>
                          <td>{badge.badgeDescription}</td>
                          <td>₹{badge.badgePrice}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm"
                              onClick={() =>
                                navigate("/super-admin/community-cms/verification-badge/edit", {
                                  state: { badge },
                                })
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationBadges;
