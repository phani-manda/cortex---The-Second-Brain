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

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
    },
  });
}

export async function getAllNotes() {
  return prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({ where: { id } });
}

export async function searchNotes(query: string) {
  return prisma.note.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
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

export async function deleteNote(id: string) {
  return prisma.note.delete({ where: { id } });
}

export async function togglePublic(id: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new Error("Note not found");
  return prisma.note.update({
    where: { id },
    data: { isPublic: !note.isPublic },
  });
}

export async function getNotesByType(type: string) {
  return prisma.note.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
  });
}
