import React from 'react';
import { ActivityItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { Shield, Clock, Trash2, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SecuritySnapshotProps {
  language: Language;
  latestLinkScore: number | null;
  latestMessageScore: number | null;
  latestPasswordScore: number | null;
  activityList: ActivityItem[];
  onClearHistory: () => void;
}

export const SecuritySnapshot: React.FC<SecuritySnapshotProps> = ({
  language,
  latestLinkScore,
  latestMessageScore,
  latestPasswordScore,
  activityList,
  onClearHistory,
}) => {
  const t = translations[language];

  const renderBadge = (level: string) => {
    if (level === 'HIGH RISK') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <ShieldAlert className="w-3 h-3" />
          High Risk
        </span>
      );
    }
    if (level === 'SUSPICIOUS') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          Suspicious
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        Safe
      </span>
    );
  };

  return (
    <section className="py-10 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
          {/* Security Snapshot Cards */}
          <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                {t.snapshot}
              </h3>
              <span className="text-xs text-slate-400">
                {t.sessionOnly}
              </span>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3.5">
              {/* Link Safety */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {t.linkSafety}
                  </span>
                  {latestLinkScore !== null && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        latestLinkScore >= 60
                          ? 'text-rose-400'
                          : latestLinkScore >= 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {latestLinkScore}/100
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {latestLinkScore !== null
                    ? `Latest link check scored ${latestLinkScore}/100.`
                    : t.emptySnapshot}
                </p>
              </div>

              {/* Message Safety */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {t.messageSafety}
                  </span>
                  {latestMessageScore !== null && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        latestMessageScore >= 60
                          ? 'text-rose-400'
                          : latestMessageScore >= 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {latestMessageScore}/100
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {latestMessageScore !== null
                    ? `Latest message scored ${latestMessageScore}/100 threat probability.`
                    : t.emptySnapshot}
                </p>
              </div>

              {/* Password Health */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {t.passwordHealth}
                  </span>
                  {latestPasswordScore !== null && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        latestPasswordScore >= 80
                          ? 'text-emerald-400'
                          : latestPasswordScore >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {latestPasswordScore}/100
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {latestPasswordScore !== null
                    ? `Password strength score: ${latestPasswordScore}/100.`
                    : t.emptySnapshot}
                </p>
              </div>

              {/* Privacy Mode */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.privacyMode}
                </span>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {t.privacySnapshot}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {t.activity}
                </h3>
                {activityList.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    id="clear-activity-history-btn"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.clearHistory}
                  </button>
                )}
              </div>

              <div className="mt-3.5 max-h-64 overflow-y-auto space-y-2 pr-1">
                {activityList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    {t.noActivity}
                  </p>
                ) : (
                  activityList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-200 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.timestamp} · {item.type}
                        </span>
                      </div>
                      <div className="shrink-0">{renderBadge(item.level)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
