export interface IntakeFormData {
  // Step 1: Basics
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  companyName: string;
  reasonForBooking: string; // Why are they booking this call?
  howDidYouHear: string; // Marketing channel tracking

  // Step 2: Current Reality (The Numbers)
  currentRevenue: string;
  teamSize: string;
  primaryService: string;
  averageDealSize: string; // Added for financial depth
  marketingBudget: string; // Sales/marketing budget for growth
  isDecisionMaker: string; // Are they the decision-maker?
  previousAgencyExperience: string; // Past agency/consultant experience

  // Step 3: Process & Operations (The Machine)
  acquisitionSource: string; // How they get leads
  salesProcess: string; // How they close
  fulfillmentWorkflow: string; // How they deliver
  currentTechStack: string; // Tools they use

  // Step 4: Desired Future (The Vision)
  desiredOutcome: string; // What outcome would make this worth it
  desiredSpeed: string; // Desired speed of results
  readyToScale: string; // Ready to scale with a growth system
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
  WELCOME = -1,
  BASICS = 0,
  CURRENT_REALITY = 1,
  DREAM_FUTURE = 2,
  REVIEW = 3,
}