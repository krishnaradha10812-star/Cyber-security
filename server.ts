import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // AI Deep Scan Endpoint
  app.post('/api/analyze', async (req, res) => {
    try {
      const { type, content, imageBase64, mimeType } = req.body;

      if (!content && !imageBase64) {
        return res.status(400).json({ error: 'No content or image provided' });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server',
          fallbackToLocal: true,
        });
      }

      const systemInstruction = `You are CyberGuard AI, an elite cybersecurity and scam forensic analyst.
Your job is to analyze incoming SMS, WhatsApp chats, emails, links, or screenshots with extreme accuracy.
CRITICAL INSTRUCTIONS:
1. USE EASY, PLAIN ENGLISH: Explain everything in simple everyday words without complex jargon so any person can understand instantly.
2. ACCURATE SCAM PREDICTION:
   - Identify real-world scam patterns: Electricity bill cut-off threats, Digital Arrest (police/CBI/customs video call threats), Bank KYC/PAN/NetBanking block threats, UPI PIN receive scams, Telegram work-from-home YouTube task scams, Courier seized drug packages, KBC lottery/cashback rewards, APK malware files, Fake customer care numbers.
   - ACCURATELY IDENTIFY SAFE MESSAGES: Normal OTP codes that say "Do NOT share with anyone" are LEGITIMATE security alerts (LOW RISK: 5-15). Transaction debit alerts from real banks without phishing links are LEGITIMATE (LOW RISK). Normal workplace emails or casual friend messages are LEGITIMATE (LOW RISK: 0-10).
3. SHARP FORENSIC BREAKDOWN:
   - Provide exact threat sub-scores (0-100%) for Impersonation, Urgency, Financial Loss Risk, and Link/Technical Risk.
   - Extract the exact trap phrases found in the message (e.g., "power disconnected tonight", "enter UPI PIN", "call officer").
   - Risk Levels:
     * 0 to 29: LOW RISK (Safe, legitimate, informational)
     * 30 to 59: SUSPICIOUS (Ambiguous, unverified, caution required)
     * 60 to 100: HIGH RISK (Direct scam, intimidation, credential/money theft)

Output MUST follow the exact JSON schema.`;

      const contents: any = [];

      if (imageBase64) {
        contents.push({
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: imageBase64,
          },
        });
      }

      const textPrompt = `Perform a forensic threat check on this ${type || 'communication'}:\n\n${content || '(Inspect attached screenshot)'}`;
      contents.push({ text: textPrompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: {
                type: Type.INTEGER,
                description: 'Overall risk score between 0 and 100',
              },
              level: {
                type: Type.STRING,
                description: 'LOW RISK, SUSPICIOUS, or HIGH RISK',
              },
              confidence: {
                type: Type.INTEGER,
                description: 'Confidence percentage between 60 and 99',
              },
              sender: {
                type: Type.STRING,
                description: 'Who is claiming to contact you in plain English (e.g. Electricity Department, SBI Bank, Real Friend)',
              },
              action: {
                type: Type.STRING,
                description: 'What they are asking you to do in easy words (e.g. Call a personal mobile number, Click a link, Send money)',
              },
              motivation: {
                type: Type.STRING,
                description: 'What the scammer actually wants (e.g. Steal your UPI PIN, Panic you into paying money)',
              },
              plainEnglishSummary: {
                type: Type.STRING,
                description: 'A 1 to 2 sentence crystal-clear explanation in simple everyday English',
              },
              verdict: {
                type: Type.STRING,
                description: 'Clear forensic breakdown of why this is safe or dangerous',
              },
              trapPhrases: {
                type: Type.ARRAY,
                description: 'Exact words or sentences found in the message that are red flags or traps',
                items: { type: Type.STRING },
              },
              threatVectors: {
                type: Type.OBJECT,
                description: 'Sharp sub-scores from 0 to 100 percent for each threat factor',
                properties: {
                  impersonation: { type: Type.INTEGER, description: '0 to 100 percent score' },
                  urgency: { type: Type.INTEGER, description: '0 to 100 percent score' },
                  financialLoss: { type: Type.INTEGER, description: '0 to 100 percent score' },
                  linkRisk: { type: Type.INTEGER, description: '0 to 100 percent score' },
                },
                required: ['impersonation', 'urgency', 'financialLoss', 'linkRisk'],
              },
              warnings: {
                type: Type.ARRAY,
                description: 'Array of detected warning signals',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: 'Short title in easy English' },
                    severity: { type: Type.STRING, description: 'low, mid, or high' },
                    weight: { type: Type.INTEGER },
                    evidence: { type: Type.STRING, description: 'Evidence found in message' },
                    explanation: { type: Type.STRING, description: 'Explanation in easy English' },
                    remediation: { type: Type.STRING, description: 'Simple advice on what to do' },
                  },
                  required: ['type', 'severity', 'weight', 'evidence', 'explanation', 'remediation'],
                },
              },
              actions: {
                type: Type.ARRAY,
                description: 'Clear step-by-step actions to protect yourself right now',
                items: { type: Type.STRING },
              },
            },
            required: [
              'score',
              'level',
              'confidence',
              'sender',
              'action',
              'motivation',
              'plainEnglishSummary',
              'verdict',
              'trapPhrases',
              'threatVectors',
              'warnings',
              'actions',
            ],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({
        ...parsedData,
        isAiGenerated: true,
        modelUsed: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini analysis error:', err);
      res.status(500).json({
        error: 'Failed to complete AI analysis',
        message: err.message,
        fallbackToLocal: true,
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CyberGuard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
