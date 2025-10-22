import React from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import HomeCarousel from "../../components/layout/Carousel/HomeCarousel.jsx";
import NewArrivalCarousel from "../../components/layout/Carousel/NewArrivalCarousel.jsx";
const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        <Header />
        <HomeCarousel/>
        <NewArrivalCarousel />
        <Footer />
    </div>
  );
};

export default Home;
