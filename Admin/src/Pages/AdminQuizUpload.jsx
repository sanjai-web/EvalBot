import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, X, Minimize2, Maximize2, Trash2, Save, 
  Loader2, ChevronRight, Edit, 
  Hash, Star, FileText, Clock, AlertCircle,
  CheckCircle, Copy, RefreshCw, Upload,
  ChevronLeft, MoreVertical, Menu, Filter,
  Download, Grid, List, Eye, EyeOff,
  Trash, AlertTriangle, Box
} from 'lucide-react';

const API_KEY = 'AIzaSyC0aI1VU6rmnqIfGa-shuUzqtQ-yyzATZo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function AdminQuizUpload() {
  const navigate = useNavigate();
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

  const levelConfig = {
    'Beginner': { color: 'green', icon: '★', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
    'Intermediate': { color: 'yellow', icon: '★★', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    'Advanced': { color: 'red', icon: '★★★', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-200' }
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
      // Reset the first container instead of removing it
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
      // Reassign IDs to maintain sequential order
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

      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      const responseText = data.candidates[0].content.parts[0].text;
      
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
          };
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-md font-bold text-lg">
              QUIZ
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="text-sm">Admin Panel</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-900">Quiz Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-slate-50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Quiz Generator
                </h1>
                <p className="text-slate-600 mt-2">Generate quiz questions using AI or add manually</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDeleteAllConfirm(true)}
                  disabled={containers.length === 1 && !containers[0].topic && containers[0].questions.length === 0}
                  className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash className="w-4 h-4" />
                  <span>Delete All</span>
                </button>
                <button
                  onClick={saveAllQuestions}
                  disabled={isSaving || containers.every(c => c.questions.length === 0)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Questions</span>
                    </>
                  )}
                </button>
                <button
                  onClick={addContainer}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm shadow-green-500/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Container</span>
                </button>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Containers</p>
                  <p className="text-2xl font-bold text-blue-700">{containerCount}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Box className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Active: {containers.filter(c => c.topic || c.questions.length > 0).length}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Questions</p>
                  <p className="text-2xl font-bold text-green-700">
                    {containers.reduce((sum, container) => sum + container.questions.length, 0)}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Generated by AI: {containers.reduce((sum, c) => sum + c.questions.filter(q => q.generatedByAI).length, 0)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Level Distribution</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {containers.filter(c => c.level === 'Beginner').length} B
                    </span>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      {containers.filter(c => c.level === 'Intermediate').length} I
                    </span>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                      {containers.filter(c => c.level === 'Advanced').length} A
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Ready to Save</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {containers.filter(c => c.questions.length > 0).length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {containers.filter(c => c.questions.length > 0).length === containerCount ? 'All ready' : 'Some pending'}
              </div>
            </div>
          </div>

          {/* Containers */}
          <div className="space-y-6">
            {containers.map((container, index) => (
              <div 
                key={container.id}
                className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Container Header */}
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-slate-200/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Hash className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">Container {index + 1}</span>
                          <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>ID: {container.id}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>Total: {container.questions.length} questions</span>
                          </div>
                        </div>
                      </div>
                      {container.minimized && container.topic && (
                        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                          <span className="text-sm text-slate-600">Topic:</span>
                          <span className="font-medium text-slate-900 bg-blue-50 px-3 py-1 rounded-full text-sm">{container.topic}</span>
                          <span className="text-sm text-slate-600">Level:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            levelConfig[container.level].bgColor
                          } ${levelConfig[container.level].textColor} ${
                            levelConfig[container.level].borderColor
                          }`}>
                            {levelConfig[container.level].icon} {container.level}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMinimize(container.id)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
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
                          className="p-2 hover:bg-red-50/50 rounded-lg transition-colors text-slate-600 hover:text-red-600"
                          title="Remove Container"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Container Content - Only show when not minimized */}
                {!container.minimized && (
                  <div className="p-6">
                    {/* Input Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <FileText className="inline w-4 h-4 mr-2 text-blue-500" />
                          Topic *
                        </label>
                        <input
                          type="text"
                          value={container.topic}
                          onChange={(e) => handleInputChange(container.id, 'topic', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            container.errors.topic ? 'border-red-300' : 'border-slate-300'
                          }`}
                          placeholder="Enter quiz topic"
                        />
                        {container.errors.topic && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {container.errors.topic}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Star className="inline w-4 h-4 mr-2 text-yellow-500" />
                          Question Level
                        </label>
                        <select
                          value={container.level}
                          onChange={(e) => handleInputChange(container.id, 'level', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="Beginner">Beginner ★</option>
                          <option value="Intermediate">Intermediate ★★</option>
                          <option value="Advanced">Advanced ★★★</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Hash className="inline w-4 h-4 mr-2 text-purple-500" />
                          Number of Questions (1-20) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={container.numQuestions}
                          onChange={(e) => handleInputChange(container.id, 'numQuestions', parseInt(e.target.value) || 1)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            container.errors.numQuestions ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {container.errors.numQuestions && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {container.errors.numQuestions}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center mb-8">
                      <button
                        onClick={() => generateQuestions(container.id)}
                        disabled={container.isGenerating}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {container.isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Questions...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span>Generate Questions with AI</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Manual Question Form */}
                    <div className="mb-8">
                      <button
                        onClick={() => toggleManualForm(container.id)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4 group"
                      >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        <span>{container.showManualForm ? 'Hide Manual Form' : 'Add Manual Question'}</span>
                      </button>

                      {container.showManualForm && (
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 mb-6 shadow-inner">
                          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Edit className="w-5 h-5 mr-2 text-blue-500" />
                            Add Manual Question
                          </h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Question *
                              </label>
                              <textarea
                                value={container.manualQuestion.question}
                                onChange={(e) => handleManualQuestionChange(container.id, 'question', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="2"
                                placeholder="Enter your question here"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Options *
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['A', 'B', 'C', 'D'].map((option, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <span className="font-medium text-slate-700 min-w-6 bg-slate-100 px-2 py-1 rounded">({option})</span>
                                    <input
                                      type="text"
                                      value={container.manualQuestion.options[index]}
                                      onChange={(e) => handleManualQuestionChange(container.id, 'options', e.target.value, index)}
                                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder={`Option ${option}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Correct Answer *
                              </label>
                              <select
                                value={container.manualQuestion.correctAnswer}
                                onChange={(e) => handleManualQuestionChange(container.id, 'correctAnswer', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select correct option</option>
                                {['A', 'B', 'C', 'D'].map((option) => (
                                  <option key={option} value={option}>Option {option}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => addManualQuestion(container.id)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add to Questions List</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Generated Questions List */}
                    {container.questions.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Generated Questions ({container.questions.length})
                          </h3>
                          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            Container {index + 1}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {container.questions.map((q, qIndex) => (
                            <div key={qIndex} className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors bg-white/50 backdrop-blur-sm">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Q{qIndex + 1}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    levelConfig[container.level].bgColor
                                  } ${levelConfig[container.level].textColor}`}>
                                    {container.level}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeQuestion(container.id, qIndex)}
                                  className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                  title="Remove Question"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <p className="text-slate-900 font-medium mb-4 text-sm">{q.question}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                {['A', 'B', 'C', 'D'].map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                                      q.correctAnswer === option
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                                        : 'bg-slate-50/50 border-slate-200'
                                    }`}
                                  >
                                    <span className={`font-medium ${
                                      q.correctAnswer === option ? 'text-green-700' : 'text-slate-600'
                                    }`}>
                                      ({option})
                                    </span>
                                    <span className={
                                      q.correctAnswer === option ? 'text-green-800 font-medium' : 'text-slate-700'
                                    }>
                                      {q.options[optIndex]}
                                    </span>
                                    {q.correctAnswer === option && (
                                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-slate-500">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Correct Answer: <span className="font-medium text-green-700 ml-1">Option {q.correctAnswer}</span>
                                  </span>
                                </div>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                  Question {qIndex + 1} of {container.questions.length}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {container.questions.length === 0 && !container.showManualForm && !container.isGenerating && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No Questions Yet</h3>
                        <p className="text-slate-600 max-w-md mx-auto mb-6">
                          Generate questions using AI or add them manually to get started.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() => generateQuestions(container.id)}
                            disabled={!container.topic.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Generate with AI
                          </button>
                          <button
                            onClick={() => toggleManualForm(container.id)}
                            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
                          >
                            Add Manually
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Container Footer */}
                {!container.minimized && (
                  <div className="border-t border-slate-200/50 p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{container.questions.length} Questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{container.level} Level</span>
                        </div>
                        {container.questions.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Ready to save</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                        Container {index + 1} • ID: {container.id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Container Button at Bottom */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={addContainer}
              className="border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 w-full max-w-md justify-center hover:bg-blue-50/50 group backdrop-blur-sm"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Add Another Container</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete All Containers</h3>
                  <p className="text-sm text-slate-600 mt-1">This will remove all containers and their questions</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Warning: This action cannot be undone</p>
                    <p className="text-xs text-red-600 mt-1">
                      You're about to delete {containers.length} container{containers.length > 1 ? 's' : ''} and all {containers.reduce((sum, c) => sum + c.questions.length, 0)} questions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllContainers}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
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