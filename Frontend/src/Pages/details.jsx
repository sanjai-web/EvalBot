import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaUpload, 
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaTimes,
  FaExclamationTriangle,
  FaWifi,
  FaVideo,
  FaClock,
  FaExpand,
  FaInfoCircle
} from 'react-icons/fa';

function Details() {
  const [formData, setFormData] = useState({
    interviewID: '',
    emailid: '',
    password: '',
    resume: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';

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
    if (files.length > 0 && (files[0].type === 'application/pdf' || 
        files[0].type === 'application/msword' || 
        files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        files[0].type === 'text/plain')) {
      setFormData({
        ...formData,
        resume: files[0]
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resume) {
      alert('Please upload a resume file');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('interviewID', formData.interviewID);
      submitData.append('emailid', formData.emailid);
      submitData.append('password', formData.password);
      submitData.append('resume', formData.resume);

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/process-interview-details`, {
        method: 'POST',
        body: submitData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Backend processed successfully!');
        
        navigate('/ComputerBased', { 
          state: {
            interviewData: data.data,
            rawFormData: formData
          }
        });
      } else {
        console.error('❌ Backend error:', data.message);
        alert('❌ Error: ' + data.message);
      }

    } catch (error) {
      console.error('❌ Submission error:', error);
      alert('❌ An error occurred while submitting the form.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add CSS as a style tag instead of using styled-jsx
  const popupStyles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }
    
    /* Minimalist Background Pattern */
    .minimalist-bg {
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 10% 20%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
        radial-gradient(at 90% 80%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
        radial-gradient(at 30% 95%, rgba(59, 130, 246, 0.04) 0px, transparent 50%),
        radial-gradient(at 70% 5%, rgba(99, 102, 241, 0.04) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.03) 0px, transparent 50%);
      background-size: 100% 100%;
      position: relative;
    }
    
    .minimalist-bg::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%),
        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 25%),
        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 25%);
      pointer-events: none;
    }
    
    /* Subtle grid pattern */
    .minimalist-bg::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      opacity: 0.4;
    }
  `;

  return (
    <div className="min-h-screen minimalist-bg flex items-center justify-center p-4 relative">
      {/* Add the CSS styles */}
      <style>{popupStyles}</style>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-100 rounded-lg opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-blue-200 rounded-full opacity-10 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-100 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-lg z-10">
      
        {/* Details Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-white/20">
          {/* Background Pattern - Matching GetStart design */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-indigo-100 rounded-full opacity-50"></div>
          
          <div className="relative z-10">
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-3">
                <FaUserTie className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Interview Credentials
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Enter your interview details to begin
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Interview ID Input */}
              <div>
                <label htmlFor="interviewID" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="inline w-3 h-3 mr-1 text-blue-500" />
                  Interview ID
                </label>
                <input
                  id="interviewID"
                  name="interviewID"
                  type="text"
                  required
                  value={formData.interviewID}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/80"
                  placeholder="Enter interview ID provided by company"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="emailid" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="inline w-3 h-3 mr-1 text-blue-500" />
                  Email Address
                </label>
                <input
                  id="emailid"
                  name="emailid"
                  type="email"
                  required
                  value={formData.emailid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/80"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaLock className="inline w-3 h-3 mr-1 text-blue-500" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white/80"
                  placeholder="Enter password provided by company"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUpload className="inline w-3 h-3 mr-1 text-blue-500" />
                  Upload Resume
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50/80' 
                      : formData.resume 
                      ? 'border-green-500 bg-green-50/80' 
                      : 'border-gray-300 hover:border-blue-400 bg-gray-50/80'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleChange}
                    className="hidden"
                  />
                  
                  {formData.resume ? (
                    <div className="text-center">
                      <FaCheckCircle className="mx-auto w-8 h-8 text-green-500 mb-2" />
                      <p className="text-green-600 font-medium text-sm mb-1">{formData.resume.name}</p>
                      <p className="text-gray-500 text-xs mb-2">
                        {(formData.resume.size / 1024).toFixed(2)} KB
                      </p>
                      <label
                        htmlFor="resume"
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                      >
                        <FaCloudUploadAlt className="w-3 h-3 mr-1" />
                        Change File
                      </label>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaCloudUploadAlt className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-gray-500 text-xs mb-3">
                        PDF, DOC, DOCX, TXT (Max 5MB)
                      </p>
                      <label
                        htmlFor="resume"
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                      >
                        <FaUpload className="w-3 h-3 mr-1" />
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={handleCheckboxClick}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 cursor-pointer">
                    I accept the terms and conditions
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.resume || !formData.interviewID || !formData.emailid || !formData.password || !termsAccepted}
                className={`w-full flex justify-center items-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ${
                  isLoading || !formData.resume || !formData.interviewID || !formData.emailid || !formData.password || !termsAccepted
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg transform hover:scale-105'
                } shadow-md`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4 mr-2" />
                    Start Interview
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn border border-gray-200">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Interview Guidelines</h2>
                  <p className="text-blue-100 text-xs mt-0.5">Please read carefully before proceeding</p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-3">
                {/* Important Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 font-medium">
                      Following these guidelines is essential for a valid interview session
                    </p>
                  </div>
                </div>

                {/* Instructions List */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaExpand className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Fullscreen Mode Required</h3>
                      <p className="text-xs text-gray-600">
                        Do not exit fullscreen mode during the interview.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaClock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Duration: 20-40 Minutes</h3>
                      <p className="text-xs text-gray-600">
                        Interview duration varies based on role
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaVideo className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Webcam Must Stay ON</h3>
                      <p className="text-xs text-gray-600">
                        Webcam must remain on for verification purposes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWifi className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Stable Internet Required</h3>
                      <p className="text-xs text-gray-600">
                        Ensure reliable connection throughout
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaExclamationTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">⚠️ Critical Warning</h3>
                      <p className="text-xs text-gray-600">
                        Exiting fullscreen will <strong className="text-red-600">automatically end</strong> the interview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <button
                onClick={handleAcceptTerms}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                I Accept - Start Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;