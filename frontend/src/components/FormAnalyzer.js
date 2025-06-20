import React, { useState, useImperativeHandle, forwardRef } from 'react';
import SecurityBadge from './SecurityBadge';
import axios from 'axios';

const RISK_SOLUTIONS = {
  'XSS Risk': 'Add input validation and output encoding to prevent XSS attacks.',
  'No CSRF': 'Implement CSRF tokens in your forms to protect against CSRF attacks.',
  'SQL Risk': 'Use parameterized queries and ORM methods to prevent SQL injection.',
  // Add more mappings as needed
};

const FormAnalyzer = forwardRef((props, ref) => {
  const [formCode, setFormCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [score, setScore] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormCode('');
      setAnalysisResult('');
      setScore(null);
      setBadges([]);
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult('');
    setScore(0);
    try {
      const response = await axios.post("http://localhost:8000/api/analyze/", {
        form_code: formCode,
      });
      setScore(response.data.score);
      setAnalysisResult(response.data.analysis_result);
      setBadges(response.data.badges || []);
    } catch (error) {
      setScore(0);
      setAnalysisResult("❌ Error analyzing the form.");
      setBadges([]);
      console.error("Form submission error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Left: Form */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="shield">🛡️</span> AI Form Security Analyzer
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
      <div className="flex-1 flex flex-col justify-start">
        {analysisResult && (
          <div className="p-6 bg-gray-50 rounded-xl shadow-inner border border-indigo-100 animate-fade-in">
            <h3 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <span role="img" aria-label="result">📊</span> Analysis Result
            </h3>
            <p className="text-gray-800 mb-4 whitespace-pre-line">{analysisResult}</p>
            <SecurityBadge score={score} />
            {badges && badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-start">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs border border-yellow-300 shadow mb-1">
                      {badge}
                    </span>
                    {RISK_SOLUTIONS[badge] && (
                      <span className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 mb-2 border border-gray-200">
                        <strong>Solution:</strong> {RISK_SOLUTIONS[badge]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default FormAnalyzer;
