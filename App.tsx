import React, { useState } from 'react';
import { IntakeWizard } from './components/IntakeWizard';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { IntakeFormData, AnalysisResult } from './types';

const App: React.FC = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (data: IntakeFormData, result: AnalysisResult) => {
    setFormData(data);
    setAnalysis(result);
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setHasSubmitted(false);
    setFormData(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-brand-500/20 shadow-lg">C</div>
              <span className="font-bold text-lg tracking-tight text-slate-900">Clarity</span>
            </div>
            {hasSubmitted && (
                <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                        Analysis Complete
                    </span>
                </div>
            )}
          </div>
        </div>
      </nav>

      <main className="py-12 px-4 sm:px-6">
        {!hasSubmitted ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
                Let's scale your vision.
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-slate-600">
                Complete this intake to help us understand your business bottleneck. 
                Our AI will instantly analyze your submission to prepare for our strategic consult.
              </p>
            </div>
            <IntakeWizard onAnalysisComplete={handleAnalysisComplete} />
          </div>
        ) : (
          formData && analysis && (
            <AnalysisDashboard 
              data={formData} 
              analysis={analysis} 
              onReset={handleReset} 
            />
          )
        )}
      </main>
      
      {/* Utility Styles for specific animations not in standard tailwind cdn */}
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
