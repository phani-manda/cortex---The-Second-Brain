/**
 * Public Query API – GET/POST /api/public/brain/query
 * 
 * Infrastructure Mindset: This endpoint allows external applications
 * to query the Cortex knowledge base conversationally. Returns AI-generated
 * answers with source citations.
 */

import { NextRequest, NextResponse } from "next/server";
import { queryKnowledgeBase } from "@/lib/query";
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: AI queries are expensive
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip, { ...RATE_LIMITS.query, identifier: "public:query" });
  
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.` },
      { 
        status: 429, 
        headers: {
          ...rateLimitHeaders(rateCheck),
          "Access-Control-Allow-Origin": "*",
        }
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get("q");

    if (!question) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Public endpoint: only query public notes to prevent data leakage
    const result = await queryKnowledgeBase(question, { publicOnly: true });

    return NextResponse.json(
      {
        brain: "Cortex – AI Second Brain",
        query: question,
        ...result,
      },
      {
        headers: {
          ...rateLimitHeaders(rateCheck),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Public query API error:", error);
    return NextResponse.json(
      { error: "Failed to process query." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Rate limit: AI queries are expensive
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip, { ...RATE_LIMITS.query, identifier: "public:query" });
  
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.` },
      { 
        status: 429, 
        headers: {
          ...rateLimitHeaders(rateCheck),
          "Access-Control-Allow-Origin": "*",
        }
      }
    );
  }

  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Request body must contain 'question' field" },
        { status: 400 }
      );
    }

    // Public endpoint: only query public notes to prevent data leakage
    const result = await queryKnowledgeBase(question, { publicOnly: true });

    return NextResponse.json(
      {
        brain: "Cortex – AI Second Brain",
        query: question,
        ...result,
      },
      {
        headers: {
          ...rateLimitHeaders(rateCheck),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Public query API error:", error);
    return NextResponse.json(
      { error: "Failed to process query." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
