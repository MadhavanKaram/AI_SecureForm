import React from 'react';

const SecurityBadge = ({ score }) => {
  let level = '❓ Unknown';
  let color = 'gray';
  let bg = 'bg-gray-200';
  let text = 'text-gray-800';

  if (score >= 80) {
    level = '✅ Excellent';
    color = 'green';
    bg = 'bg-green-100';
    text = 'text-green-800';
  } else if (score >= 60) {
    level = '🟡 Moderate';
    color = 'yellow';
    bg = 'bg-yellow-100';
    text = 'text-yellow-800';
  } else if (score >= 40) {
    level = '🟠 Risky';
    color = 'orange';
    bg = 'bg-orange-100';
    text = 'text-orange-800';
  } else if (score !== null) {
    level = '🔴 Unsafe';
    color = 'red';
    bg = 'bg-red-100';
    text = 'text-red-800';
  }

  return (
    <div className={`inline-block px-5 py-3 rounded-full shadow-lg border-2 border-${color}-300 ${bg} ${text} font-semibold text-lg transition-all`}>
      <span className="mr-2">{level}</span>
      <span className="font-mono">{score !== null ? `${score} / 100` : '--'}</span>
    </div>
  );
};

export default SecurityBadge;
