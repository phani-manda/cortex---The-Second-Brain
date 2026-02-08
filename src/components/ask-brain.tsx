"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, Loader2, X, Sparkles, ExternalLink } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ id: string; title: string; summary: string | null }>;
  confidence?: string;
};

export function AskBrain() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/public/brain/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        confidence: data.confidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-500 text-white shadow-lg shadow-zinc-500/40 flex items-center justify-center hover:shadow-zinc-400/60 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? "0 0 30px rgba(161, 161, 170, 0.5)" 
            : ["0 0 20px rgba(161, 161, 170, 0.3)", "0 0 30px rgba(161, 161, 170, 0.5)", "0 0 20px rgba(161, 161, 170, 0.3)"]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] overflow-hidden"
          >
            <Card className="border-2 border-zinc-500/30 bg-card/90 backdrop-blur-xl shadow-2xl shadow-zinc-900/30 relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-800/20 pointer-events-none" />
              {/* Header */}
              <div className="p-4 border-b border-zinc-500/20 flex items-center gap-2 relative">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-5 w-5 text-zinc-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-sm bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent">Ask Your Brain</h3>
                  <p className="text-[11px] text-zinc-400/70">
                    Query your knowledge base with AI
                  </p>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="p-0 relative">
                <div className="h-[300px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-zinc-400/60 text-sm py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Ask me anything about your knowledge base!</p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-zinc-600 to-zinc-500 text-white shadow-lg shadow-zinc-500/20"
                            : "bg-zinc-900/30 border border-zinc-500/20"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-zinc-500/20">
                            <p className="text-[10px] uppercase tracking-wide text-zinc-400/70 mb-1">
                              Sources
                            </p>
                            {message.sources.map((src) => (
                              <div
                                key={src.id}
                                className="flex items-center gap-1 text-[11px] text-zinc-300/80 hover:text-zinc-200 transition-colors"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                                {src.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-zinc-900/30 border border-zinc-500/20 rounded-2xl px-4 py-3 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4 text-zinc-400" />
                        </motion.div>
                        <span className="text-xs text-zinc-400/70">Thinking...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-zinc-500/20 flex gap-2 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Ask a question..."
                    className="flex-1 bg-zinc-900/20 border-zinc-500/20 text-sm focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all placeholder:text-zinc-400/40"
                    disabled={isLoading}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSubmit}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="shrink-0 bg-gradient-to-r from-zinc-600 to-zinc-500 hover:from-zinc-500 hover:to-zinc-400 shadow-lg shadow-zinc-500/20"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
