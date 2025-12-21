import { LuCreditCard } from "react-icons/lu";
import { RiCustomerServiceLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";

const MyAccountFooter = () => {
  return (
    <div className="py-10 bg-white text-gray-500 font-medium">
      <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-[120px]">
        {/* Free Shipping */}
        <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-row flex-col items-center text-center sm:text-left">
          <div className="text-5xl mt-1 text-[#6E4E37]">
            <BsBoxSeam />
          </div>
          <div>
            <h4 className="font-semibold text-2xl text-[#6E4E37]">Free Shipping</h4>
            <p className="text-sm">Free Shipping for Orders Above ₹2000</p>
          </div>
        </div>

        {/* Flexible Payment */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-row flex-col items-center text-center sm:text-left">
          <div className="text-5xl text-[#6E4E37]">
            <LuCreditCard />
          </div>
          <div>
            <h4 className="font-semibold text-2xl text-[#6E4E37]">Flexible Payment</h4>
            <p className="text-sm">Multiple Secure Payment Options</p>
          </div>
        </div>

        {/* 24x7 Support */}
        <div className="flex items-end gap-3 w-full sm:w-auto sm:flex-row flex-col items-center text-center sm:text-left">
          <div className="text-5xl text-[#6E4E37]">
            <RiCustomerServiceLine />
          </div>
          <div>
            <h4 className="font-semibold text-2xl text-[#6E4E37]">24x7 Support</h4>
            <p className="text-sm">We Support Online All Days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountFooter;
