"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Custom skeleton with better visibility in light mode
function CustomSkeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export function ComponentCardSkeleton() {
  return (
    <Card variant="inner" className="max-w-[400px] bg-background overflow-hidden rounded-md">
      {/* Image skeleton */}
      <CustomSkeleton className="w-full h-40 rounded-sm" />
      
      {/* Content skeleton */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          {/* Avatar and title */}
          <div className="flex items-center gap-2">
            <CustomSkeleton className="size-8 rounded-full" />
            <CustomSkeleton className="h-4 w-24" />
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CustomSkeleton className="h-3 w-3" />
              <CustomSkeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center gap-1">
              <CustomSkeleton className="h-3 w-3" />
              <CustomSkeleton className="h-3 w-8" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
