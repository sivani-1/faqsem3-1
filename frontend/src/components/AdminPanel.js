import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel({ setShowAdminPanel }) {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "other",
  });
  const [editingFaq, setEditingFaq] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchFaqs();
      fetchAnalytics();
    }
  }, [token]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/admin/faqs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError("Failed to fetch FAQs");
    }
  };

  const fetchAnalytics = async () => {
    console.log("Token:", token); // Check if the token is correct
    try {
      const response = await axios.get(
        "http://localhost:4000/admin/analytics/frequent-questions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnalytics(response.data);
      console.log("analytics fetched");
      console.log("Analytics response:", response); // Inspect the response
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to fetch analytics");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingFaq) {
      setEditingFaq({ ...editingFaq, [name]: value });
    } else {
      setNewFaq({ ...newFaq, [name]: value });
    }
  };

  const handleAddFaq = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/admin/faqs",
        newFaq,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFaqs([...faqs, response.data]);
      setNewFaq({ question: "", answer: "", category: "other" });
    } catch (error) {
      console.error("Error adding FAQ:", error);
      setError("Failed to add FAQ");
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
  };

  const handleUpdateFaq = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/admin/faqs/${editingFaq._id}`,
        editingFaq,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFaqs(
        faqs.map((faq) => (faq._id === editingFaq._id ? response.data : faq))
      );
      setEditingFaq(null);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setError("Failed to update FAQ");
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/admin/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(faqs.filter((faq) => faq._id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setError("Failed to delete FAQ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redirect to the home page
  };

  // Temporary login form with hardcoded credentials (remove in production)
  const [loginCreds, setLoginCreds] = useState({ username: "", password: "" });
  const handleLogin = async () => {
    if (loginCreds.username === "sumith" && loginCreds.password === "sumith123") {
      const fakeToken = "your_fake_token";
      localStorage.setItem("token", fakeToken);
      setToken(fakeToken);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  if (!token) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={loginCreds.username}
          onChange={(e) =>
            setLoginCreds({ ...loginCreds, username: e.target.value })
          }
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={loginCreds.password}
          onChange={(e) =>
            setLoginCreds({ ...loginCreds, password: e.target.value })
          }
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Display Analytics */}
      <div className="analytics-section">
        <h3>Most Frequent Questions</h3>
        {analytics.length > 0 ? (
          <ul className="analytics-list">
            {analytics.map((item) => (
              <li key={item._id} className="analytics-item">
                {item.question} (Category: {item.category}) - Asked {item.count} times
              </li>
            ))}
          </ul>
        ) : (
          <p>No analytics data available yet.</p>
        )}
      </div>

      {/* FAQ Management */}
      <div className="faq-management-section">
        <h3>Manage FAQs</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="faq-form">
          <h4>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h4>
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={editingFaq ? editingFaq.question : newFaq.question}
            onChange={handleInputChange}
            className="faq-input"
          />
          <input
            type="text"
            name="answer"
            placeholder="Answer"
            value={editingFaq ? editingFaq.answer : newFaq.answer}
            onChange={handleInputChange}
            className="faq-input"
          />
          <select
            name="category"
            value={editingFaq ? editingFaq.category : newFaq.category}
            onChange={handleInputChange}
            className="faq-select"
          >
            <option value="other">Other</option>
            <option value="placements">Placements</option>
            <option value="subjects">Subjects</option>
            <option value="faculty">Faculty</option>
            <option value="faqs">FAQs</option>
          </select>
          {editingFaq ? (
            <button onClick={handleUpdateFaq} className="update-faq-button">
              Update FAQ
            </button>
          ) : (
            <button onClick={handleAddFaq} className="add-faq-button">
              Add FAQ
            </button>
          )}
        </div>

        <div className="faq-list-section">
          <h4>Existing FAQs</h4>
          <ul className="faq-list">
            {faqs.map((faq) => (
              <li key={faq._id} className="faq-item">
                <div className="question">
                  <b>Question :</b> {faq.question}
                </div>
                <div className="answer">
                  <b>Answer :</b> {faq.answer}
                </div>
                <div className="category">
                  <b>Category :</b> {faq.category}
                </div>
                <div className="faq-actions">
                  <button
                    onClick={() => handleEditFaq(faq)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;