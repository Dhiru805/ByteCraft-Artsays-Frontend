import React from 'react';

const Billings = () => {
  const billingHistory = [
    { id: 1, title: 'Basic Plan', invoiceNumber: '#LA35628', date: 'April 17, 2018', amount: '$29' },
    { id: 2, title: 'Pro Plan', invoiceNumber: '#LA3599', date: 'March 18, 2018', amount: '$59' },
    { id: 3, title: 'Platinum Plan', invoiceNumber: '#LA1245', date: 'Feb 02, 2018', amount: '$89' },
  ];

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
          <a href="#edit-payment" onClick={(e) => e.preventDefault()} className="edit-payment-info">
            Edit Payment Info
          </a>
        </div>
        <p className="margin-top-30">
          <a href="#add-payment" onClick={(e) => e.preventDefault()}>
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
          {billingHistory.map((item) => (
            <tr key={item.id}>
              <td>
                <h3 className="billing-title">
                  {item.title}{" "}
                  <span className="invoice-number">{item.invoiceNumber}</span>
                </h3>
                <span className="text-muted">
                  Charged at {item.date}
                </span>
              </td>
              <td className="amount">{item.amount}</td>
              <td className="action">
                <a href="#view" onClick={(e) => e.preventDefault()}>View</a>
              </td>
            </tr>
          ))}
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
