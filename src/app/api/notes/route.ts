/**
 * POST /api/notes – Create a new note (requires authentication)
 * GET  /api/notes – Retrieve user's notes (requires authentication)
 */

import { NextRequest, NextResponse } from "next/server";
import { createNote, getAllNotes, searchNotes } from "@/lib/db";
import { analyzeContent, analyzeLink, analyzeFile } from "@/lib/ai";
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in." },
      { status: 401 }
    );
  }

  // Rate limit: AI operations are expensive
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip, { ...RATE_LIMITS.ai, identifier: "notes:create" });
  
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.` },
      { status: 429, headers: rateLimitHeaders(rateCheck) }
    );
  }

  try {
    const body = await request.json();
    const { content, isPublic, sourceUrl, fileName, fileType } = body;

    // Validate: must have content OR sourceUrl OR fileName
    const hasContent = content && typeof content === "string" && content.trim().length > 0;
    const hasLink = sourceUrl && typeof sourceUrl === "string" && sourceUrl.trim().length > 0;
    const hasFile = fileName && typeof fileName === "string" && fileName.trim().length > 0;

    if (!hasContent && !hasLink && !hasFile) {
      return NextResponse.json(
        { error: "Content, URL, or file is required." },
        { status: 400 }
      );
    }

    let analysis;
    
    // Route to appropriate AI analyzer based on input type
    if (hasLink) {
      analysis = await analyzeLink(sourceUrl.trim(), content?.trim());
    } else if (hasFile) {
      analysis = await analyzeFile(fileName.trim(), fileType || "unknown", content?.trim());
    } else {
      analysis = await analyzeContent(content.trim());
    }

    // Save the AI-enriched note to the database (linked to user)
    const note = await createNote({
      title: analysis.title,
      content: content?.trim() || (hasLink ? sourceUrl : fileName),
      type: analysis.type,
      tags: analysis.tags,
      summary: analysis.summary,
      isPublic: isPublic ?? false,
      priority: analysis.priority,
      sourceUrl: hasLink ? sourceUrl.trim() : undefined,
      fileName: hasFile ? fileName.trim() : undefined,
      fileType: hasFile ? (fileType || undefined) : undefined,
      userId: session.user.id,
    });

    return NextResponse.json(note, { 
      status: 201,
      headers: rateLimitHeaders(rateCheck),
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in." },
      { status: 401 }
    );
  }

  // Rate limit: standard for reads
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip, { ...RATE_LIMITS.standard, identifier: "notes:read" });
  
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.` },
      { status: 429, headers: rateLimitHeaders(rateCheck) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");
    const sortBy = searchParams.get("sort"); // "priority" | "date"

    let notes;
    if (query) {
      notes = await searchNotes(query, session.user.id);
    } else {
      notes = await getAllNotes(session.user.id);
    }

    // Filter by type if specified (case-insensitive)
    if (type && type !== "ALL") {
      notes = notes.filter((note) => note.type.toUpperCase() === type.toUpperCase());
    }

    // Sort by priority if requested (highest first)
    if (sortBy === "priority") {
      notes = notes.sort((a, b) => b.priority - a.priority);
    }

    return NextResponse.json(notes, {
      headers: rateLimitHeaders(rateCheck),
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes." },
      { status: 500 }
    );
  }
}
