import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntakeWizard } from './components/IntakeWizard';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminResultsPage } from './components/AdminResultsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<IntakeWizard />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/admin/:token" element={<AdminResultsPage />} />
          </Routes>
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
    </BrowserRouter>
  );
};

export default App;
