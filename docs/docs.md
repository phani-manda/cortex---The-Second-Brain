# Cortex – Architecture Documentation

> AI Second Brain: A knowledge management system that transforms raw thoughts into organized, revisitable knowledge.

---

## 01. Portable Architecture

Cortex follows a **clean separation of concerns** pattern. The codebase is structured so that the AI engine, the database layer, and the API routes are fully independent modules:

### Module Responsibilities

| Module | Purpose | Swappable Component |
|--------|---------|---------------------|
| `lib/ai.ts` | AI Service – Handles all communication with Groq AI (Llama 3.3-70b). Contains prompt engineering, response parsing, priority scoring, and multi-model fallback chain. | AI Provider (OpenAI, Anthropic, etc.) |
| `lib/query.ts` | Query Service – RAG-based knowledge retrieval with context windowing. Pulls relevant notes, injects them as context, and generates answers with source citations. | Search/RAG strategy |
| `lib/db.ts` | Database Service – Encapsulates all Prisma/PostgreSQL operations. API routes never touch the database directly. | Database (Supabase, MongoDB, etc.) |
| `app/api/*` | API Layer – Thin route handlers that orchestrate between services. Contains zero business logic – just validation, service calls, and response formatting. | HTTP framework |

### Why This Matters

In production, teams can swap infrastructure without refactoring business logic. The AI model, database provider, and hosting platform are all independently replaceable. **We migrated from Google Gemini to Groq in under 30 minutes by modifying only two files.**

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│              (app/api/notes, app/api/public/*)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   AI Service    │  │  Query Service  │  │ DB Service  │ │
│  │   (lib/ai.ts)   │  │ (lib/query.ts)  │  │ (lib/db.ts) │ │
│  │                 │  │                 │  │             │ │
│  │  • Groq SDK     │  │  • RAG Context  │  │  • Prisma   │ │
│  │  • Llama 3.3    │  │  • Citations    │  │  • Postgres │ │
│  │  • Fallbacks    │  │  • Streaming    │  │  • Neon     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 02. Principles-Based UX

We prioritize **Low-Friction Capture** – letting the user dump raw thoughts while the AI handles the organization. Our design philosophy centers around five core principles:

### The Five Principles

**1. Zero-config input**
There are no categories to choose, no tags to manually assign, no structured forms to fill out. Users type a thought and press one button. The AI does the rest.

**2. Immediate feedback**
The "Save to Brain" button transitions through visual states – idle, processing ("AI is organizing..."), and success – giving users confidence that their thought was captured and understood.

**3. Progressive disclosure**
The dashboard starts simple (just cards) but reveals depth on interaction – hover effects expose actions, search narrows results in real-time, and type filters let power users drill down.

**4. AI as assistant, not gatekeeper**
The system never blocks the user. If AI analysis fails, notes are saved with auto-generated fallback metadata. The AI enhances – it never interrupts.

**5. Priority-driven attention**
Notes are sorted by AI-calculated importance, not just recency. Critical tasks and breakthrough insights surface automatically. Visual priority bars communicate urgency at a glance.

### Interaction Patterns

```
User Action          →  System Response        →  Visual Feedback
─────────────────────────────────────────────────────────────────
Type thought         →  No action              →  Textarea grows
Press "Save"         →  POST to /api/notes     →  Button: "Saving..."
Wait ~1s             →  AI analyzes content    →  Button: "AI organizing..."
Complete             →  Note appears in grid   →  Card fades in with animation
```

---

## 03. Agent Thinking

The system isn't passive storage; it's an **active librarian** that tags, summarizes, and prioritizes data automatically. Every piece of content that enters Cortex goes through an AI analysis pipeline:

### The Analysis Pipeline

1. **Classification** – The agent determines whether the input is a general Note, a Link reference, or an Insight/realization.

2. **Summarization** – A concise one-sentence summary is generated, distilling the core idea.

3. **Tagging** – 2-5 relevant tags are extracted, creating a bottom-up taxonomy that emerges organically from the user's own thoughts.

4. **Title Generation** – A descriptive title is created so the user never has to name their thoughts manually.

5. **Priority Scoring** – A 1-100 importance score is calculated based on keyword analysis, content depth, and organizational markers.

### Priority Scoring Algorithm

The priority system uses weighted keyword extraction with the following categories:

| Category | Weight | Trigger Words |
|----------|--------|---------------|
| Critical | 95 | urgent, emergency, deadline, asap, immediately |
| High | 80 | important, essential, must, decision, required |
| Insight | 78 | breakthrough, aha, learned, revelation, discovered |
| Actionable | 70 | todo, implement, build, fix, resolve, schedule |
| Learning | 68 | study, research, explore, understand, practice |
| Ideas | 65 | concept, vision, strategy, approach, plan |
| Reference | 50 | note, remember, bookmark, save, keep |

**Bonus modifiers:**
- +5 for content over 100 words (detailed thinking)
- +5 for content over 200 words (deep exploration)
- +3 for questions (active inquiry)
- +3 for numbered/bulleted lists (organized thinking)

### Resilience & Fallback Chain

The system uses a multi-model fallback chain:

```
Primary:   Llama 3.3-70b-versatile (fastest, most capable)
    ↓ (on failure)
Fallback:  Llama 3.1-8b-instant (faster, smaller)
    ↓ (on failure)
Tertiary:  Mixtral 8x7b-32768 (different architecture)
    ↓ (on failure)
Local:     Keyword extraction algorithm (no network required)
```

If all AI services fail, notes are saved with auto-generated fallback metadata using the local keyword extraction algorithm. **The system never fails silently.**

---

## 04. Infrastructure Mindset

The Public API allows this Second Brain to serve as a **backend for other personal websites**. Multiple endpoints expose the knowledge base for external integrations.

### API Endpoints

#### `GET /api/public/brain`
Returns the last 10 public notes in JSON format.

```bash
curl https://your-domain.com/api/public/brain
```

**Response:**
```json
{
  "brain": "Cortex – AI Second Brain",
  "count": 10,
  "notes": [
    {
      "id": "abc123",
      "title": "The Power of Spaced Repetition",
      "summary": "Reviewing material at increasing intervals...",
      "type": "INSIGHT",
      "tags": ["learning", "memory", "study"],
      "createdAt": "2026-02-07T10:30:00Z"
    }
  ]
}
```

#### `GET /api/public/brain/query?q=<question>`
Query the knowledge base with natural language and receive AI-generated answers with source citations.

```bash
curl "https://your-domain.com/api/public/brain/query?q=What%20are%20my%20learning%20notes?"
```

**Response:**
```json
{
  "brain": "Cortex – AI Second Brain",
  "query": "What are my learning notes?",
  "answer": "Based on your notes, you've been exploring...",
  "sources": [
    { "id": "abc123", "title": "Spaced Repetition", "relevance": 0.92 }
  ],
  "confidence": "high"
}
```

#### `POST /api/public/brain/query`
Same as GET but accepts JSON body for longer queries.

```bash
curl -X POST https://your-domain.com/api/public/brain/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Summarize my productivity insights"}'
```

### Embeddable Widget

The `/embed` route provides an iframe-ready chat interface for external websites:

```html
<iframe 
  src="https://your-domain.com/embed" 
  width="400" 
  height="500"
  style="border: none; border-radius: 12px;"
></iframe>
```

This transforms Cortex from a standalone app into **infrastructure** – a queryable knowledge base that can power other tools, dashboards, or personal websites.

### Rate Limiting

Public endpoints are rate-limited to prevent abuse:
- Public notes: 60 requests/minute
- Query API: 10 requests/minute (AI is expensive)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router, TypeScript) |
| Styling | Tailwind CSS + Shadcn/UI |
| Database | PostgreSQL + Prisma v7 (Neon) |
| AI Engine | Groq AI (Llama 3.3-70b-versatile) |
| Animations | Framer Motion |
| Deployment | Vercel + Neon |

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-username/cortex.git
cd cortex
npm install

# Configure environment
cp .env.example .env.local
# Add your GROQ_API_KEY and DATABASE_URL

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

---

*Built with Next.js, Prisma, Groq AI & Framer Motion*
