import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Code, Upload, FileCode, Hash, Brain,
  Loader2, ChevronRight, Star, Zap, Copy, Check,
  AlertCircle, ChevronDown, ChevronUp, Building2, Briefcase,
  Calendar, Timer, ArrowLeft, Save, Info, FileText, Users
} from 'lucide-react';

const API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function QuestionContainer({
  index,
  question,
  onUpdate,
  onDelete,
  onGenerateQuestion,
  isGenerating,
  collection
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const levelColors = {
    'Beginner': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Intermediate': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Advanced': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const levelIcons = {
    'Beginner': '🟢',
    'Intermediate': '🟡',
    'Advanced': '🔴'
  };

  return (
    <div className="bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 pointer-events-none -mt-10 -mr-10"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500/30 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-200" />
              Q{index + 1}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                <Star className="w-4 h-4 text-amber-400 ml-2" />
                <select
                  value={question.level}
                  onChange={(e) => onUpdate(index, 'level', e.target.value)}
                  className="px-3 py-2 bg-transparent text-slate-200 focus:ring-0 focus:outline-none appearance-none cursor-pointer font-bold text-sm"
                >
                  <option value="Beginner" className="bg-[#0a0f1c]">Beginner</option>
                  <option value="Intermediate" className="bg-[#0a0f1c]">Intermediate</option>
                  <option value="Advanced" className="bg-[#0a0f1c]">Advanced</option>
                </select>
              </div>
              <span className={`px-4 py-2.5 rounded-xl text-sm font-bold border flex items-center gap-2 ${levelColors[question.level]}`}>
                <span className="text-[10px]">{levelIcons[question.level]}</span>
                {question.level.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button
              onClick={() => onDelete(index)}
              className="p-3 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.1)] hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-8 space-y-8 bg-black/20">
          {/* Question Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-3 flex items-center tracking-widest uppercase">
              <FileCode className="w-4 h-4 mr-2 text-indigo-400" />
              Problem Statement <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <textarea
                value={question.text}
                onChange={(e) => onUpdate(index, 'text', e.target.value)}
                className="w-full h-40 px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm text-slate-300 outline-none transition-all shadow-inner custom-scrollbar"
                placeholder="Initialize problem parameters..."
              />
              <button
                onClick={() => handleCopy(question.text, 'question')}
                className="absolute top-3 right-3 p-2 bg-[#0a0f1c]/90 hover:bg-white/10 rounded-lg transition-colors border border-white/10 opacity-50 group-hover:opacity-100"
              >
                {copiedField === 'question' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Sample Input & Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-3 flex items-center tracking-widest uppercase">
                <Code className="w-4 h-4 mr-2 text-emerald-400" />
                Sample Input Sequence
              </label>
              <div className="relative group">
                <textarea
                  value={question.sampleInput}
                  onChange={(e) => onUpdate(index, 'sampleInput', e.target.value)}
                  className="w-full h-32 px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-500 resize-none font-mono text-sm text-slate-300 outline-none transition-all shadow-inner custom-scrollbar"
                  placeholder="Define standard input..."
                />
                <button
                  onClick={() => handleCopy(question.sampleInput, 'sampleInput')}
                  className="absolute top-3 right-3 p-2 bg-[#0a0f1c]/90 hover:bg-white/10 rounded-lg transition-colors border border-white/10 opacity-50 group-hover:opacity-100"
                >
                  {copiedField === 'sampleInput' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-3 flex items-center tracking-widest uppercase">
                <Zap className="w-4 h-4 mr-2 text-amber-400" />
                Expected Output Sequence
              </label>
              <div className="relative group">
                <textarea
                  value={question.sampleOutput}
                  onChange={(e) => onUpdate(index, 'sampleOutput', e.target.value)}
                  className="w-full h-32 px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-amber-500 resize-none font-mono text-sm text-slate-300 outline-none transition-all shadow-inner custom-scrollbar"
                  placeholder="Define expected output..."
                />
                <button
                  onClick={() => handleCopy(question.sampleOutput, 'sampleOutput')}
                  className="absolute top-3 right-3 p-2 bg-[#0a0f1c]/90 hover:bg-white/10 rounded-lg transition-colors border border-white/10 opacity-50 group-hover:opacity-100"
                >
                  {copiedField === 'sampleOutput' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <label className="block text-xs font-bold text-slate-400 flex items-center tracking-widest uppercase">
                <Hash className="w-4 h-4 mr-2 text-fuchsia-400" />
                Hidden Evaluation Metrics (5 Required)
              </label>
              <span className="text-xs font-bold text-fuchsia-300 bg-fuchsia-500/10 px-4 py-2 rounded-xl border border-fuchsia-500/20 shadow-inner">
                {question.hiddenTestCases.filter(tc => tc.input && tc.output).length} / 5 SYNCHED
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {question.hiddenTestCases.map((testCase, idx) => (
                <div key={idx} className="bg-black/40 rounded-xl border border-white/10 p-4 hover:border-white/30 transition-colors shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Vector {idx + 1}</span>
                    <div className="flex space-x-1">
                      <button
                         onClick={() => handleCopy(testCase.input, `test${idx}-input`)}
                         className="p-1.5 hover:bg-white/10 rounded transition-colors"
                         title="Copy Input"
                       >
                         {copiedField === `test${idx}-input` ? (
                           <Check className="w-3 h-3 text-emerald-400" />
                         ) : (
                           <Copy className="w-3 h-3 text-slate-400 hover:text-white" />
                         )}
                       </button>
                       <button
                         onClick={() => handleCopy(testCase.output, `test${idx}-output`)}
                         className="p-1.5 hover:bg-white/10 rounded transition-colors"
                         title="Copy Output"
                       >
                         {copiedField === `test${idx}-output` ? (
                           <Check className="w-3 h-3 text-emerald-400" />
                         ) : (
                           <Copy className="w-3 h-3 text-slate-400 hover:text-white" />
                         )}
                       </button>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <input
                       type="text"
                       value={testCase.input}
                       onChange={(e) => {
                         const newTestCases = [...question.hiddenTestCases];
                         newTestCases[idx].input = e.target.value;
                         onUpdate(index, 'hiddenTestCases', newTestCases);
                       }}
                       className="w-full px-3 py-2 text-sm bg-black/60 border border-white/10 rounded-lg focus:ring-1 focus:ring-fuchsia-500 text-slate-300 font-mono outline-none"
                       placeholder="Input"
                     />
                     <input
                       type="text"
                       value={testCase.output}
                       onChange={(e) => {
                         const newTestCases = [...question.hiddenTestCases];
                         newTestCases[idx].output = e.target.value;
                         onUpdate(index, 'hiddenTestCases', newTestCases);
                       }}
                       className="w-full px-3 py-2 text-sm bg-black/60 border border-white/10 rounded-lg focus:ring-1 focus:ring-fuchsia-500 text-slate-300 font-mono outline-none"
                       placeholder="Output"
                     />
                   </div>
                 </div>
               ))}
             </div>
           </div>

          {/* Generate Question Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => onGenerateQuestion(index)}
              disabled={isGenerating === index}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center space-x-3 outline-none"
            >
              {isGenerating === index ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>AUTOGENERATE VIA AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCodeUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [questions, setQuestions] = useState([
    {
      id: 1,
      level: 'Intermediate',
      text: '',
      sampleInput: '',
      sampleOutput: '',
      hiddenTestCases: Array(5).fill({ input: '', output: '' })
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!collection) {
      navigate('/');
    }
  }, [collection, navigate]);

  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        level: 'Intermediate',
        text: '',
        sampleInput: '',
        sampleOutput: '',
        hiddenTestCases: Array(5).fill({ input: '', output: '' })
      }
    ]);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const generateWithAI = (index) => {
    setCurrentQuestionIndex(index);
    setShowTopicModal(true);
    setTopic('');
    setError('');
  };

  const handleGenerateQuestion = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(currentQuestionIndex);
    setShowTopicModal(false);

    try {
      const prompt = `
        Generate a coding interview question about "${topic}" with:
        1. A detailed problem statement
        2. Sample input
        3. Sample output
        4. 5 different test cases with inputs and expected outputs
        
        Format the response as JSON exactly like this:
        {
          "question": "detailed question here",
          "sampleInput": "sample input here",
          "sampleOutput": "sample output here",
          "testCases": [
            {"input": "input1", "output": "output1"},
            {"input": "input2", "output": "output2"},
            {"input": "input3", "output": "output3"},
            {"input": "input4", "output": "output4"},
            {"input": "input5", "output": "output5"}
          ]
        }
        
        Make sure the question is challenging but appropriate for an interview setting.
      `;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof GROQ_API_KEY !== 'undefined' ? GROQ_API_KEY : API_KEY}`,
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: prompt 
          }]
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format');

      const generatedData = JSON.parse(jsonMatch[0]);

      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex] = {
        ...newQuestions[currentQuestionIndex],
        text: generatedData.question,
        sampleInput: generatedData.sampleInput,
        sampleOutput: generatedData.sampleOutput,
        hiddenTestCases: generatedData.testCases.map(tc => ({
          input: tc.input,
          output: tc.output
        }))
      };

      setQuestions(newQuestions);
    } catch (err) {
      console.error('Error generating question:', err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSubmitAll = async () => {
    const invalidQuestions = questions.filter(q => 
      !q.text.trim() || 
      !q.sampleInput.trim() || 
      !q.sampleOutput.trim() ||
      q.hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim())
    );

    if (invalidQuestions.length > 0) {
      setError('Please fill in all fields for all questions and test cases');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting questions:', questions);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Questions saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save questions');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!collection) {
    return null; 
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-[#030712] text-slate-300">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px]" />
      </div>

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
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10 flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>CODE UPLOAD</span>
              </div>
              <div className="hidden md:flex items-center space-x-3 text-slate-400 text-sm font-medium">
                <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => navigate('/')}>Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => navigate('/')}>Collections</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 shadow-inner">Code Questions</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={addQuestion}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">ADD QUESTION</span>
              </button>
              <button
                onClick={handleSubmitAll}
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
              >
                {isSubmitting ? (
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
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Briefcase className="w-5 h-5 text-purple-400" />
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(79,70,229,0.1)] hover:border-indigo-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Total Queries</p>
              <p className="text-4xl font-black text-white">{questions.length}</p>
            </div>
            <div className="p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30 relative z-10">
              <FileCode className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Beginner</p>
              <p className="text-4xl font-black text-white">{questions.filter(q => q.level === 'Beginner').length}</p>
            </div>
            <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30 relative z-10">
              <Star className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Intermediate</p>
              <p className="text-4xl font-black text-white">{questions.filter(q => q.level === 'Intermediate').length}</p>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-500/30 relative z-10">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-[#0a0f1c]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group shadow-[0_0_20px_rgba(225,29,72,0.1)] hover:border-rose-500/30 transition-colors">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-rose-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Advanced</p>
              <p className="text-4xl font-black text-white">{questions.filter(q => q.level === 'Advanced').length}</p>
            </div>
            <div className="p-4 bg-rose-500/20 rounded-xl border border-rose-500/30 relative z-10">
              <Star className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(error || successMessage) && (
          <div className={`p-5 rounded-2xl border shadow-lg flex items-center space-x-4 animate-in slide-in-from-top-4 duration-300 ${
            error ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <div className={`p-2 rounded-full ${error ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
              {error ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            </div>
            <span className="font-bold tracking-wide">{error || successMessage}</span>
          </div>
        )}

        {/* Questions Display */}
        <div>
          {questions.map((question, index) => (
            <QuestionContainer
              key={question.id}
              index={index}
              question={question}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onGenerateQuestion={generateWithAI}
              isGenerating={isGenerating}
              collection={collection}
            />
          ))}
        </div>

        {/* Add Question Big Button */}
        <div className="text-center mt-12 mb-8">
          <button
            onClick={addQuestion}
            className="group relative inline-flex items-center justify-center px-8 py-5 font-bold tracking-widest text-white transition-all duration-300 bg-white/5 border border-dashed border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/40 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-purple-500/0 group-hover:translate-x-full transition-transform duration-1000 -translate-x-full"></div>
            <Plus className="w-6 h-6 mr-3 text-indigo-400 group-hover:scale-125 transition-transform" />
            <span>INITIALIZE NEW QUERY</span>
          </button>
        </div>
      </div>

      {/* AI Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-[#0a0f1c] rounded-2xl w-full max-w-lg border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-[80px] opacity-20"></div>
              <Brain className="w-12 h-12 text-white/90 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white tracking-widest uppercase">AI Generator</h3>
              <p className="text-indigo-200 font-medium mt-2">Provide a vector context to formulate logic structure</p>
            </div>
            
            <div className="p-8 space-y-6 bg-transparent">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                  Subject Matter Parameter
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-purple-500 text-white font-medium outline-none transition-all placeholder-gray-600 shadow-inner"
                  placeholder="e.g. Dynamic Programming, Graph Traversal..."
                />
                <p className="text-[10px] font-bold text-slate-500 mt-3 tracking-wider uppercase">
                  Examples: Arrays, Trees, Sorting Algorithms, Hash Maps
                </p>
              </div>
              
              <div className="flex space-x-4 pt-4 border-t border-white/10 mt-6">
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="flex-1 px-4 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-bold tracking-wide hover:bg-white/10 hover:text-white transition-all outline-none"
                >
                  ABORT
                </button>
                <button
                  onClick={handleGenerateQuestion}
                  disabled={!topic.trim()}
                  className="flex-1 px-4 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-white/5 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] flex justify-center items-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>SYNTHESIZE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCodeUpload;