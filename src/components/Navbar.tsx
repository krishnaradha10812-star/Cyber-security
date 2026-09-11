import React, { useState } from 'react';
import { Shield, Menu, X, Zap } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onQuickAnalyze: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onQuickAnalyze,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navLinks = [
    { label: t.navHome, href: '#home' },
    { label: t.navAnalyze, href: '#analyze' },
    { label: t.navQuiz, href: '#quiz' },
    { label: t.navPassword, href: '#password' },
    { label: t.navLearn, href: '#learn' },
    { label: t.navEmergency, href: '#emergency' },
    { label: t.navAbout, href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a
            href="#home"
            id="brand-logo-link"
            className="flex items-center gap-3 no-underline group"
            aria-label="CyberGuard Defense"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-base text-white">CYBERGUARD</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400">
                  3D CORE
                </span>
              </div>
              <span className="block text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                {t.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              >
                {link.label}
              </a>
            ))}

            {/* Language Selector */}
            <div className="relative inline-block ml-1">
              <select
                id="navbar-language-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500 hover:border-slate-600"
                aria-label="Change Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>

            {/* Quick Analyze CTA */}
            <button
              onClick={onQuickAnalyze}
              id="nav-quick-analyze-btn"
              className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              {t.analyzeNow}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-700 rounded-lg px-2 py-1.5 cursor-pointer"
              aria-label="Select Language Mobile"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="hinglish">HIN</option>
            </select>
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-1.5 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onQuickAnalyze();
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500"
          >
            <Zap className="w-4 h-4" />
            {t.analyzeNow}
          </button>
        </div>
      )}
    </header>
  );
};
