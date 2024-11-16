import axios from 'axios';
import React, { useState } from 'react';
import './ChatbotModel.css';

function ChatbotModel() {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
  
    setLoading(true);
    try {
      const response = await axios.post('https://9a13-34-23-211-77.ngrok-free.app/process_question', {
        question: inputText,
      });
      const responseMessage = response.data.answer;
  
      // Store question and answer in chat history state
      setChatHistory([...chatHistory, { isUser: true, message: inputText }, { isUser: false, message: responseMessage }]);
      setInputText('');
  
      // Send the question and answer to the backend to store in MongoDB
      await axios.post('http://localhost:5000/storeChat', {
        question: inputText,
        answer: responseMessage,
      });
  
      setError(null);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <img
        src="chatbot.png"  // Make sure to add chatbot-icon.png to the public or src/assets folder
        alt="Chatbot Icon"
        className="chatbot-icon"
        onClick={toggleChat}
      />
      {isChatOpen && (
        <div className="chatbot-container">
          <div className="chat-history">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.isUser ? 'user' : 'bot'}`}>
                {message.message}
              </div>
            ))}
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotModel;
