/**
 * AI Query Service – Conversational Knowledge Base Queries
 * 
 * Agent Thinking: This module enables conversational querying against
 * the user's knowledge base. It uses RAG (Retrieval Augmented Generation)
 * to find relevant notes and answer questions based on stored knowledge.
 * 
 * Using Groq for blazing fast inference with Llama 3 models.
 */

import Groq from "groq-sdk";
import { getAllNotes, getPublicNotes } from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export type QueryResult = {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    summary: string | null;
  }>;
  confidence: "high" | "medium" | "low";
};

export type QueryOptions = {
  publicOnly?: boolean;
};

export async function queryKnowledgeBase(
  question: string,
  options: QueryOptions = {}
): Promise<QueryResult> {
  try {
    // Retrieve notes based on access level (public endpoints only see public notes)
    const notes = options.publicOnly
      ? await getPublicNotes(100) // Get up to 100 public notes for querying
      : await getAllNotes();

    if (notes.length === 0) {
      return {
        answer:
          "Your knowledge base is empty. Start capturing thoughts to build your second brain!",
        sources: [],
        confidence: "low",
      };
    }

    // Build context from notes (prioritize high priority notes)
    const sortedNotes = [...notes].sort((a, b) => (b.priority || 50) - (a.priority || 50));
    const context = sortedNotes
      .slice(0, 20) // Limit to top 20 notes for context window
      .map(
        (note) =>
          `[ID: ${note.id}] Title: ${note.title}\nPriority: ${note.priority || 50}\nSummary: ${note.summary || "N/A"}\nContent: ${note.content}\nTags: ${note.tags.join(", ")}\n---`
      )
      .join("\n\n");

    const systemPrompt = `You are an intelligent assistant helping a user query their personal knowledge base (Second Brain). 

Answer their question based ONLY on the provided notes. If the answer isn't in the knowledge base, say so honestly.

Instructions:
1. Answer the question clearly and concisely based on the knowledge base content
2. Reference specific notes by their titles when relevant
3. If the question cannot be answered from the available notes, acknowledge this
4. Keep your response helpful and conversational
5. Consider note priority when determining relevance

Respond in JSON format:
{
  "answer": "Your detailed answer here",
  "relevantNoteIds": ["id1", "id2"],
  "confidence": "high" | "medium" | "low"
}`;

    const userPrompt = `KNOWLEDGE BASE:
${context}

USER QUESTION: ${question}`;

    // Try Groq models
    const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
    
    for (const modelName of models) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          model: modelName,
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "{}";

        // Clean and parse the response
        const cleaned = text
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        // Find the referenced notes
        const relevantNotes = notes
          .filter((note) => parsed.relevantNoteIds?.includes(note.id))
          .map((note) => ({
            id: note.id,
            title: note.title,
            summary: note.summary,
          }));

        return {
          answer: parsed.answer || "I couldn't generate a response.",
          sources: relevantNotes,
          confidence: parsed.confidence || "medium",
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // If rate limited, try next model
        if (errorMessage.includes("429") || errorMessage.includes("rate") || errorMessage.includes("limit")) {
          console.warn(`Model ${modelName} rate limited, trying next model...`);
          continue;
        }
        
        console.error(`Query failed with ${modelName}:`, errorMessage);
        continue;
      }
    }

    // All models failed
    return {
      answer: "I'm currently unable to process your query. Please try again in a moment.",
      sources: [],
      confidence: "low",
    };
  } catch (error) {
    console.error("Query failed:", error);
    return {
      answer:
        "I encountered an error while searching your knowledge base. Please try again.",
      sources: [],
      confidence: "low",
    };
  }
}
