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
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "Note",
  },
  LINK: {
    icon: Link2,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    label: "Link",
  },
  INSIGHT: {
    icon: Lightbulb,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    label: "Insight",
  },
  FILE: {
    icon: File,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    label: "File",
  },
};

function getPriorityInfo(priority: number) {
  if (priority >= 90) return { label: "Critical", color: "text-red-500", bg: "from-red-500 to-red-400" };
  if (priority >= 70) return { label: "High", color: "text-orange-500", bg: "from-orange-500 to-orange-400" };
  if (priority >= 50) return { label: "Medium", color: "text-primary", bg: "from-primary/80 to-primary/60" };
  if (priority >= 30) return { label: "Low", color: "text-blue-400", bg: "from-blue-400 to-blue-300" };
  return { label: "Minimal", color: "text-slate-400", bg: "from-slate-400 to-slate-300" };
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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <Card className="h-full border-border/40 bg-card/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 relative overflow-hidden">
        {/* Priority Indicator Bar - subtle gradient */}
        <div 
          className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${priorityInfo.bg} opacity-80 transition-all`}
          style={{ width: `${note.priority ?? 50}%`, minWidth: "10px" }}
        />
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${config.color} text-xs font-medium`}
              >
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              {(note.priority ?? 50) >= 70 && (
                <span className={`flex items-center gap-0.5 text-[10px] ${priorityInfo.color}`} title={`Priority: ${note.priority ?? 50}`}>
                  <Zap className="h-3 w-3" />
                  {priorityInfo.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onTogglePublic(note.id)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title={note.isPublic ? "Make private" : "Make public"}
              >
                {note.isPublic ? (
                  <Globe className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <GlobeLock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                title="Delete note"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
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
            <p className="flex items-center gap-1.5 text-xs text-purple-500">
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
