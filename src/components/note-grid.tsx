"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NoteCard, type Note } from "@/components/note-card";
import { NoteCardSkeleton } from "@/components/note-skeleton";
import { NoteModal } from "@/components/note-modal";
import {
  Search,
  FileText,
  Link2,
  Lightbulb,
  Layers,
  Brain,
  File,
  ArrowUpDown,
  Clock,
  TrendingUp,
} from "lucide-react";

interface NoteGridProps {
  refreshTrigger: number;
}

const filterOptions = [
  { value: "ALL", label: "All", icon: Layers },
  { value: "NOTE", label: "Notes", icon: FileText },
  { value: "LINK", label: "Links", icon: Link2 },
  { value: "INSIGHT", label: "Insights", icon: Lightbulb },
  { value: "FILE", label: "Files", icon: File },
];

const sortOptions = [
  { value: "date", label: "Recent", icon: Clock },
  { value: "priority", label: "Priority", icon: TrendingUp },
];

// Container animation for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Individual item animation
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function NoteGrid({ refreshTrigger }: NoteGridProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"date" | "priority">("priority");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleOpenNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedNote(null), 200);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (activeFilter !== "ALL") params.set("type", activeFilter);
      params.set("sort", sortBy);

      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, activeFilter, sortBy]);

  useEffect(() => {
    fetchNotes().then(() => {
      // Mark as loaded after first fetch for animation purposes
      setHasLoaded(true);
    });
  }, [fetchNotes, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleTogglePublic = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to toggle");
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (error) {
      console.error("Error toggling note:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your brain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <div className="flex gap-2 items-center">
            {/* Sort Toggle */}
            <div className="flex items-center gap-1 mr-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              {sortOptions.map((sort) => {
                const Icon = sort.icon;
                return (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sort.value as "date" | "priority")}
                    className="group"
                  >
                    <Badge
                      variant={sortBy === sort.value ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105 py-1 px-2 text-xs"
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {sort.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Type Filters */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className="group"
              >
                <Badge
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105 py-1.5 px-3"
                >
                  <Icon className="mr-1.5 h-3 w-3" />
                  {filter.label}
                </Badge>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Notes Grid */}
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} index={i} />
          ))}
        </motion.div>
      ) : notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            {debouncedQuery ? "No matching thoughts" : "Your brain is empty"}
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {debouncedQuery
              ? "Try a different search query"
              : "Capture your first thought above to get started"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6"
        >
          {notes.map((note, index) => (
            <motion.div 
              key={note.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NoteCard
                note={note}
                index={index}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
                onOpen={handleOpenNote}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Count */}
      {!loading && notes.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {notes.length} thought{notes.length !== 1 ? "s" : ""} in your brain
        </p>
      )}

      {/* Note Detail Modal */}
      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
