import React from "react";
/*import "./Footer.css"*/

const Footer = () => {
  return (
      <>
      <div className="footer-container">
             <div className="d-flex justify-content-center my-3">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Enter Your Email"
                    style={{ maxWidth: "300px", backgroundColor: "white" }}
                  />
                  <button
                    className="btn"
                    style={{ backgroundColor: "orange", color: "white" }}
                  >
                    Subscribe
                  </button>
             </div>
      </div>
      </>
  );}
export default Footer;