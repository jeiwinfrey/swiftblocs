import { Card } from "@/components/ui/card";

export function CreatorCardSkeleton() {
  return (
    <Card
      variant="inner"
      className="max-w-[400px] bg-background overflow-hidden rounded-md hover:shadow-md transition-shadow duration-200 min-h-[100px]"
    >
      <div className="p-4 h-full flex flex-col">
        {/* Creator Header */}
        <div className="flex items-center gap-4 mb-3">
          {/* Avatar skeleton */}
          <div className="size-16 rounded-full bg-secondary/30 animate-pulse" />
          
          <div className="flex-1">
            {/* Username skeleton */}
            <div className="h-6 w-24 bg-secondary/30 animate-pulse rounded-md mb-2" />
            {/* Bio skeleton - two lines */}
            <div className="h-4 w-full bg-secondary/30 animate-pulse rounded-md mb-1" />
            <div className="h-4 w-3/4 bg-secondary/30 animate-pulse rounded-md" />
          </div>
        </div>
        
        {/* Creator Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          {/* Components count skeleton */}
          <div className="flex items-center gap-2">
            <div className="size-4 bg-secondary/30 animate-pulse rounded-full" />
            <div className="h-4 w-24 bg-secondary/30 animate-pulse rounded-md" />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Views count skeleton */}
            <div className="flex items-center gap-1">
              <div className="size-4 bg-secondary/30 animate-pulse rounded-full" />
              <div className="h-4 w-10 bg-secondary/30 animate-pulse rounded-md" />
            </div>
            {/* Bookmarks count skeleton */}
            <div className="flex items-center gap-1">
              <div className="size-4 bg-secondary/30 animate-pulse rounded-full" />
              <div className="h-4 w-8 bg-secondary/30 animate-pulse rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
