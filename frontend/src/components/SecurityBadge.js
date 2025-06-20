import React from 'react';

const SecurityBadge = ({ score }) => {
  let level = '❓ Unknown';
  let color = 'gray';

  if (score >= 80) {
    level = '✅ Excellent';
    color = 'green';
  } else if (score >= 60) {
    level = '🟡 Moderate';
    color = 'yellow';
  } else if (score >= 40) {
    level = '🟠 Risky';
    color = 'orange';
  } else {
    level = '🔴 Unsafe';
    color = 'red';
  }

  return (
    <div className={`p-3 rounded shadow bg-${color}-100 text-${color}-800`}>
      <strong>Security Score:</strong> {score} / 100 — {level}
    </div>
  );
};

export default SecurityBadge;
