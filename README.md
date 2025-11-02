# EvalBot - AI-Powered Interview Preparation Platform

An intelligent interview preparation platform that helps job seekers practice and improve their interview skills using AI technology.

## 🚀 Features

- **AI-Powered Interviews**: Practice with intelligent interview simulations that adapt to your responses
- **Real-time Feedback**: Get instant analysis on communication skills and technical knowledge
- **Resume Analysis**: Upload and analyze resumes (PDF, DOC, DOCX, TXT formats)
- **Performance Tracking**: Save and review interview results with detailed scoring
- **Role-Based Questions**: Customizable difficulty levels and job-specific questions
- **User Authentication**: Secure login/signup with JWT tokens
- **Admin Dashboard**: Administrative interface for managing the platform

## 🏗️ Architecture

The application consists of three main components:

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Routing**: React Router DOM
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with PDF parsing
- **Security**: CORS enabled

### Admin Panel
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Startup - EvalBot/Application"
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   
   Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Admin Panel Setup**
   ```bash
   cd ../Admin
   npm install
   ```

## 🚀 Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Start the Admin Panel**
   ```bash
   cd Admin
   npm run dev
   ```
   Admin panel runs on `http://localhost:5174`

## 📁 Project Structure

```
Application/
├── Backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── Frontend/
│   ├── src/
│   │   ├── Pages/         # React pages
│   │   ├── components/    # Reusable components
│   │   ├── Domains/       # Domain-specific components
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
└── Admin/
    ├── src/
    │   └── Pages/         # Admin pages
    └── package.json       # Admin dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `POST /api/change-password` - Change password

### Interview Management
- `POST /api/process-interview-details` - Process job details and resume
- `POST /api/save-interview-results` - Save interview results
- `GET /api/user-interview-results` - Get user's interview history
- `GET /api/interview-result/:id` - Get specific interview result

## 🎯 Key Features Explained

### Resume Processing
- Supports PDF, DOC, DOCX, and TXT file formats
- Extracts text content for AI analysis
- File size limit: 5MB

### Interview Scoring
- Overall performance scoring
- Category-based knowledge assessment
- Performance level classification
- Detailed conversation history tracking

### User Management
- Secure password hashing with bcrypt
- JWT-based authentication
- User profile management
- Interview history tracking

## 🔒 Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- CORS protection
- File type validation for uploads
- Input validation and sanitization

## 🛠️ Development

### Frontend Development
```bash
cd Frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

### Backend Development
```bash
cd Backend
npm start      # Start server
```

## 📦 Dependencies

### Backend
- Express.js - Web framework
- MongoDB/Mongoose - Database
- JWT - Authentication
- Multer - File uploads
- PDF-parse - PDF text extraction
- bcryptjs - Password hashing

### Frontend
- React 19 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Three.js - 3D graphics
- Axios - HTTP client
- React Router - Navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.