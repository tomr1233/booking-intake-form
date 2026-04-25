import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntakeWizard } from './components/IntakeWizard';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminResultsPage } from './components/AdminResultsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <nav className="bg-background border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-3">
              <img
                src="https://storage.expressnext.app/ENextLogo.png"
                alt="ExpressNext logo"
                className="h-7 w-7"
              />
              <span className="font-semibold text-lg">ExpressNext</span>
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
      </div>
    </BrowserRouter>
  );
};

export default App;
