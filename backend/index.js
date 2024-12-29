// Backend (Node.js/Express - index.js)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const natural = require('natural');
const axios = require('axios');
const app = express();
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication

const allowedOrigins = ['http://localhost:3000','http://localhost:5000',  'https://yourfrontendurl.com']; // Replace with your frontend URL
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Chat History Schema
const chatHistorySchema = new mongoose.Schema({
  question: { type: String, required: true },
  normalizedQuestion: { type: String, required: true },
  answer: { type: String, required: true },
  feedback: { type: String, enum: ['thumbsUp', 'thumbsDown', 'neutral'], default: 'neutral' },
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 },
  category: { type: String, default: 'other' },
  timestamp: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema);

// Normalize question function
function normalizeQuestion(question) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(question.toLowerCase());
  const stemmedWords = words.map((word) => natural.PorterStemmer.stem(word));
  return stemmedWords.join(' ');
}

// --- Authentication Routes ---

// Register an admin (for initial setup, you might want to remove or restrict this later)
app.post('/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// Login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// --- Middleware to verify JWT ---
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user; // Store user information in req.user
    next();
  });
}

// --- Admin Routes for CRUD operations (FAQs) ---

// Get all FAQs (for admin panel)
app.get('/admin/faqs', verifyToken, async (req, res) => {
  try {
    const faqs = await ChatHistory.find().sort({ count: -1 }); // Sort by frequency
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Add a new FAQ
app.post('/admin/faqs', verifyToken, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const normalizedQuestion = normalizeQuestion(question);
    const newFaq = new ChatHistory({ question, answer, category, normalizedQuestion, count: 0 }); // New FAQs might have count 0
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// Update an FAQ
app.put('/admin/faqs/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;
    const updatedFaq = await ChatHistory.findByIdAndUpdate(id, { question, answer, category }, { new: true });
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete an FAQ
app.delete('/admin/faqs/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await ChatHistory.findByIdAndDelete(id);
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// --- Analytics Route ---

// Get most frequent questions (analytics)
app.get('/analytics/frequent-questions',verifyToken, async (req, res) => {
  try {
    console.log("User from token (req.user):", req.user); // Check if user is set by verifyToken
    const frequentQuestions = await ChatHistory.aggregate([
      { $match: { count: { $gt: 0 } } }, // Only consider questions with count > 0
      {
        $group: {
          _id: '$normalizedQuestion',
          count: { $sum: '$count' },
          question: { $first: '$question' },
          category: { $first: '$category' }, // Include category
          answer: { $first: '$answer' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Get top 10
    ]);
    console.log("Frequent questions (after aggregation):", frequentQuestions);

    res.status(200).json(frequentQuestions);
  } catch (error) {
    console.error('Error fetching frequent questions:', error);
    res.status(500).json({ error: 'Failed to fetch frequent questions' });
  }
});

// --- Regular User Routes ---
app.post('/process_question', async (req, res) => {
    const { question } = req.body;
  
    try {
      const normalizedQuestion = normalizeQuestion(question);
  
      let existingChat = await ChatHistory.findOne({ normalizedQuestion });
  
      if (existingChat) {
        existingChat.count += 1;
        await existingChat.save();
  
        return res.status(200).json({ answer: existingChat.answer, _id: existingChat._id });
  
      } else {
        const apiResponse = await axios.post('https://5285-34-168-84-38.ngrok-free.app/process_question', { question }); // Replace with your Flask app URL
        const answer = apiResponse.data.answer;
  
        const newChatEntry = new ChatHistory({ question, normalizedQuestion, answer, count: 1 });
        await newChatEntry.save();
  
        return res.status(200).json({ answer, _id: newChatEntry._id });
      }
    } catch (error) {
      console.error('Error processing question:', error);
      res.status(500).json({ error: 'Failed to process the question.' });
    }
  });
  
  app.post('/storeChat', async (req, res) => {
    try {
      const { question, category, answer, feedback } = req.body;
      const normalizedQuestion = normalizeQuestion(question);
  
      let chatEntry = await ChatHistory.findOne({ normalizedQuestion });
  
      if (chatEntry) {
        if (question.toLowerCase().includes(category.toLowerCase())) {
          chatEntry.category = category;
        } else {
          chatEntry.category = 'other';
        }
  
        if (feedback === 'thumbsUp') {
          chatEntry.thumbsUp += 1;
        } else if (feedback === 'thumbsDown') {
          chatEntry.thumbsDown += 1;
        }
  
        await chatEntry.save();
        return res.status(200).json({ _id: chatEntry._id, message: 'Chat updated' });
      } else {
        chatEntry = new ChatHistory({
          question,
          normalizedQuestion,
          category: question.toLowerCase().includes(category.toLowerCase()) ? category : 'other',
          answer,
          feedback,
          count: 1,
        });
        const savedMessage = await chatEntry.save();
        res.status(200).json({ _id: savedMessage._id, message: 'Chat history saved.' });
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
      res.status(500).json({ error: 'Failed to save chat history.' });
    }
  });
  
  // /faqs route:
  app.get('/faqs', async (req, res) => {
    const { category } = req.query;
  
    try {
      let query = {};
      if (category && category !== 'faqs') {
        query = { category };
      }
  
      let faqs;
      if (category === 'faqs') {
          faqs = await ChatHistory.aggregate([
            { $match: { category: { $ne: 'placements' } && { $ne: 'subjects' } && { $ne: 'faculty' } && { $ne: 'other' } }  }, 
            {
              $group: {
                _id: '$normalizedQuestion',
                count: { $sum: '$count' },
                question: { $first: '$question' },
                answer: { $first: '$answer' },
                thumbsUp: { $first: '$thumbsUp' },
                category: { $first: '$category' }
              },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ]);
        } else {
          faqs = await ChatHistory.find(query).sort({ thumbsUp: -1 }).limit(5);
        }
    
        res.status(200).json(faqs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs.' });
      }
    });
    
    app.put('/updateFeedback/:id', async (req, res) => {
      const { id } = req.params;
      const { feedback } = req.body;
    
      try {
        const chat = await ChatHistory.findById(id);
        if (!chat) {
          return res.status(404).json({ error: 'Chat not found.' });
        }
    
        if (feedback === 'thumbsUp') {
          chat.feedback = 'thumbsUp';
          chat.thumbsUp += 1;
        } else if (feedback === 'thumbsDown') {
          chat.feedback = 'thumbsDown';
          chat.thumbsDown += 1;
        } else {
          chat.feedback = 'neutral';
        }
    
        await chat.save();
    
        res.status(200).json({ message: 'Feedback updated successfully.', chat });
      } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Failed to update feedback.' });
      }
    });
    
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });