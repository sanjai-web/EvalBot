import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AiInterview from "../assets/Ai Interview.jpg";
import { 
  FaBriefcase, 
  FaBuilding, 
  FaFileAlt, 
  FaUpload, 
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaChartLine,
  FaChevronDown,
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
    jobName: '',
    companyName: '',
    jobDescription: '',
    questionLevel: '',
    resume: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const navigate = useNavigate();

  // API Base URL with OR operator for local and production
  const API_BASE_URL = 'https://resume-interview-backend.onrender.com' || 'http://localhost:5000';

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

  const getInterviewDuration = () => {
    switch(formData.questionLevel) {
      case 'beginner':
        return '20 minutes';
      case 'intermediate':
        return '25 minutes';
      case 'professional':
        return '30-40 minutes';
      default:
        return '20-40 minutes';
    }
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
      submitData.append('jobName', formData.jobName);
      submitData.append('companyName', formData.companyName);
      submitData.append('jobDescription', formData.jobDescription);
      submitData.append('questionLevel', formData.questionLevel);
      submitData.append('resume', formData.resume);

      const token = localStorage.getItem('token');

      // Updated fetch call using API_BASE_URL
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
        
        navigate('/interview', { 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Prepare Your Interview
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Provide your job details and resume for personalized AI-powered interview preparation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Beautiful Image & Instructions */}
          <div className="hidden lg:block space-y-8">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <img 
                src={AiInterview}
                alt="Professional Business Meeting"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
              
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Get Personalized Interview Practice
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaCheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-100 font-semibold">AI-Powered Analysis</h3>
                    <p className="text-blue-200 text-sm">Our AI analyzes your resume and job requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaCheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-100 font-semibold">Customized Questions</h3>
                    <p className="text-blue-200 text-sm">Get interview questions tailored to your specific role</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaCheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-100 font-semibold">Real-time Feedback</h3>
                    <p className="text-blue-200 text-sm">Receive instant feedback on your answers and performance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Tips for Best Results</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>• Upload your most recent resume</li>
                <li>• Be specific about the job role and company</li>
                <li>• Include key requirements from the job description</li>
                <li>• Choose the appropriate question level for your experience</li>
                <li>• For text extraction, use .txt files (PDF/DOC support coming soon)</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Details Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-indigo-100 rounded-full opacity-20"></div>
            
            <div className="relative z-10">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <FaUserTie className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Job Details
                </h2>
                <p className="text-gray-600 mt-2">
                  Tell us about the position you're applying for
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Job Name Input */}
                <div>
                  <label htmlFor="jobName" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBriefcase className="inline w-4 h-4 mr-2 text-blue-500" />
                    Job Title
                  </label>
                  <input
                    id="jobName"
                    name="jobName"
                    type="text"
                    required
                    value={formData.jobName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {/* Company Name Input */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline w-4 h-4 mr-2 text-blue-500" />
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., Google, Microsoft, etc."
                  />
                </div>

                {/* Job Description Textarea */}
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFileAlt className="inline w-4 h-4 mr-2 text-blue-500" />
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    required
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
                    placeholder="Paste the job description here... Include key responsibilities, requirements, and skills needed."
                  />
                </div>

                {/* Question Level Dropdown */}
                <div>
                  <label htmlFor="questionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaChartLine className="inline w-4 h-4 mr-2 text-blue-500" />
                    Interview Question Level
                  </label>
                  <div className="relative">
                    <select
                      id="questionLevel"
                      name="questionLevel"
                      required
                      value={formData.questionLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 pr-11 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="">Select question difficulty level</option>
                      <option value="beginner">Beginner - Basic concepts and fundamentals</option>
                      <option value="intermediate">Intermediate - Practical scenarios and problem-solving</option>
                      <option value="professional">Professional - Advanced concepts and leadership questions</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChartLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose based on your experience level and the job requirements
                  </p>
                </div>

                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUpload className="inline w-4 h-4 mr-2 text-blue-500" />
                    Upload Resume
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : formData.resume 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
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
                        <FaCheckCircle className="mx-auto w-12 h-12 text-green-500 mb-3" />
                        <p className="text-green-600 font-medium mb-1">Resume Uploaded Successfully!</p>
                        <p className="text-gray-600 text-sm mb-2">{formData.resume.name}</p>
                        <p className="text-gray-500 text-xs mb-4">
                          {formData.resume.type} - {(formData.resume.size / 1024).toFixed(2)} KB
                        </p>
                        <label
                          htmlFor="resume"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                        >
                          <FaCloudUploadAlt className="w-4 h-4 mr-2" />
                          Change File
                        </label>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FaCloudUploadAlt className="mx-auto w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-gray-500 text-sm mb-4">PDF (Max 5MB)</p>
                        <label
                          htmlFor="resume"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                        >
                          <FaUpload className="w-4 h-4 mr-2" />
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleCheckboxClick}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="terms" className="text-sm font-medium text-gray-900 cursor-pointer">
                        I accept the terms and conditions
                      </label>
                      <p className="text-xs text-gray-600 mt-1">
                        Click to view the interview guidelines and requirements
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !formData.resume || !formData.questionLevel || !termsAccepted}
                    className={`w-full flex justify-center items-center py-4 px-6 text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform ${
                      isLoading || !formData.resume || !formData.questionLevel || !termsAccepted
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-105 hover:shadow-xl'
                    } shadow-lg`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Your Details...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-5 h-5 mr-2" />
                        Start Personalized Interview Prep
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="text-center">
                  <div className="flex justify-center space-x-2 mb-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          step === 1 ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Step 1 of 3: Job Details</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Interview Guidelines</h2>
                  <p className="text-blue-100 text-sm mt-1">Please read carefully before proceeding</p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-5">
                {/* Important Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 font-medium">
                      Following these guidelines is essential for a smooth interview experience
                    </p>
                  </div>
                </div>

                {/* Instructions List */}
                <div className="space-y-4">

                  <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaExpand className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Fullscreen Mode Required</h3>
                      <p className="text-sm text-gray-600">
                        Do not exit fullscreen mode during the interview. The interview will be in fullscreen for an uninterrupted experience.
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaClock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Expected Interview Duration</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• <strong>Beginner Level:</strong> Approximately 20 minutes</p>
                        <p>• <strong>Intermediate Level:</strong> Approximately 25 minutes</p>
                        <p>• <strong>Professional Level:</strong> Approximately 30-40 minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaVideo className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Webcam Must Stay ON</h3>
                      <p className="text-sm text-gray-600">
                        Your webcam must remain turned on for the entire duration of the interview. This is mandatory for verification purposes.
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWifi className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Stable Internet Connection Required</h3>
                      <p className="text-sm text-gray-600">
                        Ensure you have a stable and reliable internet connection throughout the interview to avoid disconnections.
                      </p>
                    </div>
                  </div>

                  
                  
                  

                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaExclamationTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">⚠️ Critical Warning</h3>
                      <p className="text-sm text-gray-600">
                        If you exit fullscreen mode at any time during the interview, <strong className="text-red-600">the interview will automatically end</strong> and your session will be terminated.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Tips */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Additional Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Find a quiet, well-lit environment</li>
                    <li>• Test your microphone and camera before starting</li>
                    <li>• Keep your ID ready for verification if required</li>
                    <li>• Close unnecessary applications to ensure optimal performance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleAcceptTerms}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                I Accept - Start Interview Preparation
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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
      `}</style>
    </div>
  );
}

export default Details;