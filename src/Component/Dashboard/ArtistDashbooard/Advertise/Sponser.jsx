import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI"; 
import ProductSection from "./ProductSection";
import TargetingSection from "./TargetingSection";

function Sponser() {
  const [activeTab, setActiveTab] = useState("search");
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTargetingSection, setShowTargetingSection] = useState(false); 
  const productsPerPage = 5;

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem("userId");
      try {
        setLoading(true);
        const result = await getAPI(`/api/getproductbyartist/${userId}`, {}, true, false);
        if (result && result.data && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
          setAvailableProducts(result.data.data);
        } else {
          setProducts([]);
          setAvailableProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setAvailableProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Products</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item">Advertise</li>
              <li className="breadcrumb-item active">Products</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse"></div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <ProductSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            products={products}
            availableProducts={availableProducts}
            setAvailableProducts={setAvailableProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            loading={loading}
            showHelp={showHelp}
            setShowHelp={setShowHelp}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            productsPerPage={productsPerPage}
            BASE_URL={BASE_URL}
            setShowTargetingSection={setShowTargetingSection} 
          />
          {showTargetingSection && <TargetingSection selectedProducts={selectedProducts} />}
        </div>
      </div>
    </div>
  );
}

export default Sponser;