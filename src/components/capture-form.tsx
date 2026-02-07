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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Capture a Thought</h2>
          </div>
          
          {/* Mode Tabs */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            {(["note", "link", "file"] as CaptureMode[]).map((m) => {
              const Icon = modeIcons[m];
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{m}</span>
                </button>
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
                  className="min-h-[120px] resize-none bg-background/50 text-base"
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
                  <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="url"
                    placeholder="https://example.com/article"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="bg-background/50"
                    disabled={status === "processing"}
                  />
                </div>
                <Textarea
                  placeholder="Optional: Add notes about this link..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] resize-none bg-background/50 text-base"
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
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    type="button"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to select a file</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fileName}</p>
                      <p className="text-xs text-muted-foreground">{fileType}</p>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-1 hover:bg-muted rounded"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
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
            <button
              onClick={() => setIsPublic(!isPublic)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <Globe className={`h-4 w-4 ${isPublic ? "text-primary" : ""}`} />
              {isPublic ? "Public" : "Private"}
            </button>

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
