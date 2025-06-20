import React, { useEffect, useState } from 'react';

function HistoryPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/history/')
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(err => {
        console.error('Error fetching history:', err);
        alert('Failed to load history.');
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-700">📜 Submission History</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-600 text-center">No submissions found.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded shadow border">
              <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-2">Submitted on: {new Date(item.created_at).toLocaleString()}</p>
              <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap border">{item.analysis_result}</pre>

              {item.score !== null && (
                <p className="mt-2 font-medium text-green-700">🧠 Score: {item.score} / 100</p>
              )}

              {item.badges?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.badges.map((badge, i) => (
                    <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs border border-yellow-300">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
