# EvalBot - AI-Powered Interview Platform

EvalBot is a comprehensive AI-driven interview platform that automates the candidate interview process, replacing traditional human interviewers with intelligent AI systems. The platform supports multiple interview types, real-time speech recognition, AI-powered evaluation, and comprehensive admin management tools.

## 🚀 Key Features

### For Candidates
- **Automated Interviews**: AI conducts interviews using natural language processing and speech synthesis
- **Multiple Interview Types**: Computer Science and Role-Based interview domains
- **Real-Time Speech Recognition**: Voice input with live transcription and interim results
- **Resume Upload & Analysis**: AI analyzes candidate resumes to generate personalized questions
- **3D AI Avatar**: Interactive 3D avatar with animations and visual feedback
- **Live Video Recording**: Webcam integration for proctoring and monitoring
- **Fullscreen Mode**: Secure interview environment with exit prevention
- **Progress Tracking**: Real-time question progress and timer
- **Instant Feedback**: AI evaluation with scores and constructive feedback

### For Administrators
- **Collection Management**: Create and manage interview collections with detailed settings
- **Applicant Oversight**: Monitor applicant progress, scores, and completion status
- **Bulk Import**: Excel upload for adding multiple applicants at once
- **Real-Time Analytics**: Dashboard with statistics on collections, applicants, and performance
- **User Management**: Block/unblock accounts, update completion status, delete users
- **Data Export**: Download applicant data and results as CSV/Excel
- **Interview Scheduling**: Set start/end dates and times for interview windows
- **Domain & Level Configuration**: Support for different interview domains and difficulty levels

### Technical Features
- **AI Integration**: Powered by Google Gemini API for question generation and evaluation
- **Speech Processing**: Web Speech API for recognition and synthesis
- **3D Graphics**: React Three Fiber for AI avatar animations
- **Responsive Design**: Mobile and desktop optimized interfaces
- **Real-Time Updates**: Live data synchronization across components
- **Secure Authentication**: Role-based access control
- **Data Persistence**: MongoDB for reliable data storage

## 🛠 Tech Stack

### Frontend (Candidate Interface)
- **React**: Modern JavaScript library for UI components
- **React Router**: Client-side routing
- **React Three Fiber**: 3D graphics and animations
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Web Speech API**: Speech recognition and synthesis

### Backend (API Server)
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### Admin Panel
- **React**: UI framework
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **XLSX**: Excel file processing
- **Date-fns**: Date manipulation

### AI & External Services
- **Google Gemini API**: AI question generation and evaluation
- **Web Speech API**: Browser-based speech processing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup
```bash
cd Backend
npm install
# Set up environment variables in .env file
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Admin Panel Setup
```bash
cd Admin
npm install
npm run dev
```

### Environment Variables
Create `.env` file in Backend directory:
```
MONGODB_URI=mongodb://localhost:27017/evalbot
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## 🚀 Usage

### Starting the Application
1. Start MongoDB service
2. Start Backend server: `cd Backend && npm start`
3. Start Frontend: `cd Frontend && npm run dev`
4. Start Admin Panel: `cd Admin && npm run dev`

### Accessing the Platform
- **Candidate Interface**: http://localhost:5173 (or your frontend port)
- **Admin Panel**: http://localhost:5174 (or your admin port)
- **API Server**: http://localhost:5000

### Admin Workflow
1. Create interview collections with company details and requirements
2. Upload applicant data via Excel or manual entry
3. Monitor interview progress and results
4. Export data for further analysis

### Candidate Workflow
1. Access interview link with credentials
2. Upload resume and provide basic information
3. Complete AI-conducted interview with voice responses
4. Receive instant evaluation and feedback

## 📁 Project Structure

```
EvalBot/
├── Frontend/                 # Candidate interview interface
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── Pages/           # Page components
│   │   ├── Domains/         # Interview domain components
│   │   └── main.jsx         # App entry point
│   └── package.json
├── Backend/                  # API server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Express middleware
│   ├── server.js            # Server entry point
│   └── package.json
├── Admin/                    # Admin management panel
│   ├── src/
│   │   ├── Pages/           # Admin page components
│   │   └── main.jsx         # Admin app entry point
│   └── package.json
└── README.md                # This file
```

## 🔌 API Endpoints

### Collections
- `GET /api/collections` - Get all interview collections
- `POST /api/collections` - Create new collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### Users/Applicants
- `GET /api/collections/:id/users` - Get collection applicants
- `POST /api/collections/:id/users` - Add new applicant
- `PATCH /api/collections/:id/users/:userId` - Update applicant
- `DELETE /api/collections/:id/users/:userId` - Delete applicant

### Interview Results
- `POST /api/interview/results` - Save interview results
- `GET /api/interview/results/:interviewId` - Get results by interview ID

## 👨‍💼 Admin Panel Details

The Admin Panel is a React-based web application for managing interview collections and applicant data. It provides administrators with tools to create, monitor, and manage interview processes.

### Pages

#### AdminHome.jsx - Dashboard
The main dashboard page serves as the central hub for administrators to overview and manage interview collections.

**Key Features:**
- **Statistics Overview**: Displays key metrics including total collections, active jobs, total applicants, and closed jobs
- **Collection Management**: View all interview collections in a grid layout with detailed cards
- **Search & Filter**: Search collections by company, role, or interview ID; filter by domain (Computer Science/Role Based) and level (Beginner/Intermediate/Advanced)
- **Create Collections**: Button to open a popup form for creating new interview collections
- **Collection Actions**: Each collection card includes options to view details or delete the collection

**Create Collection Process:**
- Set interview ID (auto-generated, can be regenerated)
- Enter company name and role
- Provide job description
- Select domain and interview level
- Set start and end date/time
- Optionally upload Excel file with applicant data (format: Name, Email, Mobile.no)

#### AdminDetails.jsx - Collection Details
The details page provides comprehensive management tools for individual interview collections.

**Key Features:**
- **Collection Information**: Displays all collection details including company, role, interview ID, dates, domain, level, and applicant statistics
- **Edit Mode**: Toggle edit mode to modify collection details (company, role, description, dates, domain, level)
- **Applicant Management**: View all applicants in a detailed table format
- **Applicant Search & Filter**: Search by name, email, or mobile; filter by completion status or sort by score
- **Applicant Actions**:
  - Toggle interview completion status
  - Block/unblock applicant accounts
  - Delete individual applicants
- **Add Applicants**: Manually add new applicants with name, email, and mobile number
- **Export Data**: Download applicant data as CSV/Excel file
- **Collection Deletion**: Option to delete the entire collection

**Applicant Table Columns:**
- Name (with avatar)
- Email/Login ID
- Mobile/Password
- Score (with visual progress bar)
- Interview Status (Completed/Incomplete with toggle)
- Account Status (Active/Blocked with toggle)
- Actions (Block/Unblock, Delete)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**EvalBot** - Revolutionizing the interview process with AI-powered automation and intelligent evaluation.
