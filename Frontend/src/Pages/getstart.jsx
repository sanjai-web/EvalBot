import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserTie, 
  FaVideo, 
  FaClock, 
  FaLaptop,
  FaShieldAlt,
  FaChartLine,
  FaPlayCircle,
  FaCheckCircle,
  FaArrowRight,
  FaBuilding,
  FaRobot
} from 'react-icons/fa';

const GetStart = () => {
  const features = [
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI-Powered Assessment",
      description: "Experience fair and unbiased interviews conducted by our advanced AI system"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure & Proctored",
      description: "Your interview is monitored to ensure integrity and prevent malpractice"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Instant Evaluation",
      description: "Get comprehensive feedback and scoring immediately after your interview"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Enter Credentials",
      description: "Use the interview ID and password provided by your recruiter"
    },
    {
      step: "02",
      title: "Upload Resume",
      description: "Share your resume for personalized question generation"
    },
    {
      step: "03",
      title: "AI Interview",
      description: "Complete the automated interview with real-time monitoring"
    },
    {
      step: "04",
      title: "Get Results",
      description: "Receive instant evaluation shared directly with the hiring company"
    }
  ];

  const requirements = [
    {
      icon: <FaLaptop className="w-6 h-6" />,
      text: "Laptop/Desktop with Webcam"
    },
    {
      icon: <FaVideo className="w-6 h-6" />,
      text: "Stable Internet Connection"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      text: "20-40 Minutes of Undisturbed Time"
    },
    {
      icon: <FaUserTie className="w-6 h-6" />,
      text: "Professional Environment"
    }
  ];

  // Grid background styles
  const gridBackgroundStyle = {
    '--color': '#E1E1E1',
    backgroundColor: '#F3F3F3',
    backgroundImage: `linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
                      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent)`,
    backgroundSize: '55px 55px'
  };

  return (
    <div 
      className="min-h-screen relative"
      style={gridBackgroundStyle}
    >
      {/* Overlay gradient to blend with the grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-50/80"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <FaBuilding className="w-4 h-4" />
                  <span>Official Company Interview</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Your AI-Powered
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"> Interview</span>
                  Awaits
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                  Welcome to your official interview session. Complete your AI-powered assessment 
                  at your convenience while we ensure a fair and comprehensive evaluation for the hiring.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Link
                    to="/details"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Your Interview
                    <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <FaPlayCircle className="mr-2 w-5 h-5 text-blue-500" />
                    How It Works
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure & Proctored</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center space-x-1">
                    <FaShieldAlt className="w-4 h-4 text-blue-500" />
                    <span>Company Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Interview Interface Preview */}
              <div className="relative">
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-white mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm ml-2">AI Interview Session</span>
                    </div>
                    <div className="bg-black rounded p-20 text-center">
                      <FaVideo className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Live Webcam Feed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <FaClock className="w-6 h-6 text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800">Time: 20-40 min</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <FaShieldAlt className="w-6 h-6 text-indigo-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800">Proctored</p>
                    </div>
                  </div>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Before You Begin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {req.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{req.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Your Interview Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple four-step process to complete your official AI-powered interview
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className="relative bg-white rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <FaArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why AI-Powered Interviews?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Modern hiring process designed for fairness and efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white backdrop-blur-sm border border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Begin Your Interview?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of candidates who have completed their interviews through our secure AI platform.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link
                  to="/details"
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Interview Now
                  <FaArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                  <FaPlayCircle className="mr-2 w-5 h-5" />
                  Watch Tutorial
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes Section */}
        <section className="py-12 bg-yellow-50/80 backdrop-blur-sm border-y border-yellow-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">
                Important Notes for Your Interview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div className="flex items-center justify-center space-x-2">
                  <FaVideo className="w-4 h-4" />
                  <span>Webcam must remain ON throughout the interview</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FaShieldAlt className="w-4 h-4" />
                  <span>Do not exit fullscreen mode during the session</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FaClock className="w-4 h-4" />
                  <span>Ensure stable internet connection</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FaUserTie className="w-4 h-4" />
                  <span>Choose a quiet, professional environment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900/95 backdrop-blur-sm text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaBuilding className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Interview Platform</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Official AI-powered interview platform trusted by companies worldwide to conduct 
              fair and efficient hiring assessments.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>Need help? Contact the hiring company directly for interview-related queries</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GetStart;