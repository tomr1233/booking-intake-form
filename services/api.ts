import { IntakeFormData, AnalysisResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface SubmissionResponse {
  id: string;
  adminUrl: string;
}

export interface AdminResponse {
  submission: IntakeFormData;
  analysis: AnalysisResult | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedFitScore?: number;
}

export async function submitIntakeForm(data: IntakeFormData): Promise<SubmissionResponse> {
  const response = await fetch(`${API_URL}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Submission failed');
  }
  return response.json();
}

export async function getAdminResults(token: string): Promise<AdminResponse> {
  const response = await fetch(`${API_URL}/api/admin/${token}`);
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }
  return response.json();
}

export async function getAdminStatus(token: string): Promise<StatusResponse> {
  const response = await fetch(`${API_URL}/api/admin/${token}/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch status');
  }
  return response.json();
}
