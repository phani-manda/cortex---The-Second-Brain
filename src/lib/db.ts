/**
 * Database Service Layer
 * 
 * Portable Architecture: This module encapsulates all database interactions,
 * keeping the data layer completely separated from the AI layer (lib/ai.ts)
 * and the API routes. This allows swapping databases without touching business logic.
 */

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL && process.env.DATABASE_URL.length > 10;

function createPrismaClient() {
  if (!isDatabaseConfigured) {
    console.warn("⚠️ DATABASE_URL not configured. Database features will be unavailable.");
    console.warn("   Set DATABASE_URL in .env.local to enable database functionality.");
    // Return a proxy that throws helpful errors
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then") return undefined; // Allow promise checks
        return new Proxy(() => {}, {
          get() {
            throw new DatabaseNotConfiguredError();
          },
          apply() {
            throw new DatabaseNotConfiguredError();
          },
        });
      },
    });
  }
  
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Custom error for database not configured
 */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Database not configured. Please set DATABASE_URL in your .env.local file.");
    this.name = "DatabaseNotConfiguredError";
  }
}

/**
 * Check if database is available
 */
export function checkDatabaseConnection(): boolean {
  return isDatabaseConfigured;
}

export type CreateNoteInput = {
  title: string;
  content: string;
  type?: string;
  tags?: string[];
  summary?: string;
  isPublic?: boolean;
  priority?: number;
  sourceUrl?: string;
  fileName?: string;
  fileType?: string;
  userId?: string; // Owner of the note
};

export async function createNote(data: CreateNoteInput) {
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      type: data.type ?? "NOTE",
      tags: data.tags ?? [],
      summary: data.summary ?? null,
      isPublic: data.isPublic ?? false,
      priority: data.priority ?? 50,
      sourceUrl: data.sourceUrl ?? null,
      fileName: data.fileName ?? null,
      fileType: data.fileType ?? null,
      userId: data.userId ?? null,
    },
  });
}

/**
 * Get all notes for a specific user
 */
export async function getAllNotes(userId?: string) {
  return prisma.note.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get all notes for a user (required userId)
 */
export async function getUserNotes(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string, userId?: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  
  // If userId provided, verify ownership
  if (userId && note && note.userId !== userId) {
    return null; // User doesn't own this note
  }
  
  return note;
}

export async function searchNotes(query: string, userId?: string) {
  return prisma.note.findMany({
    where: {
      AND: [
        userId ? { userId } : {},
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { summary: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query] } },
          ],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublicNotes(limit = 10) {
  return prisma.note.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Delete a note (with ownership check if userId provided)
 */
export async function deleteNote(id: string, userId?: string) {
  // Verify ownership if userId provided
  if (userId) {
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId) {
      throw new Error("Note not found or access denied");
    }
  }
  return prisma.note.delete({ where: { id } });
}

/**
 * Toggle public visibility (with ownership check if userId provided)
 */
export async function togglePublic(id: string, userId?: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new Error("Note not found");
  
  // Verify ownership if userId provided
  if (userId && note.userId !== userId) {
    throw new Error("Access denied");
  }
  
  return prisma.note.update({
    where: { id },
    data: { isPublic: !note.isPublic },
  });
}

export async function getNotesByType(type: string, userId?: string) {
  return prisma.note.findMany({
    where: { 
      type,
      ...(userId ? { userId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
