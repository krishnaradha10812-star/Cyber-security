import React, { useState } from 'react';
import { BookOpen, ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Language, LearnTopic } from '../types';
import { translations } from '../i18n/translations';

interface LearningCenterProps {
  language: Language;
}

const TOPICS: LearnTopic[] = [
  {
    id: 'phishing',
    title: 'Fake Messages & Emails (Phishing)',
    tag: 'Email & SMS',
    description: 'Fake emails or messages pretending to be your bank, courier, or boss to steal your passwords or card numbers.',
    warningSigns: 'Rude or panic deadlines ("Account blocked in 2 hours"), weird spelling in website links (like "netfIix-help.top"), and asking you to verify passwords.',
    safetyHabits: 'Never click links inside unexpected messages. Always open your official app or go to the website by typing the address yourself.',
  },
  {
    id: 'otp-scams',
    title: 'OTP & Verification Code Theft',
    tag: 'Bank Security',
    description: 'Callers pretending to be bank officers, courier staff, or tech support asking for the 6-digit code sent to your phone.',
    warningSigns: 'Anyone on a call saying: "Read me the OTP so I can cancel a fake charge or update your KYC."',
    safetyHabits: 'Remember: Real bank employees never ask for your OTP. An OTP is like the key to your bank locker — never tell it to anyone.',
  },
  {
    id: 'upi-fraud',
    title: 'UPI & QR Code Cashback Tricks',
    tag: 'UPI Payments',
    description: 'Scammers sending payment requests or QR codes, telling you that scanning or typing your PIN will give you prize or refund money.',
    warningSigns: 'Anyone asking you to scan a QR code or enter your UPI PIN to "receive" money.',
    safetyHabits: 'The Golden Rule of UPI: You ONLY enter your UPI PIN to SEND money. Receiving money NEVER requires any PIN.',
  },
  {
    id: 'digital-arrest',
    title: 'Fake Police "Digital Arrest" Scams',
    tag: 'Phone Threats',
    description: 'Scammers calling on WhatsApp video pretending to be Mumbai/Delhi Police or CBI, claiming illegal drugs were sent in your name.',
    warningSigns: 'Scammers in fake police uniforms on video calls ordering you to stay on call and transfer "bail money" to verify your innocence.',
    safetyHabits: 'Indian police, CBI, or judges NEVER arrest people over video calls or demand money transfers. Cut the call and dial 1930 immediately.',
  },
  {
    id: 'electricity-scam',
    title: 'Fake Electricity Disconnection Alerts',
    tag: 'Utility Scam',
    description: 'SMS messages warning your electricity will be disconnected tonight at 9:30 PM unless you call a mobile number right away.',
    warningSigns: 'Messages sent from 10-digit mobile numbers with immediate same-night cut-off threats.',
    safetyHabits: 'Electricity boards follow formal monthly bills and never disconnect power without legal written notice. Pay only via official electricity board apps.',
  },
  {
    id: 'fake-jobs',
    title: 'Work-From-Home & YouTube Like Scams',
    tag: 'Job Fraud',
    description: 'Messages on Telegram or WhatsApp offering Rs 3,000–5,000 daily for liking YouTube videos or giving hotel reviews.',
    warningSigns: 'Jobs without interviews that start paying small bonuses, but soon demand you pay thousands to "unlock" your salary.',
    safetyHabits: 'Real employers never ask candidates to pay money to get a job or withdraw earnings.',
  },
  {
    id: 'crypto-schemes',
    title: 'Fake Investment & Trading Groups',
    tag: 'Investment',
    description: 'WhatsApp groups promising 200% guaranteed monthly profits on crypto, forex, or stock tips.',
    warningSigns: 'Guaranteed risk-free high profits and apps that show huge fake balances but refuse to let you withdraw without paying high "taxes".',
    safetyHabits: 'Only invest through registered banks and licensed brokers. Never invest money based on stranger tips in WhatsApp groups.',
  },
  {
    id: 'remote-access',
    title: 'Screen Sharing Apps (AnyDesk / RustDesk)',
    tag: 'Mobile Fraud',
    description: 'Fake customer service callers asking you to install apps like AnyDesk, TeamViewer, or RustDesk to solve an issue.',
    warningSigns: 'Anyone telling you to install an app from Play Store and read out a 9-digit code during a phone call.',
    safetyHabits: 'These apps allow callers to see your screen and control your phone. Never install them at the request of anyone on the phone.',
  },
  {
    id: 'passwords',
    title: 'Strong Password Habits',
    tag: 'Basic Habits',
    description: 'Using simple passwords or using the exact same password on every website makes you easy to hack.',
    warningSigns: 'Passwords like "password123", names of family members, or birthdays.',
    safetyHabits: 'Use long passwords made of 3 to 4 random words (like "blue-mango-guitar-98"). Use different passwords for your email and bank.',
  },
];

const FAQS = [
  {
    q: 'How does CyberGuard check for scams?',
    a: 'CyberGuard checks for known manipulation patterns: fake deadlines (like "power cut tonight"), threats of police arrest, fake bank links, and requests for UPI PINs or OTPs. Everything runs right in your browser session.',
  },
  {
    q: 'Are my messages or links sent to any server?',
    a: 'No. In local mode, everything is analyzed right on your device. Your text and links are never saved or shared with anyone.',
  },
  {
    q: 'Can any tool guarantee 100% safety?',
    a: 'No tool can be 100% certain because scammers create new tricks every day. CyberGuard gives you a clear second opinion and points out red flags so you can protect yourself before sending money.',
  },
  {
    q: 'What should I do if I already clicked a bad link?',
    a: 'Close the page right away. Do not enter any passwords or OTPs. If you already entered bank details or sent money, call your bank immediately to freeze your account and dial 1930 to report cyber fraud.',
  },
];

export const LearningCenter: React.FC<LearningCenterProps> = ({ language }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [openTopic, setOpenTopic] = useState<string | null>('phishing');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTopics = TOPICS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="learn" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {t.learnEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.learnTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
              {t.learnIntro}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scams or safety rules..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => {
            const isOpen = openTopic === topic.id;
            return (
              <div
                key={topic.id}
                className="rounded-2xl p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                      {topic.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3.5">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <span>{isOpen ? 'Close Details' : 'Warning Signs & Safe Habits'}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                      <div>
                        <strong className="text-amber-400 font-bold block mb-0.5">
                          ⚠️ Red Flag Warnings:
                        </strong>
                        <p className="text-slate-400">{topic.warningSigns}</p>
                      </div>
                      <div className="mt-2">
                        <strong className="text-emerald-400 font-bold block mb-0.5">
                          🛡️ How to Stay Safe:
                        </strong>
                        <p className="text-slate-400">{topic.safetyHabits}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              {t.faq}
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-200 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
