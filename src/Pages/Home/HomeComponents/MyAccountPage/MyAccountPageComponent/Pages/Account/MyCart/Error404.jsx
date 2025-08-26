import React from "react";

const Error404Page = () => {
  return (
    <div className="max-w-[1464px] w-full px-4 sm:px-6 lg:px-12 pt-10 text-lg overflow-hidden">
      <div></div>
      <div>
        <h2>Oops! Page not Found</h2>
        <div>
        <p>The page you are lokking for cannot be found. Take a break before trying again.</p>
        {/* <p>The page you are lokking for cannot be found. Take a break before trying again.</p> */}
        </div>
      </div>
      <button>Go to Home Page</button>
    </div>
  );
};

export default Error404Page;
