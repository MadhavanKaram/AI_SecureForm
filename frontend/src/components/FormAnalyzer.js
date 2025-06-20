import React, { useState, useImperativeHandle, forwardRef } from 'react';
import SecurityBadge from './SecurityBadge';

const FormAnalyzer = forwardRef((props, ref) => {
  const [formCode, setFormCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [score, setScore] = useState(null);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormCode('');
      setAnalysisResult('');
      setScore(null);
    },
  }));

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formCode.trim()) return;

  try {
    const response = await fetch('http://localhost:8000/api/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Chat', // You can replace this with dynamic title if needed
        form_code: formCode,
      }),
    });

    const data = await response.json();

    setAnalysisResult(data.analysis_result || 'No result returned.');
    setScore(data.score || 0);
  } catch (error) {
    setAnalysisResult('❌ Error analyzing the form.');
    setScore(0);
    console.error('Form submission error:', error);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <textarea
      value={formCode}
      onChange={(e) => setFormCode(e.target.value)}
      placeholder="Paste your form code here"
      rows={10}
      cols={50}
    />
    <br />
    <button type="submit">Analyze Form</button>
    {analysisResult && (
      <div>
        <h3>Analysis Result:</h3>
        <p>{analysisResult}</p>
        <SecurityBadge score={score} />
      </div>
    )}
  </form>
);

});

export default FormAnalyzer;
