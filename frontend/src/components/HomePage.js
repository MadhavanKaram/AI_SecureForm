import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleAnalyzerClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top right: Auth buttons */}
      <div className="flex justify-end p-6">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold mr-4 hover:bg-indigo-600" onClick={() => navigate('/signup')}>Sign Up</button>
        <button className="bg-white text-indigo-600 border border-indigo-500 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50" onClick={() => navigate('/login')}>Login</button>
      </div>
      {/* Centered welcome text with background layout */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl border border-gray-200 p-12 max-w-3xl w-full mx-8 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">Welcome to AI Secure Form Analyzer</h1>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">Analyze your code for security risks and get instant AI-powered recommendations.</p>
          <button type="button" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-lg" onClick={handleAnalyzerClick}>
            Go to Analyzer
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
