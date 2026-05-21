import React from 'react';
import { useNavigate } from 'react-router-dom';

function Result() {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/'); // Replace '/dashboard' with your actual dashboard route
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="bg-[#0a0f1c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 max-w-md w-full mx-auto relative z-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center relative z-10">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-3">
            Assessment Complete
          </h1>
          <p className="text-slate-400 leading-relaxed text-sm">
            Thank you for completing the interview. Your technical responses and session analytics have been securely transmitted to the evaluation server.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center">
            <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Post-Session Protocol
          </h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3 mt-1.5 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              Your recorded responses are undergoing comprehensive analysis.
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3 mt-1.5 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              A detailed evaluation report will be generated for the recruiter.
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3 mt-1.5 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              Please monitor your secure email for next steps within 3-5 days.
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleReturnToDashboard}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase py-3.5 px-6 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
        >
          Terminate Session
        </button>

        {/* Additional Info */}
        <p className="text-xs text-slate-500 text-center mt-6 uppercase tracking-wider font-semibold">
          Secure connection closed.
        </p>
      </div>
    </div>
  );
}

export default Result;