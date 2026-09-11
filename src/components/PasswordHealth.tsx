import React, { useState } from 'react';
import { Lock, Eye, EyeOff, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { evaluatePassword } from '../utils/localAnalyzer';

interface PasswordHealthProps {
  language: Language;
  onScoreChange: (score: number | null) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const PasswordHealth: React.FC<PasswordHealthProps> = ({
  language,
  onScoreChange,
  showToast,
}) => {
  const t = translations[language];
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const evaluation = evaluatePassword(password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    onScoreChange(val ? evaluatePassword(val).score : null);
  };

  const handleClear = () => {
    setPassword('');
    onScoreChange(null);
    showToast('Password tester cleared.', 'info');
  };

  return (
    <section id="password" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          {/* Left Text */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              {t.passwordEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.passwordTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {t.passwordIntro}
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Private & Safe:
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your password is tested strictly inside your web browser. Nothing is ever sent to any server or saved anywhere.
              </p>
            </div>
          </div>

          {/* Right Interactive Tool Card */}
          <div className="rounded-2xl p-6 sm:p-7 bg-slate-900 border border-slate-800 shadow-xl">
            {/* Warning banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{t.passwordWarning}</span>
            </div>

            {/* Input field */}
            <div className="mt-5">
              <label
                htmlFor="password-test-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
              >
                {t.testPassword}
              </label>

              <div className="relative flex items-center">
                <input
                  id="password-test-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Type a sample password to test..."
                  autoComplete="off"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 pr-20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono tracking-wider"
                />

                <div className="absolute right-2.5 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label={showPassword ? t.hide : t.show}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Strength Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300">{t.strength}</span>
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: evaluation.color }}
                >
                  {evaluation.score} / 100
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: evaluation.fillWidth,
                    backgroundColor: evaluation.color,
                  }}
                />
              </div>
            </div>

            {/* Feedback Rules List */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Password Strength Checklist:
              </h4>
              <ul className="space-y-1.5">
                {evaluation.feedback.map((note, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear Button */}
            <div className="mt-5 pt-3 flex justify-end">
              <button
                type="button"
                id="clear-password-btn"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.clear}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
