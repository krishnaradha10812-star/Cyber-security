export type Language = 'en' | 'hi' | 'hinglish';

export type AnalyzerTab = 'message' | 'url' | 'email' | 'screenshot';

export type RiskLevel = 'LOW RISK' | 'SUSPICIOUS' | 'HIGH RISK';

export interface ThreatVectors {
  impersonation: number; // 0 - 100%
  urgency: number; // 0 - 100%
  financialLoss: number; // 0 - 100%
  linkRisk: number; // 0 - 100%
}

export interface WarningSignal {
  type: string;
  severity: 'low' | 'mid' | 'high';
  weight: number;
  evidence: string;
  explanation: string;
  remediation: string;
}

export interface AnalysisResult {
  score: number; // 0 - 100
  level: RiskLevel;
  confidence: number;
  sender: string;
  action: string;
  motivation: string;
  verdict: string;
  plainEnglishSummary?: string;
  trapPhrases?: string[];
  threatVectors?: ThreatVectors;
  warnings: WarningSignal[];
  actions: string[];
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  score: number;
  level: RiskLevel;
}

export interface QuizQuestion {
  question: string;
  answer: 'SAFE' | 'SCAM';
  explanation: string;
}

export interface LearnTopic {
  id: string;
  title: string;
  tag: string;
  description: string;
  warningSigns: string;
  safetyHabits: string;
}

export interface EmergencyGuide {
  id: string;
  title: string;
  iconName: string;
  urgency: 'HIGH' | 'CRITICAL';
  steps: string[];
  officialHelplines?: string[];
}
