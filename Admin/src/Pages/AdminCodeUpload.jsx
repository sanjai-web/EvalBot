import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Code, Upload, FileCode, Hash, Brain,
  Loader2, ChevronRight, Star, Zap, Copy, Check,
  AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const API_KEY = 'AIzaSyCle45rsftrDsl2IXNyewl64aGd3g0cJxc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Question Container Component
function QuestionContainer({ 
  index, 
  question, 
  onUpdate, 
  onDelete, 
  onGenerateQuestion,
  isGenerating 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-700 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Advanced': 'bg-red-100 text-red-700 border-red-200'
  };

  const levelIcons = {
    'Beginner': '🟢',
    'Intermediate': '🟡',
    'Advanced': '🔴'
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-sm">
              Q{index + 1}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-slate-500" />
                <select
                  value={question.level}
                  onChange={(e) => onUpdate(index, 'level', e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${levelColors[question.level]}`}>
                {levelIcons[question.level]} {question.level}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-slate-700"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button
              onClick={() => onDelete(index)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <FileCode className="w-5 h-5 mr-2 text-blue-600" />
              Question *
            </label>
            <div className="relative">
              <textarea
                value={question.text}
                onChange={(e) => onUpdate(index, 'text', e.target.value)}
                className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                placeholder="Enter the coding question..."
              />
              <button
                onClick={() => handleCopy(question.text, 'question')}
                className="absolute top-2 right-2 p-1.5 hover:bg-slate-100 rounded transition-colors"
              >
                {copiedField === 'question' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Sample Input & Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <Code className="w-5 h-5 mr-2 text-green-600" />
                Sample Input
              </label>
              <div className="relative">
                <textarea
                  value={question.sampleInput}
                  onChange={(e) => onUpdate(index, 'sampleInput', e.target.value)}
                  className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm bg-slate-50"
                  placeholder="Enter sample input..."
                />
                <button
                  onClick={() => handleCopy(question.sampleInput, 'sampleInput')}
                  className="absolute top-2 right-2 p-1.5 hover:bg-slate-100 rounded transition-colors"
                >
                  {copiedField === 'sampleInput' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Sample Output
              </label>
              <div className="relative">
                <textarea
                  value={question.sampleOutput}
                  onChange={(e) => onUpdate(index, 'sampleOutput', e.target.value)}
                  className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm bg-slate-50"
                  placeholder="Enter sample output..."
                />
                <button
                  onClick={() => handleCopy(question.sampleOutput, 'sampleOutput')}
                  className="absolute top-2 right-2 p-1.5 hover:bg-slate-100 rounded transition-colors"
                >
                  {copiedField === 'sampleOutput' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-700 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-purple-600" />
                Hidden Test Cases (5 required)
              </label>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {question.hiddenTestCases.filter(tc => tc.input && tc.output).length}/5 completed
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {question.hiddenTestCases.map((testCase, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">Case {idx + 1}</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleCopy(testCase.input, `test${idx}-input`)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        {copiedField === `test${idx}-input` ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(testCase.output, `test${idx}-output`)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        {copiedField === `test${idx}-output` ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={testCase.input}
                      onChange={(e) => {
                        const newTestCases = [...question.hiddenTestCases];
                        newTestCases[idx].input = e.target.value;
                        onUpdate(index, 'hiddenTestCases', newTestCases);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
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
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      placeholder="Output"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Question Button */}
          <div className="flex justify-end">
            <button
              onClick={() => onGenerateQuestion(index)}
              disabled={isGenerating === index}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 flex items-center space-x-2"
            >
              {isGenerating === index ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main AdminCodeUpload Component
function AdminCodeUpload() {
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

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format');

      const generatedData = JSON.parse(jsonMatch[0]);

      // Update the question with generated data
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
    // Validate all questions
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
      // Here you would typically send data to your backend
      console.log('Submitting questions:', questions);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Questions saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save questions');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-xl shadow-sm">
                CODE UPLOAD
              </div>
              <div className="hidden md:flex items-center space-x-2 text-slate-600">
                <span className="text-sm">Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Collections</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-900">Code Questions</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={addQuestion}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
              >
                <Plus className="w-5 h-5" />
                <span>Add Question</span>
              </button>
              <button
                onClick={handleSubmitAll}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Save All Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-slate-900">{questions.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-600 text-white">
                <FileCode className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">Beginner</p>
                <p className="text-3xl font-bold text-slate-900">
                  {questions.filter(q => q.level === 'Beginner').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-600 text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">Intermediate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {questions.filter(q => q.level === 'Intermediate').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-600 text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">Advanced</p>
                <p className="text-3xl font-bold text-slate-900">
                  {questions.filter(q => q.level === 'Advanced').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-600 text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            <div className="flex items-center space-x-3">
              {error ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              <span className="font-medium">{error || successMessage}</span>
            </div>
          </div>
        )}

        {/* Questions Container */}
        <div className="mb-8">
          {questions.map((question, index) => (
            <QuestionContainer
              key={question.id}
              index={index}
              question={question}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onGenerateQuestion={generateWithAI}
              isGenerating={isGenerating}
            />
          ))}
        </div>

        {/* Add Another Question Button */}
        <div className="text-center mb-12">
          <button
            onClick={addQuestion}
            className="bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 border-2 border-dashed border-slate-300 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl font-medium flex items-center space-x-3 transition-all duration-200 mx-auto"
          >
            <Plus className="w-6 h-6" />
            <span>Add Another Question</span>
          </button>
        </div>
      </div>

      {/* Topic Modal for AI Generation */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-semibold">Generate Question with AI</h3>
              <p className="text-purple-100 text-sm mt-1">Enter a topic to generate a complete coding question</p>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Topic or Technology
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Binary Trees, Dynamic Programming, REST APIs"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Examples: Arrays, Sorting Algorithms, Graph Traversal, SQL Queries, etc.
                </p>
              </div>
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateQuestion}
                  disabled={!topic.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center justify-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>Generate Question</span>
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