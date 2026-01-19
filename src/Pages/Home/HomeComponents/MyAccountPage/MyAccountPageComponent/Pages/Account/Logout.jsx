import React from "react";

const Logout = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.location.href = "/";
  };

  return (
    <div className="w-full space-y-6 text-gray-800">
      <h2 className="text-2xl font-semibold text-gray-950">Logout</h2>
      <p className="text-gray-800 text-[16px] font-medium">
        Are you sure you want to logout?
      </p>
      <button
        onClick={handleLogout}
        className="bg-[#6F4D34] hover:bg-[#5a3e29] transition text-white px-6 py-2 rounded-full font-medium"
      >
        Yes, Logout
      </button>
    </div>
  );
};

export default Logout;
