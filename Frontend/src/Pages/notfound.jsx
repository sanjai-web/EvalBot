import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaRobot, FaBrain, FaCode, FaMicrochip } from 'react-icons/fa';

const NotFound = () => {
  const [typedText, setTypedText] = useState('');
  const [particles, setParticles] = useState([]);
  const fullText = '404';

  // Typing effect for 404
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Create data particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 30 + 10,
      color: Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Data Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDuration: `${particle.speed}s`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}

        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 L90 10 M50 10 L50 90 M10 50 L90 50" stroke="#3B82F6" strokeWidth="0.5" fill="none"/>
                <circle cx="10" cy="10" r="2" fill="#8B5CF6"/>
                <circle cx="90" cy="10" r="2" fill="#8B5CF6"/>
                <circle cx="50" cy="90" r="2" fill="#8B5CF6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute top-1/4 left-1/4 animate-bounce">
          <FaMicrochip className="w-12 h-12 text-blue-400 opacity-20" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-pulse">
          <FaCode className="w-10 h-10 text-purple-400 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-spin" style={{animationDuration: '10s'}}>
          <FaBrain className="w-8 h-8 text-indigo-400 opacity-20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number with Typing Effect */}
          <div className="relative mb-8">
            <div className="text-8xl sm:text-[10rem] md:text-[12rem] font-black relative font-mono">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className="animate-blink text-blue-600">|</span>
            </div>

            {/* AI Robot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float-robot">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <FaRobot className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Can't Find This Page
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Our intelligent system seems to have encountered an error. The page you're looking for doesn't exist in our database.
                Let's get you back on track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <Link
                to="/"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  <FaHome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Return Home
                </span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-300"
              >
                <div className="absolute inset-0 bg-gray-100/50 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  <FaArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </span>
              </button>
            </div>

            {/* AI Stats */}
            {/* <div className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '1s'}}>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">AI</div>
                <div className="text-sm text-gray-500">Powered</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">404</div>
                <div className="text-sm text-gray-500">Error</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
                <div className="text-2xl font-bold text-indigo-600">∞</div>
                <div className="text-sm text-gray-500">Learning</div>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float-robot {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-10px) translateX(5px) rotate(2deg); }
          50% { transform: translateY(-5px) translateX(-5px) rotate(-2deg); }
          75% { transform: translateY(5px) translateX(3px) rotate(1deg); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-robot {
          animation: float-robot 6s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
