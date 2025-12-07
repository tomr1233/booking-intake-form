import React, { useState } from 'react';
import { IntakeFormData, FormStep, AnalysisResult } from '../types';
import { analyzeIntakeForm } from '../services/geminiService';
import { TextInput, TextArea, RangeSlider, Button, CheckIcon, ChevronRightIcon } from './UIComponents';

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

interface IntakeWizardProps {
  onAnalysisComplete: (data: IntakeFormData, analysis: AnalysisResult) => void;
}

export const IntakeWizard: React.FC<IntakeWizardProps> = ({ onAnalysisComplete }) => {
  const [step, setStep] = useState<FormStep>(FormStep.BASICS);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateField = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic validation could go here
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
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

  // --- Render Steps ---

  const renderStepIndicator = () => {
    const steps = [
      { id: FormStep.BASICS, label: 'The Basics' },
      { id: FormStep.CURRENT_REALITY, label: 'Numbers' },
      { id: FormStep.PROCESS_OPS, label: 'Process' },
      { id: FormStep.DREAM_FUTURE, label: 'Vision' },
    ];

    return (
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center bg-white px-2">
                <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                        isActive ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-200' : 
                        isCompleted ? 'border-brand-600 bg-white text-brand-600' : 
                        'border-slate-200 bg-white text-slate-300'
                    }`}
                >
                    {isCompleted ? <CheckIcon /> : idx + 1}
                </div>
                <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${isActive ? 'text-brand-700' : 'text-slate-400'}`}>
                    {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepIndicator()}
      
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {step === FormStep.BASICS && (
          <div className="space-y-6 animate-fade-in relative z-10 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800">Who are you?</h2>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="First Name" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Jane" />
              <TextInput label="Last Name" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Doe" />
            </div>
            <TextInput label="Work Email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="jane@company.com" />
            <div className="grid grid-cols-2 gap-4">
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
                Next Step <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}

        {step === FormStep.CURRENT_REALITY && (
          <div className="space-y-6 animate-fade-in relative z-10 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800">Current Reality (The Numbers)</h2>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Current Monthly Revenue" value={formData.currentRevenue} onChange={e => updateField('currentRevenue', e.target.value)} placeholder="$50k/mo" />
              <TextInput label="Average Deal Size ($)" value={formData.averageDealSize} onChange={e => updateField('averageDealSize', e.target.value)} placeholder="$2,500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                Next Step <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}

        {step === FormStep.PROCESS_OPS && (
          <div className="space-y-6 animate-fade-in relative z-10 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800">Process & Operations (Deep Dive)</h2>
            <p className="text-slate-500 text-sm -mt-4">Help us understand the mechanics of your business.</p>
            
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

            <div className="pt-4 flex justify-between mt-auto">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!formData.acquisitionSource}>
                Next Step <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}

        {step === FormStep.DREAM_FUTURE && (
          <div className="space-y-6 animate-fade-in relative z-10 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800">The Vision (Desired Future)</h2>
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

            <div className="pt-4 flex justify-between mt-auto">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleSubmit} isLoading={isAnalyzing} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Submit Application'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Privacy Note */}
      <p className="text-center text-xs text-slate-400 mt-6">
        <span className="inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Your information is secure and confidential.
        </span>
      </p>
    </div>
  );
};