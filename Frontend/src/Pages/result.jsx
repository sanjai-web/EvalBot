import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaRocket, 
  FaCheckCircle, 
  FaStar, 
  FaHome,
  FaChartLine,
  FaUserTie,
  FaLightbulb,
  FaClock,
  FaQuestionCircle,
  FaAward,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown
} from 'react-icons/fa';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState('');
  
  // FIX: Use state to track saving status instead of ref only
  const [isSaving, setIsSaving] = useState(false);
  const hasSavedRef = useRef(false);
  
  const { results } = location.state || {};
  
  // API Base URL with OR operator for local and production
  const API_BASE_URL = 'https://resume-interview-backend.onrender.com' || 'http://localhost:5000';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // FIX: Improved useEffect with better duplicate prevention
  useEffect(() => {
    // Only save once when results are available, not loading, and not already saving
    if (results && !isLoading && !isSaving && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveInterviewResults();
    }
  }, [results, isLoading, isSaving]);

  const saveInterviewResults = async () => {
    // FIX: Set saving state to true immediately
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping save');
        setSaveStatus('no-token');
        setIsSaving(false);
        return;
      }

      const { interviewData, conversationHistory, knowledgeScores, timer, totalQuestions, answeredQuestions } = results;

      // Calculate overall score correctly (average of all scores, already out of 100)
      const overallScore = Math.round(
        (knowledgeScores.projects + knowledgeScores.internships + knowledgeScores.problemSolving + knowledgeScores.personality) / 4
      );

      const performance = getPerformanceLevel(overallScore);

      const payload = {
        jobRole: interviewData?.jobName || 'Position',
        companyName: interviewData?.companyName || 'Company',
        overallScore: overallScore,
        performanceLevel: performance.text,
        conversationHistory: conversationHistory,
        knowledgeScores: knowledgeScores,
        timer: timer,
        totalQuestions: totalQuestions,
        answeredQuestions: answeredQuestions,
        difficultyLevel: interviewData?.questionLevel || 'Intermediate'
      };

      console.log('Saving interview results...', payload);

      // Updated fetch call using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/save-interview-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setSaveStatus('saved');
        console.log("✅ Interview results saved successfully");
      } else {
        setSaveStatus('error');
        console.error("❌ Failed to save interview results:", data.message);
        // Don't reset hasSavedRef on error to prevent infinite retry loops
      }
    } catch (error) {
      setSaveStatus('error');
      console.error("❌ Error saving interview results:", error);
      // Don't reset hasSavedRef on error to prevent infinite retry loops
    } finally {
      // FIX: Always set isSaving to false when done
      setIsSaving(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <FaRocket className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Analyzing your results...</h2>
          <p className="text-sm text-gray-500 mt-1">Preparing your personalized feedback</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
            <FaRocket className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">No Results Found</h2>
          <p className="text-gray-600 mb-6 text-sm">Please complete an interview to see your detailed analysis.</p>
          <button 
            onClick={() => navigate('/home')}
            className="group inline-flex items-center justify-center w-full px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHome className="mr-2 w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { interviewData, conversationHistory, knowledgeScores, timer, totalQuestions, answeredQuestions } = results;

  // Calculate overall score correctly - scores are already percentages (0-100)
  const overallScore = Math.round(
    (knowledgeScores.projects + knowledgeScores.internships + knowledgeScores.problemSolving + knowledgeScores.personality) / 4
  );

  const getPerformanceLevel = (score) => {
    if (score >= 85) return { 
      text: 'Outstanding', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100',
      icon: <FaAward className="w-4 h-4" />,
    };
    if (score >= 70) return { 
      text: 'Excellent', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      icon: <FaRegSmile className="w-4 h-4" />,
    };
    if (score >= 55) return { 
      text: 'Good', 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      icon: <FaRegMeh className="w-4 h-4" />,
    };
    if (score >= 40) return { 
      text: 'Average', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      icon: <FaRegMeh className="w-4 h-4" />,
    };
    return { 
      text: 'Needs Improvement', 
      color: 'text-red-600', 
      bg: 'bg-red-100',
      icon: <FaRegFrown className="w-4 h-4" />,
    };
  };

  const performance = getPerformanceLevel(overallScore);

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const generateFeedback = () => {
    const feedback = [];
    
    if (knowledgeScores.projects >= 75) {
      feedback.push({
        text: "Exceptional project knowledge and implementation skills",
        type: "strength",
      });
    } else if (knowledgeScores.projects >= 50) {
      feedback.push({
        text: "Good project foundation with room for advanced experience",
        type: "improvement",
      });
    } else {
      feedback.push({
        text: "Focus on building more complex, real-world projects",
        type: "critical",
      });
    }
    
    if (knowledgeScores.problemSolving >= 75) {
      feedback.push({
        text: "Strong analytical and problem-solving capabilities",
        type: "strength",
      });
    } else if (knowledgeScores.problemSolving >= 50) {
      feedback.push({
        text: "Develop systematic approaches to complex problems",
        type: "improvement",
      });
    }
    
    if (knowledgeScores.personality >= 75) {
      feedback.push({
        text: "Excellent communication and interpersonal skills",
        type: "strength",
      });
    } else if (knowledgeScores.personality >= 50) {
      feedback.push({
        text: "Work on articulating thoughts more clearly and confidently",
        type: "improvement",
      });
    }

    if (feedback.length === 0) {
      feedback.push({
        text: "Solid overall performance with balanced skills",
        type: "strength",
      });
    }

    return feedback;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    if (knowledgeScores.projects < 70) {
      recommendations.push({
        title: "Project Development",
        items: [
          "Build 2-3 full-stack projects using modern technologies",
          "Contribute to open-source projects on GitHub",
          "Document your projects with detailed README files"
        ],
        priority: knowledgeScores.projects < 50 ? "high" : "medium"
      });
    }
    
    if (knowledgeScores.problemSolving < 70) {
      recommendations.push({
        title: "Technical Skills",
        items: [
          "Solve 3-5 LeetCode problems weekly",
          "Practice system design concepts",
          "Learn about data structures and algorithms"
        ],
        priority: knowledgeScores.problemSolving < 50 ? "high" : "medium"
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: "Continued Excellence",
        items: [
          "Mentor others to reinforce your knowledge",
          "Explore advanced topics in your field",
          "Consider leadership or specialized roles"
        ],
        priority: "low"
      });
    }

    return recommendations;
  };

  const stats = [
    {
      label: "Questions Answered",
      value: answeredQuestions,
      total: totalQuestions,
      icon: <FaQuestionCircle className="w-4 h-4" />,
      color: "blue"
    },
    {
      label: "Time Spent",
      value: formatTime(timer),
      icon: <FaClock className="w-4 h-4" />,
      color: "purple"
    },
    {
      label: "Performance Score",
      value: `${overallScore}%`,
      icon: <FaChartLine className="w-4 h-4" />,
      color: "indigo"
    },
    {
      label: "Difficulty Level",
      value: interviewData?.questionLevel || 'Intermediate',
      icon: <FaUserTie className="w-4 h-4" />,
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <FaRocket className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                InterviewPrep
              </span>
            </div>
            
            {saveStatus === 'saved' && (
              <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                <FaCheckCircle className="w-3 h-3" />
                <span>Results Saved</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                <span>⚠️ Save Failed</span>
              </div>
            )}
            {isSaving && (
              <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                <span>Saving...</span>
              </div>
            )}
          </div>
          
          <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <FaCheckCircle className="w-3 h-3" />
            <span>Interview Completed • {new Date().toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Interview Results
          </h1>
          
          <p className="text-sm text-gray-600">
            {interviewData?.jobName || 'Position'} at {interviewData?.companyName || 'Company'} • 
            <span className="capitalize"> {interviewData?.questionLevel || 'Intermediate'} Level</span>
          </p>
        </section>

        {/* Performance Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Score Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Overall Performance</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full ${performance.bg} ${performance.color} font-medium flex items-center space-x-1 text-sm`}>
                      {performance.icon}
                      <span>{performance.text}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{overallScore}%</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    Final Score
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <div className={`w-10 h-10 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm`}>
                    {stat.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                  {stat.total && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">  </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Analysis */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detailed Analysis</h2>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                {['overview', 'feedback', 'questions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-200 text-sm ${
                      activeTab === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(knowledgeScores).map(([category, score]) => (
                    <div key={category} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <span className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(score)}`}
                          style={{ width: `${Math.min(score, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Strengths & Improvements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      {generateFeedback().map((item, index) => (
                        <div key={index} className={`p-3 rounded-xl border-l-4 ${
                          item.type === 'strength' 
                            ? 'border-green-500 bg-green-50' 
                            : item.type === 'critical' 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-blue-500 bg-blue-50'
                        }`}>
                          <p className="text-sm text-gray-700">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Action Plan</h3>
                    <div className="space-y-3">
                      {generateRecommendations().map((rec, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{rec.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : rec.priority === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority} priority
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {rec.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2 text-gray-600 text-sm">
                                <FaLightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Questions</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {conversationHistory.filter(item => !item.isCandidateQuestion).map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                        {item.score && (
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-bold">
                            Score: {item.score}/10
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 font-medium mb-1">Q: {item.question}</p>
                      {item.answer && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-gray-300">
                          <p className="text-xs text-gray-700"><strong>Your Answer:</strong> {item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHome className="mr-2 w-4 h-4" />
            Back to Home
          </button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Download Report
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaRocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">InterviewPrep</span>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-4">
              Empowering professionals to ace their interviews through AI-powered practice and personalized feedback.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="w-3 h-3 text-yellow-400" />
                ))}
                <span>Rated 4.9/5</span>
              </div>
              <span>•</span>
              <span>Interview ID: {Date.now().toString(36).toUpperCase()}</span>
              <span>•</span>
              <span>Confidential Report</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Result;