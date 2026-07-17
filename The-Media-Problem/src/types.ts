export interface Technique {
  id: string;
  name: string;
  technique: string;
  spun: string;
  unspun: string;
  singleTriggerWord?: string;
  headlines?: { text: string; isCorrect: boolean }[];
}

export interface Chapter {
  id: number;
  title: string;
  intro: string;
  techniques: Technique[];
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  spunText: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  techniqueName: string;
  type?: "identify-technique" | "select-biased-headline";
  chapterId?: number;
}

export interface DetectedTechnique {
  name: string;
  excerpt: string;
  analysis: string;
  unspun: string;
}

export interface DetectedFact {
  statement: string;
  verdict: "verified" | "unsubstantiated" | "disputed" | "false";
  explanation: string;
}

export interface BiasDirection {
  direction: string;
  neutralPerspective: string;
}

export interface AnalysisResponse {
  score: number; // Overall composite bias score
  biasScore: number; // Bias score (0-100)
  factualScore: number; // Factual score (0-100)
  summary: string;
  techniques: DetectedTechnique[];
  facts: DetectedFact[];
  biasDirection?: BiasDirection;
  isFallback?: boolean;
  rawErrorMessage?: string;
  originalTextSource?: string;
  analyzedText?: string;
}
