import React from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import HomeCarousel from "../../components/layout/Carousel/HomeCarousel.jsx";
import NewArrivalCarousel from "../../components/layout/Carousel/NewArrivalCarousel.jsx";
import BestSellsFeaturedCarousel from "../../components/layout/Carousel/BestSellsFeaturedCarousel.jsx";
import ProductShowcase from "../../components/common/modal/ProductShowCase.jsx";
import BestSellersPromo from "../../components/common/modal/BestSellersPromo.jsx";
import BeautyShowcase from "../../components/common/modal/BeautyShowcase.jsx";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        <Header />
        <HomeCarousel/>
        <ProductShowcase/>
        <NewArrivalCarousel />
        <BeautyShowcase/>
        <BestSellsFeaturedCarousel/>
        <BestSellersPromo/>
        <Footer />
    </div>
  );
};

export default Home;
