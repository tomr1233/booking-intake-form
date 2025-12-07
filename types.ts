export interface IntakeFormData {
  // Step 1: Basics
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  companyName: string;
  
  // Step 2: Current Reality (The Numbers)
  currentRevenue: string;
  teamSize: string;
  primaryService: string;
  averageDealSize: string; // Added for financial depth
  biggestBottleneck: string; // The "Pain"
  
  // Step 3: Process & Operations (The Machine)
  acquisitionSource: string; // How they get leads
  salesProcess: string; // How they close
  fulfillmentWorkflow: string; // How they deliver
  currentTechStack: string; // Tools they use
  
  // Step 4: Desired Future (The Vision)
  revenueGoal: string;
  dreamOutcome: string; // The "Gain"
  magicWandScenario: string; // "If you could wave a magic wand..."
  commitmentLevel: number; // 1-10
}

export interface AnalysisResult {
  executiveSummary: string;
  clientPsychology: string; // Analyzing their language
  operationalGapAnalysis: string; // New: Specific critique of their process
  redFlags: string[];
  greenFlags: string[];
  strategicQuestions: string[]; // Questions to ask on the call
  closingStrategy: string; // How to bridge the gap
  estimatedFitScore: number; // 0-100
}

export enum FormStep {
  BASICS = 0,
  CURRENT_REALITY = 1,
  PROCESS_OPS = 2,
  DREAM_FUTURE = 3,
  REVIEW = 4,
}