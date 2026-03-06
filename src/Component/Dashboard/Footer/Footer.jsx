import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
            <div className="col-12 text-center">
              All Copyright © {currentYear} Artsays Private Limited. All Rights Reserved. Design By&nbsp; 
          <a
          href="https://bytecraftstudios.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "inherit", textDecoration: "underline" }} 
        >
           Bytecraft Studios
        </a>.
            </div>
           
    </>
  );
};

export default Footer;