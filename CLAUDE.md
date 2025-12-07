# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for the Gemini AI integration.

## Architecture

This is a React + TypeScript + Vite application called "Clarity" - a multi-step intake form wizard that collects business information and uses Google's Gemini AI to analyze prospects for sales calls.

### Core Flow

1. **IntakeWizard** (`components/IntakeWizard.tsx`) - Multi-step form with 4 stages: Basics, Current Reality, Process & Operations, Dream Future
2. **GeminiService** (`services/geminiService.ts`) - Sends form data to Gemini 2.5 Flash with structured JSON schema for consistent response format
3. **AnalysisDashboard** (`components/AnalysisDashboard.tsx`) - Displays AI analysis results including fit score, psychology profile, red/green flags, and strategic questions

### Key Types (`types.ts`)

- `IntakeFormData` - All form fields across the 4 wizard steps
- `AnalysisResult` - Structured AI response with executive summary, flags, questions, and fit score
- `FormStep` - Enum for wizard navigation states

### Styling

Uses Tailwind CSS (via CDN) with custom brand color utilities (e.g., `bg-brand-600`, `text-brand-700`). Custom animations defined inline in `App.tsx`.

### Path Alias

`@/*` maps to project root (configured in both `tsconfig.json` and `vite.config.ts`).
