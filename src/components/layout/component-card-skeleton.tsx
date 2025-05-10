"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ComponentCardSkeleton() {
  return (
    <Card variant="inner" className="max-w-[400px] bg-background overflow-hidden rounded-md">
      {/* Image skeleton */}
      <Skeleton className="w-full h-40 rounded-sm" />
      
      {/* Content skeleton */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          {/* Avatar and title */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
