require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/evalbot';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema (for applicants under each interview)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  loginId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  },
  completionStatus: {
    type: String,
    enum: ['Completed', 'Incomplete'],
    default: 'Incomplete'
  },
  interviewId: {
    type: String,
    required: true,
    index: true
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Collection Schema (Interview Details) - UPDATED
const collectionSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 8
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['Computer Science', 'Role Based', 'Quiz', 'Code Test'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: function() {
      // Level is required only for Computer Science and Role Based domains
      return this.domain === 'Computer Science' || this.domain === 'Role Based';
    }
  },
  timeLimit: {
    type: Number,
    min: 1,
    max: 300,
    required: function() {
      // Time limit is required only for Quiz and Code Test domains
      return this.domain === 'Quiz' || this.domain === 'Code Test';
    },
    default: 30
  },
  startDateTime: {
    type: String,
    required: true
  },
  endDateTime: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  applicants: {
    type: Number,
    default: 0
  },
  completedApplicants: {
    type: Number,
    default: 0
  },
  questions: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Interview Results Schema - UPDATED
const interviewResultSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  level: {
    type: String
  },
  timeLimit: {
    type: Number
  },
  conversationHistory: [{
    category: String,
    question: String,
    answer: String,
    evaluation: String,
    score: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  knowledgeScores: {
    projects: Number,
    internships: Number,
    problemSolving: Number,
    personality: Number
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  totalQuestions: Number,
  answeredQuestions: Number,
  interviewDuration: Number, // in seconds
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Quiz/Coding Test Result Schema - NEW
const testResultSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['Quiz', 'Code Test'],
    required: true
  },
  timeLimit: {
    type: Number,
    required: true
  },
  testData: {
    type: Object,
    default: {}
  },
  // For Quiz
  quizAnswers: [{
    questionId: String,
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    category: String,
    difficulty: String,
    score: Number,
    timeTaken: Number // in seconds
  }],
  // For Code Test
  codeSolutions: [{
    questionId: String,
    question: String,
    code: String,
    language: String,
    testCasesPassed: Number,
    totalTestCases: Number,
    score: Number,
    timeTaken: Number // in seconds
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  totalQuestions: Number,
  completedQuestions: Number,
  timeSpent: Number, // in seconds
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Timed Out'],
    default: 'Completed'
  }
});

// Update timestamp on save
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
const Collection = mongoose.model('Collection', collectionSchema);
const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
const TestResult = mongoose.model('TestResult', testResultSchema);

// ==================== COLLECTION ROUTES ====================

// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    
    // Update applicant count and completed count for each collection
    for (let collection of collections) {
      const userCount = await User.countDocuments({ interviewId: collection.interviewId });
      const completedCount = await User.countDocuments({ 
        interviewId: collection.interviewId, 
        completionStatus: 'Completed' 
      });
      
      if (collection.applicants !== userCount || collection.completedApplicants !== completedCount) {
        collection.applicants = userCount;
        collection.completedApplicants = completedCount;
        await collection.save();
      }
    }
    
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single collection by ID
app.get('/api/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Update applicant count and completed count
    const userCount = await User.countDocuments({ interviewId: collection.interviewId });
    const completedCount = await User.countDocuments({ 
      interviewId: collection.interviewId, 
      completionStatus: 'Completed' 
    });
    
    collection.applicants = userCount;
    collection.completedApplicants = completedCount;
    await collection.save();
    
    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new collection
app.post('/api/collections', async (req, res) => {
  try {
    const { interviewId, company, role, description, domain, level, timeLimit, startDateTime, endDateTime, fileName, users } = req.body;

    // Check if interviewId already exists
    const existingCollection = await Collection.findOne({ interviewId });
    if (existingCollection) {
      return res.status(400).json({ message: 'Interview ID already exists' });
    }

    // Validate date times
    const parseCustomDateTime = (dateTimeStr) => {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
    };

    const start = parseCustomDateTime(startDateTime);
    const end = parseCustomDateTime(endDateTime);
    
    if (start >= end) {
      return res.status(400).json({ message: 'End date & time must be after start date & time' });
    }

    // Validate time limit for Quiz/Code Test
    if ((domain === 'Quiz' || domain === 'Code Test') && (!timeLimit || timeLimit <= 0)) {
      return res.status(400).json({ message: 'Time limit is required for Quiz and Code Test domains' });
    }

    // Validate level for Computer Science/Role Based
    if ((domain === 'Computer Science' || domain === 'Role Based') && !level) {
      return res.status(400).json({ message: 'Level is required for Computer Science and Role Based domains' });
    }

    // Create collection
    const collection = new Collection({
      interviewId,
      company,
      role,
      description,
      domain,
      level: (domain === 'Computer Science' || domain === 'Role Based') ? level : null,
      timeLimit: (domain === 'Quiz' || domain === 'Code Test') ? timeLimit : null,
      startDateTime,
      endDateTime,
      fileName: fileName || '',
      status: 'Active',
      applicants: users ? users.length : 0,
      completedApplicants: 0
    });

    await collection.save();

    // Create users if provided
    if (users && users.length > 0) {
      const usersWithInterviewId = users.map(user => ({
        ...user,
        interviewId: interviewId,
        completionStatus: user.completionStatus || 'Incomplete'
      }));
      
      await User.insertMany(usersWithInterviewId);
    }

    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update collection
app.put('/api/collections/:id', async (req, res) => {
  try {
    const { company, role, description, domain, level, timeLimit, startDateTime, endDateTime, fileName, status } = req.body;
    
    // Validate date times if both are provided
    if (startDateTime && endDateTime) {
      const parseCustomDateTime = (dateTimeStr) => {
        const [datePart, timePart] = dateTimeStr.split(' ');
        const [day, month, year] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');
        return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
      };

      const start = parseCustomDateTime(startDateTime);
      const end = parseCustomDateTime(endDateTime);
      
      if (start >= end) {
        return res.status(400).json({ message: 'End date & time must be after start date & time' });
      }
    }

    // Validate domain-specific fields
    const updateData = {
      company,
      role,
      description,
      domain,
      startDateTime,
      endDateTime,
      fileName,
      status,
      updatedAt: Date.now()
    };

    if (req.body.questions) {
      updateData.questions = req.body.questions;
    }

    // Handle level for Computer Science/Role Based
    if (domain === 'Computer Science' || domain === 'Role Based') {
      if (!level) {
        return res.status(400).json({ message: 'Level is required for Computer Science and Role Based domains' });
      }
      updateData.level = level;
      updateData.timeLimit = null;
    } 
    // Handle time limit for Quiz/Code Test
    else if (domain === 'Quiz' || domain === 'Code Test') {
      if (!timeLimit || timeLimit <= 0) {
        return res.status(400).json({ message: 'Time limit is required for Quiz and Code Test domains' });
      }
      updateData.timeLimit = timeLimit;
      updateData.level = null;
    }

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete collection
app.delete('/api/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Delete all users associated with this interview
    await User.deleteMany({ interviewId: collection.interviewId });
    
    // Delete the collection
    await Collection.findByIdAndDelete(req.params.id);

    res.json({ message: 'Collection and associated users deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get all users for a specific collection
app.get('/api/collections/:id/users', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const users = await User.find({ interviewId: collection.interviewId }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new user to a collection
app.post('/api/collections/:id/users', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { name, loginId, password, score, status } = req.body;

    // Check if user with same loginId already exists for this interview
    const existingUser = await User.findOne({ 
      loginId: loginId.toLowerCase(), 
      interviewId: collection.interviewId 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists for this interview' });
    }

    const user = new User({
      name,
      loginId: loginId.toLowerCase(),
      password,
      score: score || 0,
      status: status || 'Active',
      completionStatus: 'Incomplete',
      interviewId: collection.interviewId
    });

    await user.save();

    // Update applicant count
    collection.applicants += 1;
    await collection.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (e.g., block/unblock, update score, update completion status)
app.patch('/api/collections/:collectionId/users/:userId', async (req, res) => {
  try {
    const { status, score, completionStatus } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (score !== undefined) updateData.score = score;
    if (completionStatus) {
      updateData.completionStatus = completionStatus;
      if (completionStatus === 'Completed') {
        updateData.completedAt = new Date();
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update completed applicants count in collection if completion status changed
    if (completionStatus) {
      const collection = await Collection.findById(req.params.collectionId);
      if (collection) {
        const completedCount = await User.countDocuments({ 
          interviewId: collection.interviewId, 
          completionStatus: 'Completed' 
        });
        collection.completedApplicants = completedCount;
        await collection.save();
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
app.delete('/api/collections/:collectionId/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update applicant count in collection
    const collection = await Collection.findById(req.params.collectionId);
    if (collection) {
      collection.applicants = Math.max(0, collection.applicants - 1);
      if (user.completionStatus === 'Completed') {
        collection.completedApplicants = Math.max(0, collection.completedApplicants - 1);
      }
      await collection.save();
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// User login (for frontend interview access)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { interviewId, loginId, password } = req.body;

    // Find user
    const user = await User.findOne({
      interviewId: interviewId.toUpperCase(),
      loginId: loginId.toLowerCase(),
      password: password
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.status === 'Blocked') {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    // Get collection details
    const collection = await Collection.findOne({ interviewId: user.interviewId });

    if (!collection) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if interview is within scheduled time
    const parseCustomDateTime = (dateTimeStr) => {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
    };

    const now = new Date();
    const start = parseCustomDateTime(collection.startDateTime);
    const end = parseCustomDateTime(collection.endDateTime);

    if (now < start) {
      return res.status(403).json({ 
        message: `Interview has not started yet. It will begin on ${collection.startDateTime}` 
      });
    }

    if (now > end) {
      return res.status(403).json({ 
        message: `Interview has ended. It was scheduled until ${collection.endDateTime}` 
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        loginId: user.loginId,
        score: user.score,
        interviewId: user.interviewId,
        completionStatus: user.completionStatus
      },
      collection: collection
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by interviewId and loginId
app.get('/api/users/:interviewId/:loginId', async (req, res) => {
  try {
    const user = await User.findOne({
      interviewId: req.params.interviewId.toUpperCase(),
      loginId: req.params.loginId.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== INTERVIEW RESULTS ROUTES ====================

// Save interview results
app.post('/api/interview/results', async (req, res) => {
  try {
    const {
      interviewId,
      userId,
      userName,
      userEmail,
      company,
      role,
      domain,
      level,
      timeLimit,
      conversationHistory,
      knowledgeScores,
      overallScore,
      totalQuestions,
      answeredQuestions,
      interviewDuration
    } = req.body;

    // Calculate overall score if not provided
    const calculatedScore = overallScore || Math.round(
      Object.values(knowledgeScores).reduce((sum, score) => sum + score, 0) / 
      Object.values(knowledgeScores).length
    );

    const interviewResult = new InterviewResult({
      interviewId,
      userId,
      userName,
      userEmail,
      company,
      role,
      domain,
      level,
      timeLimit,
      conversationHistory,
      knowledgeScores,
      overallScore: calculatedScore,
      totalQuestions,
      answeredQuestions,
      interviewDuration
    });

    await interviewResult.save();

    // Update user's score and completion status in the User collection
    await User.findByIdAndUpdate(userId, {
      score: calculatedScore,
      completionStatus: 'Completed',
      completedAt: new Date()
    });

    // Update completed applicants count in collection
    const collection = await Collection.findOne({ interviewId });
    if (collection) {
      const completedCount = await User.countDocuments({ 
        interviewId: collection.interviewId, 
        completionStatus: 'Completed' 
      });
      collection.completedApplicants = completedCount;
      await collection.save();
    }

    res.status(201).json({
      message: 'Interview results saved successfully',
      result: interviewResult
    });
  } catch (error) {
    console.error('Error saving interview results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get interview results for a user
app.get('/api/interview/results/:userId', async (req, res) => {
  try {
    const results = await InterviewResult.find({ userId: req.params.userId })
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching interview results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get interview results for a collection
app.get('/api/collections/:interviewId/results', async (req, res) => {
  try {
    const results = await InterviewResult.find({ interviewId: req.params.interviewId })
      .sort({ overallScore: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching collection results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== TEST RESULTS ROUTES (Quiz/Code Test) ====================

// Save test results (Quiz or Code Test)
app.post('/api/test/results', async (req, res) => {
  try {
    const {
      interviewId,
      userId,
      userName,
      userEmail,
      company,
      role,
      domain,
      timeLimit,
      testData,
      quizAnswers,
      codeSolutions,
      overallScore,
      totalQuestions,
      completedQuestions,
      timeSpent,
      status
    } = req.body;

    // Validate domain
    if (domain !== 'Quiz' && domain !== 'Code Test') {
      return res.status(400).json({ message: 'Invalid domain for test results' });
    }

    const testResult = new TestResult({
      interviewId,
      userId,
      userName,
      userEmail,
      company,
      role,
      domain,
      timeLimit,
      testData,
      quizAnswers: domain === 'Quiz' ? quizAnswers : [],
      codeSolutions: domain === 'Code Test' ? codeSolutions : [],
      overallScore,
      totalQuestions,
      completedQuestions,
      timeSpent,
      status: status || 'Completed'
    });

    await testResult.save();

    // Update user's score and completion status in the User collection
    await User.findByIdAndUpdate(userId, {
      score: overallScore || 0,
      completionStatus: 'Completed',
      completedAt: new Date()
    });

    // Update completed applicants count in collection
    const collection = await Collection.findOne({ interviewId });
    if (collection) {
      const completedCount = await User.countDocuments({ 
        interviewId: collection.interviewId, 
        completionStatus: 'Completed' 
      });
      collection.completedApplicants = completedCount;
      await collection.save();
    }

    res.status(201).json({
      message: 'Test results saved successfully',
      result: testResult
    });
  } catch (error) {
    console.error('Error saving test results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get test results for a user
app.get('/api/test/results/:userId', async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.params.userId })
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get test results for a collection
app.get('/api/collections/:interviewId/test-results', async (req, res) => {
  try {
    const results = await TestResult.find({ interviewId: req.params.interviewId })
      .sort({ overallScore: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching collection test results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start a test (record start time)
app.post('/api/test/start', async (req, res) => {
  try {
    const { interviewId, userId, userName, userEmail, company, role, domain, timeLimit } = req.body;

    // Check if test already in progress
    const existingTest = await TestResult.findOne({
      interviewId,
      userId,
      status: 'In Progress'
    });

    if (existingTest) {
      return res.status(400).json({ message: 'Test already in progress' });
    }

    const testResult = new TestResult({
      interviewId,
      userId,
      userName,
      userEmail,
      company,
      role,
      domain,
      timeLimit,
      status: 'In Progress',
      startedAt: new Date()
    });

    await testResult.save();

    res.status(201).json({
      message: 'Test started successfully',
      testId: testResult._id
    });
  } catch (error) {
    console.error('Error starting test:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update test progress
app.patch('/api/test/progress/:testId', async (req, res) => {
  try {
    const { quizAnswers, codeSolutions, completedQuestions, timeSpent } = req.body;

    const updateData = {};
    if (quizAnswers) updateData.quizAnswers = quizAnswers;
    if (codeSolutions) updateData.codeSolutions = codeSolutions;
    if (completedQuestions !== undefined) updateData.completedQuestions = completedQuestions;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;

    const testResult = await TestResult.findByIdAndUpdate(
      req.params.testId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testResult) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(testResult);
  } catch (error) {
    console.error('Error updating test progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== STATISTICS ROUTES ====================

// Get dashboard statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const totalCollections = await Collection.countDocuments();
    const activeCollections = await Collection.countDocuments({ status: 'Active' });
    const closedCollections = await Collection.countDocuments({ status: 'Closed' });
    
    // Domain-wise statistics
    const computerScienceCollections = await Collection.countDocuments({ domain: 'Computer Science' });
    const roleBasedCollections = await Collection.countDocuments({ domain: 'Role Based' });
    const quizCollections = await Collection.countDocuments({ domain: 'Quiz' });
    const codeTestCollections = await Collection.countDocuments({ domain: 'Code Test' });

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const blockedUsers = await User.countDocuments({ status: 'Blocked' });
    const completedInterviews = await User.countDocuments({ completionStatus: 'Completed' });

    res.json({
      collections: {
        total: totalCollections,
        active: activeCollections,
        closed: closedCollections,
        byDomain: {
          computerScience: computerScienceCollections,
          roleBased: roleBasedCollections,
          quiz: quizCollections,
          codeTest: codeTestCollections
        }
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        completed: completedInterviews
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'EvalBot API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});