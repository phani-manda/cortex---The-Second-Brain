"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NoteCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      <Card className="h-full border-border/40 bg-card/90 overflow-hidden">
        {/* Priority bar skeleton */}
        <div className="h-1 bg-gradient-to-r from-muted/50 to-muted/30 animate-pulse" />
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4 mt-3" />
        </CardHeader>
        <CardContent className="pt-0 pb-5 px-5 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-18 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-2.5 w-24 mt-2" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
