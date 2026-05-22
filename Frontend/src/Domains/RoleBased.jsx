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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative border border-amber-500/30">
            <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/20"></div>
            <svg className="w-10 h-10 text-amber-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Fullscreen Exited</h2>
          <p className="text-slate-400 text-sm">
            The interview requires fullscreen mode for the best experience and to ensure proper proctoring.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onStayFullscreen}
            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            Return to Fullscreen
          </button>
          
          <button
            onClick={onEndInterview}
            className="w-full px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-wider text-sm rounded-xl transition-all"
          >
            End Interview
          </button>
        </div>
        
        <p className="text-xs text-slate-500 text-center mt-6 font-medium">
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        const generatedText = data.choices[0].message.content;
        
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

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        const evaluationText = data.choices[0].message.content;
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
          'Content-Type': 'application/json'
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
        userId: interviewData.user.id || interviewData.user._id,
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
          'Content-Type': 'application/json'
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
      className="h-screen bg-[#030712] text-slate-300 overflow-hidden flex flex-col relative"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>

      {showExitConfirm && (
        <FullscreenExitModal 
          onStayFullscreen={handleStayFullscreen}
          onEndInterview={handleEndInterviewFromModal}
        />
      )}

      {/* Header Bar */}
      <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <span className="text-white text-lg">E</span>
            </div>
            <span>Eval-Bot</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="text-sm text-slate-400 font-medium">
            {interviewData ? `${interviewData.jobName} at ${interviewData.companyName}` : 'Interview Session'}
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Question {questionNumber}/{questions.length}
          </div>
          {currentCategory && (
            <div className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
              {currentCategory}
            </div>
          )}
          {awaitingFollowUp && (
            <div className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
              Follow-up
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User Info Display */}
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <FaUserCircle className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white leading-tight">{userInfo.name}</div>
                <div className="text-xs text-indigo-300 font-medium">{userInfo.role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-lg font-bold text-white tracking-wider">{formatTime(timer)}</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-colors ${isRecording ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse' : 'bg-slate-500'}`}></div>
            <span className={`text-sm font-bold uppercase tracking-wider ${isRecording ? 'text-rose-400' : 'text-slate-400'}`}>{isRecording ? 'Recording' : 'Paused'}</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-colors ${isFullscreen ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
            <svg className={`w-4 h-4 ${isFullscreen ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className={`text-xs font-bold uppercase tracking-wider ${isFullscreen ? 'text-emerald-400' : 'text-slate-400'}`}>{isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden z-10 p-4 gap-4">
        {/* Left Panel - AI Avatar & Webcam */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex-1 bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>AI Interviewer</span>
              </h2>
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 border border-emerald-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50 border border-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50 border border-rose-500"></div>
              </div>
            </div>
            
            <div className="flex-1 relative rounded-xl overflow-hidden bg-black/40 border border-white/5">
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                className="w-full h-full"
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
              >
                <Scene isSpeaking={aiSpeaking} />
              </Canvas>
              
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-[#0a0f1c]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                <div className={`w-1.5 h-1.5 rounded-full ${aiSpeaking ? 'bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${aiSpeaking ? 'bg-emerald-400 animate-pulse delay-75 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${aiSpeaking ? 'bg-emerald-400 animate-pulse delay-150 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
                <span className={`text-xs font-bold uppercase tracking-wider ml-1 ${aiSpeaking ? 'text-emerald-400' : 'text-slate-400'}`}>{aiSpeaking ? 'Speaking' : 'Listening'}</span>
              </div>
            </div>
          </div>

          <div className="h-80 bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span>Your Camera</span>
              </h2>
              <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Live</span>
              </div>
            </div>
            
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-white/5">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-3 left-3 bg-[#0a0f1c]/80 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-mono border border-white/10">
                {new Date().toLocaleTimeString()}
              </div>
              
              <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 bg-[#0a0f1c]/80 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-emerald-300">HQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Question & Answer */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Question Display */}
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">AI Interviewer asks:</h3>
                  {currentCategory && (
                    <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      {currentCategory}
                    </span>
                  )}
                  {awaitingFollowUp && (
                    <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                      Follow-up
                    </span>
                  )}
                  {aiSpeaking && (
                    <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 ml-1">Speaking</span>
                    </div>
                  )}
                  {isGeneratingQuestions && (
                    <div className="flex items-center space-x-1.5 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 ml-1">Generating Questions...</span>
                    </div>
                  )}
                </div>
                {isGeneratingQuestions ? (
                  <div className="flex items-center space-x-3 text-slate-400 bg-white/5 p-4 rounded-xl border border-white/5">
                    <svg className="w-5 h-5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-medium">Analyzing your resume and the job description to generate deeply personalized, role-specific interview questions...</p>
                  </div>
                ) : (
                  <p className="text-lg md:text-xl text-white leading-relaxed font-medium">{currentQuestion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Speech to Text Display */}
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Speech to Text</h3>
                {candidateSpeaking && (
                  <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Listening</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={toggleVoiceRecognition}
                disabled={!isSpeechSupported || isSavingResults}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  candidateSpeaking 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                    : isSpeechSupported
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                {candidateSpeaking ? '⏸ Stop' : '🎤 Speak'}
              </button>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 min-h-16 max-h-32 overflow-y-auto border border-white/5 custom-scrollbar">
              {speechError && (
                <p className="text-sm text-rose-400 mb-2 font-medium flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{speechError}</span>
                </p>
              )}
              <p className={`text-sm whitespace-pre-wrap leading-relaxed ${speechToText ? 'text-slate-300' : 'text-slate-500 italic'}`}>
                {speechToText || (isSpeechSupported 
                  ? (micPermissionGranted 
                    ? "Click the microphone button to start speaking your answer..." 
                    : "Click the microphone button to grant permission and start speaking...")
                  : "Speech recognition not supported. Please type your answer below.")}
              </p>
            </div>
          </div>

          {/* Answer Input Area */}
          <div className="flex-1 bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Your Written Answer</h3>
                {currentCategory === "Closing" && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ask your questions!
                  </span>
                )}
              </div>
              <div className="text-xs font-mono bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400">
                {answer.length} chars
              </div>
            </div>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isSavingResults}
              placeholder="Type your answer here. Be specific and provide examples from your experience..."
              className="flex-1 w-full bg-black/40 text-slate-200 p-5 rounded-xl border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none text-base custom-scrollbar transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <div className="flex justify-between items-center mt-5">
              <div className="text-xs text-slate-500 font-medium">
                Press <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-md font-mono text-slate-400 mx-1">Ctrl+Enter</kbd> to submit
              </div>
              
              <div className="flex space-x-3">
                {showEndInterviewButton && currentCategory === "Closing" && (
                  <button 
                    onClick={handleEndInterview}
                    disabled={isSavingResults}
                    className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center space-x-2 ${
                      isSavingResults
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    }`}
                  >
                    {isSavingResults ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/20 border-t-white"></div>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      <>
                        <span>End Interview</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </>
                    )}
                  </button>
                )}
                
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={(!answer.trim() && !speechToText.replace(/\[.*?\]/g, '').trim()) || isSavingResults}
                  className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center space-x-2 ${
                    (answer.trim() || speechToText.replace(/\[.*?\]/g, '').trim()) && !isSavingResults
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                      : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <span>{currentCategory === "Closing" ? 'Submit & Continue' : 'Submit Answer'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saving Indicator Overlay */}
      {isSavingResults && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400/20"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400 z-10"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Saving Your Results</h2>
              <p className="text-slate-400 text-sm">
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