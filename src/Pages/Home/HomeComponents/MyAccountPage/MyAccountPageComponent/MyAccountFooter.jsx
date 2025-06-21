import { LuCreditCard } from "react-icons/lu";
import { RiCustomerServiceLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
const MyAccountFooter = () => {
  return (
    <div className="py-[80px]  bg-white text-gray-500 font-medium">
      <div className="max-w-[1208px]  mx-auto flex gap-[120px]">
        <div className="flex items-start gap-3">
          <div className="text-5xl mt-1 text-[#6E4E37]"><BsBoxSeam /></div>
          <div className="text-left">
            <h4 className="font-semibold text-2xl text-[#6E4E37]  ">Free Shipping</h4>
            <p className="text-sm">Free shipping for orders above $50</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-6xl text-[#6E4E37] "><LuCreditCard /></div>
          <div className="text-left">
            <h4 className="font-semibold text-2xl text-[#6E4E37] ">Flexible Payment</h4>
            <p className="text-sm">Multiple secure payment options</p>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="text-6xl text-[#6E4E37]"><RiCustomerServiceLine /></div>
          <div className="text-left">
            <h4 className="font-semibold text-2xl text-[#6E4E37] ">24x7 Support</h4>
            <p className="text-sm ">We support online all days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountFooter;
