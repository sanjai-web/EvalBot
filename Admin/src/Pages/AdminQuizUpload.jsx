import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, X, Minimize2, Maximize2, Trash2, Save, 
  Loader2, ChevronRight, Edit, 
  Hash, Star, FileText, Clock, AlertCircle,
  CheckCircle, Copy, RefreshCw, Upload,
  ChevronLeft, MoreVertical, Menu, Filter,
  Download, Grid, List, Eye, EyeOff,
  Trash, AlertTriangle, Box, Building2, Briefcase,
  ArrowLeft, Calendar, Timer, Info, Users
} from 'lucide-react';

const API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function AdminQuizUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [containers, setContainers] = useState([
    {
      id: 1,
      minimized: false,
      topic: '',
      level: 'Beginner',
      numQuestions: 5,
      questions: [],
      manualQuestion: {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      },
      isGenerating: false,
      showManualForm: false,
      errors: {}
    }
  ]);

  const [nextId, setNextId] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [containerCount, setContainerCount] = useState(1);

  useEffect(() => {
    if (!collection) {
      navigate('/');
    }
  }, [collection, navigate]);

  const levelConfig = {
    'Beginner': { color: 'emerald', icon: '🟢', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    'Intermediate': { color: 'amber', icon: '🟡', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
    'Advanced': { color: 'rose', icon: '🔴', bgColor: 'bg-rose-500/10', textColor: 'text-rose-400', borderColor: 'border-rose-500/20' }
  };

  const handleInputChange = (containerId, field, value) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { 
            ...container, 
            [field]: value,
            errors: { ...container.errors, [field]: null }
          } 
        : container
    ));
  };

  const toggleMinimize = (containerId) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, minimized: !container.minimized } 
        : container
    ));
  };

  const addContainer = () => {
    const newContainer = {
      id: nextId,
      minimized: false,
      topic: '',
      level: 'Beginner',
      numQuestions: 5,
      questions: [],
      manualQuestion: {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      },
      isGenerating: false,
      showManualForm: false,
      errors: {}
    };
    setContainers(prev => [...prev, newContainer]);
    setNextId(prev => prev + 1);
    setContainerCount(prev => prev + 1);
  };

  const removeContainer = (containerId) => {
    if (containers.length === 1) {
      setContainers([{
        id: 1,
        minimized: false,
        topic: '',
        level: 'Beginner',
        numQuestions: 5,
        questions: [],
        manualQuestion: {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        },
        isGenerating: false,
        showManualForm: false,
        errors: {}
      }]);
      setNextId(2);
      setContainerCount(1);
    } else {
      setContainers(prev => prev.filter(container => container.id !== containerId));
      setContainerCount(prev => prev - 1);
      const updatedContainers = containers.filter(container => container.id !== containerId);
      updatedContainers.forEach((container, index) => {
        container.id = index + 1;
      });
      setNextId(updatedContainers.length + 1);
    }
  };

  const deleteAllContainers = () => {
    setContainers([{
      id: 1,
      minimized: false,
      topic: '',
      level: 'Beginner',
      numQuestions: 5,
      questions: [],
      manualQuestion: {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      },
      isGenerating: false,
      showManualForm: false,
      errors: {}
    }]);
    setNextId(2);
    setContainerCount(1);
    setShowDeleteAllConfirm(false);
  };

  const validateContainer = (container) => {
    const errors = {};
    if (!container.topic.trim()) errors.topic = 'Topic is required';
    if (container.numQuestions < 1 || container.numQuestions > 20) errors.numQuestions = 'Number of questions must be between 1-20';
    return errors;
  };

  const generateQuestions = async (containerId) => {
    const container = containers.find(c => c.id === containerId);
    const errors = validateContainer(container);
    
    if (Object.keys(errors).length > 0) {
      setContainers(prev => prev.map(c => 
        c.id === containerId ? { ...c, errors } : c
      ));
      return;
    }

    setContainers(prev => prev.map(c => 
      c.id === containerId ? { ...c, isGenerating: true, errors: {} } : c
    ));

    try {
      const prompt = `Generate ${container.numQuestions} multiple choice questions on the topic "${container.topic}" at ${container.level} level.
      Each question should have:
      1. A clear question
      2. 4 options labeled A, B, C, D
      3. The correct answer marked
      
      Format the response as JSON array:
      [
        {
          "question": "question text",
          "options": ["option A", "option B", "option C", "option D"],
          "correctAnswer": "A" // or B, C, D
        }
      ]
      
      Make questions challenging but appropriate for ${container.level} level.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof GROQ_API_KEY !== 'undefined' ? GROQ_API_KEY : API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      try {
        const jsonMatch = responseText.match(/\[\s*{[\s\S]*}\s*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          setContainers(prev => prev.map(c => 
            c.id === containerId ? { 
              ...c, 
              questions: questions.slice(0, container.numQuestions),
              isGenerating: false 
            } : c
          ));
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        const lines = responseText.split('\n');
        const generatedQuestions = [];
        let currentQuestion = null;

        for (const line of lines) {
          if (line.match(/^\d+\./)) {
            if (currentQuestion) generatedQuestions.push(currentQuestion);
            currentQuestion = {
              question: line.replace(/^\d+\.\s*/, '').trim(),
              options: [],
              correctAnswer: ''
            };
          } else if (line.match(/^[A-D]\./)) {
            if (currentQuestion) {
              currentQuestion.options.push(line.replace(/^[A-D]\.\s*/, '').trim());
            }
          } else if (line.toLowerCase().includes('correct answer:')) {
            if (currentQuestion) {
              const match = line.match(/[A-D]/i);
              if (match) {
                currentQuestion.correctAnswer = match[0].toUpperCase();
              }
            }
          }
        }
        if (currentQuestion) generatedQuestions.push(currentQuestion);

        setContainers(prev => prev.map(c => 
          c.id === containerId ? { 
            ...c, 
            questions: generatedQuestions.slice(0, container.numQuestions),
            isGenerating: false 
          } : c
        ));
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(`Failed to generate questions: ${error.message}`);
      setContainers(prev => prev.map(c => 
        c.id === containerId ? { ...c, isGenerating: false } : c
      ));
    }
  };

  const handleManualQuestionChange = (containerId, field, value, optionIndex = null) => {
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        if (optionIndex !== null) {
          const newOptions = [...container.manualQuestion.options];
          newOptions[optionIndex] = value;
          return {
            ...container,
            manualQuestion: {
              ...container.manualQuestion,
              options: newOptions
            }
          };
        } else {
          return {
            ...container,
            manualQuestion: {
              ...container.manualQuestion,
              [field]: value
            }
          }
        }
      }
      return container;
    }));
  };

  const addManualQuestion = (containerId) => {
    const container = containers.find(c => c.id === containerId);
    const { question, options, correctAnswer } = container.manualQuestion;

    if (!question.trim() || options.some(opt => !opt.trim()) || !correctAnswer) {
      alert('Please fill all fields for the manual question');
      return;
    }

    const newQuestion = {
      question,
      options: [...options],
      correctAnswer
    };

    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        return {
          ...c,
          questions: [...c.questions, newQuestion],
          manualQuestion: {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
          },
          showManualForm: false
        };
      }
      return c;
    }));
  };

  const removeQuestion = (containerId, questionIndex) => {
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        const newQuestions = [...container.questions];
        newQuestions.splice(questionIndex, 1);
        return { ...container, questions: newQuestions };
      }
      return container;
    }));
  };

  const toggleManualForm = (containerId) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, showManualForm: !container.showManualForm } 
        : container
    ));
  };

  const saveAllQuestions = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allQuestions = containers.flatMap(container => 
      container.questions.map(q => ({
        ...q,
        topic: container.topic,
        level: container.level
      }))
    );
    
    console.log('Saving all questions:', allQuestions);
    alert(`Successfully saved ${allQuestions.length} questions!`);
    setIsSaving(false);
  };

  if (!collection) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-[#030712] text-slate-300">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/30 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="bg-[#0a0f1c]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10 mb-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white group border border-transparent hover:border-white/10"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10 flex items-center space-x-2">
                <Box className="w-5 h-5" />
                <span>QUIZ FORGE</span>
              </div>
              <div className="hidden md:flex items-center space-x-3 text-slate-400 text-sm font-medium">
                <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => navigate('/')}>Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 shadow-inner">Quiz Generator</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                disabled={containers.length === 1 && !containers[0].topic && containers[0].questions.length === 0}
                className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-5 py-2.5 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Trash className="w-4 h-4" />
                <span className="hidden sm:inline">PURGE</span>
              </button>
              <button
                onClick={addContainer}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">NEW CONTAINER</span>
              </button>
              <button
                onClick={saveAllQuestions}
                disabled={isSaving || containers.every(c => c.questions.length === 0)}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">SAVE MODULE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 space-y-8">
        
        {/* Collection Meta */}
        <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Company</p>
                <p className="font-bold text-white">{collection.company}</p>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center space-x-4">
              <div className="p-3 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30">
                <Briefcase className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Role</p>
                <p className="font-bold text-white">{collection.role}</p>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Hash className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Interview ID</p>
                <p className="font-bold text-white">{collection.interviewId}</p>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner flex items-center space-x-4">
              <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <Timer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Time Limit</p>
                <p className="font-bold text-white">{collection.timeLimit} <span className="text-slate-500 text-xs font-medium">MINUTES</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(79,70,229,0.1)] hover:border-indigo-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Total Containers</p>
              <p className="text-4xl font-black text-white flex items-end gap-3">
                {containerCount} <span className="text-xs font-medium text-indigo-300 pb-1.5">{containers.filter(c => c.topic || c.questions.length > 0).length} ACTIVE</span>
              </p>
            </div>
            <div className="p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30 relative z-10">
              <Box className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Generated Questions</p>
              <p className="text-4xl font-black text-white">{containers.reduce((sum, container) => sum + container.questions.length, 0)}</p>
            </div>
            <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30 relative z-10">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Level Matrix</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
                  {containers.filter(c => c.level === 'Beginner').length} B
                </span>
                <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg font-bold">
                  {containers.filter(c => c.level === 'Intermediate').length} I
                </span>
                <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg font-bold">
                  {containers.filter(c => c.level === 'Advanced').length} A
                </span>
              </div>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-500/30 relative z-10">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:border-fuchsia-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-fuchsia-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Sync Status</p>
              <p className="text-2xl font-black text-white flex flex-col">
                {containers.filter(c => c.questions.length > 0).length} <span className="text-xs font-medium text-fuchsia-300">CONTAINERS READY</span>
              </p>
            </div>
            <div className="p-4 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30 relative z-10">
              <CheckCircle className="w-6 h-6 text-fuchsia-400" />
            </div>
          </div>
        </div>

        {/* Containers List */}
        <div className="space-y-6">
          {containers.map((container, index) => (
            <div 
              key={container.id}
              className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Container Header */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border-b border-white/10 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 pointer-events-none -mt-10 -mr-10"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500/30">
                        <Box className="w-5 h-5 text-indigo-100" />
                      </div>
                      <div>
                        <span className="font-bold text-white tracking-wide text-lg">Container {index + 1}</span>
                        <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5 font-medium">
                          <span>ID: {container.id}</span>
                          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                          <span className="text-indigo-300">{container.questions.length} Questions Synced</span>
                        </div>
                      </div>
                    </div>
                    {container.minimized && container.topic && (
                      <div className="hidden md:flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Subject:</span>
                        <span className="font-bold text-white bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-sm">{container.topic}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-2">Tier:</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                          levelConfig[container.level].bgColor
                        } ${levelConfig[container.level].textColor} ${
                          levelConfig[container.level].borderColor
                        }`}>
                          <span className="text-[10px]">{levelConfig[container.level].icon}</span> {container.level.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleMinimize(container.id)}
                      className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                      title={container.minimized ? "Expand" : "Minimize"}
                    >
                      {container.minimized ? (
                        <Maximize2 className="w-4 h-4" />
                      ) : (
                        <Minimize2 className="w-4 h-4" />
                      )}
                    </button>
                    {containers.length > 1 && (
                      <button
                        onClick={() => removeContainer(container.id)}
                        className="p-2.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.1)] hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                        title="Delete Container"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!container.minimized && (
                <div className="p-8 bg-black/20">
                  {/* Input Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center tracking-widest uppercase">
                        <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                        Topic Core <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={container.topic}
                        onChange={(e) => handleInputChange(container.id, 'topic', e.target.value)}
                        className={`w-full px-5 py-3.5 bg-white/80 border rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none transition-all shadow-inner placeholder-gray-600 ${
                          container.errors.topic ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200'
                        }`}
                        placeholder="e.g. React Hooks, Thermodynamics"
                      />
                      {container.errors.topic && (
                        <p className="mt-2 text-xs font-bold text-rose-400 flex items-center tracking-wide">
                          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                          {container.errors.topic}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center tracking-widest uppercase">
                        <Star className="w-4 h-4 mr-2 text-amber-400" />
                        Difficulty Tier
                      </label>
                      <select
                        value={container.level}
                        onChange={(e) => handleInputChange(container.id, 'level', e.target.value)}
                        className="w-full px-5 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 outline-none appearance-none shadow-inner"
                      >
                        <option value="Beginner" className="bg-slate-50">Beginner</option>
                        <option value="Intermediate" className="bg-slate-50">Intermediate</option>
                        <option value="Advanced" className="bg-slate-50">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center tracking-widest uppercase">
                        <Hash className="w-4 h-4 mr-2 text-fuchsia-400" />
                        Generation Volume <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={container.numQuestions}
                        onChange={(e) => handleInputChange(container.id, 'numQuestions', parseInt(e.target.value) || 1)}
                        className={`w-full px-5 py-3.5 bg-white/80 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 text-slate-900 outline-none transition-all shadow-inner ${
                          container.errors.numQuestions ? 'border-rose-500/50' : 'border-slate-200'
                        }`}
                      />
                      {container.errors.numQuestions && (
                        <p className="mt-2 text-xs font-bold text-rose-400 flex items-center tracking-wide">
                          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                          {container.errors.numQuestions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center mb-10">
                    <button
                      onClick={() => generateQuestions(container.id)}
                      disabled={container.isGenerating}
                      className="group relative inline-flex items-center justify-center px-8 py-4 font-bold tracking-widest text-slate-900 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-xl hover:from-indigo-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed outline-none overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-slate-50 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                      {container.isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-3" />
                          <span>SYNTHESIZING VECTORS...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 mr-3" />
                          <span>AUTOGENERATE VIA AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Manual Question Form Toggle */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleManualForm(container.id)}
                      className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold tracking-widest text-xs uppercase mb-6 group transition-colors"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      <span>{container.showManualForm ? 'CLOSE MANUAL OVERRIDE' : 'INITIATE MANUAL OVERRIDE'}</span>
                    </button>

                    {container.showManualForm && (
                      <div className="bg-white/80 border border-indigo-500/30 rounded-2xl p-8 mb-8 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center tracking-wide">
                          <Edit className="w-5 h-5 mr-3 text-indigo-400" />
                          Manual Parameter Injection
                        </h3>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 tracking-widest uppercase">
                              Query Proposition <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              value={container.manualQuestion.question}
                              onChange={(e) => handleManualQuestionChange(container.id, 'question', e.target.value)}
                              className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none resize-none shadow-inner custom-scrollbar"
                              rows="2"
                              placeholder="Define the question parameters..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 tracking-widest uppercase">
                              Response Variables <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['A', 'B', 'C', 'D'].map((option, index) => (
                                <div key={index} className="flex items-center space-x-3 bg-white/80 border border-slate-100 rounded-xl p-2 focus-within:border-indigo-500/50 transition-colors">
                                  <span className="font-bold text-indigo-400 min-w-8 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-lg text-center">
                                    {option}
                                  </span>
                                  <input
                                    type="text"
                                    value={container.manualQuestion.options[index]}
                                    onChange={(e) => handleManualQuestionChange(container.id, 'options', e.target.value, index)}
                                    className="flex-1 px-3 py-2 bg-transparent text-slate-900 focus:outline-none placeholder-gray-600"
                                    placeholder={`Variable ${option}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 tracking-widest uppercase">
                              Valid Solution <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={container.manualQuestion.correctAnswer}
                              onChange={(e) => handleManualQuestionChange(container.id, 'correctAnswer', e.target.value)}
                              className="w-full px-5 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-slate-50">Select verified variable</option>
                              {['A', 'B', 'C', 'D'].map((option) => (
                                <option key={option} value={option} className="bg-slate-50">Variable {option}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                              onClick={() => addManualQuestion(container.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center space-x-2"
                            >
                              <Plus className="w-5 h-5" />
                              <span>INJECT TO MODULE</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Generated Questions List */}
                  {container.questions.length > 0 && (
                    <div className="mt-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center tracking-wide">
                          <CheckCircle className="w-6 h-6 mr-3 text-emerald-400" />
                          Verified Vectors ({container.questions.length})
                        </h3>
                        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-inner">
                          CONTAINER {index + 1}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {container.questions.map((q, qIndex) => (
                          <div key={qIndex} className="bg-white/90 border border-slate-200 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-5">
                              <div className="flex items-center space-x-3">
                                <span className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                  Q{qIndex + 1}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                  levelConfig[container.level].bgColor
                                } ${levelConfig[container.level].textColor} ${
                                  levelConfig[container.level].borderColor
                                }`}>
                                  {container.level.toUpperCase()}
                                </span>
                              </div>
                              <button
                                onClick={() => removeQuestion(container.id, qIndex)}
                                className="p-2 bg-white/90 hover:bg-rose-500/20 rounded-xl text-slate-500 hover:text-rose-400 transition-colors opacity-50 group-hover:opacity-100"
                                title="Remove Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <p className="text-slate-900 font-medium mb-6 text-base leading-relaxed">{q.question}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                              {['A', 'B', 'C', 'D'].map((option, optIndex) => (
                                <div 
                                  key={optIndex} 
                                  className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                                    q.correctAnswer === option
                                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                                      : 'bg-white/80 border-slate-100'
                                  }`}
                                >
                                  <span className={`font-bold min-w-8 text-center px-2 py-1 rounded-lg ${
                                    q.correctAnswer === option ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/90 text-slate-500'
                                  }`}>
                                    {option}
                                  </span>
                                  <span className={
                                    q.correctAnswer === option ? 'text-emerald-300 font-bold' : 'text-slate-600'
                                  }>
                                    {q.options[optIndex]}
                                  </span>
                                  {q.correctAnswer === option && (
                                    <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 tracking-widest pt-4 border-t border-slate-100">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500/70" />
                                <span>SOLUTION: <span className="text-emerald-400 ml-1">VARIABLE {q.correctAnswer}</span></span>
                              </div>
                              <span className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-100">
                                NODE {qIndex + 1} / {container.questions.length}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {container.questions.length === 0 && !container.showManualForm && !container.isGenerating && (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-white/80">
                      <div className="w-24 h-24 mx-auto mb-6 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
                        <FileText className="w-10 h-10 text-indigo-400 opacity-80" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-wide">NO VECTORS DETECTED</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                        Initialize AI synthesis or construct parameters manually to populate this container.
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => generateQuestions(container.id)}
                          disabled={!container.topic.trim()}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)] tracking-wide"
                        >
                          INITIALIZE AI
                        </button>
                        <button
                          onClick={() => toggleManualForm(container.id)}
                          className="border border-slate-300 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white tracking-wide"
                        >
                          MANUAL OVERRIDE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Container Footer */}
              {!container.minimized && (
                <div className="border-t border-slate-200 p-5 bg-gradient-to-r from-black/40 to-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-xs font-bold text-slate-500 tracking-widest uppercase">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span>{container.questions.length} VECTORS</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>TIER: {container.level}</span>
                      </div>
                      {container.questions.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-emerald-400">READY FOR SYNC</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 tracking-widest uppercase">
                      SYS_ID: {container.id}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Container Big Button */}
        <div className="mt-12 mb-8 flex justify-center">
          <button
            onClick={addContainer}
            className="group relative inline-flex items-center justify-center px-8 py-5 font-bold tracking-widest text-slate-900 transition-all duration-300 bg-white/90 border-2 border-dashed border-slate-300 rounded-2xl hover:bg-white hover:border-white/40 overflow-hidden w-full max-w-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-fuchsia-500/0 group-hover:translate-x-full transition-transform duration-1000 -translate-x-full"></div>
            <Plus className="w-6 h-6 mr-3 text-indigo-400 group-hover:scale-125 transition-transform" />
            <span>ESTABLISH NEW CONTAINER</span>
          </button>
        </div>
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="glass-panel rounded-2xl w-full max-w-md border border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.3)] animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-wide">SYSTEM PURGE</h3>
              <p className="text-slate-500 mb-6 font-medium">
                Initiating sequence to annihilate <span className="text-slate-900 font-bold">{containers.length} container{containers.length > 1 ? 's' : ''}</span> and <span className="text-rose-400 font-bold">{containers.reduce((sum, c) => sum + c.questions.length, 0)} total vectors</span>.
              </p>
              
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-8">
                <p className="text-xs font-bold text-rose-400 tracking-widest uppercase">
                  WARNING: THIS ACTION IS IRREVERSIBLE
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="flex-1 px-4 py-3.5 bg-white/90 border border-slate-200 text-slate-600 rounded-xl font-bold tracking-wide hover:bg-white hover:text-slate-900 transition-all outline-none"
                >
                  ABORT
                </button>
                <button
                  onClick={deleteAllContainers}
                  className="flex-1 px-4 py-3.5 bg-rose-600 hover:bg-rose-500 text-slate-900 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] flex justify-center items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>EXECUTE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminQuizUpload;