import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                CYBERGUARD <span className="text-blue-400">DEFENSE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.footerLine}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              {t.privacy}
            </a>
            <a href="#disclaimer" className="hover:text-white transition-colors">
              {t.disclaimer}
            </a>
            <a href="#learn" className="hover:text-white transition-colors">
              {t.safetyTips}
            </a>
            <a href="#emergency" className="hover:text-rose-400 transition-colors">
              {t.navEmergency}
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
