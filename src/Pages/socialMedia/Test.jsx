import React from 'react';
 
const Invoice = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg font-sans" style={{color: "black"}}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <img
                        src="/assets/home/logo.svg"
                        alt="Artsays Logo"
                        className="h-20"
                    />
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h2>
                    <p className="text-xl">(Original for Recipient)</p>
                </div>
            </div>
 
            {/* Main Information Section */}
            <table className="w-full border-collapse" style={{border: "2px solid black"}}>
                <tbody>
                    <tr>
                        {/* Left Column: Sold By & Order Details */}
                        <td className="w-1/2 align-top" style={{border: "2px solid black"}}>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="font-semibold text-lg">Sold By :</td>
                                    </tr>
                                    <tr>
                                        <td className='pb-4' colSpan={10}>CLICKTECH RETAIL PRIVATE LIMITED Sr No 315 1,Patra Shed and Open Plot, Uttam Nagar, Bavdhan Budruk, Mulshi PUNE, MAHARASHTRA, 411021 IN</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2" rowSpan={1}>PAN No:</td>
                                        <td colSpan={10}>AAJCC9783E</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2 " rowSpan={1}>GST Registration No:</td>
                                        <td className="text-left" colSpan={10}>27AAJCC9783E1Z7</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2">Order Number:</td>
                                        <td>408-2792294-7884333</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2">Order Date:</td>
                                        <td>23.08.2025</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
 
                        {/* Right Column: Billing, Shipping & Invoice Details */}
                        <td className="w-1/2 pb-1" style={{border: "2px solid black"}}>
                            <table className="w-full">
                                <tbody>
                                    {/* Billing Address */}
                                    <tr>
                                        <td className="font-semibold text-lg pb-2">Billing Address :</td>
                                    </tr>
                                    <tr>
                                        <td>Dhiraj Zope</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>plot no.124,vishnu mahajan nagar,, jalgaon road, bhusawal Bhusawal, MAHARASHTRA, 425201 IN</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2 pb-4">State/UT Code:</td>
                                        <td className="pb-4">27</td>
                                    </tr>
 
                                    {/* Shipping Address */}
                                    <tr>
                                        <td className="font-semibold text-lg pt-2 pb-2">Shipping Address :</td>
                                    </tr>
                                    <tr>
                                        <td>Dhiraj Zope</td>
                                    </tr>
                                    <tr>
                                        <td>Shraddha Lohar</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>503, F Wing, Park Connect, Hinjewadi Phase 1 Pune, MAHARASHTRA, 411057 IN</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2" rowSpan={1}>State/UT Code:</td>
                                        <td colSpan={9}>27</td>
                                    </tr>
 
                                    {/* Place of Supply/Delivery */}
                                    <tr>
                                        <td className="font-medium pr-2">Place of supply:</td>
                                        <td>MAHARASHTRA</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-2">Place of delivery:</td>
                                        <td>MAHARASHTRA</td>
                                    </tr>
 
                                    {/* Invoice Details */}
                                    <tr>
                                        <td className="font-medium">Invoice Number:</td>
                                        <td>SPNG-3125</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium" rowSpan={1}>Invoice Details:</td>
                                        <td>MH-SPNG-297683823-2526</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium">Invoice Date:</td>
                                        <td>23.08.2025</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
 
             {/* Item Details Table */}
             <table className="w-full border-collapse" style={{border: "2px solid black"}}>
                 <thead>
                     <tr className='text-left bg-gray-200'>
                         <th style={{border: "2px solid black", width: "1%"}}>Sl. No</th>
                         <th style={{border: "2px solid black"}}>Description</th>
                         <th style={{border: "2px solid black"}}>Unit Price</th>
                         <th className="text-center" style={{border: "2px solid black"}}>Qty</th>
                         <th style={{border: "2px solid black"}}>Net Amount</th>
                         <th style={{border: "2px solid black"}}>Tax Rate</th>
                         <th style={{border: "2px solid black"}}>Tax Type</th>
                         <th style={{border: "2px solid black"}}>Tax Amount</th>
                         <th style={{border: "2px solid black"}}>Total Amount</th>
                     </tr>
                 </thead>
                <tbody>
                    <tr>
                        <td className="text-center" style={{border: "2px solid black"}}>1</td>
                        <td className="text-left" style={{border: "2px solid black"}}>
                            Cosmic Byte Blitz Wireless + Wired Controller for PC, Hall Effect Joystick & Triggers, 1000Hz Polling Rate, Adjustable Vibration, Turbo & Auto Turbo (Black) | BOD8HY8CT8 (B0D8HY8CT8) HSN:84716060
                        </td>
                        <td className="text-left align-center" style={{border: "2px solid black"}}>₹1,524.58</td>
                        <td className="text-center align-center" style={{border: "2px solid black"}}>1</td>
                        <td className="text-left align-center" style={{border: "2px solid black"}}>₹1,524.58</td>
                        <td className="text-center align-center" style={{border: "2px solid black"}}>9%</td>
                        <td className="text-center align-center" style={{border: "2px solid black"}}>CGST</td>
                        <td className="text-left align-center" style={{border: "2px solid black"}}>₹137.21</td>
                        <td className="text-left align-center" style={{border: "2px solid black"}} >₹1,799.00</td>
                    </tr>
                    <tr>
                        <td colSpan="5" style={{border: "2px solid black"}}></td>
                        <td className="text-center" style={{border: "2px solid black"}}>9%</td>
                        <td className="text-center" style={{border: "2px solid black"}}>SGST</td>
                        <td className="text-left" style={{border: "2px solid black"}}>₹137.21</td>
                    </tr>
                     <tr className="font-bold">
                         <td colSpan="7" className="text-left" style={{border: "2px solid black"}}>TOTAL:</td>
                         <td className="text-left bg-gray-200" style={{border: "2px solid black"}}>₹274.42</td>
                         <td className="text-left bg-gray-200" style={{border: "2px solid black"}}>₹1,799.00</td>
                     </tr>
                    <tr>
                        <td className="mb-2 font-bold text-left" colSpan="9">Amount in Words:</td>
                    </tr>
                    <tr>
                        <td className='font-bold text-left' colSpan="9">One Thousand Seven Hundred Ninety-nine only</td>
                    </tr>
                    <tr style={{border: "2px solid black"}}></tr>
                    <tr>
                        <td className="font-bold text-right" colSpan="10">For CLICKTECH RETAIL PRIVATE LIMITED:</td>
                    </tr>
                    <tr>
                        <td className="font-bold text-right" colSpan="10">Authorized Signatory</td>
                    </tr>
                </tbody>
            </table>
 
            <div className='mb-4'>
                <p>Whether tax is payable under reverse charge - No</p>
            </div>
 
             {/* Payment Details Table */}
             <table className="w-full border-collapse mb-20" style={{border: "2px solid black"}}>
                 <tbody>
                     <tr>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Payment Transaction ID:</strong> 11123mFvGzeK9jonr.JhS6uNyC
                         </td>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Date & Time:</strong> 23/08/2025, 08:54:48hrs
                         </td>
                         <td className="p-2" style={{border: "2px solid black"}} rowSpan={2}>
                             <strong>Invoice Value:</strong> 1,799.00
                         </td>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Mode of Payment:</strong> Promotion
                         </td>
                     </tr>
                     <tr>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Payment Transaction ID:</strong> 32Kt9G6LccSqjlnEhl7c
                         </td>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Date & Time:</strong> 23/08/2025, 08:54:15hrs
                         </td>
                         <td className="p-2" style={{border: "2px solid black"}}>
                             <strong>Mode of Payment:</strong> Credit Card
                         </td>
                     </tr>
                 </tbody>
             </table>
 
            {/* Footer */}
            <div className='text-xs text-center text-gray-600'>
              <p>*ASPL/Amazon Seller Services Pvt. Ltd., ARIPL/Amazon Retail India Pvt. Ltd. (only where Amazon Retail India Pvt. Ltd. Fulfillment center is co-located)</p>
             <p>Customers desirous of availing input GST credit are requested to create a Business account and purchase on Amazon.inBusiness from Business eligible offers</p>
             <p>Please note that this invoice is not a demand for payment</p>
            </div>
        </div>
    );
};
 
export default Invoice;
 