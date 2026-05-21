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
    <div className={`min-h-screen bg-[#030712] text-slate-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Navbar */}
      <nav className="bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Timer and progress */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <FaClock className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${timeLeft < 600 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-slate-400">Time Remaining</div>
                </div>
              </div>

              <div className="h-6 w-px bg-white/10"></div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FaQuestionCircle className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {currentGlobalIndex + 1} / {totalQuestions}
                  </div>
                  <div className="text-xs text-slate-400">Questions</div>
                </div>
              </div>

              <div className="h-6 w-px bg-white/10"></div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-xs text-slate-400">Answered</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="hidden md:block w-32">
                <div className="text-xs text-slate-400 mb-1">Progress: {calculateProgress()}%</div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              >
                <FaListOl className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] uppercase tracking-wider text-sm"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>Submit Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Tabs at the top */}
      <div className="bg-[#0a0f1c]/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-3 overflow-x-auto">
            {quizData.sections.map((section, index) => {
              const isActive = currentSection === index;
              const sectionStartIndex = quizData.sections.slice(0, index).reduce((sum, s) => sum + s.questions.length, 0);
              
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(index);
                    setCurrentQuestion(0);
                    setVisitedQuestions(prev => new Set([...prev, sectionStartIndex]));
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 border ${
                    isActive 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'
                    }`}>
                      <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm tracking-wide">{section.title}</div>
                      <div className={`text-xs ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
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
            <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                    <FaBookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">{quizData.sections[currentSection].title}</h2>
                    <p className="text-slate-400 text-sm">{quizData.sections[currentSection].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-300">
                    Questions {currentQuestion + 1} / {quizData.sections[currentSection].questions.length}
                  </div>
                  <div className="text-sm text-slate-400 flex items-center space-x-4 mt-1">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                      Answered: {Object.keys(answers).length}
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></div>
                      Pending: {totalQuestions - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white px-4 py-2 rounded-lg font-bold tracking-widest text-sm">
                    Q{currentGlobalIndex + 1}
                  </div>
                  <span className="text-sm text-slate-400 font-mono tracking-wide px-2 py-1 bg-white/5 rounded-md border border-white/5">• {currentQ.type}</span>
                </div>
                
                <button
                  onClick={toggleFlagQuestion}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 border ${
                    flaggedQuestions.includes(currentGlobalIndex)
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FaFlag className="w-4 h-4" />
                  <span className="font-semibold text-sm uppercase tracking-wider">{flaggedQuestions.includes(currentGlobalIndex) ? 'Remove Flag' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-6 leading-relaxed">{currentQ.question}</h3>
                
                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 group ${
                        answers[currentQ.id] === option.id
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          answers[currentQ.id] === option.id
                            ? 'border-indigo-500 bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            : 'border-slate-500/50 bg-transparent text-slate-400 group-hover:border-slate-400'
                        }`}>
                          {answers[currentQ.id] === option.id ? (
                            <FaCheck className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-sm font-bold">{option.id.toUpperCase()}</span>
                          )}
                        </div>
                        <span className={`font-medium text-lg ${
                          answers[currentQ.id] === option.id ? 'text-indigo-300' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
                <button
                  onClick={prevQuestion}
                  disabled={currentGlobalIndex === 0}
                  className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center space-x-2 transition-all ${
                    currentGlobalIndex === 0
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={currentGlobalIndex === totalQuestions - 1}
                  className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center space-x-2 transition-all ${
                    currentGlobalIndex === totalQuestions - 1
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
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
              <div className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 sticky top-24 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-indigo-900/30 border-b border-indigo-500/20 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white tracking-wide">Questions</h3>
                    <span className="text-xs font-mono bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                      {Object.keys(answers).length}/{totalQuestions}
                    </span>
                  </div>
                  <p className="text-indigo-400 text-xs mt-2 uppercase tracking-wider font-semibold">Click to jump to any question</p>
                </div>

                {/* Question Grid */}
                <div className="p-5 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: totalQuestions }).map((_, index) => {
                      const isAnswered = answers[getQuestionIdByIndex(index)];
                      const isFlagged = flaggedQuestions.includes(index);
                      const isCurrent = index === currentGlobalIndex;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={`
                            aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all relative border
                            ${isCurrent 
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] transform scale-110 z-10' 
                              : isAnswered
                              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                              : isFlagged
                              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                            }
                          `}
                          title={`Question ${index + 1}${isFlagged ? ' (Flagged)' : ''}`}
                        >
                          {index + 1}
                          {isFlagged && (
                            <FaFlag className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-rose-500 filter drop-shadow-[0_0_3px_rgba(244,63,94,0.8)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-white/10 p-5 bg-black/40">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                      <div className="font-bold text-emerald-400 text-xl">{Object.keys(answers).length}</div>
                      <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mt-1">Answered</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                      <div className="font-bold text-amber-400 text-xl">{totalQuestions - Object.keys(answers).length}</div>
                      <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mt-1">Pending</div>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30">
                  <FaExclamationTriangle className="w-8 h-8 text-rose-500 shadow-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">Submit Quiz</h3>
                  <p className="text-sm text-slate-400 mt-1">Are you sure you want to finalize?</p>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-8">
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-400 font-bold uppercase tracking-wider">Warning</p>
                    <p className="text-sm text-amber-200/80 mt-2 leading-relaxed">
                      This action cannot be undone. You have answered <strong className="text-white">{Object.keys(answers).length}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions.
                      {totalQuestions - Object.keys(answers).length > 0 && (
                        <span className="block mt-2 font-medium text-rose-400">
                          You have {totalQuestions - Object.keys(answers).length} unanswered questions!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <FaCheck className="w-5 h-5" />
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