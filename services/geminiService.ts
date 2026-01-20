
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StudyMode, StudyContent, FlashcardTheme, EnglishLesson, SpeechEvaluation, GrammarChallenge } from "../types";
import { SYSTEM_INSTRUCTION, EXTRACTION_PROMPT, MATH_PROMPTS } from "../constants";

// Initialize the Gemini AI client with the API key lazily
// Use fallback to ensure key is available in both dev and production builds
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
  // Log but do not throw; we want the app to stay usable even without a key (devs can still use non-AI features)
  console.warn('Gemini API key is not configured. Chat/AI features will be disabled until you set GEMINI_API_KEY.');
}

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (ai) return ai;
  if (!GEMINI_API_KEY) return null;
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    return ai;
  } catch (err) {
    console.error('Failed to initialize Gemini client in current environment', err);
    return null;
  }
};

const requireAI = () => {
  const a = getAI();
  if (!a) throw new Error('Gemini client not available in this environment. Set GEMINI_API_KEY or run with a server-side proxy.');
  return a;
};

export const isAIAvailable = () => Boolean(getAI());

// Graceful error handler for Gemini API calls
const handleGeminiError = (error: any, fallbackMessage: string): Error => {
  console.error("Gemini API Error Detail:", {
    message: error?.message,
    status: error?.status,
    reason: error?.reason,
    details: error?.details
  });

  const msg = error?.message || "";

  if (msg.includes('API_KEY') || msg.includes('authentication')) {
    return new Error("System configuration error: API authentication failed.");
  }

  if (error?.status === 429 || msg.includes('quota') || msg.includes('limit')) {
    return new Error("The AI service is currently at capacity or you have reached your temporary quota. Please try again in 1 minute.");
  }

  if (msg.includes('safety') || msg.includes('blocked') || msg.includes('candidate')) {
    return new Error("Content blocked: The input or response triggered our safety filters. Please try rephrasing your request.");
  }

  if (error?.status === 400 || msg.includes('invalid') || msg.includes('unsupported')) {
    return new Error("Request error: The AI model found the input format invalid or unsupported.");
  }

  if (error?.status >= 500) {
    return new Error("AI Service temporary failure. Our engineers have been notified. Please try again later.");
  }

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('deadline')) {
    return new Error("Connectivity issue: The request timed out. Please check your internet connection.");
  }

  return new Error(fallbackMessage);
};

const getInnerSchemaForMode = (mode: StudyMode): any => {
  switch (mode) {
    case StudyMode.PLAN:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.PLAN] },
          title: { type: Type.STRING },
          duration_days: { type: Type.INTEGER },
          target_goal: { type: Type.STRING },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                topic: { type: Type.STRING },
                objective: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['day', 'topic', 'objective', 'tasks'],
            }
          }
        },
        required: ['mode', 'title', 'duration_days', 'schedule'],
      };
    case StudyMode.FLASHCARDS:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.FLASHCARDS] },
          theme: {
            type: Type.STRING,
            enum: ['classic', 'got', 'game', 'heist', 'jumanji', 'potter', 'lotr', 'stranger', 'spider', 'iron', 'captain', 'thor', 'hulk', 'deadpool', 'batman']
          },
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                thematic_narrative: { type: Type.STRING }
              },
              required: ['question', 'answer'],
            },
          },
        },
        required: ['mode', 'theme', 'cards'],
      };
    case StudyMode.NOTES:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.NOTES] },
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['heading', 'bullets'],
            },
          },
        },
        required: ['mode', 'title', 'sections'],
      };
    case StudyMode.QUIZ:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.QUIZ] },
          mcq: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                q: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING }
              },
              required: ['q', 'options', 'answer'],
            },
          },
          short: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                q: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ['q', 'answer'],
            },
          },
        },
        required: ['mode', 'mcq', 'short'],
      };
    case StudyMode.SUMMARY:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.SUMMARY] },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['mode', 'bullets'],
      };
    case StudyMode.ESSAY:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.ESSAY] },
          title: { type: Type.STRING },
          essay: { type: Type.STRING }
        },
        required: ['mode', 'title', 'essay'],
      };
    case StudyMode.ELI5:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.ELI5] },
          topic: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['heading', 'content'],
            },
          },
        },
        required: ['mode', 'topic', 'sections'],
      };
    case StudyMode.DESCRIBE:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.DESCRIBE] },
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['heading', 'content'],
            },
          },
          key_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['mode', 'title', 'sections', 'key_insights'],
      };
    case StudyMode.MATH:
      return {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [StudyMode.MATH] },
          equation: { type: Type.STRING },
          method_used: { type: Type.STRING },
          final_answer: { type: Type.STRING },
          final_answer_approx: { type: Type.STRING },
          alternative_forms: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                expression: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ['title', 'expression', 'explanation'],
            },
          },
          graph_data: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['linear', 'quadratic', 'trigonometric', 'exponential', 'logarithmic', 'points'] },
              important_points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    label: { type: Type.STRING }
                  },
                  required: ['x', 'y']
                }
              },
              plot_points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER }
                  },
                  required: ['x', 'y']
                }
              },
              x_axis_label: { type: Type.STRING },
              y_axis_label: { type: Type.STRING },
              domain_min: { type: Type.NUMBER },
              domain_max: { type: Type.NUMBER },
              range_min: { type: Type.NUMBER },
              range_max: { type: Type.NUMBER }
            },
            required: ['type', 'plot_points', 'domain_min', 'domain_max', 'range_min', 'range_max']
          }
        },
        required: ['mode', 'equation', 'method_used', 'final_answer', 'steps'],
      };
    default:
      return { type: Type.OBJECT, properties: {} };
  }
};

// Extracts text and mathematical expressions from media files.
export const extractTextFromMedia = async (file: File): Promise<string> => {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const data = await base64Promise;
  const aiClient = requireAI();
  const response = await aiClient.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: [{ inlineData: { data, mimeType: file.type } }, { text: EXTRACTION_PROMPT }] },
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "";
};

// Scans text to extract mathematical formulas and scientific notation.
export const detectEquations = async (text: string): Promise<string[]> => {
  const aiClient = requireAI();
  const response = await aiClient.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [{
        text: `SCAN THE FOLLOWING TEXT FOR ALL SYMBOLIC MATHEMATICAL EXPRESSIONS, CHEMICAL FORMULAS, OR SCIENTIFIC EQUATIONS.
        
        GOAL: Extract every instance of math/science notation.
        FORMAT: Return strictly a JSON array of strings in standard LaTeX.
        SENSITIVITY: Capture even simple variables ($x$), exponents ($x^2$), and complex structures ($\\int_{a}^{b} f(x) dx$).
        
        INPUT TEXT:
        """
        ${text}
        """`
      }]
    },
    config: {
      systemInstruction: "You are a specialized mathematical extraction engine. Your task is to identify and convert mathematical or scientific expressions from plain text into a JSON array of LaTeX strings. Be extremely thorough.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  try {
    const result = JSON.parse(response.text || "[]");
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
};

// Fetches content from a URL using Google Search grounding.
export const processUrlInput = async (url: string): Promise<string> => {
  const aiClient = requireAI();
  const response = await aiClient.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the primary educational content and text from this URL for study analysis: ${url}. ${EXTRACTION_PROMPT}`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return response.text || "";
};

// Generates high-quality study material based on a specific mode and input.
export const generateStudyMaterial = async (input: string, mode: StudyMode, context: string, theme?: FlashcardTheme): Promise<StudyContent> => {
  try {
    if (!input || !input.trim()) {
      throw new Error("Please provide study material or topic.");
    }

    const isHardTask = ['math', 'plan', 'quiz', 'essay'].includes(mode);
    const model = isHardTask ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const thinkingBudget = isHardTask ? 32000 : 0;

    let prompt = `Task: Create study material for mode: ${mode}. Context: ${context}. Input material: ${input}. ${theme ? `Theme: ${theme}` : ''}`;

    if (mode === StudyMode.MATH) {
      const key = context as keyof typeof MATH_PROMPTS;
      prompt = (MATH_PROMPTS[key] || MATH_PROMPTS.DEFAULT).replace('{{EQUATION}}', input);
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: getInnerSchemaForMode(mode),
          thinkingConfig: thinkingBudget > 0 ? { thinkingBudget } : undefined
        }
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to generate study material. Please try again.");
    }

    if (!response?.text) {
      if (response?.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error("Content blocked: The AI response was filtered for safety. Please try a different topic.");
      }
      throw new Error("The AI generated an empty response. Please try refining your input.");
    }

    try {
      const json = JSON.parse(response.text || "{}");
      // Safety injection: Ensure the 'mode' property matches exactly what the UI expects
      if (!json.mode) json.mode = mode;
      return json as StudyContent;
    } catch (parseError) {
      console.error("JSON Parse Error in generateStudyMaterial", parseError);
      throw new Error("Failed to process the response. Please refine your input and try again.");
    }
  } catch (error) {
    console.error("generateStudyMaterial error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred. Please try again.");
  }
};

// Generates audio speech from text using the Gemini TTS model.
export const generateSpeech = async (text: string): Promise<string> => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Please provide text to generate speech.");
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to generate speech. Please try again.");
    }

    if (!response?.text) throw new Error("Empty response from TTS");
    return response.text;
  } catch (error) {
    console.error("generateSpeech error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred while generating speech.");
  }
};

// Simple chat-oriented helper: accepts a single user message and prior short history
export const chatReply = async (message: string, history: Array<{ role: string; text: string }>) => {
  try {
    const flattened = (history || []).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    const prompt = `${flattened}\nUser: ${message}\nAssistant:`;

    const aiClient = requireAI();
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are StudyClub24 — a concise, helpful AI tutor. Answer the user's question directly and explain where useful. Keep responses clear and short.",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    if (!response?.text) return "Sorry, the AI returned an empty response.";
    return response.text;
  } catch (err) {
    console.error('chatReply error', err);
    throw handleGeminiError(err, 'Failed to get chat response.');
  }
};
// (removed stray duplicated TTS config block)

// Transcribes audio content into text.
export const transcribeAudio = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    if (!base64Data || !mimeType) {
      throw new Error("Invalid audio data provided.");
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Transcribe this audio exactly into text." }
          ]
        }
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to transcribe audio. Please try again.");
    }

    if (!response?.text) {
      throw new Error("Could not transcribe audio. Please try again.");
    }
    return response.text;
  } catch (error) {
    console.error("transcribeAudio error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred during transcription.");
  }
};

// Evaluates user's spoken audio for language proficiency.
export const evaluateSpeech = async (base64Data: string, mimeType: string): Promise<SpeechEvaluation> => {
  try {
    if (!base64Data || !mimeType) {
      throw new Error("Invalid audio data provided.");
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Transcribe this English speech and evaluate it for score (0-10), feedback, and suggested correction." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transcript: { type: Type.STRING },
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              correction: { type: Type.STRING }
            },
            required: ['transcript', 'score', 'feedback']
          }
        }
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to evaluate speech. Please try again.");
    }

    if (!response?.text) {
      throw new Error("Could not evaluate speech. Please try again.");
    }

    try {
      return JSON.parse(response.text) as SpeechEvaluation;
    } catch (parseError) {
      console.error("JSON Parse Error in evaluateSpeech", parseError);
      throw new Error("Failed to process speech evaluation. Please try again.");
    }
  } catch (error) {
    console.error("evaluateSpeech error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred during speech evaluation.");
  }
};

// Generates an interactive grammar challenge.
export const generateGrammarChallenge = async (): Promise<GrammarChallenge> => {
  try {
    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a random English grammar multiple-choice question focusing on tenses.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tense: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['tense', 'question', 'options', 'correctAnswer', 'explanation']
          }
        }
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to generate grammar challenge. Please try again.");
    }

    if (!response?.text) {
      throw new Error("Could not generate challenge. Please try again.");
    }

    try {
      return JSON.parse(response.text) as GrammarChallenge;
    } catch (parseError) {
      console.error("JSON Parse Error in generateGrammarChallenge", parseError);
      throw new Error("Failed to process challenge. Please try again.");
    }
  } catch (error) {
    console.error("generateGrammarChallenge error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred while generating the challenge.");
  }
};

// Generates an English lesson tailored to the user's native language.
export const generateEnglishLesson = async (input: string, nativeLanguage: string, context: string): Promise<EnglishLesson> => {
  try {
    if (!input || !input.trim() || !nativeLanguage) {
      throw new Error("Please provide the required information.");
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Create an English lesson for a ${nativeLanguage} speaker. Context: ${context}. Topic/Input: ${input}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              context: { type: Type.STRING },
              dialogue: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    speaker: { type: Type.STRING },
                    text: { type: Type.STRING },
                    translation: { type: Type.STRING }
                  }
                }
              },
              grammar_details: {
                type: Type.OBJECT,
                properties: {
                  tense_name: { type: Type.STRING },
                  when_to_use: { type: Type.ARRAY, items: { type: Type.STRING } },
                  structure: {
                    type: Type.OBJECT,
                    properties: {
                      affirmative: { type: Type.STRING },
                      negative: { type: Type.STRING },
                      question: { type: Type.STRING }
                    }
                  },
                  examples: { type: Type.ARRAY, items: { type: Type.STRING } },
                  common_mistakes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        wrong: { type: Type.STRING },
                        correct: { type: Type.STRING }
                      }
                    }
                  },
                  speaking_tip: { type: Type.STRING }
                }
              },
              vocabulary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    usage: { type: Type.STRING }
                  }
                }
              },
              grammar_focus: { type: Type.STRING },
              exam_tip: { type: Type.STRING }
            },
            required: ['title', 'context', 'vocabulary']
          },
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to generate lesson. Please try again.");
    }

    if (!response?.text) {
      throw new Error("Could not generate lesson. Please try again.");
    }

    try {
      return JSON.parse(response.text) as EnglishLesson;
    } catch (parseError) {
      console.error("JSON Parse Error in generateEnglishLesson", parseError);
      throw new Error("Failed to process lesson. Please try again.");
    }
  } catch (error) {
    console.error("generateEnglishLesson error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred while generating the lesson.");
  }
};

// Generates a thematic image for a diagram node.
export const generateNodeImage = async (prompt: string): Promise<string> => {
  try {
    if (!prompt || !prompt.trim()) {
      throw new Error("Please provide an image description.");
    }

    let response;
    try {
      const aiClient = requireAI();
      response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1" },
        },
      });
    } catch (apiError) {
      throw handleGeminiError(apiError, "Failed to generate image. Please try again.");
    }

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) {
      throw new Error("Failed to generate image. Please try again.");
    }
    return `data:image/png;base64,${part.inlineData.data}`;
  } catch (error) {
    console.error("generateNodeImage error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred while generating the image.");
  }
};
