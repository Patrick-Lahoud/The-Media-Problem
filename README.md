# The Media Problem - Technical Documentation

This repository houses the full-stack codebase for The Media Problem, a media literacy application designed to diagnose, educate, and analyze language and bias patterns in real-world media. Available for live test at https://the-media-problem.onrender.com/

## Tech Stack & Architecture

The application is structured as a full-stack SPA (Single Page Application) with a backend API proxy to safely interact with external services and keep API keys secure.

### Frontend
- Framework: React 19 with TypeScript
- Build Tooling: Vite 6
- Styling: Tailwind CSS v4 (configured via @tailwindcss/vite)
- Animations: Motion (for fluid, interactive transitions and dynamic game juice)
- Icons: Lucide React

### Backend
- Framework: Express (Node.js) running in ESM/CJS compatibility mode
- TypeScript Runner: tsx (used for fast, direct typescript execution in development)
- AI SDK: @google/genai (the official Google GenAI TypeScript SDK)
- Compilation Tooling: esbuild (bundles server.ts and all relative imports into a single, production-ready dist/server.cjs file to optimize cold-start speed and ensure runtime compatibility)

---

## Directory Structure

```
├── .env.example              # Template for local environment configuration
├── .gitignore                # Specified ignored build directories and local secrets
├── index.html                # Entry point for the Vite application
├── package.json              # App scripts, build configurations, and dependencies
├── server.ts                 # Express backend entry point and Gemini integration
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler configuration integrated with Tailwind v4
└── src/                      # Client-side React source code
    ├── main.tsx              # React mounting entry point
    ├── App.tsx               # Primary parent layout and module route router
    ├── index.css             # Global styling containing Tailwind @import directives
    ├── types.ts              # Strongly typed shared interfaces (AnalysisResponse, QuizQuestion, etc.)
    ├── chapterQuizzesData.ts # Raw diagnostic quiz and lesson practice data
    ├── lessonsData.ts        # The structured syllabus and lessons across 8 chapters
    ├── components/           # Sub-modules
    │   ├── AIDetector.tsx    # Interface for the URL-scraping & article bias detector
    │   ├── DiagnosticTest.tsx# Media literacy diagnostic test engine and recommendation engine
    │   ├── LessonsSection.tsx# Interactive lessons section
    │   └── JuiceParticles.tsx# Floating particle animation feedback system
    └── utils/                # Client-side utility helpers
        └── gameJuice.ts      # Mechanics for interactive learning reactions
```

---

## Technical Details

### 1. The Scraper & AI Bias Detector (server.ts)
The server exposes an `/api/detect` POST endpoint that processes raw text inputs or link URLs:
- Link Processing: If a URL starting with http/https is detected, the server fetches the webpage raw HTML.
- HTML Parsing: It filters out unneeded boilerplate tags (scripts, stylesheets, navigational menus, headers, and footers) to minimize target token usage.
- Gemini API Call: It feeds the parsed text to Gemini 2.5 Flash via structured JSON prompting, forcing the model to return strongly typed analysis matching the `AnalysisResponse` schema defined in `src/types.ts`.
- Side-by-Side Comparison: The analysis maps detected techniques, emotional triggers, and unspun neutral alternative translations.

### 2. Media Literacy Diagnostic Test (src/components/DiagnosticTest.tsx)
An interactive questionnaire that maps individual media-consumption habits and questions:
- Evaluation: Tracks scores across multiple critical categories.
- Mapping: Recommends specific chapters of the guide to address identified blind spots.

### 3. The 8-Chapter Interactive Guide (src/components/LessonsSection.tsx)
Interactive instructional slider featuring 8 modules:
- Loaded Language and Framing
- Selective Time-Slicing
- Active and Passive Voice (Nominalization)
- Misleading Visuals and Cropping
- Numerical Distortion and Base Rates
- Appeal to Emotion and Urgency
- Logical Fallacies and Contextual Coupling
- Verification and Fact-Checking

---

## Configuration & Environment Variables

Create a `.env` file in the root folder based on the provided `.env.example`:

```env
# Google Gemini API Key - must keep server-side for security
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Self-referential URL of the deployment (optional)
APP_URL="http://localhost:3000"
```

---

## How to Install and Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application in Development Mode
Starts the Express server on port 3000, serving the React frontend via Vite's middleware:
```bash
npm run dev
```

### 3. Build and Bundle for Production
Compiles the static frontend files into `dist/` and compiles `server.ts` into a self-contained commonJS file at `dist/server.cjs`:
```bash
npm run build
```

### 4. Start the Production Server
```bash
npm run start
```
