import React, { useState, useImperativeHandle, forwardRef } from 'react';
import SecurityBadge from './SecurityBadge';
import axios from 'axios';

const RISK_SOLUTIONS = {
  'XSS Risk': 'To prevent XSS (Cross-Site Scripting), always check and clean any user input before showing it on your website. For example, use functions or libraries that remove or escape special characters, so attackers cannot run scripts in your page.',
  'No CSRF': 'To protect against CSRF (Cross-Site Request Forgery), add a CSRF token to your forms. This is a hidden value that only your website knows, so hackers cannot trick users into submitting forms without permission. Most frameworks have built-in ways to add CSRF tokens.',
  'SQL Risk': 'To avoid SQL Injection, never put user input directly into your database queries. Instead, use prepared statements or ORM methods, which safely handle the data for you. This stops attackers from changing your queries.',
  'No HTTPS': 'Always use HTTPS (SSL/TLS) for your website. This encrypts data sent between your users and your server, keeping information safe from hackers. Most hosting providers offer free SSL certificates.',
  'Weak Password Policy': 'Require users to create strong passwords (at least 8 characters, with numbers and symbols). This makes it much harder for attackers to guess or brute-force passwords.',
  'No Input Validation': 'Always check and validate all user input on both the client and server side. This helps prevent many types of attacks, like XSS and SQL Injection.',
  'Sensitive Data in Form': 'Never ask for sensitive information (like passwords or credit card numbers) in plain text fields. Use secure input types and always encrypt sensitive data.',
  'Open Redirect': 'Avoid using user input to build redirect URLs. If you must redirect, only allow safe, known URLs to prevent attackers from sending users to malicious sites.',
  'No Authentication': 'Make sure your forms and pages are protected by authentication, so only authorized users can access or submit sensitive data.',
  'No Rate Limiting': 'Add rate limiting to your forms and APIs to prevent attackers from spamming or brute-forcing your site. Many frameworks and services offer easy ways to add this protection.',
  // Additional language-specific risks
  'Unencrypted Communication': 'Always use HTTPS instead of HTTP to protect data in transit from interception.',
  'Hardcoded Data': 'Avoid hardcoding sensitive data in your code. Use environment variables or secure vaults.',
  'Error Handling Risk': 'Always handle errors and exceptions gracefully to avoid leaking sensitive information or crashing your application.',
  'Buffer Overflow': 'In C/C++, always check buffer sizes and use safe functions to prevent buffer overflows.',
  'Shell Injection': 'In shell scripts, always sanitize user input and avoid using eval or unsafe command concatenation.',
  'Type Confusion': 'In TypeScript and strongly typed languages, validate types at runtime if data comes from untrusted sources.',
  'Dependency Risk': 'Keep your dependencies up to date and avoid using untrusted packages.',
  'No Logging': 'Implement proper logging for security events, but avoid logging sensitive data.',
  'No Output Encoding': 'Always encode output when displaying user data to prevent XSS.',
  'No Access Control': 'Implement proper access control checks in your backend and APIs.',
  'No Encryption': 'Encrypt sensitive data at rest and in transit.',
  'No Code Review': 'Regularly review code for security issues, especially in critical systems.',
  'Unknown': 'Review the code for general security best practices. If unsure, consult a security expert.',
  'Parse Error': 'The analysis could not be parsed. Please try again or rephrase your code.',
  'API Error': 'There was an error contacting the AI service. Please try again later.',
  'Config Error': 'The backend is not configured for AI analysis. Please contact the administrator.'
};

const FormAnalyzer = forwardRef((props, ref) => {
  const [formCode, setFormCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [score, setScore] = useState(null);
  const [badges, setBadges] = useState([]);
  const [secureCode, setSecureCode] = useState('');
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormCode('');
      setAnalysisResult('');
      setScore(null);
      setBadges([]);
      setSecureCode('');
    },
    setFormData: (code, analysis, score, badges, secureCodeValue = '', showSecureCode = true) => {
      setFormCode(code || '');
      setAnalysisResult(analysis || '');
      setScore(typeof score === 'number' ? score : 0);
      setBadges(Array.isArray(badges) ? badges : []);
      setSecureCode(secureCodeValue || '');
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult('');
    setScore(0);
    setSecureCode('');
    try {
      const response = await axios.post("http://localhost:8000/api/analyze/", {
        form_code: formCode,
      });
      setScore(response.data.score);
      setAnalysisResult(response.data.analysis_result);
      setBadges(response.data.badges || []);
      setSecureCode(response.data.secure_code || '');
    } catch (error) {
      setScore(0);
      setAnalysisResult("❌ Error analyzing the form.");
      setBadges([]);
      setSecureCode('');
      console.error("Form submission error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Left: Form */}
      <div className="flex-1 min-w-[350px] max-w-[520px]">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="shield">🛡️</span> AI Secure Form Analyzer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={formCode}
            onChange={(e) => setFormCode(e.target.value)}
            placeholder="Paste your form code here"
            rows={10}
            className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-lg bg-gray-50 resize-none transition-all shadow-sm"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2">🔄</span>
            ) : (
              <span role="img" aria-label="search">🔍</span>
            )}
            {loading ? 'Analyzing...' : 'Analyze Form'}
          </button>
        </form>
      </div>
      {/* Right: Result */}
      <div className="flex-1 min-w-[350px] max-w-[800px] flex flex-col justify-start">
        {analysisResult && (
          <div className="p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in max-h-[80vh] overflow-y-auto flex flex-col">
            <h3 className="text-2xl font-extrabold text-purple-700 mb-4 flex items-center gap-2">
              <span role="img" aria-label="result">📊</span> Analysis Result
            </h3>
            <div className="text-gray-800 mb-4 whitespace-pre-line text-lg font-normal">
              {formatSummaryWithBoldHeadings(analysisResult)}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-2 text-xl font-bold text-purple-700 mb-0">
                <span role="img" aria-label="score">🏅</span> Score
              </span>
              <SecurityBadge score={score} />
            </div>
            {badges && badges.length > 0 && (
              <div className="mt-4">
                <span className="flex items-center gap-2 text-xl font-bold text-yellow-700 mb-2">
                  <span role="img" aria-label="badges">🏷️</span> Badges
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {badges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-start">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs border border-yellow-300 shadow mb-1 font-semibold">
                        {badge}
                      </span>
                      {RISK_SOLUTIONS[badge] && (
                        <span className="text-xs text-gray-700 bg-yellow-50 rounded px-2 py-1 mb-2 border border-yellow-200">
                          <strong>How to fix:</strong> {RISK_SOLUTIONS[badge]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {secureCode && (
              <div className="mt-6">
                <h4 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                  <span role="img" aria-label="secure">✅</span> Secure Code Suggestion
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
                    onClick={() => {
                      navigator.clipboard.writeText(secureCode);
                    }}
                  >
                    Copy Code
                  </button>
                  <span className="text-xs text-gray-500">Copy the secure code suggestion</span>
                </div>
                <pre className="bg-gray-900 text-green-100 rounded-lg p-4 overflow-x-auto text-sm">
                  {secureCode}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default FormAnalyzer;

// Helper function to bold summary headings
function formatSummaryWithBoldHeadings(summary) {
  // Bold lines that start with a number and dot, followed by bold or not bold heading
  return summary.split('\n').map((line, idx) => {
    // Bold lines like '1. **Heading**: explanation' or '1. Heading: explanation'
    let numbered = line.match(/^([0-9]+\.\s*)(\*\*([\w\s\-]+)\*\*|[A-Z][\w\s\-]+):(.*)$/);
    if (numbered) {
      let heading = numbered[2].replace(/\*\*/g, '');
      let explanation = numbered[4] || '';
      return <div key={idx}><b>{numbered[1] + heading}</b>:{explanation}</div>;
    }
    // Bold lines like '**Heading**: explanation' or 'Heading: explanation'
    let colonMatch = line.match(/^(\*\*([\w\s\-]+)\*\*|[A-Z][\w\s\-]+):(.*)$/);
    if (colonMatch) {
      let heading = colonMatch[1].replace(/\*\*/g, '');
      let explanation = colonMatch[3] || '';
      return <div key={idx}><b>{heading}</b>:{explanation}</div>;
    }
    return <div key={idx}>{line}</div>;
  });
}
