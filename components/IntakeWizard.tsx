import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IntakeFormData, FormStep } from '../types';
import { submitIntakeForm } from '../services/api';
import { TextInput, TextArea, Button, ChevronRightIcon, Select } from './UIComponents';
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
  marketingBudget: '',
  isDecisionMaker: '',
  previousAgencyExperience: '',
  acquisitionSource: '',
  salesProcess: '',
  fulfillmentWorkflow: '',
  currentTechStack: '',
  desiredOutcome: '',
  desiredSpeed: '',
  readyToScale: '',
};

// Step metadata for sidebar navigation
const FORM_STEPS = [
  {
    id: 'numbers',
    label: 'Numbers',
    subtitle: 'Your metrics matter',
    title: 'Helpful Details',
    description: 'Collecting these details will help us get started easily',
  },
  {
    id: 'vision',
    label: 'Vision',
    subtitle: "Where you're headed",
    title: 'The Vision',
    description: 'What does success look like for you? If we worked together what would success look like.',
  },
];

// Dropdown options
const HOW_DID_YOU_HEAR_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'other', label: 'Other' },
];

const REVENUE_OPTIONS = [
  { value: '<10k', label: '<$10k' },
  { value: '10k-25k', label: '$10k-$25k' },
  { value: '25k-50k', label: '$25k-$50k' },
  { value: '50k-100k', label: '$50k-$100k' },
  { value: '100k-250k', label: '$100k-$250k' },
  { value: '250k+', label: '$250k+' },
];

const TEAM_SIZE_OPTIONS = [
  { value: '1', label: 'Just me' },
  { value: '2-5', label: '2-5' },
  { value: '6-10', label: '6-10' },
  { value: '11-25', label: '11-25' },
  { value: '26-50', label: '26-50' },
  { value: '50+', label: '50+' },
];

const DEAL_SIZE_OPTIONS = [
  { value: '<500', label: '<$500' },
  { value: '500-1k', label: '$500-$1k' },
  { value: '1k-2.5k', label: '$1k-$2.5k' },
  { value: '2.5k-5k', label: '$2.5k-$5k' },
  { value: '5k-10k', label: '$5k-$10k' },
  { value: '10k+', label: '$10k+' },
];

const DECISION_MAKER_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No - need partner/team approval' },
  { value: 'partial', label: 'Partial - final say on some decisions' },
];

const MARKETING_BUDGET_OPTIONS = [
  { value: 'none', label: 'No budget set aside' },
  { value: '<1k', label: '<$1k/month' },
  { value: '1k-2.5k', label: '$1k-$2.5k/month' },
  { value: '2.5k-5k', label: '$2.5k-$5k/month' },
  { value: '5k-10k', label: '$5k-$10k/month' },
  { value: '10k+', label: '$10k+/month' },
];

const TIMELINE_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '2_weeks', label: 'Within 2 weeks' },
  { value: '1_month', label: 'Within a month' },
  { value: '1-3_months', label: '1-3 months' },
  { value: 'exploring', label: 'Just exploring' },
];

const DESIRED_SPEED_OPTIONS = [
  { value: 'slow', label: 'Slow but steady' },
  { value: 'medium', label: 'Scale quickly in 90 days' },
  { value: 'aggressive', label: 'Aggressive growth' },
];

const READY_TO_SCALE_OPTIONS = [
  { value: 'yes', label: 'Yes, I\'m ready' },
  { value: 'unsure', label: 'Not sure yet' },
];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const IntakeWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>(FormStep.WELCOME);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highestStepReached, setHighestStepReached] = useState<FormStep>(FormStep.WELCOME);
  const [searchParams] = useSearchParams();

  // Pre-fill form from URL query parameters
  React.useEffect(() => {
    const nameParam = searchParams.get('name');
    const emailParam = searchParams.get('email');

    if (nameParam) {
      setFormData(prev => ({ ...prev, firstName: nameParam }));
    }
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const updateField = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const emailIsValid = formData.email === '' || isValidEmail(formData.email);
  const canProceedBasics = formData.firstName.trim() !== '' && isValidEmail(formData.email);

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
    if (targetStep <= highestStepReached && targetStep >= FormStep.CURRENT_REALITY) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitIntakeForm(formData);
      navigate('/thank-you');
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            {searchParams.get('name')
              ? `${searchParams.get('name')}, Thanks for Booking!`
              : 'Thank You for Booking!'}
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
      case FormStep.CURRENT_REALITY:
        return (
          <>
            <Select
              label="Do you have a sales/marketing budget set aside for growth?"
              value={formData.marketingBudget}
              onChange={e => updateField('marketingBudget', e.target.value)}
              options={MARKETING_BUDGET_OPTIONS}
              placeholder="Select budget range..."
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
              <Button onClick={nextStep}>
                Continue <ChevronRightIcon />
              </Button>
            </div>
          </>
        );

      case FormStep.DREAM_FUTURE:
        return (
          <>
            <TextArea
              label="If we worked together, what outcome would make this worth it for you?"
              value={formData.desiredOutcome}
              onChange={e => updateField('desiredOutcome', e.target.value)}
              placeholder="e.g., Double my revenue, free up my time, finally scale..."
            />
            <Select
              label="Are you ready to scale your business with a growth system if we're the right fit?"
              value={formData.readyToScale}
              onChange={e => updateField('readyToScale', e.target.value)}
              options={READY_TO_SCALE_OPTIONS}
              placeholder="Select an option..."
            />
            <div className="pt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
