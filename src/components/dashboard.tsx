"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, FileText, Github, Sparkles, Zap, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CaptureForm } from "@/components/capture-form";
import { NoteGrid } from "@/components/note-grid";
import { AskBrain } from "@/components/ask-brain";

export function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const heroY = useTransform(scrollY, [0, 200], [0, -50]);
  const floatingY1 = useTransform(scrollY, [0, 500], [0, -100]);
  const floatingY2 = useTransform(scrollY, [0, 500], [0, -60]);
  const floatingY3 = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="h-7 w-7 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Cortex</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">
                  AI Second Brain
                </p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                Docs
              </Link>
              <Link
                href="/api/public/brain"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
              >
                API
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
        {/* Floating Elements (Parallax) */}
        <motion.div
          style={{ y: floatingY1 }}
          className="absolute top-20 left-10 opacity-20 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-16 w-16 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: floatingY2 }}
          className="absolute top-40 right-16 opacity-15 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Database className="h-12 w-12 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: floatingY3 }}
          className="absolute top-60 left-1/4 opacity-10 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="h-10 w-10 text-primary" />
          </motion.div>
        </motion.div>

        {/* Hero */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center space-y-4 pt-8 pb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Knowledge Management
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Your Intelligent
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Knowledge Base</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-lg mx-auto text-lg"
          >
            Capture raw thoughts, and let AI organize them into a searchable, tagged second brain.
          </motion.p>
        </motion.div>

        {/* Capture Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <CaptureForm
            onNoteCreated={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </motion.div>

        <Separator className="max-w-xs mx-auto opacity-50" />

        {/* Dashboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NoteGrid refreshTrigger={refreshTrigger} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Cortex – Built with Next.js, Prisma, Google Gemini & Framer Motion
          </p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AskBrain />
    </div>
  );
}
