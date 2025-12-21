import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import TokenStandardTable from "./TokenStandardTable";
import CreateTokenStandardModal from "./CreateTokenStandard";
import { useNavigate } from "react-router-dom";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const TokenStandard = () => {
  const [tokenStandards, setTokenStandards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchTokenStandards = async () => {
    try {
      const response = await getAPI("/api/gettokenstandards");
      setTokenStandards(response.data);
    } catch (error) {
      console.error("Error fetching token standards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenStandards();
  }, []);

  if(loading) return <ProductRequestSkeleton/>
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Token Standard</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Token Standard</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TokenStandardTable
        setTokenStandards={setTokenStandards}
        tokenStandards={tokenStandards}
        refreshTokenStandards={fetchTokenStandards}
      />
      {showModal && (
        <CreateTokenStandardModal
          onClose={() => setShowModal(false)}
          refreshTokenStandards={fetchTokenStandards}
        />
      )}
    </div>
  );
};

export default TokenStandard;
