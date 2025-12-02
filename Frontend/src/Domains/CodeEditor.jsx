import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const API_KEY = 'AIzaSyCle45rsftrDsl2IXNyewl64aGd3g0cJxc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Sample questions data
const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    hiddenTestCases: [
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
      { input: "nums = [1,2,3,4,5], target = 9", output: "[3,4]" },
      { input: "nums = [0,4,3,0], target = 0", output: "[0,3]" },
      { input: "nums = [-1,-2,-3,-4,-5], target = -8", output: "[2,4]" }
    ]
  },
  {
    id: 2,
    title: "Palindrome Check",
    difficulty: "Medium",
    description: `Given a string s, return true if it is a palindrome, or false otherwise.

A palindrome is a string that reads the same forward and backward. It should ignore cases and non-alphanumeric characters.`,
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: "true",
  hiddenTestCases: [
      { input: 's = "race a car"', output: "false" },
      { input: 's = " "', output: "true" },
      { input: 's = "ab@a"', output: "true" },
      { input: 's = "0P"', output: "false" },
      { input: 's = "Able was I ere I saw Elba"', output: "true" }
    ]
  },
  {
    id: 3,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Medium",
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example:
Input: root = [1,null,2,3]
Output: [1,3,2]`,
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[1,3,2]",
   hiddenTestCases: [
      { input: "root = []", output: "[]" },
      { input: "root = [1]", output: "[1]" },
      { input: "root = [1,2,3,4,5]", output: "[4,2,5,1,3]" },
      { input: "root = [1,2,3,null,4,5]", output: "[2,4,1,5,3]" },
      { input: "root = [5,3,7,2,4,6,8]", output: "[2,3,4,5,6,7,8]" }
    ]
  }
];

// Initial code templates
const initialTemplates = {
  python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
  
  java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> num_map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (num_map.find(complement) != num_map.end()) {
                return {num_map[complement], i};
            }
            num_map[nums[i]] = i;
        }
        return {};
    }
};`,
  
  c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 0;
    
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                *returnSize = 2;
                return result;
            }
        }
    }
    return result;
}`,
  
  mysql: `SELECT id, name, age
FROM users
WHERE age > 25
ORDER BY name;`,
  
  javascript: `var twoSum = function(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
};`
};

function CodeEditor() {
  const [code, setCode] = useState(initialTemplates.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [passedTests, setPassedTests] = useState(0);
  const [totalTests, setTotalTests] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Initialize
  useEffect(() => {
    setTotalTests(sampleQuestions[currentQuestion]?.hiddenTestCases.length || 5);
    setCode(initialTemplates[language] || initialTemplates.python);
  }, [currentQuestion, language]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse move handler for divider
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      
      // Limit between 30% and 70%
      if (percentage >= 30 && percentage <= 70) {
        setDividerPosition(percentage);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      const prompt = `Execute this ${language} code:\n${code}\n\nOnly output the result or error:`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;
      setOutput(result);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runHiddenTests = async () => {
    let passed = 0;
    for (let i = 0; i < totalTests; i++) {
      try {
        const testCase = sampleQuestions[currentQuestion].hiddenTestCases[i];
        const prompt = `Test this ${language} code:\n${code}\n\nInput: ${testCase.input}\nExpected: ${testCase.output}\nReturn only "PASS" or "FAIL":`;

        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.candidates[0].content.parts[0].text.trim();
          if (result === 'PASS') passed++;
        }
      } catch (err) {
        console.error('Test case error:', err);
      }
    }
    setPassedTests(passed);
    return passed;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const passed = await runHiddenTests();
    setIsSubmitting(false);
    
    if (passed === totalTests) {
      setIsSubmitted(true);
    } else {
      alert(`${passed}/${totalTests} test cases passed. Please fix your code.`);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(initialTemplates[lang] || initialTemplates.python);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleFinishAssessment = () => {
    setIsSubmitted(false);
    setPassedTests(0);
    setOutput('');
    
    // Move to next question if not last
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCode(initialTemplates[language]);
    } else {
      // If it's the last question, show completion message
      alert('Assessment Completed! You have answered all questions.');
    }
  };

  const isLastQuestion = currentQuestion === sampleQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100" ref={containerRef}>
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Brand and Question Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold">CodeRunner</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <div className="text-center min-w-[100px]">
                  <div className="font-medium">Question {currentQuestion + 1}</div>
                  <div className="text-sm text-gray-400">of {sampleQuestions.length}</div>
                </div>
                
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(sampleQuestions.length - 1, prev + 1))}
                  disabled={currentQuestion === sampleQuestions.length - 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Timer and Controls */}
            <div className="flex items-center space-x-6">
              <div className="text-center hidden md:block">
                <div className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-xs text-gray-400">Time Remaining</div>
              </div>
              
              <div className="h-8 w-px bg-gray-700 hidden md:block" />
              
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="mysql">MySQL</option>
                </select>
                
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  {isRunning ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">Run</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  {isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Resizable Panels */}
      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Left Panel - Question */}
        <div 
          className="h-full overflow-auto bg-gray-800"
          style={{ width: `${dividerPosition}%` }}
        >
          <div className="p-4 md:p-6 h-full">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-white break-words">
                  {sampleQuestions[currentQuestion].title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(sampleQuestions[currentQuestion].difficulty)} whitespace-nowrap`}>
                  {sampleQuestions[currentQuestion].difficulty}
                </span>
              </div>
              
              {/* Test Cases Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Test Cases</span>
                  <span>{passedTests}/{totalTests} passed</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(passedTests / totalTests) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Description</h3>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm md:text-base overflow-x-hidden">
                    {sampleQuestions[currentQuestion].description}
                  </pre>
                </div>
              </div>

              {/* Sample Input/Output */}
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Sample Input</h3>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 min-h-[80px] max-h-[150px] overflow-auto">
                    <pre className="text-cyan-300 font-mono text-sm whitespace-pre-wrap break-all">
                      {sampleQuestions[currentQuestion].sampleInput}
                    </pre>
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Sample Output</h3>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 min-h-[80px] max-h-[150px] overflow-auto">
                    <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap break-all">
                      {sampleQuestions[currentQuestion].sampleOutput}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="absolute top-0 bottom-0 w-2 cursor-col-resize bg-gray-700 hover:bg-blue-500 active:bg-blue-500 z-10"
          style={{ left: `${dividerPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Editor and Output */}
        <div 
          className="h-full flex flex-col bg-gray-900"
          style={{ width: `${100 - dividerPosition}%` }}
        >
          {/* Editor Header */}
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-300 text-sm md:text-base">
                  {language.charAt(0).toUpperCase() + language.slice(1)} Code
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400 hidden sm:block">
              {code.split('\n').length} lines
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language === 'mysql' ? 'sql' : language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                readOnly: false,
                contextmenu: false,
                copyWithSyntaxHighlighting: false,
                wordWrap: 'on',
                suggestOnTriggerCharacters: false,
                quickSuggestions: false,
                parameterHints: { enabled: false },
                domReadOnly: true,
              }}
              onMount={(editor, monaco) => {
                // Block copy/paste/cut commands
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV, () => {});
                
                // Block right-click context menu
                editor.onContextMenu((e) => {
                  e.preventDefault();
                });
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="border-t border-gray-800" style={{ height: '40%' }}>
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Output</span>
              </div>
              <button
                onClick={() => setOutput('')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="h-[calc(100%-49px)] p-4 overflow-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                {output || '// Output will appear here'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Solution Accepted!</h3>
              <p className="text-gray-400 mb-6">
                All {totalTests} test cases passed successfully.
              </p>
              <button
                onClick={handleFinishAssessment}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                {isLastQuestion ? 'Finish Assessment' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-2 px-4 md:px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 hidden sm:inline">Language:</span>
              <span className="text-white font-medium">{language.toUpperCase()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 hidden sm:inline">Test Cases:</span>
              <span className={`font-medium ${passedTests === totalTests ? 'text-green-400' : 'text-yellow-400'}`}>
                {passedTests}/{totalTests} passed
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:hidden">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;