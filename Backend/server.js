require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI ;

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
  interviewId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Collection Schema (Interview Details)
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
    enum: ['Computer Science', 'Role Based'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
const Collection = mongoose.model('Collection', collectionSchema);

// ==================== COLLECTION ROUTES ====================

// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    
    // Update applicant count for each collection
    for (let collection of collections) {
      const userCount = await User.countDocuments({ interviewId: collection.interviewId });
      if (collection.applicants !== userCount) {
        collection.applicants = userCount;
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
    
    // Update applicant count
    const userCount = await User.countDocuments({ interviewId: collection.interviewId });
    collection.applicants = userCount;
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
    const { interviewId, company, role, description, domain, level, startDateTime, endDateTime, fileName, users } = req.body;

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

    // Create collection
    const collection = new Collection({
      interviewId,
      company,
      role,
      description,
      domain,
      level,
      startDateTime,
      endDateTime,
      fileName: fileName || '',
      status: 'Active',
      applicants: users ? users.length : 0
    });

    await collection.save();

    // Create users if provided
    if (users && users.length > 0) {
      const usersWithInterviewId = users.map(user => ({
        ...user,
        interviewId: interviewId
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
    const { company, role, description, domain, level, startDateTime, endDateTime, fileName, status } = req.body;
    
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

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        company,
        role,
        description,
        domain,
        level,
        startDateTime,
        endDateTime,
        fileName,
        status,
        updatedAt: Date.now()
      },
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

// Update user (e.g., block/unblock, update score)
app.patch('/api/collections/:collectionId/users/:userId', async (req, res) => {
  try {
    const { status, score } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (score !== undefined) updateData.score = score;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
        interviewId: user.interviewId
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

// ==================== STATISTICS ROUTES ====================

// Get dashboard statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const totalCollections = await Collection.countDocuments();
    const activeCollections = await Collection.countDocuments({ status: 'Active' });
    const closedCollections = await Collection.countDocuments({ status: 'Closed' });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const blockedUsers = await User.countDocuments({ status: 'Blocked' });

    res.json({
      collections: {
        total: totalCollections,
        active: activeCollections,
        closed: closedCollections
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers
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