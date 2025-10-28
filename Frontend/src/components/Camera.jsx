import React, { useRef, useEffect } from 'react';

const Camera = ({ isRecording, interviewActive }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    if (interviewActive) {
      startCamera();
    }

    return () => {
      // Cleanup when component unmounts or interview ends
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewActive]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Your Camera</h2>
        <div className="flex items-center space-x-2 bg-red-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm">Live</span>
        </div>
      </div>
      
      <div className="flex-1 bg-black rounded-lg sm:rounded-xl overflow-hidden relative">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-full h-full object-cover"
        />
        
        {/* Camera overlay elements */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/50 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
          {new Date().toLocaleTimeString()}
        </div>
        
        {/* Network status indicator */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center space-x-1 bg-black/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span className="text-xs">Good</span>
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-center text-blue-200">
        Make sure your face is clearly visible and well-lit
      </div>
    </div>
  );
};

export default Camera;