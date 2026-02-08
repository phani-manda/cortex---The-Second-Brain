"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Loader2, Sparkles, Check, Globe, FileText, Link2, Pencil, X, Upload } from "lucide-react";

type CaptureStatus = "idle" | "processing" | "success" | "error";
type CaptureMode = "note" | "link" | "file";

interface CaptureFormProps {
  onNoteCreated: () => void;
}

export function CaptureForm({ onNoteCreated }: CaptureFormProps) {
  const [mode, setMode] = useState<CaptureMode>("note");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type || "application/octet-stream");
    }
  };

  const clearFile = () => {
    setFileName("");
    setFileType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validate based on mode
    if (mode === "note" && !content.trim()) return;
    if (mode === "link" && !linkUrl.trim()) return;
    if (mode === "file" && !fileName) return;

    setStatus("processing");
    setError("");

    try {
      const payload: Record<string, unknown> = { isPublic };
      
      if (mode === "note") {
        payload.content = content.trim();
      } else if (mode === "link") {
        payload.sourceUrl = linkUrl.trim();
        payload.content = content.trim() || undefined;
      } else if (mode === "file") {
        payload.fileName = fileName;
        payload.fileType = fileType;
        payload.content = content.trim() || undefined;
      }

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setStatus("success");
      setContent("");
      setLinkUrl("");
      setFileName("");
      setFileType("");
      setIsPublic(false);

      setTimeout(() => {
        setStatus("idle");
        onNoteCreated();
      }, 1500);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const isDisabled = () => {
    if (status === "processing") return true;
    if (mode === "note") return !content.trim();
    if (mode === "link") return !linkUrl.trim();
    if (mode === "file") return !fileName;
    return true;
  };

  const buttonContent = {
    idle: (
      <>
        <Brain className="mr-2 h-4 w-4" />
        Save to Brain
      </>
    ),
    processing: (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        AI is organizing...
      </>
    ),
    success: (
      <>
        <Check className="mr-2 h-4 w-4" />
        Saved!
      </>
    ),
    error: (
      <>
        <span className="mr-2">✕</span>
        Failed
      </>
    ),
  };

  const buttonVariant = {
    idle: "default" as const,
    processing: "secondary" as const,
    success: "default" as const,
    error: "destructive" as const,
  };

  const modeIcons = {
    note: Pencil,
    link: Link2,
    file: FileText,
  };

  return (
    <Card className="border-zinc-500/20 bg-card/50 backdrop-blur-md shadow-xl shadow-zinc-900/10 overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/5 via-transparent to-zinc-400/5 pointer-events-none" />
      <CardContent className="pt-6 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5 text-zinc-400" />
            </motion.div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent">Capture a Thought</h2>
          </div>
          
          {/* Mode Tabs */}
          <div className="flex gap-1 p-1.5 bg-zinc-900/30 rounded-lg border border-zinc-500/20 relative">
            {(["note", "link", "file"] as CaptureMode[]).map((m) => {
              const Icon = modeIcons[m];
              return (
                <motion.button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-300 relative z-10 ${
                    mode === m
                      ? "text-white"
                      : "text-muted-foreground hover:text-zinc-300"
                  }`}
                  type="button"
                  whileHover={{ scale: mode === m ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-zinc-600 to-zinc-500 rounded-md shadow-lg shadow-zinc-500/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.div 
                    className="relative z-10 flex items-center gap-2"
                    animate={mode === m ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{m}</span>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Mode-specific inputs */}
          <AnimatePresence mode="wait">
            {mode === "note" && (
              <motion.div
                key="note"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Dump your raw thought — the AI will organize, tag, and prioritize it for you.
                </p>
                <Textarea
                  placeholder="What's on your mind? E.g., 'Need to look into React server components for the new project...'"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] resize-none bg-zinc-900/20 border-zinc-500/20 text-base focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all duration-300 placeholder:text-zinc-400/40"
                  disabled={status === "processing"}
                />
              </motion.div>
            )}

            {mode === "link" && (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground">
                  Save a URL with optional notes — AI will analyze and categorize it.
                </p>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                  <Input
                    type="url"
                    placeholder="https://example.com/article"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="bg-zinc-900/20 border-zinc-500/20 focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all duration-300"
                    disabled={status === "processing"}
                  />
                </div>
                <Textarea
                  placeholder="Optional: Add notes about this link..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] resize-none bg-zinc-900/20 border-zinc-500/20 text-base focus:ring-2 focus:ring-zinc-500/30 focus:border-zinc-400/50 transition-all duration-300 placeholder:text-zinc-400/40"
                  disabled={status === "processing"}
                />
              </motion.div>
            )}

            {mode === "file" && (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground">
                  Attach a file reference — AI will help organize and describe it.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={status === "processing"}
                />
                {!fileName ? (
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-zinc-500/30 rounded-lg p-8 flex flex-col items-center gap-2 text-zinc-300/70 hover:border-zinc-400/50 hover:text-zinc-300 hover:bg-zinc-500/5 transition-all duration-300"
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Upload className="h-8 w-8" />
                    </motion.div>
                    <span className="text-sm font-medium">Click to select a file</span>
                  </motion.button>
                ) : (
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-zinc-500/10 rounded-lg border border-zinc-500/20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FileText className="h-8 w-8 text-zinc-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-zinc-200">{fileName}</p>
                      <p className="text-xs text-zinc-400/70">{fileType}</p>
                    </div>
                    <motion.button
                      onClick={clearFile}
                      className="p-1 hover:bg-zinc-500/20 rounded transition-colors"
                      type="button"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-4 w-4 text-zinc-400" />
                    </motion.button>
                  </motion.div>
                )}
                <Textarea
                  placeholder="Optional: Describe this file..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] resize-none bg-background/50 text-base"
                  disabled={status === "processing"}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
<motion.button
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${isPublic ? 'text-zinc-400' : 'text-muted-foreground hover:text-zinc-300'}`}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className={`h-4 w-4 transition-transform duration-300 ${isPublic ? "scale-110" : ""}`} />
              {isPublic ? "Public" : "Private"}
            </motion.button>

            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleSubmit}
                disabled={isDisabled()}
                variant={buttonVariant[status]}
                size="lg"
                className="min-w-[180px] transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    {buttonContent[status]}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
