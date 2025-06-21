import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Dummy login: just set a flag in localStorage
    if (username && password) {
      localStorage.setItem('sf_logged_in', '1');
      navigate('/analyzer');
    } else {
      setError('Please enter username and password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Login</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" className="w-full p-3 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="w-full p-3 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full py-3 bg-indigo-500 text-white font-bold rounded hover:bg-indigo-600">Login</button>
        </form>
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <button className="text-indigo-600 font-semibold" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
