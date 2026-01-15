import React, { useState } from 'react';

const Billings = () => {

  return (
    <div className="tab-pane" id="billings">
    <div className="body">
      <h6>Payment Method</h6>
      <div className="payment-info">
        <h3 className="payment-name">
          <i className="fa fa-paypal" /> PayPal ****2222
        </h3>
        <span>Next billing charged $29</span>
        <br />
        <em className="text-muted">Autopay on May 12, 2018</em>
        <a href="javascript:void(0);" className="edit-payment-info">
          Edit Payment Info
        </a>
      </div>
      <p className="margin-top-30">
        <a href="javascript:void(0);">
          <i className="fa fa-plus-circle" /> Add Payment Info
        </a>
      </p>
    </div>
    <div className="body">
      <h6>Billing History</h6>
      <table className="table billing-history">
        <thead className="sr-only">
          <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h3 className="billing-title">
                Basic Plan{" "}
                <span className="invoice-number">#LA35628</span>
              </h3>
              <span className="text-muted">
                Charged at April 17, 2018
              </span>
            </td>
            <td className="amount">$29</td>
            <td className="action">
              <a href="javascript:void(0);">View</a>
            </td>
          </tr>
          <tr>
            <td>
              <h3 className="billing-title">
                Pro Plan <span className="invoice-number">#LA3599</span>
              </h3>
              <span className="text-muted">
                Charged at March 18, 2018
              </span>
            </td>
            <td className="amount">$59</td>
            <td className="action">
              <a href="javascript:void(0);">View</a>
            </td>
          </tr>
          <tr>
            <td>
              <h3 className="billing-title">
                Platinum Plan{" "}
                <span className="invoice-number">#LA1245</span>
              </h3>
              <span className="text-muted">
                Charged at Feb 02, 2018
              </span>
            </td>
            <td className="amount">$89</td>
            <td className="action">
              <a href="javascript:void(0);">View</a>
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" className="btn btn-primary">
        Update
      </button>
      <button type="button" className="btn btn-default">
        Cancel
      </button>
    </div>
  </div>
  );
};

export default Billings;
