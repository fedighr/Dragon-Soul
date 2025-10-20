import React from "react";
import "./Topbar.css"
const Topbar = () => {
    return (
        <div className="topbar">

            <div className="connexion">
                <a href="#">Login</a>
                <p>|</p>
                <a href="#">Register</a>
            </div>

            <div className="contacts">

                <a href="#" className="bi bi-facebook" title="Facebook"></a>
                <a href="#" className="bi bi-instagram" title="Instagram"></a>
                <a href="#" className="bi bi-twitter" title="Twitter"></a>
                <a href="#" className="bi bi-linkedin" title="Linkedin"></a>

            </div>

            <div className="notif-card">
            <i className="bi bi-bell fs-6">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {/* empty for now */}
                  </span>
            </i>
            <p>|</p>
            <i className="bi bi-cart fs-6"></i>

                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    </span>

        </div>
        </div>
)
    ;
}

export default Topbar;