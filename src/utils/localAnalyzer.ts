import { AnalysisResult, RiskLevel, WarningSignal, ThreatVectors } from '../types';

export function normalizeInput(value: string): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function extractEntities(text: string) {
  const t = normalizeInput(text);
  const urls = t.match(/https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(online|top|xyz|site|club|work|shop|click|cc|info)\b[^\s]*/gi) || [];
  const phones = t.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}\b/g) || [];

  const commonRoles = [
    'electricity department', 'power office', 'msedcl', 'bses', 'dhbvn', 'tneb', 'bijli',
    'bank', 'sbi', 'hdfc', 'icici', 'axis', 'pnb', 'canara', 'paytm', 'phonepe', 'google pay',
    'police', 'cbi', 'customs', 'narcotics', 'court', 'supreme court', 'digital arrest',
    'courier', 'fedex', 'dhl', 'india post', 'delhivery',
    'amazon', 'flipkart', 'netflix', 'apple support', 'google',
    'telegram', 'youtube manager', 'hr department', 'recruiter',
  ];
  const detectedRoles = commonRoles.filter((role) => t.toLowerCase().includes(role));
  return { text: t, urls, phones, roles: detectedRoles };
}

export function inferSender(t: string): string {
  const { roles } = extractEntities(t);
  if (roles.length > 0) {
    const r = roles[0];
    return r.charAt(0).toUpperCase() + r.slice(1);
  }
  return 'Unknown sender';
}

export function inferRequestedAction(t: string): string {
  const x = t.toLowerCase();
  if (/otp|one.time password|verification code/.test(x)) return 'share your secret OTP or code';
  if (/upi pin|atm pin|password|netbanking password|cvv/.test(x)) return 'enter or reveal your secret PIN or password';
  if (/qr code|scan qr|scan to receive/.test(x)) return 'scan a QR code to transfer money';
  if (/call.*officer|call.*number|contact.*whatsapp|call.*\d{10}/.test(x)) return 'call an unofficial personal mobile number';
  if (/anydesk|teamviewer|rustdesk|quicksupport/.test(x)) return 'install a remote screen-sharing tool';
  if (/\.apk|download app|install update/.test(x)) return 'download an unknown APK file';
  if (/click.*link|update.*pan|kyc.*update|click.*here|http/.test(x)) return 'click an unverified link to update details';
  if (/send money|pay fee|processing charge|deposit ₹|recharge/.test(x)) return 'make an upfront payment or deposit';
  if (/skype|video call|digital arrest/.test(x)) return 'join an unofficial video interrogation call';
  return 'take an unexpected or urgent action';
}

export function inferMotivation(t: string): string {
  const x = t.toLowerCase();
  if (/digital arrest|cbi|police|fir|narcotics|parcel seized/.test(x)) {
    return 'Scare you with fake police threats so you pay extortion money';
  }
  if (/electricity|power disconnected|power cut|bijli/.test(x)) {
    return 'Panic you into calling a fake officer number and stealing your money';
  }
  if (/kyc|pan|aadhaar|account block|netbanking suspended/.test(x)) {
    return 'Steal your bank username, password, and money via a fake website';
  }
  if (/qr code|upi pin|cashback|lottery|kbc|25 lakh/.test(x)) {
    return 'Trick you into approving a money deduction from your bank';
  }
  if (/telegram task|like youtube|part.time job|earn 5000/.test(x)) {
    return 'Lure you with easy money then demand prepaid deposit fees';
  }
  if (/anydesk|teamviewer|rustdesk|screen share/.test(x)) {
    return 'Take complete remote control of your phone or computer';
  }
  return 'Manipulate you into giving up money or sensitive personal access';
}

export function extractTrapPhrases(text: string): string[] {
  const traps: string[] = [];
  const lower = text.toLowerCase();

  const patterns = [
    { regex: /power\s*(?:will be)?\s*disconnected\s*(?:at|tonight)?\s*[\d:apm]*/i, label: 'power disconnected tonight' },
    { regex: /bill not updated/i, label: 'bill not updated' },
    { regex: /call.*(?:officer|support|manager|helpdesk).*\d{5,}/i, label: 'call personal officer number' },
    { regex: /digital arrest/i, label: 'digital arrest' },
    { regex: /(?:cbi|police|customs).*(?:parcel|narcotics|drugs|arrest|warrant)/i, label: 'fake law enforcement threat' },
    { regex: /netbanking.*(?:blocked|suspended|deactivated)/i, label: 'netbanking blocked today' },
    { regex: /update (?:your )?(?:pan|aadhaar|kyc)/i, label: 'update PAN/Aadhaar/KYC' },
    { regex: /enter (?:your )?upi pin/i, label: 'enter your UPI PIN' },
    { regex: /scan (?:this )?qr code to receive/i, label: 'scan QR code to receive money' },
    { regex: /(?:won|winner of) (?:rs\.?|₹)?\s*[\d,]+\s*(?:lakh|crore|cashback|lottery)/i, label: 'lottery / cashback prize' },
    { regex: /like youtube videos/i, label: 'like YouTube videos job' },
    { regex: /earn (?:rs\.?|₹)?\s*[\d,]+\s*(?:daily|per day)/i, label: 'earn thousands daily' },
    { regex: /download.*\.apk/i, label: 'download APK file' },
    { regex: /install (?:anydesk|teamviewer|rustdesk)/i, label: 'install remote desktop tool' },
    { regex: /within (?:2|10|15|30) minutes|today only|immediately/i, label: 'artificial urgency deadline' },
  ];

  for (const item of patterns) {
    const match = text.match(item.regex);
    if (match) {
      traps.push(match[0].trim());
    }
  }

  // Deduplicate and cap
  return Array.from(new Set(traps)).slice(0, 5);
}

export function isLegitimatePattern(text: string): { isLegit: boolean; reason: string } {
  const x = text.toLowerCase();

  // Pattern 1: Legitimate 2FA OTP with defensive warning (Do NOT share)
  const isOtpMessage = /\b\d{4,8}\b/.test(x) && /(?:code|otp|one.time password|verification code)/.test(x);
  const hasStrictDoNotShare = /(?:do not|never|don't|not to|kisi ko na)\s+(?:share|disclose|give|reveal|tell)/.test(x);
  const hasNoPhishingLinks = !/http|bit\.ly|tinyurl|\.online|\.xyz|\.top/i.test(x);
  const hasNoPaymentRequest = !/(?:pay|send money|transfer|upi pin|fee|deposit)/.test(x);

  if (isOtpMessage && hasStrictDoNotShare && hasNoPhishingLinks && hasNoPaymentRequest) {
    return {
      isLegit: true,
      reason: 'Standard two-factor authentication security code. The message safely instructs you NEVER to share it.',
    };
  }

  // Pattern 2: Legitimate bank debit / credit transaction SMS
  const isBankDebit = /(?:debited|credited|transferred)\s+(?:by|for|with|of)?\s*(?:rs\.?|inr|₹)\s*[\d,.]+/i.test(x) ||
                      /(?:a\/c|account|card)\s*(?:no\.?|xx|\*+)\d+/i.test(x);
  const hasAvailBal = /(?:avail|available|bal|balance)\s*(?:is|rs|inr|₹|:)/i.test(x);
  const hasTollFree = /1800\d{6,7}|toll[\s-]free/i.test(x);

  if (isBankDebit && hasAvailBal && hasNoPhishingLinks && !/click|update|blocked|suspended|kyc/.test(x)) {
    return {
      isLegit: true,
      reason: 'Routine banking transaction confirmation alert. Shows standard debit/balance information without suspicious links.',
    };
  }

  // Pattern 3: Normal casual friendly or team communication
  const isCasualChat = /^(?:hi|hello|hey|good morning|dear|bro)\b.*(?:meeting|coffee|lunch|sync|call|review|project|slide|dinner|weekend)/i.test(x) &&
                       !/(?:otp|pin|password|bank|cbi|police|lottery|lakh|urgent|pay|transfer|suspended|blocked)/i.test(x);

  if (isCasualChat && hasNoPhishingLinks) {
    return {
      isLegit: true,
      reason: 'Normal conversational message or friendly invitation with no financial threats, links, or pressure.',
    };
  }

  return { isLegit: false, reason: '' };
}

export function buildSignals(input: string): { signals: WarningSignal[]; vectors: ThreatVectors; trapPhrases: string[] } {
  const t = normalizeInput(input);
  const x = t.toLowerCase();
  const entities = extractEntities(t);
  const trapPhrases = extractTrapPhrases(t);

  const signals: WarningSignal[] = [];

  let impersonationScore = 5;
  let urgencyScore = 5;
  let financialLossScore = 5;
  let linkRiskScore = 5;

  const add = (
    type: string,
    severity: 'low' | 'mid' | 'high',
    weight: number,
    evidence: string,
    explanation: string,
    remediation: string
  ) => {
    signals.push({ type, severity, weight, evidence, explanation, remediation });
  };

  // 1. Check for genuine legitimate pattern first
  const legitCheck = isLegitimatePattern(t);
  if (legitCheck.isLegit) {
    add(
      'SAFE ROUTINE NOTIFICATION',
      'low',
      0,
      legitCheck.reason,
      'This message matches standard legitimate security or transactional notification patterns. It does not try to steal your information.',
      'No action required. If this is an OTP login you requested, you may use it safely. Remember never to share OTPs over the phone.'
    );

    return {
      signals,
      vectors: {
        impersonation: 0,
        urgency: 5,
        financialLoss: 0,
        linkRisk: 0,
      },
      trapPhrases: [],
    };
  }

  // 2. Electricity / Power Disconnection Scam
  if (/electricity|power disconnected|power cut|bijli|light cut|bill not updated/.test(x)) {
    urgencyScore = Math.max(urgencyScore, 95);
    impersonationScore = Math.max(impersonationScore, 90);
    financialLossScore = Math.max(financialLossScore, 85);
    add(
      'ELECTRICITY CUT-OFF SCAM',
      'high',
      35,
      'Threatens power cut tonight + calls a fake officer number',
      'Scammers send fake power disconnection warnings so you panic and call a personal mobile number. They then trick you into sending money or installing AnyDesk.',
      'Do NOT call the number in the SMS. Check your electricity bill only on your official state electricity board website or electricity meter app.'
    );
  }

  // 3. Digital Arrest / Fake Police / CBI / Customs Scam
  if (/digital arrest|cbi|police|customs|narcotics|fir|arrest warrant|supreme court|illegal parcel|skype/.test(x)) {
    urgencyScore = Math.max(urgencyScore, 98);
    impersonationScore = Math.max(impersonationScore, 98);
    financialLossScore = Math.max(financialLossScore, 95);
    add(
      'DIGITAL ARREST / LAW ENFORCEMENT SCAM',
      'high',
      40,
      'Threat of arrest, CBI, narcotics parcel, or police interrogation',
      'Real police, CBI, or customs NEVER arrest or interrogate anyone over WhatsApp or Skype video calls. "Digital arrest" does not exist in law.',
      'Disconnect and block immediately. Report the incident to your local police cyber cell or cybercrime.gov.in (Helpline: 1930).'
    );
  }

  // 4. Bank KYC / PAN / Aadhaar / Account Suspended Scam
  if (/sbi|hdfc|icici|axis|pnb|canara|bank|kyc|pan|aadhaar|account (?:blocked|suspended|deactivated)/.test(x)) {
    if (/update|blocked|suspended|click|link|today|immediately/.test(x)) {
      impersonationScore = Math.max(impersonationScore, 92);
      urgencyScore = Math.max(urgencyScore, 88);
      financialLossScore = Math.max(financialLossScore, 90);
      add(
        'FAKE BANK KYC / ACCOUNT BLOCK THREAT',
        'high',
        32,
        'Claims your bank account or NetBanking will be blocked today',
        'Banks never send links via SMS asking you to update your PAN or Aadhaar. Clicking this link takes you to a fake website that steals your bank password.',
        'Never click the link. Log in only via your bank’s official mobile app or visit your bank branch directly.'
      );
    }
  }

  // 5. UPI PIN / QR Code Money Receiving Scam
  if (/upi pin|scan qr|qr code|cashback|google pay reward|phonepe reward|paytm cashback/.test(x)) {
    if (/receive|claim|collect|reward|won|prize/.test(x)) {
      financialLossScore = Math.max(financialLossScore, 100);
      urgencyScore = Math.max(urgencyScore, 80);
      add(
        'UPI PIN / QR CODE PAYMENT TRAP',
        'high',
        38,
        'Asks you to enter your UPI PIN or scan a QR code to "receive" money',
        'GOLDEN RULE: You NEVER need to enter your UPI PIN or scan a QR code to receive money. Entering your PIN always DEDUCTS money from your bank account.',
        'Never enter your UPI PIN or scan any QR code sent to you. Decline and block the sender.'
      );
    }
  }

  // 6. Work-From-Home / Telegram YouTube Task Scam
  if (/part.time|work from home|like youtube|rate hotels|earn (?:rs|₹)|daily 5000|telegram task/.test(x)) {
    financialLossScore = Math.max(financialLossScore, 90);
    impersonationScore = Math.max(impersonationScore, 75);
    add(
      'WORK-FROM-HOME TASK SCAM',
      'high',
      30,
      'Promises huge daily earnings for liking YouTube videos or simple tasks',
      'Scammers pay ₹150 for the first few tasks to gain your trust, then convince you to invest thousands into fake "prepaid tasks" and freeze your money.',
      'No real company pays ₹3,000–₹8,000 daily for liking videos. Block the Telegram manager immediately.'
    );
  }

  // 7. Lottery / KBC Winner Scam
  if (/lottery|kbc|lucky draw|won (?:25|50)?\s*lakh|winner of|cash prize/.test(x)) {
    financialLossScore = Math.max(financialLossScore, 92);
    urgencyScore = Math.max(urgencyScore, 70);
    add(
      'FAKE LOTTERY / KBC LUCKY DRAW',
      'high',
      32,
      'Claims you won a lottery or lucky draw you never entered',
      'You cannot win a lottery you never bought a ticket for. Scammers will ask for an upfront "registration fee" or "GST tax" and disappear.',
      'Ignore and delete the message. Never pay any fee or tax to claim a prize.'
    );
  }

  // 8. Remote Control Tools (AnyDesk, TeamViewer, RustDesk) or APK Malware
  if (/anydesk|teamviewer|rustdesk|quicksupport|\.apk|screen share/.test(x)) {
    financialLossScore = Math.max(financialLossScore, 98);
    urgencyScore = Math.max(urgencyScore, 90);
    linkRiskScore = Math.max(linkRiskScore, 95);
    add(
      'DANGEROUS REMOTE ACCESS OR APK FILE',
      'high',
      38,
      'Asks you to download an APK file or install AnyDesk / screen-sharing app',
      'Installing screen-sharing apps or unknown APK files gives cyber criminals complete remote control of your phone and bank apps.',
      'Never download APK files from messages. Never install AnyDesk or screen-share apps when told by a caller.'
    );
  }

  // 9. Links in message
  if (entities.urls.length > 0) {
    linkRiskScore = Math.max(linkRiskScore, 75);
    const hasShortener = /bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy/i.test(t);
    const hasSuspiciousTld = /\.(online|xyz|top|site|club|work|shop|click|cc|info)/i.test(t);

    if (hasShortener || hasSuspiciousTld) {
      linkRiskScore = Math.max(linkRiskScore, 95);
      add(
        'SUSPICIOUS OR HIDDEN WEBSITE LINK',
        'high',
        25,
        `Detected hidden/short link: ${entities.urls[0]}`,
        'The link uses a URL shortener or unusual web address to hide where it really takes you.',
        'Do NOT tap or click this link. It likely leads to a fake login page.'
      );
    } else {
      add(
        'EXTERNAL LINK DETECTED',
        'mid',
        15,
        `Link: ${entities.urls[0]}`,
        'Unexpected links in SMS or chat messages often lead to fake websites.',
        'Open the official website directly by typing its known address in your browser.'
      );
    }
  }

  // 10. Artificial Urgency
  if (/urgent|immediately|within \d+ minutes|today only|last chance|warning|suspended|blocked/i.test(t)) {
    urgencyScore = Math.max(urgencyScore, 85);
    add(
      'FAKE TIME PRESSURE & URGENCY',
      'mid',
      15,
      'Uses urgent words like "immediately" or short deadlines',
      'Scammers intentionally create panic so you act quickly before you have time to think or ask family for help.',
      'Slow down and take a pause. Real banks and services never give 15-minute ultimatums.'
    );
  }

  // Fallback if no specific triggers hit
  if (signals.length === 0) {
    add(
      'NORMAL CONVERSATION PATTERN',
      'low',
      5,
      'No scam keywords or pressure tactics found',
      'This message does not appear to contain common scam triggers, threats, or link traps.',
      'If you know the sender, this is likely safe. Still never share sensitive passwords or PINs.'
    );
    impersonationScore = 5;
    urgencyScore = 5;
    financialLossScore = 5;
    linkRiskScore = 5;
  }

  return {
    signals,
    vectors: {
      impersonation: Math.min(100, impersonationScore),
      urgency: Math.min(100, urgencyScore),
      financialLoss: Math.min(100, financialLossScore),
      linkRisk: Math.min(100, linkRiskScore),
    },
    trapPhrases,
  };
}

export function combineSignals(signals: WarningSignal[]): number {
  if (signals.some((s) => s.type === 'SAFE ROUTINE NOTIFICATION')) return 8;

  let score = 0;
  const highSignals = signals.filter((s) => s.severity === 'high');
  const midSignals = signals.filter((s) => s.severity === 'mid');

  if (highSignals.length >= 2) {
    score = 88 + Math.min(11, highSignals.length * 3);
  } else if (highSignals.length === 1) {
    score = 65 + midSignals.length * 8;
  } else if (midSignals.length > 0) {
    score = 35 + midSignals.length * 7;
  } else {
    score = 8;
  }

  return Math.min(99, Math.max(4, score));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return 'LOW RISK';
  if (score < 60) return 'SUSPICIOUS';
  return 'HIGH RISK';
}

export function analyzeMessage(text: string): AnalysisResult {
  const cleaned = normalizeInput(text);
  const { signals, vectors, trapPhrases } = buildSignals(cleaned);
  const score = combineSignals(signals);
  const level = getRiskLevel(score);
  const sender = inferSender(cleaned);
  const action = inferRequestedAction(cleaned);
  const motivation = inferMotivation(cleaned);

  const confidence = level === 'HIGH RISK' ? 96 : level === 'LOW RISK' ? 92 : 80;

  // Plain English Summary
  let plainEnglishSummary = '';
  if (level === 'HIGH RISK') {
    plainEnglishSummary = `This message is a dangerous scam. The sender is pretending to be ${sender} and wants to force you to ${action}. Their goal is to ${motivation.toLowerCase()}.`;
  } else if (level === 'SUSPICIOUS') {
    plainEnglishSummary = `Caution needed. This message claims to be from ${sender}. Do not click any links or share private details until you verify directly.`;
  } else {
    plainEnglishSummary = `This message appears safe and routine. It does not use panic tactics, fake threats, or credential-stealing links.`;
  }

  const verdict = level === 'HIGH RISK'
    ? `SCAM DETECTED: This message displays confirmed fraudulent manipulation patterns. It uses artificial urgency claiming to be ${sender} to make you ${action}. Do not reply, click, or pay.`
    : level === 'SUSPICIOUS'
    ? `SUSPICIOUS: Contains ambiguous elements or unverified requests from ${sender}. Proceed with caution.`
    : `SAFE / ROUTINE: No dangerous scam signatures detected. Standard safe communication.`;

  const actions = level === 'HIGH RISK'
    ? [
        'Do NOT click any link, and do NOT call phone numbers given in the message.',
        'Block and report this sender on your phone or WhatsApp.',
        'If it mentions a bank or electricity bill, check only on the official app or website.',
        'Never share an OTP, ATM PIN, UPI PIN, or password with anyone.',
      ]
    : [
        'Always verify unusual requests through official known channels.',
        'Remember that real institutions never ask for your passwords or UPI PIN.',
      ];

  return {
    score,
    level,
    confidence,
    sender,
    action,
    motivation,
    verdict,
    plainEnglishSummary,
    trapPhrases,
    threatVectors: vectors,
    warnings: signals,
    actions,
  };
}

export function analyzeUrl(rawUrl: string): AnalysisResult {
  let urlObj: URL | null = null;
  let target = rawUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  try {
    urlObj = new URL(target);
  } catch {
    return {
      score: 92,
      level: 'HIGH RISK',
      confidence: 95,
      sender: 'Broken / Fake Link',
      action: 'clicking an invalid link',
      motivation: 'Trick your browser into opening a dangerous address',
      plainEnglishSummary: 'This link is broken or disguised with invalid characters to bypass security filters. Do NOT open it.',
      verdict: 'The web address is malformed or invalid, a tactic frequently used by cyber criminals to deceive browsers.',
      trapPhrases: [rawUrl],
      threatVectors: { impersonation: 75, urgency: 40, financialLoss: 80, linkRisk: 98 },
      warnings: [
        {
          type: 'MALFORMED WEB ADDRESS',
          severity: 'high',
          weight: 40,
          evidence: rawUrl,
          explanation: 'This website address is syntactically broken or using hidden tricks.',
          remediation: 'Do not attempt to open or visit this link.',
        },
      ],
      actions: ['Do not open this link in any browser.', 'Delete the message containing this link.'],
    };
  }

  const warnings: WarningSignal[] = [];
  const host = urlObj.hostname.toLowerCase();
  const trapPhrases: string[] = [];

  let impersonationScore = 10;
  let urgencyScore = 10;
  let financialLossScore = 10;
  let linkRiskScore = 20;

  const add = (
    type: string,
    severity: 'low' | 'mid' | 'high',
    weight: number,
    evidence: string,
    explanation: string,
    remediation: string
  ) => {
    warnings.push({ type, severity, weight, evidence, explanation, remediation });
  };

  // Check 1: Raw IP host
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    linkRiskScore = 95;
    financialLossScore = 85;
    trapPhrases.push(`Raw IP address: ${host}`);
    add(
      'DIRECT NUMERIC IP HOST (NO REAL DOMAIN)',
      'high',
      35,
      `Host is a direct number: ${host}`,
      'Real companies and banks use proper names (like google.com or sbi.co.in), not raw numbers. Raw numbers are almost always temporary scam servers.',
      'Do NOT visit this website or enter any information.'
    );
  }

  // Check 2: Shortened URL
  if (/bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl\.at/.test(host)) {
    linkRiskScore = 90;
    trapPhrases.push(`URL Shortener: ${host}`);
    add(
      'HIDDEN SHORT LINK',
      'high',
      30,
      `Uses shortener: ${host}`,
      'This link hides the real website you will be taken to. Scammers use this so you cannot see their fake website name.',
      'Do not click shortened links sent from unknown numbers or emails.'
    );
  }

  // Check 3: Lookalike / Punycode
  if (host.includes('xn--')) {
    linkRiskScore = 98;
    impersonationScore = 98;
    trapPhrases.push(`Lookalike fake characters: ${host}`);
    add(
      'LOOKALIKE FAKE LETTERS (PUNYCODE SPOOF)',
      'high',
      40,
      `Punycode domain: ${host}`,
      'The website uses look-alike characters from foreign alphabets to mimic a real brand name (e.g. using a Cyrillic "о" instead of an English "o").',
      'Never trust the visual appearance of this link. Close it immediately.'
    );
  }

  // Check 4: Suspicious TLD
  if (/\.(online|top|xyz|click|site|club|work|shop|monster|surf|gq|tk|cc|pw)$/i.test(host)) {
    linkRiskScore = Math.max(linkRiskScore, 80);
    trapPhrases.push(`Unusual website ending: .${host.split('.').pop()}`);
    add(
      'SUSPICIOUS CHEAP DOMAIN EXTENSION',
      'mid',
      20,
      `Website ends in: .${host.split('.').pop()}`,
      'Domains ending in .xyz, .top, or .online are frequently registered by scammers for low cost or free.',
      'Be extremely cautious before entering any personal data.'
    );
  }

  // Check 5: Banking / credential keywords in link
  if (/sbi|hdfc|icici|paypal|bank|login|verify|kyc|pan|aadhaar|secure|wallet/i.test(host + urlObj.pathname)) {
    impersonationScore = Math.max(impersonationScore, 85);
    financialLossScore = Math.max(financialLossScore, 85);
    trapPhrases.push(`Security/Bank words in link: ${urlObj.pathname}`);
    add(
      'FAKES OFFICIAL BANK OR LOGIN INTERFACE',
      'high',
      28,
      'Contains bank or login keywords in path',
      'The link tries to look like an official login or KYC update page, but the domain owner is unofficial.',
      'Type the bank website directly in your browser rather than clicking links.'
    );
  }

  if (warnings.length === 0) {
    add(
      'CLEAN DOMAIN STRUCTURE',
      'low',
      5,
      `Domain: ${host}`,
      'The website address uses a standard domain structure and valid security protocol.',
      'Always verify you are on the authentic company website before typing passwords.'
    );
  }

  const score = combineSignals(warnings);
  const level = getRiskLevel(score);

  return {
    score,
    level,
    confidence: 90,
    sender: host,
    action: 'visiting an unverified website',
    motivation: score >= 60 ? 'Steal your passwords, bank credentials, or install malware' : 'Serve standard web content',
    plainEnglishSummary: score >= 60
      ? `This link (${host}) is dangerous. It is disguised to trick your browser and steal your information.`
      : `This link (${host}) appears to be a standard website. Always make sure it matches the exact company you intended to visit.`,
    verdict: score >= 60
      ? `DANGEROUS LINK: The web address '${host}' has multiple red flags typical of phishing portals.`
      : `SAFE STRUCTURE: The URL '${host}' does not show known scam masking tricks.`,
    trapPhrases,
    threatVectors: {
      impersonation: impersonationScore,
      urgency: urgencyScore,
      financialLoss: financialLossScore,
      linkRisk: linkRiskScore,
    },
    warnings,
    actions: [
      'Do not enter passwords, OTPs, or bank card numbers on this website.',
      'To reach a bank or service, search for it on Google or use their verified mobile app.',
    ],
  };
}

export function analyzeEmail(senderName: string, senderEmail: string, subject: string, body: string): AnalysisResult {
  const combined = `${senderName} ${senderEmail} ${subject} ${body}`.toLowerCase();
  const baseMessage = analyzeMessage(`${subject}\n${body}`);
  const warnings: WarningSignal[] = [...baseMessage.warnings];
  const trapPhrases = [...(baseMessage.trapPhrases || [])];

  let impersonationScore = baseMessage.threatVectors?.impersonation || 10;
  let urgencyScore = baseMessage.threatVectors?.urgency || 10;
  let financialLossScore = baseMessage.threatVectors?.financialLoss || 10;
  let linkRiskScore = baseMessage.threatVectors?.linkRisk || 10;

  const add = (
    type: string,
    severity: 'low' | 'mid' | 'high',
    weight: number,
    evidence: string,
    explanation: string,
    remediation: string
  ) => {
    warnings.push({ type, severity, weight, evidence, explanation, remediation });
  };

  const domain = senderEmail.includes('@') ? senderEmail.split('@')[1] : '';
  const freeProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];
  const brandRegex = /bank|support|security|sbi|hdfc|paypal|google|amazon|apple|microsoft|billing|police|cbi/i;

  if (brandRegex.test(senderName) && freeProviders.includes(domain)) {
    impersonationScore = 95;
    trapPhrases.push(`Fake sender email: ${senderName} <${senderEmail}>`);
    add(
      'OFFICIAL BRAND USING FREE PUBLIC EMAIL (GMAIL/YAHOO)',
      'high',
      35,
      `Claims to be '${senderName}' but sent from '${senderEmail}'`,
      'Real banks and official companies NEVER send official security or banking alerts from free @gmail.com or @yahoo.com addresses.',
      'This is an impostor. Do not reply, click any links, or open attachments. Report as phishing.'
    );
  }

  if (/\.zip|\.exe|\.scr|\.apk|\.iso|\.vbs|invoice.*\.pdf/i.test(combined)) {
    linkRiskScore = 95;
    financialLossScore = 90;
    trapPhrases.push('Dangerous attachment (.zip, .exe, or suspicious invoice)');
    add(
      'SUSPICIOUS FILE ATTACHMENT / MALWARE RISK',
      'high',
      30,
      'Email contains or references executable files, zip archives, or unexpected invoices',
      'Opening unknown email attachments can install ransomware or keystroke loggers that secretly copy your passwords.',
      'Never open unexpected attachments or enable macros in documents.'
    );
  }

  const score = combineSignals(warnings);
  const level = getRiskLevel(score);

  return {
    score,
    level,
    confidence: 94,
    sender: senderEmail || senderName || 'Unknown Email Sender',
    action: baseMessage.action,
    motivation: baseMessage.motivation,
    plainEnglishSummary: score >= 60
      ? `This email is a fake impersonation. The sender claims to be ${senderName} but is using an unofficial address to steal your data or money.`
      : `This email appears to be normal communication without immediate scam signatures.`,
    verdict: score >= 60
      ? `PHISHING EMAIL DETECTED: Sent from an unverified address pretending to represent an official organization.`
      : `SAFE EMAIL COMPOSITION: No direct impersonation or malware signatures found.`,
    trapPhrases,
    threatVectors: {
      impersonation: Math.min(100, impersonationScore),
      urgency: Math.min(100, urgencyScore),
      financialLoss: Math.min(100, financialLossScore),
      linkRisk: Math.min(100, linkRiskScore),
    },
    warnings,
    actions: [
      'Do not download attachments or click links in this email.',
      'Report the email as Phishing/Spam in your email app.',
      'Block the sender email address.',
    ],
  };
}

export function evaluatePassword(pwd: string) {
  if (!pwd) {
    return {
      score: 0,
      level: 'LOW RISK' as RiskLevel,
      fillWidth: '0%',
      color: '#ef4444',
      feedback: ['Type a sample password to test its strength.'],
    };
  }

  let points = 0;
  const feedback: string[] = [];

  if (pwd.length >= 16) points += 30;
  else if (pwd.length >= 12) points += 22;
  else if (pwd.length >= 8) {
    points += 10;
    feedback.push('Good, but making it 12+ characters makes it 1,000 times harder for hackers to crack.');
  } else {
    points += 4;
    feedback.push('Very short (less than 8 letters). Automated hacker tools can guess this in seconds.');
  }

  if (/[a-z]/.test(pwd)) points += 12;
  else feedback.push('Add lowercase letters (a-z).');

  if (/[A-Z]/.test(pwd)) points += 12;
  else feedback.push('Add uppercase capital letters (A-Z).');

  if (/\d/.test(pwd)) points += 12;
  else feedback.push('Add numbers (0-9).');

  if (/[^A-Za-z0-9]/.test(pwd)) points += 14;
  else feedback.push('Add special symbols like ! @ # $ % & *.');

  if (/password|qwerty|12345|admin|welcome|login|iloveyou/i.test(pwd)) {
    points -= 25;
    feedback.push('Contains a very common word found in every hacker wordlist.');
  }

  if (/abc|123|qwer|asdf/i.test(pwd)) {
    points -= 15;
    feedback.push('Contains predictable keyboard patterns like "123" or "asdf".');
  }

  const finalScore = Math.min(100, Math.max(0, points));

  let color = '#ef4444';
  let level: RiskLevel = 'HIGH RISK';
  if (finalScore >= 80) {
    color = '#10b981';
    level = 'LOW RISK';
  } else if (finalScore >= 50) {
    color = '#f59e0b';
    level = 'SUSPICIOUS';
  }

  if (feedback.length === 0) {
    feedback.push('Excellent strong password! Keep it unique and never use it on multiple websites.');
  }

  return {
    score: finalScore,
    level,
    fillWidth: `${finalScore}%`,
    color,
    feedback,
  };
}

// Preset samples for easy one-click testing
export const SAMPLES = {
  electricityScam: 'Dear consumer your electricity power will be disconnected at 9:30 PM tonight from electricity office because previous month bill was not updated. Please immediately contact our power officer at 9812345678.',
  digitalArrest: 'CBI Cyber Crime Cell: A courier parcel sent to Mumbai containing 5 passports and illegal narcotics drugs has been seized in your name. You are placed under DIGITAL ARREST. Join Skype video interrogation immediately or police team will arrest you.',
  bankKyc: 'URGENT: Dear Customer, Your SBI NetBanking access will be BLOCKED today due to incomplete KYC verification. Click here immediately to update your Aadhaar & PAN: http://sbi-kyc-update-portal.online/auth or your account will be suspended within 2 hours.',
  upiCashback: 'Congratulations! You won Rs 2,500 cashback reward on Google Pay. Scan this QR code and enter your UPI PIN to claim your prize into your bank account immediately.',
  youtubeJob: 'Dear Candidate, Amazon HR has shortlisted you for Work From Home Part-Time job. Earn Rs 3,000 to Rs 8,000 daily by simply rating products and subscribing to YouTube channels. Contact our Telegram manager @amazon_jobs_in.',
  lotteryWin: 'CONGRATULATIONS! Your mobile number has been selected as the 1st winner of Rs 25,00,000 in KBC Lucky Draw 2026. To claim your cash prize, pay the registration & tax fee of Rs 4,500 via UPI immediately. Call Rana Pratap Singh on WhatsApp.',
  legitOtp: '849201 is your Google verification code. Never share this code with anyone. Google will never call to ask for this code.',
  legitBankAlert: 'Rs. 450.00 debited from A/c XX8921 on 11-Sep-26. Info: Swiggy. Avail Bal: Rs. 14,250.75. If not done by you, call 18002586161 immediately.',
  suspiciousUrl: 'http://192.168.1.104/secure-bank-login/verify.html?user=active',
  punycodeUrl: 'https://xn--appl-45d.com/support/login',
  phishingEmail: {
    name: 'PayPal Security Team',
    email: 'security-alert@gmail.com',
    subject: 'Urgent: Unusual sign-in detected on your account. Action required.',
    body: 'We detected an unauthorized sign-in from an unknown device in Moscow. If this was not you, your account will be permanently locked within 24 hours. Download the attached security verification form and confirm your card details.',
  }
};
