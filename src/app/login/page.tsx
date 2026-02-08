"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, Mail, Lock, UserPlus, LogIn } from "lucide-react";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        // Register first
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
          const data = await res.json();
          // Show helpful message for database configuration errors
          if (res.status === 503 && data.details) {
            throw new Error(`${data.error}: ${data.details}`);
          }
          throw new Error(data.error || "Registration failed");
        }
      }

      // Sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <Card className="w-full max-w-md border-2 border-zinc-500/20 bg-card/60 backdrop-blur-xl shadow-2xl shadow-zinc-900/20 overflow-hidden relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-800/20 pointer-events-none" />
          <CardHeader className="text-center relative space-y-4 pb-2">
            <motion.div 
              className="flex justify-center mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-500/20 to-zinc-400/20 border border-zinc-500/30 shadow-lg shadow-zinc-500/20 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500 to-zinc-400 rounded-xl blur-xl opacity-30" />
                <Brain className="h-8 w-8 text-zinc-400 relative z-10" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-zinc-400/70">
              {mode === "login"
                ? "Sign in to your Second Brain"
                : "Start building your knowledge base"}
            </CardDescription>
          </CardHeader>

        <CardContent className="relative pt-2 pb-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-medium text-zinc-300/80">
                    Name
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400/60" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-zinc-900/20 border-zinc-500/20 focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all placeholder:text-zinc-400/40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300/80">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400/60 group-focus-within:text-zinc-400 transition-colors" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-zinc-900/20 border-zinc-500/20 focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all placeholder:text-zinc-400/40"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300/80">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400/60 group-focus-within:text-zinc-400 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-zinc-900/20 border-zinc-500/20 focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all placeholder:text-zinc-400/40"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-zinc-600 to-zinc-500 hover:from-zinc-500 hover:to-zinc-400 shadow-lg shadow-zinc-500/20" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-sm text-zinc-400/70 hover:text-zinc-300 transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400/50 hover:text-zinc-300 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
