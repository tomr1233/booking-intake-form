import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, BarChart3, Target, Clock } from 'lucide-react';
import { IntakeFormData, FormStep } from '../types';
import { submitIntakeForm } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { StepIndicator, type StepDescriptor } from './StepIndicator';
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

const STEPS: StepDescriptor[] = [
  { id: 'welcome', name: 'Welcome', shortName: 'Start' },
  { id: 'numbers', name: 'The Numbers', shortName: 'Numbers' },
  { id: 'vision', name: 'The Vision', shortName: 'Vision' },
];

const FORM_CONTENT = {
  [FormStep.CURRENT_REALITY]: {
    eyebrow: '// STEP_01',
    title: 'Helpful Details',
    description:
      "Collecting these details will help us figure out if we're a good fit for your business.",
  },
  [FormStep.DREAM_FUTURE]: {
    eyebrow: '// STEP_02',
    title: 'The Vision',
    description: 'If we worked together what would success look like for you?',
  },
} as const;

const MARKETING_BUDGET_OPTIONS = [
  { value: 'none', label: 'No budget set aside' },
  { value: '<1k', label: '<$1k/month' },
  { value: '1k-2.5k', label: '$1k-$2.5k/month' },
  { value: '2.5k-5k', label: '$2.5k-$5k/month' },
  { value: '5k-10k', label: '$5k-$10k/month' },
  { value: '10k+', label: '$10k+/month' },
];

const READY_TO_SCALE_OPTIONS = [
  { value: 'yes', label: "Yes, I'm ready" },
  { value: 'unsure', label: 'Not sure yet' },
];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-secondary/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export const IntakeWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>(FormStep.WELCOME);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const nameParam = searchParams.get('name');
    const emailParam = searchParams.get('email');
    if (nameParam) setFormData((prev) => ({ ...prev, firstName: nameParam }));
    if (emailParam) setFormData((prev) => ({ ...prev, email: emailParam }));
  }, [searchParams]);

  const updateField = <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => (prev + 1) as FormStep);
  const prevStep = () => setStep((prev) => (prev - 1) as FormStep);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitIntakeForm(formData);
      navigate('/thank-you');
    } catch (e) {
      console.error(e);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <div className="space-y-6">
        <div>
          <div className="text-primary font-mono text-sm mb-2">// INTAKE_INIT</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {searchParams.get('name')
              ? `${searchParams.get('name')}, thanks for booking!`
              : 'Thank you for booking!'}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            A few quick questions so we can make the call worth your time.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">What we&apos;ll ask:</p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">The Numbers</p>
                <p className="text-xs text-muted-foreground">
                  A snapshot of your business so we can gauge fit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">The Vision</p>
                <p className="text-xs text-muted-foreground">
                  What success looks like if we work together
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">One Minute</p>
                <p className="text-xs text-muted-foreground">
                  That&apos;s all it takes — no long forms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={nextStep} size="lg" className="gap-2 font-mono">
            Let&apos;s Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-1 pt-4">
          <Shield className="w-3 h-3" />
          Your information is secure and confidential.
        </p>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case FormStep.CURRENT_REALITY:
        return (
          <>
            <SelectField
              label="Do you have a sales/marketing budget set aside for growth?"
              value={formData.marketingBudget}
              onValueChange={(v) => updateField('marketingBudget', v)}
              options={MARKETING_BUDGET_OPTIONS}
              placeholder="Select budget range..."
            />
            <Field
              label="Have you worked with an agency or consultant before?"
              subLabel="If so, what was that experience like?"
            >
              <Textarea
                value={formData.previousAgencyExperience}
                onChange={(e) => updateField('previousAgencyExperience', e.target.value)}
                placeholder="Yes, we worked with XYZ agency for 6 months. It was..."
                className="bg-secondary/50 min-h-[120px]"
              />
            </Field>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={prevStep} className="gap-2 font-mono">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={nextStep} className="gap-2 font-mono">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        );

      case FormStep.DREAM_FUTURE:
        return (
          <>
            <Field label="If we worked together, what outcome would make this worth it for you?">
              <Textarea
                value={formData.desiredOutcome}
                onChange={(e) => updateField('desiredOutcome', e.target.value)}
                placeholder="e.g., Double my revenue, free up my time, finally scale..."
                className="bg-secondary/50 min-h-[120px]"
              />
            </Field>
            <SelectField
              label="Are you ready to scale your business with a growth system if we're the right fit?"
              value={formData.readyToScale}
              onValueChange={(v) => updateField('readyToScale', v)}
              options={READY_TO_SCALE_OPTIONS}
              placeholder="Select an option..."
            />
            <div className="pt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep} className="gap-2 font-mono">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 font-mono"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const isFormStep = step === FormStep.CURRENT_REALITY || step === FormStep.DREAM_FUTURE;
  const currentFormContent = isFormStep ? FORM_CONTENT[step] : null;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      {isFormStep && (
        <div className="mb-10">
          <StepIndicator currentStep={step + 1} steps={STEPS} />
        </div>
      )}

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === FormStep.WELCOME && renderWelcome()}
          {isFormStep && currentFormContent && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormMainContent
                stepEyebrow={currentFormContent.eyebrow}
                title={currentFormContent.title}
                description={currentFormContent.description}
              >
                {renderStepContent()}
              </FormMainContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
