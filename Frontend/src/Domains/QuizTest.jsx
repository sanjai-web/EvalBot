import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaClock, FaCheckCircle, FaArrowRight, FaArrowLeft, 
  FaQuestionCircle, FaListOl, FaFlag, FaPaperPlane,
  FaExclamationTriangle, FaTimes, FaCheck, FaBan,
  FaBook, FaBookOpen, FaGraduationCap, FaBrain,
  FaChevronRight, FaChevronLeft, FaSave, FaPause,
  FaExpand, FaCompress
} from 'react-icons/fa';

const QuizTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewData = location.state?.interviewData;
  
  // Mock quiz data - in real app, this would come from API
  const [quizData, setQuizData] = useState({
    sections: [
      {
        id: 1,
        title: "Core Concepts",
        description: "Fundamental knowledge questions",
        questions: [
          {
            id: 1,
            question: "What is the time complexity of binary search?",
            options: [
              { id: 'a', text: "O(1)" },
              { id: 'b', text: "O(log n)" },
              { id: 'c', text: "O(n)" },
              { id: 'd', text: "O(n²)" }
            ],
            correctAnswer: 'b',
            type: "multiple-choice",
            section: "Core Concepts"
          },
          {
            id: 2,
            question: "Which data structure uses LIFO principle?",
            options: [
              { id: 'a', text: "Queue" },
              { id: 'b', text: "Stack" },
              { id: 'c', text: "Linked List" },
              { id: 'd', text: "Tree" }
            ],
            correctAnswer: 'b',
            type: "multiple-choice",
            section: "Core Concepts"
          }
        ]
      },
      {
        id: 2,
        title: "Advanced Topics",
        description: "Complex scenarios and problem-solving",
        questions: [
          {
            id: 3,
            question: "Which algorithm is used for shortest path finding?",
            options: [
              { id: 'a', text: "Dijkstra's Algorithm" },
              { id: 'b', text: "Bubble Sort" },
              { id: 'c', text: "Binary Search" },
              { id: 'd', text: "Quick Sort" }
            ],
            correctAnswer: 'a',
            type: "multiple-choice",
            section: "Advanced Topics"
          },
          {
            id: 4,
            question: "What does SQL stand for?",
            options: [
              { id: 'a', text: "Structured Query Language" },
              { id: 'b', text: "Simple Question Language" },
              { id: 'c', text: "Structured Question Logic" },
              { id: 'd', text: "Sequential Query Language" }
            ],
            correctAnswer: 'a',
            type: "multiple-choice",
            section: "Advanced Topics"
          }
        ]
      },
      {
        id: 3,
        title: "Problem Solving",
        description: "Practical application questions",
        questions: [
          {
            id: 5,
            question: "Which design pattern is used for creating objects?",
            options: [
              { id: 'a', text: "Singleton" },
              { id: 'b', text: "Factory" },
              { id: 'c', text: "Observer" },
              { id: 'd', text: "Decorator" }
            ],
            correctAnswer: 'b',
            type: "multiple-choice",
            section: "Problem Solving"
          }
        ]
      }
    ]
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [showSidebar, setShowSidebar] = useState(true);

  // Calculate total questions
  const totalQuestions = quizData.sections.reduce((total, section) => total + section.questions.length, 0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    // Mark as visited
    setVisitedQuestions(prev => new Set([...prev, currentQuestion]));
  };

  // Navigate to question
  const goToQuestion = (questionIndex) => {
    // Find which section this question belongs to
    let cumulative = 0;
    let sectionIndex = 0;
    let questionInSection = 0;
    
    for (let i = 0; i < quizData.sections.length; i++) {
      const section = quizData.sections[i];
      if (questionIndex < cumulative + section.questions.length) {
        sectionIndex = i;
        questionInSection = questionIndex - cumulative;
        break;
      }
      cumulative += section.questions.length;
    }
    
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionInSection);
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
  };

  // Navigate to next question
  const nextQuestion = () => {
    const currentIndex = getCurrentGlobalIndex();
    if (currentIndex < totalQuestions - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    const currentIndex = getCurrentGlobalIndex();
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  // Get current global question index
  const getCurrentGlobalIndex = () => {
    let cumulative = 0;
    for (let i = 0; i < currentSection; i++) {
      cumulative += quizData.sections[i].questions.length;
    }
    return cumulative + currentQuestion;
  };

  // Toggle flag question
  const toggleFlagQuestion = () => {
    const globalIndex = getCurrentGlobalIndex();
    setFlaggedQuestions(prev => 
      prev.includes(globalIndex) 
        ? prev.filter(q => q !== globalIndex)
        : [...prev, globalIndex]
    );
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  // Confirm submit
  const confirmSubmit = () => {
    // Calculate score
    let score = 0;
    let totalCorrect = 0;
    
    // In a real app, this would be sent to backend
    console.log('Submitted answers:', answers);
    console.log('Flagged questions:', flaggedQuestions);
    
    // Navigate to results page or back
    alert('Quiz submitted successfully!');
    navigate('/');
  };

  // Get current question
  const currentQ = quizData.sections[currentSection]?.questions[currentQuestion];
  const currentGlobalIndex = getCurrentGlobalIndex();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Navbar - Similar to Details.jsx */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Timer and progress */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaClock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${timeLeft < 600 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-gray-500">Time Remaining</div>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FaQuestionCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {currentGlobalIndex + 1} / {totalQuestions}
                  </div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-xs text-gray-500">Answered</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="hidden md:block w-32">
                <div className="text-xs text-gray-500 mb-1">Progress: {calculateProgress()}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              >
                <FaListOl className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>Submit Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Tabs at the top */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-3 overflow-x-auto">
            {quizData.sections.map((section, index) => {
              const isActive = currentSection === index;
              const sectionStartIndex = quizData.sections.slice(0, index).reduce((sum, s) => sum + s.questions.length, 0);
              const sectionQuestions = section.questions;
              
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(index);
                    setCurrentQuestion(0);
                    setVisitedQuestions(prev => new Set([...prev, sectionStartIndex]));
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20' : 'bg-white'
                    }`}>
                      <span className={`font-bold ${isActive ? 'text-white' : 'text-blue-600'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {section.questions.length} questions
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${showSidebar ? 'space-x-6' : ''}`}>
          {/* Left Panel - Question */}
          <div className={`${showSidebar ? 'flex-1' : 'w-full'}`}>
            {/* Current Section Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FaBookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{quizData.sections[currentSection].title}</h2>
                    <p className="text-gray-600 text-sm">{quizData.sections[currentSection].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Questions {currentQuestion + 1} / {quizData.sections[currentSection].questions.length}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-4">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Answered: {Object.keys(answers).length}
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                      Pending: {totalQuestions - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
                    Q{currentGlobalIndex + 1}
                  </div>
                  <span className="text-sm text-gray-500">• {currentQ.type}</span>
                </div>
                
                <button
                  onClick={toggleFlagQuestion}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    flaggedQuestions.includes(currentGlobalIndex)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaFlag className="w-4 h-4" />
                  <span>{flaggedQuestions.includes(currentGlobalIndex) ? 'Remove Flag' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQ.question}</h3>
                
                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        answers[currentQ.id] === option.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          answers[currentQ.id] === option.id
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {answers[currentQ.id] === option.id ? (
                            <FaCheck className="w-3 h-3" />
                          ) : (
                            <span className="text-sm font-medium">{option.id.toUpperCase()}</span>
                          )}
                        </div>
                        <span className={`font-medium ${
                          answers[currentQ.id] === option.id ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={prevQuestion}
                  disabled={currentGlobalIndex === 0}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    currentGlobalIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Previous Question</span>
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={currentGlobalIndex === totalQuestions - 1}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    currentGlobalIndex === totalQuestions - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  <span>Next Question</span>
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Question List */}
          {showSidebar && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Questions</h3>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      {Object.keys(answers).length}/{totalQuestions}
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Click to jump to any question</p>
                </div>

                {/* Question Grid */}
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: totalQuestions }).map((_, index) => {
                      // Check question status
                      const isAnswered = answers[getQuestionIdByIndex(index)];
                      const isFlagged = flaggedQuestions.includes(index);
                      const isCurrent = index === currentGlobalIndex;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={`
                            aspect-square rounded-lg flex items-center justify-center font-medium transition-all relative
                            ${isCurrent 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                              : isAnswered
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : isFlagged
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          title={`Question ${index + 1}${isFlagged ? ' (Flagged)' : ''}`}
                        >
                          {index + 1}
                          {isFlagged && (
                            <FaFlag className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="font-bold text-gray-900">{Object.keys(answers).length}</div>
                      <div className="text-gray-600">Answered</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="font-bold text-gray-900">{totalQuestions - Object.keys(answers).length}</div>
                      <div className="text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Submit Quiz</h3>
                  <p className="text-sm text-gray-600 mt-1">Are you sure you want to submit?</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Important: This action cannot be undone</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      You have answered {Object.keys(answers).length} out of {totalQuestions} questions.
                      {totalQuestions - Object.keys(answers).length > 0 && (
                        <span className="block mt-1">
                          You have {totalQuestions - Object.keys(answers).length} unanswered questions.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FaCheck className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get question ID by global index
const getQuestionIdByIndex = (globalIndex) => {
  // This would be implemented based on your actual data structure
  // For now, returning index + 1 as question ID
  return globalIndex + 1;
};

export default QuizTest;