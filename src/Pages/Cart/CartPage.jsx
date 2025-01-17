import React, { useContext } from 'react';
import { ProductContext } from '../../Contexts/ProductProvider';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, currency, convertPrice, getSymbol } = useContext(ProductContext);

  const handleQuantityChange = (productId, selectedSize, event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) { // Ensure quantity is positive
      updateQuantity(productId, selectedSize, newQuantity);
    }
  };

  const getTotalPrice = (item) => convertPrice(item.newPrice * item.quantity).toFixed(2);

  const getSubtotal = () => cart.reduce((total, item) => total + item.newPrice * item.quantity, 0);

  return (
    <div id="pageWrapper">
      <main>
        <div className="cartHolder pt-xl-21 pb-xl-24 py-lg-20 py-md-16 py-10">
          <div className="row">
            <div className="col-12 table-responsive mb-lg-20 mb-md-16 mb-10">
              <table className="table cartTable mb-xl-22">
                <thead>
                  <tr>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">Product</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">Size</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">Price</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">Quantity</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={`${item.id}-${item.selectedSize}`} className="align-items-center">
                      <td className="d-flex align-items-center border-top-0 border-bottom px-0 py-6">
                        <div className="imgHolder">
                          <img src={item.imageUrl} alt={item.title} className="img-fluid" />
                        </div>
                        <span className="title pl-2">
                          <a href={`/shop-detail/${item.id}`}>{item.title}</a>
                        </span>
                      </td>
                      <td className="fwEbold border-top-0 border-bottom px-0 py-6">
                        {item.selectedSize}
                      </td>
                      <td className="fwEbold border-top-0 border-bottom px-0 py-6">
                        {getSymbol()}{convertPrice(item.newPrice).toFixed(2)}
                      </td>
                      <td className="border-top-0 border-bottom px-0 py-6">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, item.selectedSize, e)}
                        />
                      </td>
                      <td className="fwEbold border-top-0 border-bottom px-0 py-6">
                        {getSymbol()}{getTotalPrice(item)}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="fas fa-times float-right"
                        ></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form action="#" className="cartForm mb-5">
                <div className="form-group mb-0">
                  <label htmlFor="note" className="fwEbold text-uppercase d-block mb-1">Add Note</label>
                  <textarea id="note" className="form-control"></textarea>
                </div>
              </form>
            </div>
            <div className="col-12 col-md-6">
              <form action="#" className="couponForm mb-md-0 mb-5">
                <fieldset>
                  <div className="mt-holder d-inline-block align-bottom mr-lg-5 mr-0 mb-lg-0 mb-2">
                    <label htmlFor="code" className="fwEbold text-uppercase d-block mb-1">Promo Code</label>
                    <input type="text" id="code" className="form-control" />
                  </div>
                  <button type="submit" className="btn btnTheme btnCart fwEbold text-center text-white md-round py-3 px-4 py-md-3 px-md-4">Apply</button>
                </fieldset>
              </form>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-between">
                <strong className="txt fwEbold text-uppercase mb-1">Subtotal</strong>
                <strong className="price fwEbold text-uppercase mb-1">
                  {getSymbol()}{convertPrice(getSubtotal()).toFixed(2)}
                </strong>
              </div>
              <button className="btn btnTheme btnCart fwEbold text-center text-white md-round py-3 px-4 py-md-3 px-md-4">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
