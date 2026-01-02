
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ValidationResult {
  isAuthentic: boolean;
  impactScore: number;
  justification: string;
  suggestedTokens: number;
}

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
    // Enforce protocol caps
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
