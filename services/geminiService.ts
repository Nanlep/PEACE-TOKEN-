
import { GoogleGenAI, Type } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines
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
      contents: `Perform a rigorous audit of this peace-building project for an enterprise-grade protocol. 
      Analyze the logic for: 
      1. Non-violent alignment.
      2. Measurable impact metrics.
      3. Verifiability of the evidence hash: ${evidenceHash}.
      
      Project Title: ${title}
      Project Summary: ${description}`,
      config: {
        systemInstruction: "You are the Chief Validation Officer of the Peace-Token Protocol. Be skeptical, rigorous, and strictly objective. Ensure no double-counting of impact.",
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAuthentic: { type: Type.BOOLEAN },
            impactScore: { type: Type.NUMBER, description: "Scale 0-100" },
            justification: { type: Type.STRING },
            suggestedTokens: { type: Type.NUMBER, description: "Capped at 5000 PT per submission" }
          },
          required: ["isAuthentic", "impactScore", "justification", "suggestedTokens"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    if (result.suggestedTokens > 5000) result.suggestedTokens = 5000;
    return result;
  } catch (error) {
    console.error("Critical Oracle Failure:", error);
    return {
      isAuthentic: false,
      impactScore: 0,
      justification: "System failure during consensus. Submission has been quarantined for manual audit.",
      suggestedTokens: 0
    };
  }
};

/**
 * Performs an AI-driven audit of institutional credentials for Level 3 (INSTITUTION) upgrades.
 * Note: This result is a 'Pre-Approval' which must be signed by System Guardians.
 */
export const auditInstitutionalIdentity = async (
  entityName: string,
  credentialsHash: string
): Promise<IdentityAuditResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Audit institutional entity: ${entityName}. 
      Cross-reference provided credentials hash: ${credentialsHash} against known risk profiles for peace-building organizations.
      Look for:
      1. Operational history.
      2. Compliance with international non-profit standards.
      3. Potential conflict of interest in the current geopolitical landscape.`,
      config: {
        systemInstruction: "You are the Compliance Auditor for the Peace-Token Protocol. Evaluate institutional legitimacy. Score risk from 0 (Safe) to 100 (High Risk). Approval requires risk < 20. Your approval constitutes a 'PRE-APPROVAL' recommendation for final System Guardian review.",
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
    console.error("Identity Audit Failure:", error);
    return {
      isApproved: false,
      riskScore: 100,
      reasoning: "Protocol internal audit service is currently unreachable.",
      verificationId: "ERR_AUDIT_FAIL"
    };
  }
};
