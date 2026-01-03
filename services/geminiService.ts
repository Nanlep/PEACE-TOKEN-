
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ValidationResult {
  isAuthentic: boolean;
  impactScore: number;
  justification: string;
  suggestedTokens: number;
}

export interface IdentityAuditResult {
  isApproved: boolean;
  riskScore: number;
  reasoning: string;
  verificationId: string;
}

/**
 * Validates a peace-building project using reasoning-based AI.
 */
export const validatePeaceProject = async (
  title: string, 
  description: string, 
  evidenceHash: string
): Promise<ValidationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a rigorous audit of this peace-building project. 
      Analyze: 
      1. Non-violent alignment.
      2. Measurable impact metrics.
      3. Verifiability of the evidence hash: ${evidenceHash}.
      
      Project Title: ${title}
      Project Summary: ${description}`,
      config: {
        systemInstruction: "You are the Chief Validation Officer of the Peace-Token Protocol. Be skeptical and strictly objective.",
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAuthentic: { type: Type.BOOLEAN },
            impactScore: { type: Type.NUMBER },
            justification: { type: Type.STRING },
            suggestedTokens: { type: Type.NUMBER }
          },
          required: ["isAuthentic", "impactScore", "justification", "suggestedTokens"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    if (result.suggestedTokens > 5000) result.suggestedTokens = 5000;
    return result;
  } catch (error) {
    return {
      isAuthentic: false,
      impactScore: 0,
      justification: "System failure during consensus.",
      suggestedTokens: 0
    };
  }
};

/**
 * Audits institutional credentials for Level 3 upgrades.
 */
export const auditInstitutionalIdentity = async (
  entityName: string,
  credentialsHash: string
): Promise<IdentityAuditResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Audit institutional entity: ${entityName}. Hash: ${credentialsHash}. 
      Evaluate operational history and compliance with international non-profit standards.`,
      config: {
        systemInstruction: "You are the Compliance Auditor for the Peace-Token Protocol. Approval requires risk < 20.",
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isApproved: { type: Type.BOOLEAN },
            riskScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            verificationId: { type: Type.STRING }
          },
          required: ["isApproved", "riskScore", "reasoning", "verificationId"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    return {
      isApproved: false,
      riskScore: 100,
      reasoning: "Audit service unreachable.",
      verificationId: "ERR_AUDIT_FAIL"
    };
  }
};

/**
 * Analyzes wallet history to prevent Sybil attacks.
 */
export const auditWalletReputation = async (walletAddress: string): Promise<{score: number, report: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze wallet address: ${walletAddress} for Sybil behavior, wash trading, or batch automated transfers.`,
      config: {
        systemInstruction: "You are an On-chain Forensic Analyst. Provide a reputation score from 0 (Bot/Malicious) to 100 (Trusted/Human).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            report: { type: Type.STRING }
          },
          required: ["score", "report"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (e) {
    return { score: 50, report: "Standard confidence assigned." };
  }
};

/**
 * Verifies if the captured frame matches the requested dynamic liveness challenge.
 */
export const verifyLivenessChallenge = async (
  imageDataBase64: string,
  challenge: string
): Promise<{isVerified: boolean, confidence: number}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: imageDataBase64 } },
        { text: `Does the subject in this image clearly perform the following challenge: "${challenge}"? Look for signs of deepfake injection or static photo manipulation.` }
      ],
      config: {
        systemInstruction: "You are a Biometric Security Auditor. Be extremely strict. Reject any signs of synthetic media.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isVerified: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER }
          },
          required: ["isVerified", "confidence"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (e) {
    return { isVerified: false, confidence: 0 };
  }
};
