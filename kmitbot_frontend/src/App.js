

// import React from 'react';
// import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import './App.css';
// import ChatbotModel from './components/ChatbotModel';

// function App() {
//   return (
//     <Router>
//       <div>
//         <nav className="navbar">
//           <div className="navbar-logo">
//             <span>KMIT</span>
//           </div>
//           <ul className="navbar-links">
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/faq">FAQs</Link></li>
//             <li><Link to="/about">About</Link></li>
//             <li><Link to="/contact">Contact</Link></li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/faq" element={<FAQ />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//         <ChatbotModel />
//       </div>
//     </Router>
//   );
// }

// const Home = () => (
//   <div className="home-container">
//     <h1 className="animated-text">Welcome to KMIT</h1>
//     <p>Your one-stop destination for all college-related queries.</p>
//   </div>
// );

// const FAQ = () => <div><h2>FAQ Page Coming Soon!</h2></div>;
// const About = () => <div><h2>About Page Coming Soon!</h2></div>;
// const Contact = () => <div><h2>Contact Page Coming Soon!</h2></div>;

// export default App;


import React from "react";
import CarouselSection from "./components/CarouselSection";
import ChatbotModel from "./components/ChatbotModel";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import StatsSection from "./components/StatsSection";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ChatbotModel />
      <StatsSection />
      <CarouselSection />
    </>
  );
}

export default App;


// import React from "react";
// import CarouselSection from "./components/CarouselSection";
// import ChatbotModel from "./components/ChatbotModel";
// import HeroSection from "./components/HeroSection";
// import Navbar from "./components/Navbar";
// import StatsSection from "./components/StatsSection";

// function App() {
//   return (
//     <>
//       {/* Navbar for navigation */}
//       <Navbar />

//       {/* Hero Section */}
//       <HeroSection />

//       {/* Stats Section */}
//       <StatsSection />

//       {/* Carousel Section */}
//       <CarouselSection />

//       {/* Chatbot Model - Globally accessible */}
//       <ChatbotModel />
//     </>
//   );
// }

// export default App;

