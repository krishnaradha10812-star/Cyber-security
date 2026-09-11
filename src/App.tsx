import React, { useState } from 'react';
import { Language, AnalysisResult, ActivityItem, AnalyzerTab } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Analyzer } from './components/Analyzer';
import { SecuritySnapshot } from './components/SecuritySnapshot';
import { PasswordHealth } from './components/PasswordHealth';
import { CyberQuiz } from './components/CyberQuiz';
import { LearningCenter } from './components/LearningCenter';
import { EmergencyHelp } from './components/EmergencyHelp';
import { AboutPrivacy } from './components/AboutPrivacy';
import { Footer } from './components/Footer';

interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error';
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Scores for Security Snapshot
  const [latestLinkScore, setLatestLinkScore] = useState<number | null>(null);
  const [latestMessageScore, setLatestMessageScore] = useState<number | null>(null);
  const [latestPasswordScore, setLatestPasswordScore] = useState<number | null>(null);

  // Session activity
  const [activityList, setActivityList] = useState<ActivityItem[]>([]);

  const showToast = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleAnalysisComplete = (
    result: AnalysisResult,
    type: AnalyzerTab,
    title: string
  ) => {
    if (type === 'url') {
      setLatestLinkScore(result.score);
    } else {
      setLatestMessageScore(result.score);
    }

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newItem: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeString,
      type: type.toUpperCase(),
      title: title || `${type} check`,
      score: result.score,
      level: result.level,
    };

    setActivityList((prev) => [newItem, ...prev].slice(0, 12));
  };

  const handleQuizCompleted = (score: number) => {
    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newItem: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeString,
      type: 'CYBER IQ',
      title: `Score: ${score}/100`,
      score,
      level: score >= 70 ? 'LOW RISK' : score >= 50 ? 'SUSPICIOUS' : 'HIGH RISK',
    };

    setActivityList((prev) => [newItem, ...prev].slice(0, 12));
  };

  const handleClearActivity = () => {
    setActivityList([]);
    showToast('Activity history cleared.', 'info');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['DM_Sans',sans-serif] selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onQuickAnalyze={() => scrollToSection('analyze')}
      />

      {/* Hero Section */}
      <Hero
        language={language}
        onNavigateToAnalyze={() => scrollToSection('analyze')}
        onNavigateToLearn={() => scrollToSection('learn')}
      />

      {/* Threat Analyzer Workspace */}
      <Analyzer
        language={language}
        onAnalysisComplete={handleAnalysisComplete}
        showToast={showToast}
      />

      {/* Real-Time Security Snapshot & Activity */}
      <SecuritySnapshot
        language={language}
        latestLinkScore={latestLinkScore}
        latestMessageScore={latestMessageScore}
        latestPasswordScore={latestPasswordScore}
        activityList={activityList}
        onClearHistory={handleClearActivity}
      />

      {/* Private Password Resilience Health Checker */}
      <PasswordHealth
        language={language}
        onScoreChange={setLatestPasswordScore}
        showToast={showToast}
      />

      {/* Interactive Cyber IQ Quiz */}
      <CyberQuiz
        language={language}
        onQuizCompleted={handleQuizCompleted}
        showToast={showToast}
      />

      {/* Cyber Safety Learning Center & FAQs */}
      <LearningCenter language={language} />

      {/* Emergency Incident Response Playbook */}
      <EmergencyHelp language={language} />

      {/* About & Privacy Pledge */}
      <AboutPrivacy language={language} />

      {/* Footer */}
      <Footer language={language} />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border text-xs font-semibold shadow-xl transition-all duration-300 ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </div>
  );
}
