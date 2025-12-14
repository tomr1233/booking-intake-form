import React from 'react';

export const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>

            <p className="text-slate-600 mb-2">
              Your application has been submitted successfully.
            </p>

            <p className="text-slate-500 text-sm">
              We'll review your information and see you on the call!
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is secure and confidential.
          </span>
        </p>
      </div>
    </div>
  );
};
