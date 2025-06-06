"use client";

import { ComponentCardSkeleton } from "./component-card-skeleton";

export function HomePageSkeleton() {
  // Create an array of tag sections to match the home page layout
  const tagSections = ['button', 'card', 'input', 'navigation'];
  
  return (
    <div className="container mx-auto pl-2 overflow-y-auto overflow-x-hidden">
      <div className="space-y-1">
        {tagSections.map((tagName) => (
          <section key={tagName} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-7 w-32 bg-secondary/30 animate-pulse rounded-md"></div>
              <div className="h-5 w-20 bg-secondary/30 animate-pulse rounded-md"></div>
            </div>
            
            <div className="relative">
              <div className="flex overflow-x-auto pb-2 -mx-4 px-2 space-x-4 scrollbar-hide">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64 sm:w-72">
                    <ComponentCardSkeleton />
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
