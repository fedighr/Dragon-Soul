import React, { useState, useEffect } from "react";
import "./HomeCarousel.css";
import car5 from '../../../assets/images/car5.jpg';
import car2 from '../../../assets/images/car2.jpg';
import car6 from '../../../assets/images/car6.jpg';

const HomeCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        { id: 0, src: car2, alt: "First slide" },
        { id: 1, src: car5, alt: "Second slide" },
        { id: 2, src: car6, alt: "Third slide" }
    ];

    const nextSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel">
            <ol className="carousel-indicators">
                {items.map((_, index) => (
                    <li
                        key={index}
                        className={index === activeIndex ? 'active' : ''}
                        onClick={() => goToSlide(index)}
                    ></li>
                ))}
            </ol>
            <div className="carousel-inner">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
                    >
                        <img className="d-block w-100" src={item.src} alt={item.alt}/>
                        <div className="carousel-caption">
                            <h5>Best Collection</h5>
                            <h1>EXCLUSIVE FASHION 2025</h1>
                            <h2>Ultimate Fashion Shop</h2>
                            <button className="shop-now-btn">SHOP NOW</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" onClick={prevSlide}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </button>
            <button className="carousel-control-next" onClick={nextSlide}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </button>
        </div>
    )
};

export default React.memo(HomeCarousel);