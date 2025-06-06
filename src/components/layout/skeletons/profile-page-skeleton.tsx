'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { ComponentCardSkeleton } from "./component-card-skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Profile Header Skeleton */}
      <div className="flex items-start gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      {/* Components Grid Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ComponentCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
