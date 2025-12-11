import React, { useState } from 'react';
import { IntakeFormData, FormStep, AnalysisResult } from '../types';
import { analyzeIntakeForm } from '../services/geminiService';
import { TextInput, TextArea, RangeSlider, Button, ChevronRightIcon } from './UIComponents';
import { FormMainContent } from './FormMainContent';

const INITIAL_DATA: IntakeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  website: '',
  companyName: '',
  reasonForBooking: '',
  howDidYouHear: '',
  currentRevenue: '',
  teamSize: '',
  primaryService: '',
  averageDealSize: '',
  biggestBottleneck: '',
  isDecisionMaker: '',
  previousAgencyExperience: '',
  acquisitionSource: '',
  salesProcess: '',
  fulfillmentWorkflow: '',
  currentTechStack: '',
  revenueGoal: '',
  dreamOutcome: '',
  magicWandScenario: '',
  commitmentLevel: 5,
  timeline: '',
};

// Step metadata for sidebar navigation
const FORM_STEPS = [
  {
    id: 'basics',
    label: 'The Basics',
    subtitle: "Let's get acquainted",
    title: 'Who are you?',
    description: "We'd love to know a bit about you and your company. This helps us tailor your experience.",
  },
  {
    id: 'numbers',
    label: 'Numbers',
    subtitle: 'Your metrics matter',
    title: 'Current Reality',
    description: 'Tell us about where your business stands today. The numbers help us understand your scale.',
  },
  {
    id: 'process',
    label: 'Process',
    subtitle: 'How you work',
    title: 'Process & Operations',
    description: 'Help us understand the mechanics of your business from acquisition to delivery.',
  },
  {
    id: 'vision',
    label: 'Vision',
    subtitle: "Where you're headed",
    title: 'The Vision',
    description: 'What does success look like for you? Share your goals and dreams.',
  },
];

interface IntakeWizardProps {
  onAnalysisComplete: (data: IntakeFormData, analysis: AnalysisResult) => void;
}

export const IntakeWizard: React.FC<IntakeWizardProps> = ({ onAnalysisComplete }) => {
  const [step, setStep] = useState<FormStep>(FormStep.WELCOME);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [highestStepReached, setHighestStepReached] = useState<FormStep>(FormStep.WELCOME);

  const updateField = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setStep(prev => {
      const next = prev + 1;
      setHighestStepReached(current => Math.max(current, next) as FormStep);
      return next;
    });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= highestStepReached && targetStep >= FormStep.BASICS) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeIntakeForm(formData);
      onAnalysisComplete(formData, result);
    } catch (e) {
      console.error(e);
      alert("Something went wrong with the AI analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Render Welcome Screen ---
  const renderWelcome = () => (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 animate-scale-in">
    <div className="max-w-2xl mx-auto px-4 w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="space-y-8 animate-fade-in relative z-10 flex-grow flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Thank You for Booking!
          </h1>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-brand-600 uppercase tracking-wide">
              Express Next Information Form
            </p>
            <p className="text-slate-600">
              Required to fill this out before call
            </p>
          </div>

          <p className="text-sm text-slate-500 italic">
            *takes 1 minute*
          </p>

          <div className="pt-4">
            <Button onClick={nextStep}>
              Let's Get Started <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <p className="text-center text-xs text-slate-400 mt-6">
        <span className="inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Your information is secure and confidential.
        </span>
      </p>
    </div>
    </div>
  );

  // --- Render Step Content ---
  const renderStepContent = () => {
    switch (step) {
      case FormStep.BASICS:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="First Name" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Jane" />
              <TextInput label="Last Name" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Doe" />
            </div>
            <TextInput label="Work Email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="jane@company.com" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Company Name" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="Acme Inc." />
              <TextInput label="Website URL" value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="acme.com" />
            </div>
            <TextArea
                label="Reason for Booking"
                subLabel="What prompted you to book this call today?"
                value={formData.reasonForBooking}
                onChange={e => updateField('reasonForBooking', e.target.value)}
                placeholder="I'm looking to scale my business and need help with..."
            />
            <TextInput
                label="How did you hear about us?"
                value={formData.howDidYouHear}
                onChange={e => updateField('howDidYouHear', e.target.value)}
                placeholder="Google, LinkedIn, referral, podcast..."
            />
            <div className="pt-4 flex justify-end mt-auto">
              <Button onClick={nextStep} disabled={!formData.firstName || !formData.email}>
                Continue <ChevronRightIcon />
              </Button>
            </div>
          </>
        );

      case FormStep.CURRENT_REALITY:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Current Monthly Revenue" value={formData.currentRevenue} onChange={e => updateField('currentRevenue', e.target.value)} placeholder="$50k/mo" />
              <TextInput label="Average Deal Size ($)" value={formData.averageDealSize} onChange={e => updateField('averageDealSize', e.target.value)} placeholder="$2,500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Team Size" value={formData.teamSize} onChange={e => updateField('teamSize', e.target.value)} placeholder="5 employees" />
              <TextInput label="Primary Service/Product" value={formData.primaryService} onChange={e => updateField('primaryService', e.target.value)} placeholder="e.g. SEO Services" />
            </div>
            <TextArea
              label="What is your BIGGEST bottleneck right now?"
              subLabel="Be honest. What keeps you up at night?"
              value={formData.biggestBottleneck}
              onChange={e => updateField('biggestBottleneck', e.target.value)}
              placeholder="We have leads, but our closing rate is terrible..."
            />
            <div className="pt-6 flex justify-between">
            
            <TextArea
                label="What is your BIGGEST bottleneck right now?"
                subLabel="Be honest. What keeps you up at night?"
                value={formData.biggestBottleneck}
                onChange={e => updateField('biggestBottleneck', e.target.value)}
                placeholder="We have leads, but our closing rate is terrible..."
            />

            <TextInput
                label="Are you the decision-maker?"
                value={formData.isDecisionMaker}
                onChange={e => updateField('isDecisionMaker', e.target.value)}
                placeholder="Yes / No, my business partner is also involved..."
            />

            <TextArea
                label="Have you worked with an agency or consultant before?"
                subLabel="If so, what was that experience like?"
                value={formData.previousAgencyExperience}
                onChange={e => updateField('previousAgencyExperience', e.target.value)}
                placeholder="Yes, we worked with XYZ agency for 6 months. It was..."
            />

            <div className="pt-4 flex justify-between mt-auto">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!formData.currentRevenue || !formData.biggestBottleneck}>
                Continue <ChevronRightIcon />
              </Button>
            </div>
          </>
        );

      case FormStep.PROCESS_OPS:
        return (
          <>
            <TextArea
              label="Acquisition: How do strangers become leads?"
              subLabel="Cold outreach? Ads? Referrals? Walk us through the top of funnel."
              value={formData.acquisitionSource}
              onChange={e => updateField('acquisitionSource', e.target.value)}
              placeholder="We mostly rely on referrals, but we're trying Facebook ads with mixed results..."
              className="min-h-[100px]"
            />
            <TextArea
              label="Sales: What is your sales process?"
              subLabel="Who takes the calls? How many steps? Do you use a script?"
              value={formData.salesProcess}
              onChange={e => updateField('salesProcess', e.target.value)}
              placeholder="I take all the calls personally. It's a 2-call close..."
              className="min-h-[100px]"
            />
            <TextArea
              label="Fulfillment: How is the work delivered?"
              subLabel="Is it custom every time? Productized? Who handles delivery?"
              value={formData.fulfillmentWorkflow}
              onChange={e => updateField('fulfillmentWorkflow', e.target.value)}
              placeholder="It's very manual. I have to oversee every project..."
              className="min-h-[100px]"
            />
            <TextInput
              label="Key Tech Stack"
              value={formData.currentTechStack}
              onChange={e => updateField('currentTechStack', e.target.value)}
              placeholder="HubSpot, Slack, ClickUp, Zapier..."
            />
            <div className="pt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!formData.acquisitionSource}>
                Continue <ChevronRightIcon />
              </Button>
            </div>
          </>
        );

      case FormStep.DREAM_FUTURE:
        return (
          <>
            <TextInput label="Revenue Goal (12 months)" value={formData.revenueGoal} onChange={e => updateField('revenueGoal', e.target.value)} placeholder="$200k/mo" />
            <TextArea
              label="Describe your Dream Outcome"
              subLabel="Beyond money, what does success look like for your lifestyle?"
              value={formData.dreamOutcome}
              onChange={e => updateField('dreamOutcome', e.target.value)}
              placeholder="I want to remove myself from delivery and focus on strategy..."
            />
            <TextArea
              label="The Magic Wand Question"
              subLabel="If you could wave a magic wand and fix one thing instantly, what would it be?"
              value={formData.magicWandScenario}
              onChange={e => updateField('magicWandScenario', e.target.value)}
              placeholder="I would instantly clone my best sales rep..."
            />
            <div className="py-2">
              <RangeSlider
                label="How committed are you to fixing this NOW?"
                value={formData.commitmentLevel}
                onChange={(v) => updateField('commitmentLevel', v)}
              />
            
            <TextInput
                label="Timeline — When are you looking to get started?"
                value={formData.timeline}
                onChange={e => updateField('timeline', e.target.value)}
                placeholder="Immediately, within 2 weeks, next month..."
            />

            <div className="py-2">
                <RangeSlider
                    label="How committed are you to fixing this NOW?"
                    value={formData.commitmentLevel}
                    onChange={(v) => updateField('commitmentLevel', v)}
                />
            </div>
            <div className="pt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleSubmit} isLoading={isAnalyzing} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Submit Application'}
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // --- Render Form Layout (Centered Content) ---
  const renderFormLayout = () => {
    const currentStepData = FORM_STEPS[step];

    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center animate-fade-in">
        <FormMainContent
          stepIndex={step}
          stepsCount={FORM_STEPS.length}
          title={currentStepData.title}
          description={currentStepData.description}
        >
          {renderStepContent()}
        </FormMainContent>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <>
      {step === FormStep.WELCOME ? renderWelcome() : renderFormLayout()}
    </>
  );
};
