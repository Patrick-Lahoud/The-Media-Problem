import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize GoogleGenAI client to prevent crashes if key is missing on start
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Utility function to extract clean paragraphs/headers from raw HTML to save thousands of tokens
function extractCleanTextFromHTML(html: string): string {
  // Remove script/style/nav/header/footer tags
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");

  // Match paragraphs, headers, and list items
  const matches = clean.match(/<(p|h1|h2|h3|h4|h5|h6|li)\b[^>]*>([\s\S]*?)<\/\1>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map(tag => {
        return tag
          .replace(/<[^>]+>/g, " ") // strip tags
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
      })
      .filter(text => text.length > 10)
      .join("\n\n");
  }

  // Fallback if tag parsing doesn't yield results: strip tags on body
  const bodyMatch = clean.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const fallbackSource = bodyMatch ? bodyMatch[1] : clean;
  return fallbackSource
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// API endpoint for bias detection
app.post("/api/detect", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text or article link to analyze is required." });
  }

  let finalText = text.trim();
  let sourceInfo = "Pasted Text";

  // Check if input is a URL and fetch it if true
  if (/^https?:\/\//i.test(finalText)) {
    sourceInfo = finalText;
    try {
      const fetchResponse = await fetch(finalText, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });
      if (!fetchResponse.ok) {
        throw new Error(`HTTP ${fetchResponse.status} - ${fetchResponse.statusText}`);
      }
      const rawHtml = await fetchResponse.text();
      finalText = extractCleanTextFromHTML(rawHtml);
      if (!finalText || finalText.trim().length === 0) {
        throw new Error("Unable to extract readable text content from the provided webpage.");
      }
    } catch (err: any) {
      console.error("URL fetch error:", err.message);
      return res.status(400).json({
        error: `Failed to fetch or parse the article from the provided link: ${err.message}. Please try copying and pasting the article text directly.`
      });
    }
  }

  // Enforce a strict truncation limit at 4500 characters to keep token usage small yet comprehensive
  if (finalText.length > 4500) {
    finalText = finalText.substring(0, 4500) + "... [truncated to minimize token count]";
  }

  try {
    const ai = getAIClient();
    
    let successResult: any = null;
    let lastError: any = null;
    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

    for (const selectedModel of modelsToTry) {
      try {
        console.log(`Attempting analysis with model: ${selectedModel}`);
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: `Analyze the following text for potential media bias, spin, or manipulation techniques based on the "The Media Problem Media Literacy Guide", and analyze the factual integrity of key claims.

Analyze this text:
"${finalText}"`,
          config: {
            systemInstruction: "You are an expert media literacy analyst. Your job is to identify specific spin techniques from The Media Problem Guide in any text provided AND evaluate the factual accuracy of key claims in the text. You must output compact, high-density results to minimize tokens.\n\n" +
              "CRITICAL DATE CONTEXT:\n" +
              "- The current real-world date is July 16, 2026. This is the absolute present. Any event occurring on or before July 16, 2026 is in the past.\n" +
              "- Your pre-training knowledge cutoff is earlier (mid-2024 / early 2025). This means there are real events in 2025 and 2026 that you do not have in your static memory. Do NOT assume these are 'hypothetical future' or 'imaginary' events just because they are after your knowledge cutoff.\n" +
              "- If a claim refers to an event occurring between late 2024 and July 16, 2026, and you lack static knowledge to verify it, label it 'unsubstantiated' but explain neutrally that it is past your pre-training cutoff. NEVER call it a 'future' or 'hypothetical' event in your explanation.\n\n" +
              "Follow these instructions strictly to minimize tokens:\n" +
              "1. Evaluate: overall bias 'score' (0-100, where 100 is highly biased/spun), 'biasScore' (0-100, linguistic/emotional spin level), and 'factualScore' (0-100, where 100 is highly factual and verified).\n" +
              "2. For 'techniques': extract up to 4 key biased excerpts. For each, keep 'analysis' extremely concise (maximum 15 words) and suggest a neutral 'unspun' rewrite.\n" +
              "3. For 'facts': list up to 4 key factual claims made in the text. Evaluate each as 'verified', 'unsubstantiated', 'disputed', or 'false'. Keep the 'explanation' extremely concise (maximum 15 words).\n" +
              "4. Keep the overall 'summary' short and concise (max 25 words). Avoid wordy or repetitive phrases.\n" +
              "5. For 'biasDirection': determine which perspective, sentiment, or political/corporate direction the article is biased towards (e.g., 'anti-development', 'pro-management', 'alarmist/sensationalist'), and formulate a neutral perspective representing a balanced, unspun view (max 25 words).",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["score", "biasScore", "factualScore", "summary", "techniques", "facts", "biasDirection"],
              properties: {
                score: {
                  type: Type.INTEGER,
                  description: "Composite bias score from 0 (completely objective) to 100 (highly biased).",
                },
                biasScore: {
                  type: Type.INTEGER,
                  description: "Linguistic and emotional bias score from 0 (neutral) to 100 (highly sensationalist).",
                },
                factualScore: {
                  type: Type.INTEGER,
                  description: "Factual verifiability score from 0 (entirely false/unsubstantiated) to 100 (fully verified facts).",
                },
                summary: {
                  type: Type.STRING,
                  description: "Short 1-2 sentence overview of article's objectivity profile (max 25 words).",
                },
                techniques: {
                  type: Type.ARRAY,
                  description: "Detected spin techniques (max 4, empty array if none).",
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "excerpt", "analysis", "unspun"],
                    properties: {
                      name: {
                        type: Type.STRING,
                        description: "The name of the technique (e.g., 'Outrage Farming', 'Combat Verbs', etc.).",
                      },
                      excerpt: {
                        type: Type.STRING,
                        description: "Exact biased sentence or phrase from the input text.",
                      },
                      analysis: {
                        type: Type.STRING,
                        description: "Extremely concise description of manipulation (max 15 words).",
                      },
                      unspun: {
                        type: Type.STRING,
                        description: "Neutral, unspun rewrite of the excerpt.",
                      },
                    },
                  },
                },
                facts: {
                  type: Type.ARRAY,
                  description: "Factual claims evaluated (max 4).",
                  items: {
                    type: Type.OBJECT,
                    required: ["statement", "verdict", "explanation"],
                    properties: {
                      statement: {
                        type: Type.STRING,
                        description: "Specific factual claim from the text.",
                      },
                      verdict: {
                        type: Type.STRING,
                        enum: ["verified", "unsubstantiated", "disputed", "false"],
                        description: "Factual verdict.",
                      },
                      explanation: {
                        type: Type.STRING,
                        description: "Extremely concise rationale (max 15 words).",
                      },
                    },
                  },
                },
                biasDirection: {
                  type: Type.OBJECT,
                  required: ["direction", "neutralPerspective"],
                  properties: {
                    direction: {
                      type: Type.STRING,
                      description: "Direction/slant of bias detected (e.g. anti-establishment, corporate defensive, alarmist).",
                    },
                    neutralPerspective: {
                      type: Type.STRING,
                      description: "A balanced, neutral framing of the issue (max 25 words).",
                    },
                  },
                },
              },
            },
          },
        });

        const resultText = response.text;
        if (resultText) {
          successResult = JSON.parse(resultText);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${selectedModel} failed:`, err.message || err);
        lastError = err;
      }
    }

    if (successResult) {
      successResult.originalTextSource = sourceInfo;
      successResult.analyzedText = finalText;
      res.json(successResult);
    } else {
      throw lastError || new Error("All candidate Gemini models failed to generate content.");
    }
  } catch (error: any) {
    console.warn("AI Bias Detection Error (activating fallback simulation):", error.message);
    
    // Fallback mock analyzer matching the new schema
    const lowerText = finalText.toLowerCase();
    const detectedMock: any[] = [];
    const mockFacts: any[] = [];
    let mockBiasScore = 20;
    let mockFactualScore = 80;
    let mockSummary = "We analyzed your text using The Media Problem local matching engine. Connect your GEMINI_API_KEY to unlock advanced deep-reasoning real-time AI analyses.";

    if (lowerText.includes("quietly") || lowerText.includes("behind residents' backs") || lowerText.includes("secretly")) {
      detectedMock.push({
        name: "Outrage Farming",
        excerpt: lowerText.includes("quietly") ? "quietly" : "behind residents' backs",
        analysis: "Uses emotionally charged words to manufacture secrecy in a standard public meeting.",
        unspun: "with standard public notifications"
      });
      mockFacts.push({
        statement: "The association changed pool hours behind residents' backs.",
        verdict: "unsubstantiated",
        explanation: "No evidence provided that residents were excluded from the decision process."
      });
      mockBiasScore = 65;
      mockFactualScore = 50;
    }
    if (lowerText.includes("risk") || lowerText.includes("danger") || lowerText.includes("hazard") || lowerText.includes("putting")) {
      detectedMock.push({
        name: "Fear Appeals",
        excerpt: "putting your child's life at risk",
        analysis: "Exaggerates a rare or minor occurrence to trigger panic.",
        unspun: "is operating within standard certified parameters"
      });
      mockFacts.push({
        statement: "Activities are putting lives at risk.",
        verdict: "disputed",
        explanation: "Exaggerated claim contradicts local safety certification statistics."
      });
      mockBiasScore = 80;
      mockFactualScore = 40;
    }
    if (lowerText.includes("destroys") || lowerText.includes("fiery") || lowerText.includes("clash") || lowerText.includes("fights")) {
      detectedMock.push({
        name: "Combat Verbs",
        excerpt: lowerText.includes("destroys") ? "destroys" : "fiery exchange",
        analysis: "Substitutes routine criticism with violent nouns and combat-oriented verbs.",
        unspun: "pointed out two computational errors in"
      });
      mockBiasScore = 75;
    }
    if (lowerText.includes("workforce optimization") || lowerText.includes("right-sizing") || lowerText.includes("restructuring")) {
      detectedMock.push({
        name: "Euphemism and Softening",
        excerpt: "workforce optimization",
        analysis: "Veils severe real-world pain, such as layoffs, using sterile corporate double-speak.",
        unspun: "laying off employees"
      });
      mockFacts.push({
        statement: "The company undergoes restructuring.",
        verdict: "verified",
        explanation: "Restructuring officially announced by the Board of Directors."
      });
      mockBiasScore = 55;
      mockFactualScore = 90;
    }
    if (lowerText.includes("is a popular") && lowerText.includes("secretly")) {
      detectedMock.push({
        name: "Insinuation Formatting",
        excerpt: "Is a Popular Bakery Secretly Reusing Expired Ingredients?",
        analysis: "Seeds a damaging, unsupported rumor disguised as a question.",
        unspun: "No evidence has been reported regarding ingredients at the local bakery."
      });
      mockFacts.push({
        statement: "The bakery is secretly reusing expired ingredients.",
        verdict: "false",
        explanation: "This is an unsubstantiated rumor disguised as a question."
      });
      mockBiasScore = 85;
      mockFactualScore = 20;
    }

    if (detectedMock.length === 0) {
      detectedMock.push({
        name: "Adjective Preloading",
        excerpt: "The text input",
        analysis: "Local fallback scan completed. No major emotional hooks detected.",
        unspun: finalText
      });
    }

    if (mockFacts.length === 0) {
      mockFacts.push({
        statement: "Local fallback matching is active.",
        verdict: "verified",
        explanation: "System processed formatting without encountering fatal exceptions."
      });
    }

    let mockBiasDirection = {
      direction: "Slightly sensationalist (using leading adjectives to pre-frame user opinions)",
      neutralPerspective: "List factual observations cleanly and allow the reader to draw independent conclusions."
    };

    if (lowerText.includes("quietly") || lowerText.includes("behind residents' backs") || lowerText.includes("secretly")) {
      mockBiasDirection = {
        direction: "Anti-establishment / Sensationalist (framing administrative processes as untrustworthy)",
        neutralPerspective: "Describe standard community association procedures and meeting agendas neutrally without imputing secretive motives."
      };
    } else if (lowerText.includes("risk") || lowerText.includes("danger") || lowerText.includes("hazard") || lowerText.includes("putting")) {
      mockBiasDirection = {
        direction: "Alarmist / Fear Appeals (exaggerating small or standard risks into immediate crises)",
        neutralPerspective: "Present historical safety rates and official certifications to enable a logical risk-assessment."
      };
    } else if (lowerText.includes("workforce optimization") || lowerText.includes("right-sizing") || lowerText.includes("restructuring")) {
      mockBiasDirection = {
        direction: "Corporate Defensive / Euphemistic (masking painful events like employee layoffs with sterilized terminology)",
        neutralPerspective: "Acknowledge the restructuring and explicitly outline the real impacts, including the exact staff numbers affected."
      };
    } else if (lowerText.includes("is a popular") && lowerText.includes("secretly")) {
      mockBiasDirection = {
        direction: "Insinuation Framing (using leading speculative questions to hint at controversy without evidence)",
        neutralPerspective: "Report on local health inspection records directly, without implying unauthorized or speculative practices."
      };
    }

    const overallScore = Math.round((mockBiasScore + (100 - mockFactualScore)) / 2);

    res.json({
      score: overallScore,
      biasScore: mockBiasScore,
      factualScore: mockFactualScore,
      summary: mockSummary,
      techniques: detectedMock,
      facts: mockFacts,
      biasDirection: mockBiasDirection,
      isFallback: true,
      originalTextSource: sourceInfo,
      analyzedText: finalText
    });
  }
});

// Setup Vite Dev server middleware or static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
