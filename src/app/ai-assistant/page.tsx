'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function AIAssistantPage() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const sampleQuestions = [
    'Should I water my tomato crop now?',
    'Will the expected rain today affect my paddy field?',
    'What soil moisture percentage is best for flowering stage in red soil?',
    'How do I prevent root rot during heavy watering?',
  ];

  const handleAsk = async (queryText?: string) => {
    const targetQuery = queryText || prompt;
    if (!targetQuery.trim()) return;

    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: targetQuery }),
      });

      const data = await res.json();
      if (data.success) {
        setChatHistory((prev) => [
          ...prev,
          {
            query: targetQuery,
            response: data.aiResponse,
            context: data.context,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold">JALAMITRA AI FARM ASSISTANT</h1>
          </div>
          <p className="text-xs text-emerald-200">
            Real agricultural reasoning engine grounded on live soil sensors, growth stages, and weather forecasts.
          </p>
        </div>

        <span className="hidden sm:inline-block bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
          Gemini 1.5 Flash Powered
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700">Frequently Asked Farmer Questions:</span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition text-left"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Messages */}
      <div className="space-y-4">
        {chatHistory.map((item, idx) => {
          const res = item.response;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-md space-y-4">
              {/* Farmer Query */}
              <div className="bg-slate-50 p-3 rounded-lg border text-xs font-bold text-slate-900">
                🗣 Farmer: "{item.query}"
              </div>

              {/* Response Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-950 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-amber-500" />
                    AI Agricultural Recommendation
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Confidence: {Math.round(res.confidence * 100)}%
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 leading-relaxed bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                  {res.recommendation}
                </p>

                <div className="bg-slate-50 p-3 rounded-lg border text-xs space-y-1">
                  <span className="font-bold text-slate-800">Agricultural Rationale:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{res.rationale}</p>
                </div>

                {/* Suggested Action Badge */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-bold">Suggested Action:</span>
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded">
                    {res.suggestedAction}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-lg flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder={t.aiPlaceholder}
          className="flex-1 text-xs text-slate-900 font-medium px-3 py-2.5 focus:outline-none"
        />
        <button
          disabled={loading || !prompt.trim()}
          onClick={() => handleAsk()}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-1"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Ask</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-500 text-center">
        ℹ Disclaimer: JALAMITRA AI provides agricultural recommendations based on sensor data and agronomic standards. For severe crop pests or disease outbreaks, verify with local KVK agricultural officers.
      </p>
    </div>
  );
}
