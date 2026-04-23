# ExpressNext onboarding theme port — design

Date: 2026-04-23
Status: Approved (pending spec review + user review)
Target branch: `design-update`

## Goal

Restyle the booking intake form to match the visual identity of the sibling `expressnext-onboarding` project: a dark, terminal-inspired UI built on Tailwind v4 + shadcn/ui with cyan primary accents and Geist typography. Business logic, routing, Gemini integration, and the rsync deploy pipeline are out of scope — this is a theme + component-layer replacement.

## Source of truth

All tokens, component primitives, and motion variants are copied from:
`/Users/tomraukete/workspace/github.com/tomr1233/expressnext-onboarding/`

Specifically:
- `app/globals.css` — theme tokens (OKLCH).
- `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx` — primitives.
- `components/onboarding/onboarding-wizard.tsx` — `StepIndicator` pattern (function definition near the top of the file).
- `components/onboarding/step-welcome.tsx`, `step-business-info.tsx`, `step-complete.tsx` — screen-level patterns and Framer Motion variants.

## Decisions (locked)

| # | Decision | Chosen |
|---|----------|--------|
| 1 | Theme direction | Full port — match onboarding exactly (dark, cyan). |
| 2 | Tailwind delivery | Install Tailwind v4 + shadcn/ui; remove CDN. |
| 3 | Animation library | Framer Motion (+ `tw-animate-css` for declarative enter animations). |
| 4 | Scope | All surfaces: wizard, thank-you, top nav, admin page, analysis dashboard. |
| 5 | Step indicator | Onboarding's dot-style — progress bar + numbered circles, pulsing ring on current, check on completed. |
| 6 | Brand mark | Keep the existing `ENextLogo.png` but drop the blue→green gradient on the "ExpressNext" wordmark (plain Geist text). |
| 7 | Execution approach | Cherry-pick shadcn primitives (not wholesale copy, not Next.js migration). |

Retired tokens/utilities: the existing `brand-*` palette is deleted outright — all usages are rewritten to the shadcn token equivalents (`primary`, `muted`, `border`, `destructive`, `secondary`, `foreground`, `background`). No alias shim.

## Architecture — what changes, what stays

### Stays unchanged
- `services/api.ts`, `services/geminiService.ts`
- `types.ts`
- Routing in `App.tsx` (BrowserRouter + 3 routes)
- Form state model, validation logic, option arrays in `IntakeWizard.tsx`
- URL query-param prefill (`?name=…&email=…`)
- `package.json` scripts, `vite.config.ts` alias `@/*`
- GitHub Actions rsync deploy workflow

### Changes
- Tailwind: CDN removed, installed as a real dependency with the `@tailwindcss/vite` plugin.
- Fonts: Inter removed; Geist + Geist Mono loaded via Google Fonts `<link>` in `index.html`.
- Styling: all `bg-slate-*`, `text-slate-*`, `bg-white`, `border-slate-*`, `text-brand-*`, `bg-brand-*`, `ring-brand-*` rewritten to shadcn token utilities.
- Component layer: `components/UIComponents.tsx` deleted; shadcn primitives take its place.
- Animations: inline keyframes in `App.tsx` removed; Framer Motion variants and `tw-animate-css` utilities replace them.
- Step indicator: moves from inside the form card to a top-of-page element, restyled as dots + progress bar.
- Card chrome: the white rounded card + decorative blobs + dashed-circle SVG in `FormMainContent.tsx` are removed; content flows directly on the dark page background inside a `max-w-2xl` container.

## Dependencies

Add:
- `tailwindcss@^4`
- `@tailwindcss/vite`
- `tw-animate-css`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `framer-motion`
- `lucide-react`
- `@radix-ui/react-select`
- `@radix-ui/react-label`
- `@radix-ui/react-slot`

No removals required beyond deleting runtime references to the CDN script.

## Design tokens

Copy `app/globals.css` from the onboarding project verbatim into a new `src/globals.css`, imported from `index.tsx`. Key tokens:

- `--background: oklch(0.09 0 0)` / `--foreground: oklch(0.95 0 0)`
- `--primary: oklch(0.75 0.15 195)` (cyan)
- `--primary-foreground: oklch(0.1 0 0)`
- `--secondary: oklch(0.18 0 0)` / `--muted: oklch(0.18 0 0)` / `--muted-foreground: oklch(0.65 0 0)`
- `--card: oklch(0.12 0 0)` / `--card-foreground: oklch(0.95 0 0)`
- `--border: oklch(0.22 0 0)` / `--input: oklch(0.15 0 0)` / `--ring: oklch(0.75 0.15 195)`
- `--destructive: oklch(0.55 0.2 25)`
- `--chart-1..5` — copied for parity with the onboarding tokens. Current analysis dashboard has no chart components, so these are unused at rest and add no visual surface. (Confirmed: no `chart` / `recharts` imports in `AnalysisDashboard.tsx` or `AdminResultsPage.tsx`.)
- `--terminal-bg`, `--terminal-green` (`oklch(0.7 0.18 145)`), `--terminal-cyan`, `--terminal-yellow` — copied for the analysis dashboard's red/green flag callouts.
- `--radius: 0.5rem` with `--radius-sm/md/lg/xl` calc chain.
- `--font-sans: 'Geist', 'Geist Fallback'`, `--font-mono: 'Geist Mono', 'Geist Mono Fallback'`.

Base layer applies `* { @apply border-border outline-ring/50 }` and `body { @apply bg-background text-foreground }` — matching the onboarding base layer.

Dark theme is the default; no `dark` class toggle required.

## Component layer

### New files
- `src/lib/utils.ts` — shadcn `cn(…inputs)` helper backed by `clsx` + `tailwind-merge`.
- `components/ui/button.tsx` — CVA variants: `default`, `outline`, `ghost`, `destructive`, `secondary`; sizes: `default`, `sm`, `lg`. Uses Radix `Slot` to support `asChild`.
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/label.tsx`
- `components/ui/select.tsx`
- `components/ui/field.tsx` — `<div className="space-y-2"><Label/>…children…{error && <p className="text-xs text-destructive">…</p>}</div>` wrapper. Local, not a shadcn primitive.
- `components/StepIndicator.tsx` — ported from `expressnext-onboarding/components/onboarding/onboarding-wizard.tsx`'s inline `StepIndicator`. Intentional API change vs the source: instead of closing over a module-scoped `STEPS` array, this component accepts the steps array as a prop so the booking form can drive its own 3-step flow without editing the component.
  - Props: `currentStep: number` (zero-based index into `steps`), `steps: { id: string; name: string; shortName: string }[]`.
  - Consumers must pass a non-negative `currentStep` — see the `FormStep` mapping below.

### Deleted
- `components/UIComponents.tsx` — including the unused `RangeSlider`. All its exports have replacements via shadcn primitives + lucide icons.

### Modified
- `App.tsx` — nav styling, wordmark (drop gradient, keep PNG), outer shell background, removal of inline `<style>` block.
- `components/IntakeWizard.tsx` — imports swap from `./UIComponents` to the shadcn primitives; welcome screen restructured around the onboarding `StepWelcome` layout; form layout loses its card wrapper; step indicator is rendered at the top of the page above the content.
- `components/FormMainContent.tsx` — card chrome and decorative SVG removed; becomes a simple content-wrapping component (mono eyebrow + title + description + children) or is inlined into `IntakeWizard` if the remainder is trivial.
- `components/ThankYouPage.tsx` — restyled to match `step-complete.tsx` pattern.
- `components/AdminResultsPage.tsx` and `components/AnalysisDashboard.tsx` — token swap only, no structural changes.
- `index.html` — removes Tailwind CDN `<script>`, removes inline `tailwind.config`, removes inline `<style>` block, removes Inter font preconnect/link, adds Geist/Geist Mono via Google Fonts `<link>`.
- `index.tsx` — adds `import './globals.css'` at the top.
- `vite.config.ts` — registers `@tailwindcss/vite` plugin.
- `package.json` — new dependencies listed above.

## Screen-by-screen

### Welcome (`FormStep.WELCOME`)
- `// INTAKE_INIT` mono eyebrow in `text-primary`.
- Title: `text-3xl md:text-4xl font-bold tracking-tight text-balance`. Uses the existing conditional copy ("{name}, Thanks for Booking!" vs "Thank You for Booking!").
- Subcopy: `text-muted-foreground text-lg`.
- Info tile block: three `bg-secondary/50 border border-border` rounded tiles listing what the form will ask (Numbers, Vision, timeline) with lucide icons in `bg-primary/10 p-2 rounded-md` chips. This is a small additive change — the current welcome has no tile block; the tiles bring the screen's visual weight in line with onboarding's welcome.
- Primary button: shadcn Button with `font-mono` + `ArrowRight`, calls `nextStep()`.
- Privacy footer: lucide `Shield` icon + `text-muted-foreground`.

### Form steps (`FormStep.CURRENT_REALITY` and `FormStep.DREAM_FUTURE`)
- `StepIndicator` at the top of the page (outside the content column).
  - `FormStep` is defined as `WELCOME = -1`, `CURRENT_REALITY = 0`, `DREAM_FUTURE = 1`. The indicator must receive a zero-based index, so it's passed `currentStep={step + 1}` (mapping Welcome→0, Numbers→1, Vision→2).
  - The `steps` array has three entries: `{ id: 'welcome', name: 'Welcome', shortName: 'Start' }`, `{ id: 'numbers', name: 'The Numbers', shortName: 'Numbers' }`, `{ id: 'vision', name: 'The Vision', shortName: 'Vision' }`.
  - The indicator is rendered only on the form steps (CURRENT_REALITY, DREAM_FUTURE) — the welcome screen retains its standalone layout.
- `// STEP_01` / `// STEP_02` mono eyebrow in `text-primary`.
- Title: `text-2xl font-bold tracking-tight`.
- Description: `text-muted-foreground`.
- Fields wrapped in `<Field>`; Input/Textarea gain `className="bg-secondary/50"`; Select uses Radix via shadcn.
- Button row: outline Back, default Continue/Submit; both `font-mono`; lucide `ArrowLeft` / `ArrowRight`.
- Error text: `text-xs text-destructive`.

### Thank-you (`/thank-you`)
- Title, subcopy, and a large check in a `bg-primary/10` rounded container — matches `step-complete.tsx`.
- No card chrome; dark background; cyan accent.
- Privacy footer mirrors the welcome.

### Admin + analysis (`/admin/:token`)
- Page background: `bg-background text-foreground`.
- Card surfaces: `bg-card border border-border rounded-lg`.
- Text colors: `text-slate-*` → `text-foreground` / `text-muted-foreground`.
- Brand references: `text-brand-*` / `bg-brand-*` → `text-primary` / `bg-primary/10`.
- Flag accents:
  - red flags: `text-destructive` + `bg-destructive/10` + `border-destructive/30`.
  - green flags: custom utility `text-terminal-green` / `bg-terminal-green/10`, exposed inside the existing `@theme inline { … }` block as `--color-terminal-green: var(--terminal-green)` (same block that aliases the other token variables; do not introduce a second `@theme` block).
- Score/badge chips: `bg-secondary text-secondary-foreground border border-border`.
- No structural changes (no layout reflows, no prop changes, no feature removal).

## Animations

- **Step transitions**: `<AnimatePresence mode="wait">` around the per-step container, with each step wrapped in `<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.3}}>`.
- **Welcome staggered entrance**: `animate-in fade-in slide-in-from-bottom-2 duration-300` via `tw-animate-css`, with `delay-100`, `delay-150`, `delay-200`, `delay-300`, `delay-500` on successive children — matches `step-welcome.tsx`.
- **Step indicator**:
  - Progress bar fill: `motion.div` with `initial={{width:0}}`, `animate={{width: ${(currentStep / (totalSteps-1)) * 100}%}}`, `transition={{duration:0.4, ease:'easeOut'}}`.
  - Current-step pulsing ring: `motion.div` with `initial={{scale:1, opacity:1}}`, `animate={{scale:1.3, opacity:0}}`, `transition={{duration:1.5, repeat:Infinity}}`.
  - Completed circles: static `Check` icon; color/border transition via `transition-all duration-300`.
- **Buttons**: shadcn's built-in `active:scale` and `transition-colors` states. No Framer Motion on buttons.
- **Thank-you**: single-shot `animate-in fade-in slide-in-from-bottom-2`.
- **Admin/analysis**: no new motion.
- **Removed**: inline `@keyframes` block in `App.tsx`, all `.animate-fade-in-up` / `.animate-fade-in` / `.animate-slide-in` / `.animate-scale-in` usages.

## Testing & validation

- `npm install` succeeds with the new dependency set.
- `npm run dev` renders the app with dark theme + Geist font out of the box (no CDN script, no Inter fallback).
- Walk the happy path in a browser: Welcome → Numbers (fill required fields) → Vision (fill required fields) → Submit → `/thank-you`.
  - Step indicator pulses on current step, checks on completed.
  - Content slides in/out between steps.
  - `?name=…&email=…` still prefills the welcome/first-step fields.
  - Required-field gating (first name + valid email) still blocks progression.
- Load `/admin/:token` with a known token; verify dark theme + new tokens render correctly; verify no residual `bg-white` / `text-slate-*` / `text-brand-*` in rendered DOM.
- Mobile viewport check at 375px and desktop at ≥1024px; confirm the `max-w-2xl` container holds up, no horizontal scroll, step indicator still legible.
- `npm run build` succeeds.
- `npm run preview` serves the built output correctly (dark theme, no missing CSS).
- Push to `design-update` and verify GitHub Actions rsync deploy completes and the deployed URL renders the new theme.

## Out of scope

- Next.js migration, SSR, or routing changes.
- New form fields, validation logic, or submission-endpoint changes.
- Light-theme toggle (dark is default, no toggle).
- Redesign of the analysis-dashboard layout — tokens only, not structure.
- Copy changes beyond the mono `// STEP_NN` eyebrows and the "what we'll ask" tile block.
- Porting `RangeSlider` (currently unused).

## Risks

- **Tailwind v4 + Vite plugin** is the newest delivery path; if the installed version drifts, class generation can silently misbehave. Verified by visual walkthrough and `npm run build`.
- **Geist via Google Fonts** isn't identical to Next.js's `next/font` optimizer — expect a one-time network fetch on first page load. Acceptable for this app's traffic profile.
- **Removing `brand-*` utilities cold-turkey** means any stray reference breaks the build at `tailwindcss` generation time. Grep for `brand-` across the repo before merging.
- **Admin + analysis dashboard** are not customer-facing, so a regression there won't hurt prospects — but they're listed as in-scope per Q4, so visual QA of `/admin/:token` is required.
