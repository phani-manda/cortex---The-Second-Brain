"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, FileText, Github, Sparkles, Zap, Database, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CaptureForm } from "@/components/capture-form";
import { NoteGrid } from "@/components/note-grid";
import { AskBrain } from "@/components/ask-brain";

export function Dashboard() {
  const { data: session, status } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -80]);
  const floatingY1 = useTransform(scrollY, [0, 600], [0, -150]);
  const floatingY2 = useTransform(scrollY, [0, 600], [0, -100]);
  const floatingY3 = useTransform(scrollY, [0, 600], [0, -120]);
  const floatingRotate = useTransform(scrollY, [0, 600], [0, 45]);
  const floatingScale = useTransform(scrollY, [0, 400], [1, 0.8]);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-500/20 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-lg blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <Brain className="h-7 w-7 text-primary relative z-10" />
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
              
              {/* Auth Controls */}
              {isLoading ? (
                <div className="h-8 w-20 rounded-md bg-muted/50 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {session?.user?.name || session?.user?.email?.split("@")[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
        {/* Floating Elements (Parallax) */}
        <motion.div
          style={{ y: floatingY1, rotate: floatingRotate, scale: floatingScale }}
          className="absolute top-20 left-10 opacity-30 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-full blur-2xl opacity-40" />
            <Sparkles className="h-16 w-16 text-zinc-400 relative z-10" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: floatingY2, scale: floatingScale }}
          className="absolute top-40 right-16 opacity-25 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-400 to-zinc-500 rounded-full blur-xl opacity-50" />
            <Database className="h-12 w-12 text-zinc-400 relative z-10" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: floatingY3 }}
          className="absolute top-60 left-1/4 opacity-20 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-zinc-500 rounded-full blur-xl opacity-40" />
            <Zap className="h-10 w-10 text-slate-400 relative z-10" />
          </motion.div>
        </motion.div>
        
        {/* Additional floating orbs */}
        <motion.div
          style={{ y: floatingY2 }}
          className="absolute top-80 right-1/3 opacity-15 pointer-events-none hidden lg:block"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-500 blur-2xl" />
          </motion.div>
        </motion.div>

        {/* Hero */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center space-y-5 pt-6 pb-6"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-zinc-500/20 to-zinc-400/20 border border-zinc-500/30 text-zinc-300 text-sm font-medium mb-4 animate-glow-pulse"
          >
            <Sparkles className="h-4 w-4 text-zinc-400" />
            AI-Powered Knowledge Management
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Your Intelligent
            <span className="bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]"> Knowledge Base</span>
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

        {/* Capture Form - only show if authenticated */}
        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto px-2"
          >
            <CaptureForm
              onNoteCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-md mx-auto text-center py-8"
          >
            <p className="text-muted-foreground mb-4">
              Sign in to start capturing and organizing your thoughts.
            </p>
            <Link href="/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </motion.div>
        )}

        <Separator className="max-w-sm mx-auto opacity-40" />

        {/* Dashboard Grid - only show if authenticated */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NoteGrid refreshTrigger={refreshTrigger} />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-500/20 mt-20 bg-gradient-to-t from-zinc-900/10 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Cortex – Built with Next.js, Prisma, Groq AI & Framer Motion
          </p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AskBrain />
    </div>
  );
}
