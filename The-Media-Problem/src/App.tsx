import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Brain, ArrowRight, ArrowLeft } from "lucide-react";
import LessonsSection from "./components/LessonsSection";
import AIDetector from "./components/AIDetector";
import DiagnosticTest from "./components/DiagnosticTest";

export default function App() {
  const [viewState, setViewState] = useState<"home" | "lessons" | "detector" | "diagnostic">("home");

  return (
    <div className="min-h-screen bg-[#141413] text-[#E3E3E2] font-sans antialiased selection:bg-[#2C2C2B] flex flex-col justify-between">
      {/* Top Subtle Accent Line */}
      <div className="h-0.5 bg-neutral-800 w-full" />

      {/* Main Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-16 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {viewState === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 md:space-y-16 py-8"
              id="landing-hero-view"
            >
              {/* Centered Minimal Logo & Headline */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                  <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white select-none italic">
                    the media problem
                  </h1>
                  <span className="w-3 h-3 bg-white rounded-full mt-4 animate-pulse" />
                </div>
                <p className="text-base md:text-lg font-serif italic text-[#8F8E8C] leading-relaxed max-w-lg mx-auto">
                  A simple guide to recognizing bias, framing, and manipulation in everyday news.
                </p>
              </div>

              {/* Layout: Featured AI Bias Detector on top, and Row of two split below */}
              <div className="space-y-3 max-w-4xl mx-auto" id="applet-selection-layout">
                {/* Featured 1: AI Bias Detector (biggest, in the center) */}
                <button
                  id="start-detector-card"
                  onClick={() => setViewState("detector")}
                  className="group w-full notion-card bg-[#1A1A19] border border-[#2C2C2B] p-4 text-left hover:border-white transition-all cursor-pointer duration-300 space-y-2.5 rounded-lg hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-[#20201F] border border-[#2C2C2B] group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-bold text-white">
                        AI Bias Detector
                      </h3>
                    </div>
                    <p className="text-xs text-[#8F8E8C] leading-relaxed font-serif">
                      Analyze headlines or text snippets for loaded adjectives, media manipulation techniques, and biased wording with neutral, objective alternatives.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8F8E8C] group-hover:text-white transition-colors pt-1">
                    <span>Open Detector</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Row 2: Split with Interactive Guide wider than Literacy Diagnostic */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* Interactive Guide (Wider: col-span-3) */}
                  <button
                    id="start-lessons-card"
                    onClick={() => setViewState("lessons")}
                    className="md:col-span-3 group bg-[#1A1A19] border border-[#2C2C2B] p-4 text-left hover:border-white transition-all cursor-pointer duration-300 space-y-2.5 flex flex-col justify-between rounded-lg hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#20201F] border border-[#2C2C2B] group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center text-white">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-base font-bold text-white">
                          Interactive Guide
                        </h3>
                      </div>
                      <p className="text-xs text-[#8F8E8C] leading-relaxed font-serif">
                        Progress through scenario-based learning challenges. Learn to identify and neutralize the 32 physical tricks of narrative preloading, agent deletion, and media manipulation.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8F8E8C] group-hover:text-white transition-colors pt-1">
                      <span>Open Guide</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
 
                  {/* Literacy Diagnostic (Narrower: col-span-2) */}
                  <button
                    id="start-diagnostic-card"
                    onClick={() => setViewState("diagnostic")}
                    className="md:col-span-2 group bg-[#1A1A19] border border-[#2C2C2B] p-4 text-left hover:border-white transition-all cursor-pointer duration-300 space-y-2.5 flex flex-col justify-between rounded-lg hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#20201F] border border-[#2C2C2B] group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center text-white">
                          <Brain className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-base font-bold text-white">
                          Literacy Diagnostic
                        </h3>
                      </div>
                      <p className="text-xs text-[#8F8E8C] leading-relaxed font-serif">
                        Test your logical radar against 8 realistic news scenarios to measure vulnerability to media manipulation.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8F8E8C] group-hover:text-white transition-colors pt-1">
                      <span>Open Diagnostic</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-applet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Locked-in Minimal Navigation Bar */}
              <header className="flex items-center justify-between border-b border-[#2C2C2B] pb-4 mb-4">
                <button
                  id="back-to-home-btn"
                  onClick={() => setViewState("home")}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[#8F8E8C] hover:text-white transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Return to Menu</span>
                </button>

                <div className="flex items-center gap-1.5 select-none text-[11px] font-mono tracking-wider font-bold text-[#8F8E8C]">
                  <span>the media problem</span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-white uppercase">
                    {viewState === "lessons" && "Interactive Guide"}
                    {viewState === "detector" && "Linguistic Auditor"}
                    {viewState === "diagnostic" && "Diagnostic Test"}
                  </span>
                </div>
              </header>

              {/* View Components */}
              <main className="min-h-[480px]">
                {viewState === "lessons" && <LessonsSection />}
                {viewState === "detector" && <AIDetector />}
                {viewState === "diagnostic" && <DiagnosticTest onNavigate={(view) => setViewState(view)} />}
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-[#2C2C2B] py-6 text-center text-[10px] text-[#8F8E8C] font-mono space-y-1">
        <p>the media problem • © 2026 Media Literacy Interactive Field Guide</p>
        <p>Designed to neutralize influence objectively. Influence mechanisms are neutral; learn to spot them everywhere.</p>
      </footer>
    </div>
  );
}
