// src/components/SearchOverlay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

function SearchOverlay({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Always fetch results, even if query is empty (backend will return recent forms)
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/search/?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        alert('Failed to load search results.');
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-20">
      <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-lg shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-white border-none outline-none w-full placeholder-gray-400"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4">
          {results.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No results found</div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center gap-3 text-white py-2 px-4 hover:bg-gray-700 rounded cursor-pointer border-b border-gray-800 last:border-b-0"
                onClick={() => onSelect(item)}
              >
                <div className="font-bold text-indigo-300">
                  {item.title || 'Untitled Submission'}
                </div>
                <div className="text-xs text-gray-400 ml-2 italic">
                  {item.form_code && item.form_code.length < 40 ? item.form_code : (item.form_code ? item.form_code.slice(0, 40) + '...' : '')}
                </div>
                <div className="text-sm text-gray-400 ml-auto">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
/*
Example usage of rendering a results array, showing either "No results found" or mapping over results.
Make sure to replace 'results' with your actual data if needed.
*/
