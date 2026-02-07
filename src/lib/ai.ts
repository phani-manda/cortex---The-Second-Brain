/**
 * AI Service Layer – Groq Integration
 * 
 * Agent Thinking: This module is the "active librarian" of Cortex.
 * It doesn't just store data—it analyzes, summarizes, and categorizes
 * every thought the user captures, turning raw input into structured knowledge.
 * 
 * Using Groq for blazing fast inference with Llama 3 models.
 * Free tier: 30 RPM, 14,400 requests/day - perfect for production!
 */

import Groq from "groq-sdk";

// Initialize Groq - check for API key
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.warn("⚠️ GROQ_API_KEY not found in environment variables. AI features will use fallback mode.");
}
const groq = new Groq({ apiKey: apiKey || "" });

export type AIAnalysis = {
  summary: string;
  tags: string[];
  type: "NOTE" | "LINK" | "INSIGHT" | "FILE";
  title: string;
  priority: number; // 1-100 relevance score
  keywords: string[]; // Important keywords extracted from content
};

// Priority keywords with their weight multipliers
const PRIORITY_KEYWORDS = {
  // Critical (90-100)
  critical: { words: ["urgent", "emergency", "critical", "deadline", "asap", "immediately", "breaking"], weight: 95 },
  // High importance (70-89)
  high: { words: ["important", "key", "essential", "must", "required", "decision", "action", "priority"], weight: 80 },
  // Insights (70-85)
  insight: { words: ["realize", "discovered", "breakthrough", "aha", "finally understand", "learned", "insight", "revelation"], weight: 78 },
  // Actionable (65-75)
  actionable: { words: ["todo", "task", "do", "implement", "create", "build", "fix", "resolve", "schedule"], weight: 70 },
  // Learning (60-75)
  learning: { words: ["learn", "study", "research", "explore", "understand", "practice", "improve"], weight: 68 },
  // Ideas (55-70)
  ideas: { words: ["idea", "concept", "thought", "vision", "plan", "strategy", "approach"], weight: 65 },
  // Reference (40-55)
  reference: { words: ["note", "remember", "reference", "bookmark", "save", "keep"], weight: 50 },
};

/**
 * Extract important keywords from text and calculate priority score
 */
function extractKeywordsAndPriority(text: string): { keywords: string[]; basePriority: number } {
  const lowercaseText = text.toLowerCase();
  const foundKeywords: string[] = [];
  let maxPriority = 50; // Default medium priority
  
  // Check each category
  for (const [category, config] of Object.entries(PRIORITY_KEYWORDS)) {
    for (const word of config.words) {
      if (lowercaseText.includes(word)) {
        foundKeywords.push(word);
        if (config.weight > maxPriority) {
          maxPriority = config.weight;
        }
      }
    }
  }
  
  // Boost priority for longer, more detailed content (likely more valuable)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 100) maxPriority = Math.min(100, maxPriority + 5);
  if (wordCount > 200) maxPriority = Math.min(100, maxPriority + 5);
  
  // Boost for questions (indicates active thinking)
  if (text.includes("?")) maxPriority = Math.min(100, maxPriority + 3);
  
  // Boost for numbered lists or bullet points (organized thinking)
  if (/\d+\.|[-•*]/.test(text)) maxPriority = Math.min(100, maxPriority + 3);
  
  return {
    keywords: [...new Set(foundKeywords)].slice(0, 5),
    basePriority: maxPriority,
  };
}

/**
 * Generate fallback analysis when AI is unavailable
 */
function generateFallbackAnalysis(rawText: string, contentType?: "text" | "link" | "file"): AIAnalysis {
  // Extract keywords and calculate priority using the smart algorithm
  const { keywords, basePriority } = extractKeywordsAndPriority(rawText);
  const lowercaseText = rawText.toLowerCase();
  const suggestedTags: string[] = [];
  
  // Detect common topics for tagging
  if (lowercaseText.includes("learn") || lowercaseText.includes("study")) suggestedTags.push("learning");
  if (lowercaseText.includes("idea") || lowercaseText.includes("think")) suggestedTags.push("ideas");
  if (lowercaseText.includes("todo") || lowercaseText.includes("need to")) suggestedTags.push("tasks");
  if (lowercaseText.includes("project")) suggestedTags.push("project");
  if (lowercaseText.includes("code") || lowercaseText.includes("programming")) suggestedTags.push("coding");
  if (lowercaseText.includes("meeting") || lowercaseText.includes("call")) suggestedTags.push("meetings");
  if (lowercaseText.includes("book") || lowercaseText.includes("article")) suggestedTags.push("reading");
  
  // Detect insight patterns
  const isInsight = lowercaseText.includes("realize") || 
                    lowercaseText.includes("aha") || 
                    lowercaseText.includes("finally understand") ||
                    lowercaseText.includes("breakthrough") ||
                    lowercaseText.includes("discovered");
  
  // Determine type
  let type: "NOTE" | "LINK" | "INSIGHT" | "FILE" = "NOTE";
  if (contentType === "link" || rawText.includes("http")) {
    type = "LINK";
  } else if (contentType === "file") {
    type = "FILE";
  } else if (isInsight) {
    type = "INSIGHT";
  }
  
  return {
    title: rawText.slice(0, 50) + (rawText.length > 50 ? "..." : ""),
    summary: rawText.slice(0, 100) + (rawText.length > 100 ? "..." : ""),
    tags: suggestedTags.length > 0 ? suggestedTags.slice(0, 3) : [],
    type,
    priority: basePriority,
    keywords,
  };
}

export async function analyzeContent(rawText: string, contentType?: "text" | "link" | "file"): Promise<AIAnalysis> {
  // If no API key, use fallback analysis
  if (!apiKey) {
    return generateFallbackAnalysis(rawText, contentType);
  }

  // Groq models to try (fastest first)
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
  
  const systemPrompt = `You are an intelligent knowledge management assistant. Analyze the user's text and return a JSON object with these fields:

1. "title": A concise, descriptive title for this thought (max 8 words).
2. "summary": A concise 1-sentence summary of the key idea.
3. "tags": An array of 2-5 relevant tags (lowercase, no hashtags).
4. "keywords": An array of 3-5 important keywords that determine this content's priority/importance (lowercase). Focus on action words, urgency indicators, domain terms.
5. "type": Classify as one of:
   - "NOTE" for general thoughts, ideas, or reflections
   - "LINK" if the text contains or references a URL or external resource
   - "INSIGHT" if it contains a realization, learning, breakthrough, or aha-moment
   - "FILE" if this is describing a file attachment
6. "priority": A number from 1-100 indicating importance based on these keywords and factors:
   - 90-100: Critical (contains: urgent, deadline, emergency, asap, critical)
   - 75-89: High (contains: important, key decision, must-do, action required)
   - 65-74: Insight (contains: realized, discovered, breakthrough, learned)
   - 50-64: Standard (general notes, information, ideas)
   - 30-49: Low (nice-to-have, reference, bookmark)
   - 1-29: Minimal (trivial, filler, redundant)

Consider: Actionability, Uniqueness, Relevance, Depth.

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;

  const userPrompt = `${contentType === "link" ? "[This is a URL/link being saved]\n\n" : ""}${contentType === "file" ? "[This is a file being saved]\n\n" : ""}Analyze this text:

"""
${rawText}
"""`;

  for (const modelName of models) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: modelName,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "{}";

      // Clean the response - strip markdown code blocks if present
      const cleaned = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const parsed = JSON.parse(cleaned) as AIAnalysis;

      // Validate and normalize the response (handle case-insensitive type)
      const normalizedType = parsed.type?.toUpperCase() as "NOTE" | "LINK" | "INSIGHT" | "FILE";
      const validTypes = ["NOTE", "LINK", "INSIGHT", "FILE"];
      
      // Clamp priority between 1-100
      const priority = Math.min(100, Math.max(1, parsed.priority || 50));
      
      // Extract keywords from AI or use fallback extraction
      const { keywords: fallbackKeywords } = extractKeywordsAndPriority(rawText);
      const keywords = Array.isArray(parsed.keywords) && parsed.keywords.length > 0 
        ? parsed.keywords.slice(0, 5) 
        : fallbackKeywords;
      
      return {
        title: parsed.title || "Untitled Thought",
        summary: parsed.summary || "No summary generated.",
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
        type: validTypes.includes(normalizedType) ? normalizedType : "NOTE",
        priority,
        keywords,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // If rate limited, try next model
      if (errorMessage.includes("429") || errorMessage.includes("rate") || errorMessage.includes("limit")) {
        console.warn(`Model ${modelName} rate limited, trying next model...`);
        continue;
      }
      
      // For other errors, log and continue to next model
      console.error(`AI Analysis failed with ${modelName}:`, errorMessage);
      continue;
    }
  }
  
  // All models failed or errored, use fallback
  console.log("Using fallback analysis (AI unavailable)");
  return generateFallbackAnalysis(rawText, contentType);
}

/**
 * Analyze a URL and extract metadata
 */
export async function analyzeLink(url: string, description?: string): Promise<AIAnalysis> {
  const content = description 
    ? `URL: ${url}\n\nDescription: ${description}`
    : `URL: ${url}`;
  return analyzeContent(content, "link");
}

/**
 * Analyze a file and its description
 */
export async function analyzeFile(fileName: string, fileType: string, description?: string): Promise<AIAnalysis> {
  const content = description 
    ? `File: ${fileName} (${fileType})\n\nDescription: ${description}`
    : `File: ${fileName} (${fileType})`;
  return analyzeContent(content, "file");
}
