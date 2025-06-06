"use client";

import { ComponentCardSkeleton } from "./component-card-skeleton";

export function ComponentPageSkeleton() {
  return (
    <div className="container mx-auto px-1 overflow-y-auto overflow-x-hidden scrollbar-hide h-full">    
      {/* Grid layout skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <ComponentCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}