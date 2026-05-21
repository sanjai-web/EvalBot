import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope,
  FaLock,
  FaUpload,
  FaPaperPlane,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaTimes,
  FaExclamationTriangle,
  FaWifi,
  FaVideo,
  FaClock,
  FaExpand,
  FaInfoCircle,
  FaUserCircle,
  FaBriefcase,
  FaBan
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function Details() {
  const [formData, setFormData] = useState({
    interviewId: '',
    email: '',
    password: '',
    resume: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [userAlreadyCompleted, setUserAlreadyCompleted] = useState(false);
  const [completionInfo, setCompletionInfo] = useState(null);
  const navigate = useNavigate();

  // Load PDF.js library
  React.useEffect(() => {
    const loadPdfJs = () => {
      if (window['pdfjs-dist/build/pdf']) {
        setPdfJsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          window['pdfjs-dist/build/pdf'] = window.pdfjsLib;
          setPdfJsLoaded(true);
        }
      };
      
      script.onerror = () => {
        setPdfJsLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({
        ...formData,
        resume: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setFormData({
        ...formData,
        resume: files[0]
      });
    } else {
      alert('Please upload only PDF files');
    }
  };

  const handleCheckboxClick = () => {
    if (!termsAccepted) {
      setShowTermsPopup(true);
    } else {
      setTermsAccepted(false);
    }
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsPopup(false);
  };

  const handleClosePopup = () => {
    setShowTermsPopup(false);
  };

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          
          if (!pdfjsLib) {
            reject(new Error('PDF.js library not loaded.'));
            return;
          }
          
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
              .map(item => item.str)
              .join(' ');
            
            fullText += pageText + ' ';
          }
          
          resolve(fullText.trim());
        } catch (error) {
          console.warn('PDF.js extraction failed:', error);
          try {
            const textDecoder = new TextDecoder('utf-8', { fatal: false });
            const text = textDecoder.decode(e.target.result);
            
            const textMatches = text.match(/\(([^)]+)\)/g);
            if (textMatches) {
              const extractedText = textMatches
                .map(match => match.slice(1, -1))
                .join(' ')
                .replace(/\\[nr]/g, '\n')
                .replace(/\s+/g, ' ')
                .trim();
              
              resolve(extractedText || 'Unable to extract readable text from PDF');
            } else {
              resolve('Unable to extract readable text from PDF.');
            }
          } catch (fallbackError) {
            reject(new Error('Failed to extract text from PDF'));
          }
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Check if user has already completed the interview
  const checkUserCompletionStatus = async (interviewId, email) => {
    try {
      const response = await fetch(`${API_URL}/users/${interviewId}/${email}`);
      if (response.ok) {
        const userData = await response.json();
        if (userData.completionStatus === 'Completed') {
          setUserAlreadyCompleted(true);
          setCompletionInfo({
            score: userData.score,
            completedAt: userData.completedAt,
            interviewId: userData.interviewId
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking user completion status:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.interviewId || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.resume) {
      setError('Please upload a resume file');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions to proceed');
      return;
    }

    setIsLoading(true);
    setError('');
    setUserAlreadyCompleted(false);

    try {
      // First check if user has already completed the interview
      const alreadyCompleted = await checkUserCompletionStatus(
        formData.interviewId.toUpperCase(),
        formData.email.toLowerCase()
      );

      if (alreadyCompleted) {
        setIsLoading(false);
        return;
      }

      // Extract resume text
      const resumeText = await extractTextFromPDF(formData.resume);
      console.log('📝 Extracted PDF text:', resumeText);

      // Authenticate user and get interview details
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: formData.interviewId.toUpperCase(),
          loginId: formData.email.toLowerCase(),
          password: formData.password
        })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Authentication failed');
      }

      // Double-check completion status from login response
      if (loginData.user.completionStatus === 'Completed') {
        setUserAlreadyCompleted(true);
        setCompletionInfo({
          score: loginData.user.score,
          completedAt: loginData.user.completedAt,
          interviewId: loginData.user.interviewId
        });
        setIsLoading(false);
        return;
      }

      // Prepare interview data
      const interviewData = {
        user: loginData.user,
        collection: loginData.collection,
        resume: {
          file: formData.resume,
          textContent: resumeText
        },
        jobName: loginData.collection.role,
        companyName: loginData.collection.company,
        jobDescription: loginData.collection.description,
        questionLevel: loginData.collection.level.toLowerCase()
      };

      // Navigate to appropriate interview page based on domain
      if (loginData.collection.domain === 'Computer Science') {
        navigate('/ComputerBased', { state: { interviewData } });
      } else if (loginData.collection.domain === 'Role Based') {
        navigate('/rolebased', { state: { interviewData } });
      } else {
        throw new Error('Unknown interview domain');
      }

    } catch (error) {
      console.error('❌ Submission error:', error);
      setError(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center selection:bg-indigo-500/30">
      {/* Dynamic Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen" />
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Login Form */}
        <div className="bg-[#0a0f1c]/80 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Authentication Portal
            </h1>
            <p className="text-slate-400 text-sm mt-2">Provide credentials to initialize your session.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Interview Already Completed Message */}
          {userAlreadyCompleted && completionInfo && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FaBan className="w-5 h-5 text-amber-500 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-400 mb-2">
                    Session Already Completed
                  </h3>
                  <p className="text-sm text-amber-200/70 mb-3">
                    Our records indicate you have already completed this evaluation. Candidates are permitted a single attempt.
                  </p>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-amber-500/70">Interview ID:</span>
                        <div className="text-amber-400 font-mono">{completionInfo.interviewId}</div>
                      </div>
                      {completionInfo.completedAt && (
                        <div className="col-span-2">
                          <span className="font-medium text-amber-500/70">Completed On:</span>
                          <div className="text-amber-400">
                            {new Date(completionInfo.completedAt).toLocaleDateString()} at {' '}
                            {new Date(completionInfo.completedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-amber-500/50 mt-3">
                    If this is an error, please contact your system administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Interview ID Input */}
            <div>
              <label htmlFor="interviewId" className="block text-sm font-medium text-slate-300 mb-2">
                <FaBriefcase className="inline w-3 h-3 mr-2 text-indigo-400" />
                Interview ID
              </label>
              <input
                id="interviewId"
                name="interviewId"
                type="text"
                required
                value={formData.interviewId}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-[#030712]/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-slate-600 uppercase"
                placeholder="ENTER INTERVIEW ID"
                style={{ textTransform: 'uppercase' }}
                disabled={userAlreadyCompleted}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                <FaEnvelope className="inline w-3 h-3 mr-2 text-indigo-400" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-[#030712]/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-slate-600"
                placeholder="candidate@company.com"
                disabled={userAlreadyCompleted}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                <FaLock className="inline w-3 h-3 mr-2 text-indigo-400" />
                Access Key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-[#030712]/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-slate-600"
                placeholder="Enter access key"
                disabled={userAlreadyCompleted}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-slate-300 mb-2">
                <FaUpload className="inline w-3 h-3 mr-2 text-indigo-400" />
                Provide Context (Resume PDF)
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : formData.resume 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/10 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04]'
                } ${userAlreadyCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                onDragOver={userAlreadyCompleted ? undefined : handleDragOver}
                onDragLeave={userAlreadyCompleted ? undefined : handleDragLeave}
                onDrop={userAlreadyCompleted ? undefined : handleDrop}
              >
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  onChange={userAlreadyCompleted ? undefined : handleChange}
                  className="hidden"
                  disabled={userAlreadyCompleted}
                />
                
                {formData.resume ? (
                  <div className="text-center">
                    <FaCheckCircle className="mx-auto w-8 h-8 text-emerald-400 mb-3" />
                    <p className="text-emerald-400 font-medium text-sm mb-1">Context Successfully Loaded</p>
                    <p className="text-slate-300 text-xs mb-1">{formData.resume.name}</p>
                    <p className="text-slate-500 text-xs mb-4">
                      {(formData.resume.size / 1024).toFixed(2)} KB
                    </p>
                    {!userAlreadyCompleted && (
                      <label
                        htmlFor="resume"
                        className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-200"
                      >
                        <FaCloudUploadAlt className="w-3 h-3 mr-2" /> Replace File
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <FaCloudUploadAlt className="mx-auto w-8 h-8 text-indigo-400/50 mb-3" />
                    <p className="text-slate-300 text-sm mb-1">
                      <span className="text-indigo-400 font-medium">Click to browse</span> or drag and drop
                    </p>
                    <p className="text-slate-500 text-xs mb-4">PDF format only (Max 5MB)</p>
                    {!userAlreadyCompleted && (
                      <label
                        htmlFor="resume"
                        className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-indigo-500 hover:text-white cursor-pointer transition-all duration-200"
                      >
                        <FaUpload className="w-3 h-3 mr-2" /> Select File
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className={`bg-white/5 border border-white/5 rounded-xl p-4 ${userAlreadyCompleted ? 'opacity-50' : ''}`}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={userAlreadyCompleted ? undefined : handleCheckboxClick}
                    className="w-4 h-4 text-indigo-600 bg-[#030712] border-white/20 rounded focus:ring-indigo-500 cursor-pointer focus:ring-offset-0 focus:ring-offset-transparent"
                    disabled={userAlreadyCompleted}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className={`text-sm text-slate-300 ${userAlreadyCompleted ? 'cursor-not-allowed' : 'cursor-pointer hover:text-white transition-colors'}`}>
                    I accept the terms and conditions and agree to the proctoring guidelines.
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !formData.resume || !termsAccepted || userAlreadyCompleted}
                className={`w-full flex justify-center items-center py-4 px-4 text-sm font-bold uppercase tracking-wider rounded-xl text-white transition-all duration-300 ${
                  userAlreadyCompleted
                    ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    : isLoading || !formData.resume || !termsAccepted
                    ? 'bg-indigo-500/50 cursor-not-allowed opacity-50' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-0.5'
                }`}
              >
                {userAlreadyCompleted ? (
                  <>
                    <FaBan className="w-4 h-4 mr-2" />
                    Session Completed
                  </>
                ) : isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing Environment...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4 mr-2" />
                    Initialize Session
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Popup Header */}
            <div className="border-b border-white/5 p-5 relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">System Requirements</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Please acknowledge before proceeding</p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              <div className="bg-amber-500/10 border-l-2 border-amber-500 p-4 rounded-r-xl">
                <div className="flex items-start">
                  <FaExclamationTriangle className="w-4 h-4 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-amber-200/80 leading-relaxed">
                    Strict adherence to these protocols is required. Violations will flag your session for review.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: FaExpand, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Fullscreen Lock', desc: 'Exiting fullscreen is strictly monitored.' },
                  { icon: FaVideo, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Camera Stream', desc: 'Face must remain visible and centered.' },
                  { icon: FaClock, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Time Allocation', desc: 'Allocate ~45 minutes of uninterrupted time.' },
                  { icon: FaWifi, color: 'text-indigo-400', bg: 'bg-indigo-400/10', title: 'Network Integrity', desc: 'Maintain a stable broadband connection.' },
                  { icon: FaBan, color: 'text-rose-400', bg: 'bg-rose-400/10', title: 'Single Access Token', desc: 'Tokens expire immediately upon completion.' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popup Footer */}
            <div className="bg-black/50 p-5 border-t border-white/5">
              <button
                onClick={handleAcceptTerms}
                className="w-full bg-white text-[#0a0f1c] py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                Acknowledge & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;