import React from "react";
import Navbar from "./Navbar.jsx";
import Topbar from "./TopBar.jsx";
import HomeCarousel from "../../common/carousel/HomeCarousel.jsx";

const Header = () => {
  return (
    <>
      <Topbar />
      <Navbar image="/logos/logo3.png" />
      <HomeCarousel />  
    </>
  );
};

export default Header;