import React from "react";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-text">
        <h1 className="animated-text">Welcome to KMIT FAQs</h1>
        <p>Your one-stop solution for all questions about KMIT!</p>
        <a href="#faqs" className="cta-button">Explore FAQs</a>
      </div>
    </section>
  );
}

export default HeroSection;
