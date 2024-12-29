import React from "react";
import "./StatsSection.css";

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stat">
        <h3>10K+</h3>
        <p>Students</p>
      </div>
      <div className="stat">
        <h3>95%</h3>
        <p>Placement Rate</p>
      </div>
      <div className="stat">
        <h3>200+</h3>
        <p>Faculty Members</p>
      </div>
    </section>
  );
}

export default StatsSection;
