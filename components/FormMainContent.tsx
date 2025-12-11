import React from 'react';

interface FormMainContentProps {
  stepIndex: number;
  stepsCount: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

// Step progress bar component
const StepProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps
}) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs uppercase tracking-[0.15em] text-brand-600 font-medium">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
    <div className="flex gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i <= currentStep ? 'bg-brand-500' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  </div>
);

export const FormMainContent: React.FC<FormMainContentProps> = ({
  stepIndex,
  stepsCount,
  title,
  description,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden max-w-2xl w-full mx-4">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10">
        {/* Step Progress Bar */}
        <StepProgressBar currentStep={stepIndex} totalSteps={stepsCount} />

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-base md:text-lg mb-8 max-w-md leading-relaxed">
          {description}
        </p>

        {/* Form Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute bottom-8 right-8 w-24 h-24 opacity-30 pointer-events-none hidden md:block">
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="58" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
          <circle cx="60" cy="60" r="40" stroke="#E2E8F0" strokeWidth="1"/>
          <circle cx="60" cy="60" r="20" stroke="#8B5CF6" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
};
