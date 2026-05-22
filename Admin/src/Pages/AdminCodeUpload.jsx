import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Code, Save, FileCode, Hash, Brain,
  Loader2, ChevronRight, Star, Copy, Check,
  AlertCircle, ChevronDown, ChevronUp, Building2, Briefcase,
  Timer, ArrowLeft, X, Sparkles
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const levelBadge = {
  Beginner:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
  Advanced:     'bg-rose-50 text-rose-700 border border-rose-200',
};

function QuestionCard({ index, question, onUpdate, onDelete, onGenerateQuestion, isGenerating }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(null);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateTestCase = (idx, field, val) => {
    const tc = question.hiddenTestCases.map((t, i) =>
      i === idx ? { ...t, [field]: val } : t
    );
    onUpdate(index, 'hiddenTestCases', tc);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <span className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
            Q{index + 1}
          </span>
          <select
            value={question.level}
            onChange={e => onUpdate(index, 'level', e.target.value)}
            className="text-sm font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelBadge[question.level]}`}>
            {question.level}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Problem Statement */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Problem Statement <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <textarea
                value={question.text}
                onChange={e => onUpdate(index, 'text', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none font-mono"
                placeholder="Enter the coding problem statement..."
              />
              <button
                onClick={() => copy(question.text, 'stmt')}
                className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                {copied === 'stmt' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Sample I/O */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Sample Input', field: 'sampleInput', color: 'emerald', key: 'si' },
              { label: 'Expected Output', field: 'sampleOutput', color: 'amber', key: 'so' },
            ].map(({ label, field, color, key }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                <div className="relative group">
                  <textarea
                    value={question[field]}
                    onChange={e => onUpdate(index, field, e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-${color}-400 resize-none font-mono`}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                  <button
                    onClick={() => copy(question[field], key)}
                    className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copied === key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-700">Hidden Test Cases</label>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {question.hiddenTestCases.filter(tc => tc.input && tc.output).length} / 5 filled
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {question.hiddenTestCases.map((tc, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Test {idx + 1}</p>
                  <input
                    type="text"
                    value={tc.input}
                    onChange={e => updateTestCase(idx, 'input', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-2"
                    placeholder="Input"
                  />
                  <input
                    type="text"
                    value={tc.output}
                    onChange={e => updateTestCase(idx, 'output', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Output"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Generate */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onGenerateQuestion(index)}
              disabled={isGenerating === index}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isGenerating === index
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                : <><Sparkles className="w-4 h-4" /> Auto-generate with AI</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCodeUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [questions, setQuestions] = useState(
    collection?.questions?.length > 0 ? collection.questions : [{
      id: 1, level: 'Intermediate', text: '',
      sampleInput: '', sampleOutput: '',
      hiddenTestCases: Array(5).fill(null).map(() => ({ input: '', output: '' }))
    }]
  );
  const [isGenerating, setIsGenerating] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { if (!collection) navigate('/'); }, [collection, navigate]);

  const addQuestion = () => setQuestions(prev => [...prev, {
    id: prev.length + 1, level: 'Intermediate', text: '',
    sampleInput: '', sampleOutput: '',
    hiddenTestCases: Array(5).fill(null).map(() => ({ input: '', output: '' }))
  }]);

  const deleteQuestion = idx => {
    if (questions.length > 1) setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const openModal = idx => { setCurrentIdx(idx); setTopic(''); setError(''); setShowModal(true); };

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }

    // Guard: check API key before making the request
    if (!API_KEY || API_KEY === 'undefined') {
      setError('VITE_GROQ_API_KEY is missing from your .env file. Restart the dev server after adding the key.');
      setShowModal(false);
      return;
    }

    setIsGenerating(currentIdx);
    setShowModal(false);
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: `Generate a coding interview question about "${topic}" with:
1. A detailed problem statement
2. Sample input (as a string)
3. Sample output (as a string)
4. 5 different test cases (inputs and outputs must be strings)

Return ONLY valid JSON (no markdown, no explanation):
{"question":"...","sampleInput":"...","sampleOutput":"...","testCases":[{"input":"...","output":"..."},{"input":"...","output":"..."},{"input":"...","output":"..."},{"input":"...","output":"..."},{"input":"...","output":"..."}]}` }],
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Groq API error:', data);
        throw new Error(data.error?.message || `Groq API error ${res.status}`);
      }
      const content = data.choices?.[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Could not parse AI response. Try again.');
      const gen = JSON.parse(match[0]);
      
      const ensureString = (val) => typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val || '');

      setQuestions(prev => prev.map((q, i) => i === currentIdx ? {
        ...q, 
        text: ensureString(gen.question || gen.problemStatement || ''), 
        sampleInput: ensureString(gen.sampleInput), 
        sampleOutput: ensureString(gen.sampleOutput),
        hiddenTestCases: (gen.testCases || []).slice(0, 5).map(tc => ({
          input: ensureString(tc.input),
          output: ensureString(tc.output)
        }))
      } : q));
    } catch (e) {
      setError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSave = async () => {
    const invalid = questions.filter(q =>
      !q.text.trim() || !q.sampleInput.trim() || !q.sampleOutput.trim() ||
      q.hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim())
    );
    if (invalid.length) { setError('Please fill in all fields for all questions and test cases'); return; }
    setIsSubmitting(true); setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/collections/${collection._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...collection, questions })
      });
      if (!res.ok) throw new Error('Failed to save');
      const updatedCollection = await res.json();
      setSuccess('Questions saved successfully!');
      navigate(location.pathname, { replace: true, state: { collection: updatedCollection } });
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!collection) return null;

  const counts = { total: questions.length, Beginner: 0, Intermediate: 0, Advanced: 0 };
  questions.forEach(q => counts[q.level]++);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-tight">Code Questions</h1>
                <nav className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Code Upload</span>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addQuestion} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <Plus className="w-4 h-4" /> Add Question
            </button>
            <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-semibold transition-colors">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save All</>}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Collection Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 mb-4">Collection Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Building2 className="w-4 h-4 text-indigo-500" />, label: 'Company', value: collection.company },
              { icon: <Briefcase className="w-4 h-4 text-purple-500" />, label: 'Role', value: collection.role },
              { icon: <Hash className="w-4 h-4 text-emerald-500" />, label: 'Interview ID', value: collection.interviewId },
              { icon: <Timer className="w-4 h-4 text-amber-500" />, label: 'Time Limit', value: `${collection.timeLimit} min` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Questions', value: counts.total, color: 'indigo' },
            { label: 'Beginner', value: counts.Beginner, color: 'emerald' },
            { label: 'Intermediate', value: counts.Intermediate, color: 'amber' },
            { label: 'Advanced', value: counts.Advanced, color: 'rose' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <p className={`text-3xl font-black text-${color}-600`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium ${
            error ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            {error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
            <span>{error || success}</span>
            <button onClick={() => { setError(''); setSuccess(''); }} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id} index={i} question={q}
              onUpdate={updateQuestion} onDelete={deleteQuestion}
              onGenerateQuestion={openModal} isGenerating={isGenerating}
            />
          ))}
        </div>

        {/* Add More */}
        <button
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-semibold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Another Question
        </button>
      </div>

      {/* AI Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Question Generator</h3>
                  <p className="text-xs text-slate-500">Enter a topic to generate a question</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-slate-400"
                  placeholder="e.g. Dynamic Programming, Binary Trees..."
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-2">Examples: Arrays, Sorting Algorithms, Hash Maps</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleGenerate} disabled={!topic.trim()} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Sparkles className="w-4 h-4" /> Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}