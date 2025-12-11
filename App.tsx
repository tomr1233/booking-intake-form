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
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                      src="https://storage.expressnext.app/ENextLogo.png"
                      alt="Logo"
                      className="h-7 w-7"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 blur-lg opacity-40" />
                </div>
                <span className="text-2xl font-mono font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
        ExpressNext
      </span>
              </div>
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

      <main className={hasSubmitted ? "py-12 px-4 sm:px-6" : ""}>
        {!hasSubmitted ? (
          <IntakeWizard onAnalysisComplete={handleAnalysisComplete} />
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
        @keyframes slideInFromRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-in {
            animation: slideInFromRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-scale-in {
            animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
