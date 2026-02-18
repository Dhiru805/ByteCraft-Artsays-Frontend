import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';

const PaymentMethod = () => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Payment Methods
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Linked Accounts */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Linked Accounts</h3>
            <div className="space-y-4">
              {/* Paytm */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:bg-white hover:border-blue-200 transition-all duration-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Paytm_Logo.png"
                  alt="Paytm"
                  className="h-5 object-contain"
                />
                <button className="text-sm font-bold text-[#5C4033] hover:text-[#4b3327] transition-colors">Link Account</button>
              </div>

              {/* Visa */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:bg-white hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                      alt="Visa"
                      className="h-4"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">**** **** **** 0223</span>
                </div>
                <button className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">Delete</button>
              </div>

              {/* Google Pay */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:bg-white hover:border-blue-200 transition-all duration-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Pay_Logo.svg"
                  alt="Google Pay"
                  className="h-6"
                />
                <button className="text-sm font-bold text-[#5C4033] hover:text-[#4b3327] transition-colors">Link Account</button>
              </div>

              {/* PhonePe */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:bg-white hover:border-blue-200 transition-all duration-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fb/PhonePe_Logo.svg"
                  alt="PhonePe"
                  className="h-6"
                />
                <button className="text-sm font-bold text-[#5C4033] hover:text-[#4b3327] transition-colors">Link Account</button>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 h-fit">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
              <FaCreditCard className="w-6 h-6 text-[#5C4033]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Card</h3>
              <p className="text-sm text-gray-500">Securely add your credit or debit card</p>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Holder Name</label>
              <input
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Name on card"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <div className="relative">
                <input
                  className="w-full border border-gray-200 px-4 py-3 pl-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="0000 0000 0000 0000"
                />
                <BsFillCreditCard2FrontFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="***"
                  maxLength="3"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  id="saveCard"
                  type="checkbox"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:border-[#5C4033] checked:bg-[#5C4033] transition-all duration-300"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <label htmlFor="saveCard" className="text-sm font-medium text-gray-600 cursor-pointer">
                Save card for future payments
              </label>
            </div>

            <button className="group relative w-full flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              Add Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );

};

export default PaymentMethod;
