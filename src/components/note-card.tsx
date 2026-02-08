"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Link2,
  Lightbulb,
  Trash2,
  Globe,
  GlobeLock,
  File,
  ExternalLink,
  Zap,
} from "lucide-react";

export type Note = {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  summary: string | null;
  isPublic: boolean;
  createdAt: string;
  priority: number;
  sourceUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
};

interface NoteCardProps {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string) => void;
  onOpen: (note: Note) => void;
}

const typeConfig = {
  NOTE: {
    icon: FileText,
    color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:shadow-zinc-500/20",
    label: "Note",
  },
  LINK: {
    icon: Link2,
    color: "bg-teal-500/15 text-teal-400 border-teal-500/30 hover:shadow-teal-500/20",
    label: "Link",
  },
  INSIGHT: {
    icon: Lightbulb,
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:shadow-amber-500/20",
    label: "Insight",
  },
  FILE: {
    icon: File,
    color: "bg-slate-500/15 text-slate-400 border-slate-500/30 hover:shadow-slate-500/20",
    label: "File",
  },
};

function getPriorityInfo(priority: number) {
  if (priority >= 90) return { label: "Critical", color: "text-rose-400", bg: "from-rose-500 via-red-500 to-orange-500", glow: true };
  if (priority >= 70) return { label: "High", color: "text-orange-400", bg: "from-orange-500 to-amber-500", glow: false };
  if (priority >= 50) return { label: "Medium", color: "text-zinc-400", bg: "from-zinc-500 to-slate-500", glow: false };
  if (priority >= 30) return { label: "Low", color: "text-slate-400", bg: "from-slate-400 to-zinc-400", glow: false };
  return { label: "Minimal", color: "text-slate-500", bg: "from-slate-500 to-slate-400", glow: false };
}

export function NoteCard({ note, index, onDelete, onTogglePublic, onOpen }: NoteCardProps) {
  const normalizedType = note.type.toUpperCase() as keyof typeof typeConfig;
  const config = typeConfig[normalizedType] ?? typeConfig.NOTE;
  const Icon = config.icon;
  const priorityInfo = getPriorityInfo(note.priority ?? 50);

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    onOpen(note);
  };

  return (
    <motion.div
      layout
      whileHover={{ 
        scale: 1.03,
        y: -8,
        transition: { duration: 0.25, ease: "easeOut", type: "spring", stiffness: 400, damping: 20 }
      }}
      whileTap={{ scale: 0.97 }}
      className="group cursor-pointer h-full will-change-transform"
      onClick={handleCardClick}
    >
      <Card className="h-full border-zinc-500/20 bg-card/60 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-500/20 hover:border-zinc-400/40 relative overflow-hidden group-hover:bg-card/80">
        {/* Gradient border glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-zinc-500/0 via-zinc-400/0 to-zinc-500/0 opacity-0 group-hover:opacity-100 group-hover:from-zinc-500/10 group-hover:via-zinc-400/10 group-hover:to-zinc-500/10 transition-opacity duration-500 pointer-events-none" />
        {/* Priority Indicator Bar - animated gradient */}
        <motion.div 
          className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${priorityInfo.bg} ${priorityInfo.glow ? 'shadow-[0_0_10px_rgba(236,72,153,0.5)]' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${note.priority ?? 50}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ minWidth: "10px" }}
        />
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${config.color} text-xs font-medium transition-all duration-300 hover:shadow-lg`}
              >
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              {(note.priority ?? 50) >= 70 && (
                <motion.span 
                  className={`flex items-center gap-0.5 text-[10px] ${priorityInfo.color}`} 
                  title={`Priority: ${note.priority ?? 50}`}
                  animate={priorityInfo.glow ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="h-3 w-3" />
                  {priorityInfo.label}
                </motion.span>
              )}
            </div>
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ opacity: 0 }}
            >
              <motion.button
                onClick={() => onTogglePublic(note.id)}
                className="p-1.5 rounded-md hover:bg-zinc-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title={note.isPublic ? "Make private" : "Make public"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {note.isPublic ? (
                  <Globe className="h-3.5 w-3.5 text-zinc-400" />
                ) : (
                  <GlobeLock className="h-3.5 w-3.5 text-muted-foreground hover:text-zinc-400" />
                )}
              </motion.button>
              <motion.button
                onClick={() => onDelete(note.id)}
                className="p-1.5 rounded-md hover:bg-destructive/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Delete note"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </motion.button>
            </motion.div>
          </div>
          <h3 className="font-semibold text-sm leading-tight mt-2">
            {note.title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0 pb-5 px-5 space-y-3">
          {note.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {note.summary}
            </p>
          )}
          {note.sourceUrl && (
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{note.sourceUrl}</span>
            </a>
          )}
          {note.fileName && (
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <File className="h-3 w-3" />
              {note.fileName}
            </p>
          )}
          <p className="text-xs text-muted-foreground/70 line-clamp-3 leading-relaxed">
            {note.content}
          </p>
          {Array.isArray(note.tags) && note.tags.length > 0 && note.tags[0] !== "unprocessed" && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] font-normal px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground">
              {formattedDate}
            </span>
            {note.isPublic && (
              <span className="text-[10px] text-primary flex items-center gap-1">
                <Globe className="h-2.5 w-2.5" />
                Public
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
