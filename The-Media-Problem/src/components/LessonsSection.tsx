import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { chaptersData } from "../lessonsData";
import { chapterQuizzesData } from "../chapterQuizzesData";
import JuiceParticles from "./JuiceParticles";
import {
  playSuccessSound,
  playErrorSound,
  playTapSound,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticTap
} from "../utils/gameJuice";
import { 
  Lock, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Activity, 
  Compass, 
  Trophy,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  BookOpen,
  Eye,
  Sparkles,
  HelpCircle,
  FileText,
  Brain,
  Award,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

interface FlattenedTechnique {
  id: string;
  name: string;
  technique: string;
  spun: string;
  unspun: string;
  singleTriggerWord?: string;
  headlines?: { text: string; isCorrect: boolean }[];
  chapterId: number;
  chapterTitle: string;
  chapterIntro: string;
  chapterIdx: number;
  techIdx: number;
  flatIdx: number;
}

// Dictionary of exact trigger words to look for in each of the techniques
const BIAS_TRIGGERS: Record<string, string[]> = {
  // Chapter 0: Introduction to Bias
  "0.1": ["mainstream", "toxic", "brainwash", "helpless", "dangerous", "propaganda"],
  "0.2": ["greedy", "predatory", "manipulative", "force", "unsuspecting", "useless"],
  "0.3": ["controversial", "push", "pushes", "radical", "agenda"],
  "0.4": ["shocking", "negligence", "exposed", "forces", "massive", "down", "throats"],
  "0.5": ["defiant", "aggressively"],

  // Chapter 1: Emotional Hooks
  "1.1": ["quietly", "secretly"],
  "1.2": ["risk", "hazard", "threatens"],
  "1.3": ["struggle", "confirms"],
  "1.4": ["invasion", "threatened", "polarizing", "fight"],
  "1.5": ["everyone", "disaster"],

  // Chapter 2: Loaded Language and Tone
  "2.1": ["destroys", "fiery"],
  "2.2": ["optimization"],
  "2.3": ["secretly", "reusing"],
  "2.4": ["demand", "sweeping", "standoff"],

  // Chapter 3: Visual Manipulation
  "3.1": ["angrily"],
  "3.2": ["shocking", "murky"],
  "3.3": ["violations"],
  "3.4": ["smashed", "graffiti"],
  "3.5": ["shouting", "throwing"],

  // Chapter 4: Labels and Framing
  "4.1": ["clash"],
  "4.2": ["infiltrate"],
  "4.3": ["radical"],

  // Chapter 5: Numbers and Data Tricks
  "5.1": ["double", "crime"],
  "5.2": ["collapses"],
  "5.3": ["doubled"],

  // Chapter 6: What's Missing
  "6.1": ["surge"],
  "6.2": ["gathers", "calls"],
  "6.3": ["trace"],
  "6.4": ["divided"],

  // Chapter 7: Tracing the Source
  "7.1": ["warn"],
  "7.2": ["cripple"],
  "7.3": ["switching"],
  "7.4": ["confirm"],
  "7.5": ["flood", "hundreds"],

  // Chapter 8: The Grammar Underneath
  "8.1": ["flooded"],
  "8.2": ["grapples", "escalation"],
  "8.3": ["threatens"]
};

// Premium blur typewriter component to prevent layout shifts and add cinematic quality
function Typewriter({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(/\s+/);
  return (
    <span className={className}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, filter: "blur(5px)", y: 3 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.45,
            delay: idx * 0.12,
            ease: "easeOut",
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function LessonsSection() {
  // 1. Flatten all techniques from chapters for sequential gameplay
  const allTechniques: FlattenedTechnique[] = [];
  let flatCounter = 0;
  chaptersData.forEach((chapter, cIdx) => {
    chapter.techniques.forEach((tech, tIdx) => {
      allTechniques.push({
        ...tech,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterIntro: chapter.intro,
        chapterIdx: cIdx,
        techIdx: tIdx,
        flatIdx: flatCounter++,
      });
    });
  });

  // 2. Persistent states
  const [progressIdx, setProgressIdx] = useState<number>(() => {
    const saved = localStorage.getItem("media_problem_progress");
    return saved ? Math.min(Number(saved), allTechniques.length) : 0;
  });

  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const saved = localStorage.getItem("media_problem_progress");
    return saved ? Math.min(Number(saved), allTechniques.length - 1) : 0;
  });

  const [chapter0Completed, setChapter0Completed] = useState<boolean>(() => {
    return localStorage.getItem("media_problem_chapter0_completed") === "true";
  });

  const [chapter0Step, setChapter0Step] = useState<number>(0);
  const [currentChapterIntroId, setCurrentChapterIntroId] = useState<number | null>(null);

  // Start in "intro" mode so they can see the clean chapter list
  const [gameMode, setGameMode] = useState<"intro" | "game" | "chapter0">(() => {
    const savedIntroDone = localStorage.getItem("media_problem_intro_done");
    return savedIntroDone === "true" ? "game" : "intro";
  });

  // Steps of active level:
  // 0: THE METHOD (Theory & explanation)
  // 1: THE EXPOSURE (Diagnostic query "Do you see bias?" with wow-factor reveal)
  // 2: THE TRAP (Interactive clicker, now compact and inline)
  // 3: THE CONTRAST (Flipped comparative view)
  // 4: THE CHALLENGE (Interactive binary choice)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Diagnostic State for Step 1
  const [votedNeutral, setVotedNeutral] = useState<boolean | null>(null);

  // Word finder state
  const [clickedWords, setClickedWords] = useState<number[]>([]);
  const [foundTrigger, setFoundTrigger] = useState<boolean>(false);
  const [lastClickedWord, setLastClickedWord] = useState<string>("");
  const [showHelperHint, setShowHelperHint] = useState<boolean>(false);

  // Challenge state
  const [challengeChoices, setChallengeChoices] = useState<{ text: string; isCorrect: boolean }[]>([]);
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  // Game feel states
  const [particleTrigger, setParticleTrigger] = useState<{ id: number; type: "success" | "error" }>({ id: 0, type: "success" });
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Chapter Quiz States
  const [quizChapterId, setQuizChapterId] = useState<number | null>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [quizSelectedChoice, setQuizSelectedChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const activeTech = allTechniques[currentIdx];
  const stepsToShow = [0, 1, 2, 3];

  // Persist progress
  useEffect(() => {
    localStorage.setItem("media_problem_progress", progressIdx.toString());
  }, [progressIdx]);

  // Reset level states when level changes
  useEffect(() => {
    setClickedWords([]);
    setFoundTrigger(false);
    setLastClickedWord("");
    setShowHelperHint(false);
    setVotedNeutral(null);
    setActiveStep(0);
  }, [currentIdx]);

  // Shuffle challenge options on step 3
  useEffect(() => {
    if (activeStep === 3 && activeTech) {
      if (activeTech.headlines) {
        const list = activeTech.headlines.map(h => ({ text: h.text, isCorrect: h.isCorrect }));
        // Deterministic shuffle for 3 options
        const sumId = activeTech.id.split(".").reduce((acc, v) => acc + Number(v), 0);
        const shuffled = [...list];
        if (sumId % 3 === 1) {
          const tmp = shuffled[0];
          shuffled[0] = shuffled[1];
          shuffled[1] = tmp;
        } else if (sumId % 3 === 2) {
          const tmp = shuffled[0];
          shuffled[0] = shuffled[2];
          shuffled[2] = tmp;
        }
        setChallengeChoices(shuffled);
      } else {
        const correctText = activeTech.unspun.split(".")[0] + ".";
        const incorrectText = activeTech.spun;
        const list = [
          { text: correctText, isCorrect: true },
          { text: incorrectText, isCorrect: false }
        ];
        // Deterministic shuffle
        const sumId = activeTech.id.split(".").reduce((acc, v) => acc + Number(v), 0);
        const shuffled = sumId % 2 === 0 ? list : [...list].reverse();
        setChallengeChoices(shuffled);
      }
      setSelectedChallengeIdx(null);
      setChallengeSubmitted(false);
    }
  }, [activeStep, currentIdx]);

  // Trigger celebration and sounds when entering a new chapter intro slide
  useEffect(() => {
    if (currentChapterIntroId !== null) {
      playSuccessSound();
      triggerHapticSuccess();
      setParticleTrigger(prev => ({ id: prev.id + 1, type: "success" }));
    }
  }, [currentChapterIntroId]);

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      // Auto-cancel confirmation after 4 seconds of inactivity
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }

    setProgressIdx(0);
    setCurrentIdx(0);
    setActiveStep(0);
    setGameMode("intro");
    setChapter0Completed(false);
    setConfirmReset(false);
    
    localStorage.removeItem("media_problem_intro_done");
    localStorage.removeItem("media_problem_chapter0_completed");
    localStorage.setItem("media_problem_progress", "0");
    
    playErrorSound();
    triggerHapticError();
  };

  const isWordTrigger = (word: string, techId: string): boolean => {
    const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"?]/g, "").trim();
    if (activeTech && activeTech.singleTriggerWord) {
      const cleanTrg = activeTech.singleTriggerWord.toLowerCase().trim();
      return (
        clean === cleanTrg ||
        clean === cleanTrg + "s" ||
        clean === cleanTrg + "ed" ||
        clean === cleanTrg + "ing" ||
        (cleanTrg.length > 3 && clean.startsWith(cleanTrg))
      );
    }
    const triggers = BIAS_TRIGGERS[techId] || [];
    return triggers.some(trg => {
      const cleanTrg = trg.toLowerCase().trim();
      return (
        clean === cleanTrg ||
        clean === cleanTrg + "s" ||
        clean === cleanTrg + "ed" ||
        clean === cleanTrg + "ing" ||
        (cleanTrg.length > 3 && clean.startsWith(cleanTrg))
      );
    });
  };

  const handleWordClick = (wordIdx: number, word: string, isTrigger: boolean) => {
    if (foundTrigger) return;
    if (clickedWords.includes(wordIdx)) return;

    setClickedWords(prev => [...prev, wordIdx]);
    setLastClickedWord(word);

    if (isTrigger) {
      setFoundTrigger(true);
      setShowHelperHint(false);
    } else {
      if (clickedWords.length >= 2) {
        setShowHelperHint(true);
      }
    }
  };

  // Launch the chapter at its first uncompleted technique
  const launchChapter = (chapterId: number) => {
    if (chapterId === 0) {
      setGameMode("chapter0");
      setChapter0Step(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const chapTechs = allTechniques.filter(t => t.chapterId === chapterId);
    if (chapTechs.length === 0) return;
    
    // Always start at the chapter's intro slide (e.g. 1.0, 2.0)
    const targetTech = chapTechs[0];

    setCurrentIdx(targetTech.flatIdx);
    setActiveStep(0);
    setCurrentChapterIntroId(chapterId); // Show the chapter intro slide!
    setGameMode("game");
    localStorage.setItem("media_problem_intro_done", "true");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChallengeSubmit = () => {
    if (selectedChallengeIdx === null) return;
    setChallengeSubmitted(true);

    const isCorrect = challengeChoices[selectedChallengeIdx]?.isCorrect;
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

  const handleAdvanceLevel = () => {
    if (currentIdx === progressIdx) {
      const nextProgress = progressIdx + 1;
      setProgressIdx(nextProgress);
      if (nextProgress < allTechniques.length) {
        const currentTech = allTechniques[currentIdx];
        const nextTech = allTechniques[nextProgress];
        if (nextTech.chapterId !== currentTech.chapterId) {
          // Entering next chapter, show its intro slide!
          setCurrentChapterIntroId(nextTech.chapterId);
        }
        setCurrentIdx(nextProgress);
      } else {
        // Complete!
      }
    } else {
      if (currentIdx < allTechniques.length - 1) {
        const currentTech = allTechniques[currentIdx];
        const nextTech = allTechniques[currentIdx + 1];
        if (nextTech.chapterId !== currentTech.chapterId) {
          // Entering next chapter, show its intro slide!
          setCurrentChapterIntroId(nextTech.chapterId);
        }
        setCurrentIdx(prev => prev + 1);
      } else {
        setGameMode("intro");
      }
    }
    setActiveStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedOrQuiz = () => {
    if (!activeTech) return;
    
    const isLastTechInChapter = currentIdx === allTechniques.length - 1 || allTechniques[currentIdx + 1].chapterId !== activeTech.chapterId;
    
    if (isLastTechInChapter) {
      setQuizChapterId(activeTech.chapterId);
      setQuizQuestionIdx(0);
      setQuizSelectedChoice(null);
      setQuizSubmitted(false);
      setQuizScore(0);
      setQuizCompleted(false);
      setGameMode("chapterQuiz");
      playSuccessSound();
      triggerHapticSuccess();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleAdvanceLevel();
    }
  };

  const handleFinishChapterQuiz = () => {
    const currentTech = allTechniques[currentIdx];
    
    if (currentIdx === progressIdx) {
      const nextProgress = progressIdx + 1;
      setProgressIdx(nextProgress);
      if (nextProgress < allTechniques.length) {
        const nextTech = allTechniques[nextProgress];
        setCurrentChapterIntroId(nextTech.chapterId);
        setCurrentIdx(nextProgress);
        setGameMode("game");
      } else {
        // Completed the whole course!
        setGameMode("intro");
      }
    } else {
      if (currentIdx < allTechniques.length - 1) {
        const nextTech = allTechniques[currentIdx + 1];
        setCurrentChapterIntroId(nextTech.chapterId);
        setCurrentIdx(prev => prev + 1);
        setGameMode("game");
      } else {
        setGameMode("intro");
      }
    }
    
    setActiveStep(0);
    setQuizChapterId(null);
    setQuizCompleted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuizSubmitAnswer = () => {
    if (quizSelectedChoice === null || quizChapterId === null) return;
    
    const questions = chapterQuizzesData[quizChapterId] || [];
    const question = questions[quizQuestionIdx];
    if (!question) return;

    setQuizSubmitted(true);
    const isCorrect = quizSelectedChoice === question.correctIndex;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
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

  const handleQuizNextQuestion = () => {
    if (quizChapterId === null) return;
    const questions = chapterQuizzesData[quizChapterId] || [];
    
    if (quizQuestionIdx < questions.length - 1) {
      setQuizQuestionIdx(prev => prev + 1);
      setQuizSelectedChoice(null);
      setQuizSubmitted(false);
    } else {
      setQuizCompleted(true);
      playSuccessSound();
      triggerHapticSuccess();
      setParticleTrigger(prev => ({ id: prev.id + 1, type: "success" }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startCalibrationCourse = () => {
    if (!chapter0Completed) {
      setGameMode("chapter0");
      setChapter0Step(0);
    } else {
      setGameMode("game");
      localStorage.setItem("media_problem_intro_done", "true");
      const activeIndex = Math.min(progressIdx, allTechniques.length - 1);
      setCurrentIdx(activeIndex);
      setActiveStep(0);
      const activeTech = allTechniques[activeIndex];
      if (activeTech && activeTech.techIdx === 0) {
        setCurrentChapterIntroId(activeTech.chapterId);
      } else {
        setCurrentChapterIntroId(null);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gameCompleted = progressIdx >= allTechniques.length;

  return (
    <div id="lessons-overhaul-main-container" className="max-w-3xl mx-auto space-y-6 flex flex-col justify-between min-h-[400px]">

      <AnimatePresence mode="wait">
        {gameMode === "intro" ? (
          /* ========================================================
             COMPACT SYLLABUS: SHOWS ONLY CHAPTERS, NO LESSONS
             ======================================================== */
          <motion.div
            key="fundamentals-chapters-syllabus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
            id="fundamentals-intro-view"
          >
            {/* Elegant Header Block */}
            <div className="text-center space-y-3 py-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#8F8E8C] font-bold block">
                The Calibration Course
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Deconstructing Media Bias
              </h2>
              <p className="text-sm text-[#8F8E8C] font-serif italic max-w-xl mx-auto leading-relaxed">
                Select a chapter course to deconstruct preloaded headlines and strip away emotional manipulation.
              </p>
            </div>

            {/* Ultra-Compact Chapters List (No lessons shown) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="chapters-list-grid">
              {chaptersData.map((chap, idx) => {
                const chapTechs = allTechniques.filter(t => t.chapterId === chap.id);
                const firstTechIdx = chapTechs[0]?.flatIdx ?? 0;
                
                // Chapter status
                let isChapterCompleted = false;
                let isChapterUnlocked = false;
                let masteredCount = 0;
                let totalCount = 0;

                if (chap.id === 0) {
                  isChapterCompleted = chapter0Completed;
                  isChapterUnlocked = true;
                } else {
                  masteredCount = chapTechs.filter(t => t.flatIdx < progressIdx).length;
                  totalCount = chapTechs.length;
                  isChapterCompleted = masteredCount === totalCount;
                  isChapterUnlocked = true; // Don't lock chapters you haven't reached!
                }

                return (
                  <div 
                    key={chap.id}
                    className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      isChapterUnlocked 
                        ? "bg-[#1A1A19] border-[#2C2C2B] hover:border-white/30" 
                        : "bg-[#141413]/40 border-[#2C2C2B]/30 opacity-40 select-none"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#20201F] text-[#8F8E8C] border border-[#2C2C2B]">
                          {chap.id === 0 ? "INTRO" : `CHAPTER ${chap.id}`}
                        </span>
                        
                        {isChapterCompleted ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {chap.id === 0 ? "Completed" : "Mastered"}
                          </span>
                        ) : chap.id === 0 ? (
                          <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/40">
                            Required First
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-semibold text-[#8F8E8C]">
                            {masteredCount} / {totalCount} Completed
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#E3E3E2] leading-snug">
                        {chap.title}
                      </h4>
                      <p className="text-xs text-[#8F8E8C] leading-relaxed font-sans line-clamp-3">
                        {chap.intro}
                      </p>
                    </div>

                    {/* Progress Bar & Launch Button */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      {/* Clean minimal progress bar */}
                      <div className="flex-1 bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                        <div 
                          className="bg-white h-full transition-all duration-500"
                          style={{ width: chap.id === 0 ? (chapter0Completed ? "100%" : "0%") : `${(masteredCount / totalCount) * 100}%` }}
                        />
                      </div>

                      {isChapterUnlocked ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isChapterCompleted && chap.id > 0 && (
                            <button
                              id={`quiz-chapter-${chap.id}`}
                              onClick={() => {
                                setQuizChapterId(chap.id);
                                setQuizQuestionIdx(0);
                                setQuizSelectedChoice(null);
                                setQuizSubmitted(false);
                                setQuizScore(0);
                                setQuizCompleted(false);
                                setGameMode("chapterQuiz");
                                playSuccessSound();
                                triggerHapticSuccess();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="border border-[#2C2C2B] hover:bg-[#20201F] text-[#8F8E8C] hover:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Brain className="w-3 h-3 text-purple-400" />
                              Quiz
                            </button>
                          )}
                          <button
                            id={`launch-chapter-${chap.id}`}
                            onClick={() => launchChapter(chap.id)}
                            className="bg-white hover:bg-neutral-200 text-black text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            {isChapterCompleted ? "Review" : "Launch"}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="shrink-0 text-neutral-600 flex items-center gap-1 text-[10px] font-mono uppercase font-bold">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

             {/* Bottom Panel */}
            <div className="pt-2 flex justify-between items-center border-t border-[#2C2C2B] text-xs font-mono text-[#8F8E8C]">
              {progressIdx > 0 || chapter0Completed || confirmReset ? (
                <button
                  id="reset-calibration-progress-btn"
                  onClick={handleResetProgress}
                  className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    confirmReset
                      ? "text-red-500 bg-red-950/20 px-2.5 py-1.5 rounded-lg border border-red-900/40 animate-pulse font-extrabold"
                      : "text-red-400/80 hover:text-red-300"
                  }`}
                >
                  <RotateCcw className="w-3 h-3 animate-spin-slow" /> {confirmReset ? "Are you sure? Click again to Reset" : "Reset Progress"}
                </button>
              ) : (
                <div />
              )}

              <button
                id="syllabus-start-btn"
                onClick={startCalibrationCourse}
                className="bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow"
              >
                {!chapter0Completed ? "Start Intro Chapter" : progressIdx > 0 ? "Resume Training" : "Begin Interactive Training"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : gameCompleted ? (
          /* ========================================================
             THE VICTORY COMPLETION SCREEN
             ======================================================== */
          <motion.div
            key="game-completed-victory"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#1A1A19] border border-[#2C2C2B] p-10 text-center space-y-6 rounded-xl flex-1 flex flex-col justify-center items-center"
            id="game-victory-screen"
          >
            <div className="p-4 bg-[#20201F] border border-[#2C2C2B] rounded-full">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold block">
                Course Successfully Completed
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                You are a Media Literacy Expert.
              </h3>
              <p className="text-xs md:text-sm text-[#8F8E8C] leading-relaxed font-sans">
                You have analyzed, audited, and mastered all 32 media manipulation and bias techniques. Your critical thinking is calibrated.
              </p>
            </div>

            <div className="border-t border-[#2C2C2B] pt-6 w-full max-w-sm space-y-4">
              <div className="flex justify-center gap-3">
                <button
                  id="victory-reset-progress-btn"
                  onClick={handleResetProgress}
                  className={`flex items-center gap-1 border px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    confirmReset
                      ? "bg-red-950/20 border-red-900/40 text-red-400 animate-pulse font-extrabold"
                      : "border-[#2C2C2B] hover:bg-[#20201F] text-[#8F8E8C]"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {confirmReset ? "Sure?" : "Reset"}
                </button>
                <button
                  id="victory-view-syllabus-btn"
                  onClick={() => setGameMode("intro")}
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Syllabus Index
                </button>
              </div>
            </div>
          </motion.div>
        ) : gameMode === "chapter0" ? (
          /* ========================================================
             CHAPTER 0 INTRO STUDY SLIDES
             ======================================================== */
          <motion.div
            key="chapter0-flow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-[#1A1A19] border border-[#2C2C2B] p-6 md:p-8 rounded-xl flex flex-col justify-between min-h-[460px]"
          >
            {/* Minimal Header */}
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider border-b border-[#2C2C2B] pb-3 mb-6 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGameMode("intro")}
                  className="text-[#8F8E8C] hover:text-white transition-colors cursor-pointer font-bold"
                >
                  &larr; Index
                </button>
                <span className="text-white/20">|</span>
                <span className="text-white/60 font-semibold font-serif italic text-xs">
                  0.{chapter0Step + 1}
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                {[0, 1, 2].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      chapter0Step === stepIdx ? "w-8 bg-white" : "w-2 bg-[#2C2C2B]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 py-4 flex flex-col justify-center max-w-2xl mx-auto space-y-6 text-center">
              {chapter0Step === 0 && (
                <div className="space-y-4 animate-fade-in" key="step0">
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    What is Media Bias?
                  </h3>
                  <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl text-left pl-6 border-l-2 border-l-white/60 shadow-inner">
                    <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                      <Typewriter text="Bias is not just about lying. It is a way of writing that changes how neutral facts look to you. When something happens in the news, reporters often do not just tell you what happened. Instead, they choose words that make you feel a certain way before you even have time to think for yourself." />
                    </p>
                  </div>
                </div>
              )}

              {chapter0Step === 1 && (
                <div className="space-y-4 animate-fade-in" key="step1">
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Saturated in Daily Life
                  </h3>
                  <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl text-left pl-6 border-l-2 border-l-white/60 shadow-inner">
                    <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                      <Typewriter text="You see this every day online, on social media, and on TV news. Apps and websites are designed to make you angry so you stay online longer. This quiet, constant framing shapes how you see your neighborhood, how you vote, and what you buy, without you ever noticing." />
                    </p>
                  </div>
                </div>
              )}

              {chapter0Step === 2 && (
                <div className="space-y-4 animate-fade-in" key="step2">
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Regain Cognitive Sovereignty
                  </h3>
                  <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl text-left pl-6 border-l-2 border-l-white/60 shadow-inner">
                    <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                      <Typewriter text="Finding bias is not about politics or taking sides. It is about looking at how words are used. Real and fair news should only focus on physical facts: who went where, what was said, and what is on the record. By learning these 32 tricks, you can block out manipulation and see facts clearly." />
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-[#2C2C2B] flex justify-between items-center text-xs">
              <button
                disabled={chapter0Step === 0}
                onClick={() => setChapter0Step(prev => prev - 1)}
                className="font-mono text-[#8F8E8C] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                &larr; Back
              </button>

              {chapter0Step < 2 ? (
                <button
                  onClick={() => setChapter0Step(prev => prev + 1)}
                  className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setChapter0Completed(true);
                    localStorage.setItem("media_problem_chapter0_completed", "true");
                    setGameMode("intro");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow shadow-emerald-500/20"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ) : currentChapterIntroId !== null ? (
          /* ========================================================
             CHAPTER INTRO SLIDE (e.g., 1.0, 2.0, etc.)
             ======================================================== */
          <motion.div
            key={`chapter-intro-slide-${currentChapterIntroId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-[#1A1A19] border border-[#2C2C2B] p-6 md:p-8 rounded-xl flex flex-col justify-between min-h-[460px]"
          >
            <JuiceParticles trigger={particleTrigger} />
            {/* Minimal Header */}
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider border-b border-[#2C2C2B] pb-3 mb-6 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setGameMode("intro");
                    setCurrentChapterIntroId(null);
                  }}
                  className="text-[#8F8E8C] hover:text-white transition-colors cursor-pointer font-bold"
                >
                  &larr; Index
                </button>
                <span className="text-white/20">|</span>
                <div className="flex gap-1.5 items-center">
                  {allTechniques.filter(t => t.chapterId === currentChapterIntroId).map((t) => {
                    const isCompleted = t.flatIdx < progressIdx;
                    return (
                      <div
                        key={t.id}
                        title={t.name}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isCompleted ? "w-1.5 bg-emerald-500" : "w-1.5 bg-[#2C2C2B]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                {[0, 1, 2, 3, 4].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      stepIdx === 0 ? "w-8 bg-white" : "w-2 bg-[#2C2C2B]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 py-4 flex flex-col justify-center max-w-2xl mx-auto space-y-6 text-center">
              <div className="space-y-4 animate-fade-in">
                <div className="inline-block mx-auto px-6 py-2.5 bg-purple-950/30 border border-purple-800/40 rounded-xl shadow-lg">
                  <span className="font-serif text-2xl md:text-3xl text-purple-300 font-semibold tracking-wide block">
                    Chapter {currentChapterIntroId}
                  </span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug pt-1">
                  {chaptersData.find(c => c.id === currentChapterIntroId)?.title}
                </h3>
                <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl text-left pl-6 border-l-2 border-l-white/60 shadow-inner">
                  <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                    <Typewriter text={chaptersData.find(c => c.id === currentChapterIntroId)?.intro || ""} />
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-[#2C2C2B] flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  setGameMode("intro");
                  setCurrentChapterIntroId(null);
                }}
                className="font-mono text-[#8F8E8C] hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                &larr; Index
              </button>

              <button
                onClick={() => {
                  setCurrentChapterIntroId(null);
                  setActiveStep(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow shadow-emerald-500/20"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : gameMode === "chapterQuiz" && quizChapterId !== null ? (
          /* ========================================================
             THE CHAPTER QUIZ MODULE
             ======================================================== */
          <motion.div
            key={`chapter-quiz-view-${quizChapterId}-${quizQuestionIdx}-${quizCompleted}`}
            initial={{ opacity: 0, y: 12 }}
            animate={shouldShake ? { x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={shouldShake ? { duration: 0.5 } : { duration: 0.25 }}
            className="relative bg-[#1A1A19] border border-[#2C2C2B] p-6 md:p-8 rounded-xl flex flex-col justify-between min-h-[480px] overflow-hidden"
            id="chapter-quiz-game-container"
          >
            <JuiceParticles trigger={particleTrigger} />
            
            {!quizCompleted ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider border-b border-[#2C2C2B] pb-3 mb-6 select-none">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setGameMode("intro");
                        setQuizChapterId(null);
                      }}
                      className="text-[#8F8E8C] hover:text-white transition-colors cursor-pointer font-bold"
                    >
                      &larr; Exit Quiz
                    </button>
                    <span className="text-white/20">|</span>
                    <span className="text-purple-300 font-bold tracking-widest font-mono">
                      CHAP {quizChapterId} MASTERY QUIZ
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8F8E8C] font-bold">
                    <span>Q{quizQuestionIdx + 1} / 3</span>
                    <div className="w-16 h-1.5 bg-[#2C2C2B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${((quizQuestionIdx + 1) / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-5" id="chapter-quiz-questions-wizard">
                  {chapterQuizzesData[quizChapterId]?.[quizQuestionIdx] ? (
                    (() => {
                      const question = chapterQuizzesData[quizChapterId][quizQuestionIdx];
                      return (
                        <>
                          {/* Scenario Card */}
                          <div className="notion-card p-5 border-[#2C2C2B] bg-[#141413] space-y-4 rounded-xl shadow-inner">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                                Context / Scenario:
                              </span>
                              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                                {question.scenario}
                              </p>
                            </div>

                            <div className="border-t border-[#2C2C2B] pt-3.5 space-y-1.5">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5" /> Media Headline:
                              </span>
                              <p className="font-serif text-base italic text-red-200 font-bold leading-snug pl-3 border-l border-[#2C2C2B]">
                                "{question.spunText}"
                              </p>
                            </div>
                          </div>

                          {/* Choices */}
                          <div className="space-y-2.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold px-1 block">
                              Select the Correct Analysis or Framing Method:
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="quiz-choices-grid">
                              {question.choices.map((choice, idx) => {
                                const isSelected = quizSelectedChoice === idx;
                                let choiceBtnStyle = "bg-[#1A1A19] border-[#2C2C2B] text-[#8F8E8C] hover:bg-[#20201F]";

                                if (isSelected) {
                                  choiceBtnStyle = "bg-[#2C2C2B] border-purple-400 text-white font-semibold";
                                }

                                if (quizSubmitted) {
                                  const isCorrectChoice = idx === question.correctIndex;
                                  const isUserChoice = idx === quizSelectedChoice;

                                  if (isCorrectChoice) {
                                    choiceBtnStyle = "bg-emerald-950/20 border-emerald-900/40 text-emerald-300 font-medium";
                                  } else if (isUserChoice) {
                                    choiceBtnStyle = "bg-red-950/20 border-red-900/40 text-red-300 line-through opacity-85";
                                  } else {
                                    choiceBtnStyle = "bg-[#141413] border-[#2C2C2B]/60 text-[#8F8E8C]/50 opacity-50";
                                  }
                                }

                                return (
                                  <button
                                    key={idx}
                                    id={`quiz-choice-${idx}`}
                                    disabled={quizSubmitted}
                                    onClick={() => {
                                      setQuizSelectedChoice(idx);
                                      playTapSound();
                                      triggerHapticTap();
                                    }}
                                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 disabled:cursor-default cursor-pointer ${choiceBtnStyle}`}
                                  >
                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                                      isSelected && !quizSubmitted ? "bg-purple-400 text-black font-extrabold" : "bg-[#20201F] text-[#8F8E8C]"
                                    }`}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="font-sans leading-tight mt-0.5">{choice}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Explanation Box */}
                          {quizSubmitted && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-xl border text-xs md:text-sm ${
                                quizSelectedChoice === question.correctIndex
                                  ? "bg-emerald-950/25 border-emerald-900/40 text-emerald-200"
                                  : "bg-[#20201F] border-[#2C2C2B] text-neutral-300"
                              }`}
                              id="quiz-explanation-box"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                  {quizSelectedChoice === question.correctIndex ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-400" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[9px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold">
                                    {quizSelectedChoice === question.correctIndex ? "Correct Calibration" : "Calibration Failed"}
                                  </h4>
                                  <p className="font-serif leading-relaxed text-xs">
                                    {question.explanation}
                                  </p>
                                  <div className="pt-1 text-[9px] font-mono text-[#8F8E8C] flex items-center gap-1">
                                    <Info className="w-3 h-3 text-purple-300 shrink-0" />
                                    <span>Pertains to technique: <strong className="text-[#E3E3E2]">{question.techniqueName}</strong></span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-center py-10 text-[#8F8E8C] text-sm">
                      Question data not found.
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[#2C2C2B] flex justify-end items-center">
                  {!quizSubmitted ? (
                    <button
                      id="submit-quiz-answer-btn"
                      onClick={handleQuizSubmitAnswer}
                      disabled={quizSelectedChoice === null}
                      className="bg-white text-black hover:bg-neutral-200 disabled:opacity-35 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Verify Calibration
                    </button>
                  ) : (
                    <button
                      id="next-quiz-question-btn"
                      onClick={handleQuizNextQuestion}
                      className="flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      {quizQuestionIdx < (chapterQuizzesData[quizChapterId]?.length || 0) - 1 ? "Next Question" : "View Calibration Results"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* RESULTS VIEW */
              <div className="flex-1 flex flex-col justify-center items-center py-8 space-y-6 text-center max-w-md mx-auto" id="quiz-results-view">
                <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-full animate-bounce">
                  <Award className="w-12 h-12 text-purple-400" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8F8E8C] font-bold block">
                    Chapter {quizChapterId} Calibration Completed
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">
                    {quizScore} / 3 Correct Answers
                  </h3>
                  <p className="text-xs md:text-sm text-[#8F8E8C] leading-relaxed font-sans">
                    {quizScore === 3
                      ? `Flawless calibration! You have fully mastered Chapter ${quizChapterId} and developed bulletproof protection against these media bias strategies.`
                      : quizScore >= 1
                      ? `Good job! You are successfully identifying bias patterns in real-time. Review the active techniques to reach 3/3 mastery.`
                      : `Keep training! Media bias is designed to slip past your conscious defenses. Review Chapter ${quizChapterId}'s techniques to calibrate your analytical shields.`}
                  </p>
                </div>

                <div className="pt-4 flex gap-3 w-full">
                  <button
                    id="retake-quiz-btn"
                    onClick={() => {
                      setQuizQuestionIdx(0);
                      setQuizSelectedChoice(null);
                      setQuizSubmitted(false);
                      setQuizScore(0);
                      setQuizCompleted(false);
                      playTapSound();
                      triggerHapticTap();
                    }}
                    className="flex-1 border border-[#2C2C2B] hover:bg-[#20201F] text-[#8F8E8C] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retake Quiz
                  </button>
                  <button
                    id="finish-quiz-btn"
                    onClick={handleFinishChapterQuiz}
                    className="flex-1 bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-bold flex items-center justify-center gap-1"
                  >
                    Proceed
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ========================================================
             THE ACTIVE DECONSTRUCTION LEVEL (SLIDE-BY-SLIDE VIEW)
             ======================================================== */
          <motion.div
            key={`calibration-slide-${activeStep}-${activeTech.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={shouldShake ? { x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={shouldShake ? { duration: 0.5 } : { duration: 0.2 }}
            className="relative bg-[#1A1A19] border border-[#2C2C2B] p-6 md:p-8 rounded-xl flex flex-col justify-between min-h-[460px] overflow-hidden"
            id="active-level-game-container"
          >
            <JuiceParticles trigger={particleTrigger} />
            {/* Slide Navigation Steps */}
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider border-b border-[#2C2C2B] pb-2.5 mb-3 select-none">
              <div className="flex items-center gap-2.5">
                <button
                  id="header-back-to-syllabus"
                  onClick={() => setGameMode("intro")}
                  className="text-[#8F8E8C] hover:text-white transition-colors cursor-pointer font-bold"
                >
                  &larr; Index
                </button>
                <span className="text-white/20">|</span>
                <div className="flex gap-1.5 items-center">
                  {allTechniques.filter(t => t.chapterId === activeTech.chapterId).map((t) => {
                    const isActive = t.id === activeTech.id;
                    const isCompleted = t.flatIdx < progressIdx;
                    return (
                      <div
                        key={t.id}
                        title={t.name}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-5 bg-white"
                            : isCompleted
                            ? "w-1.5 bg-emerald-500"
                            : "w-1.5 bg-[#2C2C2B]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-2.5 items-center">
                {stepsToShow.map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === stepIdx
                        ? "w-8 bg-white"
                        : stepIdx < activeStep
                        ? "w-2 bg-emerald-500"
                        : "w-2 bg-[#2C2C2B]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Dynamic Slide Canvas */}
            <div className="flex-1 py-4 flex flex-col justify-center">
              
              {/* SLIDE STEP 0: THE THEORY */}
              {activeStep === 0 && (
                <div className="space-y-4 max-w-2xl mx-auto text-center animate-fade-in" id="slide-step-0-theory">
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {activeTech.name}
                  </h3>
                  
                  <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl text-left pl-6 border-l-2 border-l-white/60 shadow-inner">
                    <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                      <Typewriter text={activeTech.technique} />
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE STEP 1: THE EXPOSURE (Ask if they see bias) */}
              {activeStep === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto text-center animate-fade-in" id="slide-step-1-exposure">
                  {/* The Raw Headline */}
                  <div className="p-6 bg-[#141413] border border-[#2C2C2B] rounded-xl shadow-inner">
                    <p className="font-serif text-xl md:text-2xl text-white italic leading-relaxed">
                      "{activeTech.spun}"
                    </p>
                  </div>

                  {votedNeutral === null ? (
                    <div className="space-y-4">
                      <p className="font-serif text-xl md:text-2xl text-white leading-relaxed font-medium">
                        Does this statement read as a fully objective, neutral physical report?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          id="vote-unbiased-btn"
                          onClick={() => { setVotedNeutral(true); playTapSound(); triggerHapticTap(); }}
                          className="px-6 py-3 border border-[#2C2C2B] hover:border-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 bg-[#20201F] hover:bg-[#2C2C2B] cursor-pointer transition-all"
                        >
                          Objective & Fair
                        </button>
                        <button
                          id="vote-biased-btn"
                          onClick={() => { setVotedNeutral(false); playTapSound(); triggerHapticTap(); }}
                          className="px-6 py-3 border border-[#2C2C2B] hover:border-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#20201F] hover:bg-[#2C2C2B] cursor-pointer transition-all"
                        >
                          Framed & Biased
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-[#20201F] border border-[#2C2C2B] text-left space-y-3 max-w-2xl mx-auto shadow-lg"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                        Bias Highlighted
                      </span>
                      <p className="font-serif text-base md:text-lg italic text-neutral-200 leading-relaxed">
                        {activeTech.spun.split(/\s+/).map((word, idx) => {
                          const isTrg = isWordTrigger(word, activeTech.id);
                          return (
                            <span 
                              key={idx} 
                              className={isTrg ? "text-white font-bold bg-[#2C2C2B] px-1.5 py-0.5 rounded border border-white/10" : ""}
                            >
                              {word}{" "}
                            </span>
                          );
                        })}
                      </p>
                      <p className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed pt-2 border-t border-[#2C2C2B]/50">
                        {votedNeutral 
                          ? "It is incredibly easy to read past this! " 
                          : "Superb intuition. "}
                        Notice how the highlighted phrase targets your feelings directly. This preloads a conclusion before you've seen a single verified physical fact.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* SLIDE STEP 2: THE CONTRAST (Side-by-Side comparison) */}
              {activeStep === 2 && (
                <div className="space-y-4 max-w-2xl mx-auto animate-fade-in" id="slide-step-2-contrast">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8F8E8C] font-bold block text-center">
                    Flipped Comparison
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    {/* Biased Frame */}
                    <div className="p-5 bg-[#141413] border border-[#2C2C2B] rounded-xl flex flex-col justify-between space-y-3 text-left shadow-inner">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Biased / Loaded
                        </span>
                        <p className="font-serif text-sm md:text-base italic text-[#8F8E8C] line-through leading-relaxed">
                          "{activeTech.spun}"
                        </p>
                      </div>
                    </div>

                    {/* Objective Reality */}
                    <div className="p-5 bg-neutral-900 border border-[#2C2C2B] rounded-xl flex flex-col justify-between space-y-3 text-left shadow-md">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                          Objective / Neutral
                        </span>
                        <div className="font-serif text-sm md:text-base text-neutral-100 leading-relaxed">
                          <Typewriter text={activeTech.unspun} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE STEP 3: THE CHALLENGE (Binary/Headline Choice Mastery) */}
              {activeStep === 3 && (
                <div className="space-y-4 max-w-2xl mx-auto animate-fade-in" id="slide-step-3-challenge">
                  <div className="space-y-1.5 text-center">
                    <p className="font-serif text-2xl md:text-3xl text-white max-w-xl mx-auto leading-relaxed font-bold">
                      Which headline is the most objective?
                    </p>
                  </div>

                  {/* Clean headline choices */}
                  <div className="space-y-3 max-w-2xl mx-auto" id="binary-challenge-options">
                    {challengeChoices.map((choice, idx) => {
                      const isSelected = selectedChallengeIdx === idx;
                      let btnStyle = "bg-[#141413] border-[#2C2C2B] text-neutral-300 hover:border-[#8F8E8C] hover:bg-[#20201F]";

                      if (isSelected) {
                        btnStyle = "bg-white border-white text-black font-semibold shadow-md";
                      }

                      if (challengeSubmitted) {
                        if (choice.isCorrect) {
                          btnStyle = "bg-emerald-950/30 border-emerald-850 text-emerald-200 ring-1 ring-emerald-800";
                        } else if (isSelected) {
                          btnStyle = "bg-red-950/20 border-red-900/50 text-red-300 opacity-80 line-through";
                        } else {
                          btnStyle = "bg-[#141413]/50 border-transparent text-[#8F8E8C]/30 opacity-40 cursor-default";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          id={`challenge-option-${idx}`}
                          disabled={challengeSubmitted}
                          onClick={() => { setSelectedChallengeIdx(idx); playTapSound(); triggerHapticTap(); }}
                          className={`w-full text-left p-4.5 rounded-xl border text-sm transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default leading-relaxed ${btnStyle}`}
                        >
                          <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded shrink-0 ${
                            isSelected && !challengeSubmitted ? "bg-black text-white" : "bg-[#20201F] text-[#8F8E8C]"
                          }`}>
                            Choice {idx + 1}
                          </span>
                          <span className={`font-serif leading-relaxed mt-0.5 flex-1 text-sm md:text-base ${
                            isSelected && !challengeSubmitted ? "text-black font-semibold" : "text-neutral-100"
                          }`}>{choice.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback summary */}
                  <div className="min-h-[70px] text-xs">
                    <AnimatePresence mode="wait">
                      {challengeSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-5 rounded-xl border max-w-2xl mx-auto shadow-md ${
                            challengeChoices[selectedChallengeIdx ?? 0]?.isCorrect
                              ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-200"
                              : "bg-red-950/20 border-red-900/40 text-red-200"
                          }`}
                        >
                          {challengeChoices[selectedChallengeIdx ?? 0]?.isCorrect ? (
                            <p className="font-sans text-xs md:text-sm leading-relaxed text-neutral-300">
                              Correct. This headline presents the raw physical occurrences directly without pre-programming the reader's judgment.
                            </p>
                          ) : (
                            <p className="font-sans text-xs md:text-sm leading-relaxed text-[#8F8E8C]">
                              This headline relies on loaded framing or pre-programmed judgment terms. Select the most objective option.
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Control Panel */}
            <div className="border-t border-[#2C2C2B] pt-4 mt-2 flex justify-between items-center text-xs">
              
              {/* Back slide step button */}
              <button
                id="back-step-btn"
                onClick={() => {
                  if (activeStep > 0) {
                    setActiveStep(prev => prev - 1);
                  } else {
                    if (activeTech.techIdx === 0) {
                      // First technique of chapter, go back to Chapter Intro Slide (C.0)
                      setCurrentChapterIntroId(activeTech.chapterId);
                    } else {
                      // Go back to previous technique in this chapter, at Step 3
                      setCurrentIdx(prev => prev - 1);
                      setActiveStep(3);
                    }
                  }
                }}
                className="font-mono text-[#8F8E8C] hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                &larr; Back
              </button>

              {/* Dynamic Step Proceed Target */}
              <div className="flex items-center gap-3">
                
                {/* Step 1: Force answer before continuing */}
                {activeStep === 1 && votedNeutral !== null && (
                  <button
                    id="step-btn-1"
                    onClick={() => setActiveStep(2)}
                    className="flex items-center gap-1 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Step 0 */}
                {activeStep === 0 && (
                  <button
                    id="step-btn-0"
                    onClick={() => setActiveStep(1)}
                    className="flex items-center gap-1 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Step 2 */}
                {activeStep === 2 && (
                  <button
                    id="step-btn-2"
                    onClick={() => setActiveStep(3)}
                    className="flex items-center gap-1 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Step 3 */}
                {activeStep === 3 && (
                  <>
                    {!challengeSubmitted ? (
                      <button
                        id="submit-challenge-btn"
                        disabled={selectedChallengeIdx === null}
                        onClick={handleChallengeSubmit}
                        className="bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Next
                      </button>
                    ) : (
                      <>
                        {challengeChoices[selectedChallengeIdx ?? 0]?.isCorrect ? (
                          <button
                            id="step-btn-advance"
                            onClick={handleProceedOrQuiz}
                            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow shadow-emerald-500/20"
                          >
                            Next
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            id="reset-challenge-btn"
                            onClick={() => {
                              setSelectedChallengeIdx(null);
                              setChallengeSubmitted(false);
                            }}
                            className="flex items-center gap-1 border border-red-800 text-red-400 bg-red-950/20 hover:bg-red-950/40 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Try Again
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
