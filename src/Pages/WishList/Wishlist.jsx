import React, { useContext } from 'react';
import { ProductContext } from '../../Contexts/ProductProvider';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(ProductContext);

  return (
    <div id="pageWrapper">
      <main>
        <div className="cartHolder   pb-xl-24  py-md-16 ">
          <div className="rows">
            {/* table-responsive */}
            <div className="col-12 table-responsive mb-lg-20 mb-md-16 mb-10">
              {/* cartTable */}
              <table className="table cartTable mb-xl-22">
                <thead>
                  <tr>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">product</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0">price</th>
                    <th scope="col" className="text-uppercase fwEbold border-top-0"></th>
                    {/* <th scope="col" className="text-uppercase fwEbold border-top-0"></th> */}
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map(product => (
                    <tr className="align-items-center" key={product.id}>
                      <td className="d-flex align-items-center border-top-0 border-bottom px-0 py-6">
                        <div className="imgHolder">
                          <img src={product.imageUrl} alt={product.title} className="img-fluid" />
                        </div>
                        <span className="title pl-2">
                          <Link to={`/shop-detail/${product.id}`}>{product.title}</Link>
                        </span>
                      </td>
                      <td className="fwEbold border-top-0 border-bottom px-0 py-6" data-value="INR" data-price={product.newPrice}>₹{product.newPrice} </td>
                      <td className="border-top-0 border-bottom px-0 py-6">
					  <Link to={`/shop-detail/${product.id}`} class="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4">View</Link>
                      </td>
                      <td className="fwEbold border-top-0 border-bottom px-0 py-6" >
                        <a href="#" className="fas fa-times float-right" onClick={() => removeFromWishlist(product.id)}></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <form action="#" className="couponForm mb-md-0 mb-5">
              </form>
            </div>
          </div>
        </div>
        {/* footerHolder */}
      </main>
    </div>
  );
};

export default Wishlist;
