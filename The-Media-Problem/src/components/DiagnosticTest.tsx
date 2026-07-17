import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { diagnosticQuestions, chaptersData } from "../lessonsData";
import { Award, ShieldAlert, CheckCircle, XCircle, ArrowRight, RotateCcw, Brain, Check, Info } from "lucide-react";
import JuiceParticles from "./JuiceParticles";
import {
  playSuccessSound,
  playErrorSound,
  playTapSound,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticTap
} from "../utils/gameJuice";

export default function DiagnosticTest({ onNavigate }: { onNavigate?: (view: "home" | "lessons" | "detector" | "diagnostic") => void }) {
  const [testState, setTestState] = useState<"intro" | "questions" | "results">("intro");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Game feel states
  const [particleTrigger, setParticleTrigger] = useState<{ id: number; type: "success" | "error" }>({ id: 0, type: "success" });
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  const startTest = () => {
    setTestState("questions");
    setCurrentQuestionIdx(0);
    setUserAnswers([]);
    setSelectedChoiceIdx(null);
    setIsSubmitted(false);
  };

  const currentQuestion = diagnosticQuestions[currentQuestionIdx];

  const handleSelectChoice = (choiceIdx: number) => {
    if (isSubmitted) return;
    setSelectedChoiceIdx(choiceIdx);
    playTapSound();
    triggerHapticTap();
  };

  const handleSubmitAnswer = () => {
    if (selectedChoiceIdx === null || isSubmitted) return;
    setIsSubmitted(true);
    setUserAnswers(prev => [...prev, selectedChoiceIdx]);

    const isCorrect = selectedChoiceIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      playSuccessSound();
      triggerHapticSuccess();
      setParticleTrigger(prev => ({ id: prev.id + 1, type: "success" }));
    } else {
      playErrorSound();
      triggerHapticError();
      setParticleTrigger(prev => ({ id: prev.id + 1, type: "error" }));
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < diagnosticQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedChoiceIdx(null);
      setIsSubmitted(false);
    } else {
      setTestState("results");
    }
  };

  // Score Calculation
  const totalCorrect = userAnswers.reduce((acc, ansIdx, qIdx) => {
    return ansIdx === diagnosticQuestions[qIdx].correctIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((totalCorrect / diagnosticQuestions.length) * 100);

  // Custom Badge Selection
  const getBadgeInfo = (score: number) => {
    if (score === 8) {
      return {
        badge: "Media Literacy Expert",
        color: "text-emerald-300 bg-emerald-950/30 border-emerald-900/50",
        description: "Flawless score! You have a brilliant radar for media manipulation. Linguistic tricks, framing techniques, and data manipulation simply don't work on you automatically.",
      };
    } else if (score >= 6) {
      return {
        badge: "Analytical Skeptic",
        color: "text-purple-300 bg-purple-950/30 border-purple-900/50",
        description: "Superb score. You possess a strong filter for outrage framing, loaded combat verbs, and passive voice tricks. With a tiny bit of practice, you'll be fully media literate.",
      };
    } else if (score >= 4) {
      return {
        badge: "Vigilant Casual",
        color: "text-white bg-[#20201F] border-[#2C2C2B]",
        description: "Decent awareness. You spot the most obvious emotional hooks, but subtle grammar preloading, time-slicing, or passive-voice agent deletion still manage to slide past your filter.",
      };
    } else {
      return {
        badge: "Impulsive Consumer",
        color: "text-red-300 bg-red-950/30 border-red-900/50",
        description: "You are highly susceptible to sensationalized narratives and alarmist triggers. Don't worry — this is exactly why The Media Problem exists! Check out our Lessons chapters and try again.",
      };
    }
  };

  const badgeInfo = getBadgeInfo(totalCorrect);

  return (
    <div id="diagnostic-module" className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Intro State */}
        {testState === "intro" && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="notion-card p-8 bg-[#1A1A19] border-[#2C2C2B] space-y-6"
          >
            <div className="flex justify-center">
              <div className="p-4 bg-[#20201F] rounded-full border border-[#2C2C2B]" id="brain-icon-wrapper">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                Media Literacy Diagnostic
              </h2>
              <p className="text-sm text-[#8F8E8C] max-w-md mx-auto leading-relaxed">
                Check your news literacy score in 5 minutes. This test challenges your ability to spot hidden bias mechanisms across raw text scenarios.
              </p>
            </div>

            <div className="border-t border-[#2C2C2B] pt-6 space-y-4">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold">
                Test Parameters:
              </h3>
              <ul className="text-xs text-[#8F8E8C] space-y-2 font-sans">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span><strong>8 Situational Scenarios:</strong> Neutral real-world events paired with heavily biased media headlines.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span><strong>Immediate Feedback:</strong> Get instant analysis on why and how each headline was manipulated.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span><strong>Earn Your Badge:</strong> Get an official diagnostic title and performance profile breakdown.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <button
                id="start-diagnostic-btn"
                onClick={startTest}
                className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Begin Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Questions Wizard State */}
        {testState === "questions" && (
          <motion.div
            key="questions-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={shouldShake ? { x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={shouldShake ? { duration: 0.5 } : { duration: 0.25 }}
            className="relative space-y-6 overflow-hidden p-1"
          >
            <JuiceParticles trigger={particleTrigger} />
            {/* Question Progress and Back Out */}
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8F8E8C] bg-[#20201F] p-3 rounded-lg border border-[#2C2C2B] font-bold">
              <span>QUESTION {currentQuestionIdx + 1} OF {diagnosticQuestions.length}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-24 h-1.5 bg-[#2C2C2B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / diagnosticQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <span>{percentage}% score potential</span>
              </div>
            </div>

            {/* Scenario Card */}
            <div className="notion-card p-6 border-[#2C2C2B] bg-[#1A1A19] space-y-4" id="diagnostic-scenario-card">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold block">
                  The Actual Physical Event:
                </span>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  {currentQuestion.scenario}
                </p>
              </div>

              {currentQuestion.type === "select-biased-headline" ? (
                <div className="border-t border-[#2C2C2B] pt-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-amber-400" /> Challenge Objective:
                  </span>
                  <p className="font-serif text-sm italic text-amber-200 font-medium leading-snug pl-4 border-l-2 border-amber-950">
                    Select the headline that introduces the most bias, using the technique of <span className="font-sans font-bold underline text-white">{currentQuestion.techniqueName}</span>.
                  </p>
                </div>
              ) : (
                <div className="border-t border-[#2C2C2B] pt-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Published Biased Headline:
                  </span>
                  <p className="font-serif text-lg italic text-red-200 font-bold leading-snug pl-4 border-l-2 border-[#2C2C2B]">
                    "{currentQuestion.spunText}"
                  </p>
                </div>
              )}
            </div>

            {/* Choices Grid */}
            <div className="space-y-2.5" id="diagnostic-choices-grid">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold px-1 block">
                {currentQuestion.type === "select-biased-headline"
                  ? "Select the Most Biased Headline Option:"
                  : "Identify the Primary Manipulation Technique Used:"}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.choices.map((choice, idx) => {
                  const isSelected = selectedChoiceIdx === idx;
                  let btnStyle = "bg-[#1A1A19] border-[#2C2C2B] text-[#8F8E8C] hover:bg-[#20201F]";

                  if (isSelected) {
                    btnStyle = "bg-[#2C2C2B] border-white text-white font-semibold";
                  }

                  if (isSubmitted) {
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const isUserPick = idx === selectedChoiceIdx;

                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/20 border-emerald-900/40 text-emerald-300 font-medium";
                    } else if (isUserPick) {
                      btnStyle = "bg-red-950/20 border-red-900/40 text-red-300 line-through opacity-85";
                    } else {
                      btnStyle = "bg-[#141413] border-[#2C2C2B]/60 text-[#8F8E8C]/50 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`choice-btn-${idx}`}
                      onClick={() => handleSelectChoice(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 disabled:cursor-default cursor-pointer ${btnStyle}`}
                    >
                      <span className={`font-mono text-xs px-2 py-0.5 rounded shrink-0 ${
                        isSelected && !isSubmitted ? "bg-white text-black" : "bg-[#20201F] text-[#8F8E8C]"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-sans leading-tight mt-0.5">{choice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Feedback Actions */}
            <div className="flex justify-end pt-2">
              {!isSubmitted ? (
                <button
                  id="submit-answer-btn"
                  onClick={handleSubmitAnswer}
                  disabled={selectedChoiceIdx === null}
                  className="bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  id="next-question-btn"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {currentQuestionIdx < diagnosticQuestions.length - 1 ? "Next Question" : "Finish Test"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Explanation box */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border ${
                  selectedChoiceIdx === currentQuestion.correctIndex
                    ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-200"
                    : "bg-[#20201F] border-[#2C2C2B] text-neutral-200"
                }`}
                id="answer-feedback-explanation"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {selectedChoiceIdx === currentQuestion.correctIndex ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold">
                      {selectedChoiceIdx === currentQuestion.correctIndex ? "Correct Analysis" : "Incorrect Option"}
                    </h4>
                    <p className="text-sm font-serif leading-relaxed text-neutral-300">
                      {currentQuestion.explanation}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-[#8F8E8C] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-[#8F8E8C]" />
                      <span>Learn more about this in <strong>{currentQuestion.techniqueName}</strong>.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Results Screen State */}
        {testState === "results" && (
          <motion.div
            key="results-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Primary Results Card */}
            <div className="notion-card p-8 bg-[#1A1A19] border-[#2C2C2B] space-y-6 text-center" id="diagnostic-results-card">
              <div className="flex justify-center">
                <div className="p-4 bg-[#20201F] border border-[#2C2C2B] rounded-full animate-pulse" id="award-icon-wrapper">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8F8E8C] font-bold block">
                  Media Literacy Level
                </span>
                <h2 className="font-serif text-3xl font-bold text-white">
                  {totalCorrect} / {diagnosticQuestions.length} Correct
                </h2>
                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-wider border font-bold ${badgeInfo.color}`} id="results-badge-indicator">
                  ★ {badgeInfo.badge} ★
                </div>
              </div>

              <p className="text-xs text-[#8F8E8C] max-w-md mx-auto leading-relaxed font-sans">
                {badgeInfo.description}
              </p>

              <div className="flex justify-center pt-2">
                <button
                  id="restart-diagnostic-btn"
                  onClick={startTest}
                  className="flex items-center gap-2 border border-[#2C2C2B] hover:bg-[#20201F] text-[#8F8E8C] px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Diagnostic
                </button>
              </div>
            </div>

            {/* Personalized Recommendations Section */}
            {(() => {
              const incorrectChapterIds = diagnosticQuestions
                .filter((_, qIdx) => userAnswers[qIdx] !== diagnosticQuestions[qIdx].correctIndex)
                .map(q => q.chapterId)
                .filter((id): id is number => id !== undefined);
              const uniqueIncorrectChapters = Array.from(new Set(incorrectChapterIds));
              const recommendedChapters = chaptersData.filter(ch => uniqueIncorrectChapters.includes(ch.id));

              return (
                <div className="notion-card p-6 bg-[#1A1A19] border border-[#2C2C2B] space-y-4" id="diagnostic-recommendations">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif text-lg font-bold text-white">
                      Personalized Study Recommendations
                    </h3>
                  </div>

                  {percentage < 90 ? (
                    <div className="space-y-3">
                      <p className="text-xs text-amber-200 leading-relaxed font-sans bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-left">
                        <strong>Notice:</strong> Your media literacy score is <strong>{percentage}%</strong>, which is below the 90% proficiency threshold. We strongly recommend completing the chapters in the <strong>Interactive Guide</strong> to calibrate your cognitive defenses.
                      </p>
                      
                      {recommendedChapters.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold block text-left">
                            Focus Area Chapters (Based on your incorrect answers):
                          </span>
                          <div className="grid grid-cols-1 gap-2.5">
                            {recommendedChapters.map(ch => (
                              <div 
                                key={ch.id}
                                className="p-3 bg-[#20201F] border border-[#2C2C2B] rounded-lg flex items-center justify-between gap-3 group/item hover:border-white transition-all cursor-pointer text-left"
                                onClick={() => onNavigate?.("lessons")}
                              >
                                <div className="space-y-1">
                                  <h4 className="font-serif text-sm font-bold text-white group-hover/item:text-amber-200 transition-colors">
                                    Chapter {ch.id}: {ch.title}
                                  </h4>
                                  <p className="text-[11px] text-[#8F8E8C] line-clamp-1 font-sans">
                                    {ch.intro}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#8F8E8C] group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-start pt-1">
                        <button
                          id="lessons-recommendation-btn"
                          onClick={() => onNavigate?.("lessons")}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <span>Launch Interactive Guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-emerald-200 leading-relaxed font-sans bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-left">
                        Outstanding! Your score is <strong>{percentage}%</strong>, demonstrating a high-level cognitive immunity to news manipulation. You have successfully met the 90% proficiency threshold.
                      </p>
                      {recommendedChapters.length > 0 ? (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold block text-left">
                            Refine Your Skills on These Minor Gaps:
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {recommendedChapters.map(ch => (
                              <div 
                                key={ch.id}
                                className="p-3 bg-[#20201F] border border-[#2C2C2B] rounded-lg flex items-center justify-between gap-3 group/item hover:border-white transition-all cursor-pointer text-left"
                                onClick={() => onNavigate?.("lessons")}
                              >
                                <div className="space-y-1">
                                  <h4 className="font-serif text-sm font-bold text-white group-hover/item:text-emerald-200 transition-colors">
                                    Chapter {ch.id}: {ch.title}
                                  </h4>
                                  <p className="text-[11px] text-[#8F8E8C] line-clamp-1 font-sans">
                                    {ch.intro}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#8F8E8C] group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#8F8E8C] text-left">
                          You scored 100% on all diagnostic scenarios. No study recommendations are necessary! Keep using your analytical skeptic filter out in the wild.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Diagnostics Question-by-Question breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8F8E8C] font-bold px-1">
                Linguistic Analysis Review
              </h3>
              <div className="space-y-3" id="results-breakdown-list">
                {diagnosticQuestions.map((q, idx) => {
                  const wasCorrect = userAnswers[idx] === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`notion-card p-4 flex gap-4 items-start bg-[#1A1A19] ${
                        wasCorrect ? "border-[#2C2C2B]" : "border-red-900/40 bg-red-950/10"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {wasCorrect ? (
                          <div className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1 bg-red-950 text-red-400 border border-red-900 rounded">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#8F8E8C]">
                            Scenario {q.id} • {q.techniqueName}
                          </span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                            wasCorrect ? "bg-emerald-950 text-emerald-300 border border-emerald-850" : "bg-red-950 text-red-300 border border-red-900"
                          }`}>
                            {wasCorrect ? "PASSED" : "FAILED"}
                          </span>
                        </div>
                        <p className="font-serif text-base italic font-bold text-white">
                          {q.type === "select-biased-headline" ? `Biased Headline: "${q.choices[q.correctIndex]}"` : `Biased Headline: "${q.spunText}"`}
                        </p>
                        <p className="text-xs text-[#8F8E8C] leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
