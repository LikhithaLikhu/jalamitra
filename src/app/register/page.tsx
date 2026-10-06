'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Lock, Globe, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Mandya');
  const [village, setVillage] = useState('Srirangapatna');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          mobile,
          email,
          password,
          language,
          state,
          district,
          village,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Automatically start Farm Setup Wizard as requested
        router.push('/setup-wizard');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 bg-white p-6 sm:p-8 rounded-2xl border border-emerald-200 shadow-xl space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Farmer Registration</h1>
        <p className="text-xs text-slate-600">Register to create and manage your farm with JALAMITRA</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs font-bold border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Gowda"
              className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@jalamitra.in"
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Language</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Village/Town</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-lg text-xs shadow-md transition flex items-center justify-center space-x-1"
        >
          <span>{loading ? 'Creating Account...' : 'Register & Start Farm Setup Wizard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-emerald-700 hover:underline">
          Login here
        </Link>
      </div>
    </div>
  );
}
