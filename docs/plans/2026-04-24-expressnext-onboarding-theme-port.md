# ExpressNext Onboarding Theme Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every surface of the booking intake form to match the dark/cyan terminal theme used by the sibling `expressnext-onboarding` app, using installed Tailwind v4, shadcn-style primitives, and Framer Motion.

**Architecture:** Replace Tailwind CDN with a real Tailwind v4 + PostCSS install. Copy the onboarding project's `globals.css` tokens verbatim. Introduce shadcn-style component primitives (Button/Input/Textarea/Label/Select + a local Field wrapper) alongside a ported `StepIndicator`. Rewrite the wizard, welcome screen, thank-you page, admin page, and analysis dashboard against these new primitives. All business logic (routing, Gemini, form state, API submission, URL prefill, GitHub Actions deploy) is untouched.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind v4 (`@tailwindcss/vite` plugin), shadcn-style primitives (Radix UI + `class-variance-authority` + `tailwind-merge`), Framer Motion 12, lucide-react, `tw-animate-css`, Geist / Geist Mono via Google Fonts.

**Spec:** `docs/superpowers/specs/2026-04-23-expressnext-onboarding-theme-port-design.md`

---

## Ground rules

- **No test framework.** This project has no vitest/jest today; adding one is out of scope. Verification for each task is a mix of `npx tsc --noEmit`, `npm run build`, and a visual walkthrough in the browser (`npm run dev`) — the spec's "Testing & validation" section is authoritative.
- **Commits per task.** Each task ends with a commit — no squashing, no combining tasks.
- **Absolute paths.** Every file reference is relative to the repo root `/Users/tomraukete/workspace/github.com/tomr1233/booking-intake-form__worktrees/design-update/`.
- **Don't invent.** Source-of-truth files live under `/Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/` — when copying token/primitive content, read the file and copy verbatim (preserving `'use client'` directives; they're harmless in Vite). Do not translate or "improve" them.
- **Before claiming "done" on a task:** read @superpowers:verification-before-completion. Run the listed verification commands and confirm expected output before committing.
- **Old brand palette.** Grep `git grep -n "brand-"` until the only matches are in the spec or plan file; the build will fail otherwise because `brand-*` utilities don't exist in the new install.

## File structure map

### New files
- `styles.css` (root) — tokens + Tailwind v4 entry, copied from onboarding's `app/globals.css` with the terminal-green utility exposed inside `@theme inline`.
- `postcss.config.mjs` — PostCSS config wiring Tailwind v4.
- `lib/utils.ts` — shadcn `cn()` helper.
- `components/ui/button.tsx` — shadcn Button primitive (CVA variants).
- `components/ui/input.tsx` — shadcn Input primitive.
- `components/ui/textarea.tsx` — shadcn Textarea primitive.
- `components/ui/label.tsx` — Radix-based Label primitive.
- `components/ui/select.tsx` — Radix-based Select primitives.
- `components/ui/field.tsx` — local Field wrapper (Label + children + error line).
- `components/StepIndicator.tsx` — progress-bar + numbered-circle indicator ported from onboarding-wizard.

### Modified files
- `package.json` — new dependencies.
- `vite.config.ts` — register `@tailwindcss/vite` plugin.
- `tsconfig.json` — ensure `lib/*` is covered by the `@/*` alias (already is via root alias).
- `index.html` — drop Tailwind CDN script, drop inline tailwind config, drop inline `<style>` block, drop Inter preconnect, add Geist + Geist Mono.
- `index.tsx` — add `import './styles.css'`.
- `App.tsx` — remove inline keyframes, swap nav styling (keep PNG, drop gradient wordmark), dark shell.
- `components/IntakeWizard.tsx` — swap primitives, rewrite welcome layout, add StepIndicator at top, add Framer Motion per-step transitions, use `// STEP_NN` mono eyebrows.
- `components/FormMainContent.tsx` — remove card chrome and decorative SVG; becomes a lean header block.
- `components/ThankYouPage.tsx` — restyle against onboarding's `step-complete.tsx` pattern, using the existing "thank you" copy.
- `components/AdminResultsPage.tsx` — token swap only.
- `components/AnalysisDashboard.tsx` — token swap only (all `text-slate-*` / `bg-white` / `text-brand-*` / `bg-red-*` → theme tokens; green flags use `text-terminal-green`).

### Deleted files
- `components/UIComponents.tsx` — all exports are replaced by shadcn primitives + lucide icons. Delete only after all call sites are migrated.

---

## Task 1: Install Tailwind v4 and supporting deps

**Files:**
- Modify: `package.json`
- Create: `postcss.config.mjs`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
npm install \
  framer-motion@^12 \
  lucide-react@^0.564 \
  class-variance-authority@^0.7 \
  clsx@^2.1 \
  tailwind-merge@^3.3 \
  @radix-ui/react-select@^2 \
  @radix-ui/react-label@^2 \
  @radix-ui/react-slot@^1
```
Expected: `added N packages` with no errors.

- [ ] **Step 2: Install build dependencies**

Run:
```bash
npm install -D \
  tailwindcss@^4 \
  @tailwindcss/vite@^4 \
  @tailwindcss/postcss@^4 \
  postcss@^8 \
  tw-animate-css@^1
```
Expected: `added N packages` with no errors.

- [ ] **Step 3: Create `postcss.config.mjs`**

Content:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 4: Register the Tailwind Vite plugin**

Modify `vite.config.ts`. Replace the imports block and the `plugins` array so it reads:

```ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json postcss.config.mjs vite.config.ts
git commit -m "chore: install tailwind v4 and shadcn-stack deps"
```

---

## Task 2: Add styles.css with onboarding tokens

**Files:**
- Create: `styles.css`
- Modify: `index.tsx`

- [ ] **Step 1: Read the onboarding tokens**

Run: `cat /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/app/globals.css`
Expected: ~134-line CSS file starting with `@import 'tailwindcss'`.

- [ ] **Step 2: Create `styles.css`**

Copy the onboarding `app/globals.css` contents into `styles.css` verbatim. Then, **inside the existing `@theme inline { … }` block** (around the `--color-sidebar-*` entries), add these four lines to expose the terminal tokens as Tailwind utility colors:

```css
  --color-terminal-bg: var(--terminal-bg);
  --color-terminal-green: var(--terminal-green);
  --color-terminal-cyan: var(--terminal-cyan);
  --color-terminal-yellow: var(--terminal-yellow);
```

Do not create a second `@theme` block. Do not change any OKLCH values.

- [ ] **Step 3: Import `styles.css` from `index.tsx`**

Add `import './styles.css';` as the first import in `index.tsx`, before the React imports.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Smoke-test the dev server**

Run: `npm run dev` (Ctrl-C after verifying it starts)
Expected: Vite starts on `http://0.0.0.0:3000` without a CSS parse error. It's fine if the page looks broken — the CDN removal happens in Task 3.

- [ ] **Step 6: Commit**

```bash
git add styles.css index.tsx
git commit -m "feat(theme): add onboarding tokens via tailwind v4 theme block"
```

---

## Task 3: Remove Tailwind CDN, swap fonts to Geist

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Rewrite `index.html`**

Replace the full file contents with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ExpressNext Intake Form</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

This removes: Tailwind CDN script, inline `tailwind.config` script, inline scrollbar `<style>` block, Inter font link.

- [ ] **Step 2: Run dev server and verify dark background loads**

Run: `npm run dev`

Open http://localhost:3000 in a browser. Expected:
- Page background is dark (`--background` token, near black).
- Geist font renders (if Google Fonts fetch fails, fallback is fine for this check).
- Existing components will look wrong because their utilities (`bg-brand-*`, `text-slate-*`, etc.) either don't exist in the new install (for `brand-*`) or produce a light-on-dark mess. That is expected — those screens are fixed in later tasks.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(theme): remove tailwind cdn, switch to geist fonts"
```

---

## Task 4: Add `lib/utils.ts`

**Files:**
- Create: `lib/utils.ts`

- [ ] **Step 1: Create the file**

Content:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: add shadcn cn helper"
```

---

## Task 5: Port shadcn primitives (Button, Input, Textarea, Label, Select)

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/label.tsx`
- Create: `components/ui/select.tsx`

For each primitive, copy the file contents verbatim from the onboarding project (keeping the `'use client'` directives — they're no-ops in Vite but not harmful):

- [ ] **Step 1: Copy Button**

Run: `cp /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/components/ui/button.tsx components/ui/button.tsx`

- [ ] **Step 2: Copy Input**

Run: `cp /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/components/ui/input.tsx components/ui/input.tsx`

- [ ] **Step 3: Copy Textarea**

Run: `cp /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/components/ui/textarea.tsx components/ui/textarea.tsx`

- [ ] **Step 4: Copy Label**

Run: `cp /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/components/ui/label.tsx components/ui/label.tsx`

- [ ] **Step 5: Copy Select**

Run: `cp /Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/components/ui/select.tsx components/ui/select.tsx`

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. The `@/lib/utils` import resolves via the existing `@/*` alias; the Radix imports resolve via Task 1 installs.

- [ ] **Step 7: Commit**

```bash
git add components/ui/
git commit -m "feat(ui): port shadcn primitives from onboarding app"
```

---

## Task 6: Add `Field` wrapper and `StepIndicator` component

**Files:**
- Create: `components/ui/field.tsx`
- Create: `components/StepIndicator.tsx`

- [ ] **Step 1: Create `components/ui/field.tsx`**

Content:
```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface FieldProps {
  label: string
  htmlFor?: string
  subLabel?: string
  error?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, subLabel, error, className, children }: FieldProps) {
  // The shadcn Label primitive uses `flex items-center gap-2`, so we keep the
  // label text as the only Label child and render the sub-label as a sibling
  // block below it to get the stacked layout shown in the onboarding app.
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {subLabel && (
        <p className="text-xs text-muted-foreground font-normal -mt-1">
          {subLabel}
        </p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/StepIndicator.tsx`**

Content (ported from onboarding, but with `steps` passed in as a prop and consuming a zero-based `currentStep`):

```tsx
import * as React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export interface StepDescriptor {
  id: string
  name: string
  shortName: string
}

interface StepIndicatorProps {
  currentStep: number
  steps: StepDescriptor[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const totalSteps = steps.length
  const percent = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0

  return (
    <div className="w-full">
      <div className="relative h-1 bg-secondary rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary'
                    : isCurrent
                      ? 'border-primary bg-background'
                      : 'border-muted-foreground/30 bg-background'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-primary' : 'text-muted-foreground/50'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
              >
                {step.shortName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/field.tsx components/StepIndicator.tsx
git commit -m "feat(ui): add Field wrapper and StepIndicator"
```

---

## Task 7: Restyle `App.tsx` shell and top nav

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Rewrite `App.tsx`**

Replace the full file contents with:

```tsx
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
```

Removed: the inline `<style>` keyframes block, the gradient wordmark, the blurred gradient blob, the `bg-slate-50` / `text-slate-900` / `selection:bg-brand-200` utilities.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors are allowed here only if they come from `components/IntakeWizard.tsx`, `components/ThankYouPage.tsx`, or `components/AdminResultsPage.tsx` still referencing legacy utilities — those are fixed in later tasks. Errors from `App.tsx` itself must be zero.

Run: `npx tsc --noEmit 2>&1 | grep -E "^App\.tsx"`
Expected: empty output.

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat(theme): restyle App shell and top nav"
```

---

## Task 8: Rewrite welcome screen and form-step layout in `IntakeWizard.tsx`

**Files:**
- Modify: `components/IntakeWizard.tsx`
- Modify: `components/FormMainContent.tsx`

This is the largest task. It rewrites the welcome screen around the onboarding's `StepWelcome` pattern, replaces every form input/select/button with the new primitives, adds `<AnimatePresence>` wrapping per-step content, adds the `StepIndicator` at the top of the form layout, and leans on the `// STEP_NN` mono eyebrow convention.

- [ ] **Step 1: Rewrite `components/FormMainContent.tsx`**

Replace the full file contents with:

```tsx
import React from 'react';

interface FormMainContentProps {
  stepEyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const FormMainContent: React.FC<FormMainContentProps> = ({
  stepEyebrow,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex-1">
      <div className="space-y-6">
        <div>
          <div className="text-primary font-mono text-sm mb-2">{stepEyebrow}</div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
```

Removed: the white card chrome, the blurred purple blob, the dashed-circle SVG, the in-card step progress bar, `stepIndex`/`stepsCount` props.

- [ ] **Step 2: Rewrite `components/IntakeWizard.tsx`**

Replace the full file contents with:

```tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, BarChart3, Target, Clock } from 'lucide-react';
import { IntakeFormData, FormStep } from '../types';
import { submitIntakeForm } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { StepIndicator, type StepDescriptor } from './StepIndicator';
import { FormMainContent } from './FormMainContent';

const INITIAL_DATA: IntakeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  website: '',
  companyName: '',
  reasonForBooking: '',
  howDidYouHear: '',
  currentRevenue: '',
  teamSize: '',
  primaryService: '',
  averageDealSize: '',
  marketingBudget: '',
  isDecisionMaker: '',
  previousAgencyExperience: '',
  acquisitionSource: '',
  salesProcess: '',
  fulfillmentWorkflow: '',
  currentTechStack: '',
  desiredOutcome: '',
  desiredSpeed: '',
  readyToScale: '',
};

const STEPS: StepDescriptor[] = [
  { id: 'welcome', name: 'Welcome', shortName: 'Start' },
  { id: 'numbers', name: 'The Numbers', shortName: 'Numbers' },
  { id: 'vision', name: 'The Vision', shortName: 'Vision' },
];

const FORM_CONTENT = {
  [FormStep.CURRENT_REALITY]: {
    eyebrow: '// STEP_01',
    title: 'Helpful Details',
    description:
      "Collecting these details will help us figure out if we're a good fit for your business.",
  },
  [FormStep.DREAM_FUTURE]: {
    eyebrow: '// STEP_02',
    title: 'The Vision',
    description: 'If we worked together what would success look like for you?',
  },
} as const;

const MARKETING_BUDGET_OPTIONS = [
  { value: 'none', label: 'No budget set aside' },
  { value: '<1k', label: '<$1k/month' },
  { value: '1k-2.5k', label: '$1k-$2.5k/month' },
  { value: '2.5k-5k', label: '$2.5k-$5k/month' },
  { value: '5k-10k', label: '$5k-$10k/month' },
  { value: '10k+', label: '$10k+/month' },
];

const READY_TO_SCALE_OPTIONS = [
  { value: 'yes', label: "Yes, I'm ready" },
  { value: 'unsure', label: 'Not sure yet' },
];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-secondary/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export const IntakeWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>(FormStep.WELCOME);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const nameParam = searchParams.get('name');
    const emailParam = searchParams.get('email');
    if (nameParam) setFormData((prev) => ({ ...prev, firstName: nameParam }));
    if (emailParam) setFormData((prev) => ({ ...prev, email: emailParam }));
  }, [searchParams]);

  const updateField = <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => (prev + 1) as FormStep);
  const prevStep = () => setStep((prev) => (prev - 1) as FormStep);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitIntakeForm(formData);
      navigate('/thank-you');
    } catch (e) {
      console.error(e);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <div className="space-y-6">
        <div>
          <div className="text-primary font-mono text-sm mb-2">// INTAKE_INIT</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {searchParams.get('name')
              ? `${searchParams.get('name')}, thanks for booking!`
              : 'Thank you for booking!'}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            A few quick questions so we can make the call worth your time.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">What we&apos;ll ask:</p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">The Numbers</p>
                <p className="text-xs text-muted-foreground">
                  A snapshot of your business so we can gauge fit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">The Vision</p>
                <p className="text-xs text-muted-foreground">
                  What success looks like if we work together
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">One Minute</p>
                <p className="text-xs text-muted-foreground">
                  That&apos;s all it takes — no long forms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={nextStep} size="lg" className="gap-2 font-mono">
            Let&apos;s Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-1 pt-4">
          <Shield className="w-3 h-3" />
          Your information is secure and confidential.
        </p>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case FormStep.CURRENT_REALITY:
        return (
          <>
            <SelectField
              label="Do you have a sales/marketing budget set aside for growth?"
              value={formData.marketingBudget}
              onValueChange={(v) => updateField('marketingBudget', v)}
              options={MARKETING_BUDGET_OPTIONS}
              placeholder="Select budget range..."
            />
            <Field
              label="Have you worked with an agency or consultant before?"
              subLabel="If so, what was that experience like?"
            >
              <Textarea
                value={formData.previousAgencyExperience}
                onChange={(e) => updateField('previousAgencyExperience', e.target.value)}
                placeholder="Yes, we worked with XYZ agency for 6 months. It was..."
                className="bg-secondary/50 min-h-[120px]"
              />
            </Field>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={prevStep} className="gap-2 font-mono">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={nextStep} className="gap-2 font-mono">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        );

      case FormStep.DREAM_FUTURE:
        return (
          <>
            <Field label="If we worked together, what outcome would make this worth it for you?">
              <Textarea
                value={formData.desiredOutcome}
                onChange={(e) => updateField('desiredOutcome', e.target.value)}
                placeholder="e.g., Double my revenue, free up my time, finally scale..."
                className="bg-secondary/50 min-h-[120px]"
              />
            </Field>
            <SelectField
              label="Are you ready to scale your business with a growth system if we're the right fit?"
              value={formData.readyToScale}
              onValueChange={(v) => updateField('readyToScale', v)}
              options={READY_TO_SCALE_OPTIONS}
              placeholder="Select an option..."
            />
            <div className="pt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep} className="gap-2 font-mono">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 font-mono"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const isFormStep = step === FormStep.CURRENT_REALITY || step === FormStep.DREAM_FUTURE;
  const currentFormContent = isFormStep ? FORM_CONTENT[step] : null;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      {isFormStep && (
        <div className="mb-10">
          <StepIndicator currentStep={step + 1} steps={STEPS} />
        </div>
      )}

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === FormStep.WELCOME && renderWelcome()}
          {isFormStep && currentFormContent && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormMainContent
                stepEyebrow={currentFormContent.eyebrow}
                title={currentFormContent.title}
                description={currentFormContent.description}
              >
                {renderStepContent()}
              </FormMainContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
```

Note: this rewrite drops the `highestStepReached`/`goToStep` logic (the welcome screen never rendered it, and with only two form steps the progress bar + sequential next/back is enough). If the back-nav-to-earlier-step behavior is required, ask the user before including it — it's not in the spec.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Visual walkthrough**

Run: `npm run dev`.
Open http://localhost:3000. Confirm:
- Welcome screen renders with `// INTAKE_INIT` eyebrow in cyan, three info tiles, "Let's Get Started" button with arrow icon.
- Clicking the button advances to The Numbers step: step indicator pulses ring on "Numbers" (the second dot), "Start" dot shows a check, title is "Helpful Details", `// STEP_01` eyebrow in cyan.
- The Select opens a dark dropdown (Radix portal) with the cyan focus ring.
- Textarea has a dark secondary tint.
- Back → returns to welcome (welcome animates back in).
- Continue → advances to The Vision step with `// STEP_02` eyebrow, step indicator advances.
- Submit → POSTs to the API. Because this is a dry run, expect a console error from the network call; that's fine as long as the UI path up to submit works.

Stop the dev server.

- [ ] **Step 5: Grep for residual legacy utilities in the wizard files**

Run: `git grep -nE "bg-brand-|text-brand-|bg-slate-|text-slate-|bg-white[^/]" components/IntakeWizard.tsx components/FormMainContent.tsx`
Expected: empty output.

- [ ] **Step 6: Commit**

```bash
git add components/IntakeWizard.tsx components/FormMainContent.tsx
git commit -m "feat(theme): restyle wizard and form layout against shadcn primitives"
```

---

## Task 9: Restyle `ThankYouPage.tsx`

**Files:**
- Modify: `components/ThankYouPage.tsx`

- [ ] **Step 1: Rewrite the file**

Content:
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center space-y-6 pt-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="p-4 rounded-full bg-[var(--terminal-green)]/10 border border-[var(--terminal-green)]/30"
        >
          <CheckCircle2 className="w-12 h-12 text-[var(--terminal-green)]" />
        </motion.div>

        <div className="space-y-3">
          <div className="text-[var(--terminal-green)] font-mono text-sm">
            // INTAKE_COMPLETE
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Thank You!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your application has been submitted successfully. We&apos;ll review your information
            and see you on the call.
          </p>
        </div>

        <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-1 pt-6">
          <Shield className="w-3 h-3" />
          Your information is secure and confidential.
        </p>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Navigate to http://localhost:3000/thank-you.
Expected: dark background, terminal-green check circle, `// INTAKE_COMPLETE` mono eyebrow, centered copy.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/ThankYouPage.tsx
git commit -m "feat(theme): restyle thank-you page"
```

---

## Task 10: Token-swap `AdminResultsPage.tsx`

**Files:**
- Modify: `components/AdminResultsPage.tsx`

This is mostly find/replace — structure is preserved.

- [ ] **Step 1: Read the current file**

Run: `cat components/AdminResultsPage.tsx`

- [ ] **Step 2: Apply these token swaps across the file**

| From | To |
|------|-----|
| `bg-red-100` | `bg-destructive/10` |
| `text-red-600` (icon + text) | `text-destructive` |
| `text-red-500` | `text-destructive` |
| `border-brand-600` (spinner) | `border-primary` |
| `text-slate-600` | `text-muted-foreground` |
| `text-slate-900` | `text-foreground` |
| `text-brand-600` | `text-primary` |
| `bg-white` on any containers | `bg-card` |
| `border-slate-200` | `border-border` |
| `animate-fade-in` class | remove (no replacement needed) |

The remaining structural JSX, error states, loading states, and routing stay exactly as they are.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Grep for residual utilities**

Run: `git grep -nE "bg-brand-|text-brand-|bg-slate-|text-slate-|bg-red-|text-red-|border-slate-|bg-white(\b| )" components/AdminResultsPage.tsx`
Expected: empty output.

- [ ] **Step 5: Commit**

```bash
git add components/AdminResultsPage.tsx
git commit -m "feat(theme): token-swap admin results page"
```

---

## Task 11: Token-swap `AnalysisDashboard.tsx`

**Files:**
- Modify: `components/AnalysisDashboard.tsx`

- [ ] **Step 1: Read the current file**

Run: `cat components/AnalysisDashboard.tsx`

- [ ] **Step 2: Apply these token swaps across the file**

| From | To |
|------|-----|
| `text-slate-900` | `text-foreground` |
| `text-slate-700` | `text-foreground` |
| `text-slate-600` | `text-muted-foreground` |
| `text-slate-500` | `text-muted-foreground` |
| `text-slate-400` | `text-muted-foreground` |
| `bg-slate-100` | `bg-secondary` |
| `bg-white` on card surfaces | `bg-card border border-border` |
| `border-slate-200` | `border-border` |
| `text-brand-600` | `text-primary` |
| `bg-brand-600` | `bg-primary` |
| `bg-brand-200` | `border-primary/30` (where used as a left-border accent) |
| `border-brand-200` | `border-primary/30` |
| `text-red-500` | `text-destructive` |
| `bg-red-50` / `bg-red-100` | `bg-destructive/10` |
| `border-red-200` | `border-destructive/30` |
| `text-green-500` / `text-green-600` | `text-terminal-green` |
| `bg-green-50` / `bg-green-100` | `bg-terminal-green/10` |
| `border-green-200` | `border-terminal-green/30` |
| `animate-fade-in` class | remove |

Preserve all structural JSX (fit score bar, psychology blockquote, red/green flag lists, strategic questions, closing strategy). No layout changes.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Grep for residual utilities**

Run: `git grep -nE "bg-brand-|text-brand-|bg-slate-|text-slate-|bg-red-|text-red-|bg-green-|text-green-|border-slate-|border-red-|border-green-|bg-white(\b| )" components/AnalysisDashboard.tsx`
Expected: empty output.

- [ ] **Step 5: Commit**

```bash
git add components/AnalysisDashboard.tsx
git commit -m "feat(theme): token-swap analysis dashboard"
```

---

## Task 12: Delete `UIComponents.tsx` and sweep for legacy utilities

**Files:**
- Delete: `components/UIComponents.tsx`

- [ ] **Step 1: Confirm there are no remaining importers**

Run: `git grep -nE "from.*UIComponents|from.*\./UIComponents" components/ App.tsx`
Expected: empty output. If there are matches, fix them in place before deleting — do not leave dangling imports.

- [ ] **Step 2: Delete the file**

Run: `git rm components/UIComponents.tsx`

- [ ] **Step 3: Repo-wide grep for any residual legacy utilities**

Run: `git grep -nE "bg-brand-|text-brand-|ring-brand-|selection:bg-brand-|bg-slate-|text-slate-|border-slate-|bg-red-|text-red-|bg-green-|text-green-|animate-fade-in-up|animate-slide-in|animate-scale-in" -- ':!docs'`
Expected: empty output. (If you want to inspect the doc-only matches for reference, rerun the same grep without the pathspec.) Anything that surfaces outside `docs/` must be fixed before proceeding.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: build completes with no Tailwind class-generation warnings and no TypeScript errors. Output artifacts land in `dist/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove legacy UIComponents and stale utility references"
```

---

## Task 13: Full-flow verification

- [ ] **Step 1: Production preview**

Run: `npm run build && npm run preview`
Open the printed URL in a browser. The preview should match dev.

- [ ] **Step 2: Walkthrough — welcome → submit**

- Visit `/` → welcome renders with three info tiles, `// INTAKE_INIT` cyan eyebrow.
- Visit `/?name=Ada&email=ada@example.com` → first name/email prefilled downstream.
- Click "Let's Get Started" → Numbers step, step indicator pulses on "Numbers", `// STEP_01` eyebrow.
- Fill budget select + textarea → Continue → Vision step, `// STEP_02` eyebrow, pulse moves to "Vision" dot.
- Back → Numbers (state preserved, animation reverses).
- Forward again → Submit → observe either a successful `/thank-you` navigation or a network error. The submit path is unchanged so whatever behavior existed before this branch is what you should see.

- [ ] **Step 3: Thank-you page**

Visit `/thank-you` directly. Confirm: terminal-green check circle, `// INTAKE_COMPLETE`, privacy footer.

- [ ] **Step 4: Admin page**

Visit `/admin/bogus-token` (expected to render the error state). Confirm: dark background, `text-destructive` error pill, `border-primary` spinner if still loading.

If you have a real token from a prior submission, visit `/admin/<real-token>` and confirm the full analysis dashboard renders correctly — fit score bar in cyan, psychology blockquote in `border-primary/30`, red flags in `text-destructive`, green flags in `text-terminal-green`.

- [ ] **Step 5: Responsive check**

In devtools, switch to 375px width. Confirm:
- Step indicator dots remain legible (short labels hidden via `hidden sm:block` — dots still visible).
- Buttons stack cleanly; no horizontal overflow.

At ≥1024px width confirm the `max-w-2xl` container centers content.

- [ ] **Step 6: Final grep sweep**

Run: `git grep -nE "cdn\.tailwindcss|fonts\.googleapis\.com/css2\?family=Inter|brand-[0-9]+"`
Expected: empty.

- [ ] **Step 7: Commit any stray cleanups**

If nothing needs fixing after the sweep, skip the commit. Otherwise:

```bash
git add -A
git commit -m "chore: address final grep sweep"
```

- [ ] **Step 8: Push and monitor deploy**

```bash
git push origin design-update
```
Confirm the GitHub Actions rsync deploy workflow completes. Check the deployed URL renders the dark theme end-to-end.

---

## Risk callouts for the implementer

- **Radix Select portal + dark theme.** The onboarding `Select` uses `bg-popover text-popover-foreground` via shadcn's built-in class. Those tokens are defined in `styles.css` from Task 2 — if you skip exposing `--color-popover`/`--color-popover-foreground` (they're already in the copied `@theme inline` block), the dropdown will render with a transparent background. Visual walkthrough in Task 8 catches this.
- **`process.env.API_KEY`.** Vite's `define` block in `vite.config.ts` injects `process.env.API_KEY` at build time from `GEMINI_API_KEY` — do not touch it. The plan only adds the Tailwind plugin.
- **Old PNG logo.** Task 7 keeps `storage.expressnext.app/ENextLogo.png`. If that CDN is unreachable in the target environment, the PNG will fail to load but the wordmark beside it will still render — acceptable.
- **Tailwind v4 first-party fit.** `@tailwindcss/vite` is the officially supported plugin; if class generation misbehaves after a build, the usual culprit is a stale cache — `rm -rf node_modules/.vite && npm run build`.
- **shadcn primitives carry `'use client'`.** Vite doesn't care, but if a future editor insists on stripping them, that's also fine — the directives are inert here.
