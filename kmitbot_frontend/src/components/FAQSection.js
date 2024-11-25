


import React, { useState } from "react";
import "./FAQSection.css";

const faqs = [
  { question: "What is KMIT?", answer: "KMIT stands for Keshav Memorial Institute of Technology." },
  { question: "Where is KMIT located?", answer: "KMIT is located in Hyderabad, Telangana." },
  { question: "What courses are offered at KMIT?", answer: "KMIT offers various undergraduate and postgraduate courses in engineering and technology." },
  { question: "Does KMIT have hostel facilities?", answer: "Yes, KMIT provides hostel facilities for both boys and girls." },
  { question: "How to contact KMIT?", answer: "You can contact KMIT via email at info@kmit.in or call at +91-1234567890." },
];

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-toggle">{openFAQ === index ? "-" : "+"}</span>
            </div>
            {openFAQ === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
