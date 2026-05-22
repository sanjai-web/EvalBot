import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plus, X, Minimize2, Maximize2, Trash2, Save, Loader2,
  ChevronRight, Hash, Star, FileText, AlertCircle, CheckCircle,
  RefreshCw, Edit, AlertTriangle, Building2, Briefcase,
  ArrowLeft, Timer, Sparkles
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const levelBadge = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced:     'bg-rose-50 text-rose-700 border-rose-200',
};

const emptyContainer = (id) => ({
  id, minimized: false, topic: '', level: 'Beginner',
  numQuestions: 5, questions: [],
  manualQuestion: { question: '', options: ['', '', '', ''], correctAnswer: '' },
  isGenerating: false, showManualForm: false, errors: {}
});


// Normalize DB data into container objects the UI expects.
// collection.questions can be either:
//   (a) an array of container objects (already has topic/level/id) — saved from this UI before
//   (b) an array of raw question objects (question/options/correctAnswer) — saved by other means
const normalizeContainers = (questions, collection) => {
  if (!questions || questions.length === 0) return [emptyContainer(1)];
  // If the first item looks like a container (has topic or id field), use as-is
  if (questions[0]?.topic !== undefined || questions[0]?.id !== undefined) {
    return questions.map((c, i) => ({
      ...emptyContainer(c.id ?? i + 1),
      ...c,
      // reset runtime-only UI fields
      isGenerating: false,
      showManualForm: false,
      errors: {},
    }));
  }
  // Otherwise it's a flat list of raw question objects — wrap in one container
  return [{
    ...emptyContainer(1),
    topic: collection?.role || 'Quiz',
    questions: questions,
  }];
};

export default function AdminQuizUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [containers, setContainers] = useState(() => normalizeContainers(collection?.questions, collection));
  const [nextId, setNextId] = useState(() => {
    const normalized = normalizeContainers(collection?.questions, collection);
    return Math.max(...normalized.map(c => c.id || 0)) + 1;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  useEffect(() => { if (!collection) navigate('/'); }, [collection, navigate]);

  const update = (id, patch) =>
    setContainers(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));

  const addContainer = () => {
    setContainers(prev => [...prev, emptyContainer(nextId)]);
    setNextId(n => n + 1);
  };

  const removeContainer = (id) => {
    if (containers.length === 1) { setContainers([emptyContainer(1)]); setNextId(2); return; }
    setContainers(prev => prev.filter(c => c.id !== id));
  };

  const resetAll = () => { setContainers([emptyContainer(1)]); setNextId(2); setShowDeleteAll(false); };

  const validate = (c) => {
    const e = {};
    if (!c.topic.trim()) e.topic = 'Topic is required';
    if (c.numQuestions < 1 || c.numQuestions > 20) e.numQuestions = 'Must be 1–20';
    return e;
  };

  const generateQuestions = async (id) => {
    const c = containers.find(x => x.id === id);
    const errors = validate(c);
    if (Object.keys(errors).length) { update(id, { errors }); return; }

    // Guard: check API key before making the request
    if (!API_KEY || API_KEY === 'undefined') {
      alert('AI generation is not configured. VITE_GROQ_API_KEY is missing from your .env file.\n\nRestart the dev server after adding the key.');
      return;
    }

    update(id, { isGenerating: true, errors: {} });
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content:
            `Generate ${c.numQuestions} multiple choice questions on "${c.topic}" at ${c.level} level.
Return ONLY a valid JSON array (no explanation, no markdown):
[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A"}]` }],
          temperature: 0.7,
          max_tokens: 2048
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Groq API error:', data);
        throw new Error(data.error?.message || `Groq API error ${res.status}`);
      }
      const content = data.choices?.[0]?.message?.content || '';
      const match = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!match) throw new Error('Could not parse AI response. Try again.');
      const questions = JSON.parse(match[0]).slice(0, c.numQuestions);
      update(id, { questions, isGenerating: false });
    } catch(err) {
      console.error('Question generation failed:', err);
      alert(`Failed to generate questions: ${err.message}`);
      update(id, { isGenerating: false });
    }
  };

  const addManualQuestion = (id) => {
    const c = containers.find(x => x.id === id);
    const { question, options, correctAnswer } = c.manualQuestion;
    if (!question.trim() || options.some(o => !o.trim()) || !correctAnswer) {
      alert('Please fill all fields'); return;
    }
    update(id, {
      questions: [...c.questions, { question, options: [...options], correctAnswer }],
      manualQuestion: { question: '', options: ['', '', '', ''], correctAnswer: '' },
      showManualForm: false
    });
  };

  const removeQuestion = (cid, qi) => {
    const c = containers.find(x => x.id === cid);
    update(cid, { questions: c.questions.filter((_, i) => i !== qi) });
  };

  const updateManual = (id, field, val, optIdx = null) => {
    const c = containers.find(x => x.id === id);
    if (optIdx !== null) {
      const options = [...c.manualQuestion.options];
      options[optIdx] = val;
      update(id, { manualQuestion: { ...c.manualQuestion, options } });
    } else {
      update(id, { manualQuestion: { ...c.manualQuestion, [field]: val } });
    }
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/collections/${collection._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...collection, questions: containers })
      });
      if (!res.ok) throw new Error('Failed to save');
      const updatedCollection = await res.json();
      
      const all = containers.flatMap(c => c.questions.map(q => ({ ...q, topic: c.topic, level: c.level })));
      alert(`Saved ${all.length} questions successfully!`);
      navigate(location.pathname, { replace: true, state: { collection: updatedCollection } });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const totalQ = containers.reduce((s, c) => s + c.questions.length, 0);
  if (!collection) return null;

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
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-tight">Quiz Questions</h1>
                <nav className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Quiz Upload</span>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleteAll(true)}
              disabled={containers.length === 1 && !containers[0].topic && containers[0].questions.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
            <button onClick={addContainer} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <Plus className="w-4 h-4" /> New Section
            </button>
            <button
              onClick={saveAll}
              disabled={isSaving || totalQ === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save All</>}
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
            { label: 'Sections', value: containers.length, color: 'indigo' },
            { label: 'Total Questions', value: totalQ, color: 'emerald' },
            { label: 'Beginner', value: containers.filter(c => c.level === 'Beginner').length, color: 'amber' },
            { label: 'Ready Sections', value: containers.filter(c => c.questions.length > 0).length, color: 'purple' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <p className={`text-3xl font-black text-${color}-600`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Containers */}
        <div className="space-y-4">
          {containers.map((c, idx) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Container Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {c.topic ? c.topic : `Section ${idx + 1}`}
                    </p>
                    <p className="text-xs text-slate-500">{c.questions.length} questions · {c.level}</p>
                  </div>
                  {c.questions.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                      Ready
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => update(c.id, { minimized: !c.minimized })} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                    {c.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  {containers.length > 1 && (
                    <button onClick={() => removeContainer(c.id)} className="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {!c.minimized && (
                <div className="p-6 space-y-6">
                  {/* Config Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Topic <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={c.topic}
                        onChange={e => update(c.id, { topic: e.target.value, errors: { ...c.errors, topic: null } })}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${c.errors.topic ? 'border-rose-400' : 'border-slate-200'}`}
                        placeholder="e.g. React Hooks, Thermodynamics"
                      />
                      {c.errors.topic && <p className="text-xs text-rose-500 mt-1">{c.errors.topic}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                      <select
                        value={c.level}
                        onChange={e => update(c.id, { level: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of Questions <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number" min="1" max="20"
                        value={c.numQuestions}
                        onChange={e => update(c.id, { numQuestions: parseInt(e.target.value) || 1, errors: { ...c.errors, numQuestions: null } })}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${c.errors.numQuestions ? 'border-rose-400' : 'border-slate-200'}`}
                      />
                      {c.errors.numQuestions && <p className="text-xs text-rose-500 mt-1">{c.errors.numQuestions}</p>}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => generateQuestions(c.id)}
                      disabled={c.isGenerating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      {c.isGenerating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
                    </button>
                    <button
                      onClick={() => update(c.id, { showManualForm: !c.showManualForm })}
                      className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      {c.showManualForm ? 'Cancel Manual' : 'Add Manually'}
                    </button>
                  </div>

                  {/* Manual Form */}
                  {c.showManualForm && (
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
                      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Edit className="w-4 h-4 text-indigo-500" /> Add Question Manually
                      </h3>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Question <span className="text-rose-500">*</span></label>
                        <textarea
                          value={c.manualQuestion.question}
                          onChange={e => updateManual(c.id, 'question', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                          placeholder="Enter the question..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Options <span className="text-rose-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {['A', 'B', 'C', 'D'].map((opt, i) => (
                            <div key={opt} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
                              <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{opt}</span>
                              <input
                                type="text"
                                value={c.manualQuestion.options[i]}
                                onChange={e => updateManual(c.id, 'options', e.target.value, i)}
                                className="flex-1 text-sm text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
                                placeholder={`Option ${opt}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Correct Answer <span className="text-rose-500">*</span></label>
                        <select
                          value={c.manualQuestion.correctAnswer}
                          onChange={e => updateManual(c.id, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <option value="">Select correct option</option>
                          {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>Option {o}</option>)}
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => addManualQuestion(c.id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add Question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Generated Questions */}
                  {c.questions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Questions ({c.questions.length})
                        </h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelBadge[c.level]}`}>{c.level}</span>
                      </div>
                      {c.questions.map((q, qi) => (
                        <div key={qi} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                                {qi + 1}
                              </span>
                              <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question}</p>
                            </div>
                            <button onClick={() => removeQuestion(c.id, qi)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 transition-colors shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {['A', 'B', 'C', 'D'].map((opt, oi) => (
                              <div
                                key={opt}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                                  q.correctAnswer === opt
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`font-bold w-6 shrink-0 ${q.correctAnswer === opt ? 'text-emerald-600' : 'text-slate-400'}`}>{opt}</span>
                                <span className="flex-1">{q.options[oi]}</span>
                                {q.correctAnswer === opt && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {c.questions.length === 0 && !c.showManualForm && !c.isGenerating && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                      <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                        <FileText className="w-8 h-8 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">No questions yet</p>
                      <p className="text-xs text-slate-500 mb-5">Enter a topic above and generate with AI, or add manually.</p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => generateQuestions(c.id)}
                          disabled={!c.topic.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                          Generate with AI
                        </button>
                        <button
                          onClick={() => update(c.id, { showManualForm: true })}
                          className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          Add Manually
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Section */}
        <button
          onClick={addContainer}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-semibold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Another Section
        </button>
      </div>

      {/* Delete All Modal */}
      {showDeleteAll && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Clear All Sections?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will delete all <span className="font-semibold text-slate-800">{containers.length} section{containers.length > 1 ? 's' : ''}</span> and{' '}
              <span className="font-semibold text-rose-600">{totalQ} questions</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteAll(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={resetAll} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}