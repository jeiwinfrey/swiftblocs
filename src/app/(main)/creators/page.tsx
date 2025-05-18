"use client";

import { useState, useEffect } from "react";
import { CreatorCard } from "@/components/layout/creator-card";
import { CreatorPageSkeleton } from "@/components/layout/skeletons/creator-page-skeleton";
import { getCreatorsBasic, type Creator } from "@/services/supabase/creators";

export default function CreatorsPage() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreators() {
      try {
        const data = await getCreatorsBasic();
        
        // Sort creators by popularity (bookmarks + views count)
        const sortedCreators = [...data].sort((a, b) => {
          const popularityA = a.totalBookmarks + a.totalViews;
          const popularityB = b.totalBookmarks + b.totalViews;
          return popularityB - popularityA; // Descending order
        });
        
        setCreators(sortedCreators);
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError('Failed to load creators');
      } finally {
        setLoading(false);
      }
    }

    fetchCreators();
  }, []);

  return (
    <div className="container mx-auto px-1 overflow-y-auto overflow-x-hidden scrollbar-hide h-full">
      {error ? (
        <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-md text-center">
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            // Use the dedicated skeleton component
            <CreatorPageSkeleton />
          ) : creators.length > 0 ? (
            // Creator cards
            creators.map((creator) => (
              <CreatorCard
                key={creator.username}
                username={creator.username}
                bio={creator.bio}
                componentCount={creator.componentCount}
                totalViews={creator.totalViews}
                totalBookmarks={creator.totalBookmarks}
                onClick={() => console.log(`Navigate to ${creator.username}'s profile`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No creators found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
