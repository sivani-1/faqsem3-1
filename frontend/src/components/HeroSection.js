import React from "react";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <h1 className="typewriter-text">Welcome to KMIT FAQs</h1>
        <p className="hero-subtitle">Your one-stop solution for all questions about KMIT!</p>
        <a href="#faqs" className="hero-button">Explore FAQs</a>
        <div className="hero-admin-link">
          <a href="/admin" className="admin-link">Admin</a> {/* Add Admin heading/link */}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;