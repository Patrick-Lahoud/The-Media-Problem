import { useState, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResponse, DetectedTechnique } from "../types";
import {
  Sparkles,
  AlertTriangle,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Link as LinkIcon,
  Fingerprint,
  Info,
  ChevronDown,
  X,
  ArrowLeft,
  Compass,
  Gauge,
  BookOpen,
  Newspaper,
  ShieldQuestion
} from "lucide-react";
import {
  playSuccessSound,
  playErrorSound,
  playTapSound,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticTap
} from "../utils/gameJuice";

const EXAMPLE_TEMPLATES = [
  {
    title: "Pool Hours Dispute",
    text: "A shady nocturnal session of the Oakridge Neighborhood Association has residents in absolute fury. Last Tuesday night, the board quietly changed the community pool operating hours behind residents' backs, slashing evening swim times by two hours. This sudden, unannounced restriction of community privileges was executed without any public debate or prior notification. Angry homeowners are now demanding the immediate resignation of the board members, citing a total breakdown of local transparency and a complete disregard for paying families.",
  },
  {
    title: "Corporate Restructuring",
    text: "In a surprise announcement during yesterday's global town hall, the executive leadership team announced a series of crucial workforce modifications. The company is actively embarking on a massive high-powered workforce optimization and synergistic talent streamlining initiative to refine administrative overhead efficiency and accelerate growth. This strategic alignment, while resulting in localized resource adjustments, is designed to ensure long-term market leadership and deliver superior value to our stakeholders. Affected personnel will be provided transition support as the organization embraces this agile new operational framework.",
  },
  {
    title: "Suburban Crime Spike",
    text: "CRIME WAVE ALERT: Break-ins have officially doubled as savage chaos descends on the once-peaceful local suburban district of Greenfield. In a series of terrifying overnight raids, ruthless gangs of masked burglars targeted multiple family homes while residents slept inside. Local authorities are completely overwhelmed, and panic is rapidly spreading through the community as neighborhood watch groups warn that no household is safe from this unprecedented surge of lawless violence. Citizens are being urged to lock down their properties immediately.",
  },
  {
    title: "Bakery Insinuation",
    text: "Is a popular local bakery secretly reusing expired, moldy ingredients to feed unsuspecting school children? A shocking anonymous tip has raised terrifying questions about Sweet Treats Bakery, a major supplier for the regional school district. While no official health code violations have been confirmed by inspectors, concerned parents are demanding answers as rumors of cutting corners to boost profit margins continue to circulate online. The school board has refused to comment on whether they will terminate their lucrative catering contract with the bakery.",
  }
];

const PRECALCULATED_TEMPLATES_DATA: AnalysisResponse[] = [
  {
    score: 65,
    biasScore: 82,
    factualScore: 50,
    summary: "This neighborhood bulletin utilizes highly emotional 'outrage farming' descriptors and dramatic framing to report on a routine local decision regarding community pool hours. While the scheduling adjustment itself appears to be a factual occurrence, the text pre-loads the reader with anger by characterizing the board's meeting as a secretive conspiracy rather than a procedural session.",
    originalTextSource: "https://oakridgebulletin.com/pool-hours-dispute",
    analyzedText: "A shady nocturnal session of the Oakridge Neighborhood Association has residents in absolute fury. Last Tuesday night, the board quietly changed the community pool operating hours behind residents' backs, slashing evening swim times by two hours. This sudden, unannounced restriction of community privileges was executed without any public debate or prior notification. Angry homeowners are now demanding the immediate resignation of the board members, citing a total breakdown of local transparency and a complete disregard for paying families.",
    techniques: [
      {
        name: "outrage farming",
        excerpt: "shady nocturnal session",
        analysis: "Uses loaded adjectives ('shady', 'nocturnal') to imply conspiratorial secrecy behind a standard evening board meeting.",
        unspun: "evening meeting"
      },
      {
        name: "outrage farming",
        excerpt: "quietly changed the community pool operating hours behind residents' backs",
        analysis: "Uses the inflammatory idiom 'behind residents' backs' to assume malicious intent instead of standard delegation.",
        unspun: "adjusted the community pool schedule"
      },
      {
        name: "passive voice shield",
        excerpt: "This sudden, unannounced restriction of community privileges was executed",
        analysis: "Employs passive voice ('was executed') to omit who made the decision, inflating the sense of structural threat.",
        unspun: "The board announced these schedule changes"
      },
      {
        name: "fear appeals",
        excerpt: "total breakdown of local transparency and a complete disregard for paying families",
        analysis: "Exaggerates a minor scheduling change into a catastrophic failure of democracy and a moral assault.",
        unspun: "concerns regarding a lack of prior notification for residents"
      }
    ],
    facts: [
      {
        statement: "The Oakridge Neighborhood Association board changed the community pool operating hours last Tuesday night.",
        verdict: "verified",
        explanation: "Verified via the association's public calendar archives and minutes published on their official web portal."
      },
      {
        statement: "The board changed hours during a 'shady nocturnal session'.",
        verdict: "disputed",
        explanation: "Minutes indicate the session was a scheduled bi-monthly board meeting open to any members who RSVP'd in advance."
      },
      {
        statement: "Evening swim times were reduced by two hours.",
        verdict: "verified",
        explanation: "The pool schedule was modified from 8:00 AM - 10:00 PM to 8:00 AM - 8:00 PM, resulting in a two-hour reduction."
      }
    ],
    biasDirection: {
      direction: "Aggressively anti-board and resident-populist. It centers the anger of a vocal group of homeowners while ignoring any operational reasons the board might have had.",
      neutralPerspective: "A balanced report would present the schedule change alongside the board's stated reasoning, such as lifeguard staffing shortages or local quiet-hours compliance."
    }
  },
  {
    score: 45,
    biasScore: 70,
    factualScore: 85,
    summary: "This corporate memo is a textbook example of nominalization and euphemistic shielding. It uses highly clinical corporate jargon and complex abstract noun phrases to soften and sanitize the painful reality of employee layoffs, presenting business decisions as inevitable organizational optimizations.",
    originalTextSource: "https://bloomberg.com/corporate-restructuring-memo",
    analyzedText: "In a surprise announcement during yesterday's global town hall, the executive leadership team announced a series of crucial workforce modifications. The company is actively embarking on a massive high-powered workforce optimization and synergistic talent streamlining initiative to refine administrative overhead efficiency and accelerate growth. This strategic alignment, while resulting in localized resource adjustments, is designed to ensure long-term market leadership and deliver superior value to our stakeholders. Affected personnel will be provided transition support as the organization embraces this agile new operational framework.",
    techniques: [
      {
        name: "euphemism & corporate jargon",
        excerpt: "crucial workforce modifications",
        analysis: "Sanitizes the reality of job cuts or layoffs by framing them as neutral modifications.",
        unspun: "employee layoffs"
      },
      {
        name: "nominalization",
        excerpt: "massive high-powered workforce optimization and synergistic talent streamlining initiative",
        analysis: "Turns active personnel decisions into an abstract 'optimization initiative' to obscure human accountability.",
        unspun: "significant job cuts and role consolidations"
      },
      {
        name: "euphemism & corporate jargon",
        excerpt: "localized resource adjustments",
        analysis: "Uses sanitized, abstract language to refer directly to specific employees losing their jobs.",
        unspun: "discharging affected employees"
      },
      {
        name: "euphemism & corporate jargon",
        excerpt: "agile new operational framework",
        analysis: "Employs positive marketing buzzwords to justify and frame disruptive staff reductions as modern progress.",
        unspun: "new organization structure"
      }
    ],
    facts: [
      {
        statement: "The executive leadership team announced workforce modifications during yesterday's global town hall.",
        verdict: "verified",
        explanation: "Confirmed by internal corporate communications and public press statements released by the company."
      },
      {
        statement: "The initiative is designed to refine administrative overhead efficiency.",
        verdict: "verified",
        explanation: "SEC filings and budget blueprints show a target reduction of 15% in administrative expenditures."
      },
      {
        statement: "Affected personnel will be provided transition support.",
        verdict: "verified",
        explanation: "Company HR guidelines outline standard severance packages, outplacement services, and extended health benefits."
      }
    ],
    biasDirection: {
      direction: "Strongly pro-management and institutional. It frames actions from the perspective of shareholders and leadership while minimizing the human impact of the layoffs.",
      neutralPerspective: "A neutral document would state the exact number of jobs being eliminated, the departments affected, and the direct cost savings being targeted, without promotional jargon."
    }
  },
  {
    score: 78,
    biasScore: 92,
    factualScore: 40,
    summary: "This article represents an extreme fear-appeal and outrage-farming narrative. It leverages highly alarmist adjectives ('savage', 'terrifying', 'ruthless') and extreme sweeping statements to depict a routine uptick in localized crime as a total breakdown of civilization, short-circuiting rational risk assessment.",
    originalTextSource: "https://dailymail.co.uk/greenfield-crime-wave",
    analyzedText: "CRIME WAVE ALERT: Break-ins have officially doubled as savage chaos descends on the once-peaceful local suburban district of Greenfield. In a series of terrifying overnight raids, ruthless gangs of masked burglars targeted multiple family homes while residents slept inside. Local authorities are completely overwhelmed, and panic is rapidly spreading through the community as neighborhood watch groups warn that no household is safe from this unprecedented surge of lawless violence. Citizens are being urged to lock down their properties immediately.",
    techniques: [
      {
        name: "fear appeals",
        excerpt: "CRIME WAVE ALERT: Break-ins have officially doubled as savage chaos descends",
        analysis: "Creates an immediate sense of crisis by using words like 'savage chaos' to describe localized property crimes.",
        unspun: "Reported residential break-ins have increased in Greenfield"
      },
      {
        name: "outrage farming",
        excerpt: "terrifying overnight raids, ruthless gangs of masked burglars",
        analysis: "Uses high-arousal thriller language ('raids', 'ruthless gangs') to paint burglaries as coordinated military operations.",
        unspun: "unoccupied residential burglaries"
      },
      {
        name: "fear appeals",
        excerpt: "Local authorities are completely overwhelmed, and panic is rapidly spreading",
        analysis: "Unsubstantiated claim of systemic collapse ('completely overwhelmed') intended to maximize reader anxiety.",
        unspun: "Police have increased patrols and are investigating the incidents"
      },
      {
        name: "fear appeals",
        excerpt: "warn that no household is safe from this unprecedented surge of lawless violence",
        analysis: "Uses sweeping, absolute generalizations ('no household is safe') to amplify threat perception to a personal level.",
        unspun: "recommending residents secure their doors and report suspicious activity"
      }
    ],
    facts: [
      {
        statement: "Break-ins have officially doubled in Greenfield.",
        verdict: "disputed",
        explanation: "Greenfield Police Department records indicate residential burglaries rose from 2 to 4 over a 30-day period. While technically a 'doubling,' the absolute sample size is extremely small."
      },
      {
        statement: "Ruthless gangs targeted multiple family homes while residents slept inside.",
        verdict: "false",
        explanation: "Police blotter reports confirm all targeted homes were unoccupied vacation properties, with no contact between perpetrators and residents."
      },
      {
        statement: "Local authorities are completely overwhelmed.",
        verdict: "false",
        explanation: "Police Chief stated that average response times remain under 4 minutes and standard personnel levels are fully adequate."
      }
    ],
    biasDirection: {
      direction: "Sensationalist and alarmist. It prioritizes fear-based engagement to drive panic and clicks, completely distorting the statistical reality of local public safety.",
      neutralPerspective: "An objective report would provide the actual, low absolute numbers of incidents, note that the properties were vacant, and quote police recommendations without emotional descriptions."
    }
  },
  {
    score: 72,
    biasScore: 88,
    factualScore: 30,
    summary: "This snippet utilizes 'speculative questioning' and 'insinuation formatting' to float a highly damaging rumor. By framing the core accusation as a question, the author avoids libel laws while seeding intense suspicion in the minds of readers, without presenting any hard evidence.",
    originalTextSource: "https://buzzfeed.com/sweet-treats-bakery-scandal",
    analyzedText: "Is a popular local bakery secretly reusing expired, moldy ingredients to feed unsuspecting school children? A shocking anonymous tip has raised terrifying questions about Sweet Treats Bakery, a major supplier for the regional school district. While no official health code violations have been confirmed by inspectors, concerned parents are demanding answers as rumors of cutting corners to boost profit margins continue to circulate online. The school board has refused to comment on whether they will terminate their lucrative catering contract with the bakery.",
    techniques: [
      {
        name: "speculative questioning",
        excerpt: "Is a popular local bakery secretly reusing expired, moldy ingredients to feed unsuspecting school children?",
        analysis: "Frames a devastating accusation as a question to bypass the requirement of having any factual evidence.",
        unspun: "Unverified online allegations have emerged regarding ingredient freshness at Sweet Treats Bakery."
      },
      {
        name: "insinuation formatting",
        excerpt: "A shocking anonymous tip has raised terrifying questions",
        analysis: "Elevates unverified hearsay ('anonymous tip') into an urgent, terrifying crisis using sensationalist modifiers.",
        unspun: "An anonymous complaint was received"
      },
      {
        name: "outrage farming",
        excerpt: "rumors of cutting corners to boost profit margins continue to circulate online",
        analysis: "Leverages unverified social media chatter to create a public consensus of guilt before any investigation.",
        unspun: "social media discussions regarding the bakery's practices"
      },
      {
        name: "passive voice shield",
        excerpt: "While no official health code violations have been confirmed by inspectors",
        analysis: "Underplays the fact that the bakery passed all inspections by using passive, qualified phrasing ('no violations have been confirmed').",
        unspun: "Inspectors found the bakery in full compliance with health codes."
      }
    ],
    facts: [
      {
        statement: "Sweet Treats Bakery is a supplier for the regional school district.",
        verdict: "verified",
        explanation: "Verified via school board public contract awards and catering vendor directories."
      },
      {
        statement: "No official health code violations have been confirmed by inspectors.",
        verdict: "verified",
        explanation: "County Department of Health records confirm the bakery passed its annual inspection with a perfect 100/100 score last month."
      },
      {
        statement: "The bakery is reusing expired, moldy ingredients.",
        verdict: "unsubstantiated",
        explanation: "There is zero documented evidence, official complaints, or photographic proof supporting this assertion."
      }
    ],
    biasDirection: {
      direction: "Aggressively sensationalist and alarmist. It weaponizes internet rumors and anonymous tips to create a controversy, targeting parent panic for maximum traffic.",
      neutralPerspective: "A neutral report would state that an anonymous complaint was filed, note that the latest official health inspection was perfect, and await formal investigation results before launching accusations."
    }
  }
];

// Curated Media Literacy Educational profiles for detected techniques
const TECHNIQUE_EDUCATIONAL_PROFILES: Record<string, {
  definition: string;
  mechanism: string;
  historicalExample: string;
  criticalThinkingQuestions: string[];
}> = {
  "outrage farming": {
    definition: "Writing headlines or articles to make readers feel extremely angry, shocked, or upset so they will click and share.",
    mechanism: "Exploits how our brains pay attention to threats. Upsetting news spreads much faster online because it makes people feel they need to defend themselves or their group.",
    historicalExample: "Sensational newspapers in 1898 publishing dramatic, unproven stories about Cuba to make the public support entering a war.",
    criticalThinkingQuestions: [
      "Is this article helping me understand the facts, or is it just trying to make me mad?",
      "If I remove the angry words, what are the actual, solid facts left over?"
    ]
  },
  "combat verbs": {
    definition: "Using violent or fight-like words (such as 'slams', 'destroys', 'blasts', or 'shatters') to describe normal disagreements, criticisms, or differences of opinion.",
    mechanism: "Makes a simple disagreement feel like an exciting fight. This gets readers excited like they are watching a sport, making it harder for people to find common ground.",
    historicalExample: "Cable TV debate shows framing politics as a warzone to keep viewers glued to the screen.",
    criticalThinkingQuestions: [
      "What did the speaker actually say? Did they 'slam' someone, or did they just say they disagree?",
      "How would this sound if we used normal words like 'disagreed' or 'criticized' instead?"
    ]
  },
  "nominalization": {
    definition: "Turning actions done by real people into abstract noun concepts to hide who is responsible (for example, saying 'a workforce optimization took place' instead of 'we laid off 500 workers').",
    mechanism: "Hides who made the decision, making controversial choices seem like natural, unavoidable events that just happened on their own.",
    historicalExample: "Companies and governments using terms like 'revenue adjustments' to hide that they are raising prices or taxes.",
    criticalThinkingQuestions: [
      "Who is actually doing this? Who decided to make this change?",
      "Why is the sentence written to focus on a dry noun instead of the person who made the decision?"
    ]
  },
  "passive voice shield": {
    definition: "Writing sentences so the person or group doing the action is completely left out (for example, saying 'mistakes were made' instead of 'I made a mistake').",
    mechanism: "Avoids assigning blame. It tells the reader that something bad happened but hides who did it.",
    historicalExample: "Politicians across history using the phrase 'mistakes were made' to admit a problem without admitting they were the ones who did it.",
    criticalThinkingQuestions: [
      "Who made the mistakes? Who failed to do their job?",
      "If I rewrite this to say exactly who did the action, how does it change how I feel about who is responsible?"
    ]
  },
  "speculative questioning": {
    definition: "Putting a shocking accusation inside a headline framed as a question (like 'Is this local bakery poisoning children?') to make readers suspicious without needing any proof.",
    mechanism: "Bypasses legal and professional standards of proof by claiming 'we are just asking a question.' It plants a seed of doubt that lingers in the reader's mind.",
    historicalExample: "Tabloid newspapers and sensational blogs using leading questions to attract readers without getting sued for libel.",
    criticalThinkingQuestions: [
      "If the writer had actual proof, would they frame it as a question or report it as a fact?",
      "Am I treating this question as if it has already been proven true?"
    ]
  },
  "euphemism & corporate jargon": {
    definition: "Using complex, dry, or scientific-sounding words to soften harsh or painful realities (like using 'collateral damage' for civilian deaths, or 'talent streamlining' for firing employees).",
    mechanism: "Makes controversial or upsetting events sound technical and boring, which keeps readers from feeling natural empathy or concern.",
    historicalExample: "Military briefings using dry phrases like 'kinetic actions' to describe heavy bombing runs.",
    criticalThinkingQuestions: [
      "What is the plain, everyday translation of this fancy corporate or military phrase?",
      "Who is being protected or comforted by using these complicated words instead of simple ones?"
    ]
  },
  "insinuation formatting": {
    definition: "Spreading a damaging rumor by disguised suggestions or leading questions to avoid having to prove it is true.",
    mechanism: "Connects a person's name with an accusation in the reader's mind, leaving a lasting feeling of suspicion even when there is no evidence.",
    historicalExample: "Smear campaigns using suggestive gossip to destroy a public figure's reputation without using any legally binding facts.",
    criticalThinkingQuestions: [
      "What real, official documents actually prove this suggestion is true?",
      "How does asking this question without a direct answer shift the burden of proof to the accused?"
    ]
  },
  "fear appeals": {
    definition: "Using scary language, exaggerated warnings, or disaster scenarios to make readers anxious so they will agree with a certain message.",
    mechanism: "Triggers our brain's fear center (the amygdala), making it hard to think logically and making us want to react impulsively to stay safe.",
    historicalExample: "Wartime propaganda posters warning of sudden invasion to make citizens obey strict government rules.",
    criticalThinkingQuestions: [
      "What is the actual, statistical chance of this scary thing happening to me?",
      "Are they trying to sell me a product or a political idea by making me afraid?"
    ]
  }
};

// Curated Famous News Publishers Profiles
const DOMAIN_PROFILES: Record<string, {
  name: string;
  focus: string;
  tendencies: string;
  guidance: string;
}> = {
  "nytimes.com": {
    name: "The New York Times",
    focus: "Left-Center. Curated, high-enterprise reportage and global agenda-setting.",
    tendencies: "Characterized by passive-voice shielding of bureaucratic structures, coastal intellectual assumptions, and heavy usage of elite consensus sourcing.",
    guidance: "Compare with business-centric outlets (like the WSJ) or global wire agencies to isolate policy pre-framing."
  },
  "foxnews.com": {
    name: "Fox News",
    focus: "Right. High-engagement partisan cable framing and populist critique.",
    tendencies: "Relies on speculative question marks in headlines, high-frequency emotional adjectives ('chaos', 'outrage'), and strong partisan-aligned framing in opinion commentary.",
    guidance: "Cross-reference factual claims with non-partisan wires (AP/Reuters) to filter emotional adjective preloading."
  },
  "reuters.com": {
    name: "Reuters",
    focus: "Highly Objective Wire. Direct, rapid global informational reporting.",
    tendencies: "Extremely low adjective-to-noun ratios, transparent official citations, active-voice verbs, and strict avoidance of speculative moral narratives.",
    guidance: "Excellent baseline standard for comparing how other outlets inflate basic reports into emotional clickbait."
  },
  "apnews.com": {
    name: "Associated Press (AP)",
    focus: "Highly Objective Wire. Unbiased, highly factual direct syndicate reporting.",
    tendencies: "Maintains a neutral reporting tone, minimal emotional descriptors, clean active phrasing, and high structural accountability.",
    guidance: "Use this to verify whether other articles have added sensationalist framing to a basic factual occurrence."
  },
  "bloomberg.com": {
    name: "Bloomberg News",
    focus: "Objective / Business-focused. Highly factual financial and corporate reportage.",
    tendencies: "High concentration of concrete nouns, data metrics, and economic cause-and-effect verbs; avoids speculative or moralizing sensationalism.",
    guidance: "Highly reliable for economic claims, though can reflect corporate institutional perspectives."
  },
  "cnn.com": {
    name: "CNN",
    focus: "Left-leaning. High-density breaking news coverage and narrative focus.",
    tendencies: "Frequent usage of high-arousal emotional modifiers, speculative pundit roundtables framed as hard news, and continuous crisis pre-framing.",
    guidance: "Strip away the adjectives and 'Breaking News' urgency to evaluate the core verifiable event."
  },
  "msnbc.com": {
    name: "MSNBC",
    focus: "Left. Progressive political advocacy and pundit-driven narrative commentary.",
    tendencies: "Heavy concentration of combat-oriented action verbs, emotional advocacy framing, and selective focus on institutional friction.",
    guidance: "Verify other perspectives on legislative and policy events to understand the full debate."
  },
  "wsj.com": {
    name: "The Wall Street Journal",
    focus: "Center-Right (Opinion page is highly Right-leaning). Financial enterprise journalism.",
    tendencies: "Reporting pages are highly objective, noun-dense, and factually disciplined. Opinion pages utilize powerful conservative rhetorical pre-framing.",
    guidance: "Differentiate clearly between their reporting newsroom and their highly partisan opinion columns."
  },
  "huffpost.com": {
    name: "HuffPost",
    focus: "Left. Sensationalist, progressive digital native commentary.",
    tendencies: "Extensive reliance on outrage farming, emotionally explosive headlines, and conversational moralizing frameworks.",
    guidance: "Check if the claims are backed by official public documents rather than digital outrage social reactions."
  },
  "buzzfeed.com": {
    name: "BuzzFeed News",
    focus: "Left-leaning. Pop-culture and emotional click-syndication.",
    tendencies: "Pioneered engagement-optimized lists, high emotional exclamation rates, and user-sentiment tracking masquerading as objective narrative.",
    guidance: "Filter out social-proof metrics and focus strictly on verified primary documents."
  },
  "dailymail.co.uk": {
    name: "Daily Mail",
    focus: "Right/Sensationalist. High-volume, highly dramatic tabloid engagement.",
    tendencies: "Extreme usage of sensationalist adjectives, extensive exclamation marks, invasive personal framing, and fast-paced moral polarization.",
    guidance: "Skeptically review all personal attributes and speculative rumors against standard editorial wire reports."
  },
  "nypost.com": {
    name: "New York Post",
    focus: "Right/Sensationalist. High-punch, populist local and national tabloid.",
    tendencies: "Relies on explosive combat verbs, aggressive puns, character attacks, and dramatic emotional focus on crime and corruption stories.",
    guidance: "Separate the theatrical humor and puns from the underlying dry public filings."
  }
};

// Helper to extract clean domain from URL
function extractDomain(urlStr: string): string | null {
  try {
    if (!urlStr || !urlStr.startsWith("http")) return null;
    const url = new URL(urlStr);
    let hostname = url.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }
    return hostname.toLowerCase();
  } catch (e) {
    return null;
  }
}

// Interfaces for instant computed metrics
interface LinguisticMetrics {
  adjectivesCount: number;
  nounsCount: number;
  adjectiveNounRatio: number;
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  readabilityScore: number;
  gradeLevel: string;
  sensationalismScore: number;
  matchedOutrageWords: { word: string; count: number }[];
}

// Instant local parser computation
function computeLinguisticMetrics(text: string): LinguisticMetrics {
  if (!text || text.trim() === "") {
    return {
      adjectivesCount: 0,
      nounsCount: 0,
      adjectiveNounRatio: 0,
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      readabilityScore: 100,
      gradeLevel: "Standard",
      sensationalismScore: 0,
      matchedOutrageWords: []
    };
  }

  const cleanText = text.replace(/[^\w\s\-\.\!\?]/g, " ");
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const totalWords = words.length || 1;
  const totalSentences = sentences.length || 1;

  let adjectivesCount = 0;
  let nounsCount = 0;

  words.forEach(word => {
    const w = word.toLowerCase();
    
    // Simple endings approximation
    if (
      w.endsWith("ive") || 
      w.endsWith("ful") || 
      w.endsWith("ous") || 
      w.endsWith("ish") || 
      w.endsWith("able") || 
      w.endsWith("ible") || 
      w.endsWith("ic") || 
      w.endsWith("less") || 
      w.endsWith("al") ||
      w === "quietly" || w === "secretly" || w === "shady" || w === "savage" || w === "fiery"
    ) {
      adjectivesCount++;
    } else if (
      w.endsWith("tion") || 
      w.endsWith("sion") || 
      w.endsWith("ment") || 
      w.endsWith("ness") || 
      w.endsWith("ity") || 
      w.endsWith("ance") || 
      w.endsWith("ence") || 
      w.endsWith("ship") || 
      w.endsWith("er") || 
      w.endsWith("or") || 
      w.endsWith("ist")
    ) {
      nounsCount++;
    }
  });

  if (nounsCount === 0) nounsCount = Math.round(totalWords * 0.22) || 1;
  if (adjectivesCount === 0) adjectivesCount = Math.round(totalWords * 0.08) || 1;

  const adjectiveNounRatio = parseFloat((adjectivesCount / nounsCount).toFixed(2));

  // Syllable calculation
  const countSyllables = (word: string) => {
    let w = word.toLowerCase();
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    w = w.replace(/^y/, "");
    const vowels = w.match(/[aeiouy]{1,2}/g);
    return vowels ? vowels.length : 1;
  };

  let totalSyllables = 0;
  words.forEach(w => {
    totalSyllables += countSyllables(w);
  });

  // Flesch Reading Ease Formula
  let readabilityScore = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  readabilityScore = Math.max(0, Math.min(100, Math.round(readabilityScore)));

  let gradeLevel = "Standard";
  if (readabilityScore >= 90) gradeLevel = "5th Grade (Very Easy)";
  else if (readabilityScore >= 80) gradeLevel = "6th Grade (Easy)";
  else if (readabilityScore >= 70) gradeLevel = "7th Grade (Easy)";
  else if (readabilityScore >= 60) gradeLevel = "8th-9th Grade (Standard)";
  else if (readabilityScore >= 50) gradeLevel = "10th-12th Grade (Fairly Difficult)";
  else if (readabilityScore >= 30) gradeLevel = "College Level (Difficult)";
  else gradeLevel = "Academic / Graduate (Very Difficult)";

  const outrageDict = [
    "savage", "fury", "scheme", "shock", "quietly", "exposed", "fiery",
    "unprecedented", "brutal", "devastating", "slammed", "blasted", "scandal",
    "secret", "shady", "nocturnal", "chaos", "crisis", "warning", "alert",
    "demolished", "eviscerated", "terror", "horrific", "unbelievable",
    "behind-the-scenes", "collusion", "bizarre", "bombshell", "mocked",
    "furious", "slaps", "backlash", "outrage", "hypocrisy", "mysteriously",
    "putting", "risk", "danger", "hazard"
  ];

  const matchedWordsMap: Record<string, number> = {};
  words.forEach(word => {
    const w = word.toLowerCase().replace(/[^\w]/g, "");
    if (outrageDict.includes(w)) {
      matchedWordsMap[w] = (matchedWordsMap[w] || 0) + 1;
    }
  });

  const matchedOutrageWords = Object.entries(matchedWordsMap).map(([word, count]) => ({ word, count }));
  const uniqueOutrageHits = matchedOutrageWords.length;
  const sensationalismScore = Math.min(100, Math.round((uniqueOutrageHits / totalWords) * 350 + (uniqueOutrageHits * 9)));

  return {
    adjectivesCount,
    nounsCount,
    adjectiveNounRatio,
    wordCount: totalWords,
    sentenceCount: totalSentences,
    syllableCount: totalSyllables,
    readabilityScore,
    gradeLevel,
    sensationalismScore,
    matchedOutrageWords
  };
}

interface HighlightInterval {
  start: number;
  end: number;
  techIndex: number;
  excerpt: string;
}

export default function AIDetector() {
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("Parsing sentence grammar...");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Accordion state managers
  const [isArticleOpen, setIsArticleOpen] = useState<boolean>(false);
  const [isLinguisticsOpen, setIsLinguisticsOpen] = useState<boolean>(true);
  const [isSourceProfileOpen, setIsSourceProfileOpen] = useState<boolean>(true);
  const [isFactsOpen, setIsFactsOpen] = useState<boolean>(true);
  const [isTechniquesOpen, setIsTechniquesOpen] = useState<boolean>(true);
  const [isBiasDirectionOpen, setIsBiasDirectionOpen] = useState<boolean>(true);
  const [openMediaLiteracy, setOpenMediaLiteracy] = useState<Record<number, boolean>>({});

  // Interactive Highlighting States
  const [hoveredTechIndex, setHoveredTechIndex] = useState<number | null>(null);

  const selectTemplate = (idx: number) => {
    const tpl = EXAMPLE_TEMPLATES[idx];
    const precalculated = PRECALCULATED_TEMPLATES_DATA[idx];

    setInputText(tpl.text);
    setError(null);
    playTapSound();
    triggerHapticTap();
    setIsLoading(true);
    setAnalysisResult(null);

    // Reset accordion views
    setIsArticleOpen(false);
    setIsLinguisticsOpen(true);
    setIsSourceProfileOpen(true);
    setIsFactsOpen(true);
    setIsTechniquesOpen(true);
    setIsBiasDirectionOpen(true);
    setHoveredTechIndex(null);

    // Fast, responsive mock local cache load sequence
    const steps = [
      "Extracting pre-analyzed cached record...",
      "Bypassing remote API call (Offline Safe)...",
      "Rendering interactive highlighted markup...",
      "Ready!"
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setAnalysisResult(precalculated);
        setIsLoading(false);
        playSuccessSound();
        triggerHapticSuccess();
      }
    }, 120);
  };

  const handleAnalyze = async () => {
    if (!inputText || inputText.trim() === "") {
      setError("Please paste a link or type some text to analyze.");
      playErrorSound();
      triggerHapticError();
      return;
    }

    playTapSound();
    triggerHapticTap();
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    // Reset accordion views to open when a new analysis loads
    setIsArticleOpen(false);
    setIsLinguisticsOpen(true);
    setIsSourceProfileOpen(true);
    setIsFactsOpen(true);
    setIsTechniquesOpen(true);
    setIsBiasDirectionOpen(true);
    setHoveredTechIndex(null);

    // Intelligent local template matching to allow offline instant analysis for testing
    const normalizedInput = inputText.trim().toLowerCase().replace(/\s+/g, " ");
    const matchedIdx = EXAMPLE_TEMPLATES.findIndex(tpl => {
      const normalizedTpl = tpl.text.trim().toLowerCase().replace(/\s+/g, " ");
      return normalizedInput.includes(normalizedTpl) || normalizedTpl.includes(normalizedInput) || normalizedInput.length > 50 && normalizedTpl.substring(0, 50).includes(normalizedInput.substring(0, 50));
    });

    if (matchedIdx !== -1) {
      const steps = [
        "Extracting pre-analyzed cached record...",
        "Bypassing remote API call (Offline Safe)...",
        "Rendering interactive highlighted markup...",
        "Ready!"
      ];

      let currentStepIdx = 0;
      const interval = setInterval(() => {
        if (currentStepIdx < steps.length) {
          setLoadingStep(steps[currentStepIdx]);
          currentStepIdx++;
        } else {
          clearInterval(interval);
          setAnalysisResult(PRECALCULATED_TEMPLATES_DATA[matchedIdx]);
          setIsLoading(false);
          playSuccessSound();
          triggerHapticSuccess();
        }
      }, 120);
      return;
    }

    const steps = [
      "Analyzing input type and parsing links...",
      "Deconstructing active vs passive grammar...",
      "Identifying outrage farming modifiers...",
      "Extracting critical factual claim statements...",
      "Evaluating assertions against factual verifiability...",
      "Matching patterns against standard bias classifications...",
      "Formulating objective neutral rewrites..."
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
        currentStepIdx++;
      }
    }, 700);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to contact the backend analyzer.");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);
      playSuccessSound();
      triggerHapticSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected analysis failure occurred. Ensure your server is active.");
      playErrorSound();
      triggerHapticError();
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const isLinkInput = /^https?:\/\//i.test(inputText.trim());

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-red-400 border-red-900/40 bg-red-950/20";
    if (score >= 40) return "text-amber-400 border-amber-900/40 bg-amber-950/20";
    return "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "HIGH BIAS / MANIPULATION";
    if (score >= 40) return "MODERATE BIAS";
    return "HIGHLY OBJECTIVE";
  };

  const getFactualScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";
    if (score >= 50) return "text-amber-400 border-amber-900/40 bg-amber-950/20";
    return "text-red-400 border-red-900/40 bg-red-950/20";
  };

  const getFactualScoreLabel = (score: number) => {
    if (score >= 80) return "HIGHLY VERIFIABLE";
    if (score >= 50) return "PARTIALLY UNVERIFIED";
    return "LOW VERIFIABILITY";
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "verified":
        return "text-emerald-400 border-emerald-950/50 bg-emerald-950/20";
      case "false":
        return "text-red-400 border-red-950/50 bg-red-950/20";
      case "disputed":
        return "text-amber-400 border-amber-950/50 bg-amber-950/20";
      case "unsubstantiated":
      default:
        return "text-neutral-400 border-neutral-800 bg-neutral-900/50";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "verified":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "false":
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      case "disputed":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case "unsubstantiated":
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  // Compute instantly on current text source or input text
  const currentLinguisticMetrics = useMemo(() => {
    if (!analysisResult) return null;
    return computeLinguisticMetrics(analysisResult.analyzedText || inputText);
  }, [analysisResult, inputText]);

  // Extract source domain profile if it exists
  const sourceDomainProfile = useMemo(() => {
    if (!analysisResult || !analysisResult.originalTextSource) return null;
    const domain = extractDomain(analysisResult.originalTextSource);
    if (!domain) return null;
    return {
      domain,
      profile: DOMAIN_PROFILES[domain] || {
        name: domain,
        focus: "Unregistered News Domain Profile",
        tendencies: "This source has not been pre-cataloged. It is highly recommended to cross-verify this story with primary document filings or dedicated neutral wires (AP/Reuters) to locate potential gaps.",
        guidance: ""
      }
    };
  }, [analysisResult]);

  // Handle clicking a highlighted sentence in original text
  const handleHighlightClick = (techIdx: number) => {
    playTapSound();
    triggerHapticTap();
    setHoveredTechIndex(techIdx);

    // Expand mechanisms accordion if closed
    setIsTechniquesOpen(true);

    // Smooth scroll down to the exact technique card
    setTimeout(() => {
      const el = document.getElementById(`technique-card-${techIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-amber-400", "scale-[1.01]", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-amber-400", "scale-[1.01]");
        }, 1200);
      }
    }, 120);
  };

  // Helper to split text by multiple non-overlapping excerpt intervals
  const renderHighlightedText = (text: string, techniques: DetectedTechnique[]) => {
    if (!techniques || techniques.length === 0) {
      return <p className="text-neutral-300 whitespace-pre-wrap">{text}</p>;
    }

    const intervals: HighlightInterval[] = [];

    techniques.forEach((tech, techIdx) => {
      if (!tech.excerpt || tech.excerpt.trim().length < 3) return;

      let index = 0;
      const lowerText = text.toLowerCase();
      const lowerExcerpt = tech.excerpt.toLowerCase();

      while ((index = lowerText.indexOf(lowerExcerpt, index)) !== -1) {
        // Prevent overlaps
        const overlaps = intervals.some(
          existing =>
            (index >= existing.start && index < existing.end) ||
            (index + lowerExcerpt.length > existing.start && index + lowerExcerpt.length <= existing.end) ||
            (existing.start >= index && existing.start < index + lowerExcerpt.length)
        );

        if (!overlaps) {
          intervals.push({
            start: index,
            end: index + lowerExcerpt.length,
            techIndex: techIdx,
            excerpt: text.substring(index, index + lowerExcerpt.length)
          });
        }
        index += lowerExcerpt.length;
      }
    });

    // Sort intervals ascending
    intervals.sort((a, b) => a.start - b.start);

    if (intervals.length === 0) {
      return <p className="text-neutral-300 whitespace-pre-wrap">{text}</p>;
    }

    const elements: ReactNode[] = [];
    let lastIndex = 0;

    intervals.forEach((interval, idx) => {
      if (interval.start > lastIndex) {
        elements.push(
          <span key={`plain-${lastIndex}`}>
            {text.substring(lastIndex, interval.start)}
          </span>
        );
      }

      const isActive = hoveredTechIndex === interval.techIndex;
      elements.push(
        <mark
          key={`highlight-${idx}`}
          onMouseEnter={() => setHoveredTechIndex(interval.techIndex)}
          onMouseLeave={() => setHoveredTechIndex(null)}
          onClick={() => handleHighlightClick(interval.techIndex)}
          className={`relative inline-block cursor-pointer px-1 py-0.5 rounded text-sm transition-all duration-200 select-text ${
            isActive
              ? "bg-amber-400 text-black font-semibold shadow-md scale-[1.02] z-10"
              : "bg-amber-950/45 text-amber-200 border-b border-amber-500/50 hover:bg-amber-400 hover:text-black hover:border-transparent"
          }`}
          title={`Technique: ${techniques[interval.techIndex].name} (Click to see breakdown)`}
        >
          {interval.excerpt}
          <span className="inline-flex items-center justify-center ml-1 px-1 bg-amber-950/80 text-[8px] font-mono font-bold text-amber-400 rounded-sm border border-amber-500/30">
            #{interval.techIndex + 1}
          </span>
        </mark>
      );

      lastIndex = interval.end;
    });

    if (lastIndex < text.length) {
      elements.push(
        <span key="plain-end">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return (
      <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed select-text font-serif text-sm md:text-base space-y-4">
        {elements}
      </div>
    );
  };

  // RENDER REPORT VIEW
  if (analysisResult && !isLoading) {
    const textToAnalyze = analysisResult.analyzedText || inputText;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        id="report-page-container"
        className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 pb-12"
      >
        {/* Navigation Header representing separate page view */}
        <div className="flex items-center justify-between bg-[#1A1A19] border border-[#2C2C2B] rounded-lg p-4">
          <button
            id="close-report-btn"
            onClick={() => {
              setAnalysisResult(null);
              playTapSound();
              triggerHapticTap();
            }}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#8F8E8C] hover:text-white transition-all cursor-pointer px-3 py-1.5 border border-[#2C2C2B] hover:border-neutral-500 rounded-md bg-[#20201F]"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            BACK TO SCRATCHPAD
          </button>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
            <Fingerprint className="w-4 h-4 animate-pulse" />
            <span>SECURE BIAS REPORT</span>
          </div>

          <button
            id="close-report-x-btn"
            onClick={() => {
              setAnalysisResult(null);
              playTapSound();
              triggerHapticTap();
            }}
            className="text-[#8F8E8C] hover:text-white transition-all cursor-pointer p-1.5 border border-[#2C2C2B] hover:border-red-900 rounded-md hover:bg-red-950/20"
            title="Close Report"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Executive Banner & Composite Scores */}
        <div className="notion-card bg-[#1A1A19] border-[#2C2C2B] overflow-hidden">
          {analysisResult.originalTextSource && (
            <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[#2C2C2B] bg-[#20201F] text-[10px] font-serif text-[#8F8E8C]">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase text-[#8F8E8C] font-semibold">Source URL:</span>
              <span className="text-white truncate max-w-md">{analysisResult.originalTextSource}</span>
            </div>
          )}

          {/* Core Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#2C2C2B]">
            <div className="p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#2C2C2B] bg-[#1E1E1D]">
              <span className="font-serif text-sm text-[#8F8E8C] font-medium block mb-1">
                Overall Bias
              </span>
              <div className={`text-4xl font-bold font-serif px-5 py-2.5 rounded-xl border ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score}%
              </div>
              <span className="font-serif text-xs text-[#8F8E8C] mt-2 font-medium">
                {getScoreLabel(analysisResult.score)}
              </span>
            </div>

            <div className="p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#2C2C2B] bg-[#1E1E1D]">
              <span className="font-serif text-sm text-[#8F8E8C] font-medium block mb-1">
                Linguistic Bias
              </span>
              <div className={`text-4xl font-bold font-serif px-5 py-2.5 rounded-xl border ${getScoreColor(analysisResult.biasScore ?? analysisResult.score)}`}>
                {analysisResult.biasScore ?? analysisResult.score}%
              </div>
              <span className="font-serif text-xs text-[#8F8E8C] mt-2 font-medium uppercase">
                Emotional Charge
              </span>
            </div>

            <div className="p-6 flex flex-col justify-center items-center text-center bg-[#1E1E1D]">
              <span className="font-serif text-sm text-[#8F8E8C] font-medium block mb-1">
                Factual Integrity
              </span>
              <div className={`text-4xl font-bold font-serif px-5 py-2.5 rounded-xl border ${getFactualScoreColor(analysisResult.factualScore ?? 80)}`}>
                {analysisResult.factualScore ?? 80}%
              </div>
              <span className="font-serif text-xs text-[#8F8E8C] mt-2 font-medium">
                {getFactualScoreLabel(analysisResult.factualScore ?? 80)}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center space-y-2 bg-[#1A1A19]">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
              Executive Summary
            </h3>
            <p className="font-serif text-base text-neutral-200 leading-relaxed">
              {analysisResult.summary}
            </p>
          </div>

          {analysisResult.isFallback && (
            <div className="bg-[#20201F] px-6 py-2 border-t border-[#2C2C2B] text-xs font-serif text-[#8F8E8C] text-center">
              ⚠️ Simulated analysis active. Configure your <strong>GEMINI_API_KEY</strong> in Settings &gt; Secrets to utilize real-time deep-reasoning AI.
            </div>
          )}
        </div>

        {/* EXECUTIVE REPORT SECTION ACCORDIONS: FACTUAL ASSESSMENT & DETECTED MECHANISMS */}
        <div className="space-y-4 w-full" id="report-executive-accordions-group">
              
              {/* Accordion 1: Factual Assessment */}
              <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
                <button
                  id="accordion-factual-btn"
                  onClick={() => {
                    setIsFactsOpen(!isFactsOpen);
                    playTapSound();
                    triggerHapticTap();
                  }}
                  className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">
                        Factual Assessment
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isFactsOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isFactsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      id="accordion-factual-content"
                      className="border-t border-[#2C2C2B]"
                    >
                      <div className="p-5 md:p-6 bg-[#1A1A19] space-y-4">
                        {analysisResult.facts && analysisResult.facts.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysisResult.facts.map((fact, idx) => (
                              <div
                                key={idx}
                                className="bg-[#20201F]/70 border border-[#2C2C2B] p-4 rounded-lg flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-all text-left"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-4 border-b border-[#2C2C2B] pb-2 flex-wrap">
                                    <span className="text-[10px] font-serif uppercase text-[#8F8E8C] font-bold">
                                      CLAIM #{idx + 1}
                                    </span>
                                    <span className={`text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 border rounded font-bold flex items-center gap-1.5 ${getVerdictStyle(fact.verdict)}`}>
                                      {getVerdictIcon(fact.verdict)}
                                      {fact.verdict}
                                    </span>
                                  </div>
                                  <p className="font-serif text-sm font-semibold italic text-white leading-relaxed pl-3 border-l-2 border-[#2C2C2B]">
                                    "{fact.statement}"
                                  </p>
                                </div>
                                <div className="bg-[#1A1A19] p-3 rounded-md border border-[#2C2C2B] text-sm text-[#8F8E8C] leading-relaxed font-serif">
                                  {fact.explanation}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#8F8E8C] italic text-center py-4 font-serif">No verifiable factual claims were explicitly isolated for evaluation in this snippet.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Detected Mechanisms */}
              <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
                <button
                  id="accordion-mechanisms-btn"
                  onClick={() => {
                    setIsTechniquesOpen(!isTechniquesOpen);
                    playTapSound();
                    triggerHapticTap();
                  }}
                  className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">
                        Detected Mechanisms
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isTechniquesOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isTechniquesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      id="accordion-mechanisms-content"
                      className="border-t border-[#2C2C2B]"
                    >
                      <div className="p-5 md:p-6 bg-[#1A1A19] space-y-4">
                        {analysisResult.techniques && analysisResult.techniques.length > 0 ? (
                          <div className="space-y-4">
                            {analysisResult.techniques.map((tech, idx) => {
                              const isHovered = hoveredTechIndex === idx;
                              const eduProfile = TECHNIQUE_EDUCATIONAL_PROFILES[tech.name.toLowerCase()];
                              const isDeepDiveOpen = !!openMediaLiteracy[idx];

                              return (
                                <div
                                  key={idx}
                                  id={`technique-card-${idx}`}
                                  className={`border p-5 rounded-lg space-y-4 text-left transition-all duration-300 ${
                                    isHovered 
                                      ? "bg-[#252524] border-amber-500 shadow-lg scale-[1.01]" 
                                      : "bg-[#20201F]/50 border-[#2C2C2B]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-4 border-b border-[#2C2C2B] pb-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isHovered ? "bg-amber-400 animate-pulse" : "bg-neutral-500"}`}></span>
                                      <h4 className="font-serif text-base font-bold text-white">
                                        {tech.name}
                                      </h4>
                                    </div>
                                    <span className="text-[10px] font-serif uppercase tracking-wider bg-[#1A1A19] text-[#8F8E8C] px-2 py-0.5 border border-[#2C2C2B] rounded">
                                      Technique #{idx + 1}
                                    </span>
                                  </div>

                                  {/* Biased vs Objective unspun rewrites side-by-side */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-red-950/15 border border-red-900/30 rounded-md space-y-1">
                                      <span className="text-[10px] font-serif uppercase tracking-wider text-red-400 font-bold block">
                                        Biased Excerpt
                                      </span>
                                      <p className="font-serif text-lg font-medium italic text-red-100 pl-3 border-l-2 border-red-900 leading-relaxed">
                                        "{tech.excerpt}"
                                      </p>
                                    </div>

                                    <div className="p-4 bg-emerald-950/15 border border-emerald-900/30 rounded-md space-y-1">
                                      <span className="text-[10px] font-serif uppercase tracking-wider text-emerald-400 font-bold block">
                                        Objective Neutral Rewrite
                                      </span>
                                      <p className="font-serif text-lg font-medium text-emerald-100 pl-3 border-l-2 border-emerald-900 leading-relaxed">
                                        "{tech.unspun}"
                                      </p>
                                    </div>
                                  </div>

                                  {/* Custom short AI breakdown explanation (perfectly tailored) */}
                                  <div className="bg-[#1A1A19] p-3.5 rounded border border-[#2C2C2B] space-y-1">
                                    <h5 className="text-[10px] font-serif uppercase tracking-wider text-amber-400/90 font-bold flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                      AI Manipulation Breakdown
                                    </h5>
                                    <p className="text-sm text-neutral-200 leading-relaxed font-serif">
                                      {tech.analysis}
                                    </p>
                                  </div>

                                  {/* Local media literacy callout: Educational deep dive */}
                                  {eduProfile && (
                                    <div className="border border-indigo-900/30 rounded-md overflow-hidden bg-indigo-950/10">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenMediaLiteracy(prev => ({
                                            ...prev,
                                            [idx]: !prev[idx]
                                          }));
                                          playTapSound();
                                          triggerHapticTap();
                                        }}
                                        className="w-full flex items-center justify-between p-3.5 bg-indigo-950/20 hover:bg-indigo-950/35 transition-all text-left focus:outline-none"
                                      >
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="w-4 h-4 text-indigo-400" />
                                          <span className="font-serif text-sm font-bold text-indigo-300">
                                            Media Literacy Deep Dive
                                          </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-150 ${isDeepDiveOpen ? "rotate-180" : ""}`} />
                                      </button>
                                      
                                      <AnimatePresence initial={false}>
                                        {isDeepDiveOpen && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="border-t border-indigo-900/30 p-4 space-y-3.5"
                                          >
                                            <div className="space-y-2 text-sm font-serif text-left">
                                              <p className="text-neutral-300 leading-relaxed">
                                                <strong>How it works:</strong> {eduProfile.definition}
                                              </p>
                                              <p className="text-neutral-400 leading-relaxed">
                                                <strong>Psychological Hook:</strong> {eduProfile.mechanism}
                                              </p>
                                              <p className="text-[#8F8E8C] italic leading-relaxed text-sm">
                                                <strong>Historical Precedent:</strong> {eduProfile.historicalExample}
                                              </p>
                                            </div>

                                            <div className="pt-2 border-t border-indigo-900/30 space-y-1.5 text-left">
                                              <span className="text-[10px] font-serif uppercase tracking-wider text-[#8F8E8C] font-bold flex items-center gap-1">
                                                <ShieldQuestion className="w-3.5 h-3.5 text-emerald-400" />
                                                Self-Reflection Prompts
                                              </span>
                                              <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-sm font-serif">
                                                {eduProfile.criticalThinkingQuestions.map((q, qIdx) => (
                                                  <li key={qIdx} className="leading-relaxed">{q}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-[#8F8E8C] italic text-center py-4 font-serif">No manipulative rhetorical techniques were explicitly flagged in this text.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

        </div>

        {/* COLLAPSIBLE INTERACTIVE ARTICLE SCANNER AT THE TOP */}
        <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
          <button
            id="toggle-article-btn"
            onClick={() => {
              setIsArticleOpen(!isArticleOpen);
              playTapSound();
              triggerHapticTap();
            }}
            className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Analyzed Article
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isArticleOpen ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isArticleOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="border-t border-[#2C2C2B]"
              >
                <div className="p-5 md:p-6 bg-[#1A1A19] space-y-4">
                  {/* Scrollable container for highlighted article text */}
                  <div className="overflow-y-auto max-h-[380px] pr-2 bg-[#20201F] p-5 rounded-lg border border-[#2C2C2B] shadow-inner select-text scrollbar-thin">
                    {renderHighlightedText(textToAnalyze, analysisResult.techniques || [])}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDE-BY-SIDE LINGUISTICS & SOURCE DOMAIN PROFILE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* LINGUISTIC INDEX ACCORDION */}
          <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
            <button
              id="toggle-linguistics-btn"
              onClick={() => {
                setIsLinguisticsOpen(!isLinguisticsOpen);
                playTapSound();
                triggerHapticTap();
              }}
              className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-indigo-400 shrink-0" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Linguistic Index
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isLinguisticsOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isLinguisticsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border-t border-[#2C2C2B]"
                >
                  <div className="p-5 md:p-6 bg-[#1A1A19] space-y-4">
                    {currentLinguisticMetrics ? (
                      <div className="space-y-4">
                        {/* Gauge 1: Adjective-to-Noun Ratio */}
                        <div className="p-4 bg-[#20201F] border border-[#2C2C2B] rounded-lg space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-serif font-bold text-[#8F8E8C]">Emotional Word Density</span>
                            <span className={`text-sm font-serif font-bold ${
                              currentLinguisticMetrics.adjectiveNounRatio >= 0.45 ? "text-red-400" :
                              currentLinguisticMetrics.adjectiveNounRatio >= 0.25 ? "text-amber-400" : "text-emerald-400"
                            }`}>
                              {currentLinguisticMetrics.adjectiveNounRatio} Adj/Noun
                            </span>
                          </div>

                          {/* Progress slider bar */}
                          <div className="h-1.5 w-full bg-[#1A1A19] rounded-full overflow-hidden relative">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                currentLinguisticMetrics.adjectiveNounRatio >= 0.45 ? "bg-red-400" :
                                currentLinguisticMetrics.adjectiveNounRatio >= 0.25 ? "bg-amber-400" : "bg-emerald-400"
                              }`}
                              style={{ width: `${Math.min(100, currentLinguisticMetrics.adjectiveNounRatio * 100)}%` }}
                            ></div>
                          </div>

                          <p className="text-sm text-[#8F8E8C] leading-relaxed font-serif">
                            {currentLinguisticMetrics.adjectiveNounRatio >= 0.45 
                              ? "Lots of emotional words. The text uses loaded adjectives to make you feel emotional before you even read the main facts." 
                              : currentLinguisticMetrics.adjectiveNounRatio >= 0.25
                              ? "Average mix of details. It mostly tells the story directly, but still uses some emotional words to sway your opinion."
                              : "Highly factual and direct. The text sticks strictly to noun words and physical actions, with no extra emotional bias."}
                          </p>
                        </div>

                        {/* Gauge 2: Readability Grade Level */}
                        <div className="p-4 bg-[#20201F] border border-[#2C2C2B] rounded-lg space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-serif font-bold text-[#8F8E8C]">Reading Ease Level</span>
                            <span className="text-sm font-serif font-bold text-indigo-400">
                              {currentLinguisticMetrics.gradeLevel.split(" (")[0]}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-[#1A1A19] rounded-full overflow-hidden relative">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(20, Math.min(100, (100 - currentLinguisticMetrics.readabilityScore)))}%` }}
                            ></div>
                          </div>

                          <p className="text-sm text-[#8F8E8C] leading-relaxed font-serif">
                            Readability Score: <strong>{currentLinguisticMetrics.readabilityScore}/100</strong>. 
                            {currentLinguisticMetrics.readabilityScore >= 60 
                              ? " This is written in a simple, fast-paced style. It is easy to read quickly, which is common for highly clickable news." 
                              : " This is written in a more complex style with longer sentences. It reads like a standard deep news report or academic article."}
                          </p>
                        </div>

                        {/* Gauge 3: Outrage Farming Dictionary Matches */}
                        <div className="p-4 bg-[#20201F] border border-[#2C2C2B] rounded-lg space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-serif font-bold text-[#8F8E8C]">Sensationalism Level</span>
                            <span className={`text-sm font-serif font-bold ${
                              currentLinguisticMetrics.sensationalismScore >= 60 ? "text-red-400" :
                              currentLinguisticMetrics.sensationalismScore >= 30 ? "text-amber-400" : "text-emerald-400"
                            }`}>
                              {currentLinguisticMetrics.sensationalismScore}% Charge
                            </span>
                          </div>

                          {/* Word Matches pill grid */}
                          {currentLinguisticMetrics.matchedOutrageWords.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1.5">
                                {currentLinguisticMetrics.matchedOutrageWords.map(({ word, count }) => (
                                  <span 
                                    key={word} 
                                    className="inline-flex items-center gap-1 text-[10px] font-serif bg-[#1A1A19] text-amber-300 border border-[#2C2C2B] px-2 py-0.5 rounded hover:bg-amber-400 hover:text-black transition-all"
                                  >
                                    {word}
                                    <span className="text-[8px] bg-amber-950/80 text-amber-200 px-1 rounded font-bold">
                                      {count}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-serif">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>0 high-intensity outrage modifiers identified.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#8F8E8C] italic text-center py-4 font-serif">Linguistic metrics loading...</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CURATED SOURCE DOMAIN PROFILE ACCORDION */}
          <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
            <button
              id="toggle-source-profile-btn"
              onClick={() => {
                setIsSourceProfileOpen(!isSourceProfileOpen);
                playTapSound();
                triggerHapticTap();
              }}
              className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Source Profile
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isSourceProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isSourceProfileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border-t border-[#2C2C2B]"
                >
                  <div className="p-5 md:p-6 bg-[#1A1A19] space-y-4">
                    {sourceDomainProfile ? (
                      <div className="space-y-4 text-left">
                        <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                          {sourceDomainProfile.profile.name}
                          <span className="text-[10px] font-serif bg-indigo-950/40 text-indigo-300 border border-indigo-900 px-2.5 py-0.5 rounded font-medium">
                            Verified News Outlet
                          </span>
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-serif uppercase tracking-wider text-[#8F8E8C] font-bold block">Source Focus</span>
                            <p className="text-neutral-300 font-serif leading-relaxed text-sm">{sourceDomainProfile.profile.focus}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-serif uppercase tracking-wider text-[#8F8E8C] font-bold block">Common Biases & Habits</span>
                            <p className="text-neutral-300 font-serif leading-relaxed text-sm">{sourceDomainProfile.profile.tendencies}</p>
                          </div>
                        </div>

                        {sourceDomainProfile.profile.guidance && (
                          <div className="bg-[#20201F] p-3 rounded border border-[#2C2C2B] text-sm leading-relaxed text-emerald-400/90 font-serif mt-2">
                            <strong>Recommendation:</strong> {sourceDomainProfile.profile.guidance}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-[#8F8E8C] font-serif text-sm italic py-4 flex flex-col items-center justify-center space-y-2">
                        <Newspaper className="w-8 h-8 text-neutral-700 mb-2" />
                        <p>No verified domain profile available for this source.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* SINGLE BIAS DIRECTION COLLAPSIBLE SECTION */}
        <div className="w-full">
              
              {/* Accordion: Bias Direction */}
              <div className="border border-[#2C2C2B] rounded-lg bg-[#1A1A19] overflow-hidden notion-card">
                <button
                  id="accordion-direction-btn"
                  onClick={() => {
                    setIsBiasDirectionOpen(!isBiasDirectionOpen);
                    playTapSound();
                    triggerHapticTap();
                  }}
                  className="w-full flex items-center justify-between p-5 bg-[#20201F] hover:bg-[#252524] transition-all cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">
                        Bias Direction
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isBiasDirectionOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#8F8E8C]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isBiasDirectionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      id="accordion-direction-content"
                      className="border-t border-[#2C2C2B]"
                    >
                      <div className="p-5 md:p-6 bg-[#1A1A19] space-y-5 text-left">
                        <div className="bg-[#20201F]/60 border border-[#2C2C2B] p-5 rounded-lg space-y-4">
                          
                          {/* Direction description */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-serif uppercase tracking-wider text-indigo-400 font-bold block">
                              Narrative Slant & Bias
                            </span>
                            <div className="p-3.5 bg-indigo-950/15 border border-indigo-900/40 rounded-lg">
                              <p className="text-sm font-semibold text-indigo-200 font-serif leading-relaxed">
                                {analysisResult.biasDirection?.direction || "Objective/Balanced profile. No distinct political, ideological, or corporate defense slant was isolated."}
                              </p>
                            </div>
                          </div>

                          {/* Neutral Perspective recommendation */}
                          <div className="space-y-1.5 pt-3 border-t border-[#2C2C2B]">
                            <span className="text-[10px] font-serif uppercase tracking-wider text-emerald-400 font-bold block">
                              Neutral Perspective
                            </span>
                            <div className="p-3.5 bg-emerald-950/15 border border-emerald-900/40 rounded-lg">
                              <p className="text-sm text-emerald-100 font-serif leading-relaxed">
                                {analysisResult.biasDirection?.neutralPerspective || "The text adheres well to direct reportage standards. To improve, cite additional diversified stakeholder views and verify claim timestamps directly."}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

        {/* Bottom Controls / Reset */}
        <div className="flex justify-center pt-2">
          <button
            id="report-reset-btn"
            onClick={() => {
              setInputText("");
              setAnalysisResult(null);
              setError(null);
              playTapSound();
              triggerHapticTap();
            }}
            className="flex items-center gap-1.5 border border-[#2C2C2B] hover:bg-[#20201F] text-[#8F8E8C] hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ANALYZE A NEW ARTICLE
          </button>
        </div>
      </motion.div>
    );
  }

  // SCRATCHPAD INPUT VIEW
  return (
    <div id="detector-module" className="space-y-6 max-w-4xl mx-auto">
      {/* Input Stage Card */}
      <div className="notion-card p-6 md:p-8 bg-[#1A1A19] border-[#2C2C2B] space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold">
            Real-Time Fact & Bias Analyzer
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-white">
            Analyze Media for Facts & Bias
          </h2>
          <p className="text-sm text-[#8F8E8C] leading-relaxed font-serif">
            Paste any <strong>web article link (URL)</strong> or manually <strong>copy/paste the text contents</strong> below. Our deep learning engine will filter layout clutter, extract the article text, assess fact verifiability, and isolate biased phrase strategies with neutral alternatives.
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              id="bias-detector-textarea"
              className="w-full min-h-[140px] p-4 text-sm font-serif border border-[#2C2C2B] rounded-lg focus:outline-none focus:ring-1 focus:ring-white bg-[#20201F] focus:bg-[#2A2A29] transition-all resize-y text-white placeholder-neutral-600 pr-10"
              placeholder="Paste article link (e.g. https://news.com/article) or copy-paste text snippet..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError(null);
              }}
            />
            {isLinkInput && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1 bg-[#2C2C2B] text-emerald-400 border border-emerald-900/30 text-[10px] font-mono px-2 py-1 rounded">
                <LinkIcon className="w-3 h-3" /> Link Detected
              </div>
            )}
          </div>
          
          {isLinkInput && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400/90 font-mono font-medium flex items-start gap-1.5 bg-emerald-950/10 border border-emerald-950/30 p-2.5 rounded-lg"
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Link input detected! The system will fetch and extract content cleanly, removing ads, navigation menus, and footers to minimize token usage.</span>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border text-sm font-serif ${
                error.includes("Cloud Scraper") || error.includes("429") || error.includes("Requests")
                  ? "bg-amber-950/10 border-amber-900/30 text-amber-200"
                  : "bg-red-950/15 border-red-950/30 text-red-400 font-mono"
              }`}
            >
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  error.includes("Cloud Scraper") || error.includes("429") || error.includes("Requests")
                    ? "text-amber-400"
                    : "text-red-400"
                }`} />
                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-xs font-mono uppercase tracking-wider">
                    {error.includes("Cloud Scraper") || error.includes("429") || error.includes("Requests")
                      ? "Web Crawler Blocked by Source"
                      : "Analysis Error Encountered"}
                  </h4>
                  <p className="leading-relaxed text-xs">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Templates Presets */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F8E8C] font-bold block px-0.5">
            Quick Templates (Click to try):
          </span>
          <div className="flex flex-wrap gap-2" id="detector-presets-list">
            {EXAMPLE_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => selectTemplate(idx)}
                className="text-xs px-3 py-1.5 rounded-md border border-[#2C2C2B] hover:border-[#8F8E8C] hover:bg-[#20201F] text-[#8F8E8C] hover:text-white transition-all font-serif font-medium cursor-pointer"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Buttons */}
        <div className="flex justify-end border-t border-[#2C2C2B] pt-5">
          <button
            id="analyze-bias-submit-btn"
            disabled={isLoading || !inputText.trim()}
            onClick={handleAnalyze}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing live...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Analyze Source
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="notion-card p-8 bg-[#1A1A19] border-[#2C2C2B] text-center space-y-4"
            id="analysis-loader"
          >
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#E3E3E2] font-serif italic">"Token-optimized live web scraping, factual claim isolation, and bias diagnostics in progress."</p>
              <p className="text-xs font-mono text-emerald-400">{loadingStep}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
