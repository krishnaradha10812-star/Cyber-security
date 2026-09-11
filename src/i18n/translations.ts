import { Language } from '../types';

export interface TranslationDictionary {
  tagline: string;
  navHome: string;
  navAnalyze: string;
  navQuiz: string;
  navLearn: string;
  navEmergency: string;
  navAbout: string;
  navPassword: string;
  analyzeNow: string;
  localDefense: string;
  heroCopy: string;
  heroLocal: string;
  analyzeMessage: string;
  learnSafety: string;
  statusTitle: string;
  runsLocal: string;
  metricData: string;
  metricRules: string;
  metricInstant: string;
  f1: string;
  f1d: string;
  f2: string;
  f2d: string;
  f3: string;
  f3d: string;
  f4: string;
  f4d: string;
  f5: string;
  f5d: string;
  f6: string;
  f6d: string;
  analyzeEyebrow: string;
  analyzeTitle: string;
  analyzeIntro: string;
  messageTab: string;
  urlTab: string;
  emailTab: string;
  screenTab: string;
  messageLabel: string;
  urlLabel: string;
  checkUrl: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  emailBody: string;
  analyzeEmail: string;
  uploadScreen: string;
  visibleClues: string;
  screenNotice: string;
  checkScreenshot: string;
  clear: string;
  urlNotice: string;
  assessment: string;
  warningSigns: string;
  recommended: string;
  riskDisclaimer: string;
  localBadge: string;
  snapshot: string;
  sessionOnly: string;
  linkSafety: string;
  messageSafety: string;
  passwordHealth: string;
  privacyMode: string;
  emptySnapshot: string;
  privacySnapshot: string;
  activity: string;
  clearHistory: string;
  noActivity: string;
  passwordEyebrow: string;
  passwordTitle: string;
  passwordIntro: string;
  passwordWarning: string;
  testPassword: string;
  show: string;
  hide: string;
  strength: string;
  quizEyebrow: string;
  quizTitle: string;
  next: string;
  quizComplete: string;
  yourIQ: string;
  tryAgain: string;
  learnEyebrow: string;
  learnTitle: string;
  learnIntro: string;
  faq: string;
  emergencyEyebrow: string;
  emergencyTitle: string;
  emergencyIntro: string;
  indiaNote: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutCopy: string;
  privacy: string;
  privacyNotice: string;
  personalWarning: string;
  disclaimer: string;
  disclaimerCopy: string;
  safetyTips: string;
  footerLine: string;
  immediateSteps: string;
  close: string;
  deepAiScan: string;
  localEngine: string;
  loadSample: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    tagline: 'Check Before You Click.',
    navHome: 'Home',
    navAnalyze: 'Check Scam',
    navQuiz: 'Cyber Quiz',
    navLearn: 'Safety Tips',
    navEmergency: 'Emergency Help',
    navAbout: 'About',
    navPassword: 'Password Checker',
    analyzeNow: 'Check a Scam',
    localDefense: 'Smart Scam Shield',
    heroCopy: 'Check if any message, link, or email is a scam before you lose your money.',
    heroLocal: '100% Private: Analyzed right in your browser. Your messages are never stored.',
    analyzeMessage: 'Check Message Now',
    learnSafety: 'Read Simple Safety Tips',
    statusTitle: '3D DEFENSE CORE ACTIVE',
    runsLocal: 'Interactive 3D security scanner',
    metricData: '100% Private<br>Nothing Saved',
    metricRules: 'Pinpoint Accurate<br>Scam Detection',
    metricInstant: 'Instant Results<br>In Easy English',
    f1: 'Fake Message Detector',
    f1d: 'Catches electricity bill threats, fake police warnings, and money traps.',
    f2: 'Dangerous Link Scanner',
    f2d: 'Spots look-alike bank links and hidden short URLs before you tap.',
    f3: 'Fake Email Scanner',
    f3d: 'Checks if an email is pretending to be your bank, PayPal, or employer.',
    f4: 'Quick Cyber Quiz',
    f4d: 'Fun practice questions to test if you can spot modern real-life scams.',
    f5: 'Emergency Steps',
    f5d: 'Simple emergency checklist if you accidentally clicked a bad link or sent money.',
    f6: 'Easy Safety Habits',
    f6d: 'Clear rules anyone can follow to protect their bank accounts and phone.',
    analyzeEyebrow: 'Scam Scanner',
    analyzeTitle: 'Paste it here. We will check if it is safe.',
    analyzeIntro: 'Paste any suspicious SMS, WhatsApp message, website link, or email below. We tell you what the scammer is trying to do in plain English.',
    messageTab: 'Message / SMS',
    urlTab: 'Website Link',
    emailTab: 'Email',
    screenTab: 'Screenshot',
    messageLabel: 'Paste the message or chat text here:',
    urlLabel: 'Paste the website address here:',
    checkUrl: 'Check This Link',
    senderName: 'Sender Name',
    senderEmail: 'Sender Email Address',
    subject: 'Subject Line',
    emailBody: 'Email Message Text',
    analyzeEmail: 'Check This Email',
    uploadScreen: 'Upload a picture of the suspicious message or screen',
    visibleClues: 'What does the picture say? (Optional notes)',
    screenNotice: 'Upload a screenshot of any message, email, or website to check for visual scam clues.',
    checkScreenshot: 'Check Screenshot',
    clear: 'Clear',
    urlNotice: 'We check for fake brand lookalikes, IP numbers, and hidden shorteners. Remember: a green padlock only means connection is encrypted, not that the website is honest.',
    assessment: 'Scam Threat Result',
    warningSigns: 'Red Flags Found',
    recommended: 'What You Should Do Right Now',
    riskDisclaimer: 'This result is based on verified scam patterns (like fake electricity bills, digital arrest, and UPI PIN tricks). Always double-check before sending money.',
    localBadge: 'INSTANT SCAN',
    snapshot: 'Security Overview',
    sessionOnly: 'This session overview',
    linkSafety: 'Link Safety',
    messageSafety: 'Message Safety',
    passwordHealth: 'Password Strength',
    privacyMode: 'Privacy Mode Active',
    emptySnapshot: 'Run a check to see real-time posture indicators.',
    privacySnapshot: 'Local checks active. No telemetry or personal logs saved.',
    activity: 'Session Activity',
    clearHistory: 'Clear history',
    noActivity: 'No scans conducted in this session yet.',
    passwordEyebrow: 'Private Credential Health',
    passwordTitle: 'Password Resilience Checker',
    passwordIntro: 'Evaluate password complexity locally. Passwords are evaluated strictly in browser memory and never stored or transmitted.',
    passwordWarning: 'Never enter your real active banking PIN, OTP, CVV, or primary credentials here.',
    testPassword: 'Test sample password',
    show: 'Show',
    hide: 'Hide',
    strength: 'Strength Score',
    quizEyebrow: 'Practice Safely',
    quizTitle: 'Cyber IQ Interactive Challenge',
    next: 'Next Scenario',
    quizComplete: 'Challenge Complete',
    yourIQ: 'YOUR CYBER IQ SCORE',
    tryAgain: 'Retake Challenge',
    learnEyebrow: 'Knowledge Defense',
    learnTitle: 'Cyber Safety Knowledge Base',
    learnIntro: 'Master the anatomy of common digital attacks and build automatic defense reflexes.',
    faq: 'Frequently Asked Questions',
    emergencyEyebrow: 'Incident Response Playbook',
    emergencyTitle: 'I GOT SCAMMED — EMERGENCY ASSISTANCE',
    emergencyIntro: 'Select the scenario that occurred. Follow immediate containment steps calmly and systematically.',
    indiaNote: 'In India, report financial cyber fraud immediately on helpline 1930 or at cybercrime.gov.in. In the US, report to IC3.gov.',
    aboutEyebrow: 'Defensive & Educational Mission',
    aboutTitle: 'Empowering digital citizens with defensive instincts.',
    aboutCopy: 'CyberGuard AI is an educational defensive cybersecurity initiative designed to help users recognize social engineering patterns, stop phishing attacks, and safeguard personal credentials.',
    privacy: 'Privacy Commitment',
    privacyNotice: 'Your security data stays strictly within your browser during local mode scans. AI-assisted checks use minimal anonymized payloads with no persistent tracking.',
    personalWarning: 'Security Rule: Never share OTPs, UPI PINs, passwords, or bank authentication codes with anyone, under any circumstances.',
    disclaimer: 'Security Disclaimer',
    disclaimerCopy: 'CyberGuard AI provides threat probability assessments based on known attack signatures. Threat actors evolve constantly; always independently verify high-risk communications.',
    safetyTips: 'Safety Guides',
    footerLine: 'Think Before You Click. · Defensive Cybersecurity Awareness',
    immediateSteps: 'Immediate Defensive Playbook',
    close: 'Close',
    deepAiScan: 'Gemini AI Deep Scan',
    localEngine: 'Fast Local Privacy Engine',
    loadSample: 'Load Sample'
  },
  hi: {
    tagline: 'क्लिक करने से पहले सोचें।',
    navHome: 'होम',
    navAnalyze: 'जांचें',
    navQuiz: 'साइबर IQ',
    navLearn: 'सीखें',
    navEmergency: 'आपातकाल',
    navAbout: 'परिचय',
    navPassword: 'पासवर्ड स्वास्थ्य',
    analyzeNow: 'अभी जांचें',
    localDefense: 'सुरक्षात्मक साइबर सुरक्षा शिक्षा',
    heroCopy: 'हर नागरिक के लिए स्मार्ट, सुरक्षित साइबर सुरक्षा उपकरण।',
    heroLocal: 'ब्राउज़र-आधारित विश्लेषण जो आपके डिवाइस पर चलता है। कोई डेटा बाहर नहीं जाता।',
    analyzeMessage: 'संदेश जांचें',
    learnSafety: 'सुरक्षा सीखें',
    statusTitle: 'स्थानीय सुरक्षा सक्रिय',
    runsLocal: 'आपके ब्राउज़र में सुरक्षित रूप से चलता है',
    metricData: 'शून्य डेटा लीक<br>पूर्ण गोपनीयता',
    metricRules: 'नियम और AI<br>पैटर्न जांच',
    metricInstant: 'तुरंत सुरक्षा<br>परिणाम',
    f1: 'AI स्कैम पहचान',
    f1d: 'नकली पुरस्कार, दबाव और हेरफेर वाले संदेशों की पहचान करें।',
    f2: 'संदिग्ध URL पहचान',
    f2d: 'लिंक खोलने से पहले नकली और जोखिम भरी वेबसाइट्स का पता लगाएं।',
    f3: 'फ़िशिंग से सुरक्षा',
    f3d: 'संदिग्ध ईमेल और बैंक या कंपनी के नाम पर फर्जी संदेश पहचानें।',
    f4: 'साइबर IQ क्विज़',
    f4d: 'असली दुनिया के उदाहरणों के साथ अपनी सतर्कता का अभ्यास करें।',
    f5: 'आपातकालीन सहायता',
    f5d: 'धोखाधड़ी के बाद तुरंत उठाए जाने वाले सुरक्षात्मक कदम।',
    f6: 'साइबर सुरक्षा पाठ',
    f6d: 'दैनिक ऑनलाइन सुरक्षा के लिए सरल और व्यावहारिक टिप्स।',
    analyzeEyebrow: 'खतरे की जांच कार्यक्षेत्र',
    analyzeTitle: 'संकेतों को पहचानें। सुरक्षित रहें।',
    analyzeIntro: 'संदिग्ध संदेश, लिंक, ईमेल या स्क्रीनशॉट की तुरंत जांच करें और बचाव के कदम जानें।',
    messageTab: 'संदेश जांच',
    urlTab: 'URL जांच',
    emailTab: 'ईमेल जांच',
    screenTab: 'स्क्रीनशॉट जांच',
    messageLabel: 'संदिग्ध संदेश या SMS',
    urlLabel: 'वेबसाइट URL',
    checkUrl: 'URL जांचें',
    senderName: 'भेजने वाले का नाम',
    senderEmail: 'भेजने वाले का ईमेल',
    subject: 'ईमेल का विषय',
    emailBody: 'ईमेल सामग्री',
    analyzeEmail: 'ईमेल जांचें',
    uploadScreen: 'संदिग्ध स्क्रीनशॉट अपलोड करें',
    visibleClues: 'दिखने वाले शब्द (वैकल्पिक)',
    screenNotice: 'स्क्रीनशॉट अपलोड करें और दृश्य संकेतों की सुरक्षा जांच करें।',
    checkScreenshot: 'स्क्रीनशॉट जांचें',
    clear: 'साफ करें',
    urlNotice: 'ब्राउज़र-आधारित URL विश्लेषण। HTTPS सिर्फ सुरक्षित कनेक्शन देता है, यह प्रमाण नहीं कि साइट असली है।',
    assessment: 'जोखिम आकलन',
    warningSigns: 'पाए गए चेतावनी संकेत',
    recommended: 'सुझाए गए सुरक्षा कदम',
    riskDisclaimer: 'यह परिणाम साइबर सुरक्षा नियमों और पैटर्न पर आधारित एक जोखिम आकलन है।',
    localBadge: 'सुरक्षा इंजन',
    snapshot: 'सुरक्षा स्नैपशॉट',
    sessionOnly: 'वर्तमान सत्र की स्थिति',
    linkSafety: 'लिंक सुरक्षा',
    messageSafety: 'संदेश सुरक्षा',
    passwordHealth: 'पासवर्ड स्वास्थ्य',
    privacyMode: 'गोपनीयता मोड',
    emptySnapshot: 'स्नैपशॉट देखने के लिए कोई जांच चलाएं।',
    privacySnapshot: 'स्थानीय जांच सक्रिय। कोई इतिहास सहेजा नहीं जाता।',
    activity: 'सत्र गतिविधि',
    clearHistory: 'इतिहास हटाएं',
    noActivity: 'इस सत्र में अभी तक कोई जांच नहीं की गई।',
    passwordEyebrow: 'निजी पासवर्ड जांच',
    passwordTitle: 'पासवर्ड मजबूती परीक्षक',
    passwordIntro: 'पासवर्ड की मजबूती जांचें। पासवर्ड कभी भी कहीं भेजा या सेव नहीं किया जाता।',
    passwordWarning: 'यहां कभी भी अपना असली बैंक पिन, OTP या पासवर्ड न डालें।',
    testPassword: 'परीक्षण पासवर्ड',
    show: 'दिखाएं',
    hide: 'छिपाएं',
    strength: 'मजबूती स्कोर',
    quizEyebrow: 'सुरक्षित अभ्यास',
    quizTitle: 'साइबर IQ क्विज़ चुनौती',
    next: 'अगला प्रश्न',
    quizComplete: 'चुनौती पूर्ण',
    yourIQ: 'आपका साइबर IQ स्कोर',
    tryAgain: 'पुनः प्रयास करें',
    learnEyebrow: 'ज्ञान ही बचाव है',
    learnTitle: 'साइबर सुरक्षा ज्ञान केंद्र',
    learnIntro: 'आम ऑनलाइन हमलों के पैटर्न को समझें और सुरक्षित आदतें बनाएं।',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    emergencyEyebrow: 'तत्काल प्रतिक्रिया',
    emergencyTitle: 'मेरे साथ धोखाधड़ी हुई — आपातकालीन मदद',
    emergencyIntro: 'जो हुआ उसे चुनें और तुरंत रक्षात्मक कदम उठाएं। घबराएं नहीं, शांत रहकर कदम उठाएं।',
    indiaNote: 'भारत में वित्तीय साइबर अपराध की तुरंत रिपोर्ट हेल्पलाइन 1930 पर करें या cybercrime.gov.in पर दर्ज करें।',
    aboutEyebrow: 'शिक्षा और सुरक्षा मिशन',
    aboutTitle: 'सुरक्षित इंटरनेट उपयोग के लिए जागरूकता।',
    aboutCopy: 'CyberGuard AI एक शैक्षणिक पहल है जो लोगों को ऑनलाइन धोखाधड़ी और फ़िशिंग से बचने में मदद करती है।',
    privacy: 'गोपनीयता नीति',
    privacyNotice: 'स्थानीय मोड में आपकी सभी जांचें आपके ब्राउज़र के भीतर ही संपन्न होती हैं।',
    personalWarning: 'सुरक्षा नियम: कभी भी किसी के साथ OTP, पिन या पासवर्ड साझा न करें।',
    disclaimer: 'अस्वीकरण',
    disclaimerCopy: 'यह टूल पैटर्न-आधारित जोखिम मूल्यांकन प्रदान करता है। आधिकारिक स्रोतों से हमेशा स्वतंत्र रूप से सत्यापन करें।',
    safetyTips: 'सुरक्षा टिप्स',
    footerLine: 'क्लिक करने से पहले सोचें। · साइबर सुरक्षा जागरूकता',
    immediateSteps: 'तत्काल सुरक्षा कदम',
    close: 'बंद करें',
    deepAiScan: 'Gemini AI डीप स्कैन',
    localEngine: 'तेज स्थानीय प्राइवेसी इंजन',
    loadSample: 'नमूना लोड करें'
  },
  hinglish: {
    tagline: 'Click karne se pehle socho.',
    navHome: 'Home',
    navAnalyze: 'Analyze',
    navQuiz: 'Cyber IQ',
    navLearn: 'Seekho',
    navEmergency: 'Emergency',
    navAbout: 'About',
    navPassword: 'Password Health',
    analyzeNow: 'Abhi Check Karo',
    localDefense: 'Defensive Cyber Security Education',
    heroCopy: 'Sabke liye smart, privacy-first cyber safety tools.',
    heroLocal: 'Browser-based threat analysis jo aapke browser mein hi run hota hai. Full privacy guaranteed.',
    analyzeMessage: 'Message Check Karo',
    learnSafety: 'Safety Tips Dekho',
    statusTitle: 'LOCAL PROTECTION ACTIVE',
    runsLocal: 'Aapke device pe locally run hota hai',
    metricData: 'Zero Data Leaks<br>to External Servers',
    metricRules: 'Intelligent Pattern<br>& AI Detection',
    metricInstant: 'Instant Threat<br>Evaluation',
    f1: 'AI Scam Detection',
    f1d: 'Urgency, fake rewards aur emotional manipulation patterns detect karein.',
    f2: 'Suspicious URL Detection',
    f2d: 'Risky aur fake links ko open karne se pehle pehchanein.',
    f3: 'Phishing Protection',
    f3d: 'Bank ya brand ke naam pe aane wale fake emails aur SMS alert pakdein.',
    f4: 'Cyber IQ Quiz',
    f4d: 'Real scam scenarios se practice karke apna defense mazboot karein.',
    f5: 'Emergency Help',
    f5d: 'Scam hone ke baad turant kya step lena hai, step-by-step checklist.',
    f6: 'Cyber Safety Learning',
    f6d: 'Online safe rehne ke actionable aur aasan tareeqe.',
    analyzeEyebrow: 'Threat Analysis Workspace',
    analyzeTitle: 'Signals check karo. Alert raho.',
    analyzeIntro: 'Suspicious SMS, URL, Email ya Screenshot paste karein aur risk score payein.',
    messageTab: 'Message Analyzer',
    urlTab: 'URL Analyzer',
    emailTab: 'Email Analyzer',
    screenTab: 'Screenshot Analyzer',
    messageLabel: 'Suspicious SMS ya WhatsApp message',
    urlLabel: 'Website Link / URL',
    checkUrl: 'URL Check Karo',
    senderName: 'Sender Name',
    senderEmail: 'Sender Email Address',
    subject: 'Subject Line',
    emailBody: 'Email Body Content',
    analyzeEmail: 'Email Analyze Karo',
    uploadScreen: 'Screenshot upload karein',
    visibleClues: 'Visible text ya clues (optional)',
    screenNotice: 'Screenshot upload karein visual verification ke liye.',
    checkScreenshot: 'Screenshot Check Karo',
    clear: 'Clear',
    urlNotice: 'URL pattern check. HTTPS ka matlab safe connection hai, trustworthy website nahi.',
    assessment: 'Threat Assessment',
    warningSigns: 'Detected Warning Signs',
    recommended: 'Recommended Actions',
    riskDisclaimer: 'Yeh assessment security heuristic rules pe based risk probability score hai.',
    localBadge: 'LOCAL ENGINE',
    snapshot: 'Security Snapshot',
    sessionOnly: 'Current session status',
    linkSafety: 'Link Safety',
    messageSafety: 'Message Safety',
    passwordHealth: 'Password Health',
    privacyMode: 'Privacy Mode',
    emptySnapshot: 'Koi scan run karein snapshot dekhne ke liye.',
    privacySnapshot: 'Local checks active. No saved history.',
    activity: 'Session History',
    clearHistory: 'Clear history',
    noActivity: 'Is session mein koi check nahi hua abhi tak.',
    passwordEyebrow: 'Private Credential Health',
    passwordTitle: 'Password Health Checker',
    passwordIntro: 'Password strength locally check karein. Password kahin transmit ya save nahi hota.',
    passwordWarning: 'Yahan kabhi bhi apna REAL bank PIN, OTP ya password na daalein.',
    testPassword: 'Sample password enter karein',
    show: 'Show',
    hide: 'Hide',
    strength: 'Strength Score',
    quizEyebrow: 'Practice Safely',
    quizTitle: 'Cyber IQ Interactive Challenge',
    next: 'Agla Question',
    quizComplete: 'Challenge Complete',
    yourIQ: 'AAPKA CYBER IQ SCORE',
    tryAgain: 'Phir se try karein',
    learnEyebrow: 'Knowledge Defense',
    learnTitle: 'Cyber Safety Knowledge Base',
    learnIntro: 'Common cyber attacks ko samjhein aur unse bachne ke tareeqe seekhein.',
    faq: 'Frequently Asked Questions',
    emergencyEyebrow: 'Incident Response Playbook',
    emergencyTitle: 'MERE SAATH SCAM HUA — EMERGENCY STEPS',
    emergencyIntro: 'Aapke sath kya hua select karein aur turant defensive action lein.',
    indiaNote: 'India mein financial cyber fraud ki turant report helpline 1930 pe karein ya cybercrime.gov.in pe lodge karein.',
    aboutEyebrow: 'Mission & Vision',
    aboutTitle: 'Safeguarding every digital citizen.',
    aboutCopy: 'CyberGuard AI ek educational defensive cybersecurity initiative hai jo common scams aur phishing se bachne mein madad karta hai.',
    privacy: 'Privacy Commitment',
    privacyNotice: 'Local mode mein aapka koi bhi sensitive text ya screenshot server pe nahi jaata.',
    personalWarning: 'Golden Rule: Kabhi bhi OTP, UPI PIN ya password kisi ke sath share na karein.',
    disclaimer: 'Disclaimer',
    disclaimerCopy: 'CyberGuard AI guidance aur risk estimation provide karta hai. Critical cases mein official authority se check karein.',
    safetyTips: 'Safety Guides',
    footerLine: 'Click karne se pehle socho. · Cyber Safety Awareness',
    immediateSteps: 'Immediate Action Checklist',
    close: 'Close',
    deepAiScan: 'Gemini AI Deep Scan',
    localEngine: 'Fast Local Privacy Engine',
    loadSample: 'Sample Daalein'
  }
};
