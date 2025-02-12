import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../ConfirmationDialog";
import useUserType from "../../urlconfig";

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductRequestToDelete, setSelectedProductRequestToDelete] = useState(null);
  const navigate = useNavigate();
  const userType = useUserType();
  const [imageIndices, setImageIndices] = useState({});

  const fetchProduct = async () => {
    try {
      const result = await getAPI("http://localhost:3001/api/getstatusapprovedproduct", {}, true, false);
      if (result.data && result.data.data) {
        setProducts(result.data.data);
        // Initialize image indices for each product
        setImageIndices(
          result.data.data.reduce((acc, product) => {
            acc[product._id] = 0;
            return acc;
          }, {})
        );
      } else {
        console.error("Unexpected API response:", result);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleNextImage = (productId, images) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [productId]: (prevIndices[productId] + 1) % images.length,
    }));
  };

  const handlePrevImage = (productId, images) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [productId]: (prevIndices[productId] - 1 + images.length) % images.length,
    }));
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductRequestToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    setProducts(products.filter((p) => p._id !== selectedProductRequestToDelete._id));
    setIsDeleteDialogOpen(false);
    navigate(`/${userType}/Dashboard/artistproductrequest`);
  };

  const openDeleteDialog = (productRequest) => {
    setSelectedProductRequestToDelete(productRequest);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container-fluid">
       <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2> Artist Products</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Artist Products </li>
                        </ul>
                    </div>
                </div>
            </div>

      <div className="row">
        {products.map((product) => {
          const images = [product.mainImage, ...(product.otherImages || [])];
          const currentIndex = imageIndices[product._id] || 0;

          return (
            <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card p-3 text-center shadow-lg">
                <div className="image-carousel d-flex align-items-center justify-content-center">
                  <button className="btn btn-light mx-2" onClick={() => handlePrevImage(product._id, images)}>
                    &lt;
                  </button>
                  <img
                    src={images[currentIndex]}
                    alt="Product"
                    width="250"
                    height="250"
                    className="rounded shadow"
                  />
                  <button className="btn btn-light mx-2" onClick={() => handleNextImage(product._id, images)}>
                    &gt;
                  </button>
                </div>
                <h3 className="fw-semibold text-primary mt-3">{product.productName}</h3>
                <h5 className="text-secondary">Artist: {product.userId.name} {product.userId.lastName}</h5>
                <div className="mt-3">
                  <button className="btn btn-outline-dark ms-2">Edit</button>
                  <button className="btn btn-outline-danger mx-2" onClick={() => openDeleteDialog(product)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="productRequest"
          id={selectedProductRequestToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

export default ProductDetails;
