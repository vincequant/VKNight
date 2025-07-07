'use client';

import { useState } from 'react';
import { MagicalParticles } from '@/app/components/MagicalParticles';

interface AdminAuthProps {
  onAuthenticate: () => void;
}

export default function AdminAuth({ onAuthenticate }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    try {
      // In production, this should validate against a secure backend
      // For now, we'll use an environment variable
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
      
      if (password === adminPassword) {
        // Store a token to maintain session
        const token = btoa(password + Date.now());
        localStorage.setItem('adminAuthToken', token);
        onAuthenticate();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      <MagicalParticles />
      
      <div className="bg-gray-800/90 backdrop-blur p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Access</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600 rounded-md p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isChecking}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isChecking ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>This area is for authorized administrators only.</p>
        </div>
      </div>
    </div>
  );
}