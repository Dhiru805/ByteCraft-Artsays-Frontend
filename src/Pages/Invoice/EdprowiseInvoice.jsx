import React from 'react';

const EdprowiseInvoice = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white" style={{ color: "black" }}>
      <div className="flex justify-between items-center text-2xl font-bold mb-4">
        <h1 className="text-center ml-[370px]">Tax Invoice</h1>
        <h1 className="text-right">(Original for Recipient)</h1>
      </div>

      <table className="w-full" style={{ border: "2px solid black", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {/* First Row - Supplier and Identifiers */}
            <td className="px-2 w-1/2" style={{ border: "2px solid black" }}>
              <tr>
                <td className="font-semibold text-lg pb-2">Supplier</td>
              </tr>
              <tr>
                <td className="font-medium py-1">Name :<span className='ml-1'>Company A</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1" colSpan={10}>Address :<span className='ml-1'>B-503 Saaga Residency Near Zydus Corporate Park, Near Nirma University, Near Landmark</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">City :<span className='ml-1'>Delhi</span></td>
                <td className="font-medium py-1">State :<span className='ml-1'>Delhi</span></td>
              </tr>
            </td>
            <td className="px-2 align-top py-2 w-1/2" style={{ border: "2px solid black" }}>
              <tr>
                <td className="font-medium py-1">GSTIN :<span className='ml-1'>22AAAAA0000A1Z5</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">PAN :<span className='ml-1'>AAAAA0000A</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Contact No. :<span className='ml-1'>9725560023</span></td>
              </tr>
              <tr>
                <td className="font-medium">Email ID :<span className='ml-1'>nikitabaladha17@gmail.com</span></td>
              </tr>
            </td>
          </tr>
          {/* Second Row - Invoice Details */}
          <tr>
            <td className="px-2 py-1">
              <th>
                <td className="font-semibold pb-2" colSpan="2">Consignee</td>
              </th>
              <tr>
                <td className="font-medium py-1">Name :<span className='ml-1'>Edprowise</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1" colSpan={11}>Address:<span className='ml-1'>B-503 Saaga Residency Near Zydus Corporate Park, Near Nirma University, Near Landmark</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">City :<span className='ml-1'>Delhi</span></td>
                <td className="font-medium py-1">State :<span className='ml-1'>Delhi</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Contact No.:<span className='ml-1'>9725560023</span></td>
                <td className="font-medium py-1">Email Id :<span className='ml-1'>edprowise@gmail.com</span></td>
              </tr>
              <br /> 
              <tr>
                <td className="font-semibold pb-2 pt-2" colSpan="2">Buyer</td>
              </tr>
              <tr>
                <td className="font-medium py-1">Name :<span className='ml-1'>Edprowise</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1" colSpan={10}>Address:<span className='ml-1'>B-503 Saaga Residency Near Zydus Corporate Park, Near Nirma University, Near Landmark</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">City :<span className='ml-1'>Delhi</span></td>
                <td className="font-medium py-1">State :<span className='ml-1'>Delhi</span></td>
              </tr>      
            </td>
            <td className="px-2 align-top py-1 pb-20 w-1/2" style={{ border: "2px solid black" }}>
              <tr>
                <td className="font-medium py-1">Invoice No. :<span className='ml-1'>EINV/2025-26/0001</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Order No. :<span className='ml-1'>ORD/2025-26/0001</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Invoice Date :<span className='ml-1'>10/07/2025</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Payment Terms :<span className='ml-1'>45 (Days Only)</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">Advance Amount Received :<span className='ml-1'>50000</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">GSTIN :<span className='ml-1'>22AAAAA0000A1Z5</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">PAN :<span className='ml-1'>AAAAA0000A</span></td>
              </tr>
              <tr>
                <td className="font-medium py-1">All Amounts are in INR</td>
              </tr>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table className="w-full mb-3" style={{ border: "2px solid black" }}>
        <thead>
          <tr className="text-center">
            <th className="p-2" style={{ border: "2px solid black" }}>Sr</th>
            <th className="p-2" style={{ border: "2px solid black" }}>Sub Category Name</th>
            <th className="p-2" style={{ border: "2px solid black" }}>Qty</th>
            <th className="p-2" style={{ border: "2px solid black" }}>Rate</th>
            <th className="p-2" style={{ border: "2px solid black" }}>Taxable Value</th>
            <th className="p-2" style={{ border: "2px solid black" }}>GST Amount</th>
            <th className="p-2" style={{ border: "2px solid black" }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>1</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>School Desk & Bench - Steel</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>100</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>900</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹90,000</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹21,600</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹1,11,600</td>
          </tr>
          <tr className='font-bold'>
            <td className="p-2 text-center" colSpan="2" style={{ border: "2px solid black" }}>Total</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>100</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}></td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹90,000</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹21,600</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹1,11,600</td>
          </tr>
        </tbody>
      </table>
      <p className="mb-3 font-semibold">Amount Chargeable (in words) : INR One Hundred Eleven Thousand Six Hundred Only</p>

      {/* HSN/SAC Table */}
      <table className="w-full mb-4" style={{ border: "2px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr className="text-center">
            <th rowSpan={2} style={{ alignContent: "flex-start", border: "2px solid black" }}>HSN/SAC</th>
            <th rowSpan={2} style={{ alignContent: "flex-start", border: "2px solid black" }}>Taxable Value</th>
            <th colSpan="2" style={{ border: "2px solid black" }}>CGST</th>
            <th colSpan="2" style={{ border: "2px solid black" }}>SGST</th>
            <th colSpan="2" style={{ border: "2px solid black" }}>IGST</th>
            <th rowSpan={2} style={{ alignContent: "flex-start", border: "2px solid black" }}>Total Tax Amount</th>
          </tr>
          <tr className="text-center">
            <th style={{ border: "2px solid black" }}>Rate</th>
            <th style={{ border: "2px solid black" }}>Amount</th>
            <th style={{ border: "2px solid black" }}>Rate</th>
            <th style={{ border: "2px solid black" }}>Amount</th>
            <th style={{ border: "2px solid black" }}>Rate</th>
            <th style={{ border: "2px solid black" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>12345678</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹90,000</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>12</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹10,800</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>12</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹10,800</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>0</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹0</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}></td>
          </tr>
          <tr className="font-bold">
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>Total</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹90,000</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}></td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹10,800</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}></td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹10,800</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}></td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹0</td>
            <td className="p-2 text-center" style={{ border: "2px solid black" }}>₹21,600</td>
          </tr>
        </tbody>
      </table>
      <p className="mb-2 font-semibold">Tax Amount (in words ) : INR Twenty One Thousand Six Hundred Only</p>

      {/* Signature Section */}
      <div className="text-right mt-6">
        <p className='font-bold text-black mb-10'>For Company A</p>
        <div style={{ border: "1px solid black", width: "200px", margin: "8px 0 8px auto" }}></div>
        <p className="mt-6 font-bold">Authorised Signatory</p>
      </div>
    </div>
  );
};
export default EdprowiseInvoice;