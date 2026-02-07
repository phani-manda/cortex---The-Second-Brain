/**
 * Public API – GET /api/public/brain
 * 
 * Infrastructure Mindset: This endpoint exposes the last 10 public notes
 * as a JSON API, allowing this Second Brain to serve as a backend
 * for other personal websites, dashboards, or integrations.
 */

import { NextResponse } from "next/server";
import { getPublicNotes } from "@/lib/db";

export async function GET() {
  try {
    const notes = await getPublicNotes(10);

    return NextResponse.json(
      {
        brain: "Cortex – AI Second Brain",
        count: notes.length,
        notes: notes.map((note) => ({
          id: note.id,
          title: note.title,
          summary: note.summary,
          type: note.type,
          tags: note.tags,
          createdAt: note.createdAt,
        })),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "s-maxage=60, stale-while-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Public API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve public notes." },
      { status: 500 }
    );
  }
}
