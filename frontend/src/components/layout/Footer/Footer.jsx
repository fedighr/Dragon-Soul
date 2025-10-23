import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <div className="subscription-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="subscription-wrapper">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Email"
                    />
                    <button
                      className="btn subscribe-btn"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-footer">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="logo-section">
                    <h2>Dragon Soul</h2>
                   <p>
                       This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="social-section">
                  <div className="social-icons">
                    <a href="#" className="social-icon">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="bi bi-google"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="social-icon">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="contact-section">
                  <p>   <i className="bi bi-house-fill text-warning">      </i>Ksour Essef, Mahdia, Tunisia.</p>
                  <p>   <i className="bi bi-envelope-fill text-warning me-1">    </i>info@yourtheme.com</p>
                  <p>   <i className="bi bi-telephone-fill text-warning me-1">      </i>+216-50078199 : +216-97370975</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="copyright-bar">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <p>Dragon Soul © 2025 Powered by Double G™. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;