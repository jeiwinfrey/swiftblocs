"use client";

import { ComponentCardSkeleton } from "./component-card-skeleton";

export function HomePageSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <ComponentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
