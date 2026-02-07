import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Documentation – Cortex",
  description: "Architecture and design documentation for the Cortex AI Second Brain.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">Cortex</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Brain
            </Link>
          </div>
        </div>
      </header>

      {/* Documentation Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Documentation
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Architecture, principles, and design decisions behind Cortex.
          </p>

          <Separator className="my-8" />

          {/* Section 1: Portable Architecture */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">01.</span> Portable Architecture
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cortex follows a <strong className="text-foreground">clean separation of concerns</strong> pattern. 
              The codebase is structured so that the AI engine, the database layer, 
              and the API routes are fully independent modules:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <code className="text-primary">lib/ai.ts</code> — The AI Service. 
                Handles all communication with Google Gemini. Contains the prompt 
                engineering, response parsing, and fallback logic. Swapping to 
                OpenAI or Anthropic requires changes <em>only</em> in this file.
              </li>
              <li>
                <code className="text-primary">lib/db.ts</code> — The Database Service. 
                Encapsulates all Prisma/PostgreSQL operations. The API routes never 
                touch the database directly — they call typed functions from this 
                module. Migrating from Neon to Supabase or even MongoDB means 
                replacing only this file.
              </li>
              <li>
                <code className="text-primary">app/api/*</code> — The API Layer. 
                Thin route handlers that orchestrate between the AI and DB services. 
                They contain zero business logic — just request validation, service 
                calls, and response formatting.
              </li>
            </ul>
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why this matters:</strong> In 
                production, teams can swap infrastructure without refactoring business 
                logic. The AI model, database provider, and hosting platform are all 
                independently replaceable.
              </p>
            </div>
          </section>

          {/* Section 2: Principles-Based UX */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">02.</span> Principles-Based UX
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We prioritize <strong className="text-foreground">Low-Friction Capture</strong> — 
              letting the user dump raw thoughts while the AI handles the organization. 
              The design philosophy centers around three principles:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Zero-config input:</strong> There are 
                no categories to choose, no tags to manually assign, no structured forms 
                to fill out. Users type a thought and press one button. The AI does the rest.
              </li>
              <li>
                <strong className="text-foreground">Immediate feedback:</strong> The 
                &quot;Save to Brain&quot; button transitions through visual states — idle, 
                processing (&quot;AI is organizing...&quot;), and success — giving users 
                confidence that their thought was captured and understood.
              </li>
              <li>
                <strong className="text-foreground">Progressive disclosure:</strong> The 
                dashboard starts simple (just cards) but reveals depth on interaction — 
                hover effects expose actions, search narrows results in real-time, and 
                type filters let power users drill down.
              </li>
            </ul>
          </section>

          {/* Section 3: Agent Thinking */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">03.</span> Agent Thinking
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The system isn&apos;t passive storage; it&apos;s an{" "}
              <strong className="text-foreground">active librarian</strong> that tags 
              and summarizes data automatically. Every piece of content that enters 
              Cortex goes through an AI analysis pipeline:
            </p>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li>
                <strong className="text-foreground">Classification:</strong> The agent 
                determines whether the input is a general Note, a Link reference, or 
                an Insight/realization.
              </li>
              <li>
                <strong className="text-foreground">Summarization:</strong> A concise 
                one-sentence summary is generated, distilling the core idea.
              </li>
              <li>
                <strong className="text-foreground">Tagging:</strong> 2-5 relevant tags 
                are extracted, creating a bottom-up taxonomy that emerges organically 
                from the user&apos;s own thoughts.
              </li>
              <li>
                <strong className="text-foreground">Title generation:</strong> A 
                descriptive title is created so the user never has to name their 
                thoughts manually.
              </li>
            </ol>
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Resilience:</strong> If the AI service 
                is unavailable, the system gracefully degrades — notes are saved with 
                auto-generated fallback metadata rather than failing entirely.
              </p>
            </div>
          </section>

          {/* Section 4: Infrastructure Mindset */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">04.</span> Infrastructure Mindset
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Public API allows this Second Brain to serve as a{" "}
              <strong className="text-foreground">backend for other personal websites</strong>.
              Multiple endpoints expose the knowledge base for external integrations:
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This transforms Cortex from a standalone app into 
              <strong className="text-foreground"> infrastructure</strong>:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Public Notes API:</strong> {" "}
                <code className="text-primary">/api/public/brain</code> returns the last 10 
                public notes in JSON format with CORS headers enabled.
              </li>
              <li>
                <strong className="text-foreground">Query API:</strong> {" "}
                <code className="text-primary">/api/public/brain/query</code> enables 
                conversational queries with AI-generated answers and source citations.
              </li>
              <li>
                <strong className="text-foreground">Embeddable Widget:</strong> {" "}
                <code className="text-primary">/embed</code> provides an iframe-ready 
                chat interface for external websites.
              </li>
            </ul>
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2">
              <p className="text-sm font-mono text-muted-foreground">
                GET /api/public/brain → {"{"} brain, count, notes: [...] {"}"}
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                POST /api/public/brain/query → {"{"} answer, sources, confidence {"}"}
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                {"<"}iframe src=&quot;/embed&quot; width=&quot;400&quot; height=&quot;500&quot;{"/>"}
              </p>
            </div>
          </section>

          {/* Tech Stack */}
          <Separator className="my-8" />
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">Frontend</p>
                <p>Next.js 14+ (App Router)</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">Styling</p>
                <p>Tailwind CSS + Shadcn/UI</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">Database</p>
                <p>PostgreSQL + Prisma ORM</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">AI Engine</p>
                <p>Google Gemini (gemini-2.0-flash)</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">Animations</p>
                <p>Framer Motion</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-foreground">Deployment</p>
                <p>Vercel + Neon/Supabase</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Cortex – Built with Next.js, Prisma, Google Gemini & Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}
