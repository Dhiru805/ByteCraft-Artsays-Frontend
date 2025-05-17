import { Link } from "react-router-dom";
import { useState, useEffect, useState as useReactState } from "react";

export const NavUserState = () => {
  return (
    <div className="bg-[#ffffff] rounded-[10px] gap-[10px] font-semibold p-[20px]">
      <Link to='/login'>
        <button
          className="w-[160px] h-[50px] p-[10px] gap-[10px] bg-[#6F4D34] text-white rounded-[10px] text-lg"
        >
          Login
        </button>
      </Link>
    </div>
  );
};

export const NavGuestState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useReactState(null);

  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    setUserType(storedType);
  }, []);

  return (
    <div className="relative flex flex-row gap-1 items-center">
      <Link to="/profile">
        <img src="/assets/home/profile.svg" alt="Profile" />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <img src="/assets/home/toggle.svg" alt="Toggle Dropdown" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-md w-44 z-10">
            <div className="flex flex-col gap-6 py-4 font-semibold">
              <nav className="flex flex-col gap-3 text-zinc-700 text-base">
                <Link to={userType === "Buyer" ? "/my-account" : `${userType}/dashboard`} className="px-3 pb-2">
                  {userType === "Buyer" ? "My Account" : "My Dashboard"}
                </Link>

                <hr className="text-[#6B4A2F]" />
                <Link to="/wishlist" className="px-3 pb-2">
                  Wishlist/Checkout
                </Link>
                <hr className="text-[#6B4A2F]" />
                <Link to="/cart" className="px-3">
                  Cart
                </Link>
              </nav>

              <div className="flex flex-col gap-2">
                <button
                  className="border-2 border-[#6F4D34] rounded text-[#6F4D34] py-2 mx-3 hover:bg-[#6F4D34] hover:text-[#ffffff] transition ease-300"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('email');
                    window.location.href = '/';
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
