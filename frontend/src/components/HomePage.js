import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TRIAL_LIMIT = 3;

function HomePage() {
  const [trialsLeft, setTrialsLeft] = useState(TRIAL_LIMIT);
  const navigate = useNavigate();

  useEffect(() => {
    const used = parseInt(localStorage.getItem('sf_trials') || '0', 10);
    setTrialsLeft(Math.max(0, TRIAL_LIMIT - used));
  }, []);

  const handleAnalyzeClick = () => {
    if (trialsLeft > 0) {
      localStorage.setItem('sf_trials', String(TRIAL_LIMIT - (trialsLeft - 1)));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top right: Auth buttons */}
      <div className="flex justify-end p-6">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold mr-4 hover:bg-indigo-600" onClick={() => navigate('/signup')}>Sign Up</button>
        <button className="bg-white text-indigo-600 border border-indigo-500 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50" onClick={() => navigate('/login')}>Login</button>
      </div>
      {/* Centered welcome text */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">Welcome to AI Secure Form Analyzer</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">Analyze your code for security risks and get instant AI-powered recommendations. Try it free for 3 analyses—sign up to unlock unlimited access!</p>
        {trialsLeft > 0 ? (
          <>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-lg" onClick={handleAnalyzeClick}>
              Start Free Analysis ({trialsLeft} left)
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">You have used all your free trials.</p>
            <button className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-600 transition-all text-lg" onClick={() => navigate('/signup')}>
              Sign Up to Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
