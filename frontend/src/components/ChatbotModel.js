// src/components/ChatbotModel.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatbotModel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function ChatbotModel() {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('faqs');
  const chatHistoryRef = useRef(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/process_question', { question: inputText });

      const responseMessage = response.data.answer;
      const chatId = response.data._id;

      setChatHistory([
        ...chatHistory,
        { isUser: true, message: inputText },
        { isUser: false, message: responseMessage, feedback: 'neutral', _id: chatId },
      ]);

      setInputText('');
      setError(null);

      await axios.post('http://localhost:5000/storeChat', {
        question: inputText,
        answer: responseMessage,
        feedback: 'neutral',
        category: activeCategory,
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    fetchFaqs(category);
  };

  const fetchFaqs = async (category = 'faqs') => {
    try {
      const response = await axios.get(
        `http://localhost:5000/faqs?category=${category}`
      );
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    fetchFaqs(activeCategory);
  }, [activeCategory]);

  const handleFaqClick = async (question) => {
    try {
      const response = await axios.post('http://localhost:5000/process_question', { question });

      const answer = response.data.answer;
      const chatId = response.data._id;

      setChatHistory([
        ...chatHistory,
        { isUser: true, message: question },
        { isUser: false, message: answer, feedback: 'neutral', _id: chatId },
      ]);
    } catch (error) {
      console.error('Error fetching FAQ answer:', error);
    }
  };

  const handleFeedback = async (id, feedback) => {
    try {
      await axios.put(`http://localhost:5000/updateFeedback/${id}`, { feedback });
      setChatHistory(chatHistory.map((msg) =>
        msg._id === id ? { ...msg, feedback } : msg
      ));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
      <img
        src="chatbot.png"
        alt="Chatbot Icon"
        className="chatbot-icon"
        onClick={toggleChat}
      />
      {isChatOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h2>KMIT FAQ Chatbot</h2>
          </div>
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.isUser ? 'user' : 'bot'}`}
              >
                <p>{msg.message}</p>
                {!msg.isUser && (
                  <div className="feedback-buttons">
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      onClick={() => handleFeedback(msg._id, 'thumbsUp')}
                      className={msg.feedback === 'thumbsUp' ? 'active' : ''}
                    />
                    <FontAwesomeIcon
                      icon={faThumbsDown}
                      onClick={() => handleFeedback(msg._id, 'thumbsDown')}
                      className={msg.feedback === 'thumbsDown' ? 'active' : ''}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-section">
            <div className="faq-category-list">
              {['faqs', 'placements', 'subjects', 'faculty', 'other'].map((category) => (
                <button
                  key={category}
                  className={`faq-category-button ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="faq-list">
              {faqs.length > 0 &&
                faqs.map((faq, index) => (
                  <div
                  key={index}
                  className={`faq-item category-${faq.category}`} // Add category class here
                  onClick={() => handleFaqClick(faq.question)}
                >
                    <p className="faq-question-text">{faq.question}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask a question"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? <div className="spinner" /> : 'Send'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </>
  );
}

export default ChatbotModel;