import React from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  Mail,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { CyberShield3D } from './CyberShield3D';

interface HeroProps {
  language: Language;
  onNavigateToAnalyze: () => void;
  onNavigateToLearn: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onNavigateToAnalyze,
  onNavigateToLearn,
}) => {
  const t = translations[language];

  const features = [
    {
      icon: Sparkles,
      title: t.f1,
      desc: t.f1d,
      href: '#analyze',
      borderColor: 'border-slate-800 hover:border-blue-500/50',
      iconBg: 'bg-blue-950/60 text-blue-400 border border-blue-800/40',
    },
    {
      icon: Globe,
      title: t.f2,
      desc: t.f2d,
      href: '#analyze',
      borderColor: 'border-slate-800 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
    },
    {
      icon: Mail,
      title: t.f3,
      desc: t.f3d,
      href: '#analyze',
      borderColor: 'border-slate-800 hover:border-sky-500/50',
      iconBg: 'bg-sky-950/60 text-sky-400 border border-sky-800/40',
    },
    {
      icon: Zap,
      title: t.f4,
      desc: t.f4d,
      href: '#quiz',
      borderColor: 'border-slate-800 hover:border-amber-500/50',
      iconBg: 'bg-amber-950/60 text-amber-400 border border-amber-800/40',
    },
    {
      icon: AlertTriangle,
      title: t.f5,
      desc: t.f5d,
      href: '#emergency',
      borderColor: 'border-slate-800 hover:border-rose-500/50',
      iconBg: 'bg-rose-950/60 text-rose-400 border border-rose-800/40',
    },
    {
      icon: BookOpen,
      title: t.f6,
      desc: t.f6d,
      href: '#learn',
      borderColor: 'border-slate-800 hover:border-indigo-500/50',
      iconBg: 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40',
    },
  ];

  return (
    <section id="home" className="relative pt-10 pb-16 overflow-hidden cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          {/* Main Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-wider uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.localDefense}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              CYBERGUARD
              <span className="text-blue-500 block sm:inline sm:ml-3 text-3xl sm:text-5xl font-extrabold text-blue-400">
                DEFENSE
              </span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-200 tracking-tight">
              {t.tagline}
            </p>

            <p className="mt-3 text-base text-slate-300 max-w-xl leading-relaxed">
              {t.heroCopy}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 max-w-lg bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.heroLocal}</span>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onNavigateToAnalyze}
                id="hero-analyze-cta-btn"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {t.analyzeMessage}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToLearn}
                id="hero-learn-cta-btn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                {t.learnSafety}
              </button>
            </div>
          </div>

          {/* Right Status Card with Interactive 3D Cyber Shield */}
          <aside className="relative rounded-2xl p-6 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  {t.statusTitle}
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                3D WebGL Live
              </span>
            </div>

            {/* Interactive 3D Canvas */}
            <div className="my-3 flex flex-col items-center justify-center">
              <CyberShield3D height={280} className="w-full" interactive={true} />
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-slate-300">
                <div dangerouslySetInnerHTML={{ __html: t.metricData }} />
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-slate-300">
                <div dangerouslySetInnerHTML={{ __html: t.metricRules }} />
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-slate-300">
                <div dangerouslySetInnerHTML={{ __html: t.metricInstant }} />
              </div>
            </div>
          </aside>
        </div>

        {/* 6 Grid Feature Cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <a
                key={feat.title}
                href={feat.href}
                className={`group p-5 rounded-xl bg-slate-900/70 border ${feat.borderColor} hover:-translate-y-0.5 transition-all duration-200 block no-underline`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feat.iconBg} mb-3.5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
