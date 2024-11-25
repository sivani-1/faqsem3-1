




import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CarouselSection from "./components/CarouselSection";
import ChatbotModel from "./components/ChatbotModel";
import FAQSection from "./components/FAQSection";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import StatsSection from "./components/StatsSection";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <StatsSection />
                <CarouselSection />
              </>
            }
          />
          <Route path="/faqs" element={<FAQSection />} />
        </Routes>
        <ChatbotModel />
      </div>
    </Router>
  );
}

export default App;
