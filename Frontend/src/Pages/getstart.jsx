import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaUserTie, 
  FaChartLine, 
  FaAward, 
  FaPlayCircle,
  FaCheckCircle,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';

const GetStart = () => {
  const features = [
    {
      icon: <FaUserTie className="w-8 h-8" />,
      title: "AI-Powered Interviews",
      description: "Practice with intelligent interview simulations that adapt to your responses"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Real-time Feedback",
      description: "Get instant analysis on your communication skills and technical knowledge"
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Career Advancement",
      description: "Boost your confidence and land your dream job with personalized coaching"
    }
  ];

  const stats = [
    { number: "10K+", label: "Users Empowered" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Companies" },
    { number: "24/7", label: "Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaRocket className="w-4 h-4" />
                <span>AI-Powered Career Success</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Master Your Next
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"> Interview</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Prepare for success with our AI-powered interview platform. Get real-time feedback, 
                personalized coaching, and the confidence to land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                  <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <FaPlayCircle className="mr-2 w-5 h-5 text-blue-500" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="w-4 h-4 text-yellow-400" />
                  ))}
                  <span>4.9/5</span>
                </div>
                <span>•</span>
                <span>Trusted by 10,000+ professionals</span>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
          <img 
  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  alt="Team Collaboration"
  className="w-full h-64 object-cover rounded-xl"
/>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <FaCheckCircle className="w-6 h-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-800">Real-time Analysis</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <FaUserTie className="w-6 h-6 text-indigo-500 mb-2" />
                    <p className="text-sm font-medium text-gray-800">AI Coach</p>
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

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose InterviewPrep?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to ace your next interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:-translate-y-2"
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their interview skills with our AI-powered platform.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey Today
              <FaArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaRocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">InterviewPrep</span>
          </div>
          <p className="text-gray-400">
            Empowering careers through AI-powered interview preparation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GetStart;