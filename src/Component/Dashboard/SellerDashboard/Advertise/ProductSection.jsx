<<<<<<< HEAD
import { useEffect, useState, useRef } from "react"

const HelpPopover = ({ onClose }) => (
  <div
    className="position-absolute bg-white border rounded shadow-lg p-3"
    style={{
      top: "40px",
      right: "0",
      zIndex: 1000,
      width: "300px",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h6 className="mb-0">Product Selection Help</h6>
      <button className="btn btn-sm btn-link" onClick={onClose}>
        <i className="fa fa-times"></i>
      </button>
    </div>
    <p className="text-muted mb-2" style={{ fontSize: "12px" }}>
      Select products to include in your campaign. You can search, filter, and sort products to find the ones you want
      to advertise.
    </p>
    <ul className="text-muted" style={{ fontSize: "12px", paddingLeft: "20px" }}>
      <li>Click on a product to select it</li>
      <li>Use the search bar to find specific products</li>
      <li>Sort products by newest, price, or rating</li>
    </ul>
  </div>
)
=======
import { useState, useEffect } from "react"
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

const ProductSection = ({
  activeTab,
  setActiveTab,
<<<<<<< HEAD
  products,
=======
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  availableProducts,
  setAvailableProducts,
  selectedProducts,
  setSelectedProducts,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  loading,
  showHelp,
  setShowHelp,
  currentPage,
  setCurrentPage,
  productsPerPage,
  BASE_URL,
  setShowTargetingSection,
  setShowCampaignBidding,
  setShowBidAdjustment,
<<<<<<< HEAD
  initialSelectedProducts = [],
  onUpdateSelectedProducts,
  onProductSelectionChange,
  isEditMode = false,
}) => {
  const [isCampaignStarted, setIsCampaignStarted] = useState(false)

  // Only sync initialSelectedProducts on first mount (edit mode)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && initialSelectedProducts.length > 0) {
      setSelectedProducts(initialSelectedProducts);
      initializedRef.current = true;
    }
  }, [initialSelectedProducts]);
=======
  onUpdateSelectedProducts,
  initialSelectedProducts = [],
  onProductSelectionChange
}) => {
  const filteredProducts = availableProducts
    .filter(
      (product) =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.userId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.medium?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials?.some((material) => material.toLowerCase().includes(searchQuery.toLowerCase())),
        )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(a.createdAt)
        case "price-low":
          return (a.finalPrice || 0) - (b.finalPrice || 0)
        case "price-high":
          return (b.finalPrice || 0) - (a.finalPrice || 0)
        default:
          return 0
      }
    })

  const [isCampaignStarted, setIsCampaignStarted] = useState(false);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  useEffect(() => {
    setSelectedProducts(initialSelectedProducts)
  }, [initialSelectedProducts])
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1

  useEffect(() => {
    if (onProductSelectionChange) {
      onProductSelectionChange(selectedProducts)
    }
  }, [selectedProducts, onProductSelectionChange])

<<<<<<< HEAD
=======

  const handleAddProduct = (product) => {
    setAvailableProducts((prev) => prev.filter((p) => p._id !== product._id))
    const newSelected = [...selectedProducts, product]
    setSelectedProducts(newSelected)
    onUpdateSelectedProducts(newSelected.map((p) => p._id))
  }

  const handleRemoveProduct = (product) => {
    const newSelected = selectedProducts.filter((p) => p._id !== product._id)
    setSelectedProducts(newSelected)
    setAvailableProducts((prev) => [...prev, product])
    onUpdateSelectedProducts(newSelected.map((p) => p._id))
  }

  const handleAddAllOnPage = () => {
    const newSelected = [...selectedProducts, ...currentProducts]
    setSelectedProducts(newSelected)
    setAvailableProducts((prev) => prev.filter((p) => !currentProducts.find((fp) => fp._id === p._id)))
    onUpdateSelectedProducts(newSelected.map((p) => p._id))
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleAddToCampaign = () => {
    if (selectedProducts.length > 0) {
      setShowTargetingSection(true);
      setShowCampaignBidding(true);
      setShowBidAdjustment(true);
      setIsCampaignStarted(true);
    }
  }

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    })
      .format(price)
      .replace(/\.00$/, "")
  }

<<<<<<< HEAD
  const handleSelectProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      const updated = [...selectedProducts, product]
      setSelectedProducts(updated)
      setAvailableProducts(availableProducts.filter((p) => p._id !== product._id))
      if (onUpdateSelectedProducts) {
        onUpdateSelectedProducts(updated.map((p) => p._id))
      }
    }
  }

  const handleRemoveProduct = (productId) => {
    const removed = selectedProducts.find((p) => p._id === productId)
    const updated = selectedProducts.filter((p) => p._id !== productId)
    setSelectedProducts(updated)
    if (removed) {
      setAvailableProducts([...availableProducts, removed])
    }
    if (onUpdateSelectedProducts) {
      onUpdateSelectedProducts(updated.map((p) => p._id))
    }
  }

  const handleAddToCampaign = () => {
    setIsCampaignStarted(true)
    setShowTargetingSection(true)
    setShowCampaignBidding(true)
    setShowBidAdjustment(true)
  }

  const filteredProducts = availableProducts.filter((product) =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.finalPrice || 0) - (b.finalPrice || 0)
      case "price-high":
        return (b.finalPrice || 0) - (a.finalPrice || 0)
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0)
      case "newest":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  const ProductCard = ({ product, onRemove, isSelected }) => (
=======
  const ProductCard = ({ product, onAdd, onRemove, isSelected }) => (
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <div className="p-4">
        <div className="d-flex" style={{ gap: "16px" }}>
          <img
            src={product.mainImage ? `${BASE_URL}${product.mainImage}` : "/placeholder.svg?height=80&width=80"}
            alt={product.productName}
            className="rounded"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
          />
          <div className="flex-grow-1">
            <h3 className="text-sm font-weight-medium text-dark mb-2" style={{ lineHeight: "1.4" }}>
              {product.productName}
            </h3>
            <div className="d-flex align-items-center mb-2" style={{ gap: "8px" }}>
              <span className="text-sm font-weight-bold text-dark">{formatPrice(product.finalPrice)}</span>
              <span className="badge badge-light border">{product.medium}</span>
            </div>
<<<<<<< HEAD

          </div>
          {isSelected && onRemove && (
            <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(product._id)}>
              <i className="fa fa-trash"></i>
            </button>
          )}
          {!isSelected && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => handleSelectProduct(product)}>
              <i className="fa fa-plus"></i>
            </button>
          )}
=======
            <div className="text-muted mb-3" style={{ fontSize: "12px" }}>
              <div>Edition: {product.editionType}</div>
              <div>Type: {product.productType}</div>
              {product.materials && product.materials.length > 0 && (
                <div>Materials: {product.materials.join(", ")}</div>
              )}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            {isSelected ? (
              selectedProducts.length > 1 ? (
                <button onClick={onRemove} className="btn btn-outline-danger btn-sm">
                  <i className="fa fa-trash"></i>
                </button>
              ) : null
            ) : (
              <button onClick={onAdd} className="btn btn-outline-secondary btn-sm">
                Add
              </button>
            )}
          </div>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
        </div>
      </div>
    </div>
  )

<<<<<<< HEAD
  // ---------- EDIT MODE: read-only view ----------
  if (isEditMode) {
    return (
      <div className="card">
        <div className="body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Products</h2>
            <span className="text-muted" style={{ fontSize: "14px" }}>
              {selectedProducts.length} products selected
            </span>
          </div>
          <hr />
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {selectedProducts.map((product) => (
              <ProductCard key={product._id} product={product} isSelected={true} />
            ))}
          </div>
          {selectedProducts.length === 0 && (
            <div className="text-center py-5 text-muted">
              <p>No products selected</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ---------- CREATE MODE: full UI ----------
  return (
    <div className="card">
      <div className="body">
        <div className="row">
          {/* Left: Available Products */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Products</h2>
              <div className="position-relative">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowHelp(!showHelp)}>
                  <i className="fa fa-question-circle"></i>
                </button>
                {showHelp && <HelpPopover onClose={() => setShowHelp(false)} />}
              </div>
            </div>
            <hr />

              {/* Search & Sort */}
            <div className="d-flex justify-content-between align-items-center mb-3" style={{ gap: "8px" }}>
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text bg-white">
                  <i className="fa fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-left-0"
                  placeholder="Search your products"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <label className="text-muted mb-0" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                  Sort by:
                </label>
                <select
                  className="form-control form-control-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "120px" }}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
=======
  const HelpPopover = () => (
    <div className="position-relative">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="btn btn-link text-primary p-0 d-flex align-items-center"
        style={{ fontSize: "14px", gap: "4px" }}
      >
        <i className="fa fa-info-circle"></i>
        How to add products to your campaign
      </button>
      {showHelp && (
        <div
          className="position-absolute bg-white border rounded shadow-lg p-3"
          style={{
            right: "0",
            top: "32px",
            width: "320px",
            zIndex: 10,
          }}
        >
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3" style={{ gap: "8px" }}>
              <i className="fa fa-question-circle text-primary"></i>
              <h6 className="font-weight-bold text-dark mb-0">How to Add Products</h6>
            </div>
            <div className="mb-3">
              <div className="d-flex align-items-start mb-2" style={{ gap: "8px", fontSize: "14px" }}>
                <span className="font-weight-medium text-primary">1.</span>
                <span className="text-muted">
                  Use the <strong>Search tab</strong> to find products by name, artist, medium, or materials
                </span>
              </div>
              <div className="d-flex align-items-start mb-2" style={{ gap: "8px", fontSize: "14px" }}>
                <span className="font-weight-medium text-primary">2.</span>
                <span className="text-muted">
                  Click <strong>"Add"</strong> button next to any product to select it
                </span>
              </div>
              <div className="d-flex align-items-start mb-2" style={{ gap: "8px", fontSize: "14px" }}>
                <span className="font-weight-medium text-primary">3.</span>
                <span className="text-muted">
                  Use <strong>"Add all on this page"</strong> to select all visible products at once
                </span>
              </div>
              <div className="d-flex align-items-start" style={{ gap: "8px", fontSize: "14px" }}>
                <span className="font-weight-medium text-primary">4.</span>
                <span className="text-muted">Selected products appear in the right panel</span>
              </div>
            </div>
            <div className="border-top pt-3">
              <h6 className="font-weight-medium text-dark mb-2" style={{ fontSize: "14px" }}>
                Search & Filter Tips:
              </h6>
              <ul className="text-muted mb-0" style={{ fontSize: "12px" }}>
                <li>Search by product name, artist name, or medium</li>
                <li>Use the "Show" dropdown to sort results</li>
                <li>Filter by "Your Listings" or "All Listings"</li>
                <li>Only approved products can be added to campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="card">
      <div className="body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Products</h2>
          <HelpPopover />
        </div>
        <hr />
        <div className="row">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Search Products</h5>
              <div className="d-flex align-items-center" style={{ gap: "16px" }}>
                <span className="text-sm font-weight-medium">{selectedProducts.length} products</span>
                <button className="btn btn-outline-secondary btn-sm">Add products</button>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-8">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by product name, artist, medium, or materials"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-control" defaultValue="your-listings">
                  <option value="your-listings">Your Listings</option>
                  <option value="all-listings">All Listings</option>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                </select>
              </div>
            </div>

<<<<<<< HEAD
            {/* Product List */}
=======
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <span className="text-sm font-weight-medium">Show:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ width: "auto" }}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button
                onClick={handleAddAllOnPage}
                disabled={currentProducts.length === 0}
                className="btn btn-link text-primary p-0"
                style={{ fontSize: "14px" }}
              >
                Add all on this page
              </button>
            </div>

>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
<<<<<<< HEAD
              </div>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>{searchQuery ? "No products found matching your search" : "No products available"}</p>
                  </div>
                ) : (
                  paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} isSelected={false} />
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, sortedProducts.length)} of{" "}
                  {sortedProducts.length} products
                </span>
                <div className="d-flex" style={{ gap: "4px" }}>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
=======
                <p className="text-muted mt-2">Loading products...</p>
              </div>
            ) : (
              <div>
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onAdd={() => handleAddProduct(product)} />
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <span className="text-muted mr-3" style={{ fontSize: "14px" }}>
                  {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} results
                </span>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fa fa-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`btn btn-outline-secondary btn-sm ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="fa fa-chevron-right"></i>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
                  </button>
                </div>
              </div>
            )}
<<<<<<< HEAD
          </div>

          {/* Right: Selected Products */}
          <div className="col-lg-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Selected Products</h5>
              <span className="badge badge-primary">{selectedProducts.length}</span>
            </div>
            <hr />
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {selectedProducts.map((product) => (
                <ProductCard key={product._id} product={product} onRemove={handleRemoveProduct} isSelected={true} />
              ))}
            </div>
            {selectedProducts.length === 0 && (
              <div className="text-center py-4 text-muted">
                <p>No products selected</p>
              </div>
            )}
            {selectedProducts.length > 0 && !isCampaignStarted && (
              <button className="btn btn-primary w-100 mt-3" onClick={handleAddToCampaign}>
                Add Products to Campaign
              </button>
=======

            {!loading && filteredProducts.length === 0 && availableProducts.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>No Product Found</p>
              </div>
            )}
            {!loading && filteredProducts.length === 0 && availableProducts.length > 0 && (
              <div className="text-center py-5 text-muted">
                <p>No products match your search</p>
                <small>Try different keywords or clear the search</small>
              </div>
            )}
          </div>
          <div className="col-lg-4 border-left">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-weight-bold mb-0">Selected Products</h5>
              <span className="text-muted" style={{ fontSize: "14px" }}>
                {selectedProducts.length} products
              </span>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {selectedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onRemove={() => handleRemoveProduct(product)}
                  isSelected={true}
                />
              ))}
            </div>
            {selectedProducts.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>No products selected</p>
                <small>Click "Add" to select products</small>
              </div>
            )}
            {selectedProducts.length > 0 && !isCampaignStarted && (
              <div className="mt-4 pt-3 border-top">
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleAddToCampaign}
                  disabled={selectedProducts.length === 0}
                >
                  Add {selectedProducts.length} Products to Campaign
                </button>
              </div>
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSection
