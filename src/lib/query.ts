/**
 * AI Query Service – Conversational Knowledge Base Queries
 * 
 * Agent Thinking: This module enables conversational querying against
 * the user's knowledge base. It uses RAG (Retrieval Augmented Generation)
 * to find relevant notes and answer questions based on stored knowledge.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllNotes } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type QueryResult = {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    summary: string | null;
  }>;
  confidence: "high" | "medium" | "low";
};

export async function queryKnowledgeBase(question: string): Promise<QueryResult> {
  try {
    // Retrieve all notes to search through
    const notes = await getAllNotes();

    if (notes.length === 0) {
      return {
        answer:
          "Your knowledge base is empty. Start capturing thoughts to build your second brain!",
        sources: [],
        confidence: "low",
      };
    }

    // Build context from notes
    const context = notes
      .slice(0, 20) // Limit to most recent 20 notes for context window
      .map(
        (note) =>
          `[ID: ${note.id}] Title: ${note.title}\nSummary: ${note.summary || "N/A"}\nContent: ${note.content}\nTags: ${note.tags.join(", ")}\n---`
      )
      .join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an intelligent assistant helping a user query their personal knowledge base (Second Brain). 

Below are the user's stored notes and insights. Answer their question based ONLY on this information. If the answer isn't in the knowledge base, say so honestly.

KNOWLEDGE BASE:
${context}

USER QUESTION: ${question}

Instructions:
1. Answer the question clearly and concisely based on the knowledge base content
2. Reference specific notes by their titles when relevant
3. If the question cannot be answered from the available notes, acknowledge this
4. Keep your response helpful and conversational

Respond in JSON format:
{
  "answer": "Your detailed answer here",
  "relevantNoteIds": ["id1", "id2"],
  "confidence": "high" | "medium" | "low"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

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
    console.error("Query failed:", error);
    return {
      answer:
        "I encountered an error while searching your knowledge base. Please try again.",
      sources: [],
      confidence: "low",
    };
  }
}
