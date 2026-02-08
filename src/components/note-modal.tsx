"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Link2,
  Lightbulb,
  File,
  ExternalLink,
  X,
  Globe,
  Clock,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import type { Note } from "@/components/note-card";

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig = {
  NOTE: {
    icon: FileText,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "Note",
    accent: "blue",
  },
  LINK: {
    icon: Link2,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    label: "Link",
    accent: "emerald",
  },
  INSIGHT: {
    icon: Lightbulb,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    label: "Insight",
    accent: "amber",
  },
  FILE: {
    icon: File,
    color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    label: "File",
    accent: "zinc",
  },
};

function getPriorityInfo(priority: number) {
  if (priority >= 90) return { label: "Critical", color: "text-red-500", bg: "bg-gradient-to-r from-red-500 to-red-400", bgLight: "bg-red-500/20" };
  if (priority >= 70) return { label: "High", color: "text-orange-500", bg: "bg-gradient-to-r from-orange-500 to-orange-400", bgLight: "bg-orange-500/20" };
  if (priority >= 50) return { label: "Medium", color: "text-primary", bg: "bg-gradient-to-r from-primary/80 to-primary/60", bgLight: "bg-primary/20" };
  if (priority >= 30) return { label: "Low", color: "text-blue-400", bg: "bg-gradient-to-r from-blue-400 to-blue-300", bgLight: "bg-blue-400/20" };
  return { label: "Minimal", color: "text-slate-400", bg: "bg-gradient-to-r from-slate-400 to-slate-300", bgLight: "bg-slate-400/20" };
}

export function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const normalizedType = note.type.toUpperCase() as keyof typeof typeConfig;
  const config = typeConfig[normalizedType] ?? typeConfig.NOTE;
  const Icon = config.icon;
  const priorityInfo = getPriorityInfo(note.priority);

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(note.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Priority Bar */}
            <div className={`h-1.5 ${priorityInfo.bg}`} style={{ width: `${note.priority}%` }} />

            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`${config.color} text-xs font-medium`}>
                    <Icon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${priorityInfo.bgLight} ${priorityInfo.color}`}>
                    <Zap className="h-3 w-3" />
                    {priorityInfo.label} ({note.priority})
                  </span>
                  {note.isPublic && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Globe className="h-3 w-3" />
                      Public
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold leading-tight">{note.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Summary */}
              {note.summary && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">AI Summary</p>
                  <p className="text-sm leading-relaxed">{note.summary}</p>
                </div>
              )}

              {/* Link */}
              {note.sourceUrl && (
                <a
                  href={note.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{note.sourceUrl}</span>
                </a>
              )}

              {/* File */}
              {note.fileName && (
                <div className="flex items-center gap-3 p-3 bg-zinc-500/10 rounded-lg">
                  <File className="h-6 w-6 text-zinc-500" />
                  <div>
                    <p className="font-medium text-sm">{note.fileName}</p>
                    {note.fileType && <p className="text-xs text-muted-foreground">{note.fileType}</p>}
                  </div>
                </div>
              )}

              {/* Full Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Content</p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>

              {/* Tags */}
              {Array.isArray(note.tags) && note.tags.filter(t => t !== "unprocessed").length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.filter(t => t !== "unprocessed").map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formattedDate} at {formattedTime}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                ID: {note.id.slice(0, 8)}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
