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

// Fullscreen Exit Modal
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

// Main Role-Based Interview Component
const RoleBasedInterview = () => {
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
  const [categoryScores, setCategoryScores] = useState({});
  const [showEndInterviewButton, setShowEndInterviewButton] = useState(false);
  const [fullscreenInitialized, setFullscreenInitialized] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    name: interviewData?.user?.name || 'Candidate',
    role: interviewData?.collection?.role || 'Professional Role',
    company: interviewData?.companyName || 'Company'
  });

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
  const interviewStartTime = useRef(Date.now());

  const API_URL = 'http://localhost:5000/api';
  const GEMINI_API_KEY = 'AIzaSyAROwOdL1mFBZTqOb81hl6prgv3Jqpvgzk';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Check secure context
  useEffect(() => {
    const isSecureContext = window.isSecureContext;
    
    if (!isSecureContext && window.location.hostname !== 'localhost') {
      setSpeechError("Speech recognition requires HTTPS. Please access the site via HTTPS.");
      setIsSpeechSupported(false);
    }
  }, []);

  // Request microphone permission
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

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setSpeechError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    requestMicrophonePermission();

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
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
        isRecognitionActive.current = false;
        
        switch(event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setSpeechError('Microphone permission denied. Please allow microphone access and refresh the page.');
            setIsSpeechSupported(false);
            setCandidateSpeaking(false);
            break;
          case 'audio-capture':
            setSpeechError('No microphone detected. Please connect a microphone and try again.');
            setCandidateSpeaking(false);
            break;
          case 'network':
            setSpeechError('Network error. Please check your internet connection.');
            break;
          default:
            break;
        }
      };

      recognition.onend = () => {
        isRecognitionActive.current = false;
        
        setTimeout(() => {
          if (candidateSpeaking && recognitionRef.current && !isRecognitionActive.current) {
            if (restartAttempts.current < maxRestartAttempts) {
              restartAttempts.current++;
              try {
                recognitionRef.current.start();
              } catch (error) {
                if (error.name !== 'InvalidStateError') {
                  restartAttempts.current = 0;
                }
              }
            } else {
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
      setIsSpeechSupported(false);
      setSpeechError("Failed to initialize speech recognition. Please refresh the page.");
    }
  }, [candidateSpeaking]);

  // Generate role-based interview questions
  const generateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    try {
      const resumeContent = interviewData?.resume?.textContent || 'Not provided';
      const jobName = interviewData?.jobName || 'Professional Role';
      const companyName = interviewData?.companyName || 'Company';
      const jobDescription = interviewData?.jobDescription || 'General professional role';
      const questionLevel = interviewData?.questionLevel || 'intermediate';

      let questionCount, difficultyGuidance;
      
      if (questionLevel === 'beginner') {
        questionCount = '12-14';
        difficultyGuidance = `DIFFICULTY LEVEL: BEGINNER/ENTRY-LEVEL
- Focus on foundational knowledge and basic understanding of the role
- Ask about definitions, basic concepts, and simple scenarios
- Questions should assess learning potential and enthusiasm
- Avoid complex technical jargon unless it's basic to the role
- Test understanding of fundamental responsibilities`;
      } else if (questionLevel === 'intermediate') {
        questionCount = '16-18';
        difficultyGuidance = `DIFFICULTY LEVEL: INTERMEDIATE
- Focus on practical application and hands-on experience
- Ask about real-world scenarios and problem-solving
- Questions should assess ability to handle typical job challenges
- Include scenario-based questions specific to the role
- Test both technical knowledge and soft skills`;
      } else {
        questionCount = '20-22';
        difficultyGuidance = `DIFFICULTY LEVEL: PROFESSIONAL/ADVANCED
- Focus on advanced expertise, strategic thinking, and leadership
- Ask about complex scenarios, optimization, and best practices
- Include questions on mentoring, decision-making, and team management
- Questions should assess depth of expertise and industry knowledge
- Test architectural thinking, innovation, and problem-solving at scale`;
      }

      const prompt = `You are an expert interviewer conducting a ${questionLevel.toUpperCase()} level role-based interview for a ${jobName} position at ${companyName}.

${difficultyGuidance}

Job Title: ${jobName}
Company: ${companyName}
Job Description: ${jobDescription}
Candidate's Resume: ${resumeContent}
Experience Level: ${questionLevel}

Generate a complete interview with ${questionCount} questions following this EXACT structure:

1. SELF-INTRODUCTION (1 question):
   - Ask the candidate to introduce themselves, focusing on their background relevant to this role

2. PROJECTS DEEP-DIVE (3-5 questions based on experience level):
   - Ask IN-DEPTH questions about specific projects mentioned in their resume
   - Focus on projects that are MOST RELEVANT to the ${jobName} role
   - Ask about technical implementation, challenges, outcomes, and learnings
   - Questions should probe: architecture, design decisions, tools used, team collaboration
   - ${questionLevel === 'professional' ? 'Include questions about leadership, project management, and strategic decisions' : 'Focus on their technical contributions and problem-solving'}

3. INTERNSHIPS/WORK EXPERIENCE (2-3 questions):
   - Ask detailed questions about their professional experience
   - Focus on responsibilities that align with the ${jobName} role
   - Probe into challenges faced and how they overcame them
   - ${questionLevel === 'professional' ? 'Ask about team leadership and mentoring experiences' : 'Ask about learning experiences and growth'}

4. ROLE-SPECIFIC TECHNICAL QUESTIONS (5-7 questions):
   Based on the job description for ${jobName}, ask deep technical questions about:
   - Core technologies and tools mentioned in the job description
   - Industry-specific knowledge and best practices
   - Problem-solving scenarios specific to this role
   - ${questionLevel === 'beginner' ? 'Fundamental concepts and basic usage' : questionLevel === 'intermediate' ? 'Practical application and real-world scenarios' : 'Advanced concepts, optimization, and architecture'}
   
   For example:
   - If it's a Data Scientist role: Ask about ML algorithms, model evaluation, data preprocessing, specific libraries
   - If it's a Product Manager role: Ask about product lifecycle, stakeholder management, prioritization frameworks
   - If it's a DevOps role: Ask about CI/CD, containerization, infrastructure as code, monitoring
   - If it's a UX Designer role: Ask about design thinking, user research, prototyping, accessibility
   - If it's a Marketing role: Ask about campaigns, analytics, A/B testing, customer segmentation

5. SCENARIO-BASED QUESTIONS (3-4 questions):
   - Present realistic job-specific scenarios the candidate would face in this role
   - Ask how they would approach and solve these problems
   - Include questions about handling difficult situations, conflicts, or trade-offs
   - ${questionLevel === 'professional' ? 'Include strategic and leadership scenarios' : 'Include day-to-day work scenarios'}

6. INDUSTRY & DOMAIN KNOWLEDGE (2-3 questions):
   - Ask about industry trends relevant to ${jobName}
   - Test knowledge of competitors, market dynamics, or domain-specific challenges
   - ${questionLevel === 'professional' ? 'Ask about vision for the industry and thought leadership' : 'Ask about awareness of current trends'}

7. SOFT SKILLS & BEHAVIORAL (2-3 questions):
   - Ask STAR-method behavioral questions relevant to the role
   - Focus on teamwork, communication, leadership, conflict resolution
   - ${questionLevel === 'professional' ? 'Include questions about managing teams and stakeholders' : 'Include questions about collaboration and adaptability'}

8. CLOSING (1 question):
   - Professional closing asking if they have questions about the role, team, or company

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${questionCount} questions total
- ALL questions must be directly relevant to the ${jobName} role and job description
- Extract specific technologies, tools, methodologies, and requirements from the job description
- Match difficulty to ${questionLevel.toUpperCase()} level
- Make questions specific and practical, not generic
- Every question should assess competency for THIS specific role

Return ONLY a JSON array of objects with this structure:
[
  {"category": "Self-Introduction", "question": "..."},
  {"category": "Projects - [Project Name]", "question": "..."},
  {"category": "Role-Specific - [Technology/Skill]", "question": "..."},
  {"category": "Scenario-Based", "question": "..."},
  ...
]

For Projects and Role-Specific questions, include the specific project name or technology in the category.`;

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

  // Fallback questions
  const generateFallbackQuestions = () => {
    const jobName = interviewData?.jobName || 'Professional Role';
    const questionLevel = interviewData?.questionLevel || 'intermediate';
    
    const fallbackQuestions = [
      { category: "Self-Introduction", question: `Please introduce yourself and tell me about your background, particularly what draws you to the ${jobName} role.` },
      { category: "Projects", question: "Walk me through one of your most significant projects. What was your role, what challenges did you face, and what was the outcome?" },
      { category: "Projects", question: "Tell me about a project where you had to learn a new technology or skill. How did you approach it?" },
      { category: "Experience", question: "Describe your most relevant professional experience for this role. What were your key responsibilities?" },
      { category: "Role-Specific", question: `What specific skills and experience do you bring that make you a good fit for the ${jobName} position?` },
      { category: "Role-Specific", question: "Tell me about a time when you had to solve a complex problem related to this field. What was your approach?" },
      { category: "Scenario-Based", question: "How would you handle a situation where you disagree with a colleague or manager about the best approach to a project?" },
      { category: "Scenario-Based", question: "Describe a situation where you had to work under tight deadlines. How did you prioritize and manage your time?" },
      { category: "Industry Knowledge", question: `What trends do you see in the ${jobName} field, and how do you stay updated with industry developments?` },
      { category: "Soft Skills", question: "Tell me about a time when you had to collaborate with a difficult team member. How did you handle it?" },
      { category: "Behavioral", question: "Describe a failure or setback you've experienced. What did you learn from it?" },
      { category: "Closing", question: "Do you have any questions for me about the role, team, or company? Is there anything else you'd like to share?" }
    ];
    
    setQuestions(fallbackQuestions);
    setCurrentQuestion(fallbackQuestions[0].question);
    setCurrentCategory(fallbackQuestions[0].category);
  };

  // Evaluate answer
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
- Position: ${interviewData?.jobName || 'Professional Role'}
- Company: ${interviewData?.companyName || 'Company'}
- Job Description: ${interviewData?.jobDescription || 'Professional role'}

Candidate's Question/Statement: ${answer}

Provide a helpful, professional, and encouraging response to their question. Be informative and show enthusiasm about the role and company. Keep your response concise (3-5 sentences).`;
      } else {
        prompt = `You are an expert interviewer evaluating a candidate's answer for a ${interviewData?.jobName || 'Professional Role'} position.

Interview Context:
- Position: ${interviewData?.jobName || 'Professional Role'}
- Company: ${interviewData?.companyName || 'Company'}
- Job Description: ${interviewData?.jobDescription || 'Professional role'}
- Question Category: ${category}
- Experience Level: ${interviewData?.questionLevel || 'intermediate'}

Question Asked: ${question}

Candidate's Answer: ${answer}

Provide a brief evaluation (3-4 sentences) that includes:
1. What was good about the answer (specific strengths)
2. What could be improved (constructive feedback)
3. A specific suggestion for improvement
4. A score out of 10 based on:
   - Relevance to the role
   - Depth of knowledge
   - Communication clarity
   - Practical experience demonstrated

${awaitingFollowUp ? "" : "Also, analyze if this answer warrants a follow-up question to dig deeper into their experience or clarify their response. If yes, suggest ONE relevant follow-up question."}

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
            isCandidateQuestion: true,
            timestamp: new Date().toISOString()
          };
          setConversationHistory(prev => [...prev, newEntry]);
          return newEntry;
        } else {
          const scoreMatch = evaluationText.match(/SCORE:\s*(\d+)/i);
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

          const newEntry = {
            category,
            question,
            answer,
            evaluation: evaluationText,
            score,
            timestamp: new Date().toISOString()
          };
          setConversationHistory(prev => [...prev, newEntry]);
          
          // Update category scores
          setCategoryScores(prev => {
            const categoryKey = category.split(' - ')[0].toLowerCase().replace(/\s+/g, '_');
            const existingScores = prev[categoryKey] || [];
            return {
              ...prev,
              [categoryKey]: [...existingScores, score * 10]
            };
          });

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
        score: 7,
        timestamp: new Date().toISOString()
      };
      setConversationHistory(prev => [...prev, newEntry]);
      return newEntry;
    }
  };

  // Calculate final scores from all conversation history
  const calculateFinalScores = () => {
    const finalScores = {};
    const categoryCounts = {};
    
    // Filter out candidate questions and calculate category averages
    const validEntries = conversationHistory.filter(item => !item.isCandidateQuestion && item.score);
    
    validEntries.forEach(entry => {
      const categoryKey = entry.category.split(' - ')[0].toLowerCase().replace(/\s+/g, '_');
      
      if (!finalScores[categoryKey]) {
        finalScores[categoryKey] = 0;
        categoryCounts[categoryKey] = 0;
      }
      
      finalScores[categoryKey] += (entry.score * 10);
      categoryCounts[categoryKey] += 1;
    });
    
    // Calculate averages
    Object.keys(finalScores).forEach(category => {
      if (categoryCounts[category] > 0) {
        finalScores[category] = Math.round(finalScores[category] / categoryCounts[category]);
      }
    });
    
    return finalScores;
  };

  // Update user completion status
  const updateUserCompletionStatus = async (userId, score) => {
    try {
      const response = await fetch(`${API_URL}/collections/${interviewData.collection._id}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionStatus: 'Completed',
          score: score
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user completion status');
      }

      const updatedUser = await response.json();
      console.log('✅ User completion status updated:', updatedUser);
      return true;
    } catch (error) {
      console.error('❌ Error updating user completion status:', error);
      return false;
    }
  };

  // Save interview results to database
  const saveInterviewResults = async (finalScores, overallScore) => {
    if (!interviewData || !interviewData.user || !interviewData.collection) {
      console.error('Missing interview data');
      return false;
    }

    try {
      // Filter conversation history to remove candidate questions for results
      const validConversationHistory = conversationHistory
        .filter(item => !item.isCandidateQuestion)
        .map(item => ({
          category: item.category,
          question: item.question,
          answer: item.answer,
          evaluation: item.evaluation,
          score: item.score,
          timestamp: item.timestamp
        }));

      const resultsPayload = {
        interviewId: interviewData.collection.interviewId,
        userId: interviewData.user.id,
        userName: interviewData.user.name,
        userEmail: interviewData.user.loginId,
        company: interviewData.collection.company,
        role: interviewData.collection.role,
        domain: interviewData.collection.domain,
        level: interviewData.collection.level,
        conversationHistory: validConversationHistory,
        knowledgeScores: finalScores,
        overallScore: overallScore,
        totalQuestions: questions.length,
        answeredQuestions: validConversationHistory.length,
        interviewDuration: timer
      };

      console.log('📤 Saving interview results:', resultsPayload);

      const saveResponse = await fetch(`${API_URL}/interview/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultsPayload)
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || 'Failed to save interview results');
      }

      const savedData = await saveResponse.json();
      console.log('✅ Interview results saved successfully:', savedData);
      
      // Also update user's completion status directly
      await updateUserCompletionStatus(interviewData.user.id, overallScore);
      
      return true;
    } catch (error) {
      console.error('❌ Error saving interview results:', error);
      alert('Warning: Failed to save interview results to database. Your results may not be stored.');
      return false;
    }
  };

  // Speak question using Web Speech API
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

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
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

  // Auto-fullscreen on mount
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

  // Fullscreen change handler
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

  const handleEndInterviewFromModal = async () => {
    setShowExitConfirm(false);
    await handleEndInterview();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVoiceRecognition = async () => {
    if (!isSpeechSupported) {
      setSpeechToText(speechError || 'Speech recognition is not supported in your browser.');
      return;
    }

    if (!micPermissionGranted) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        return;
      }
    }

    if (!candidateSpeaking) {
      setCandidateSpeaking(true);
      resetSpeechTranscript();
      setSpeechToText("Listening... Speak now!");
      setSpeechError("");
      restartAttempts.current = 0;
      
      try {
        if (recognitionRef.current && !isRecognitionActive.current) {
          recognitionRef.current.start();
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (error.name !== 'InvalidStateError') {
          setSpeechError('Error starting speech recognition. Please try again.');
          setCandidateSpeaking(false);
        }
      }
    } else {
      setCandidateSpeaking(false);
      
      try {
        if (recognitionRef.current && isRecognitionActive.current) {
          recognitionRef.current.stop();
        }
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      
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

  const handleSubmitAnswer = async () => {
    const finalAnswer = answer.trim() || speechToText.replace(/\[.*?\]/g, '').trim();
    
    if (!finalAnswer) {
      alert('Please provide an answer before submitting.');
      return;
    }
    
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
    if (isSavingResults) {
      return; // Prevent duplicate saves
    }

    setIsSavingResults(true);
    
    try {
      // Calculate final scores
      const finalScores = calculateFinalScores();
      
      // Calculate overall score from all valid answers
      const validScores = Object.values(finalScores).filter(score => score > 0);
      const overallScore = validScores.length > 0 
        ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
        : 0;

      console.log('📊 Final Scores:', finalScores);
      console.log('📈 Overall Score:', overallScore);
      console.log('💬 Conversation History:', conversationHistory);

      // Save to database
      const saved = await saveInterviewResults(finalScores, overallScore);
      
      if (!saved) {
        console.warn('⚠️ Results were not saved to database, but continuing to results page');
      }

      // Prepare results data for results page
      const resultsData = {
        interviewData: interviewData,
        conversationHistory: conversationHistory,
        categoryScores: finalScores,
        overallScore: overallScore,
        timer: timer,
        questions: questions,
        totalQuestions: questions.length,
        answeredQuestions: conversationHistory.filter(item => !item.isCandidateQuestion).length,
        saved: saved
      };

      // Navigate to results page
      navigate('/result', { state: { results: resultsData } });
      
    } catch (error) {
      console.error('❌ Error in handleEndInterview:', error);
      alert('An error occurred while ending the interview. Please try again.');
    } finally {
      setIsSavingResults(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const finalAnswer = answer.trim() || speechToText.replace(/\[.*?\]/g, '').trim();
        if (finalAnswer && !isSavingResults) {
          handleSubmitAnswer();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [answer, speechToText, questionNumber, isSavingResults]);

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

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Role-Based AI Interview
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Avatar & Webcam */}
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

        {/* Right Panel - Question & Answer */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          {/* Question Display */}
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
                      Analyzing your resume and the job description to generate deeply personalized, role-specific interview questions...
                    </p>
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed">{currentQuestion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Speech to Text Display */}
          <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-500/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="font-semibold text-green-300">Speech to Text</h3>
                {candidateSpeaking && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Listening</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={toggleVoiceRecognition}
                disabled={!isSpeechSupported || isSavingResults}
                className={`px-4 py-1 rounded-lg text-sm transition-all ${
                  candidateSpeaking 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300' 
                    : isSpeechSupported
                    ? 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30'
                    : 'bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed'
                }`}
              >
                {candidateSpeaking ? '⏸ Stop' : '🎤 Speak'}
              </button>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 min-h-16 max-h-32 overflow-y-auto">
              {speechError && (
                <p className="text-sm text-red-400 mb-2 font-semibold">
                  ⚠️ {speechError}
                </p>
              )}
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {speechToText || (isSpeechSupported 
                  ? (micPermissionGranted 
                    ? "Click the microphone button to start speaking your answer..." 
                    : "Click the microphone button to grant permission and start speaking...")
                  : "Speech recognition not supported. Please type your answer below.")}
              </p>
            </div>
          </div>

          {/* Answer Input Area */}
          <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-300">Your Written Answer</h3>
                {currentCategory === "Closing" && (
                  <span className="text-xs bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 text-green-300">
                    Closing Section - Ask your questions!
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {answer.length} characters
              </div>
            </div>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isSavingResults}
              placeholder="Type your answer here. Be specific and provide examples from your experience. You can also use voice input above..."
              className="flex-1 w-full bg-black/50 text-white p-4 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-400">
                Press <kbd className="px-2 py-1 bg-black/50 rounded text-xs">Ctrl+Enter</kbd> to submit
              </div>
              
              <div className="flex space-x-3">
                {showEndInterviewButton && currentCategory === "Closing" && (
                  <button 
                    onClick={handleEndInterview}
                    disabled={isSavingResults}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isSavingResults
                        ? 'bg-gray-700 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg'
                    }`}
                  >
                    {isSavingResults ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      '🏁 End Interview'
                    )}
                  </button>
                )}
                
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={(!answer.trim() && !speechToText.replace(/\[.*?\]/g, '').trim()) || isSavingResults}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    (answer.trim() || speechToText.replace(/\[.*?\]/g, '').trim()) && !isSavingResults
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' 
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  {currentCategory === "Closing" ? 'Submit & Continue →' : questionNumber < questions.length ? 'Submit Answer →' : 'Submit Answer →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saving Indicator Overlay */}
      {isSavingResults && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Saving Your Results</h2>
              <p className="text-gray-300">
                Please wait while we save your interview results and update your completion status...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleBasedInterview;