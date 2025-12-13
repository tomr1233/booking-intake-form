import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IntakeFormData, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A 2-sentence summary of the prospect's business and core problem.",
    },
    clientPsychology: {
      type: Type.STRING,
      description: "Analysis of the prospect's mindset based on their writing style (e.g., frustrated, ambitious, skeptical).",
    },
    operationalGapAnalysis: {
        type: Type.STRING,
        description: "A critical look at their acquisition, sales, and fulfillment processes. Identify the specific broken link in their chain.",
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Potential risks or reasons to disqualify this lead.",
    },
    greenFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Positive indicators that they are a high-value client.",
    },
    strategicQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 deep-dive questions to ask on the call to expose pain or build authority.",
    },
    closingStrategy: {
      type: Type.STRING,
      description: "A specific angle to pitch the solution based on their desired outcome.",
    },
    estimatedFitScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how good of a fit they are.",
    },
  },
  required: ["executiveSummary", "clientPsychology", "operationalGapAnalysis", "redFlags", "greenFlags", "strategicQuestions", "closingStrategy", "estimatedFitScore"],
};

export const analyzeIntakeForm = async (data: IntakeFormData): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Act as a world-class business consultant and sales strategist. 
      Analyze the following intake form data from a new prospect booking a discovery call.
      
      DATA:
      Name: ${data.firstName} ${data.lastName}
      Company: ${data.companyName} (${data.website})
      
      CURRENT FINANCIALS:
      Current Revenue: ${data.currentRevenue}
      Average Deal Size: ${data.averageDealSize}
      Team Size: ${data.teamSize}
      Primary Service: ${data.primaryService}
      Biggest Bottleneck: ${data.biggestBottleneck}

      PROCESS & OPERATIONS (Deep Dive):
      Client Acquisition (How they get leads): ${data.acquisitionSource}
      Sales Process (How they close): ${data.salesProcess}
      Fulfillment/Delivery (How they do the work): ${data.fulfillmentWorkflow}
      Tech Stack: ${data.currentTechStack}
      
      FUTURE GOALS:
      Desired Outcome: ${data.desiredOutcome}
      Desired Speed: ${data.desiredSpeed}
      
      Your goal is to prepare me for the sales call. 
      Identify the gap between their current reality and desired future.
      Look for inconsistencies in their process descriptions.
      Determine if they are a "tire kicker" or a serious buyer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert sales analyst. Be direct, critical, and strategic. Do not fluff the response.",
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return a fallback structure in case of API failure to prevent app crash
    return {
      executiveSummary: "Analysis unavailable. Please review raw data.",
      clientPsychology: "Unknown",
      operationalGapAnalysis: "Could not analyze operations.",
      redFlags: ["System error - manual review required"],
      greenFlags: [],
      strategicQuestions: ["Could you elaborate on your submission?"],
      closingStrategy: "Listen actively.",
      estimatedFitScore: 50,
    };
  }
};