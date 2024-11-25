


import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-text">
        <h1 className="animated-text">Welcome to KMIT FAQs</h1>
        <p>Your one-stop solution for all questions about KMIT!</p>
        <Link to="/faqs" className="cta-button">
          Explore FAQs
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
