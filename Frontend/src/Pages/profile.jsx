import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaBuilding, FaChartBar, FaEye, FaStar, FaAward, FaBars, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [interviewResults, setInterviewResults] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  
  const navigate = useNavigate();

  // API Base URL with OR operator for local and production
  const API_BASE_URL = 'https://resume-interview-backend.onrender.com' || 'http://localhost:5000';

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    fetchInterviewResults();
  }, []);

  const fetchInterviewResults = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Updated fetch call using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/user-interview-results`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setInterviewResults(data.data);
      }
    } catch (error) {
      console.error("Error fetching interview results:", error);
    } finally {
      setLoadingInterviews(false);
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-100';
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 55) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewResults = (interviewId) => {
    // Navigate to results page with the specific interview ID
    navigate('/result', { state: { interviewId } });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Updated fetch call using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password changed successfully! Redirecting to login...");
        
        // Clear local storage and redirect to login after 2 seconds
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMessage("An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{userData.name}</h1>
                <p className="text-gray-600 text-sm">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome {userData.name}</h1>
                <p className="text-gray-600">{userData.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {userData.profession === 'student' ? '🎓 Student' : '💼 Professional'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mb-4">
            <nav className="flex flex-col space-y-2">
              {['overview', 'interviews', 'personal', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
                    activeTab === tab
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm p-1 mb-6">
          <nav className="flex space-x-2">
            {['overview', 'interviews', 'personal', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Overview</h2>
              
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 break-all">{userData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Profession</label>
                      <p className="text-gray-900 capitalize">{userData.profession}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm sm:text-base">Email Verification</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm sm:text-base">Account Type</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userData.profession === 'student' ? 'Student' : 'Professional'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm sm:text-base">Member Since</span>
                      <span className="text-sm text-gray-500">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{interviewResults.length}</div>
                  <div className="text-xs sm:text-sm text-blue-800">Interviews Taken</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {interviewResults.length > 0 
                      ? Math.round(interviewResults.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewResults.length)
                      : 0
                    }%
                  </div>
                  <div className="text-xs sm:text-sm text-green-800">Average Score</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {interviewResults.filter(interview => interview.overallScore >= 70).length}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-800">Passed Interviews</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">
                    {new Set(interviewResults.map(interview => interview.companyName)).size}
                  </div>
                  <div className="text-xs sm:text-sm text-amber-800">Companies Practiced</div>
                </div>
              </div>

              {/* Recent Interviews Preview */}
              {interviewResults.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Interviews</h3>
                  <div className="space-y-3">
                    {interviewResults.slice(0, 3).map((interview, index) => (
                      <div key={interview._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{interview.jobRole}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <FaBuilding className="w-3 h-3 mr-1" />
                              {interview.companyName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <FaCalendar className="w-3 h-3 mr-1" />
                              {formatDate(interview.date)}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(interview.overallScore)}`}>
                              {interview.overallScore}%
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{interview.performanceLevel}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Interview History</h2>
                <span className="text-sm text-gray-500">
                  {interviewResults.length} interview{interviewResults.length !== 1 ? 's' : ''} taken
                </span>
              </div>

              {loadingInterviews ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading interview history...</p>
                </div>
              ) : interviewResults.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartBar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
                  <p className="text-gray-500 mb-6 px-4">Complete your first mock interview to see your results here.</p>
                  <button
                    onClick={() => navigate('/details')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Start an Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviewResults.map((interview) => (
                    <div key={interview._id} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{interview.jobRole}</h3>
                              <p className="text-gray-600 flex items-center mt-1">
                                <FaBuilding className="w-4 h-4 mr-2" />
                                {interview.companyName}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 space-y-1 sm:space-y-0">
                                <span className="flex items-center">
                                  <FaCalendar className="w-3 h-3 mr-1" />
                                  {formatDate(interview.date)}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="capitalize">{interview.difficultyLevel} Level</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{interview.answeredQuestions}/{interview.totalQuestions} questions</span>
                              </div>
                            </div>
                            
                            <div className="mt-2 sm:mt-0 sm:text-right sm:ml-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(interview.overallScore)}`}>
                                {interview.overallScore}%
                              </span>
                              <p className="text-xs text-gray-500 mt-1">{interview.performanceLevel}</p>
                            </div>
                          </div>

                          {/* Skills Breakdown */}
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Projects</div>
                              <div className="text-sm font-semibold text-blue-600">{interview.knowledgeScores.projects}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Problem Solving</div>
                              <div className="text-sm font-semibold text-green-600">{interview.knowledgeScores.problemSolving}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Personality</div>
                              <div className="text-sm font-semibold text-purple-600">{interview.knowledgeScores.personality}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Internships</div>
                              <div className="text-sm font-semibold text-orange-600">{interview.knowledgeScores.internships}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2 sm:space-x-3">
                        <button
                          onClick={() => handleViewResults(interview._id)}
                          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
              
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      value={userData.profession ? userData.profession.charAt(0).toUpperCase() + userData.profession.slice(1) : ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={userData.id || userData._id || 'N/A'}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
              
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg border gap-2 sm:gap-0">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive updates about your progress</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm sm:self-start">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg border gap-2 sm:gap-0">
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                      <p className="text-sm text-gray-500">Control your data visibility</p>
                    </div>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm sm:self-start">
                      Manage
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg border gap-2 sm:gap-0">
                    <div>
                      <h3 className="font-medium text-gray-900">Delete Account</h3>
                      <p className="text-sm text-gray-500">Permanently remove your account</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm sm:self-start">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Popup */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setMessage('');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;