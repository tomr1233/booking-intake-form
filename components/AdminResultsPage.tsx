import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAdminResults, AdminResponse } from '../services/api';
import { AnalysisDashboard } from './AnalysisDashboard';

export const AdminResultsPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<AdminResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchResults = async () => {
      try {
        const result = await getAdminResults(token);
        setData(result);

        // Keep polling if still processing
        if (result.status === 'pending' || result.status === 'processing') {
          setTimeout(fetchResults, 3000);
        }
      } catch (e) {
        setError('Failed to load results');
      }
    };

    fetchResults();
  }, [token]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.status === 'pending' || data.status === 'processing') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Analyzing submission...</p>
          <p className="text-slate-400 text-sm mt-2">This usually takes 10-30 seconds</p>
        </div>
      </div>
    );
  }

  if (data.status === 'failed' || !data.analysis) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Analysis failed</p>
          <p className="text-slate-500 text-sm mt-2">Please contact support if this persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <AnalysisDashboard
        data={data.submission}
        analysis={data.analysis}
        onReset={() => {}}
      />
    </div>
  );
};
