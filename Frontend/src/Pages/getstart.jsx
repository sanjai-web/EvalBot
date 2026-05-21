import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserTie, FaVideo, FaClock, FaLaptop, FaShieldAlt,
  FaChartLine, FaPlayCircle, FaCheckCircle, FaArrowRight,
  FaBuilding, FaRobot, FaBrain, FaCode, FaMicrophone, FaGlobe
} from 'react-icons/fa';

const GetStart = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    { icon: <FaBrain />, title: "Cognitive AI Assessment", desc: "Adaptive questioning powered by advanced language models to evaluate real depth of knowledge." },
    { icon: <FaShieldAlt />, title: "Enterprise Grade Proctoring", desc: "Military-grade secure environment ensuring absolute integrity throughout your session." },
    { icon: <FaChartLine />, title: "Real-time Analytics", desc: "Instantaneous multifaceted evaluation of your technical and soft skills." }
  ];

  const steps = [
    { num: "01", title: "Authentication", desc: "Verify your identity using your unique company credentials." },
    { num: "02", title: "Context Upload", desc: "Provide your resume to tailor the AI's contextual awareness." },
    { num: "03", title: "Live Session", desc: "Engage in a dynamic, responsive interview with our AI agent." },
    { num: "04", title: "Evaluation", desc: "Receive immediate comprehensive feedback on your performance." }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen" />
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Dynamic Cursor Light */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 hidden md:block"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.07), transparent 40%)`
        }}
      />

      <div className="relative z-20">
        
        {/* Navigation */}
      

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Next-Generation Assessment Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Master Your <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI Interview</span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                Experience the future of hiring. Our intelligent agent conducts dynamic, contextual interviews in a highly secure environment to uncover your true potential.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/details" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1">
                  Begin Session <FaArrowRight />
                </Link>
                <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-3 transition-all">
                  <FaPlayCircle className="text-indigo-400" /> Watch Demo
                </button>
              </div>
              
              <div className="pt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /> Trusted by Top Tech</div>
                <div className="flex items-center gap-2"><FaShieldAlt className="text-indigo-400" /> End-to-End Encryption</div>
              </div>
            </div>

            {/* Futuristic Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-[80px] opacity-20 animate-pulse" />
              <div className="relative bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
                
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                    <FaGlobe className="animate-spin-slow" /> connection_secure
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-20" />
                      <FaMicrophone className="text-4xl text-indigo-400" />
                    </div>
                    <div className="text-lg font-medium text-white mb-2">AI Agent is listening...</div>
                    <div className="flex gap-1 justify-center">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-1.5 h-6 bg-indigo-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <FaClock className="text-indigo-400 mb-2" />
                    <div className="text-xs text-slate-400">Duration</div>
                    <div className="font-mono text-white">45:00 MIN</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <FaCode className="text-purple-400 mb-2" />
                    <div className="text-xs text-slate-400">Environment</div>
                    <div className="font-mono text-white">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Requirements */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
            <span className="text-sm font-semibold tracking-widest text-slate-500 uppercase">System Prerequisites</span>
            <div className="flex flex-wrap gap-8">
              {[
                { icon: <FaLaptop />, text: "Desktop/Laptop" },
                { icon: <FaVideo />, text: "Working Webcam" },
                { icon: <FaMicrophone />, text: "Clear Microphone" },
                { icon: <FaShieldAlt />, text: "Quiet Environment" }
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="text-indigo-400 bg-indigo-500/10 p-2 rounded-lg">{req.icon}</div>
                  {req.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">Engineered for Excellence</h2>
            <p className="text-slate-400 text-lg">Our platform utilizes state-of-the-art language models and strict proctoring to ensure every candidate is evaluated purely on merit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-32 px-6 bg-gradient-to-b from-transparent to-[#0a0f1c]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Seamless Execution</h2>
                <p className="text-slate-400 text-lg mb-12">From authentication to evaluation, the entire process is streamlined to let you focus entirely on showcasing your expertise.</p>
                
                <div className="space-y-8">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-indigo-400 font-mono font-bold flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                          {step.num}
                        </div>
                        {i !== steps.length - 1 && <div className="w-px h-full bg-white/10 my-2 group-hover:bg-indigo-500/50 transition-colors" />}
                      </div>
                      <div className="pb-8">
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                  alt="Technology" 
                  className="rounded-3xl border border-white/10 shadow-2xl relative z-10 opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-16 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">System Ready for Deployment</h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto relative z-10">Authenticate now to initialize your dedicated assessment environment. Ensure you have 45 minutes of uninterrupted time.</p>
            <Link to="/details" className="relative z-10 inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-indigo-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105">
              Initialize Session <FaArrowRight />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
          <p>© 2026 EvalBot Enterprise. All rights reserved. Encrypted Connection.</p>
        </footer>

      </div>
    </div>
  );
};

export default GetStart;