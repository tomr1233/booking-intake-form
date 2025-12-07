import React from 'react';
import { AnalysisResult, IntakeFormData } from '../types';

interface AnalysisDashboardProps {
  data: IntakeFormData;
  analysis: AnalysisResult;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, analysis, onReset }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Pre-Call Dossier</h1>
            <p className="text-slate-500">Candidate: {data.firstName} {data.lastName} ({data.companyName})</p>
        </div>
        <button 
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-brand-600 underline"
        >
            Start New Intake
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Stats & Fit (Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Fit Score</h3>
            <div className="relative pt-2">
              <div className="flex items-end justify-between mb-2">
                <span className="text-5xl font-bold text-brand-600">{analysis.estimatedFitScore}</span>
                <span className="text-slate-400 mb-2">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-brand-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${analysis.estimatedFitScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Psychological Profile</h3>
            <p className="text-slate-700 leading-relaxed italic border-l-4 border-brand-200 pl-4 text-sm">
                "{analysis.clientPsychology}"
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Key Signals</h3>
            
            <div className="space-y-4">
                <div>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        RED FLAGS
                    </span>
                    <ul className="space-y-2">
                        {analysis.redFlags.length === 0 ? <li className="text-sm text-slate-400">None detected.</li> : 
                         analysis.redFlags.map((flag, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                {flag}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        GREEN FLAGS
                    </span>
                    <ul className="space-y-2">
                        {analysis.greenFlags.length === 0 ? <li className="text-sm text-slate-400">None detected.</li> :
                        analysis.greenFlags.map((flag, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                {flag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Center & Right: Strategic Brief (Spans 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h2>
                <p className="text-slate-700 leading-relaxed text-lg mb-6">
                    {analysis.executiveSummary}
                </p>
                <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Current: {data.currentRevenue}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                        Goal: {data.revenueGoal}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Commitment: {data.commitmentLevel}/10
                    </span>
                    {data.averageDealSize && (
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Deal Size: {data.averageDealSize}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg text-white p-6">
                    <h3 className="text-sm font-semibold text-brand-300 uppercase tracking-wider mb-3">The Pitch Angle</h3>
                    <p className="font-light leading-relaxed">
                        {analysis.closingStrategy}
                    </p>
                </div>
                <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6">
                    <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Operational Gap
                    </h3>
                    <p className="text-amber-900 leading-relaxed text-sm">
                        {analysis.operationalGapAnalysis}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Strategic Questions to Ask
                </h3>
                <div className="space-y-4">
                    {analysis.strategicQuestions.map((q, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-hover hover:bg-slate-100">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand-600 font-bold text-sm shadow-sm border border-slate-100 shrink-0">
                                {i + 1}
                            </span>
                            <p className="text-slate-800 font-medium pt-1">{q}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Raw Data Toggle */}
            <div className="border-t border-slate-200 pt-6">
                 <details className="group">
                    <summary className="flex cursor-pointer items-center text-sm font-medium text-slate-500 hover:text-slate-700">
                         View Raw Submission
                         <svg className="ml-2 h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="mt-4 bg-slate-50 rounded-lg p-4 text-xs font-mono text-slate-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {JSON.stringify(data, null, 2)}
                    </div>
                 </details>
            </div>
        </div>
      </div>
    </div>
  );
};