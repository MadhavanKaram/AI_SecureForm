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
    <div className="max-w-8xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in flex flex-col md:flex-row gap-8 min-h-[80vh]">
      <div className="flex-1 flex flex-col justify-start">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 flex items-center justify-center gap-2">
          <span role="img" aria-label="history">📜</span> Submission History
        </h1>
        <div className="p-2 bg-gray-50 rounded-xl shadow-inner border border-indigo-100 animate-fade-in max-h-[80vh] overflow-y-auto">
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">No submissions found.</p>
          ) : (
            <div className="space-y-6">
              {submissions.map((item) => (
                <div key={item.id} className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow border border-indigo-100 hover:shadow-lg transition-all">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h2>
                  <p className="text-xs text-gray-500 mb-2">Submitted on: {new Date(item.created_at).toLocaleString()}</p>
                  <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap border border-gray-200 mb-2">{item.analysis_result}</pre>

                  {item.score !== null && (
                    <p className="mt-2 font-medium text-green-700">🧠 Score: {item.score} / 100</p>
                  )}

                  {item.badges?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.badges.map((badge, i) => (
                        <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs border border-yellow-300 shadow">
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
      </div>
    </div>
  );
}

export default HistoryPage;
