import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Globe,
  Mail,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Upload,
  Zap,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { AnalyzerTab, AnalysisResult, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  analyzeMessage,
  analyzeUrl,
  analyzeEmail,
  SAMPLES,
} from '../utils/localAnalyzer';
import { CyberShield3D } from './CyberShield3D';

interface AnalyzerProps {
  language: Language;
  onAnalysisComplete: (result: AnalysisResult, type: AnalyzerTab, title: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({
  language,
  onAnalysisComplete,
  showToast,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<AnalyzerTab>('message');

  // Input states
  const [messageText, setMessageText] = useState('');
  const [urlText, setUrlText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Screenshot states
  const [screenFile, setScreenFile] = useState<File | null>(null);
  const [screenPreview, setScreenPreview] = useState<string | null>(null);
  const [screenClues, setScreenClues] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result & loading
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [useAiDeepScan, setUseAiDeepScan] = useState(false);
  const [copiedVerdict, setCopiedVerdict] = useState(false);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    whySuspicious: true,
    limitations: false,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sample Loaders
  const loadSample = (type: 'electricity' | 'digitalArrest' | 'bank' | 'upi' | 'job' | 'legitOtp' | 'legitBank' | 'url' | 'email') => {
    if (type === 'electricity') {
      setActiveTab('message');
      setMessageText(SAMPLES.electricityScam);
      showToast('Loaded: Fake Electricity Bill Disconnection Scam');
    } else if (type === 'digitalArrest') {
      setActiveTab('message');
      setMessageText(SAMPLES.digitalArrest);
      showToast('Loaded: Fake CBI / Police Digital Arrest Scam');
    } else if (type === 'bank') {
      setActiveTab('message');
      setMessageText(SAMPLES.bankKyc);
      showToast('Loaded: Fake Bank KYC / NetBanking Block Scam');
    } else if (type === 'upi') {
      setActiveTab('message');
      setMessageText(SAMPLES.upiCashback);
      showToast('Loaded: Fake UPI PIN / QR Cashback Scam');
    } else if (type === 'job') {
      setActiveTab('message');
      setMessageText(SAMPLES.youtubeJob);
      showToast('Loaded: Telegram YouTube Task / Job Scam');
    } else if (type === 'legitOtp') {
      setActiveTab('message');
      setMessageText(SAMPLES.legitOtp);
      showToast('Loaded: Real Google 2FA OTP (Legitimate)');
    } else if (type === 'legitBank') {
      setActiveTab('message');
      setMessageText(SAMPLES.legitBankAlert);
      showToast('Loaded: Real Bank Debit Alert (Legitimate)');
    } else if (type === 'url') {
      setActiveTab('url');
      setUrlText(SAMPLES.suspiciousUrl);
      showToast('Loaded: Raw IP Phishing Link');
    } else if (type === 'email') {
      setActiveTab('email');
      setSenderName(SAMPLES.phishingEmail.name);
      setSenderEmail(SAMPLES.phishingEmail.email);
      setEmailSubject(SAMPLES.phishingEmail.subject);
      setEmailBody(SAMPLES.phishingEmail.body);
      showToast('Loaded: Fake PayPal Alert from Gmail Address');
    }
  };

  const handleClearAll = () => {
    setMessageText('');
    setUrlText('');
    setSenderName('');
    setSenderEmail('');
    setEmailSubject('');
    setEmailBody('');
    setScreenFile(null);
    setScreenPreview(null);
    setScreenClues('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setResult(null);
    showToast('Cleared input fields', 'info');
  };

  // Perform Analysis
  const runAnalysis = async () => {
    setAnalyzing(true);
    let analysisResult: AnalysisResult | null = null;
    let title = '';

    try {
      if (activeTab === 'message') {
        if (!messageText.trim()) {
          showToast('Please enter a message to check.', 'error');
          setAnalyzing(false);
          return;
        }
        title = messageText.slice(0, 32) + '...';

        if (useAiDeepScan) {
          try {
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'message', content: messageText }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.score !== undefined) {
                analysisResult = data;
              }
            }
          } catch {
            // Fallback
          }
        }
        if (!analysisResult) {
          analysisResult = analyzeMessage(messageText);
        }
      } else if (activeTab === 'url') {
        if (!urlText.trim()) {
          showToast('Please enter a website address.', 'error');
          setAnalyzing(false);
          return;
        }
        title = urlText.slice(0, 32);

        if (useAiDeepScan) {
          try {
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'url', content: urlText }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.score !== undefined) {
                analysisResult = data;
              }
            }
          } catch {
            // Fallback
          }
        }
        if (!analysisResult) {
          analysisResult = analyzeUrl(urlText);
        }
      } else if (activeTab === 'email') {
        if (!senderEmail.trim() && !emailBody.trim()) {
          showToast('Please fill in sender email or message text.', 'error');
          setAnalyzing(false);
          return;
        }
        title = emailSubject ? emailSubject.slice(0, 32) : senderEmail.slice(0, 32);

        if (useAiDeepScan) {
          try {
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'email',
                content: `Sender: ${senderName} <${senderEmail}>\nSubject: ${emailSubject}\nBody: ${emailBody}`,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.score !== undefined) {
                analysisResult = data;
              }
            }
          } catch {
            // Fallback
          }
        }
        if (!analysisResult) {
          analysisResult = analyzeEmail(senderName, senderEmail, emailSubject, emailBody);
        }
      } else if (activeTab === 'screenshot') {
        if (!screenFile && !screenClues.trim()) {
          showToast('Please upload a screenshot or write what the image says.', 'error');
          setAnalyzing(false);
          return;
        }
        title = screenFile ? screenFile.name : 'Screenshot Check';

        if (useAiDeepScan && screenPreview) {
          try {
            const base64Data = screenPreview.split(',')[1];
            const mimeType = screenFile?.type || 'image/png';
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'screenshot',
                content: screenClues || 'Check this screenshot for fake login, bank threats, or scam clues.',
                imageBase64: base64Data,
                mimeType,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.score !== undefined) {
                analysisResult = data;
              }
            }
          } catch {
            // Fallback
          }
        }

        if (!analysisResult) {
          if (screenClues.trim()) {
            analysisResult = analyzeMessage(screenClues);
          } else {
            analysisResult = {
              score: 25,
              level: 'SUSPICIOUS',
              confidence: 75,
              sender: 'Screenshot Image',
              action: 'Checking visual clues',
              motivation: 'Disguising a scam inside an image',
              plainEnglishSummary: 'Screenshot received. Review the website address in the screenshot, look for fake logos, and never scan unknown QR codes.',
              verdict: 'Screenshot visual check: Make sure the website domain matches the official brand exactly.',
              trapPhrases: ['Image screenshot upload'],
              threatVectors: { impersonation: 25, urgency: 20, financialLoss: 30, linkRisk: 30 },
              warnings: [
                {
                  type: 'VISUAL CHECKLIST',
                  severity: 'mid',
                  weight: 25,
                  evidence: screenFile?.name || 'Uploaded image',
                  explanation: 'Scammers frequently send images with fake QR codes or urgency countdowns so text filters cannot easily read them.',
                  remediation: 'Never scan QR codes or type URLs shown on unsolicited pictures.',
                },
              ],
              actions: [
                'Look at the exact website URL shown in the picture to see if it is real.',
                'Do not scan QR codes displayed in messages or pictures.',
                'Never enter passwords or card details on pages reached via screenshot links.',
              ],
            };
          }
        }
      }

      if (analysisResult) {
        setResult(analysisResult);
        onAnalysisComplete(analysisResult, activeTab, title);
        showToast('Check completed!', 'success');
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } catch {
      showToast('Failed to analyze. Please try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Please upload a JPG, PNG, or WEBP image.', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB limit.', 'error');
      return;
    }

    setScreenFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenPreview(reader.result as string);
      showToast('Screenshot loaded', 'success');
    };
    reader.readAsDataURL(file);
  };

  const copyVerdictToClipboard = () => {
    if (!result) return;
    const text = `CyberGuard Threat Check:\nRisk Level: ${result.level} (${result.score}/100)\nSender: ${result.sender}\nSummary: ${result.plainEnglishSummary || result.verdict}`;
    navigator.clipboard.writeText(text);
    setCopiedVerdict(true);
    showToast('Verdict copied to clipboard!', 'success');
    setTimeout(() => setCopiedVerdict(false), 2000);
  };

  // Color helper
  const getScoreTheme = (score: number) => {
    if (score >= 60) {
      return {
        badgeBg: 'bg-rose-500/15',
        badgeBorder: 'border-rose-500/30',
        badgeText: 'text-rose-400',
        ringColor: '#ef4444',
        barColor: 'bg-rose-500',
        headerText: 'HIGH SCAM THREAT',
      };
    }
    if (score >= 30) {
      return {
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/30',
        badgeText: 'text-amber-400',
        ringColor: '#f59e0b',
        barColor: 'bg-amber-500',
        headerText: 'CAUTION REQUIRED',
      };
    }
    return {
      badgeBg: 'bg-emerald-500/15',
      badgeBorder: 'border-emerald-500/30',
      badgeText: 'text-emerald-400',
      ringColor: '#10b981',
      barColor: 'bg-emerald-500',
      headerText: 'SAFE / ROUTINE',
    };
  };

  return (
    <section id="analyze" className="py-16 border-y border-slate-800 bg-slate-950/80 relative cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              {t.analyzeEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.analyzeTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.analyzeIntro}
            </p>
          </div>

          {/* Quick Real-life test examples */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Quick test real scams:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => loadSample('electricity')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 cursor-pointer transition-all"
                title="Fake power cut at 9:30 PM tonight"
              >
                ⚡ Power Cut
              </button>
              <button
                type="button"
                onClick={() => loadSample('digitalArrest')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-rose-300 cursor-pointer transition-all"
                title="CBI / Police fake parcel threat"
              >
                🚨 Digital Arrest
              </button>
              <button
                type="button"
                onClick={() => loadSample('bank')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-500 text-blue-300 cursor-pointer transition-all"
                title="Bank account blocked today"
              >
                🏦 Bank KYC
              </button>
              <button
                type="button"
                onClick={() => loadSample('upi')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-300 cursor-pointer transition-all"
                title="Scan QR & enter PIN to receive money"
              >
                💰 UPI QR Scam
              </button>
              <button
                type="button"
                onClick={() => loadSample('job')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 text-sky-300 cursor-pointer transition-all"
                title="Like YouTube videos to earn Rs 5000"
              >
                💼 YouTube Job
              </button>
              <button
                type="button"
                onClick={() => loadSample('legitOtp')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-700/60 hover:border-emerald-400 text-emerald-400 cursor-pointer transition-all font-semibold"
                title="Real Google OTP with do not share warning"
              >
                ✅ Real 2FA OTP
              </button>
              <button
                type="button"
                onClick={() => loadSample('legitBank')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-700/60 hover:border-emerald-400 text-emerald-400 cursor-pointer transition-all font-semibold"
                title="Real bank debit alert SMS"
              >
                ✅ Real Bank SMS
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="mt-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 sm:px-6 bg-slate-950/60">
            <div className="flex overflow-x-auto space-x-2 sm:space-x-4 py-2" role="tablist">
              <button
                role="tab"
                id="tab-message"
                aria-selected={activeTab === 'message'}
                onClick={() => setActiveTab('message')}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'message'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {t.messageTab}
              </button>

              <button
                role="tab"
                id="tab-url"
                aria-selected={activeTab === 'url'}
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                {t.urlTab}
              </button>

              <button
                role="tab"
                id="tab-email"
                aria-selected={activeTab === 'email'}
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'email'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                {t.emailTab}
              </button>

              <button
                role="tab"
                id="tab-screenshot"
                aria-selected={activeTab === 'screenshot'}
                onClick={() => setActiveTab('screenshot')}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'screenshot'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                {t.screenTab}
              </button>
            </div>

            {/* AI Deep Scan Toggle */}
            <div className="py-2 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useAiDeepScan}
                  onChange={(e) => setUseAiDeepScan(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Gemini Deep AI Scan
                </span>
              </label>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tab 1: Message */}
            {activeTab === 'message' && (
              <div>
                <label
                  htmlFor="input-message"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  {t.messageLabel}
                </label>
                <textarea
                  id="input-message"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste SMS, WhatsApp chat, or Telegram message here..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans transition-all"
                />
              </div>
            )}

            {/* Tab 2: URL */}
            {activeTab === 'url' && (
              <div>
                <label
                  htmlFor="input-url"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  {t.urlLabel}
                </label>
                <input
                  id="input-url"
                  type="text"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  placeholder="e.g. http://192.168.1.104/login or sbi-kyc-update.online"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-all"
                />
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {t.urlNotice}
                </p>
              </div>
            )}

            {/* Tab 3: Email */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="input-sender-name"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      {t.senderName}
                    </label>
                    <input
                      id="input-sender-name"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. PayPal Security Team"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="input-sender-email"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      {t.senderEmail}
                    </label>
                    <input
                      id="input-sender-email"
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. security-alert@gmail.com"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="input-email-subject"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    {t.subject}
                  </label>
                  <input
                    id="input-email-subject"
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Action Required: Account will be suspended"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-email-body"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    {t.emailBody}
                  </label>
                  <textarea
                    id="input-email-body"
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Paste the full text of the email message here..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Screenshot */}
            {activeTab === 'screenshot' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  {t.uploadScreen}
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all flex flex-col items-center justify-center"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {screenPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={screenPreview}
                        alt="Screenshot Preview"
                        className="max-h-48 rounded-xl object-contain border border-slate-800 shadow-md"
                      />
                      <span className="text-xs text-slate-400 font-mono">
                        {screenFile?.name} (Click to replace)
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-slate-200">
                        Click or drag & drop screenshot here
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        Supports PNG, JPG, or WEBP (up to 8MB)
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="input-screen-clues"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    {t.visibleClues}
                  </label>
                  <textarea
                    id="input-screen-clues"
                    rows={2}
                    value={screenClues}
                    onChange={(e) => setScreenClues(e.target.value)}
                    placeholder="Optional: Type visible phone numbers, website addresses, or strange details shown in the screenshot..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="run-analysis-btn"
                onClick={runAnalysis}
                disabled={analyzing}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking Threat Signals...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {activeTab === 'message'
                      ? t.analyzeMessage
                      : activeTab === 'url'
                      ? t.checkUrl
                      : activeTab === 'email'
                      ? t.analyzeEmail
                      : t.checkScreenshot}
                  </>
                )}
              </button>

              <button
                type="button"
                id="clear-analysis-btn"
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 border border-slate-800 bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {t.clear}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section with 3D Cyber Shield & Sharp Vectors */}
        {result && (
          <div
            ref={resultsRef}
            id="analysis-results-section"
            className="mt-10 rounded-2xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-300"
          >
            {/* Top Bar: Threat Score Ring & 3D Interactive Shield */}
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center border-b border-slate-800 pb-6">
              <div className="flex items-center gap-5">
                {/* Visual Circular Score Ring */}
                {(() => {
                  const theme = getScoreTheme(result.score);
                  return (
                    <div
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 flex items-center justify-center p-2 shadow-inner"
                      style={{
                        background: `conic-gradient(${theme.ringColor} ${result.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          {result.score}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          / 100
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {(() => {
                      const theme = getScoreTheme(result.score);
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                        >
                          {result.score >= 60 ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : result.score >= 30 ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {theme.headerText}
                        </span>
                      );
                    })()}

                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-300">
                      {result.isAiGenerated ? 'GEMINI DEEP SCAN' : t.localBadge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {t.assessment}
                  </h3>

                  {/* Confidence Bar */}
                  <div className="mt-2 flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-400">
                      Confidence: {result.confidence}%
                    </span>
                    <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-700"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated 3D Cyber Shield Model */}
              <div className="relative bg-slate-950/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center">
                <CyberShield3D score={result.score} height={180} className="w-full" interactive={true} />
                <span className="text-[10px] text-slate-400 mt-1">
                  3D Threat Core (Drag to inspect in 3D)
                </span>
              </div>
            </div>

            {/* Plain English Verdict Banner */}
            <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Plain English Summary:
                </span>
                <button
                  onClick={copyVerdictToClipboard}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedVerdict ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedVerdict ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-100">
                {result.plainEnglishSummary || result.verdict}
              </p>
            </div>

            {/* Context Pills */}
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Claiming to be:</span>
                <span className="text-white font-semibold text-sm mt-0.5 block">{result.sender}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Asking you to:</span>
                <span className="text-amber-300 font-semibold text-sm mt-0.5 block">{result.action}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Real goal:</span>
                <span className="text-rose-300 font-semibold text-sm mt-0.5 block">{result.motivation}</span>
              </div>
            </div>

            {/* Detected Trap Words (Chips) */}
            {result.trapPhrases && result.trapPhrases.length > 0 && (
              <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 block mb-2">
                  🎯 Exact Scam Words / Red Flags Found in Message:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.trapPhrases.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sharp Prediction Threat Vectors Matrix */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                📊 Sharp Threat Breakdown Matrix
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vector 1 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">🎭 Impersonation</span>
                    <span className="font-mono font-bold text-blue-400">
                      {result.threatVectors?.impersonation || (result.score >= 60 ? 90 : 20)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${result.threatVectors?.impersonation || (result.score >= 60 ? 90 : 20)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Pretending to be trusted entity</span>
                </div>

                {/* Vector 2 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">⏱️ Urgency / Panic</span>
                    <span className="font-mono font-bold text-amber-400">
                      {result.threatVectors?.urgency || (result.score >= 60 ? 92 : 15)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${result.threatVectors?.urgency || (result.score >= 60 ? 92 : 15)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Threatening deadline / power cut</span>
                </div>

                {/* Vector 3 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">💳 Financial / Data Theft</span>
                    <span className="font-mono font-bold text-rose-400">
                      {result.threatVectors?.financialLoss || (result.score >= 60 ? 95 : 10)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${result.threatVectors?.financialLoss || (result.score >= 60 ? 95 : 10)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Risk of losing money, PIN or OTP</span>
                </div>

                {/* Vector 4 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">🔗 Link / Technical Risk</span>
                    <span className="font-mono font-bold text-sky-400">
                      {result.threatVectors?.linkRisk || (result.score >= 60 ? 80 : 10)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{ width: `${result.threatVectors?.linkRisk || (result.score >= 60 ? 80 : 10)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Hidden links, APKs or IP host</span>
                </div>
              </div>
            </div>

            {/* Warning Signals & Recommended Actions */}
            <div className="mt-8 grid lg:grid-cols-2 gap-6">
              {/* Warning Signals */}
              <div>
                <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  {t.warningSigns} ({result.warnings.length})
                </h4>

                <div className="space-y-3">
                  {result.warnings.map((signal, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        signal.severity === 'high'
                          ? 'bg-rose-950/20 border-rose-800/40'
                          : signal.severity === 'mid'
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-emerald-950/20 border-emerald-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold tracking-wide uppercase text-white">
                          {signal.type}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            signal.severity === 'high'
                              ? 'bg-rose-500/20 text-rose-300'
                              : signal.severity === 'mid'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {signal.severity}
                        </span>
                      </div>

                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {signal.explanation}
                      </p>

                      {signal.evidence && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            Found: {signal.evidence}
                          </span>
                        </div>
                      )}

                      <p className="mt-2 text-xs text-emerald-400 font-medium">
                        🛡️ Advice: {signal.remediation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What To Do Right Now */}
              <div>
                <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t.recommended}
                </h4>

                <ul className="space-y-2.5">
                  {result.actions.map((act, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Simple FAQ Accordion */}
            <div className="mt-8 pt-5 border-t border-slate-800">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('whySuspicious')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-300 hover:bg-slate-900 cursor-pointer"
                >
                  <span>Why was this risk score given?</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.whySuspicious ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.whySuspicious && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Our scanner checks for verified manipulation scripts used in real-world fraud: fake power disconnection ultimatums, threats of police action or digital arrest, unofficial phone numbers, and hidden links. When multiple red flags appear together, the scam probability is extremely high.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
