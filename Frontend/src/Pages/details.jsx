import React, { useState } from 'react';
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
  FaBriefcase
} from 'react-icons/fa';

function Details() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resume: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000';

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
            
            fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
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
      console.log('📋 Interview submission details:', {
        email: formData.email,
        resume: formData.resume.name,
        fileSize: (formData.resume.size / 1024).toFixed(2) + ' KB'
      });
      
      try {
        const extractedText = await extractTextFromPDF(formData.resume);
        console.log('📝 Extracted PDF text:', extractedText);
      } catch (error) {
        console.error('PDF text extraction error:', error);
      }

      // Simulate success for demo
      setTimeout(() => {
        alert('✅ Form submitted successfully! Check console for extracted resume text.');
        console.log('✅ Interview preparation completed');
      }, 1000);

    } catch (error) {
      console.error('❌ Submission error:', error);
      alert('❌ An error occurred while submitting the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-100">
        {/* Main geometric pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #4F46E5 12%, transparent 12.5%, transparent 87%, #4F46E5 87.5%, #4F46E5),
              linear-gradient(150deg, #4F46E5 12%, transparent 12.5%, transparent 87%, #4F46E5 87.5%, #4F46E5),
              linear-gradient(30deg, #4F46E5 12%, transparent 12.5%, transparent 87%, #4F46E5 87.5%, #4F46E5),
              linear-gradient(150deg, #4F46E5 12%, transparent 12.5%, transparent 87%, #4F46E5 87.5%, #4F46E5),
              linear-gradient(60deg, #4F46E577 25%, transparent 25.5%, transparent 75%, #4F46E577 75%, #4F46E577),
              linear-gradient(60deg, #4F46E577 25%, transparent 25.5%, transparent 75%, #4F46E577 75%, #4F46E577)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
          }}
        ></div>
        
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #4F46E5 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-100 to-transparent opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-100 to-transparent opacity-10"></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm bg-white/95">
          {/* Form Header */}
          <div className="text-center mb-6">
           
            <h1 className="text-lg font-semibold text-gray-900">
              Candidate Login
            </h1>
           
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline w-3 h-3 mr-1 text-blue-600" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                <FaLock className="inline w-3 h-3 mr-1 text-blue-600" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter your password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                <FaUpload className="inline w-3 h-3 mr-1 text-blue-600" />
                Upload Resume (PDF)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 bg-white ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : formData.resume 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleChange}
                  className="hidden"
                />
                
                {formData.resume ? (
                  <div className="text-center">
                    <FaCheckCircle className="mx-auto w-8 h-8 text-green-500 mb-2" />
                    <p className="text-green-600 font-medium text-sm mb-1">Resume Uploaded</p>
                    <p className="text-gray-600 text-xs mb-1">{formData.resume.name}</p>
                    <p className="text-gray-500 text-xs mb-3">
                      {(formData.resume.size / 1024).toFixed(2)} KB
                    </p>
                    <label
                      htmlFor="resume"
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                    >
                      <FaCloudUploadAlt className="w-3 h-3 mr-1" />
                      Change File
                    </label>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaCloudUploadAlt className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-gray-500 text-xs mb-3">PDF only (Max 5MB)</p>
                    <label
                      htmlFor="resume"
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                    >
                      <FaUpload className="w-3 h-3 mr-1" />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex items-center h-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={handleCheckboxClick}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="ml-2">
                  <label htmlFor="terms" className="text-sm text-gray-900 cursor-pointer">
                    I accept the terms and conditions
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !formData.resume || !termsAccepted}
                className={`w-full flex justify-center items-center py-2 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  isLoading || !formData.resume || !termsAccepted
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md transform hover:-translate-y-0.5'
                } shadow-sm`}
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
                    <FaPaperPlane className="w-3 h-3 mr-2" />
                    Begin Interview
                  </>
                )}
              </button>
            </div>

           
          </form>
        </div>
      </div>

      {/* Terms and Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Popup Header */}
            <div className="bg-gray-900 p-4 relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-white rounded-full p-1 transition-colors duration-200"
              >
                <FaTimes className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaInfoCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Interview Guidelines</h2>
                  <p className="text-gray-300 text-xs">Please review before proceeding</p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 font-medium">
                      Compliance with these guidelines is mandatory
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      icon: FaExpand,
                      color: 'blue',
                      title: 'Fullscreen Mode Required',
                      description: 'Interview must be conducted in fullscreen mode.'
                    },
                    {
                      icon: FaVideo,
                      color: 'green',
                      title: 'Webcam Must Remain Active',
                      description: 'Webcam must be enabled throughout the interview.'
                    },
                    {
                      icon: FaClock,
                      color: 'purple',
                      title: 'Time Commitment',
                      description: 'Interview takes 20-40 minutes without interruptions.'
                    },
                    {
                      icon: FaWifi,
                      color: 'indigo',
                      title: 'Stable Connection',
                      description: 'Reliable internet connection is essential.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className={`w-6 h-6 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <item.icon className={`w-3 h-3 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <button
                onClick={handleAcceptTerms}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;