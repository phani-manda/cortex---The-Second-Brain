/**
 * Prisma Seed Script
 * 
 * Creates sample data for development and testing.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Note types (stored as strings in database)
type NoteType = "NOTE" | "LINK" | "INSIGHT" | "FILE";

// Initialize Prisma client with adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@cortex.ai" },
    update: {},
    create: {
      email: "demo@cortex.ai",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Sample notes for demonstration
  const sampleNotes = [
    {
      title: "Getting Started with AI",
      content: "Artificial Intelligence is transforming how we work and think. Key areas include machine learning, natural language processing, and computer vision. The most important thing is to start with fundamentals and build up from there.",
      type: "INSIGHT" as NoteType,
      tags: ["AI", "learning", "fundamentals"],
      summary: "Overview of AI fundamentals including ML, NLP, and computer vision as starting points.",
      priority: 85,
      isPublic: true,
    },
    {
      title: "Project Architecture Decision",
      content: "Decided to use Next.js with App Router for the frontend, Prisma with PostgreSQL for the database, and Groq AI for intelligent processing. This stack provides excellent developer experience, type safety, and scalable AI capabilities.",
      type: "NOTE" as NoteType,
      tags: ["architecture", "decision", "Next.js", "Prisma"],
      summary: "Technical decision to use Next.js, Prisma, PostgreSQL, and Groq AI for the project stack.",
      priority: 78,
      isPublic: false,
    },
    {
      title: "Productivity Breakthrough",
      content: "Aha moment: The key to productivity isn't doing more, it's doing less but better. Focus on high-impact activities, say no to distractions, and batch similar tasks together. Energy management is more important than time management.",
      type: "INSIGHT" as NoteType,
      tags: ["productivity", "breakthrough", "focus"],
      summary: "Productivity insight: focus on fewer high-impact activities and manage energy over time.",
      priority: 92,
      isPublic: true,
    },
    {
      title: "Useful API Documentation",
      sourceUrl: "https://docs.groq.com/api",
      content: "Groq API documentation for LPU inference. Contains model information, rate limits, and example code for integration.",
      type: "LINK" as NoteType,
      tags: ["API", "documentation", "Groq"],
      summary: "Official Groq API documentation for LPU inference and model integration.",
      priority: 65,
      isPublic: true,
    },
    {
      title: "TODO: Implement Caching",
      content: "Need to implement caching layer for frequently accessed notes. Consider Redis or in-memory cache. Priority: reduce database load by 50% on read operations. Deadline: next sprint.",
      type: "NOTE" as NoteType,
      tags: ["todo", "caching", "performance"],
      summary: "Action item to implement caching layer for reducing database load on reads.",
      priority: 75,
      isPublic: false,
    },
    {
      title: "Design System Reference",
      sourceUrl: "https://ui.shadcn.com",
      content: "shadcn/ui component library. Beautiful, accessible components built with Radix UI and Tailwind CSS. Perfect for rapid UI development.",
      type: "LINK" as NoteType,
      tags: ["design", "UI", "components"],
      summary: "shadcn/ui library reference for accessible Tailwind CSS components.",
      priority: 60,
      isPublic: true,
    },
    {
      title: "Meeting Notes: Q1 Planning",
      content: "Key decisions from Q1 planning:\n1. Focus on core features first\n2. Launch MVP by end of month\n3. Gather user feedback before adding advanced features\n4. Security audit required before public release\n\nAction items assigned to each team member.",
      type: "NOTE" as NoteType,
      tags: ["meeting", "planning", "Q1"],
      summary: "Q1 planning decisions: MVP first, user feedback, security audit required.",
      priority: 70,
      isPublic: false,
    },
    {
      title: "Learning: TypeScript Generics",
      content: "Finally understood TypeScript generics! The key insight is that they're like function parameters but for types. You can constrain them with extends, provide defaults, and use conditional types for advanced patterns.",
      type: "INSIGHT" as NoteType,
      tags: ["TypeScript", "learning", "generics"],
      summary: "Understanding TypeScript generics as type-level function parameters with constraints.",
      priority: 68,
      isPublic: true,
    },
    {
      title: "System Design Patterns",
      fileName: "design-patterns.pdf",
      fileType: "application/pdf",
      content: "Comprehensive guide to system design patterns including microservices, event-driven architecture, CQRS, and saga patterns. Essential reference for building scalable systems.",
      type: "FILE" as NoteType,
      tags: ["system-design", "patterns", "reference"],
      summary: "PDF reference for system design patterns: microservices, event-driven, CQRS, sagas.",
      priority: 72,
      isPublic: false,
    },
    {
      title: "Emergency: Security Vulnerability",
      content: "URGENT: Discovered that public API was exposing private notes. Fixed by adding publicOnly filter to query function. Verify all endpoints have proper authentication checks. Must complete security audit immediately.",
      type: "NOTE" as NoteType,
      tags: ["security", "urgent", "vulnerability"],
      summary: "Critical security fix: added publicOnly filter to prevent private note exposure.",
      priority: 98,
      isPublic: false,
    },
  ];

  console.log("\n📝 Creating sample notes...\n");

  for (const note of sampleNotes) {
    const created = await prisma.note.create({
      data: {
        ...note,
        userId: demoUser.id,
      },
    });
    console.log(`  ✅ ${created.title} (${created.type}, priority: ${created.priority})`);
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`\n📊 Summary:`);
  console.log(`   - 1 demo user created`);
  console.log(`   - ${sampleNotes.length} sample notes created`);
  console.log(`   - ${sampleNotes.filter(n => n.isPublic).length} public notes for API testing`);
  console.log(`\n🔐 Demo credentials:`);
  console.log(`   Email: demo@cortex.ai`);
  console.log(`   Password: demo123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
