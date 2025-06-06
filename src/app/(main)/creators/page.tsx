"use client";

import { useState, useEffect } from "react";
import { CreatorCard } from "@/components/layout/creator-card";
import { CreatorPageSkeleton } from "@/components/layout/skeletons/creator-page-skeleton";
import { getCreatorsBasic, type Creator } from "@/services/supabase/creators";
import { Component, getComponents } from "@/services/supabase/components";
import { ProfileView } from "@/components/layout/profile-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatorsPage() {
  // Creators list state
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Selected creator profile state
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [creatorComponents, setCreatorComponents] = useState<Component[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch creators list
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
  
  // Fetch selected creator's components
  useEffect(() => {
    if (!selectedCreator) return;
    
    async function fetchCreatorComponents() {
      setLoadingProfile(true);
      try {
        const allComponents = await getComponents();
        const filteredComponents = allComponents.filter(
          component => component.author === selectedCreator
        );
        setCreatorComponents(filteredComponents);
      } catch (err) {
        console.error(`Error fetching components for ${selectedCreator}:`, err);
      } finally {
        setLoadingProfile(false);
      }
    }
    
    fetchCreatorComponents();
  }, [selectedCreator]);
  
  // Handle selecting a creator
  const handleCreatorClick = (username: string) => {
    setSelectedCreator(username);
  };
  
  // Handle going back to creators list
  const handleBackClick = () => {
    setSelectedCreator(null);
    setCreatorComponents([]);
  };

  // If a creator is selected, show their profile
  if (selectedCreator) {
    const creator = creators.find(c => c.username === selectedCreator);
    
    return (
      <div className="container mx-auto px-1 overflow-y-auto overflow-x-hidden scrollbar-hide h-full">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to creators
          </Button>
        </div>
        
        {loadingProfile ? (
          <CreatorPageSkeleton />
        ) : (
          <ProfileView
            displayName={selectedCreator}
            username={selectedCreator}
            bio={creator?.bio || 'SwiftBlocs component creator'}
            avatarUrl={undefined}
            components={creatorComponents}
          />
        )}
      </div>
    );
  }
  
  // Otherwise show the creators list
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
                onClick={() => handleCreatorClick(creator.username)}
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
