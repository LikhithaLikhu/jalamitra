'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Droplets, Lock, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('farmer@jalamitra.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(data.error || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl border border-emerald-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
          <Droplets className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t.appName} {t.navLogin}</h1>
        <p className="text-xs text-slate-600">Enter your registered Email or Mobile Number</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs font-bold border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. farmer@jalamitra.in or 9876543210"
              className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-lg text-xs shadow-md transition flex items-center justify-center space-x-1"
        >
          <span>{loading ? 'Logging in...' : 'Login to Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="bg-slate-50 p-3 rounded border text-[11px] text-slate-600 space-y-1">
        <div className="font-bold text-slate-800">Demo Login Credentials:</div>
        <div>Email: <span className="font-mono font-bold text-emerald-800">farmer@jalamitra.in</span></div>
        <div>Password: <span className="font-mono font-bold text-emerald-800">password123</span></div>
      </div>

      <div className="text-center text-xs text-slate-600">
        Don't have an account?{' '}
        <Link href="/register" className="font-bold text-emerald-700 hover:underline">
          Register New Farm
        </Link>
      </div>
    </div>
  );
}
