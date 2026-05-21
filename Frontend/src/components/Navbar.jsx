import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiMic, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/details", label: "Start Interview", icon: <FiMic /> },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="bg-[#030712]/80 backdrop-blur-xl shadow-2xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <img 
                src="https://img.icons8.com/fluency/48/000000/resume.png" 
                alt="Resume Interview Logo" 
                className="w-8 h-8 filter brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-wide">
                EVAL<span className="text-indigo-400 font-light">BOT</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block uppercase tracking-wider font-semibold">AI Session Console</p>
            </div>
          </div>

          {/* Desktop Navigation - Start Interview Button on the Right */}
          <div className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActivePath(item.path)
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white shadow-md hover:shadow-lg"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          {/* <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div> */}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0f1c]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl rounded-b-2xl">
            <div className="px-4 py-6 space-y-3">
              {/* Navigation Items - Only Start Interview */}
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActivePath(item.path)
                        ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] transform scale-105"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}