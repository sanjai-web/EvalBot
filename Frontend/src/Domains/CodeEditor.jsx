import { useState, useRef, useEffect, useCallback } from "react";

// ─── Wandbox compiler mapping ────────────────────────────────────────────────
const WANDBOX_COMPILERS = {
  python:     "cpython-3.12.0",
  javascript: null,           // handled locally
  java:       "openjdk-jdk-21+35",
  cpp:        "gcc-13.2.0",
  c:          "gcc-13.2.0",
  mysql:      null,           // handled via mock
};

const WANDBOX_OPTIONS = {
  cpp:  "warning,c++17",
  c:    "warning,c11",
  java: "",
  python: "",
};

// ─── Local JS execution ───────────────────────────────────────────────────────
function runJavaScriptLocally(code, stdin) {
  const logs = [];
  const origLog = console.log;
  const origError = console.error;

  // Redirect console.log to capture output
  console.log = (...args) => logs.push(args.map(String).join(" "));
  console.error = (...args) => logs.push("Error: " + args.map(String).join(" "));

  try {
    // Make stdin available as a variable inside user code
    const wrappedCode = `
      const __stdin = ${JSON.stringify(stdin || "")};
      const __lines = __stdin.trim().split("\\n");
      let __lineIdx = 0;
      function readline() { return __lines[__lineIdx++] || ""; }
      function input(prompt) { return readline(); }
      ${code}
    `;
    // eslint-disable-next-line no-new-func
    new Function(wrappedCode)();
    return { stdout: logs.join("\n"), stderr: "", success: true };
  } catch (err) {
    return { stdout: logs.join("\n"), stderr: err.message, success: false };
  } finally {
    console.log = origLog;
    console.error = origError;
  }
}

// ─── Wandbox API call ─────────────────────────────────────────────────────────
async function runOnWandbox(language, code, stdin) {
  const compiler = WANDBOX_COMPILERS[language];
  if (!compiler) throw new Error(`No Wandbox compiler for ${language}`);

  const body = {
    compiler,
    code,
    stdin: stdin || "",
    "compiler-option-raw": WANDBOX_OPTIONS[language] || "",
    "runtime-option-raw": "",
    save: false,
  };

  const res = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wandbox error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Wandbox returns: program_output, program_error, compiler_output, compiler_error, status
  const stdout = (data.program_output || "").trim();
  const stderr = (data.program_error || data.compiler_error || data.compiler_output || "").trim();
  const success = data.status === 0 || data.status === "0";
  return { stdout, stderr, success };
}

// ─── MySQL mock ───────────────────────────────────────────────────────────────
function runMySQLMock(code) {
  return {
    stdout: "MySQL execution requires a live database.\nQuery received:\n" + code,
    stderr: "",
    success: true,
  };
}

// ─── Master executor ──────────────────────────────────────────────────────────
export async function executeCode(language, code, stdin = "") {
  if (language === "javascript") {
    return runJavaScriptLocally(code, stdin);
  }
  if (language === "mysql") {
    return runMySQLMock(code);
  }
  return runOnWandbox(language, code, stdin);
}

// ─── Test case evaluator ──────────────────────────────────────────────────────
/**
 * Runs code against each test case and returns per-case results.
 * @param {string} language
 * @param {string} code
 * @param {Array<{input: string, expectedOutput: string}>} testCases
 * @returns {Promise<{results: Array, passed: number, total: number, summary: string}>}
 */
export async function evaluateTestCases(language, code, testCases) {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      const { stdout, stderr, success } = await executeCode(language, code, tc.input);
      const actual = stdout.trim();
      const expected = (tc.expectedOutput || "").trim();
      const passed = success && actual === expected;
      results.push({ index: i + 1, passed, actual, expected, stderr, input: tc.input });
    } catch (err) {
      results.push({
        index: i + 1,
        passed: false,
        actual: "",
        expected: (tc.expectedOutput || "").trim(),
        stderr: err.message,
        input: tc.input,
      });
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const summary = buildSummary(results, passed, total);
  return { results, passed, total, summary };
}

function buildSummary(results, passed, total) {
  const lines = [`Test Results: ${passed}/${total} passed\n`];
  for (const r of results) {
    const icon = r.passed ? "✓" : "✗";
    lines.push(`[${icon}] Test Case ${r.index}`);
    if (!r.passed) {
      lines.push(`    Input:    ${r.input.replace(/\n/g, "↵")}`);
      lines.push(`    Expected: ${r.expected}`);
      lines.push(`    Got:      ${r.actual || "(no output)"}`);
      if (r.stderr) lines.push(`    Error:    ${r.stderr}`);
    }
  }
  return lines.join("\n");
}


// ─── Initial code templates ───────────────────────────────────────────────────
export const initialTemplates = {
  python: `# Write your Python solution here\n\ndef solution():\n    pass\n\nsolution()\n`,
  javascript: `// Write your JavaScript solution here\n\nfunction solution() {\n\n}\n\nconsole.log(solution());\n`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
  mysql: `-- Write your MySQL query here\nSELECT * FROM table_name;\n`,
};


// ─── Sample questions (with per-testcase inputs/outputs) ─────────────────────
export const sampleQuestions = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.`,
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    testCases: [
      { input: "4\n2 7 11 15\n9",  expectedOutput: "0 1" },
      { input: "3\n3 2 4\n6",       expectedOutput: "1 2" },
      { input: "2\n3 3\n6",         expectedOutput: "0 1" },
    ],
  },
  {
    title: "Palindrome Check",
    difficulty: "Easy",
    description: `Given a string s, return true if it is a palindrome, or false otherwise.

A palindrome reads the same forward and backward. Ignore case differences.`,
    sampleInput: "racecar",
    sampleOutput: "true",
    testCases: [
      { input: "racecar",   expectedOutput: "true"  },
      { input: "hello",     expectedOutput: "false" },
      { input: "A man a plan a canal Panama".replace(/ /g, "").toLowerCase(), expectedOutput: "true" },
    ],
  },
  {
    title: "FizzBuzz",
    difficulty: "Medium",
    description: `Given an integer n, print numbers from 1 to n with these rules:
- Multiples of 3 → print "Fizz"
- Multiples of 5 → print "Buzz"  
- Multiples of both → print "FizzBuzz"
- Otherwise → print the number`,
    sampleInput: "5",
    sampleOutput: "1\n2\nFizz\n4\nBuzz",
    testCases: [
      { input: "5",  expectedOutput: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\n6\n7\nFizz\n9\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { input: "3",  expectedOutput: "1\n2\nFizz" },
    ],
  },
];


// ─── The main CodeEditor component (drop-in replacement) ─────────────────────
import Editor from "@monaco-editor/react";

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function CodeEditor() {
  const [language, setLanguage]           = useState("python");
  const [code, setCode]                   = useState(initialTemplates.python);
  const [output, setOutput]               = useState("");
  const [isRunning, setIsRunning]         = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [passedTests, setPassedTests]     = useState(0);
  const [isSubmitted, setIsSubmitted]     = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [dividerPosition, setDividerPosition] = useState(40);
  const [isDragging, setIsDragging]       = useState(false);

  const containerRef = useRef(null);
  const question     = sampleQuestions[currentQuestion];
  const totalTests   = question.testCases.length;

  // Timer
  useEffect(() => {
    const id = setInterval(() => setTimeRemaining((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  // Draggable divider
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct  = ((e.clientX - rect.left) / rect.width) * 100;
      setDividerPosition(Math.min(70, Math.max(25, pct)));
    };
    const onUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(initialTemplates[lang]);
    setOutput("");
    setPassedTests(0);
  };

  // ── Run (single execution against sample input) ──────────────────────────
  const runCode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("▶ Running...\n");
    try {
      const { stdout, stderr, success } = await executeCode(language, code, question.sampleInput);
      let out = "";
      if (stdout) out += stdout;
      if (stderr) out += (out ? "\n\n" : "") + "Stderr:\n" + stderr;
      if (!out)   out  = "(no output)";
      if (!success && !stderr) out += "\n[non-zero exit]";
      setOutput(out);
    } catch (err) {
      setOutput("⚠ Execution error:\n" + err.message);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, language, code, question]);

  // ── Submit (run against all test cases) ──────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setOutput("⏳ Evaluating all test cases...\n");
    try {
      const { passed, total, summary } = await evaluateTestCases(language, code, question.testCases);
      setPassedTests(passed);
      setOutput(summary);
      if (passed === total) setIsSubmitted(true);
    } catch (err) {
      setOutput("⚠ Submission error:\n" + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, language, code, question]);

  const handleFinishAssessment = () => {
    setIsSubmitted(false);
    setPassedTests(0);
    setOutput("");
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      setCode(initialTemplates[language]);
    } else {
      alert("Assessment Completed! You have answered all questions.");
    }
  };

  const isLastQuestion = currentQuestion === sampleQuestions.length - 1;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300" ref={containerRef}>
      {/* ── Top Nav ── */}
      <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] rounded-lg flex items-center justify-center border border-indigo-400">
                  <span className="text-white font-bold tracking-wider">C</span>
                </div>
                <span className="text-xl font-bold tracking-wide text-white">CodeRunner</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  <span className="text-sm font-bold uppercase tracking-wider">Prev</span>
                </button>
                <div className="text-center min-w-[100px] bg-white/5 border border-white/10 rounded-lg py-1 px-3">
                  <div className="font-bold text-white text-sm">Question {currentQuestion + 1}</div>
                  <div className="text-xs text-indigo-400 font-medium">of {sampleQuestions.length}</div>
                </div>
                <button
                  onClick={() => setCurrentQuestion((p) => Math.min(sampleQuestions.length - 1, p + 1))}
                  disabled={currentQuestion === sampleQuestions.length - 1}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors text-slate-300"
                >
                  <span className="text-sm font-bold uppercase tracking-wider">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center hidden md:block">
                <div className={`font-mono text-lg font-bold ${timeRemaining < 600 ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Time Remaining</div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#0a0f1c] border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[120px] text-slate-200 outline-none"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="mysql">MySQL</option>
                </select>

                {/* Run button */}
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-bold uppercase tracking-wider text-sm flex items-center space-x-2 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                >
                  {isRunning ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  <span className="hidden sm:inline">Run</span>
                </button>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-bold uppercase tracking-wider text-sm flex items-center space-x-2 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400"
                >
                  {isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  )}
                  <span className="hidden sm:inline">Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main panels ── */}
      <div className="flex h-[calc(100vh-73px)] relative bg-[#030712]">
        {/* Left – Question */}
        <div className="h-full overflow-auto" style={{ width: `${dividerPosition}%` }}>
          <div className="p-4 md:p-6 h-full">
            <div className="mb-6 bg-[#0a0f1c]/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-white break-words tracking-wide">{question.title}</h1>
                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
                  question.difficulty.toLowerCase() === "easy"   ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  question.difficulty.toLowerCase() === "medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}>{question.difficulty}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Test Cases</span>
                  <span className="text-indigo-400">{passedTests}/{totalTests} passed</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                    style={{ width: `${(passedTests / totalTests) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Description</span>
                </h3>
                <div className="bg-[#0a0f1c]/50 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-inner">
                  <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm md:text-base overflow-x-hidden leading-relaxed">{question.description}</pre>
                </div>
              </div>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    <span>Sample Input</span>
                  </h3>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 min-h-[80px] max-h-[150px] overflow-auto">
                    <pre className="text-indigo-300 font-mono text-sm whitespace-pre-wrap break-all">{question.sampleInput}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Sample Output</span>
                  </h3>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 min-h-[80px] max-h-[150px] overflow-auto">
                    <pre className="text-emerald-300 font-mono text-sm whitespace-pre-wrap break-all">{question.sampleOutput}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-1.5 cursor-col-resize bg-white/10 hover:bg-indigo-500 active:bg-indigo-500 z-10 transition-colors shadow-[0_0_5px_rgba(0,0,0,0.5)]"
          style={{ left: `${dividerPosition}%`, transform: "translateX(-50%)" }}
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-4 bg-indigo-500/20 border border-indigo-500/50 rounded flex flex-col items-center justify-center space-y-1">
            {[1, 2, 3].map((i) => <div key={i} className="w-1 h-0.5 bg-indigo-300 rounded-full" />)}
          </div>
        </div>

        {/* Right – Editor + Terminal */}
        <div className="h-full flex flex-col bg-[#0a0f1c]" style={{ width: `${100 - dividerPosition}%` }}>
          <div className="px-5 py-3 border-b border-white/10 bg-[#0a0f1c]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              <span className="font-bold text-slate-200 text-sm md:text-base tracking-wide">
                {language.charAt(0).toUpperCase() + language.slice(1)} Code
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5 hidden sm:block">
              {code.split("\n").length} lines
            </div>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language === "mysql" ? "sql" : language}
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on",
                readOnly: false,
                contextmenu: false,
                copyWithSyntaxHighlighting: false,
                wordWrap: "on",
                suggestOnTriggerCharacters: false,
                quickSuggestions: false,
                parameterHints: { enabled: false },
                padding: { top: 16 },
                scrollbar: { vertical: "visible", horizontal: "visible", verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
              }}
              onMount={(editor, monaco) => {
                monaco.editor.defineTheme("custom-dark", {
                  base: "vs-dark", inherit: true, rules: [],
                  colors: { "editor.background": "#0a0f1c", "editor.lineHighlightBackground": "#ffffff0a", "editorLineNumber.foreground": "#475569" },
                });
                monaco.editor.setTheme("custom-dark");
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {});
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV, () => {});
                editor.onContextMenu((e) => { e.preventDefault(); });
              }}
            />
          </div>

          {/* Terminal */}
          <div className="border-t border-white/10 bg-[#030712]" style={{ height: "35%" }}>
            <div className="px-5 py-2.5 border-b border-white/10 bg-[#0a0f1c]/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-bold text-sm uppercase tracking-wider text-slate-300">Terminal Output</span>
              </div>
              <button
                onClick={() => setOutput("")}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors bg-white/5 px-3 py-1 rounded border border-white/5 hover:bg-white/10"
              >Clear</button>
            </div>
            <div className="h-[calc(100%-41px)] p-4 overflow-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words text-slate-300">
                {output || <span className="text-slate-600">// Output will appear here after Run or Submit</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
                <svg className="w-10 h-10 text-emerald-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Solution Accepted!</h3>
              <p className="text-slate-400 mb-8 text-sm">All <strong className="text-emerald-400">{totalTests}</strong> test cases passed. Fantastic work!</p>
              <button
                onClick={handleFinishAssessment}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                {isLastQuestion ? "Finish Assessment" : "Continue to Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1c]/90 backdrop-blur-md border-t border-white/10 py-2.5 px-4 md:px-6 z-40">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 hidden sm:inline">Language:</span>
              <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{language}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 hidden sm:inline">Test Cases:</span>
              <span className={`px-2 py-0.5 rounded border ${passedTests === totalTests && passedTests > 0 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
                {passedTests}/{totalTests} passed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 hidden sm:inline">Engine:</span>
              <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {language === "javascript" ? "Local JS" : language === "mysql" ? "Mock DB" : "Wandbox"}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:hidden">
              <span className="font-mono font-bold text-white">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}