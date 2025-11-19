import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FaUserCircle } from 'react-icons/fa';
// AI Avatar Components
const AICore = ({ isSpeaking }) => {
  const coreRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = isSpeaking ? 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.2 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y += 0.01;
    }
    
    if (glowRef.current) {
      const glowPulse = isSpeaking ? 1.5 + Math.sin(state.clock.elapsedTime * 6) * 0.3 : 1.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isSpeaking ? "#a78bfa" : "#8b5cf6"}
          emissive={isSpeaking ? "#a78bfa" : "#7c3aed"}
          emissiveIntensity={isSpeaking ? 2 : 1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const OrbitingParticles = ({ isSpeaking }) => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += isSpeaking ? 0.03 : 0.01;
      particlesRef.current.rotation.x += 0.005;
    }
  });

  const particles = [];
  const particleCount = 16;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 1.5;
    const height = Math.sin(angle * 3) * 0.5;
    const color = i % 2 === 0 ? "#f97316" : "#22c55e";
    
    particles.push(
      <mesh
        key={i}
        position={[
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ]}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
    );
  }

  return <group ref={particlesRef}>{particles}</group>;
};

const EnergyRings = ({ isSpeaking }) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  useFrame((state) => {
    const speed = isSpeaking ? 0.02 : 0.01;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += speed;
      ring1Ref.current.rotation.y += speed * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += speed;
      ring2Ref.current.rotation.z += speed * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += speed;
      ring3Ref.current.rotation.x += speed * 0.5;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#eab308"
          emissive="#eab308"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.4, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </>
  );
};

const Scene = ({ isSpeaking }) => {
  return (
    <>
      <ambientLight intensity={0.2} color="#8b5cf6" />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#a78bfa" />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[5, -5, -5]} intensity={0.8} color="#7c3aed" />
      
      <AICore isSpeaking={isSpeaking} />
      <OrbitingParticles isSpeaking={isSpeaking} />
      <EnergyRings isSpeaking={isSpeaking} />
      
      <fog attach="fog" args={['#1e1b4b', 5, 15]} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxDistance={6}
        minDistance={2.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Code Editor Component with IDE-like interface
const CodeEditor = ({ 
  code, 
  onCodeChange, 
  selectedLanguage, 
  onLanguageChange, 
  onRunCode, 
  output, 
  isRunning,
  onSubmitCode,
  onSkipQuestion
}) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const codeContainerRef = useRef(null);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'javascript', label: 'JavaScript' }
  ];

  const handleCodeChange = (e) => {
    onCodeChange(e.target.value);
  };

  // Update line numbers whenever code changes
  useEffect(() => {
    updateLineNumbers();
  }, [code]);

  const updateLineNumbers = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      const lineCount = code.split('\n').length || 1;
      let numbersHTML = '';
      
      for (let i = 1; i <= lineCount; i++) {
        numbersHTML += `${i}\n`;
      }
      
      lineNumbersRef.current.innerHTML = numbersHTML;
      
      // Sync scroll positions
      if (codeContainerRef.current) {
        codeContainerRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onCodeChange(newCode);
      
      // Set cursor position after the inserted tabs
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = () => {
    if (codeContainerRef.current && textareaRef.current) {
      codeContainerRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300">Code Editor</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Editor Body - Fixed height for ~10 lines, scrollable beyond */}
      <div className="flex overflow-hidden bg-gray-900" style={{ height: '240px' }}>
        {/* Line Numbers Container - Scrollable */}
        <div 
          ref={codeContainerRef}
          className="bg-gray-800 border-r border-gray-700 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          style={{ 
            minWidth: '60px', 
            maxWidth: '60px',
            scrollbarWidth: 'thin'
          }}
        >
          <div 
            ref={lineNumbersRef}
            className="text-gray-500 text-right py-2 px-3 font-mono text-sm select-none whitespace-pre leading-6"
          >
            1
          </div>
        </div>
        
        {/* Code Textarea Container - Scrollable */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-2 pl-4 resize-none outline-none leading-6 overflow-auto"
            spellCheck="false"
            placeholder="// Write your code here..."
            style={{ 
              border: 'none',
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937'
            }}
          />
        </div>
      </div>

      {/* Output Panel - Scrollable */}
      <div className="border-t border-gray-700 flex flex-col flex-shrink-0" style={{ height: '200px' }}>
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>
        <div 
          className="flex-1 p-3 bg-black overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
          style={{
            maxHeight: '180px',
            minHeight: '180px'
          }}
        >
          {isRunning ? (
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm">Running code...</span>
            </div>
          ) : output ? (
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">{output}</pre>
          ) : (
            <div className="text-gray-500 text-sm">// Output will appear here after running your code</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 flex justify-between items-center flex-shrink-0">
        <div className="flex space-x-2">
          <button
            onClick={onRunCode}
            disabled={isRunning || !code.trim()}
            className={`px-4 py-2 rounded text-sm font-medium transition-all flex items-center space-x-2 ${
              isRunning || !code.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Run Code</span>
              </>
            )}
          </button>
          
          <button
            onClick={onSkipQuestion}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-all flex items-center space-x-2 shadow-lg hover:shadow-gray-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span>Skip Question</span>
          </button>
        </div>
        
        <button
          onClick={onSubmitCode}
          disabled={!code.trim()}
          className={`px-6 py-2 rounded font-medium transition-all flex items-center space-x-2 ${
            !code.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Submit Code</span>
        </button>
      </div>
    </div>
  );
};

// Fullscreen Exit Modal Component
const FullscreenExitModal = ({ onStayFullscreen, onEndInterview }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Fullscreen Exited</h2>
          <p className="text-gray-300">
            The interview requires fullscreen mode for the best experience and to ensure proper proctoring.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onStayFullscreen}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg"
          >
            Return to Fullscreen
          </button>
          
          <button
            onClick={onEndInterview}
            className="w-full px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-semibold rounded-lg transition-all"
          >
            End Interview
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          Note: Exiting fullscreen multiple times may affect your interview evaluation.
        </p>
      </div>
    </div>
  );
};

// Main Interview Component
const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewData } = location.state || {};
  
  // State management
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [candidateSpeaking, setCandidateSpeaking] = useState(false);
  const [speechToText, setSpeechToText] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true);
  const [evaluation, setEvaluation] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [awaitingFollowUp, setAwaitingFollowUp] = useState(false);
  const [followUpContext, setFollowUpContext] = useState("");
  const [knowledgeScores, setKnowledgeScores] = useState({
    projects: 0,
    internships: 0,
    problemSolving: 0,
    personality: 0
  });
  const [showEndInterviewButton, setShowEndInterviewButton] = useState(false);
  const [fullscreenInitialized, setFullscreenInitialized] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  
  // Code Editor States
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const isRecognitionActive = useRef(false);
  const restartAttempts = useRef(0);
  const maxRestartAttempts = 3;
  const finalTranscriptAccumulator = useRef('');

  const API_URL = 'http://localhost:5000/api';
  const GEMINI_API_KEY = 'AIzaSyAROwOdL1mFBZTqOb81hl6prgv3Jqpvgzk';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // User info state
  const [userInfo, setUserInfo] = useState({
    name: interviewData?.user?.name || 'Candidate',
    role: interviewData?.collection?.role || 'Software Engineer',
    company: interviewData?.companyName || 'Tech Company'
  });

  // Check if current question is a coding question
  const isCodingQuestion = currentCategory.toLowerCase().includes('problem') || 
                          currentCategory.toLowerCase().includes('coding') ||
                          currentCategory.toLowerCase().includes('database');

  // Check if site is served over HTTPS
  useEffect(() => {
    const isSecureContext = window.isSecureContext;
    const protocol = window.location.protocol;
    
    console.log('Security Context:', {
      isSecureContext,
      protocol,
      hostname: window.location.hostname
    });
    
    if (!isSecureContext && window.location.hostname !== 'localhost') {
      setSpeechError("Speech recognition requires HTTPS. Please access the site via HTTPS.");
      setIsSpeechSupported(false);
    }
  }, []);

  // Request microphone permission explicitly
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionGranted(true);
      setSpeechError("");
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setSpeechError("Microphone access denied. Please allow microphone access in browser settings.");
      setMicPermissionGranted(false);
      return false;
    }
  };

  // Reset speech transcript
  const resetSpeechTranscript = () => {
    finalTranscriptAccumulator.current = '';
    setSpeechToText("");
  };

  // Initialize Speech Recognition with better error handling
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      setIsSpeechSupported(false);
      setSpeechError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Request permission on mount
    requestMicrophonePermission();

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        isRecognitionActive.current = true;
        restartAttempts.current = 0;
        setSpeechError("");
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptAccumulator.current += finalTranscript;
        }

        setSpeechToText(() => {
          const baseText = finalTranscriptAccumulator.current.trim();
          return interimTranscript ? `${baseText} [${interimTranscript}]` : baseText;
        });
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        isRecognitionActive.current = false;
        
        switch(event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setSpeechError('Microphone permission denied. Please allow microphone access and refresh the page.');
            setIsSpeechSupported(false);
            setCandidateSpeaking(false);
            break;
          case 'no-speech':
            console.log('No speech detected, will auto-restart...');
            break;
          case 'audio-capture':
            setSpeechError('No microphone detected. Please connect a microphone and try again.');
            setCandidateSpeaking(false);
            break;
          case 'network':
            setSpeechError('Network error. Please check your internet connection.');
            break;
          case 'aborted':
            console.log('Speech recognition aborted');
            break;
          default:
            console.log(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended, candidateSpeaking:', candidateSpeaking);
        isRecognitionActive.current = false;
        
        setTimeout(() => {
          if (candidateSpeaking && recognitionRef.current && !isRecognitionActive.current) {
            if (restartAttempts.current < maxRestartAttempts) {
              restartAttempts.current++;
              try {
                console.log('Auto-restarting recognition, attempt:', restartAttempts.current);
                recognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting recognition:', error);
                if (error.name === 'InvalidStateError') {
                  console.log('Recognition already started');
                } else {
                  restartAttempts.current = 0;
                }
              }
            } else {
              console.log('Max restart attempts reached, resetting counter');
              restartAttempts.current = 0;
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Final restart attempt failed:', error);
              }
            }
          }
        }, 100);
      };

      return () => {
        if (recognition) {
          try {
            isRecognitionActive.current = false;
            recognition.stop();
          } catch (error) {
            console.error('Error stopping recognition on cleanup:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsSpeechSupported(false);
      setSpeechError("Failed to initialize speech recognition. Please refresh the page.");
    }
  }, []);

  // Generate structured interview questions using Gemini API
  const generateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    try {
      const resumeContent = interviewData?.resume?.textContent || 'Not provided';
      const jobName = interviewData?.jobName || 'Software Engineer';
      const companyName = interviewData?.companyName || 'Tech Company';
      const jobDescription = interviewData?.jobDescription || 'General technical role';
      const questionLevel = interviewData?.questionLevel || 'intermediate';

      const hasDatabase = /sql|mysql|postgresql|mongodb|oracle|database|nosql|redis|cassandra/i.test(resumeContent);

      let questionCount, difficultyGuidance, coreCSCount, codingCount;
      
      if (questionLevel === 'beginner') {
        questionCount = '9-11';
        coreCSCount = '3-4';
        codingCount = '2';
        difficultyGuidance = `DIFFICULTY LEVEL: BEGINNER
- Focus on fundamental concepts and basic understanding
- Ask about definitions, simple explanations, and basic syntax
- Coding problems should be simple (easy level on LeetCode)
- Core CS questions should cover basic concepts only
- Avoid complex scenarios or advanced topics
- Questions should test foundational knowledge`;
      } else if (questionLevel === 'intermediate') {
        questionCount = '14-16';
        coreCSCount = '5-6';
        codingCount = '3';
        difficultyGuidance = `DIFFICULTY LEVEL: INTERMEDIATE
- Focus on practical application and problem-solving
- Ask about real-world scenarios and implementation details
- Coding problems should be medium difficulty
- Core CS questions should cover practical applications
- Include scenario-based questions
- Test ability to apply concepts in practice`;
      } else {
        questionCount = '19-21';
        coreCSCount = '7-8';
        codingCount = '4';
        difficultyGuidance = `DIFFICULTY LEVEL: PROFESSIONAL/ADVANCED
- Focus on advanced concepts, optimization, and architecture
- Ask about system design, scalability, and best practices
- Coding problems should be medium to hard difficulty
- Include questions on leadership, mentoring, and decision-making
- Core CS questions should cover advanced topics and trade-offs
- Test depth of knowledge and strategic thinking
- Include architecture and design pattern questions`;
      }

      const prompt = `You are an expert technical interviewer conducting a ${questionLevel.toUpperCase()} level structured interview for a ${jobName} position at ${companyName}.

${difficultyGuidance}

Job Description: ${jobDescription}
Candidate's Resume: ${resumeContent}
Experience Level: ${questionLevel}

Generate a complete interview with ${questionCount} questions following this EXACT structure:

1. SELF-INTRODUCTION (1 question):
   - Ask the candidate to introduce themselves

2. PROJECTS (${questionLevel === 'beginner' ? '1-2' : questionLevel === 'intermediate' ? '2-3' : '3-4'} questions):
   - Ask detailed questions about projects mentioned in their resume
   - Focus on technical implementation, challenges, and outcomes
   - ${questionLevel === 'professional' ? 'Include architecture and design decisions' : 'Focus on their role and learning'}

3. INTERNSHIPS (${questionLevel === 'beginner' ? '1' : '1-2'} questions):
   - Ask about internship experiences and projects from internships
   - Focus on learning and contributions

4. PROBLEM SOLVING - CODING (${codingCount} questions):
   - Ask them to write solutions for coding problems
   - Mention they can solve in ANY programming language (C, C++, Java, Python, JavaScript, etc.)
   - ${questionLevel === 'beginner' ? 'Use EASY difficulty problems (basic loops, arrays, strings)' : questionLevel === 'intermediate' ? 'Use MEDIUM difficulty problems (data structures, algorithms)' : 'Use MEDIUM to HARD difficulty problems (optimization, complex algorithms)'}
   - Include problems related to the job requirements

5. CORE COMPUTER SCIENCE TOPICS (${coreCSCount} questions):
   - Ask questions from: OOPs, Java/Python, Operating System, Computer Networks, DBMS, Data Structures, Algorithms${questionLevel === 'professional' ? ', System Design, Design Patterns' : ''}
   - Distribute across multiple topics (at least ${questionLevel === 'beginner' ? '3' : questionLevel === 'intermediate' ? '4' : '5'} different topics)
   - ${questionLevel === 'beginner' ? 'Focus on definitions and basic concepts' : questionLevel === 'intermediate' ? 'Focus on practical applications and scenarios' : 'Focus on advanced concepts, trade-offs, and best practices'}

${hasDatabase ? `6. DATABASE QUERIES (${questionLevel === 'beginner' ? '1' : '1-2'} questions):
   - Ask them to write SQL/NoSQL queries
   - ${questionLevel === 'beginner' ? 'Simple SELECT queries' : questionLevel === 'intermediate' ? 'JOIN queries and aggregations' : 'Complex queries with optimization'}` : ''}

${hasDatabase ? '7' : '6'}. PERSONALITY & BEHAVIORAL (${questionLevel === 'beginner' ? '1-2' : questionLevel === 'intermediate' ? '2' : '2-3'} questions):
   - Ask situational and behavioral questions
   - ${questionLevel === 'professional' ? 'Include leadership, mentoring, and decision-making scenarios' : 'Focus on teamwork and problem-solving'}

${hasDatabase ? '8' : '7'}. CLOSING (1 question):
   - Professional closing question asking if they have any questions or anything to add

IMPORTANT: 
- Generate EXACTLY ${questionCount} questions total (NOT counting follow-up questions)
- Match difficulty to ${questionLevel.toUpperCase()} level throughout
- Return ONLY a JSON array of objects with this structure:
[
  {"category": "Self-Introduction", "question": "..."},
  {"category": "Projects", "question": "..."},
  {"category": "Core CS - OOPs", "question": "..."},
  ...
]
- For Core CS questions, specify the subtopic in category
- Make questions specific to the candidate's resume and job description
- DO NOT include company/role motivation questions`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const generatedText = data.candidates[0].content.parts[0].text;
        
        try {
          const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedQuestions = JSON.parse(jsonMatch[0]);
            setQuestions(parsedQuestions);
            if (parsedQuestions.length > 0) {
              setCurrentQuestion(parsedQuestions[0].question);
              setCurrentCategory(parsedQuestions[0].category);
            }
          } else {
            throw new Error('No JSON array found');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          generateFallbackQuestions();
        }
      } else {
        generateFallbackQuestions();
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      generateFallbackQuestions();
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Fallback questions if API fails
  const generateFallbackQuestions = () => {
    const questionLevel = interviewData?.questionLevel || 'intermediate';
    
    let fallbackQuestions = [];
    
    if (questionLevel === 'beginner') {
      fallbackQuestions = [
        { category: "Self-Introduction", question: "Please introduce yourself and tell me about your educational background." },
        { category: "Projects", question: "Tell me about a simple project you've worked on. What technologies did you use?" },
        { category: "Projects", question: "What did you learn from your first coding project?" },
        { category: "Internships", question: "What was your role during your internship and what did you work on?" },
        { category: "Problem Solving", question: "Write a simple function to find the largest number in an array. You can use any language." },
        { category: "Problem Solving", question: "Write a function to check if a number is even or odd. Explain your code." },
        { category: "Core CS - OOPs", question: "What is Object-Oriented Programming? Can you explain with a simple example?" },
        { category: "Core CS - Data Structures", question: "What is an array? How is it different from a list?" },
        { category: "Core CS - DBMS", question: "What is a database? Why do we use databases in applications?" },
        { category: "Personality", question: "Tell me about a time you worked in a team. What was your contribution?" },
        { category: "Closing", question: "Do you have any questions for me? Is there anything else you'd like to share?" }
      ];
    } else if (questionLevel === 'intermediate') {
      fallbackQuestions = [
        { category: "Self-Introduction", question: "Please introduce yourself and tell me about your background, education, and what brings you here today." },
        { category: "Projects", question: "Can you walk me through one of the most significant projects you've worked on? What was your role and what technologies did you use?" },
        { category: "Projects", question: "What was the biggest technical challenge you faced in your projects, and how did you overcome it?" },
        { category: "Projects", question: "Tell me about a time when you had to optimize the performance of your project. What approach did you take?" },
        { category: "Internships", question: "Tell me about your internship experience. What did you learn and what were your key contributions?" },
        { category: "Internships", question: "Describe a challenging problem you solved during your internship. What was your approach?" },
        { category: "Problem Solving", question: "Write a function to reverse a string without using any built-in reverse methods. You can use any programming language. Explain your approach and time complexity." },
        { category: "Problem Solving", question: "How would you find the first non-repeating character in a string? Write a solution in your preferred language and explain your logic." },
        { category: "Problem Solving", question: "Given an array of integers, write a function to find two numbers that add up to a specific target. Explain your approach." },
        { category: "Core CS - OOPs", question: "Explain the four pillars of Object-Oriented Programming with real-world examples. How have you applied these concepts in your projects?" },
        { category: "Core CS - Data Structures", question: "Explain the difference between Array and LinkedList. In what scenarios would you choose one over the other?" },
        { category: "Core CS - Operating System", question: "What is the difference between Process and Thread? Explain with real-world scenarios." },
        { category: "Core CS - DBMS", question: "What is database normalization? Explain with examples." },
        { category: "Core CS - Networks", question: "Explain what happens when you type a URL in your browser and press Enter." },
        { category: "Personality", question: "Describe a situation where you had to work with a difficult team member. How did you handle it?" },
        { category: "Personality", question: "Tell me about a time you failed at something. What did you learn from that experience?" },
        { category: "Closing", question: "We've covered a lot today. Do you have any questions for me about the role, team, or company? Is there anything else you'd like to share?" }
      ];
    } else {
      fallbackQuestions = [
        { category: "Self-Introduction", question: "Please introduce yourself, highlighting your most significant technical achievements and leadership experiences." },
        { category: "Projects", question: "Describe the architecture of your most complex project. What design patterns did you use and why?" },
        { category: "Projects", question: "Tell me about a time when you had to make a critical architectural decision. What factors did you consider?" },
        { category: "Projects", question: "How do you approach system design for scalability? Walk me through a recent example." },
        { category: "Projects", question: "Describe a situation where you had to refactor legacy code. What was your strategy?" },
        { category: "Internships", question: "What was the most impactful contribution you made during your professional experience?" },
        { category: "Internships", question: "Have you mentored junior developers? How do you approach mentoring?" },
        { category: "Problem Solving", question: "Design an algorithm to find the longest palindromic substring in a string. Optimize for time and space complexity." },
        { category: "Problem Solving", question: "Implement a LRU cache with O(1) time complexity for both get and put operations. Explain your design." },
        { category: "Problem Solving", question: "Given a binary tree, write a function to serialize and deserialize it. Discuss edge cases." },
        { category: "Problem Solving", question: "Design a rate limiter. Explain different approaches and their trade-offs." },
        { category: "Core CS - OOPs", question: "Explain SOLID principles with practical examples from your experience. How do they improve code quality?" },
        { category: "Core CS - System Design", question: "Design a URL shortening service like bit.ly. Discuss scalability, database design, and caching strategy." },
        { category: "Core CS - Data Structures", question: "Compare different tree data structures (BST, AVL, Red-Black, B-Tree). When would you use each?" },
        { category: "Core CS - Operating System", question: "Explain deadlock in detail. How would you design a system to prevent deadlocks?" },
        { category: "Core CS - DBMS", question: "Explain different database isolation levels and their use cases. What are the trade-offs?" },
        { category: "Core CS - Networks", question: "Design a content delivery network (CDN). How would you handle cache invalidation?" },
        { category: "Core CS - Algorithms", question: "Explain different graph traversal algorithms and their time complexities. When would you use each?" },
        { category: "Core CS - Design Patterns", question: "Discuss the Observer pattern and Publish-Subscribe pattern. What are the differences and when would you use each?" },
        { category: "Personality", question: "Describe a situation where you had to lead a team through a critical production issue. How did you handle it?" },
        { category: "Personality", question: "Tell me about a time you had to make a difficult technical decision with incomplete information. What was your process?" },
        { category: "Personality", question: "How do you approach technical debt? Share an example of how you've managed it in a previous role." },
        { category: "Closing", question: "Based on this discussion, what are your thoughts on this role? Do you have any questions about our technical challenges or team structure?" }
      ];
    }
    
    setQuestions(fallbackQuestions);
    setCurrentQuestion(fallbackQuestions[0].question);
    setCurrentCategory(fallbackQuestions[0].category);
  };

  // Evaluate answer using Gemini API
  const evaluateAnswer = async (question, answer, category) => {
    if (!answer.trim()) {
      setEvaluation("Please provide an answer before submitting.");
      return null;
    }

    try {
      const isClosingQuestion = category === "Closing";
      const isCandidateQuestion = isClosingQuestion && (answer.toLowerCase().includes('?') || answer.toLowerCase().includes('question'));

      let prompt;

      if (isCandidateQuestion) {
        prompt = `You are an expert interviewer. The candidate has asked you a question during the closing of the interview.

Interview Context:
- Position: ${interviewData?.jobName || 'Software Engineer'}
- Company: ${interviewData?.companyName || 'Tech Company'}

Candidate's Question/Statement: ${answer}

Provide a helpful, professional, and encouraging response to their question. Be informative and show enthusiasm about the role and company. Keep your response concise (3-5 sentences). If they asked about the role, company culture, next steps, or any other topic, provide a thoughtful answer.`;
      } else {
        prompt = `You are an expert interviewer evaluating a candidate's answer.

Interview Context:
- Position: ${interviewData?.jobName || 'Software Engineer'}
- Company: ${interviewData?.companyName || 'Tech Company'}
- Question Category: ${category}
- Experience Level: ${interviewData?.questionLevel || 'intermediate'}

Question Asked: ${question}

Candidate's Answer: ${answer}

${category === "Problem Solving" || category.toLowerCase().includes('problem') ? "NOTE: The candidate can solve coding problems in ANY programming language (C, C++, Java, Python, JavaScript, etc.). Evaluate based on logic, correctness, and efficiency regardless of language choice.\n\n" : ""}

Provide a brief evaluation (3-4 sentences) that includes:
1. What was good about the answer
2. What could be improved
3. A specific suggestion for improvement
4. A score out of 10

${awaitingFollowUp ? "" : "Also, analyze if this answer warrants a follow-up question to dig deeper. If yes, suggest ONE relevant follow-up question based on their response."}

Format your response EXACTLY as:
EVALUATION: [your evaluation]
SCORE: X/10
FOLLOW_UP: [yes/no]
${awaitingFollowUp ? "" : "QUESTION: [follow-up question if FOLLOW_UP is yes]"}

Keep it constructive, professional, and encouraging.`;
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const evaluationText = data.candidates[0].content.parts[0].text;
        setEvaluation(evaluationText);

        if (isCandidateQuestion) {
          const newEntry = {
            category,
            question: "Candidate's Question",
            answer,
            evaluation: evaluationText,
            isCandidateQuestion: true
          };
          setConversationHistory(prev => [...prev, newEntry]);
          return newEntry;
        } else {
          const scoreMatch = evaluationText.match(/SCORE:\s*(\d+)/i);
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

          setKnowledgeScores(prev => {
            const updated = { ...prev };
            const scorePercentage = score * 10;
            
            if (category.toLowerCase().includes('project')) {
              updated.projects = prev.projects === 0 
                ? scorePercentage 
                : Math.round((prev.projects + scorePercentage) / 2);
            } else if (category.toLowerCase().includes('internship')) {
              updated.internships = prev.internships === 0 
                ? scorePercentage 
                : Math.round((prev.internships + scorePercentage) / 2);
            } else if (category.toLowerCase().includes('problem') || category.toLowerCase().includes('database')) {
              updated.problemSolving = prev.problemSolving === 0 
                ? scorePercentage 
                : Math.round((prev.problemSolving + scorePercentage) / 2);
            } else if (category.toLowerCase().includes('personality') || category.toLowerCase().includes('behavioral')) {
              updated.personality = prev.personality === 0 
                ? scorePercentage 
                : Math.round((prev.personality + scorePercentage) / 2);
            }
            return updated;
          });

          const newEntry = {
            category,
            question,
            answer,
            evaluation: evaluationText,
            score
          };
          setConversationHistory(prev => [...prev, newEntry]);
          return newEntry;
        }
      }
      return null;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setEvaluation("Thank you for your answer. Your response has been recorded.");
      
      const newEntry = {
        category,
        question,
        answer,
        evaluation: "Response recorded",
        score: 7
      };
      setConversationHistory(prev => [...prev, newEntry]);
      return newEntry;
    }
  };

  // Execute code using Gemini API
  const executeCodeWithGemini = async (code, language) => {
    try {
      const prompt = `You are a code execution engine. Execute the following ${language} code and provide ONLY the actual output that would be printed to the console. If there are any errors, provide the error message.

Code:
\`\`\`${language}
${code}
\`\`\`

Rules:
1. Only output the actual execution result or error message
2. Do not include any explanations, comments, or additional text
3. If the code has print/console.log statements, show exactly what would be printed
4. If there are multiple outputs, show them in order
5. If the code has no output, return "No output produced"
6. If there are syntax errors, return the error message

Output:`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        return "Error: Unable to execute code";
      }
    } catch (error) {
      console.error('Error executing code:', error);
      return `Error executing code: ${error.message}`;
    }
  };

  // Speak question using Web Speech API with better voice and natural pauses
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Microsoft Zira Desktop') ||
        voice.name.includes('Google US English') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Daniel')
      );
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService === false
        );
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      synthesisRef.current = utterance;
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      };
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
  }, []);

  // Initialize webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    startCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (synthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current && isRecognitionActive.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, []);

  // Initialize timer and generate questions
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    generateInterviewQuestions();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Speak question when it changes
  useEffect(() => {
    if (currentQuestion && !isGeneratingQuestions) {
      setTimeout(() => {
        speakQuestion(currentQuestion);
      }, 1000);
    }
  }, [currentQuestion, isGeneratingQuestions]);

  // AUTO-FULLSCREEN: Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const elem = containerRef.current;
        if (elem && !document.fullscreenElement) {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen();
          }
          setFullscreenInitialized(true);
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    };

    setTimeout(enterFullscreen, 500);
  }, []);

  // Fullscreen change handler with modal
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && fullscreenInitialized) {
        setShowExitConfirm(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [fullscreenInitialized]);

  const handleStayFullscreen = async () => {
    setShowExitConfirm(false);
    try {
      const elem = containerRef.current;
      if (elem && !document.fullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Error re-entering fullscreen:', error);
    }
  };

  const handleEndInterviewFromModal = () => {
    setShowExitConfirm(false);
    handleEndInterview();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVoiceRecognition = async () => {
    if (!isSpeechSupported) {
      alert(speechError || 'Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (!micPermissionGranted) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        return;
      }
    }

    if (!candidateSpeaking) {
      // Start listening
      setCandidateSpeaking(true);
      resetSpeechTranscript();
      setSpeechError("");
      restartAttempts.current = 0;
      
      try {
        if (recognitionRef.current && !isRecognitionActive.current) {
          console.log('Starting speech recognition from button click');
          recognitionRef.current.start();
        } else {
          console.log('Recognition already active or not initialized');
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (error.name !== 'InvalidStateError') {
          setSpeechError('Error starting speech recognition. Please try again.');
          setCandidateSpeaking(false);
        }
      }
    } else {
      // Stop listening
      console.log('Stopping speech recognition from button click');
      setCandidateSpeaking(false);
      
      try {
        if (recognitionRef.current && isRecognitionActive.current) {
          recognitionRef.current.stop();
        }
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      
      // Transfer speech to text to answer field
      const cleanText = speechToText.replace(/\[.*?\]/g, '').trim();
      if (cleanText && cleanText !== "Listening... Speak now!") {
        setAnswer(prev => {
          const combined = prev + (prev ? ' ' : '') + cleanText;
          return combined;
        });
      }
      setSpeechToText("");
    }
  };

  // Handle Run Code for the Code Editor - Now using Gemini API
  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("Please write some code before running.");
      return;
    }

    setIsRunning(true);
    setOutput("Executing code...");

    try {
      const result = await executeCodeWithGemini(code, selectedLanguage);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle Code Submission
  const handleSubmitCode = () => {
    const finalAnswer = code.trim();
    
    if (!finalAnswer) {
      alert('Please write some code before submitting.');
      return;
    }

    console.log("Code submitted:", finalAnswer);
    
    // For coding questions, we use the code as the answer
    handleSubmitAnswerWithCode(finalAnswer);
  };

  // Modified submit function for coding questions
  const handleSubmitAnswerWithCode = async (codeAnswer) => {
    const finalAnswer = codeAnswer;
    
    if (!finalAnswer) {
      alert('Please provide an answer before submitting.');
      return;
    }

    console.log("Answer submitted:", finalAnswer);
    
    if (recognitionRef.current && candidateSpeaking) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    setCandidateSpeaking(false);
    resetSpeechTranscript();
    
    const isClosingQuestion = currentCategory === "Closing";
    
    const result = await evaluateAnswer(currentQuestion, finalAnswer, currentCategory);
    
    setTimeout(() => {
      if (isClosingQuestion) {
        setAnswer("");
        setSpeechToText("");
        setCode("");
        setShowEndInterviewButton(true);
        
        if (result && result.isCandidateQuestion && result.evaluation) {
          console.log("Speaking AI response:", result.evaluation);
          speakQuestion(result.evaluation);
        }
        return;
      }
      
      if (result && !result.isCandidateQuestion) {
        const evalText = result.evaluation;
        const followUpMatch = evalText.match(/FOLLOW_UP:\s*(yes)/i);
        const questionMatch = evalText.match(/QUESTION:\s*(.+?)(?:\n|$)/i);

        if (followUpMatch && questionMatch && !awaitingFollowUp) {
          const followUpQuestion = questionMatch[1].trim();
          setCurrentQuestion(followUpQuestion);
          setAnswer("");
          setSpeechToText("");
          setCode("");
          setEvaluation("");
          setAwaitingFollowUp(true);
          return;
        }
      }

      setAwaitingFollowUp(false);
      setFollowUpContext("");

      if (questionNumber < questions.length) {
        const nextIndex = questionNumber;
        setQuestionNumber(questionNumber + 1);
        setCurrentQuestion(questions[nextIndex].question);
        setCurrentCategory(questions[nextIndex].category);
        setAnswer("");
        setSpeechToText("");
        setCode("");
        setEvaluation("");
        
        if (questions[nextIndex].category === "Closing") {
          setShowEndInterviewButton(false);
        }
      }
    }, 1000);
  };

  // Skip question functionality
  const handleSkipQuestion = () => {
    if (recognitionRef.current && candidateSpeaking) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    setCandidateSpeaking(false);
    resetSpeechTranscript();
    
    // Add skipped question to conversation history
    const skippedEntry = {
      category: currentCategory,
      question: currentQuestion,
      answer: isCodingQuestion ? "[Code Skipped by candidate]" : "[Skipped by candidate]",
      evaluation: "Question was skipped",
      score: 0,
      skipped: true
    };
    setConversationHistory(prev => [...prev, skippedEntry]);
    
    // Move to next question
    setAwaitingFollowUp(false);
    setFollowUpContext("");

    if (questionNumber < questions.length) {
      const nextIndex = questionNumber;
      setQuestionNumber(questionNumber + 1);
      setCurrentQuestion(questions[nextIndex].question);
      setCurrentCategory(questions[nextIndex].category);
      setAnswer("");
      setSpeechToText("");
      setCode("");
      setEvaluation("");
      
      if (questions[nextIndex].category === "Closing") {
        setShowEndInterviewButton(false);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    const finalAnswer = answer.trim();
    
    if (!finalAnswer) {
      alert('Please provide an answer before submitting.');
      return;
    }

    console.log("Answer submitted:", finalAnswer);
    
    if (recognitionRef.current && candidateSpeaking) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    setCandidateSpeaking(false);
    resetSpeechTranscript();
    
    const isClosingQuestion = currentCategory === "Closing";
    
    const result = await evaluateAnswer(currentQuestion, finalAnswer, currentCategory);
    
    setTimeout(() => {
      if (isClosingQuestion) {
        setAnswer("");
        setSpeechToText("");
        setShowEndInterviewButton(true);
        
        if (result && result.isCandidateQuestion && result.evaluation) {
          console.log("Speaking AI response:", result.evaluation);
          speakQuestion(result.evaluation);
        }
        return;
      }
      
      if (result && !result.isCandidateQuestion) {
        const evalText = result.evaluation;
        const followUpMatch = evalText.match(/FOLLOW_UP:\s*(yes)/i);
        const questionMatch = evalText.match(/QUESTION:\s*(.+?)(?:\n|$)/i);

        if (followUpMatch && questionMatch && !awaitingFollowUp) {
          const followUpQuestion = questionMatch[1].trim();
          setCurrentQuestion(followUpQuestion);
          setAnswer("");
          setSpeechToText("");
          setEvaluation("");
          setAwaitingFollowUp(true);
          return;
        }
      }

      setAwaitingFollowUp(false);
      setFollowUpContext("");

      if (questionNumber < questions.length) {
        const nextIndex = questionNumber;
        setQuestionNumber(questionNumber + 1);
        setCurrentQuestion(questions[nextIndex].question);
        setCurrentCategory(questions[nextIndex].category);
        setAnswer("");
        setSpeechToText("");
        setEvaluation("");
        
        if (questions[nextIndex].category === "Closing") {
          setShowEndInterviewButton(false);
        }
      }
    }, 1000);
  };

  const handleEndInterview = async () => {
    calculateFinalScores();
    
    const resultsData = {
      interviewData: interviewData,
      conversationHistory: conversationHistory,
      knowledgeScores: knowledgeScores,
      timer: timer,
      questions: questions,
      totalQuestions: questions.length,
      answeredQuestions: conversationHistory.filter(item => !item.isCandidateQuestion).length
    };
    
    // Calculate overall score
    const overallScore = Math.round(
      Object.values(knowledgeScores).reduce((sum, score) => sum + score, 0) / 
      Object.values(knowledgeScores).length
    );

    try {
      // Save results to database
      const saveResponse = await fetch(`${API_URL}/interview/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewData.collection.interviewId,
          userId: interviewData.user.id,
          userName: interviewData.user.name,
          userEmail: interviewData.user.loginId,
          company: interviewData.collection.company,
          role: interviewData.collection.role,
          domain: interviewData.collection.domain,
          level: interviewData.collection.level,
          conversationHistory: conversationHistory.filter(item => !item.isCandidateQuestion),
          knowledgeScores: knowledgeScores,
          overallScore: overallScore,
          totalQuestions: questions.length,
          answeredQuestions: conversationHistory.filter(item => !item.isCandidateQuestion).length,
          interviewDuration: timer
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save interview results');
      }

      console.log('✅ Interview results saved successfully');
    } catch (error) {
      console.error('❌ Error saving interview results:', error);
    }

    // Navigate to results page
    navigate('/result', { state: { results: resultsData } });
  };

  const calculateFinalScores = () => {
    const categoryScores = {
      projects: [],
      internships: [],
      problemSolving: [],
      personality: []
    };

    conversationHistory.forEach(item => {
      if (item.isCandidateQuestion) return;

      const category = item.category.toLowerCase();
      const score = item.score || 7;
      const scorePercentage = score * 10;

      if (category.includes('project')) {
        categoryScores.projects.push(scorePercentage);
      } else if (category.includes('internship')) {
        categoryScores.internships.push(scorePercentage);
      } else if (category.includes('problem') || category.includes('database')) {
        categoryScores.problemSolving.push(scorePercentage);
      } else if (category.includes('personality') || category.includes('behavioral')) {
        categoryScores.personality.push(scorePercentage);
      }
    });

    const calculateAverage = (scores) => {
      if (scores.length === 0) return 0;
      const sum = scores.reduce((acc, score) => acc + score, 0);
      return Math.round(sum / scores.length);
    };

    setKnowledgeScores({
      projects: calculateAverage(categoryScores.projects),
      internships: calculateAverage(categoryScores.internships),
      problemSolving: calculateAverage(categoryScores.problemSolving),
      personality: calculateAverage(categoryScores.personality)
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (isCodingQuestion) {
          const finalCode = code.trim();
          if (finalCode) {
            handleSubmitCode();
          }
        } else {
          const finalAnswer = answer.trim();
          if (finalAnswer) {
            handleSubmitAnswer();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [answer, code, speechToText, questionNumber, isCodingQuestion]);

  return (
    <div 
      ref={containerRef}
      className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col"
    >
      {showExitConfirm && (
        <FullscreenExitModal 
          onStayFullscreen={handleStayFullscreen}
          onEndInterview={handleEndInterviewFromModal}
        />
      )}

      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Eval-Bot
          </div>
          <div className="text-sm text-gray-400">
            {interviewData ? `${interviewData.jobName} at ${interviewData.companyName}` : 'Interview Session'}
          </div>
          <div className="text-sm text-gray-400">
            Question {questionNumber}/{questions.length}
          </div>
          {currentCategory && (
            <div className="text-xs bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
              {currentCategory}
            </div>
          )}
          {awaitingFollowUp && (
            <div className="text-xs bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              Follow-up Question
            </div>
          )}
          {isCodingQuestion && (
            <div className="text-xs bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
              Coding Question
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          {/* User Info Display */}
          <div className="flex items-center space-x-3 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
            <div className="flex items-center space-x-2">
              <FaUserCircle className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <div className="text-sm font-medium text-white">{userInfo.name}</div>
                <div className="text-xs text-blue-300">{userInfo.role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-lg font-bold">{formatTime(timer)}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm font-medium">{isRecording ? 'Recording' : 'Paused'}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-sm">{isFullscreen ? 'Fullscreen Active' : 'Not Fullscreen'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 flex flex-col p-4 space-y-4">
          <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">AI Interviewer</h2>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                className="w-full h-full"
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
              >
                <Scene isSpeaking={aiSpeaking} />
              </Canvas>
              
              <div className="absolute top-2 right-2 flex items-center space-x-1 bg-indigo-900/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${aiSpeaking ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                <div className={`w-2 h-2 rounded-full ${aiSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-orange-400'}`}></div>
                <div className={`w-2 h-2 rounded-full ${aiSpeaking ? 'bg-red-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-xs ml-1">{aiSpeaking ? 'Speaking' : 'Listening'}</span>
              </div>
            </div>
          </div>

          <div className="h-96 bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Your Camera</h2>
              <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </div>
            
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {new Date().toLocaleTimeString()}
              </div>
              
              <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs">Good Quality</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 space-y-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-purple-300">AI Interviewer asks:</h3>
                  {currentCategory && (
                    <span className="text-xs bg-purple-600/30 px-2 py-1 rounded-full">
                      {currentCategory}
                    </span>
                  )}
                  {awaitingFollowUp && (
                    <span className="text-xs bg-orange-600/30 px-2 py-1 rounded-full">
                      Follow-up
                    </span>
                  )}
                  {aiSpeaking && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                      <span className="text-xs text-green-400 ml-1">Speaking</span>
                    </div>
                  )}
                  {isGeneratingQuestions && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-400 ml-1">Generating Questions...</span>
                    </div>
                  )}
                </div>
                {isGeneratingQuestions ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                    <p className="text-lg leading-relaxed text-gray-400">
                      Generating personalized structured interview questions based on your resume...
                    </p>
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed">{currentQuestion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Code Editor for Coding Questions, Regular Answer for Others */}
          {isCodingQuestion ? (
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRunCode={handleRunCode}
              output={output}
              isRunning={isRunning}
              onSubmitCode={handleSubmitCode}
              onSkipQuestion={handleSkipQuestion}
            />
          ) : (
            <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-500/30 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-300">Your Answer</h3>
                  {currentCategory === "Closing" && (
                    <span className="text-xs bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 text-green-300">
                      Closing Section - Ask your questions!
                    </span>
                  )}
                  {candidateSpeaking && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Listening</span>
                    </div>
                  )}
                  {!isSpeechSupported && (
                    <span className="text-xs text-red-400 ml-2">(Not supported)</span>
                  )}
                  {!micPermissionGranted && isSpeechSupported && (
                    <span className="text-xs text-yellow-400 ml-2">(Mic permission required)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {answer.length} characters
                </div>
              </div>

              {/* Speech Error Display */}
              {speechError && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-300 font-medium">
                    ⚠️ {speechError}
                  </p>
                </div>
              )}

              {/* Speech Recognition Status */}
              {candidateSpeaking && speechToText && (
                <div className="mb-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <span className="text-sm text-green-300 font-medium">Listening...</span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {speechToText}
                  </p>
                  {speechToText.includes('[') && (
                    <p className="text-xs text-green-400 mt-1">
                      Words in brackets are being processed in real-time...
                    </p>
                  )}
                </div>
              )}

              {/* Textarea with Microphone Button */}
              <div className="flex-1 relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. You can also use voice input by clicking the microphone button."
                  className="w-full h-full bg-black/50 text-white p-4 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-sm pr-16"
                />
                
                {/* Round Microphone Button */}
                <button
                  onClick={toggleVoiceRecognition}
                  disabled={!isSpeechSupported}
                  className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    candidateSpeaking 
                      ? 'bg-red-500/80 border border-red-500 text-white shadow-lg' 
                      : isSpeechSupported
                      ? 'bg-green-500/80 border border-green-500 text-white hover:bg-green-600 shadow-lg hover:scale-105'
                      : 'bg-gray-500/80 border border-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {candidateSpeaking ? 
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    :
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  }
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-400">
                  Press <kbd className="px-2 py-1 bg-black/50 rounded text-xs">Ctrl+Enter</kbd> to submit
                </div>
                
                <div className="flex space-x-3">
                  {/* Skip Question Button */}
                  <button 
                    onClick={handleSkipQuestion}
                    className="px-6 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg border border-gray-500/30"
                  >
                    Skip Question →
                  </button>
                  
                  {showEndInterviewButton && currentCategory === "Closing" && (
                    <button 
                      onClick={handleEndInterview}
                      className="px-6 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg"
                    >
                      🏁 End Interview
                    </button>
                  )}
                  
                  <button 
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      answer.trim()
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' 
                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {currentCategory === "Closing" ? 'Submit & Continue →' : questionNumber < questions.length ? 'Submit Answer →' : 'Submit Answer →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;