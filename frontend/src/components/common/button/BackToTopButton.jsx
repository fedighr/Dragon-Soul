import { useState, useEffect } from "react";
import "./BackToTopButton.css";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPercent((totalScroll / windowHeight) * 100);

      setVisible(totalScroll > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="back-to-top-container" onClick={scrollToTop}>
      <svg className="progress-circle" width="60" height="60">
        <circle cx="30" cy="30" r="28" />
        <circle
          cx="30"
          cy="30"
          r="28"
          style={{ strokeDasharray: 2 * Math.PI * 28, strokeDashoffset: 2 * Math.PI * 28 * (1 - scrollPercent / 100) }}
        />
      </svg>
      <span className="arrow">↑</span>
    </div>
  );
};

export default BackToTopButton;
