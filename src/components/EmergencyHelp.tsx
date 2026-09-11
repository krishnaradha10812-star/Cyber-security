import React, { useState } from 'react';
import {
  AlertTriangle,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import { EmergencyGuide, Language } from '../types';
import { translations } from '../i18n/translations';

interface EmergencyHelpProps {
  language: Language;
}

const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    id: 'link',
    title: 'I clicked a bad or suspicious link',
    iconName: 'Link',
    urgency: 'HIGH',
    steps: [
      'Immediately close the browser tab or turn off Wi-Fi/mobile data if any file started downloading.',
      'Do not enter any passwords, PINs, card numbers, or OTPs on the website.',
      'If you typed an account password on that page, change your password immediately from another safe phone or device.',
      'Open your phone settings or browser settings and clear browsing history and cookies.',
      'Run an antivirus or security scan on your phone or computer.',
    ],
    officialHelplines: ['If you typed your bank password, call your bank customer care immediately.'],
  },
  {
    id: 'otp',
    title: 'I shared an OTP or verification code',
    iconName: 'Key',
    urgency: 'CRITICAL',
    steps: [
      'Call your bank IMMEDIATELY to freeze your bank account, NetBanking, and ATM card.',
      'If the OTP was for WhatsApp or Telegram, log into the app again and remove all linked desktop devices.',
      'Change the password of the account the code was for, as well as your email password.',
      'Check your bank balance and note down any unauthorized transaction reference numbers (UTR numbers).',
      'Dial 1930 immediately to register a cyber fraud case with the police.',
    ],
    officialHelplines: ['National Cybercrime Helpline: Dial 1930 (India)', 'Online Portal: cybercrime.gov.in'],
  },
  {
    id: 'money',
    title: 'I already sent money to a scammer',
    iconName: 'DollarSign',
    urgency: 'CRITICAL',
    steps: [
      'Act in the first 2 hours ("Golden Hours"): Call your bank immediately and ask them to freeze the fraudulent transaction and destination account.',
      'Take screenshots of everything: payment receipts, UPI UTR numbers, chat messages, and scammer phone numbers.',
      'Dial 1930 right away to report the fraud to the cyber police. They can order banks to freeze the scammer’s account.',
      'Submit a written dispute form at your local bank branch along with the police complaint acknowledgment.',
      'Never pay anyone claiming to be a "hacker who can recover your money" — they are secondary scammers.',
    ],
    officialHelplines: ['National Cybercrime Helpline: 1930 (India)', 'Report portal: cybercrime.gov.in'],
  },
  {
    id: 'social',
    title: 'My Instagram or WhatsApp was hacked',
    iconName: 'UserX',
    urgency: 'HIGH',
    steps: [
      'Tell your family and close friends via a normal phone call NOT to send money or click links sent from your profile.',
      'Use the official account recovery page on Instagram (instagram.com/hacked) or WhatsApp support.',
      'Log out all linked computers and active sessions in your security settings.',
      'Change the password of your linked email address and turn on 2-Factor Authentication (authenticator app).',
      'If you cannot recover the account, report the impersonated account with official ID proof.',
    ],
    officialHelplines: ['Instagram: instagram.com/hacked', 'WhatsApp: Support inside app settings'],
  },
  {
    id: 'download',
    title: 'I installed a strange app or APK file',
    iconName: 'Download',
    urgency: 'CRITICAL',
    steps: [
      'Turn on Airplane Mode immediately to stop the app from sending your messages or photos to the scammer.',
      'Do not open any bank apps or UPI apps while your phone is in this state.',
      'Go to Phone Settings > Apps and uninstall the app (or remote screen-sharing apps like AnyDesk/RustDesk).',
      'Go to Settings > Security > Device Admin Apps and remove admin permissions from unknown apps.',
      'Restart your phone in Safe Mode to delete persistent malware. If in doubt, backup your photos and do a Factory Reset.',
    ],
    officialHelplines: ['Hold power button, then long-press "Power Off" on screen to boot Android in Safe Mode.'],
  },
  {
    id: 'bank',
    title: 'My ATM card or NetBanking details were leaked',
    iconName: 'CreditCard',
    urgency: 'CRITICAL',
    steps: [
      'Open your bank mobile app or call your bank hotline to block the ATM card immediately.',
      'Turn off international transactions and set online e-commerce limits to 0.',
      'Change your NetBanking password, transaction password, and UPI PIN.',
      'Request a new replacement ATM card with a brand-new 16-digit card number and CVV.',
      'Check your SMS alerts daily for any small unexpected test charges.',
    ],
    officialHelplines: ['Call the official 24x7 emergency card blocking phone number printed on the back of your card.'],
  },
];

export const EmergencyHelp: React.FC<EmergencyHelpProps> = ({ language }) => {
  const t = translations[language];
  const [activeGuide, setActiveGuide] = useState<EmergencyGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepIndex: number) => {
    if (!activeGuide) return;
    const key = `${activeGuide.id}-${stepIndex}`;
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="emergency" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t.emergencyEyebrow}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.emergencyTitle}
          </h2>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {t.emergencyIntro}
          </p>
        </div>

        {/* Emergency Cards Grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_GUIDES.map((guide) => (
            <button
              key={guide.id}
              type="button"
              onClick={() => setActiveGuide(guide)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-left shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {guide.urgency}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  {guide.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-rose-400 font-semibold">View Steps</span>
                <span>{guide.steps.length} Steps Checklist</span>
              </div>
            </button>
          ))}
        </div>

        {/* Official Helpline Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <strong className="block text-white font-bold text-sm">
                National Cyber Crime Helpline: Dial 1930
              </strong>
              <span className="text-slate-400 text-xs">{t.indiaNote}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 inline-flex items-center gap-1.5 transition-all no-underline"
            >
              cybercrime.gov.in
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Modal Triage Dialog */}
      {activeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {activeGuide.urgency} EMERGENCY CHECKLIST
                </span>
                <h3 className="mt-1.5 text-lg sm:text-xl font-extrabold text-white">
                  {activeGuide.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist */}
            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Follow these steps in order:
              </p>
              {activeGuide.steps.map((step, idx) => {
                const key = `${activeGuide.id}-${idx}`;
                const isChecked = !!completedSteps[key];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through opacity-75' : ''}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Helpline reference */}
            {activeGuide.officialHelplines && activeGuide.officialHelplines.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <strong className="block font-bold text-white">Emergency Reference:</strong>
                {activeGuide.officialHelplines.map((line, idx) => (
                  <div key={idx}>• {line}</div>
                ))}
              </div>
            )}

            {/* Done button */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
