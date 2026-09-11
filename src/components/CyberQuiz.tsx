import React, { useState } from 'react';
import { QuizQuestion, Language } from '../types';
import { translations } from '../i18n/translations';
import { ShieldCheck, CheckCircle2, RotateCcw, Trophy, ArrowRight, ShieldAlert } from 'lucide-react';

interface CyberQuizProps {
  language: Language;
  onQuizCompleted: (score: number) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const QUIZ_DATA: QuizQuestion[] = [
  {
    question: "Your bank sends an urgent SMS: 'Your NetBanking is blocked today due to expired KYC. Click this link immediately to verify your PAN card.'",
    answer: 'SCAM',
    explanation: 'Banks never threaten immediate same-day account closure via SMS links. Real KYC updates are handled inside the official bank app or at the branch.',
  },
  {
    question: "A stranger sends you a QR code on WhatsApp: 'Scan this code and enter your UPI PIN to claim your Rs 2,500 cashback.'",
    answer: 'SCAM',
    explanation: 'Entering your UPI PIN or scanning a QR code ALWAYS sends money OUT of your bank account. You never enter a PIN to receive money.',
  },
  {
    question: "You just tried to log into your Gmail on a new laptop. You receive an SMS from Google with a 6-digit code saying: 'Your code is 492104. Never share this with anyone.'",
    answer: 'SAFE',
    explanation: 'This is a genuine Two-Factor Authentication (2FA) code requested directly by your login action. Notice it warns you never to share the code.',
  },
  {
    question: "Someone on Telegram offers a job paying Rs 5,000/day for liking YouTube videos, but asks you to pay a Rs 500 registration fee first.",
    answer: 'SCAM',
    explanation: 'Real employers never ask you to pay money to get a job. This is a classic prepaid task scam.',
  },
  {
    question: "An SMS says: 'Electricity bill unpaid. Power connection will be disconnected tonight at 9:30 PM. Call officer Sharma on 9812345678 immediately.'",
    answer: 'SCAM',
    explanation: 'Power companies do not give sudden same-night disconnection threats via personal mobile numbers. They follow formal paper bills and legal notice periods.',
  },
  {
    question: "Your official bank mobile app shows a notification: 'Your monthly account statement for October is ready. View it inside the app.' No links or passwords requested.",
    answer: 'SAFE',
    explanation: 'Legitimate in-app notifications inform you without asking for passwords, OTPs, or external website clicks.',
  },
  {
    question: "A caller claims to be CBI/Police over video call, claiming your parcel was seized with illegal drugs and you are under 'Digital Arrest' until you transfer your money to a verification account.",
    answer: 'SCAM',
    explanation: 'Indian police, CBI, or courts NEVER conduct arrests over Skype/WhatsApp video calls, and they NEVER ask you to transfer money to prove your innocence.',
  },
  {
    question: "An email says your Netflix subscription expired. The sender email address is 'support-billing@mail-netflix-verify98.xyz' instead of '@netflix.com'.",
    answer: 'SCAM',
    explanation: 'Scammers use lookalike domain names. Always check the domain after the @ sign. If it does not end in official netflix.com, it is a fake email.',
  },
  {
    question: "You get an SMS: 'Your BlueDart courier shipment #49281 has arrived. Collect at your building reception.' No payment or links requested.",
    answer: 'SAFE',
    explanation: 'Standard delivery informational updates do not ask for urgent payments, OTPs, or remote software installations.',
  },
  {
    question: "A popup on your computer screams: 'VIRUS DETECTED! Your computer is locked. Call Windows Support at 1-800-XXX right now.'",
    answer: 'SCAM',
    explanation: 'Microsoft and Apple never put phone numbers on browser popup errors. This is a fake tech support scam designed to get remote control of your computer.',
  },
];

export const CyberQuiz: React.FC<CyberQuizProps> = ({
  language,
  onQuizCompleted,
  showToast,
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'SAFE' | 'SCAM' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_DATA[currentIndex];

  const handleSelectAnswer = (ans: 'SAFE' | 'SCAM') => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      showToast('Correct! Great judgment.', 'success');
    } else {
      showToast('Watch out! Check the explanation below.', 'error');
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
      const finalScore = selectedAnswer === currentQ.answer ? score : score;
      onQuizCompleted(finalScore);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
    showToast('Quiz restarted.', 'info');
  };

  const getRankBadge = (s: number) => {
    if (s >= 90) return { title: 'Cyber Defender Master', color: 'text-emerald-400' };
    if (s >= 70) return { title: 'Smart & Alert Defender', color: 'text-blue-400' };
    if (s >= 50) return { title: 'Needs More Caution', color: 'text-amber-400' };
    return { title: 'High Risk - Practice More', color: 'text-rose-400' };
  };

  return (
    <section id="quiz" className="py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.quizEyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.quizTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            10 quick real-life situations. Test if you can spot what is safe and what is a trap.
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-xl">
          {!isFinished ? (
            <div>
              {/* Status Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                <span className="uppercase tracking-wider">
                  Question {currentIndex + 1} of {QUIZ_DATA.length}
                </span>
                <span className="text-blue-400 font-mono text-sm">
                  Score: {score} / 100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-6">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_DATA.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-20 flex items-center">
                <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                  "{currentQ.question}"
                </h3>
              </div>

              {/* Choice Buttons */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
                {(['SAFE', 'SCAM'] as const).map((choice) => {
                  const isSelected = selectedAnswer === choice;
                  const isCorrectAnswer = currentQ.answer === choice;
                  let btnStyle = 'border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500';

                  if (selectedAnswer !== null) {
                    if (isCorrectAnswer) {
                      btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'border-slate-800 bg-slate-950 text-slate-500 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectAnswer(choice)}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                    >
                      {choice === 'SAFE' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                      )}
                      {choice === 'SAFE' ? 'Legitimate / Safe' : 'Dangerous / Scam'}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {selectedAnswer !== null && (
                <div
                  className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    selectedAnswer === currentQ.answer
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  }`}
                >
                  <strong className="block font-bold mb-1">
                    {selectedAnswer === currentQ.answer ? '✅ Correct Decision:' : '❌ Warning Sign:'}
                  </strong>
                  {currentQ.explanation}
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    id="quiz-next-btn"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 cursor-pointer transition-all"
                  >
                    {currentIndex < QUIZ_DATA.length - 1 ? t.next : 'View Final Score'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Finished Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.quizComplete}
              </p>

              <h3 className="text-2xl font-black text-white">
                {t.yourIQ}
              </h3>

              <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                {score} <span className="text-xl text-slate-500">/ 100</span>
              </div>

              <p className={`text-base font-bold ${getRankBadge(score).color}`}>
                Badge: {getRankBadge(score).title}
              </p>

              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {score >= 80
                  ? 'Excellent defensive reflexes! You know how to identify psychological panic traps and verify through official channels.'
                  : 'Good practice! Read the simple safety tips below to learn how scammers use fake urgency and fake QR codes.'}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  id="quiz-try-again-btn"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.tryAgain}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
