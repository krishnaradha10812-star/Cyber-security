import React from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AboutPrivacyProps {
  language: Language;
}

export const AboutPrivacy: React.FC<AboutPrivacyProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section id="about" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: About */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              {t.aboutEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.aboutTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {t.aboutCopy}
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sharp Scam Detection Rules</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Spots fake electricity bill disconnection threats, digital arrest police calls, UPI cashback traps, and look-alike bank links.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Private In-Browser Protection</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Designed to protect your privacy. Your messages, passwords, and links stay safe on your device and are never sold or stored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Privacy & Disclaimer */}
          <div className="space-y-4">
            {/* Privacy Card */}
            <div
              id="privacy"
              className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-md"
            >
              <h3 className="text-base font-bold text-blue-400 flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                {t.privacy}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.privacyNotice}
              </p>

              <div className="mt-3.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 leading-relaxed">
                <strong className="font-bold text-amber-300 block mb-0.5">
                  Rule of Cyber Safety:
                </strong>
                {t.personalWarning}
              </div>
            </div>

            {/* Disclaimer Card */}
            <div
              id="disclaimer"
              className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-md"
            >
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {t.disclaimer}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.disclaimerCopy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
