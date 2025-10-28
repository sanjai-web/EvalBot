const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdf = require('pdf-parse/lib/pdf-parse.js');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profession: {
    type: String,
    required: true,
    enum: ['student', 'professional']
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Interview Results Schema
const interviewResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  jobRole: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true
  },
  performanceLevel: {
    type: String,
    required: true
  },
  conversationHistory: [{
    question: String,
    answer: String,
    category: String,
    score: Number,
    isCandidateQuestion: Boolean
  }],
  knowledgeScores: {
    projects: Number,
    internships: Number,
    problemSolving: Number,
    personality: Number
  },
  timer: Number,
  totalQuestions: Number,
  answeredQuestions: Number,
  difficultyLevel: String
}, {
  timestamps: true
});

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_jwt_secret_here';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}

// Routes

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, profession } = req.body;

    // Validation
    if (!name || !email || !password || !profession) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      profession
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profession: newUser.profession,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// Protected route example (for future use)
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
});

// Change Password Route
app.post("/api/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords don't match"
      });
    }

    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// Save Interview Results Route
app.post("/api/save-interview-results", async (req, res) => {
  try {
    const {
      jobRole,
      companyName,
      overallScore,
      performanceLevel,
      conversationHistory,
      knowledgeScores,
      timer,
      totalQuestions,
      answeredQuestions,
      difficultyLevel
    } = req.body;

    // Validation
    if (!jobRole || !companyName || !overallScore) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Get user from token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create new interview result
    const newInterviewResult = new InterviewResult({
      userId: user._id,
      jobRole,
      companyName,
      overallScore,
      performanceLevel,
      conversationHistory,
      knowledgeScores,
      timer,
      totalQuestions,
      answeredQuestions,
      difficultyLevel
    });

    await newInterviewResult.save();

    res.json({
      success: true,
      message: "Interview results saved successfully",
      data: newInterviewResult
    });

  } catch (error) {
    console.error("Save interview results error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving interview results",
      error: error.message
    });
  }
});

// Get User's Interview Results Route
app.get("/api/user-interview-results", async (req, res) => {
  try {
    // Get user from token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find all interview results for the user
    const interviewResults = await InterviewResult.find({ userId: user._id })
      .sort({ date: -1 }) // Sort by most recent first
      .select('-conversationHistory'); // Exclude conversation history for list view

    res.json({
      success: true,
      data: interviewResults
    });

  } catch (error) {
    console.error("Get interview results error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching interview results",
      error: error.message
    });
  }
});

// Get Specific Interview Result by ID
app.get("/api/interview-result/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get user from token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find interview result and ensure it belongs to the user
    const interviewResult = await InterviewResult.findOne({
      _id: id,
      userId: decoded.userId
    });

    if (!interviewResult) {
      return res.status(404).json({
        success: false,
        message: "Interview result not found"
      });
    }

    res.json({
      success: true,
      data: interviewResult
    });

  } catch (error) {
    console.error("Get specific interview result error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching interview result",
      error: error.message
    });
  }
});

// Process Interview Details Route (WITH PDF EXTRACTION)
app.post("/api/process-interview-details", upload.single('resume'), async (req, res) => {
  try {
    const { jobName, companyName, jobDescription, questionLevel } = req.body;
    const resumeFile = req.file;

    // Validation
    if (!jobName || !companyName || !jobDescription || !questionLevel) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required"
      });
    }

    let resumeText = '';
    
    try {
      // Extract text based on file type
      if (resumeFile.mimetype === 'application/pdf') {
        console.log('📄 Extracting text from PDF...');
        resumeText = await extractTextFromPDF(resumeFile.path);
        console.log('✅ PDF text extraction successful!');
      } 
      else if (resumeFile.mimetype === 'text/plain') {
        console.log('📄 Reading text file...');
        resumeText = fs.readFileSync(resumeFile.path, 'utf8');
        console.log('✅ Text file read successfully!');
      } 
      else if (resumeFile.mimetype === 'application/msword' || 
               resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        resumeText = 'DOC/DOCX file uploaded. Text extraction for Word documents requires additional libraries (mammoth or docx-parser).';
        console.log('⚠️ Word document uploaded - text extraction not implemented yet');
      }
      else {
        resumeText = 'File uploaded successfully';
      }
    } catch (extractionError) {
      console.error('❌ Text extraction error:', extractionError);
      resumeText = `Error extracting text: ${extractionError.message}`;
    }

    // Clean up uploaded file
    try {
      if (fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
        console.log('🗑️ Uploaded file cleaned up successfully');
      }
    } catch (cleanupError) {
      console.error('❌ File cleanup error:', cleanupError);
    }

    // Log all details to console
    console.log('\n' + '='.repeat(50));
    console.log('📋 JOB INTERVIEW DETAILS SUBMITTED');
    console.log('='.repeat(50));
    console.log('👔 Job Title:', jobName);
    console.log('🏢 Company Name:', companyName);
    console.log('📝 Job Description:', jobDescription);
    console.log('📊 Question Level:', questionLevel);
    console.log('-'.repeat(50));
    console.log('📎 Resume File Name:', resumeFile.originalname);
    console.log('📄 Resume File Type:', resumeFile.mimetype);
    console.log('💾 Resume File Size:', `${(resumeFile.size / 1024).toFixed(2)} KB`);
    console.log('-'.repeat(50));
    console.log('📖 RESUME TEXT CONTENT:');
    console.log('-'.repeat(50));
    console.log(resumeText);
    console.log('='.repeat(50) + '\n');

    // Return success response
    res.json({
      success: true,
      message: "Interview details processed successfully",
      data: {
        jobName,
        companyName,
        jobDescription,
        questionLevel,
        resume: {
          fileName: resumeFile.originalname,
          fileType: resumeFile.mimetype,
          fileSize: `${(resumeFile.size / 1024).toFixed(2)} KB`,
          textContent: resumeText
        }
      }
    });

  } catch (error) {
    console.error("❌ Process interview details error:", error);
    
    // Clean up file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error processing interview details",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));