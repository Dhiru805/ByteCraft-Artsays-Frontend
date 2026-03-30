import { useEffect, useState, useRef } from "react"
import { getImageUrl } from '../../../../utils/getImageUrl';

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

const ProductSection = ({
  activeTab,
  setActiveTab,
  products,
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

  useEffect(() => {
    if (onProductSelectionChange) {
      onProductSelectionChange(selectedProducts)
    }
  }, [selectedProducts, onProductSelectionChange])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    })
      .format(price)
      .replace(/\.00$/, "")
  }

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <div className="p-4">
        <div className="d-flex" style={{ gap: "16px" }}>
          <img
            src={product.mainImage ? getImageUrl(product.mainImage) : "/placeholder.svg?height=80&width=80"}
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
        </div>
      </div>
    </div>
  )

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
                </select>
              </div>
            </div>

            {/* Product List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
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
                  </button>
                </div>
              </div>
            )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSection
