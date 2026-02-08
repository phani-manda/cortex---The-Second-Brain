/**
 * DELETE /api/notes/[id] – Delete a note (requires authentication, ownership verified)
 * PATCH  /api/notes/[id] – Toggle public visibility (requires authentication)
 * GET    /api/notes/[id] – Get a single note (requires authentication)
 */

import { NextRequest, NextResponse } from "next/server";
import { deleteNote, togglePublic, getNoteById } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await deleteNote(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("not found") || message.includes("access denied")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const note = await togglePublic(id, session.user.id);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("not found") || message.includes("denied")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error("Error toggling note visibility:", error);
    return NextResponse.json(
      { error: "Failed to update note." },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const note = await getNoteById(id, session.user.id);
    if (!note) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note." },
      { status: 500 }
    );
  }
}
